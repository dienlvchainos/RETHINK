import React from 'react'
import { TouchableWithoutFeedback, View, Image, ScrollView, FlatList, Dimensions, TextInput, Keyboard } from 'react-native'
import BaseScreen from '../../baseScreen'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import styles from './styles';
import CustomDropdown from '../../../components/customDropdown';
import StandardText from '../../../components/standardText';
import UnderlineText from '../../../components/underlineText';
import SimpleButton from '../../../components/simpleButton';
import { buttonColor } from "../../../utils/styleUtils";
import { scale } from '../../../utils/scalingUtils';
import sf from '../../../libs/serviceFactory';
import LoadingScreen from '../../../components/loadingScreen';
import notice from "../../../utils/noticeUtils";
import Header from '../header';
import moment from 'moment';
import { _detectTime } from '../helpers';

const dayOfWeeks = require('./dayOfWeek.json');
const LESSONS = require('./lessons.json');

class EditTime extends BaseScreen {

    optionTime = [
        {
            id: 0,
            title: '요일 / 시간'
        },
        {
            id: 1,
            title: '요일 / 교시'
        }
    ]

    optionLessons = LESSONS;

    constructor(props) {
        super(props)
        this.state = {
            isHandling: true,
            optionTimetable: 0,
            optionSelected: this.optionTime[0],
            lessonSelected: LESSONS[LESSONS.length - 1],
            times: [],
            settingTime: {
                start_time: '13:00:00',
                lesson_period: 50,
                break_period: 10,
                lessons: 8,
                weekdays: '1,2,3,4,5,6,7'
            },
            dayOfWeeks: dayOfWeeks,
            isTimePickerVisible: false
        }
    }

    _onChangeOption = (optionSelected) => {
        this.setState({ optionSelected })
    }

    async _doApply() {
        Keyboard.dismiss();
        let { settingTime } = this.state;
        if (settingTime.start_time && settingTime.lesson_period && settingTime.break_period) {
            this.setState({ isHandling: true });
            let times = await this._generateTimetable(settingTime);
            this.setState({ times }, () => this.setState({ isHandling: false }));
        } else notice.inform(notice.message.invalidData)
    }

    _timeoutCancelHandling() {
        let timeOut = setTimeout(() => this.setState({ isHandling: false }), 60000)
        return timeOut;
    }

    _renderTime = ({ item, index }) => {
        return <View style={styles.itemItem}>
            <StandardText bold>{index + 1}</StandardText>
            <StandardText bold style={styles.textHour}>{item.startTime}</StandardText>
            <StandardText bold >~</StandardText>
            <StandardText bold style={styles.textHour}>{item.endTime}</StandardText>
        </View>
    }

    _setSettingTime = (key, value) => {
        let { settingTime } = this.state;
        settingTime[key] = value;
        this.setState({ settingTime })
    }

    _focusTimePicker() {
        Keyboard.dismiss();
        this.setState({ isTimePickerVisible: true })
    }

    _blurTimePicker() {
        this.setState({ isTimePickerVisible: false })
    }

    _handleTimePicked(time) {
        let { settingTime } = this.state;
        settingTime['start_time'] = moment(time).format('HH:mm:ss');
        this.setState({ settingTime });
    }

    _hideTimePicker() {

    }

    async _getTimetableSetting() {
        let userToken = this.props.user.apiKey;
        let settingRespon = await sf.getServices('TimetableService').getSetting(userToken);
        if (settingRespon && settingRespon.status == 200 && settingRespon.data && Object.keys(settingRespon.data).length > 0 && !settingRespon.data.error) {
            let dayOfWeeks = this.state.dayOfWeeks;
            let daysActive = settingRespon.data.weekdays.split(',');
            dayOfWeeks.forEach((d) => {
                if (daysActive.indexOf(d.id.toString()) != -1) d.selected = true;
            })
            let times = await this._generateTimetable(settingRespon.data);
            let _lesson = LESSONS.find((l) => l.id == settingRespon.data.lessons);
            this._settingTime = Object.assign({}, { ...settingRespon.data });
            this.setState({
                settingTime: settingRespon.data,
                lessonSelected: _lesson ? _lesson : LESSONS[0],
                dayOfWeeks,
                times
            }, () => this.setState({ isHandling: false }));
        } else {
            this._autoCreateTimetableSetting();
        }
    }

