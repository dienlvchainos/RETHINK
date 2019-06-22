import React from 'react'
import { ScrollView, BackHandler, Alert, ImageBackground, View, TouchableWithoutFeedback, Keyboard, Image, Dimensions, KeyboardAvoidingView } from 'react-native'
import { Icon } from 'react-native-elements';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { default as ModalBox } from 'react-native-modalbox';
// import HeaderCalendar from './header';
import { connect } from 'react-redux';
import sf from '../../libs/serviceFactory';
import styles from './styles';
import panelStyles from './panelStyles';
import moment from 'moment';
import { scale } from '../../utils/scalingUtils';
import { _renderButtonText, _asyncForEach, _handleDateObject } from '../../helpers';
import { _timeoutCancelHandling } from '../../helpers';
import StandardText from '../../components/standardText';
import BottomSheet from '../../components/bottomSheet';
import FloatButton from '../../components/floatButton';
import AdvanceInput from '../../components/advanceInput';
import { _getDayOfWeek } from '../../utils/dateUtils';
import { mainColor, buttonColor } from '../../utils/styleUtils';
import noticeUtils from '../../utils/noticeUtils';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Header from "../../components/header";
import PopupSelectChildSchedule from '../timetable/popupSelectChildSchedule';
import LoadingScreen from '../../components/loadingScreen';
import Activity from './ACTIVITY';
import constants from '../../constants';
import { _getStorage, _setStorage } from '../../utils/storeUtils';
import { _createNotification, _removeNotification } from '../../utils/notifyUtils';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Carousel from 'react-native-snap-carousel';
import BaseScreen from '../baseScreen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

LocaleConfig.locales['kr'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토']
};

LocaleConfig.defaultLocale = 'kr';

// const wheelPickerData = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

