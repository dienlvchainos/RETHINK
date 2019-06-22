import React from 'react'
import { TouchableWithoutFeedback, View, ScrollView, FlatList, TextInput, Keyboard, BackHandler } from 'react-native'
import BaseScreen from '../baseScreen'
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';
import styles from './styles';
import { scale } from '../../utils/scalingUtils';
import Header from "../../components/header";
import { Icon } from 'react-native-elements';
import { buttonColor } from '../../utils/styleUtils';
import StandardText from '../../components/standardText';
import SimpleButton from '../../components/simpleButton';
import UnderlineText from '../../components/underlineText';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import { _setStorage } from "../../utils/storeUtils";
import { _actionSetUser } from '../../actions/userAction';
import moment from 'moment';
import noticeUtils from '../../utils/noticeUtils';
import { _findInArray, _totalInArray, _formatMoney, _asyncForEach, _shortText } from '../../helpers';
import GroupByDate from './groupByDate';
const MONTHS = require('./months.json');
const SelectedAll = {
    id: -1,
    name: '같이보기'
}
class Tuition extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: false,
            rangeTime: {
                fromYear: parseInt(moment().format('YYYY')),
                fromMonth: parseInt(moment().format('MM')),
                toYear: parseInt(moment().format('YYYY')),
                toMonth: parseInt(moment().format('MM'))
            },
            isPickDate: '_from',
            isSelectChildModalVisible: false,
            isPickTimeVisible: false,
            childSelected: SelectedAll,
            childs: props.child.list.concat([SelectedAll]),
            tuitions: [],
            tuitionDates: []
        }
    }

    _rightAction() {
        this.setState({ isSelectChildModalVisible: true })
    }

    async _preDatetime() {
        if (this.state.tuitionDates.length == 0) { // no view by date
            let rangeTime = this.state.rangeTime;
            let { fromMonth, fromYear } = rangeTime;
            let year = fromMonth == 1 ? fromYear - 1 : fromYear;
            let month = month == 1 ? fromMonth = 12 : fromMonth - 1
            this.setState({ rangeTime: { ...rangeTime, fromMonth: month, fromYear: year } })

            let childId = this.state.childSelected.id;
            if (childId == -1) {
                this._getTuitionForAll(month, year);
            } else {
                let _tuition = await this._getTuitionData(childId, month, year);
                this.setState({
                    tuitions: [].concat(_tuition)
                })
            }
        }
    }

    async _nextDatetime() {
        if (this.state.tuitionDates.length == 0) { // no view by date
            let rangeTime = this.state.rangeTime;
            let { fromMonth, fromYear } = rangeTime;
            let year = fromMonth == 12 ? fromYear + 1 : fromYear;
            let month = fromMonth == 12 ? fromMonth = 1 : fromMonth + 1
            this.setState({ rangeTime: { ...rangeTime, fromMonth: month, fromYear: year } })

            let childId = this.state.childSelected.id;
            if (childId == -1) {
                this._getTuitionForAll(month, year);
            } else {
                let _tuition = await this._getTuitionData(childId, month, year);
                this.setState({
                    tuitions: [].concat(_tuition)
                })
            }
        }
    }

    _preDatetimePopup() {
        let { rangeTime, isPickDate } = this.state;
        if (isPickDate == '_from') {
            rangeTime.fromYear = parseInt(rangeTime.fromYear) - 1;
        } else rangeTime.toYear = parseInt(rangeTime.toYear) - 1;
        this.setState({ rangeTime })
    }

    _nextDatetimePopup() {
        let { rangeTime, isPickDate } = this.state;
        if (isPickDate == '_from') {
            rangeTime.fromYear = parseInt(rangeTime.fromYear) + 1;
        } else rangeTime.toYear = parseInt(rangeTime.toYear) + 1;
        this.setState({ rangeTime })
    }

    _getTuitionData(childId, _month, _year) {
        return new Promise(async (resolve) => {
            const userToken = this.props.user.apiKey;
            let _params = {
                child_id: childId,
                month: parseInt(_month) || parseInt(this.state.rangeTime.fromMonth),
                year: parseInt(_year) || parseInt(this.state.rangeTime.fromYear)
            }
            let tuitionRespon = await sf.getServices('TuitionService').getByMonth(_params, userToken);
            if (tuitionRespon && tuitionRespon.status == 200 && !tuitionRespon.data.error) {
                let _data = {};
                let _total = 0;
                tuitionRespon.data.forEach((t) => {
                    if (!_data[`${t.subject} - ${t.name}`]) {
                        _total += t.fee;
                        _data[`${t.subject} - ${t.name}`] = [t];
                    } else {
                        _total -= _data[`${t.subject} - ${t.name}`][0].fee
                        _total += t.fee;
                        _data[`${t.subject} - ${t.name}`] = [t];
                    }
                })
                let _tuition = {
                    child_name: _findInArray(this.state.childs, 'id', childId).name,
                    child_id: childId,
                    _data,
                    _total
                }
                resolve(_tuition);
            } else {
                if (tuitionRespon.status == 422) {
                    let errKeys = Object.keys(tuitionRespon.data);
                    let msgError = '';
                    errKeys.forEach((err) => {
                        msgError += tuitionRespon.data[err][0] + ', ';
                    })
                    return noticeUtils.inform(msgError);
                } else return noticeUtils.inform(noticeUtils.message.errorServer)
            }
        })
    }

    _getDataCustomDate(childId = this.state.childs[0].id, from, to) {
        return new Promise(async (resolve) => {
            const userToken = this.props.user.apiKey;
            let _params = {
                child_id: childId,
                from,
                to
            }
            let respon = await sf.getServices('TuitionService').getByRange(_params, userToken);
            if (respon && respon.status == 200 && respon.data) {
                let _data = {}, _times = {};
                await _asyncForEach(respon.data, async (tb) => {
                    if (!_data[`${tb.year}-${tb.month}`]) {
                        _data[`${tb.year}-${tb.month}`] = {};
                        _data[`${tb.year}-${tb.month}`]['_data'] = {};
                        _data[`${tb.year}-${tb.month}`]['_total'] = tb.fee || 0;
                        _data[`${tb.year}-${tb.month}`]['_data'][`${tb.subject} - ${tb.name}`] = [tb]
                    } else {
                        if (!_data[`${tb.year}-${tb.month}`]['_data'][`${tb.subject} - ${tb.name}`]) {
                            _data[`${tb.year}-${tb.month}`]['_total'] += tb.fee
                            _data[`${tb.year}-${tb.month}`]['_data'][`${tb.subject} - ${tb.name}`] = [tb]
                        } else {
                            _data[`${tb.year}-${tb.month}`]['_total'] -= _data[`${tb.year}-${tb.month}`]['_data'][`${tb.subject} - ${tb.name}`][0].fee;
                            _data[`${tb.year}-${tb.month}`]['_total'] += tb.fee;
                            _data[`${tb.year}-${tb.month}`]['_data'][`${tb.subject} - ${tb.name}`] = [tb]

                        }
                    }
                    if (_times[`${tb.subject} - ${tb.name}`]) {
                        if (_times[`${tb.subject} - ${tb.name}`]._date == `${tb.year}-${tb.month}`) {
                            _times[`${tb.subject} - ${tb.name}`] = {
                                _times: 1,
                                _total: tb.fee,
                                _date: `${tb.year}-${tb.month}`
                            }
                        } else {
                            _times[`${tb.subject} - ${tb.name}`] = {
                                _times: _times[`${tb.subject} - ${tb.name}`]._times + 1,
                                _total: _times[`${tb.subject} - ${tb.name}`]._total + tb.fee,
                                _date: `${tb.year}-${tb.month}`
                            }
                        }
                    } else {
                        _times[`${tb.subject} - ${tb.name}`] = {
                            _times: 1,
                            _total: tb.fee,
                            _date: `${tb.year}-${tb.month}`
                        };
                    }
                })
                let _result = {
                    child_name: _findInArray(this.state.childs, 'id', childId).name,
                    child_id: childId,
                    _data,
                    _times
                }
                resolve(_result);
            }
        });
    }

    async _getTuitionForAll(month, year) {
        let _tuitions = [];
        if (this.state.tuitionDates.length > 0) { // view by date
            let { rangeTime } = this.state;
            let from = moment().set("month", parseInt(rangeTime.fromMonth) - 1).set('year', parseInt(rangeTime.fromYear)).startOf('month').format('DD-MM-YYYY');
            let to = moment().set("month", parseInt(rangeTime.toMonth) - 1).set('year', parseInt(rangeTime.toYear)).endOf('month').format('DD-MM-YYYY');
            await _asyncForEach(this.props.child.list, async (child) => {
                let _tuition = await this._getDataCustomDate(child.id, from, to);
                _tuitions.push(_tuition);
            })
            this.setState({ tuitionDates: _tuitions })
        } else {

            await _asyncForEach(this.props.child.list, async (child) => {
                let _tuition = await this._getTuitionData(child.id, month, year);
                _tuitions.push(_tuition);
            })
            this.setState({ tuitions: _tuitions })
        }
    }

    async _getTuitionForAll1() {
        let _tuitions = [];
        let { rangeTime } = this.state;
        let from = moment().set("month", parseInt(rangeTime.fromMonth) - 1).set('year', parseInt(rangeTime.fromYear)).startOf('month').format('DD-MM-YYYY');
        let to = moment().set("month", parseInt(rangeTime.toMonth) - 1).set('year', parseInt(rangeTime.toYear)).endOf('month').format('DD-MM-YYYY');
        await _asyncForEach(this.props.child.list, async (child) => {
            let _tuition = await this._getDataCustomDate(child.id, from, to);
            _tuitions.push(_tuition);
        })
        this.setState({ tuitionDates: _tuitions })
    }

    async _getTuitionForAll2(month, year) {
        let _tuitions = [];
        await _asyncForEach(this.props.child.list, async (child) => {
            let _tuition = await this._getTuitionData(child.id, month, year);
            _tuitions.push(_tuition);
        })
        this.setState({ tuitions: _tuitions })
    }

    _renderSelectChild() {
        return this.state.childs.map((c, index) => (
            <TouchableWithoutFeedback key={c.id} onPress={this._switchChild.bind(this, c.id)}>
                <View style={styles.itemSelectChild}>
                    <StandardText title regular style={{ color: c.color }}>{Number(index) + 1}. {c.name}</StandardText>
                </View>
            </TouchableWithoutFeedback>
        ))
    }

    _renderTuitionItem({ item }) {
        return <View style={{ marginBottom: scale(10) }}>
            <View style={styles.childTitle}>
                <UnderlineText style={{ alignSelf: 'center' }}><StandardText large>{item.child_name}</StandardText></UnderlineText>
                <StandardText style={{ marginTop: scale(10) }} bold>{this.state.rangeTime.fromYear}년 {this.state.rangeTime.fromMonth}월 교육비</StandardText>
            </View>
            <View style={styles.infoTuition}>
                <View style={styles.itemInfo}>
                    <StandardText>총합</StandardText>
                    <StandardText><StandardText bold>{_formatMoney(item._total)}</StandardText> 원</StandardText>
                </View>
                {Object.keys(item._data).map((_key) => {
                    let _subject = item._data[_key];
                    return <View key={_key} style={styles.itemInfo}>
                        <StandardText>{_shortText(_key, 35)}</StandardText>
                        <StandardText><StandardText bold>{_formatMoney(_subject[0].fee)}</StandardText> 원</StandardText>
                    </View>
                })}
            </View>
        </View>
    }

    _renderTuitionDate({ item }) {
        if (item) {
            return <View key={item.child_id} style={styles.viewByDate}>
                <View style={styles.viewChildByDate}>
                    <UnderlineText style={{ alignSelf: 'center' }}><StandardText large>{item.child_name}</StandardText></UnderlineText>
                </View>
                <View style={styles.infoHeaderTuition}>
                    <View style={styles.headerTotal}>
                        <StandardText>총합</StandardText>
                        <StandardText>횟수</StandardText>
                        <StandardText>합계</StandardText>
                    </View>
                    {Object.keys(item._times).map((tKey) => {
                        return <View key={tKey} style={styles.itemHeaderTuition}>
                            <StandardText style={{ width: '45%' }}>{_shortText(tKey, 19)}</StandardText>
                            <StandardText>{item._times[tKey]._times}</StandardText>
                            <StandardText style={{ width: '45%', textAlign: 'right' }}><StandardText bold>{_formatMoney(item._times[tKey]._total)}</StandardText> 원</StandardText>
                        </View>
                    })}
                </View>
                {Object.keys(item._data).map((dKey) => {
                    return <GroupByDate key={dKey} data={item._data[dKey]._data} title={`${dKey.split('-')[0]}년 ${dKey.split('-')[1]}월 교육비`} total={item._data[dKey]._total} />
                })}
            </View>
        }
        return null;
    }

    async _switchChild(childId) {
        this.setState({
            childSelected: _findInArray(this.state.childs, 'id', childId),
            isSelectChildModalVisible: false
        })
        if (childId == -1) {
            this.setState({ isHandling: true });
            await this._getTuitionForAll();
            this.setState({ isHandling: false });
        } else {
            if (this.state.tuitionDates.length > 0) {
                // group by date
                let { rangeTime } = this.state;
                let from = moment().set("month", parseInt(rangeTime.fromMonth) - 1).set('year', parseInt(rangeTime.fromYear)).startOf('month').format('DD-MM-YYYY');
                let to = moment().set("month", parseInt(rangeTime.toMonth) - 1).set('year', parseInt(rangeTime.toYear)).endOf('month').format('DD-MM-YYYY');
                let _tuition = await this._getDataCustomDate(childId, from, to);
                this.setState({ tuitionDates: [_tuition] })
            } else {
                let _tuition = await this._getTuitionData(childId);
                this.setState({ tuitions: [].concat(_tuition) })
            }
        }
    }

    _validFilterDate(rangeTime) {
        return new Promise((resolve) => {
            if (!isNaN(rangeTime.fromMonth) && !isNaN(rangeTime.fromYear) && !isNaN(rangeTime.toMonth) && !isNaN(rangeTime.toYear)) {
                if (rangeTime.fromYear < rangeTime.toYear) {
                    return resolve();
                } else if (rangeTime.fromYear == rangeTime.toYear && rangeTime.fromMonth <= rangeTime.toMonth) {
                    return resolve();
                } else return noticeUtils.inform(noticeUtils.message.invalidDateRange)
            } else return noticeUtils.inform(noticeUtils.message.invalidDateRange)
        });
    }

    async _doFilterByDate() {
        let { rangeTime, childSelected } = this.state;
        await this._validFilterDate(rangeTime);

        this.setState({ isHandling: true, isPickTimeVisible: false });
        this._tempMonth = null;
        this._tempYear = null
        if (rangeTime.fromMonth == rangeTime.toMonth && rangeTime.fromYear == rangeTime.toYear) {
            if (childSelected.id == -1) {
                this._getTuitionForAll2();
                this.setState({ tuitionDates: [], isHandling: false })
            } else {
                let _tuition = await this._getTuitionData(childSelected.id, rangeTime.fromMonth, rangeTime.fromYear);
                this.setState({ tuitionDates: [], tuitions: [].concat(_tuition), isHandling: false })
            }
        } else {
            let from = moment().set("month", parseInt(rangeTime.fromMonth) - 1).set('year', parseInt(rangeTime.fromYear)).startOf('month').format('DD-MM-YYYY');
            let to = moment().set("month", parseInt(rangeTime.toMonth) - 1).set('year', parseInt(rangeTime.toYear)).endOf('month').format('DD-MM-YYYY');
            if (childSelected.id == -1) {
                await this._getTuitionForAll1();
                this.setState({ isHandling: false })
            } else {
                let _tuitionOfChild = await this._getDataCustomDate(childSelected.id, from, to);
                this.setState({ tuitionDates: [_tuitionOfChild], isHandling: false });
            }
        }
    }

    _initSetMonth(_type) {
        this.setState({ isPickDate: _type });
        Keyboard.dismiss()
    }

    _initSetYear(_type) {
        this.setState({ isPickDate: _type });
    }

    _setDateTime(_type, textTime) {
        let { rangeTime } = this.state;
        rangeTime[_type] = textTime;
        this.setState({ rangeTime });
    }

    _pickMonthFilter(_month) {
        let { rangeTime, isPickDate } = this.state;
        if (isPickDate == '_from') {
            rangeTime.fromMonth = _month;
        } else {
            rangeTime.toMonth = _month;
        }
        this.setState({ rangeTime });
    }

    _showPopupPickDate = () => {
        Keyboard.dismiss();
        // pre handle FROM and TO
        let { rangeTime } = this.state;
        if (rangeTime.fromYear > rangeTime.toYear) {
            rangeTime.toYear = rangeTime.fromYear;
            rangeTime.toMonth = rangeTime.fromMonth + 1;
        } else if (rangeTime.fromYear == rangeTime.toYear) {
            if (rangeTime.fromMonth > rangeTime.toMonth) {
                rangeTime.toMonth = rangeTime.fromMonth + 1;
            }
        }
        this._tempMonth = rangeTime.fromMonth;
        this._tempYear = rangeTime.fromYear;
        this.setState({ rangeTime }, () => this.setState({ isPickTimeVisible: true }));
    }

    _onCloseModalSelectChild = () => this.setState({ isSelectChildModalVisible: false })

    _onCloseModalPickDate = () => {
        if (this._tempMonth || this._tempYear) {
            let { rangeTime, isPickDate } = this.state;
            if (isPickDate == '_from') {
                this.setState({ rangeTime: { ...rangeTime, fromMonth: this._tempMonth, fromYear: this._tempYear } });
            } else this.setState({ rangeTime: { ...rangeTime, toMonth: this._tempMonth, toYear: this._tempYear } });
        }
        this.setState({ isPickTimeVisible: false })
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        let childId = this.state.childs[0].id;
        if (childId != -1) {
            let _tuition = await this._getTuitionData(childId);
            this.setState({
                childSelected: this.state.childs[0],
                tuitions: [].concat(_tuition)
            })
        } else noticeUtils.inform(noticeUtils.message.needCreateChild);

    }

    render() {
        const { isHandling, tuitionDates, rangeTime, isPickDate } = this.state;
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}
                    rightButtonText={this.state.childSelected.name}
                    rightButtonOnpress={this._rightAction.bind(this)}
                >교육비</Header>
                <View style={styles.content}>
                    <View style={styles.viewDatetime}>
                        <TouchableWithoutFeedback onPress={this._preDatetime.bind(this)}>
                            <View style={styles.btnDatetime}>
                                <Icon name='chevron-left'
                                    type='material-community'
                                    color='#000'
                                    size={scale(26)} />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this._showPopupPickDate.bind(this)}>
                            <View>
                                {tuitionDates.length > 0
                                    ? <StandardText title>
                                        {this.state.rangeTime.fromYear}년 {parseInt(this.state.rangeTime.fromMonth)}월 ~ {this.state.rangeTime.toYear}년 {parseInt(this.state.rangeTime.toMonth)}월
                                </StandardText>
                                    : <StandardText title>{this.state.rangeTime.fromYear}년 {this.state.rangeTime.fromMonth}월</StandardText>
                                }

                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this._nextDatetime.bind(this)}>
                            <View style={[styles.btnDatetime, { justifyContent: 'flex-end' }]}>
                                <Icon name='chevron-right'
                                    type='material-community'
                                    color='#000'
                                    size={scale(26)} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {this.state.tuitionDates.length > 0 // group by date
                        ? <FlatList
                            style={{ width: '100%' }}
                            extraData={this.state}
                            data={this.state.tuitionDates}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={this._renderTuitionDate.bind(this)} />
                        : <FlatList
                            style={{ width: '100%' }}
                            extraData={this.state}
                            data={this.state.tuitions}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={this._renderTuitionItem.bind(this)} />
                    }
                </View>
                <Modal
                    isOpen={this.state.isSelectChildModalVisible}
                    backdropOpacity={0.5}
                    style={[styles.modalSelectChild]}
                    position="center"
                    ref={"modalSelectChild"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalSelectChild.bind(this)}>
                    <View style={{ flex: 1 }}>
                        <ScrollView>
                            {this._renderSelectChild()}
                        </ScrollView>
                    </View>
                </Modal>
                <Modal
                    isOpen={this.state.isPickTimeVisible}
                    backdropOpacity={0.5}
                    style={[styles.modalPickDate]}
                    position="center"
                    ref={"modalPickDate"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalPickDate.bind(this)}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.contentFilterTime}>
                                <View style={styles.viewInputDate}>
                                    <View style={[styles.inRow, isPickDate == '_from' ? styles.inRowActive : styles.inRowInactive]}>
                                        <TextInput style={styles.inputDate}
                                            ref={refYear => this.fromYear = refYear}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'fromYear')}
                                            value={rangeTime.fromYear.toString()}
                                            keyboardType="numeric"
                                            onFocus={this._initSetYear.bind(this, '_from')} />
                                        <StandardText>년</StandardText>
                                    </View>
                                    <View style={[styles.inRow, isPickDate == '_from' ? styles.inRowActive : styles.inRowInactive]}>
                                        <TextInput style={styles.inputDate}
                                            ref={refMonth => this.fromMonth = refMonth}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'fromMonth')}
                                            value={rangeTime.fromMonth.toString()}
                                            keyboardType="numeric"
                                            onFocus={this._initSetMonth.bind(this, '_from')} />
                                        <StandardText>월</StandardText>
                                    </View>
                                    <StandardText style={{ flex: 1, textAlign: 'center' }}> ~ </StandardText>
                                    <View style={[styles.inRow, isPickDate == '_to' ? styles.inRowActive : styles.inRowInactive]}>
                                        <TextInput style={styles.inputDate}
                                            ref={refYear => this.toYear = refYear}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'toYear')}
                                            value={rangeTime.toYear.toString()}
                                            keyboardType="numeric"
                                            onFocus={this._initSetYear.bind(this, '_to')} />
                                        <StandardText>년</StandardText>
                                    </View>
                                    <View style={[styles.inRow, isPickDate == '_to' ? styles.inRowActive : styles.inRowInactive]}>
                                        <TextInput style={styles.inputDate}
                                            ref={refMonth => this.toMonth = refMonth}
                                            underlineColorAndroid="transparent"
                                            onChangeText={this._setDateTime.bind(this, 'toMonth')}
                                            value={rangeTime.toMonth.toString()}
                                            keyboardType="numeric"
                                            onFocus={this._initSetMonth.bind(this, '_to')} />
                                        <StandardText>월</StandardText>
                                    </View>
                                </View>
                                <View style={styles.viewDatetimePopup}>
                                    <TouchableWithoutFeedback onPress={this._preDatetimePopup.bind(this)}>
                                        <View style={styles.btnDatetime}>
                                            <Icon name='chevron-left'
                                                type='material-community'
                                                color='#000'
                                                size={scale(26)} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    {isPickDate == '_from'
                                        ? <StandardText title>{rangeTime.fromYear}년</StandardText>
                                        : <StandardText title>{rangeTime.toYear}년</StandardText>
                                    }
                                    <TouchableWithoutFeedback onPress={this._nextDatetimePopup.bind(this)}>
                                        <View style={[styles.btnDatetime, { justifyContent: 'flex-end' }]}>
                                            <Icon name='chevron-right'
                                                type='material-community'
                                                color='#000'
                                                size={scale(26)} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={styles.viewListMonth}>
                                    {MONTHS.map((m) => (
                                        <TouchableWithoutFeedback key={m.id} onPress={this._pickMonthFilter.bind(this, m.id)}>
                                            <View style={[styles.itemMonth]}>
                                                <StandardText style={isPickDate == '_from' ? rangeTime.fromMonth == m.id ? styles.activeMonth : {} : rangeTime.toMonth == m.id ? styles.activeMonth : {}}>{m.title}</StandardText>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.actionFilter}>
                                <SimpleButton
                                    onPress={this._doFilterByDate.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnLeftModal}
                                    textStyle={{}}>적용</SimpleButton>
                                <SimpleButton
                                    onPress={this._onCloseModalPickDate.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnModal}
                                    textStyle={{}}>취소</SimpleButton>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                {isHandling && <LoadingScreen title="가공..." />}
            </View>
        )
    }

    onBackButtonPressAndroid() {
        if (this.state.isPickTimeVisible || this.state.isSelectChildModalVisible) {
            this.setState({
                isPickTimeVisible: false,
                isSelectChildModalVisible: false
            });
            return true
        } else return false;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
    }
}

function bindAction(dispatch) {
    return {
        _actionSetUser: (userInfo, userToken) => dispatch(_actionSetUser(userInfo, userToken))
    };
}

const mapStateToProps = (state) => ({
    user: state.user,
    child: state.child
});

export default connect(mapStateToProps, bindAction)(Tuition);