    async _autoCreateTimetableSetting() {
        let _data = this.state.settingTime;
        let userToken = this.props.user.apiKey;
        let settingRespon = await sf.getServices("TimetableService").create(_data, userToken);
        if (settingRespon && settingRespon.status == 200 && settingRespon.data.timetable_setting && !settingRespon.data.error) {
            let timetableSetting = settingRespon.data.timetable_setting;
            timetableSetting.start_time = moment(timetableSetting.start_time.date).format('HH:mm');
            let dayOfWeeks = this.state.dayOfWeeks;
            let daysActive = timetableSetting.weekdays.split(',');
            dayOfWeeks.forEach((d) => {
                if (daysActive.indexOf(d.id.toString()) != -1) d.selected = true;
            })
            let times = await this._generateTimetable(timetableSetting);
            this.setState({
                settingTime: timetableSetting,
                lessonSelected: LESSONS[timetableSetting.lessons - 1],
                dayOfWeeks,
                times
            }, () => this.setState({ isHandling: false }));
        } else {
            this.setState({ isHandling: false });
            this.props.navigation.goBack(null);
        }
    }

    _generateTimetable(settingTime) {
        let times = [];
        let numHours = 23 - Number(moment(settingTime.start_time, 'HH:mm').format('HH'));
        for (let i = 0; i < numHours; i++) {
            if (i == 0) {
                times.push({
                    id: i,
                    startTime: moment(settingTime.start_time, 'HH:mm').format('HH:mm'),
                    endTime: moment(settingTime.start_time, 'HH:mm').add(settingTime.lesson_period, 'minutes').format('HH:mm'),
                    _start: _detectTime(moment(settingTime.start_time, 'HH:mm').format('HH:mm')),
                    _end: _detectTime(moment(settingTime.start_time, 'HH:mm').add(settingTime.lesson_period, 'minutes').format('HH:mm'))
                })
            } else {
                times.push({
                    id: i,
                    startTime: moment(times[i - 1].endTime, 'HH:mm').add(settingTime.break_period, 'minutes').format('HH:mm'),
                    endTime: moment(times[i - 1].endTime, 'HH:mm').add(settingTime.break_period, 'minutes').add(settingTime.lesson_period, 'minutes').format('HH:mm'),
                    _start: _detectTime(moment(times[i - 1].endTime, 'HH:mm').add(settingTime.break_period, 'minutes').format('HH:mm')),
                    _end: _detectTime(moment(times[i - 1].endTime, 'HH:mm').add(settingTime.break_period, 'minutes').add(settingTime.lesson_period, 'minutes').format('HH:mm'))
                })
            }
        }
        return Promise.resolve(times);
    }

    _renderDayOfWeek() {
        const { dayOfWeeks } = this.state;
        return dayOfWeeks.map((item) => {
            return <TouchableWithoutFeedback key={item.id} onPress={this._doSelectDayOfWeek.bind(this, item)}>
                <View style={[styles.itemDayOfWeek, item.selected ? styles.selectedDayOfWeek : {}]}>
                    <StandardText bold>{item.title}</StandardText>
                </View>
            </TouchableWithoutFeedback>
        })
    }

    _doSelectDayOfWeek(item) {
        let { dayOfWeeks } = this.state;
        let currentDay = dayOfWeeks.find((d) => d.id == item.id);
        if (currentDay) currentDay.selected = !currentDay.selected;
        this.setState({ dayOfWeeks });
    }

    _onChangeLessons = (lessonSelected) => {
        this.setState({ lessonSelected })
    }

    _syncScheduleNewTime(settingTime) {
        // let _diffStart = moment(`${moment().format('YYYY-MM-DD')} ${settingTime.start_time}`).diff(moment(`${moment().format('YYYY-MM-DD')} ${this._settingTime.start_time}`), 'minute');
        return new Promise(async (resolve) => {
            let times = await this._generateTimetable(settingTime);
            let userToken = this.props.user.apiKey;
            let _from = moment().isoWeekday(1).format('DD-MM-YYYY');
            let _to = moment().isoWeekday(7).format('DD-MM-YYYY');
            let scheduleRespon = await sf.getServices('ScheduleService').getAllByDate(_from, _to, userToken);
            let _willUpdates = []
            if (scheduleRespon && scheduleRespon.status == 200 && scheduleRespon.data.length > 0) {
                scheduleRespon.data.filter((s) => !s.activity_id).forEach(async (s) => {
                    let _startAt = this._nearMappingTime(times, s.start_at, '_start');
                    let _endAt = this._calEndTime(s, _startAt, settingTime);
                    let schedule = {
                        ...s,
                        start_at: _startAt,
                        // end_at: this._nearMappingTime(times, s.end_at, '_end')
                        end_at: _endAt
                    }
                    let responseUpdate = await sf.getServices("ScheduleService").updateSchedule(schedule, userToken);
                })
                return resolve();
            } else return resolve()
        })

    }

