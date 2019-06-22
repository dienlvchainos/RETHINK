import React from 'react'
import { TouchableWithoutFeedback, View, ScrollView, Keyboard, TextInput, BackHandler } from 'react-native'
import BaseScreen from '../baseScreen'
import Modal from 'react-native-modalbox';
import { PieChart } from 'react-native-svg-charts'
import StackedBarChart from './stackedBarChart';
import { Text } from 'react-native-svg';
import { VictoryBar, VictoryLabel, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native";
import { connect } from 'react-redux';
import styles from './styles';
import { scale } from '../../utils/scalingUtils';
import Header from "../../components/header";
import { Icon } from 'react-native-elements';
import { buttonColor } from '../../utils/styleUtils';
import StandardText from '../../components/standardText';
import CustomInput from '../../components/customInput';
import SimpleButton from '../../components/simpleButton';
import UnderlineText from '../../components/underlineText';
import sf from '../../libs/serviceFactory';
import LoadingScreen from '../../components/loadingScreen';
import constants from '../../constants';
import { _setStorage } from "../../utils/storeUtils";
import { _actionSetUser } from '../../actions/userAction';
import moment from 'moment';
import noticeUtils from '../../utils/noticeUtils';
import { _findInArray, _formatPercent, _asyncForEach, _randomColor, _formatMoney } from '../../helpers';
import StackBarChart from '../../components/stackBarChart';
import { Labels, ColLabels } from './customLabel';
const MONTHS = require('../tuition/months.json');

class Report extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: true,
            childs: props.child.list,
            childSelected: props.child.list[0],
            pieData: [],
            colData: [],
            stackData: null,
            rangeTime: {
                fromYear: parseInt(moment().format('YYYY')),
                fromMonth: parseInt(moment().format('MM')),
                toYear: parseInt(moment().format('YYYY')),
                toMonth: parseInt(moment().format('MM'))
            },
            isSelectChildModalVisible: false,
            isPickTimeVisible: false,
            isPickDate: '_from' // _from || _to
        }
    }

    _rightAction() {
        this.setState({ isSelectChildModalVisible: true })
    }

    async _switchChild(childId) {
        this._totalFee = 0;
        this.setState({
            childSelected: _findInArray(this.state.childs, 'id', childId),
            isSelectChildModalVisible: false,
            isHandling: true
        })
        let { rangeTime } = this.state;
        let from = moment().set("month", rangeTime.fromMonth - 1).set('year', rangeTime.fromYear).startOf('month').format('DD-MM-YYYY');
        let to = moment().set("month", rangeTime.toMonth - 1).set('year', rangeTime.toYear).endOf('month').format('DD-MM-YYYY');
        if (this.state.stackData) {
            this.setState({ stackData: {} })
            await this._getDataCustomDate(childId, from, to);
        } else {
            await this._getData(childId, from, to);
        }
        setTimeout(() => {
            this.setState({ isHandling: false })
        }, 500)
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

    async _getData(childId = this.state.childs[0].id, from, to) {
        const userToken = this.props.user.apiKey;
        let _params = {
            child_id: childId,
            from,
            to
        }
        let respon = await sf.getServices('TuitionService').getToPercentage(_params, userToken);
        if (respon && respon.status == 200 && respon.data) {
            let _data = respon.data;
            let _results = {}, _dataCol = [], _dataPie = [];
            await _asyncForEach(_data, async (tb) => {
                if (!_results[`${tb.subject}`]) {
                    _results[`${tb.subject}`] = { fee: tb.fee, _data: [{ id: `${tb.subject} - ${tb.name}`, fee: tb.fee }] }
                } else {
                    let _objToCheck = _findInArray(_results[`${tb.subject}`]._data, 'id', `${tb.subject} - ${tb.name}`, null);
                    if (_objToCheck) {
                        _results[`${tb.subject}`].fee -= _objToCheck.fee;
                        _results[`${tb.subject}`].fee += Number(tb.fee);
                    } else {
                        _results[`${tb.subject}`].fee += Number(tb.fee);
                        _results[`${tb.subject}`]._data.push({ id: `${tb.subject} - ${tb.name}`, fee: tb.fee })
                    }
                }
            })
            this._totalFee = 0;
            await _asyncForEach(Object.keys(_results), async (tbKey, index) => {
                let tb = _results[tbKey];
                let _color = _randomColor();
                this._totalFee += tb.fee;
                _dataCol.push({
                    y: tb.fee, subject: tbKey, svg: { fill: _color }, key: index
                })
                _dataPie.push({
                    x: tbKey, y: tb.fee, svg: { fill: _color }, key: index
                })
            })
            this.setState({ colData: _dataCol, pieData: _dataPie });
        }
    }

    async _getDataCustomDate(childId = this.state.childs[0].id, from, to) {
        const userToken = this.props.user.apiKey;
        let _params = {
            child_id: childId,
            from,
            to
        }
        let respon = await sf.getServices('TuitionService').getToPercentage(_params, userToken);
        if (respon && respon.status == 200 && respon.data) {
            let _data = respon.data;
            let _results = {}, _dataCol = [], _resultStack = {}; _colors = {};
            await _asyncForEach(_data, async (tb) => {
                let _color = _randomColor();
                if (!_results[`${tb.subject}`]) {
                    _results[`${tb.subject}`] = { fee: tb.fee, _color, _data: [{ id: `${tb.subject} - ${tb.name}`, fee: tb.fee }] }
                } else {
                    let _objToCheck = _findInArray(_results[`${tb.subject}`]._data, 'id', `${tb.subject} - ${tb.name}`, null);
                    if (_objToCheck) {
                        _results[`${tb.subject}`].fee -= _objToCheck.fee;
                        _results[`${tb.subject}`].fee += tb.fee;
                    } else {
                        _results[`${tb.subject}`].fee += tb.fee;
                        _results[`${tb.subject}`]._data.push({ id: `${tb.subject} - ${tb.name}`, fee: tb.fee })
                    }
                }

                if(!_colors[`${tb.subject}`]) _colors[`${tb.subject}`] = _color;

                if (!_resultStack[`${tb.year}-${tb.month}`]) {
                    _resultStack[`${tb.year}-${tb.month}`] = {};
                    _resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`] = { fee: tb.fee, svg: { fill: _colors[`${tb.subject}`] }, _data: [{ id: `${tb.subject} - ${tb.name}`, fee: tb.fee }] }
                    // _resultStack[`${tb.year}-${tb.month}`][`${tb.subject} - ${t.name}`] = tb.fee
                } else {
                    if (!_resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`]) {
                        // _resultStack[`${tb.year}-${tb.month}`][`${tb.subject} - ${t.name}`] = tb.fee;
                        _resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`] = { fee: tb.fee, svg: { fill: _colors[`${tb.subject}`] }, _data: [{ id: `${tb.subject} - ${tb.name}`, fee: tb.fee }] };
                    } else {
                        // _resultStack[`${tb.year}-${tb.month}`][`${tb.subject} - ${t.name}`] += tb.fee;
                        let _objToCheck = _findInArray(_resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`]._data, 'id', `${tb.subject} - ${tb.name}`, null);
                        if (_objToCheck) {
                            _resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`].fee -= _objToCheck.fee;
                            _resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`].fee += tb.fee;
                        } else {
                            _resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`].fee += tb.fee;
                            _resultStack[`${tb.year}-${tb.month}`][`${tb.subject}`]._data.push({ id: `${tb.subject} - ${tb.name}`, fee: tb.fee })
                        }
                    }
                }
            })
            this._totalFee = 0;
            await _asyncForEach(Object.keys(_results), async (tbKey, index) => {
                let tb = _results[tbKey];
                this._totalFee += tb.fee;
                _dataCol.push({
                    key: index, y: tb.fee, subject: tbKey, svg: { fill: tb._color }
                })
            })
            this.setState({ colData: _dataCol, stackData: _resultStack });
        }
    }

    _setDateTime(_type, textTime) {
        let { rangeTime } = this.state;
        rangeTime[_type] = textTime;
        this.setState({ rangeTime });
    }

    _renderColorData() {
        return this.state.colData.map((c) => {
            return <View key={c.subject} style={styles.itemColor}>
                <View style={[styles.color, { backgroundColor: c.svg.fill }]} />
                <StandardText small>{c.subject}</StandardText>
            </View>
        })
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

    _goFilterDate(_type) {
        Keyboard.dismiss();
        if (_type == '_from') {
            this._tempMonth = this.state.rangeTime.fromMonth;
        } else this._tempMonth = this.state.rangeTime.toMonth;
        this.setState({ isPickDate: _type }, () => this.setState({ isPickTimeVisible: true }));
    }

    _mapDataStack(_arr) {
        let _res = {};
        Object.keys(_arr).forEach((_a) => {
            _res[_a] = {
                value: _arr[_a].fee,
                svg: {
                    onPress: () => { },
                    fill: _arr[_a].svg ? _arr[_a].svg.fill : '#000'
                }
            }
        })
        return _res;
    }

    _mapColorStack(_arr) {
        return Object.keys(_arr).map((_a) => {
            if (_arr[_a] && _arr[_a].svg) return _arr[_a].svg.fill
            return '#000'
        });
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
        let childId = childSelected.id;
        let from = moment().set("month", rangeTime.fromMonth - 1).set('year', rangeTime.fromYear).startOf('month').format('DD-MM-YYYY');
        let to = moment().set("month", rangeTime.toMonth - 1).set('year', rangeTime.toYear).endOf('month').format('DD-MM-YYYY');
        this.setState({ isHandling: true, isPickTimeVisible: false });
        this._tempMonth = null;
        if (rangeTime.fromMonth == rangeTime.toMonth && rangeTime.fromYear == rangeTime.toYear) {
            await this._getData(childId, from, to);
            this.setState({ stackData: null, isHandling: false })
        } else {
            await this._getDataCustomDate(childId, from, to);
            this.setState({ isHandling: false });
        }
    }

    _preDatetime() {
        let { rangeTime, isPickDate } = this.state;
        if (isPickDate == '_from') {
            rangeTime.fromYear = parseInt(rangeTime.fromYear) - 1;
        } else rangeTime.toYear = parseInt(rangeTime.toYear) - 1;
        this.setState({ rangeTime })
    }

    _nextDatetime() {
        let { rangeTime, isPickDate } = this.state;
        if (isPickDate == '_from') {
            rangeTime.fromYear = parseInt(rangeTime.fromYear) + 1;
        } else rangeTime.toYear = parseInt(rangeTime.toYear) + 1;
        this.setState({ rangeTime })
    }

    _onCloseModalSelectChild = () => this.setState({ isSelectChildModalVisible: false })

    _onCloseModalPickDate = () => {
        if (this._tempMonth) {
            let { rangeTime, isPickDate } = this.state;
            if (isPickDate == '_from') {
                this.setState({ rangeTime: { ...rangeTime, fromMonth: this._tempMonth } });
            } else this.setState({ rangeTime: { ...rangeTime, toMonth: this._tempMonth } });
        }
        this.setState({ isPickTimeVisible: false })
    }

    _renderStackChart() {
        let { stackData } = this.state;
        return Object.keys(stackData).map((stackKey) => {
            return <StackBarChart key={stackKey} data={stackData[stackKey]} title={stackKey} />
        })
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        if (this.state.childs.length == 0) {
            noticeUtils.inform(noticeUtils.message.needCreateChild);
            // this.props.navigation.goBack(null);
            this.setState({ isHandling: false })
        } else {
            let childId = this.state.childs[0] ? this.state.childs[0].id : -1;
            let from = moment().startOf('month').format('DD-MM-YYYY');
            let to = moment().endOf('month').format('DD-MM-YYYY');
            await this._getData(childId, from, to);
            this.setState({ isHandling: false })
        }
    }

    render() {
        const { isHandling, isPickDate, rangeTime } = this.state;
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}
                    rightButtonText={this.state.childSelected ? this.state.childSelected.name : ''}
                    rightButtonOnpress={this._rightAction.bind(this)}
                >리포트</Header>
                <ScrollView style={styles.content}>
                    <View style={styles.viewInputDate}>
                        <View style={[styles.inRow, isPickDate == '_from' ? styles.inRowActive : styles.inRowInactive]}>
                            <TextInput style={styles.inputDate}
                                underlineColorAndroid="transparent"
                                onChangeText={this._setDateTime.bind(this, 'fromYear')}
                                value={this.state.rangeTime.fromYear.toString()}
                                onFocus={this._goFilterDate.bind(this, '_from')} />
                            <StandardText>년</StandardText>
                        </View>
                        <View style={[styles.inRow, isPickDate == '_from' ? styles.inRowActive : styles.inRowInactive]}>
                            <TextInput style={styles.inputDate}
                                underlineColorAndroid="transparent"
                                onChangeText={this._setDateTime.bind(this, 'fromMonth')}
                                value={this.state.rangeTime.fromMonth.toString()}
                                onFocus={this._goFilterDate.bind(this, '_from')} />
                            <StandardText>월</StandardText>
                        </View>
                        <StandardText style={{ flex: 1, textAlign: 'center' }}> ~ </StandardText>
                        <View style={[styles.inRow, isPickDate == '_to' ? styles.inRowActive : styles.inRowInactive]}>
                            <TextInput style={styles.inputDate}
                                underlineColorAndroid="transparent"
                                onChangeText={this._setDateTime.bind(this, 'toYear')}
                                value={this.state.rangeTime.toYear.toString()}
                                onFocus={this._goFilterDate.bind(this, '_to')} />
                            <StandardText>년</StandardText>
                        </View>
                        <View style={[styles.inRow, isPickDate == '_to' ? styles.inRowActive : styles.inRowInactive]}>
                            <TextInput style={styles.inputDate}
                                underlineColorAndroid="transparent"
                                onChangeText={this._setDateTime.bind(this, 'toMonth')}
                                value={this.state.rangeTime.toMonth.toString()}
                                onFocus={this._goFilterDate.bind(this, '_to')} />
                            <StandardText>월</StandardText>
                        </View>
                    </View>
                    {this.state.stackData
                        ? <View style={styles.viewStackBarChart}>
                            {Object.keys(this.state.stackData).map((keyStack) => {
                                return <View key={keyStack} style={styles.barOfMonth}>
                                    <StandardText bold style={{ marginTop: scale(15) }}>{`${keyStack.split('-')[0]}년 ${keyStack.split('-')[1]}월 교육비`}</StandardText>
                                    <View style={styles.containerStackBar}>
                                        <View style={styles.innerStackBar}>
                                            <StackedBarChart
                                                horizontal
                                                style={{ width: '100%', height: scale(30) }}
                                                keys={Object.keys(this.state.stackData[keyStack])}
                                                // colors={this._mapColorStack(this.state.stackData[keyStack])}
                                                data={this._mapDataStack(this.state.stackData[keyStack])}
                                                // valueAccessor={({ item, key }) => item[key].value}
                                                // showGrid={false}
                                            />
                                        </View>
                                    </View>
                                </View>
                            })}
                        </View>
                        : <PieChart
                            style={{ height: scale(250), marginTop: scale(25) }}
                            valueAccessor={({ item }) => item.y}
                            data={this.state.pieData}
                            spacing={0}
                            padAngle={0}
                            outerRadius={'100%'}
                            innerRadius={'0%'}
                        >
                            <Labels totalFee={this._totalFee} />
                        </PieChart>
                    }

                    {!!this.state.childSelected && <StandardText large style={{ marginTop: scale(40), textAlign: 'center' }}>{'월 비용'}</StandardText>}

                    {this.state.colData.length > 0 && <View pointerEvents="none" style={{ paddingBottom: scale(20), paddingLeft: scale(17) }}>
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={{ x: 50 }}
                        // standalone={false}
                        >
                            <VictoryBar
                                style={{
                                    data: { fill: (d) => d.svg.fill, maxWidth: scale(23) },
                                    grid: { strokeWidth: 0 },
                                    labels: { fontSize: scale(8), textAlign: 'center' }
                                }}
                                alignment="middle"
                                domainPadding={{x: [100, 0]}}
                                data={this.state.colData}
                                labels={(d) => _formatMoney(d.y)}
                            />
                            <VictoryAxis dependentAxis
                                padding={{ left: scale(10) }}
                                tickCount={10}
                                tickFormat={value => _formatMoney(value)}
                                tickLabelComponent={<VictoryLabel />}
                            />
                            <VictoryAxis
                                tickFormat={() => ''}
                                tickLabelComponent={<VictoryLabel />}
                            />
                        </VictoryChart>

                        <View style={styles.colorData}>
                            {this._renderColorData()}
                        </View>
                    </View>}

                </ScrollView>
                <Modal
                    isOpen={this.state.isSelectChildModalVisible}
                    backdropOpacity={0.5}
                    style={[styles.modalSelectChild, { height: scale(45 * this.state.childs.length) }]}
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
                                <View style={styles.viewDatetime}>
                                    <TouchableWithoutFeedback onPress={this._preDatetime.bind(this)}>
                                        <View style={styles.btnDatetime}>
                                            <Icon name='chevron-left'
                                                type='material-community'
                                                color='#000'
                                                size={scale(26)} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    {this.state.isPickDate == '_from'
                                        ? <StandardText title>{this.state.rangeTime.fromYear}년</StandardText>
                                        : <StandardText title>{this.state.rangeTime.toYear}년</StandardText>
                                    }
                                    <TouchableWithoutFeedback onPress={this._nextDatetime.bind(this)}>
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
                                    textStyle={{}}>복사</SimpleButton>
                                <SimpleButton
                                    onPress={this._onCloseModalPickDate.bind(this)}
                                    propComponent={{
                                        underlayColor: buttonColor.underlay
                                    }}
                                    style={styles.btnModal}
                                    textStyle={{}}>삭제</SimpleButton>
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

export default connect(mapStateToProps, bindAction)(Report);