class Calendar extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: true,
            currentDate: {
                year: moment().format('YYYY'),
                month: moment().format('MM')
            },
            isVisiblePanel: false,
            isVisibleCreate: false,
            daySelected: {
                day: moment().date(),
                dayOfWeek: _getDayOfWeek(moment().isoWeekday())
            },
            optionSelected: null,
            optionLocationSelected: true,
            optionNoteSelected: true,
            typeSelectDate: 'start_at', // start_at || end_at
            isLoadingTimePicker: false,
            activity: {
                start_at: '',
                end_at: '',
                name: '',
                child_id: '',
                reminder: '10m',
                notification_repeat: 'none',
                notification: 1,
                location: '',
                note: ''
            },
            dateTimeObj: {
                year: '2019',
                month: '04',
                day: '19',
                partDay: '오후',
                hour: '00',
                minute: '00'
            },
            isVisibleTimePicker: false,
            markedDates: {},
            detailItems: {},
            childs: props.child.list,
            isSelectChildModalVisible: false,
            isSuggestLocation: false,
            selectedItem: '',
            locations: [],
            dayCards: [],
            _heightOfDay: (height - height / 11) / 7.5
        }
    }

    _options = [
        { id: 0, icon: require('../../assets/icons/locationPoint.png'), title: '장소 ' },
        { id: 1, icon: require('../../assets/icons/educationIcon.png'), title: '메모 ' },
        { id: 2, icon: require('../../assets/icons/exchangeIcon.png'), title: '반복 ' }
    ]

    _reminders = [
        { id: 0, title: '정시', value: 'once' }, { id: 1, title: '5분 전', value: '5m' }, { id: 2, title: '10분 전', value: '10m' }, { id: 3, title: '15분 전', value: '15m' },
        { id: 4, title: '30분 전', value: '30m' }, { id: 5, title: '1시간 전', value: '1h' }, { id: 6, title: '2시간 전', value: '2h' }, { id: 7, title: '3시간 전', value: '3h' },
        { id: 8, title: '12시간 전 전', value: '12h' }, { id: 9, title: '1일 전', value: '1d' }, { id: 10, title: '2일 전', value: '2d' }, { id: 11, title: '1주 전', value: '1w' }
    ]

    _monthLoadeds = [
        // `${moment().format('YYYY')}-${parseInt(moment().format('MM'))}`,
        // `${moment().subtract(3, 'months').format('YYYY')}-${parseInt(moment().subtract(3, 'months').format('MM'))}`,
        // `${moment().subtract(2, 'months').format('YYYY')}-${parseInt(moment().subtract(2, 'months').format('MM'))}`,
        // `${moment().subtract(1, 'months').format('YYYY')}-${parseInt(moment().subtract(1, 'months').format('MM'))}`,
        // `${moment().add(1, 'M').format('YYYY')}-${parseInt(moment().add(1, 'M').format('MM'))}`,
        // `${moment().add(2, 'M').format('YYYY')}-${parseInt(moment().add(2, 'M').format('MM'))}`,
        // `${moment().add(3, 'M').format('YYYY')}-${parseInt(moment().add(3, 'M').format('MM'))}`
    ];

    _baseActivitys = []; _defaultIndexSwipe = 11; _defaultIndexSwipe1 = 5

    _onDayPress(daySelected) {
        // this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true})
        let markedDates = this.state.markedDates;
        let eventOfDay = markedDates[daySelected.dateString];
        let detailItems = {};
        if (eventOfDay) {
            let _arrEvents = eventOfDay.dots.concat(eventOfDay.activity);
            for (let i = 0; i <= _arrEvents.length - 1; i++) {
                if (detailItems[_arrEvents[i].childId]) {
                    detailItems[_arrEvents[i].childId].push(_arrEvents[i].data);
                } else {
                    detailItems[_arrEvents[i].childId] = [_arrEvents[i].data]
                }
            }
        }
        this.setState({
            isVisiblePanel: true,
            detailItems,
            daySelected: {
                ...daySelected,
                dayOfWeek: _getDayOfWeek(moment(daySelected.dateString).isoWeekday()),
                ...eventOfDay
            },
        });
    }

    async _onSwipeDay(direction) {
        let { markedDates, daySelected } = this.state;
        let _currDay = moment(daySelected.dateString), _date;
        let detailItems = {};
        if (direction == 'right') {
            _date = _currDay.add(1, 'day').format('YYYY-MM-DD');
        } else if (direction == 'left') {
            _date = _currDay.subtract(1, 'day').format('YYYY-MM-DD');
        }
        if (this._monthLoadeds.indexOf(`${_currDay.year()}-${_currDay.month() + 1}`) == -1) {
            this._monthLoadeds.push(`${_currDay.year()}-${_currDay.month() + 1}`);
            await this._initLoadMonth(_currDay.month(), _currDay.year());
        }
        let eventOfDay = markedDates[_date];
        if (eventOfDay) {
            let _arrEvents = eventOfDay.dots.concat(eventOfDay.activity);
            for (let i = 0; i <= _arrEvents.length - 1; i++) {
                if (detailItems[_arrEvents[i].childId]) {
                    detailItems[_arrEvents[i].childId].push(_arrEvents[i].data);
                } else {
                    detailItems[_arrEvents[i].childId] = [_arrEvents[i].data]
                }
            }
        }
        let _daySelected = {
            ...eventOfDay,
            dateString: _date,
            dayOfWeek: _getDayOfWeek(moment(daySelected.dateString).isoWeekday()),
            month: _currDay.month() + 1,
            year: _currDay.year(),
            day: _currDay.date()
        }
        this.setState({ daySelected: _daySelected, detailItems })
    }

    _getEventByDay(_daySelected) {
        let markedDates = this.state.markedDates;
        let eventOfDay = markedDates[_daySelected];
        let detailItems = {};
        if (eventOfDay) {
            let _arrEvents = eventOfDay.dots.concat(eventOfDay.activity);
            for (let i = 0; i <= _arrEvents.length - 1; i++) {
                if (detailItems[_arrEvents[i].childId]) {
                    detailItems[_arrEvents[i].childId].push(_arrEvents[i].data);
                } else {
                    detailItems[_arrEvents[i].childId] = [_arrEvents[i].data]
                }
            }
        }
        this.setState({ detailItems });
    }

    _renderDay = ({ state, marking = {}, date, current }) => {
        return <TouchableWithoutFeedback onPress={this._onDayPress.bind(this, date)}>
            <View style={[styles.itemDay, { height: this.state._heightOfDay }]}>
                {/* <View style={[styles.itemDay]}> */}
                <StandardText bold style={styles.textItemDay}>
                    {date.day}
                </StandardText>
                {(marking && marking.dots) && <View style={styles.viewMarking}>{this._renderMarkingDay(marking.dots)}</View>}
                {(marking && marking.activity) && <View style={styles.viewActivity}>{this._renderMarkingActivity(marking.activity)}</View>}
            </View >
        </TouchableWithoutFeedback>
    }

    _renderMarkingDay(_arrDots) {
        return _arrDots.map((d) => (
            <View key={d.key} style={[styles.dotMarking, { backgroundColor: d.color || mainColor.defaultEvent }]}></View>
        ))
    }

    _renderMarkingActivity(_arrActivity) {
        return _arrActivity.map((a, index) => {
            if (index < 3) return <StandardText key={index} bold style={styles.textActivity}>{a.name}</StandardText>
            return null;
        })
    }

    _onClosePanel() {
        this.setState({
            isVisiblePanel: false
        })
    }

    _onCloseCreate() {
        this.setState({
            isVisibleCreate: false
        });
        this.childIdForAll = null;
    }

    _goCreateEvent() {
        if (this.props.child.list.length <= 0) return noticeUtils.inform(noticeUtils.message.needCreateChild);
        if (this.props.child.list.length == 1) {
            this._goCreateActivity(this.props.child.list[0].id);
        } else {
            this.setState({
                isSelectChildModalVisible: true,
                isVisiblePanel: false
            })
        }
    }

    _setDatetime = (dateTimeObj) => {
        this.setState({ dateTimeObj });
    }

    _selectDate(_type) {
        this.setState({
            typeSelectDate: _type,
            isVisibleTimePicker: true
        })
    }

    _setActivity = (key, value) => {
        let { activity } = this.state;
        activity[key] = value;
        this.setState({ activity });
    }

    _goBack() {
        this.props.navigation.goBack(null);
    }

    _handleDatePicked(date) {
        let dateData = moment(date).format('DD-MM-YYYY HH:mm:ss');
        this._setActivity(this.state.typeSelectDate, dateData);
        this.setState({ isVisibleTimePicker: false });
    }

    _hideDateTimePicker = () => this.setState({ isVisibleTimePicker: false });

    async _doCreateSyncActivity(_activity, _activityId) {
        let userToken = this.props.user.apiKey;
        _activity.reminder = _activity.reminder ? _activity.reminder : '10m';
        _activity.repeat = _activity.notification_repeat;
        _activity.activity_id = _activityId;
        _activity.user_id = this.props.user.data.id;
        return await sf.getServices("CalendarService").createSyncActivity(_activity, userToken);
    }

    async _onUpdateEvent(activityData) {
        let _activity = await this._initActivity(activityData);
        let markedDates = this.state.markedDates;
        let _day = moment(_activity.start_at).format('YYYY-MM-DD');
        if (markedDates[String(_day)]) {
            markedDates[String(_day)].activity.push({
                id: _activity.id,
                name: _activity.name,
                childId: _activity.childId,
                child_id: _activity.childId,
                color: _activity.color,
                data: _activity
            });
        } else {
            markedDates[String(_day)] = {
                dots: [],
                marked: true,
                activity: [{
                    id: _activity.id,
                    name: _activity.name,
                    childId: _activity.childId,
                    child_id: _activity.childId,
                    color: _activity.color,
                    data: _activity
                }]
            }
        }
        this.setState({ markedDates: JSON.parse(JSON.stringify(markedDates)) })
    }

    _syncActivityWithList(_activity, markedDates) {
        let _day = moment(_activity.start_at).format('YYYY-MM-DD');
        if (markedDates[String(_day)]) { // day is already
            let _exists = markedDates[String(_day)].activity.filter((m) => m.data.activity_id == _activity.activity_id);
            if (_exists.length == 0) {
                markedDates[String(_day)].activity.push({
                    id: _activity.id || _activity.parent_id,
                    name: _activity.name,
                    childId: _activity.child_id || _activity.childId,
                    color: _activity.color,
                    data: _activity
                });
                return markedDates;
            }
            return markedDates;
        } else { // day not exists
            markedDates[String(_day)] = {
                dots: [],
                marked: true,
                activity: [{
                    id: _activity.id || _activity.parent_id,
                    name: _activity.name,
                    childId: _activity.child_id || _activity.childId,
                    color: _activity.color,
                    data: _activity
                }]
            }
            return markedDates;
        }
    }

    _initActivity(activityData, activity_sync_id) {
        return new Promise((resolve) => {
            let __activity = new Activity(
                activityData.activity_info.id,
                activityData.scheudle_info.child_id,
                activityData.scheudle_info.edu_id,
                _handleDateObject(activityData.scheudle_info.end_at),
                activityData.activity_info.id,
                activityData.activity_info.location,
                _handleDateObject(activityData.scheudle_info.start_at),
                activityData.activity_info.name,
                activityData.scheudle_info.notification,
                activityData.activity_info.notification_repeat,
                activityData.activity_info.note,
                this._detectColorChild(activityData.scheudle_info.child_id),
                activity_sync_id
            )
            return resolve(Object.assign({}, __activity));
        })
    }

    async _initRepeatActivity(activityData, activity_sync_id) {
        let _activity = await this._initActivity(activityData, activity_sync_id);
        if (activityData.activity_info.notification_repeat != constants.none) {
            switch (activityData.activity_info.notification_repeat) {
                case constants.daily:
                    return this._handleRepeatDaily(_activity, 1);
                case constants.weekly:
                    return this._handleRepeatWeekly(_activity, 1);
                case constants.monthly:
                    return this._handleRepeatMonthly(_activity, parseInt(moment(_activity.start_at).format('MM')) - 1, parseInt(moment(_activity.start_at).format('YYYY')));
                case constants.yearly: {
                    if (parseInt(moment().format('YYYY')) == parseInt(moment(_activity.start_at).format('YYYY')) &&
                        parseInt(moment(_activity.start_at).format('MM')) == parseInt(moment().format('MM'))) {
                        return this._handleRepeatYearly(_activity, parseInt(moment().format('YYYY')));
                    } else break;
                }
            }
        }
    }

    async _handleRepeatDaily(_activity, bonusDay = 0, targetMonth, targetYear) {
        let { markedDates } = this.state;
        let endDayMonth = !isNaN(targetMonth) ? moment().set('month', targetMonth).set('year', targetYear).endOf('month') : moment().endOf('month');
        let _remainingDay = endDayMonth.diff(moment(_activity.start_at), 'days');
        let _startDayShow = parseInt(moment(_activity.start_at).format('DD'));
        let _markedDates = markedDates;
        if (targetMonth || targetMonth == 0) {
            if(moment(_activity.start_at).isBefore(moment().set({ month: targetMonth, year: targetYear}))) {
                _remainingDay = parseInt(endDayMonth.format('DD'));
                _startDayShow = 1;
            } else {
                _remainingDay += 1
            }
            _remainingDay = _remainingDay > 31 ? 31 : _remainingDay;
            let _timeStart = moment(_activity.start_at).format('HH:mm:ss');
            let _timeEnd = moment(_activity.end_at).format('HH:mm:ss');
            await _asyncForEach(new Array(_remainingDay), async (item, i) => {
                let _baseMoment = moment().set('month', targetMonth).set('year', targetYear).set('date', _startDayShow + i).format('YYYY-MM-DD');

                _activity.start_at = moment(`${_baseMoment} ${_timeStart}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                _activity.end_at = moment(`${_baseMoment} ${_timeEnd}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
                _markedDates = this._syncActivityWithList(_activity, _markedDates);
            });
        } else {
            await _asyncForEach(new Array(_remainingDay), async (item, i) => {
                _activity.start_at = moment(_activity.start_at, 'YYYY-MM-DD HH:mm:ss').set('date', _startDayShow + i).format('YYYY-MM-DD HH:mm:ss');
                _activity.end_at = moment(_activity.end_at, 'YYYY-MM-DD HH:mm:ss').set('date', _startDayShow + i).format('YYYY-MM-DD HH:mm:ss');
                _markedDates = this._syncActivityWithList(_activity, _markedDates);
            })
        }
        this.setState({ markedDates: JSON.parse(JSON.stringify(_markedDates)) });
    }

    async _handleRepeatWeekly(_activity, bonusTime = 0, targetMonth, targetYear) {
        let { markedDates } = this.state;
        let endDayMonth = targetMonth ? moment().set('month', targetMonth).set('year', targetYear).endOf('month') : moment().endOf('month');
        let _remainingDay = endDayMonth.diff(moment(_activity.start_at), 'days');
        let _startDayShow = moment(_activity.start_at, 'YYYY-MM-DD HH:mm:ss');
        let _endDayShow = moment(_activity.end_at, 'YYYY-MM-DD HH:mm:ss');
        if (targetMonth && targetMonth + 1 >= parseInt(moment().format('MM'))) {
            let _timeStart = moment(_activity.start_at).format('HH:mm:ss');
            let _timeEnd = moment(_activity.end_at).format('HH:mm:ss');
            let _dayOfWeek = moment(_activity.start_at).day();
            let firstDayOfMonth = moment(_activity.start_at).set({ month: targetMonth, year: targetYear }).startOf('month');
            _startDayShow = moment(`${firstDayOfMonth.format('YYYY-MM-DD')} ${_timeStart}`, 'YYYY-MM-DD HH:mm:ss').day(_dayOfWeek);
            _endDayShow = moment(`${firstDayOfMonth.format('YYYY-MM-DD')} ${_timeEnd}`, 'YYYY-MM-DD HH:mm:ss').day(_dayOfWeek);
            _remainingDay = parseInt(endDayMonth.format('DD'));
            if (parseInt(moment(_startDayShow).format('DD')) <= 7) bonusTime += 1;
        }
        if (_remainingDay >= 7) {
            await _asyncForEach(new Array(Math.floor(_remainingDay / 7) + bonusTime), async (item, i) => {
                i = i > 1 ? 1 : i;
                _activity.start_at = _startDayShow.add(i * 7, 'days').format('YYYY-MM-DD HH:mm:ss');
                _activity.end_at = _endDayShow.add(i * 7, 'days').format('YYYY-MM-DD HH:mm:ss');
                markedDates = this._syncActivityWithList(_activity, markedDates);
            })
            this.setState({ markedDates: JSON.parse(JSON.stringify(markedDates)) });
        }
    }

    _handleRepeatMonthly(_activity, targetMonth, targetYear) {
        let { markedDates } = this.state;
        _activity.start_at = moment(_activity.start_at, 'YYYY-MM-DD HH:mm:ss').set('month', targetMonth).set('year', targetYear).format('YYYY-MM-DD HH:mm:ss');
        _activity.end_at = moment(_activity.end_at, 'YYYY-MM-DD HH:mm:ss').set('month', targetMonth).set('year', targetYear).format('YYYY-MM-DD HH:mm:ss');
        markedDates = this._syncActivityWithList(_activity, markedDates);
        this.setState({ markedDates: JSON.parse(JSON.stringify(markedDates)) });
    }

    _handleRepeatYearly(_activity, targetYear) {
        let { markedDates } = this.state;
        _activity.start_at = moment(_activity.start_at, 'YYYY-MM-DD HH:mm:ss').set('year', targetYear).format('YYYY-MM-DD HH:mm:ss');
        _activity.end_at = moment(_activity.end_at, 'YYYY-MM-DD HH:mm:ss').set('year', targetYear).format('YYYY-MM-DD HH:mm:ss');
        markedDates = this._syncActivityWithList(_activity, markedDates);
        this.setState({ markedDates: JSON.parse(JSON.stringify(markedDates)) });
    }

    async _localActivityRepeate(_arrToLoads) {
        let _baseActivity = _arrToLoads ? JSON.stringify(_arrToLoads) : await _getStorage(constants.repeatActivity);
        if (_baseActivity) {
            _baseActivity = JSON.parse(_baseActivity);
            this._baseActivitys = _baseActivity;
            let _tempToLoop = JSON.parse(JSON.stringify(_baseActivity));
            _tempToLoop.filter((a) => moment(a.start_at).startOf('month').isBefore(moment().endOf('month'))).forEach((a) => {
                switch (a.notification_repeat) {
                    case constants.daily:
                        return this._handleRepeatDaily(a, 1);
                    case constants.weekly:
                        return this._handleRepeatWeekly(a, 1);
                    case constants.monthly:
                        return this._handleRepeatMonthly(a, parseInt(moment().format('MM')) - 1, parseInt(moment().format('YYYY')));
                    case constants.yearly: {
                        if (parseInt(moment().format('YYYY')) == parseInt(moment(a.start_at).format('YYYY')) &&
                            parseInt(moment(a.start_at).format('MM')) == parseInt(moment().format('MM'))) {
                            return this._handleRepeatYearly(a, parseInt(moment().format('YYYY')));
                        } else break;
                    }
                }
            })
        } else {
            this._syncWithServer();
        }
    }

    async _syncWithServer() {
        let userToken = this.props.user.apiKey;
        let response = await sf.getServices('CalendarService').getListDraff(userToken);
        if (response && response.data && response.data.draft_events_list && response.data.draft_events_list.length > 0) {
            let _activitys = response.data.draft_events_list.map((a) => {
                a.activity_sync_id = a.id;
                return a;
            })
            this._baseActivitys = _activitys;
            this._localActivityRepeate(_activitys);
            _setStorage(constants.repeatActivity, JSON.stringify(_activitys));
        }
    }

    async _setLocalActivityRepeate(_activity, parentId, activity_sync_id) {
        let __activity = Object.assign({}, _activity);
        __activity.color = this._detectColorChild(__activity.child_id);
        __activity.childId = __activity.child_id;
        __activity.id = parentId;
        __activity.parent_id = parentId;
        __activity.activity_sync_id = activity_sync_id;
        __activity.start_at = moment(__activity.start_at, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        __activity.end_at = moment(__activity.end_at, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let _localActivitys = await _getStorage(constants.repeatActivity);
        let __localActivitys = _localActivitys ? JSON.parse(_localActivitys) : [];
        __localActivitys.push(__activity);
        _setStorage(constants.repeatActivity, JSON.stringify(__localActivitys));
        this._baseActivitys = __localActivitys;
    }

    _cancelViewEvent() {
        this.setState({ isVisiblePanel: false });
    }

    async _getEventOfUser(_from, _to) {
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        const userToken = this.props.user.apiKey;
        let from = _from || moment().startOf('month').format('DD-MM-YYYY');
        let to = _to || moment().endOf('month').format('DD-MM-YYYY');
        let response = await sf.getServices('CalendarService').getByRange(from, to, userToken);
        this.setState({ isHandling: false })
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && !response.data.error) {
            let markedDates = this.state.markedDates;
            for (let i = 0; i <= response.data.length - 1; i++) {
                let _day = moment(response.data[i].start_at).format('YYYY-MM-DD');
                if (markedDates[String(_day)]) { // day is already
                    if (response.data[i].activity_id) { // is event
                        if (response.data[i].notification_repeat == constants.none) {
                            let _exists = markedDates[String(_day)].activity.filter((m) => m.id == response.data[i].activity_id);
                            if (_exists.length == 0) {
                                markedDates[String(_day)].activity.push({
                                    id: response.data[i].activity_id,
                                    name: response.data[i].name,
                                    childId: response.data[i].child_id,
                                    color: this._detectColorChild(response.data[i].child_id),
                                    data: response.data[i]
                                });
                            }
                        }
                    } else { // is schedule
                        let _exists = markedDates[String(_day)].dots.filter((m) => m.id == response.data[i].id);
                        if (_exists.length == 0) {
                            markedDates[String(_day)].dots.push({
                                key: i,
                                id: response.data[i].id,
                                color: this._detectColorChild(response.data[i].child_id),
                                childId: response.data[i].child_id,
                                data: response.data[i]
                            });
                        }
                    }
                } else { // day not exists
                    markedDates[String(_day)] = {
                        dots: response.data[i].activity_id ? [] : [{
                            key: i,
                            id: response.data[i].id,
                            color: this._detectColorChild(response.data[i].child_id),
                            childId: response.data[i].child_id,
                            data: response.data[i]
                        }],
                        marked: true,
                        activity: []
                    }
                    if (response.data[i].activity_id && response.data[i].notification_repeat == constants.none) {
                        markedDates[String(_day)].activity = [{
                            id: response.data[i].activity_id,
                            name: response.data[i].name,
                            color: this._detectColorChild(response.data[i].child_id),
                            childId: response.data[i].child_id,
                            data: response.data[i]
                        }]
                    }
                }
            }
            this.setState({ markedDates: JSON.parse(JSON.stringify(markedDates)) });
        } else {
            noticeUtils.inform(noticeUtils.message.errorDataCalendar)
        }
    }

    _detectColorChild(childId) {
        let _childs = this.props.child.list;
        let _currentChild = _childs.find((c) => c.id == childId);
        if (_currentChild) return _currentChild.color;
    }

    _renderItemEvent() {
        let { detailItems } = this.state;
        let _keys = Object.keys(detailItems);
        return _keys.map((k, index) => {
            return <View key={index} style={panelStyles.itemDetail}>
                <StandardText large style={{ color: this._getColorChild(k) }}>{this._getNameChild(k)}</StandardText>
                {detailItems[k].map((d, _index) => {
                    return <TouchableWithoutFeedback key={_index} onLongPress={this._goDeleteEvent.bind(this, d)}>
                        <View style={panelStyles.itemEvent}>
                            <StandardText>{moment(d.start_at, 'YYYY-MM-DD HH:mm').format('HH:mm')} ~ {moment(d.end_at, 'YYYY-MM-DD HH:mm').format('HH:mm')}</StandardText>
                            <StandardText style={{ width: '20%', textAlign: 'center' }}>{this._shortText(d.name)}</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                })
                }
            </View>
        })

    }

    _goDeleteEvent(scheduleDelete) {
        let _actions = [
            {
                text: '취소',
                onPress: () => { },
                style: 'cancel',
            },
        ]
        if (scheduleDelete.notification_repeat != constants.none && !scheduleDelete.fee) {
            _actions.push(
                // { text: '이 이벤트 만', onPress: () => this._doDeleteEvent(scheduleDelete, 0) },
                { text: '모든 관련 이벤트', onPress: () => this._doDeleteEvent(scheduleDelete, 1) }
            )
        } else {
            _actions.push({ text: '삭제', onPress: () => this._doDeleteEvent(scheduleDelete, 0) })
        }
        Alert.alert(
            '일정 삭제?',
            '이 일정을 삭제 하시겠습니까?',
            _actions,
            { cancelable: true },
        );
    }

    async _doDeleteEvent(scheduleDelete, _type) {
        let userToken = this.props.user.apiKey;
        let { markedDates } = this.state;
        if (_type == 1) { // delete relation event
            this.setState({ isHandling: true });
            let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
            let _baseActivity = await _getStorage(constants.repeatActivity);
            if (_baseActivity) {
                _baseActivity = JSON.parse(_baseActivity);
            } else _baseActivity = [];
            let _index = _baseActivity.map((a) => a.activity_id).indexOf(scheduleDelete.activity_id);
            if (_index != -1) {
                _baseActivity.splice(_index, 1);
                this._baseActivitys = _baseActivity;
                _setStorage(constants.repeatActivity, JSON.stringify(_baseActivity));
                this.setState({ markedDates: {}, isVisiblePanel: false });
                this._monthLoadeds = [`${moment().format('YYYY')}-${parseInt(moment().format('MM'))}`];
                this._getEventOfUser();
                this._localActivityRepeate(_baseActivity);
                sf.getServices("CalendarService").deleteSyncActivity(scheduleDelete.activity_sync_id, userToken);
                sf.getServices("CalendarService").deleteActivity(scheduleDelete.activity_id, userToken);
                _removeNotification(scheduleDelete.activity_id);
                noticeUtils.inform(noticeUtils.message.success);
            }
            this.setState({ isHandling: false });
            clearTimeout(timeOut);
        } else { // delete 1 event
            let _day = moment(scheduleDelete.start_at).format('YYYY-MM-DD');
            if (markedDates[_day]) {
                if (scheduleDelete.activity_id) { // delete activity
                    this._deleteInDetails(scheduleDelete.childId || scheduleDelete.child_id, scheduleDelete.activity_id, "activity_id");
                    this._deleteInCalendar(scheduleDelete.start_at, "activity", "id", scheduleDelete.activity_id);
                    let _response = sf.getServices("CalendarService").deleteActivity(scheduleDelete.activity_id, userToken);
                    _removeNotification(scheduleDelete.activity_id);
                    noticeUtils.inform(noticeUtils.message.success);
                } else { // delete schedule
                    this._deleteInCalendar(scheduleDelete.start_at, 'dots', 'id', scheduleDelete.id);
                    this._deleteInDetails(scheduleDelete.childId || scheduleDelete.child_id, scheduleDelete.id, "id");
                    let _response = sf.getServices("ScheduleService").deleteSchedule(scheduleDelete.id, userToken);
                    _removeNotification(`${scheduleDelete.edu_id}${scheduleDelete.child_id}`);
                    noticeUtils.inform(noticeUtils.message.success);
                }
            }
        }
    }

    _deleteInCalendar(startDate, _where, _key, _value) {
        let { markedDates } = this.state;
        let _day = moment(startDate).format('YYYY-MM-DD');
        let _indexActivity = markedDates[_day][_where].map((a) => a[_key]).indexOf(_value);
        if (_indexActivity != -1) {
            markedDates[_day][_where].splice(_indexActivity, 1);
            this.setState({ markedDates: JSON.parse(JSON.stringify(markedDates)) });
        }
    }

    _deleteInDetails(childId, eventId, _key) {
        let { detailItems } = this.state;
        if (detailItems[childId]) {
            let _index = detailItems[childId].map((e) => e[_key]).indexOf(eventId);
            if (_index != -1) {
                detailItems[childId].splice(_index, 1);
                if (detailItems[childId].length == 0) {
                    delete detailItems[childId];
                }
                this.setState({ detailItems })
            }
        }
    }

    _getNameChild(childId) {
        let childLists = this.props.child.list;
        let _child = childLists.find((c) => c.id == childId);
        if (_child) return childLists.find((c) => c.id == childId).name;
        return '';
    }

    _getColorChild(childId) {
        let childLists = this.props.child.list;
        let _child = childLists.find((c) => c.id == childId);
        if (_child) return _child.color;
        return mainColor.defaultEvent;
    }

    _shortText(_text) {
        if (_text.length >= 16) return _text.substring(0, 15) + '...';
        return _text;
    }

    _handleChildForRadio() {
        return this.state.childs.map((c) => {
            return {
                id: c.id,
                label: c.name,
                value: c.id
            }
        });
    }

    _goCreateActivity(childId) {
        if (!childId) return noticeUtils.inform(noticeUtils.message.selectOneChild);
        this.childIdForAll = childId;
        let activity = this.state.activity;
        activity.notification_repeat = 'none';
        this.setState({ isSelectChildModalVisible: false, activity });
        this.navigate('createEvent', { activity, childId, _onCreateEvent: this._onCreateEvent.bind(this) })
    }

    async _onCreateEvent(activity, response) {
        this.childIdForAll = null;
        this._monthLoadeds = [`${moment().format('YYYY')}-${parseInt(moment().format('MM'))}`];
        // sync repeat with server
        if (activity.notification_repeat != constants.none) {
            let syncResponse = await this._doCreateSyncActivity(activity, response.activity_info.id);
            if (syncResponse && syncResponse.data && syncResponse.data.draf_event_info) {
                this._setLocalActivityRepeate(activity, response.activity_info.id, syncResponse.data.draf_event_info.id);
                await this._initRepeatActivity(response, syncResponse.data.draf_event_info.id);
            }
        } else {
            _diff = moment().diff(moment(_handleDateObject(response.scheudle_info.start_at)), 'months', true);
            if (_diff > -1 && _diff < 1) {
                this._onUpdateEvent(response);
            }
        }
    }

    async _onChangeMonth(months) {
        months.forEach((_month) => {
            if (this._monthLoadeds.indexOf(`${_month.year}-${_month.month}`) == -1) {
                this._monthLoadeds.push(`${_month.year}-${_month.month}`);
                this._initLoadMonth(_month.month - 1, _month.year);
            }
        })

    }

    _initLoadMonth(_month, _year) {
        let currentDateMoment = moment().set("month", _month).set('year', _year);
        let from = currentDateMoment.startOf('month').format('DD-MM-YYYY');
        let to = currentDateMoment.endOf('month').format('DD-MM-YYYY');
        this._getEventOfUser(from, to);
        let _tempToLoop = JSON.parse(JSON.stringify(this._baseActivitys));
        _tempToLoop.filter((a) => moment(a.start_at).isBefore(currentDateMoment.endOf('month'))).forEach((a) => {
            switch (a.notification_repeat) {
                case constants.daily:
                    return this._handleRepeatDaily(a, 0, _month, _year);
                case constants.weekly:
                    return this._handleRepeatWeekly(a, 0, _month, _year);
                case constants.monthly:
                    return this._handleRepeatMonthly(a, _month, _year);
                case constants.yearly: {
                    if (parseInt(moment().format('YYYY')) < _year && parseInt(moment(a.start_at).format('MM')) == months[0].month) {
                        return this._handleRepeatYearly(a, _year);
                    } else break;
                }

            }
        })
    }

    _handleOutside() {
        let { isSuggestLocation } = this.state;
        if (isSuggestLocation) this.setState({ isSuggestLocation: false })
        Keyboard.dismiss();
    }

    _onCloseModalSelectChild = () => { this.setState({ isSelectChildModalVisible: false }) };

    _renderDaySwipe() {
        return <View style={panelStyles.content}>
            <TouchableWithoutFeedback onPress={this._cancelViewEvent.bind(this)}>
                <View style={panelStyles.viewIconClose}>
                    <Icon name='chevron-down'
                        type='material-community'
                        color={mainColor.defaultEvent}
                        size={scale(26)} />
                </View>
            </TouchableWithoutFeedback>
            <View style={[panelStyles.viewTitle, {}]}>
                <StandardText title>{this.state.daySelected ? `${this.state.daySelected.day}.${this.state.daySelected.dayOfWeek}` : ''}</StandardText>
            </View>
            {Object.keys(this.state.detailItems).length > 0
                ? <View style={[panelStyles.viewContent, { paddingTop: scale(23) }]}>
                    {this._renderItemEvent()}
                </View>
                : <View style={panelStyles.viewContent1}>
                    <StandardText style={{ textAlign: 'center', marginTop: scale(40) }} title>일정이 없습니다</StandardText>
                </View>
            }

        </View>
    }

    _renderDaySwipe1() {
        return <View style={[panelStyles.itemDay, { flexDirection: 'row', justifyContent: 'center', paddingTop: scale(60), height: height - height / 11 - scale(40), width: width }]}>
            {JSON.stringify(this.state.detailItems) != '{}'
                ? this._renderItemEvent()
                : <StandardText style={{ textAlign: 'center', marginTop: scale(10) }} title>일정이 없습니다</StandardText>
            }
        </View>
    }

    _onSnapItem = (slideIndex) => {
        if (slideIndex < this._defaultIndexSwipe) {
            this._onSwipeDay('left');
            this._defaultIndexSwipe = slideIndex;
            if (slideIndex == 0) {
                this._carousel.snapToItem(11);
                this._defaultIndexSwipe = slideIndex;
            }
        } else if (slideIndex > this._defaultIndexSwipe) {
            if (this._defaultIndexSwipe != 0) {
                this._onSwipeDay('right');
            }
            this._defaultIndexSwipe = slideIndex;
        }
    }

    _onSnapItem1 = (slideIndex) => {
        if (slideIndex < this._defaultIndexSwipe1) {
            this._onSwipeDay('left');
            this._defaultIndexSwipe1 = slideIndex;
            if (slideIndex == 0) {
                this._carousel1.snapToItem(11);
                this._defaultIndexSwipe1 = slideIndex;
            }
        } else if (slideIndex > this._defaultIndexSwipe1) {
            if (this._defaultIndexSwipe1 != 0) {
                this._onSwipeDay('right');
            }
            this._defaultIndexSwipe1 = slideIndex;
        }
    }

    _genArrayNumber() {
        let _arr = []
        for (let i = 0; i <= 50; i++) {
            _arr.push(i);
        }
        return _arr;
    }

    async componentDidMount() {
        this.setState({
            dayCards: this._genArrayNumber()
        })
        this._onHeightChange();
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        if (this.props.child.list[0]) {
            await this._localActivityRepeate();
            await this._getEventOfUser();
            this.setState({ isHandling: false })
            this._getEventByDay(moment().format('YYYY-MM-DD'));
        } else {
            this.setState({ isHandling: false });
            noticeUtils.inform(noticeUtils.message.needCreateChild);
        }
    }

    _onHeightChange(_month) {
        let _focusMonth = _month ? moment().set('month', _month).startOf('month') : moment().startOf('month');
        let h30 = (height - height / 11) / 7.5;
        let h31 = (height - height / 11) / 9.5;
        let _m31 = [1, 3, 5, 7, 8, 10, 12].indexOf(parseInt(_focusMonth.format('MM')));
        if (_m31 != -1) {
            if (_focusMonth.isoWeekday() == 6 || _focusMonth.isoWeekday() == 7) {
                this.setState({ _heightOfDay: h31 });
            } else {
                this.setState({ _heightOfDay: h30 });
            }
        } else {
            if (_focusMonth.isoWeekday() == 7) {
                this.setState({ _heightOfDay: h31 });
            } else {
                this.setState({ _heightOfDay: h30 });
            }
        }
    }

    render() {
        if (this.state.isHandling) {
            return <View style={styles.container}>
                <LoadingScreen />
            </View>
        }
        const { daySelected, activity, typeSelectDate } = this.state;
        return (
            <View style={styles.container}>
                <Header screenProps={this.props}>캘린더</Header>
                <FloatButton
                    onPress={this._goCreateEvent.bind(this)}
                    icon={require('../../assets/icons/plusIcon.png')}
                    iconStyle={{ width: scale(27), height: scale(27) }}
                />
                {/* bottom sheet view event */}
                <ParallaxScrollView
                    backgroundColor="transparent"
                    contentBackgroundColor="transparent"
                    parallaxHeaderHeight={height - height / 11 - scale(40)}
                    renderStickyHeader={() => (
                        <View style={panelStyles.viewTitleSticky}>
                            <StandardText title>{daySelected ? daySelected.day + '.' + daySelected.dayOfWeek : ''}</StandardText>
                        </View>
                    )}
                    stickyHeaderHeight={scale(40)}
                    contentContainerStyle={{ paddingTop: scale(40) }}
                    renderForeground={() => (
                        <View style={{ flex: 1 }}>
                            <CalendarList
                                style={styles.calendar}
                                calendarWidth={width}
                                calendarHeight={height - height / 11}
                                horizontal={true}
                                pagingEnabled={true}
                                onVisibleMonthsChange={this._onChangeMonth.bind(this)}
                                pastScrollRange={36}
                                futureScrollRange={40}
                                showScrollIndicator={true}
                                hideExtraDays
                                firstDay={1}
                                monthFormat={'yyyy MMM'}
                                dayComponent={this._renderDay.bind(this)}
                                theme={styles.theme}
                                markingType="multi-dot"
                                markedDates={this.state.markedDates}
                            />
                        </View>
                    )}>
                    <Carousel
                        ref={(c) => { this._carousel1 = c }}
                        // containerCustomStyle={{ flex: 1}}
                        // contentContainerCustomStyle={{}}
                        data={this.state.dayCards}
                        firstItem={7}
                        lockScrollWhileSnapping
                        onSnapToItem={this._onSnapItem1}
                        renderItem={this._renderDaySwipe1.bind(this)}
                        sliderWidth={width}
                        itemWidth={width}
                    />
                </ParallaxScrollView>

                <BottomSheet
                    isVisible={this.state.isVisiblePanel}
                    onClose={this._onClosePanel.bind(this)}
                    swipeToClose={false}
                >
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        containerCustomStyle={{ flex: 1 }}
                        // contentContainerCustomStyle={{ flex: 1}}
                        data={this.state.dayCards}
                        firstItem={this.state.dayCards[25]}
                        lockScrollWhileSnapping
                        onSnapToItem={this._onSnapItem}
                        renderItem={this._renderDaySwipe.bind(this)}
                        sliderWidth={width}
                        itemWidth={width}
                    />

                </BottomSheet>
                {/* bottom sheet create event */}

                {/* <BottomSheet
                    isVisible={isVisibleCreate}
                    onClose={this._onCloseCreate.bind(this)}
                    // height={height}
                    swipeToClose={true}
                >

                    
                </BottomSheet> */}
                <DateTimePicker
                    mode="datetime"
                    datePickerModeAndroid="spinner"
                    date={new Date()}
                    isVisible={this.state.isVisibleTimePicker}
                    onConfirm={this._handleDatePicked.bind(this)}
                    onCancel={this._hideDateTimePicker.bind(this)}
                />
                <ModalBox
                    isOpen={this.state.isSelectChildModalVisible}
                    backdropOpacity={0.5}
                    style={[panelStyles.modalSelectChild]}
                    backdropPressToClose
                    position="center"
                    ref={"modalSelectChild"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalSelectChild.bind(this)}>
                    <View style={{ flex: 1 }}>
                        <PopupSelectChildSchedule
                            childs={this._handleChildForRadio()}
                            onAccept={this._goCreateActivity.bind(this)}
                            onCancel={this._onCloseModalSelectChild.bind(this)}
                        />
                    </View>
                </ModalBox>

            </View>
        )
    }

    _onCloseRepeatModal = () => this.setState({ isRepeatModalVisible: false })

    onBackButtonPressAndroid() {
        if (this.state.isSelectChildModalVisible || this.state.isRepeatModalVisible) {
            this.setState({
                // isVisibleCreate: false,
                // isVisiblePanel: false,
                isSelectChildModalVisible: false,
                isRepeatModalVisible: false
            });
            return true
        } else return false;
    };

    componentWillUnmount() {
        this.setState({
            optionLocationSelected: false,
            optionNoteSelected: false
        })
        this._monthLoadeds = [];
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
    }
}

function bindAction(dispatch) {
    return {

    };
}

const mapStateToProps = state => ({
    user: state.user,
    child: state.child,
    location: state.location
});

export default connect(mapStateToProps, bindAction)(Calendar);