    _calEndTime(currentSchedule, _startAt, settingTime) {
        let _diffRange = moment(currentSchedule.end_at).diff(moment(currentSchedule.start_at), 'minute');
        let _margin = Math.round(_diffRange / (this._settingTime.lesson_period + this._settingTime.break_period));
        return moment(_startAt, 'DD-MM-YYYY HH:mm:ss').add((settingTime.lesson_period * _margin) + (settingTime.break_period * (_margin - 1)), 'minute').format('DD-MM-YYYY HH:mm:ss')
    }

    _nearMappingTime(_arrTimes, needMap, _whereMap) {
        let _result = moment(needMap);
        let _hour = moment(needMap).hour(), _minute = moment(needMap).minute();
        let _hoursMap = _arrTimes.filter((t) => t[_whereMap].hour == _hour);
        if (_hoursMap.length > 0) {
            if (_hoursMap.length == 1) {
                return _result.set('minute', _hoursMap[0][_whereMap].minute).format('DD-MM-YYYY HH:mm:ss')
            } else {
                _minuteStarts = _hoursMap.map((h) => h[_whereMap].minute);
                let _itemClosest = _minuteStarts.reduce(function (prev, curr) {
                    return (Math.abs(curr - _minute) < Math.abs(prev - _minute) ? curr : prev);
                });
                let _indexTime = _minuteStarts.indexOf(_itemClosest);
                if (_indexTime == -1) _indexTime = 0;
                return _result.set('minute', _hoursMap[_indexTime][_whereMap].minute).format('DD-MM-YYYY HH:mm:ss')
            }
        } else {
            _hoursMap = _arrTimes.filter((t) => t[_whereMap].hour == _hour - 1);
            return _result.set('minute', _hoursMap[0][_whereMap].minute).format('DD-MM-YYYY HH:mm:ss')
        }
    }

    async _applySetting() {
        let { settingTime, dayOfWeeks, lessonSelected } = this.state;
        let userToken = this.props.user.apiKey;
        if (settingTime.start_time && settingTime.lesson_period && settingTime.break_period) {
            this.setState({ isHandling: true });
            let timeOut = this._timeoutCancelHandling();
            settingTime.weekdays = this._handleWeekdays(dayOfWeeks);
            settingTime.lessons = lessonSelected.id;
            let response = await sf.getServices("TimetableService").update(settingTime, userToken);
            clearTimeout(timeOut);
            this.setState({ isHandling: false });
            if (response && response.status == 200 && response.data && response.data.timetable_setting && !response.data.error) {
                await this._syncScheduleNewTime(settingTime);
                this.props.navigation.state.params._onUpdateTimetable();
                this.props.navigation.goBack(null);
                notice.inform(notice.message.success);
            } else {
                notice.inform(notice.message.errorServer);
            }
        } else notice.inform(notice.message.invalidData)
    }

    _handleWeekdays(dayOfWeeks) {
        let dayIds = dayOfWeeks.filter((d) => d.selected == true ? true : false).map((d) => d.id);
        return dayIds.join(',');
    }

    async componentDidMount() {
        await this._getTimetableSetting();
    }

    render() {
        const { isHandling, optionSelected, lessonSelected, times, settingTime } = this.state;
        const startTime = moment(settingTime.start_time, 'HH:mm');
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <Header
                        screenProps={this.props}
                        rightButtonText="저장"
                        rightAction={this._applySetting.bind(this)}
                        title="시간표 설정"
                    >

                    </Header>
                    <View style={{ flex: .5, flexDirection: 'row', alignItems: 'flex-end' }}>
                        <CustomDropdown
                            data={this.optionTime}
                            value={optionSelected}
                            onSelect={this._onChangeOption.bind(this)} />
                    </View>
                    {optionSelected.id == 0
                        ? <View style={styles.content}>
                            <View style={styles.headerList}>
                                <UnderlineText style={{}}><StandardText>시간 설정</StandardText></UnderlineText>
                            </View>
                            <View style={styles.form}>
                                <View style={styles.itemForm}>
                                    <StandardText>시작시간</StandardText>
                                    <TextInput style={styles.inputForm}
                                        value={startTime.format('HH:mm')}
                                        underlineColorAndroid="transparent"
                                        onFocus={this._focusTimePicker.bind(this)}
                                        onBlur={this._blurTimePicker.bind(this)}
                                    />
                                    <DateTimePicker
                                        mode="time"
                                        datePickerModeAndroid="spinner"
                                        isVisible={this.state.isTimePickerVisible}
                                        onConfirm={this._handleTimePicked.bind(this)}
                                        onCancel={this._hideTimePicker.bind(this)}
                                    />
                                </View>
                                <View style={styles.itemForm}>
                                    <StandardText>시간간격</StandardText>
                                    <TextInput style={styles.inputForm}
                                        underlineColorAndroid="transparent"
                                        value={settingTime.lesson_period.toString()}
                                        keyboardType="numeric"
                                        onChangeText={this._setSettingTime.bind(this, 'lesson_period')} />
                                </View>
                                <View style={styles.itemForm}>
                                    <StandardText>쉬는간격</StandardText>
                                    <TextInput style={styles.inputForm}
                                        underlineColorAndroid="transparent"
                                        value={settingTime.break_period.toString()}
                                        keyboardType="numeric"
                                        onChangeText={this._setSettingTime.bind(this, 'break_period')} />
                                </View>
                                <View style={styles.itemForm}>
                                    <SimpleButton
                                        onPress={this._doApply.bind(this)}
                                        propComponent={{
                                            underlayColor: buttonColor.underlay
                                        }}
                                        style={styles.btnApply}
                                        textStyle={styles.textApply}>설정 적용</SimpleButton>
                                </View>
                            </View>

                            {/* <View style={styles.listTime}> */}
                            {/* removeClippedSubviews={false} */}
                            <ScrollView contentContainerStyle={styles.listTime} >
                                {times.map((item, index) => (
                                    <View key={index} style={styles.itemItem}>
                                        <StandardText bold>{index + 1}</StandardText>
                                        <StandardText bold style={styles.textHour}>{item.startTime}</StandardText>
                                        <StandardText bold >~</StandardText>
                                        <StandardText bold style={styles.textHour}>{item.endTime}</StandardText>
                                    </View>
                                ))}
                                {/* <FlatList
                                        extraData={this.state}
                                        data={times}
                                        keyExtractor={(item, index) => String(item.id)}
                                        renderItem={this._renderTime.bind(this)}
                                    /> */}
                            </ScrollView>
                            {/* </View> */}

                            {/* <FlatList
                                extraData={this.state}
                                data={times}
                                keyExtractor={(item, index) => String(item.id)}
                                renderItem={this._renderTime.bind(this)}
                            /> */}
                            {/* <ScrollView style={styles.listTime}>
                                    
                                </ScrollView> */}
                        </View>
                        : <View style={styles.content}>
                            <View style={styles.headerList}>
                                <UnderlineText style={{}}><StandardText>요일 표시</StandardText></UnderlineText>
                            </View>
                            <View style={styles.listDayOfWeek}>
                                {this._renderDayOfWeek()}
                            </View>
                            <View style={styles.headerList}>
                                <UnderlineText style={{}}><StandardText>교시 표시</StandardText></UnderlineText>
                            </View>
                            <View style={{ height: scale(35), flexDirection: 'row', alignItems: 'flex-end' }}>
                                <CustomDropdown
                                    data={this.optionLessons}
                                    value={lessonSelected}
                                    dropdownStyle={{ height: scale(210) }}
                                    onSelect={this._onChangeLessons.bind(this)} />
                            </View>
                        </View>
                    }
                    {isHandling && <LoadingScreen title="가공..." />}
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

function bindAction(dispatch) {
    return {

    };
}

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, bindAction)(EditTime);