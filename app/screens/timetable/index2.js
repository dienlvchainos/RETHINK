import React from 'react'
import { BackHandler, Alert, ScrollView, View, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, FlatList } from 'react-native'
import Modal from 'react-native-modalbox';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import BaseScreen from '../baseScreen';
import StandardText from '../../components/standardText';
import styles from './styles';
import modalStyles from './modalStyles';
import { Fonts, calendarColor } from '../../utils/styleUtils';
import sf from '../../libs/serviceFactory';
import { connect } from 'react-redux';
import moment from 'moment';
import { mainColor, buttonColor } from '../../utils/styleUtils';
import { Dimensions } from 'react-native';
import { _timeoutCancelHandling, _hexToRgbA, _shortText, _findInArray, _formatMoney, _asyncForEach } from '../../helpers';
import LoadingScreen from '../../components/loadingScreen';
import FloatButton from '../../components/floatButton';
import AdvanceInput from '../../components/advanceInput';
import SimpleButton from '../../components/simpleButton';
import Header from './header';
import noticeUtils from '../../utils/noticeUtils';
import SuggestComponent from '../../components/suggestComponent';
import PopupDetailTimetable from './popupDetailTimetable';
import PopupPasteTimetable from './popupPasteTimetable';
import PopupSelectChildSchedule from './popupSelectChildSchedule';
import PopupShareTimetable from './popupShareTimetable';
import Schedule from './SCHEDULE';

import { scale } from '../../utils/scalingUtils';
import constants from '../../constants';
import AppConfig from '../../config';
import { _getStorage } from '../../utils/storeUtils';
import { _createNotification, _removeNotification } from '../../utils/notifyUtils';
const width = Dimensions.get('window').width;
const DayOfWeeks = require('./editTime/dayOfWeek.json');

class Timetable extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = {
            isHandling: true,
            isOpenModal: false,
            isCopyModalVisible: false,
            isPasteModalVisible: false,
            isSelectChildModalVisible: false,
            isVisibleShare: false,
            switchValue: false,
            _arrEvents: [[], [], [], [], [], []],
            _flexEvent: [1, 1, 1, 1, 1, 1, 1],
            schedule: {
                name: '',
                subject: '',
                location: '',
                fee: 0,
                payment_date: '',
                notification: 0,
                start_at: '',
                end_at: '',
                child_id: ''
            },
            scheduleCopy: null,
            hourDatas: [],
            dayDatas: [],
            weekdays: '',
            timeSelected: {},
            daySelected: moment().format('DD-MM-YYYY'),
            childSelected: {
                id: -1,
                name: '같이보기',
                color: '#000'
            },
            childs: props.child.list,
            educations: [],
            locations: [],
            isSuggestEducation: false,
            isSuggestLocation: false,
            lessonsLimited: 8,
            imageCaptureDate: null
        }
    }

    dataEvents = [
        {
            dayOfWeek: 1,
            timeStart: 14,
            timeStart: 15,
        }
    ]

    timetableConfig = {};

    _renderItemTime = ({ item, index }) => {
        return <View style={[styles.itemTime, { height: scale(80), backgroundColor: index % 2 == 0 ? '#FFF' : buttonColor.bgInactive }]}>
            <StandardText style={styles.textTime}>{item.startTime}</StandardText>
            <StandardText style={styles.textTime}>{item.endTime}</StandardText>
        </View>
    }

    _renderHeader() {
        return this.state.dayDatas.map((item) => {
            return <View key={item.id} style={styles.itemDayOfWeek}>
                <StandardText small style={{ textAlign: 'center', ...Fonts.NanumBarunGothic_Bold, color: '#7C878E' }}>{item.title}</StandardText>
            </View>
        })
    }

    _setOrganization = (key, value) => {
        let { schedule } = this.state;
        if (key == 'fee') {
            let _value = value.split(',');
            let _arrVal = [].concat(..._value).join('');
            schedule[key] = Number(_arrVal);
        } else schedule[key] = value;
        if (schedule.edu_id && key != 'subject') {
            delete schedule.edu_id;
            this.setState({ schedule });
        } else this.setState({ schedule });
    }

    _onSwitchAlert = (_notify) => {
        if (_notify) {
            this._setOrganization("notification", "0");
        } else this._setOrganization("notification", "1");
        // this.setState({ switchValue: !this.state.switchValue });
    }

    _onValidOrganization() {
        let { schedule } = this.state;
        let _invalid = true;
        if (schedule.name != '' && schedule.subject != '' && schedule.location != '') {
            return _invalid;
        }
        return false;
    }

    _checkPermission(childId) {
        return new Promise((resolve) => {
            if (this.timetableInit) {
                if (childId) {
                    if (this.timetableInit.childPerms.indexOf(childId.toString()) != -1) return resolve();
                    return noticeUtils.inform(noticeUtils.message.unauthorized);
                } else {
                    if (this.timetableInit.perms == constants.permMaster) return resolve();
                    return noticeUtils.inform(noticeUtils.message.unauthorized);
                }
            } else return resolve();
        })
    }

    _doAllCreateSchedule(childId) {
        if (!childId) return noticeUtils.inform(noticeUtils.message.selectOneChild);
        this.childIdForAll = childId;
        this.setState({ isSelectChildModalVisible: false, isOpenModal: true, });
    }

    async _doCreateTimetable() {
        await this._checkPermission();
        this.setState({ isHandling: true });
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        let { schedule, timeSelected, daySelected, childSelected } = this.state;
        let childId = this.childIdForAll ? this.childIdForAll : childSelected.id;
        schedule.payment_date = moment(schedule.payment_date).format('DD-MM-YYYY HH:mm');
        schedule.start_at = moment(daySelected + ' ' + timeSelected.startTime, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm:ss');
        schedule.end_at = moment(daySelected + ' ' + timeSelected.endTime, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm:ss');
        schedule.child_id = Number(childId);
        if (this._eduSelected && this._eduSelected.subject != schedule.subject) {
            if (schedule.edu_id) delete schedule.edu_id
        }

        var userToken = this.props.user.apiKey;
        let response;
        if (this.isEditSchedule) {
            // edit schedule
            response = await sf.getServices("ScheduleService").updateSchedule(schedule, userToken);
        } else {
            // create schedule
            response = await sf.getServices("ScheduleService").create(schedule, userToken);
        }
        this.childIdForAll = null;
        this.setState({ isHandling: false, isOpenModal: false });
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && response.data.schedule_info && !response.data.error) {
            noticeUtils.inform(noticeUtils.message.success);
            this._resetForm();
            this._onUpdateEvent();
            this._registerReminder(`${response.data.schedule_info.edu_id}${schedule.child_id}`, schedule);
            this.isEditSchedule = false;
            this._eduSelected = null;
        } else {
            if (response.status == 422) {
                let errKeys = Object.keys(response.data);
                let msgError = '';
                errKeys.forEach((err) => {
                    msgError += response.data[err][0] + ', ';
                })
                noticeUtils.inform(msgError);
            } else noticeUtils.inform(noticeUtils.message.errorServer)
        }

    }

    _registerReminder(notifyId, schedule) {
        if (schedule.notification == 1 && schedule.payment_date) {
            let _time = moment(schedule.payment_date, 'DD-MM-YYYY HH:mm').set(AppConfig.getTimeNotification());
            if (moment().isBefore(_time)) {
                let _sub = `${schedule.subject} 에 대한 ${_findInArray(this.state.childs, 'id', schedule.child_id).name} 의 학비를 지불합니다`;
                _removeNotification(notifyId);
                _createNotification(notifyId, schedule.name, _sub, _time.format('YYYY-MM-DD HH:mm'));
            }
        }
    }

    // type = 1 is delete
    async _onUpdateEvent(typeUpdate) {
        let childSelected = this.state.childSelected;
        if (childSelected.id == -1) {
            await this._getScheduleForAll();
        } else {
            if (typeUpdate == 1) {
                const { hourDatas } = this.state;
                new Promise(async (resolve) => {
                    let _arrEvents = await this._generateEvents(this.timetableConfig, hourDatas);
                    this.setState({ _arrEvents });
                    resolve(_arrEvents);
                }).then(async (val) => await this._getSchedule())
            } else await this._getSchedule();
        }
    }

    _resetForm() {
        this.setState({
            schedule: new Schedule(),
        })
    }

    async _goEditTime() {
        await this._checkPermission();
        this.navigate('editTime', { _onUpdateTimetable: this._onUpdateTimetable.bind(this) });
    }

    async _onUpdateTimetable() {
        let { childSelected } = this.state;
        await this._getTimetableSetting();
        if (childSelected.id != -1) {
            this._getSchedule();
        } else {
            await this._getScheduleForAll();
        }
    }

    _onCloseModal = () => { this.setState({ isOpenModal: false }); this.isEditSchedule = false, this._eduSelected = null }

    _onCloseModalCopy = () => this.setState({ isCopyModalVisible: false });

    _onCloseModalPaste = () => this.setState({ isPasteModalVisible: false });

    _onCloseModalSelectChild = () => { this.setState({ isSelectChildModalVisible: false }) };

    _onCloseModalShare = () => this.setState({ isVisibleShare: false });

    _generateHours(settingTime) {
        let times = [];
        for (let i = 0; i < 7; i++) {
            if (i == 0) {
                times.push({
                    id: i,
                    startTime: moment(settingTime.start_time, 'HH:mm').format('HH:mm'),
                    endTime: moment(settingTime.start_time, 'HH:mm').add(settingTime.lesson_period, 'minutes').format('HH:mm')
                })
            } else {
                times.push({
                    id: i,
                    startTime: moment(times[i - 1].endTime, 'HH:mm').add(settingTime.break_period, 'minutes').format('HH:mm'),
                    endTime: moment(times[i - 1].endTime, 'HH:mm').add(settingTime.break_period, 'minutes').add(settingTime.lesson_period, 'minutes').format('HH:mm')
                })
            }
        }
        return Promise.resolve(times);
    }

    _generateDays(settingTime) {
        let data = [];
        let days = settingTime.weekdays.split(',');
        for (let i = 0; i < days.length; i++) {
            if (days[i]) {
                data.push({
                    id: DayOfWeeks[days[i] - 1].id,
                    title: DayOfWeeks[days[i] - 1].title
                })
            }
        }
        return Promise.resolve(data);
    }

    _generateEvents(settingTime, hourDatas) {
        let _arrEvents = [[], [], [], [], [], [], []];
        let dayNumbers = 23 - Number(moment(settingTime.start_time, 'HH:mm').format('HH'));
        if (dayNumbers >= 7) dayNumbers = 7;
        for (let j = 0; j <= _arrEvents.length - 1; j++) {
            for (let i = 0; i < dayNumbers; i++) {
                _arrEvents[j].push({
                    id: j.toString() + i.toString(),
                    title: '',
                    subject: '',
                    startTime: hourDatas[i].startTime,
                    endTime: hourDatas[i].endTime,
                    dayOfWeek: DayOfWeeks[j],
                    color: i % 2 == 0 ? buttonColor.bgWhite : buttonColor.bgInactive
                })
            }
        }
        return Promise.resolve(_arrEvents);
    }

    async _getTimetableSetting() {
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        let timetableSetting = this.props.navigation.state.params ? this.props.navigation.state.params.timetableSetting : null;
        if (timetableSetting) {
            let weekdays = timetableSetting.weekdays;
            this.timetableConfig = timetableSetting;
            this.timetableConfig.unitInMinute = timetableSetting.lesson_period / AppConfig.getScheduleHeight();
            let hourDatas = await this._generateHours(timetableSetting);
            let dayDatas = await this._generateDays(timetableSetting);
            // let _arrEvents = await this._generateEvents(timetableSetting, hourDatas);
            this.setState({ hourDatas, dayDatas, weekdays, lessonsLimited: timetableSetting.lessons });
        } else {
            const userToken = this.props.user.apiKey;
            let settingRespon = await sf.getServices('TimetableService').getSetting(userToken);
            clearTimeout(timeOut);
            if (settingRespon && settingRespon.status == 200 && settingRespon.data && settingRespon.data.start_time && !settingRespon.data.error) {
                let weekdays = settingRespon.data.weekdays;
                this.timetableConfig = settingRespon.data;
                this.timetableConfig.unitInMinute = settingRespon.data.lesson_period / AppConfig.getScheduleHeight();
                let hourDatas = await this._generateHours(settingRespon.data);
                let dayDatas = await this._generateDays(settingRespon.data);
                // let _arrEvents = await this._generateEvents(settingRespon.data, hourDatas);
                this.setState({ hourDatas, dayDatas, weekdays, lessonsLimited: settingRespon.data.lessons });
            } else {
                if (Object.keys(settingRespon.data).length == 0) {
                    noticeUtils.inform(noticeUtils.message.needConfigTimetable)
                    this.navigate('editTime');
                }
            }

        }
    }

    async _getSchedule(childSelected = this.state.childSelected) {
        let { _arrEvents, lessonsLimited } = this.state;
        let childId = childSelected.id;
        const userToken = this.props.user.apiKey;
        let _from = moment().startOf('isoWeek').format('DD-MM-YYYY');
        let _to = moment().endOf('isoWeek').format('DD-MM-YYYY');
        let scheduleRespon = await sf.getServices('ScheduleService').getByRange(childId, _from, _to, userToken);
        if (scheduleRespon && scheduleRespon.data && scheduleRespon.data) {
            let schedules = scheduleRespon.data;
            await _asyncForEach(schedules, async (schedule, i) => {
                let indexDayOfWeek = moment(schedule.start_at).isoWeekday();
                let indexTime = moment(schedule.start_at).format('HH:mm');
                // let indexRowTime = _arrEvents[indexDayOfWeek - 1].map((e) => e.startTime).indexOf(indexTime);

                _arrEvents[indexDayOfWeek - 1].push({
                    scheduleId: schedule.id,
                    title: schedule.name,
                    subject: schedule.subject,
                    fee: schedule.fee,
                    location: schedule.location,
                    paymentDate: schedule.payment_date,
                    notification: schedule.notification,
                    color: childSelected.color,
                    activity_id: schedule.activity_id,
                    edu_id: schedule.edu_id,
                    startTime: moment(schedule.start_at).format('HH:mm'),
                    endTime: moment(schedule.end_at).format('HH:mm'),
                    _top: (this.timetableConfig.unitInMinute * moment(schedule.start_at).diff(moment(`${moment(schedule.start_at).format('YYYY-MM-DD')} ${this.timetableConfig.start_time}`, 'YYYY-MM-DD HH:mm'), 'minutes')) + scale(50), // 50 is view day in week
                    _height: this.timetableConfig.unitInMinute * moment(schedule.end_at).diff(moment(schedule.start_at), 'minutes')
                })
                // if (childSelected.id == -1 || i < lessonsLimited) {
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].scheduleId = schedule.id;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].title = schedule.name;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].subject = schedule.subject;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].fee = schedule.fee;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].location = schedule.location;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].paymentDate = schedule.payment_date;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].notification = schedule.notification;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].color = childSelected.color;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].activity_id = schedule.activity_id;
                //     _arrEvents[indexDayOfWeek - 1][indexRowTime].edu_id = schedule.edu_id;
                // }
            })
            this.setState({ _arrEvents })
        }
    }

    _baseEvents(indexDay) {
        let settingTime = this.timetableConfig;
        let { hourDatas } = this.state;
        let _arr = [];
        let dayNumbers = 23 - Number(moment(settingTime.start_time, 'HH:mm').format('HH'));
        if (dayNumbers >= 7) dayNumbers = 7;
        for (let i = 0; i < dayNumbers; i++) {
            _arr.push({
                id: i.toString() + dayNumbers.toString() + i.toString(),
                title: '',
                subject: '',
                startTime: hourDatas[i].startTime,
                endTime: hourDatas[i].endTime,
                color: i % 2 == 0 ? buttonColor.bgWhite : buttonColor.bgInactive,
                dayOfWeek: DayOfWeeks[indexDay],
            })
        }
        return Promise.resolve(_arr);
    }

    async _preHandleEvent(arrE, indexDay) {
        let _arr = await this._baseEvents(indexDay);
        arrE.forEach((e) => {
            let indexTime = moment(e.startTime).format('HH:mm');
            let indexRowTime = _arr.map((ac) => ac.startTime).indexOf(indexTime);
            if (indexRowTime != -1) {
                _arr[indexRowTime].scheduleId = e.scheduleId;
                _arr[indexRowTime].title = e.title;
                _arr[indexRowTime].subject = e.subject;
                _arr[indexRowTime].fee = e.fee;
                _arr[indexRowTime].location = e.location;
                _arr[indexRowTime].notification = e.notification;
                _arr[indexRowTime].paymentDate = e.paymentDate;
                _arr[indexRowTime].color = e.color;
                _arr[indexRowTime].activity_id = e.activity_id;
                _arr[indexRowTime].edu_id = e.edu_id;
            }
        })
        return Promise.resolve(_arr);
    }

    async _getScheduleForAll() {
        this.setState({ isHandling: true });
        let _flexEvent = [1, 1, 1, 1, 1, 1, 1];
        let _arrEvents = [[], [], [], [], [], [], []];
        let _results = await this._handleScheduleAll();
        setTimeout(() => {
            _results.forEach((arrOfChilds, aindex) => {
                arrOfChilds.forEach(async (eventOfChild, eindex) => {
                    if (eventOfChild.length > 0) {
                        eventOfChild = await this._preHandleEvent(eventOfChild, eindex);
                        if (_arrEvents[eindex].length == 0) {
                            _arrEvents[eindex] = _arrEvents[eindex].concat(eventOfChild);
                        } else {
                            let _temp = _arrEvents[eindex];
                            if (Array.isArray(_temp[0])) {
                                _arrEvents[eindex].push(eventOfChild)
                            } else {
                                _arrEvents[eindex] = [_temp, eventOfChild];
                            }
                        }
                    }
                });
            });
            setTimeout(() => {
                _arrEvents.forEach(async (e, eindex) => {
                    _flexEvent[eindex] = (e.length == 0 || e.length == 7) ? 1 : e.length;
                    if (e.length == 0) {
                        _arrEvents[eindex] = await this._baseEvents(eindex)
                    }
                });
                this.setState({ _flexEvent });
                setTimeout(() => {
                    this.setState({ _arrEvents, isHandling: false });
                }, 1000)
            }, 500)
        }, 1000)
    }

    _handleScheduleAll() {
        return new Promise((resolve) => {
            let results = [];
            const userToken = this.props.user.apiKey;
            let _from = moment().startOf('isoWeek').format('DD-MM-YYYY');
            let _to = moment().endOf('isoWeek').format('DD-MM-YYYY');
            this.state.childs.forEach(async (c) => {
                let _eventOfChild = [[], [], [], [], [], [], []];
                let childId = c.id;
                let scheduleRespon = await sf.getServices('ScheduleService').getByRange(childId, _from, _to, userToken);
                if (scheduleRespon && scheduleRespon.data && !scheduleRespon.data.error) {
                    let schedule = scheduleRespon.data;
                    for (let i = 0; i <= schedule.length - 1; i++) {
                        let indexDayOfWeek = moment(schedule[i].start_at).isoWeekday();
                        _eventOfChild[indexDayOfWeek - 1].push({
                            id: c.id.toString() + i,
                            scheduleId: schedule[i].id,
                            title: schedule[i].name,
                            subject: schedule[i].subject,
                            fee: schedule[i].fee,
                            location: schedule[i].location,
                            notification: schedule[i].notification,
                            paymentDate: schedule[i].payment_date,
                            color: c.color,
                            startTime: schedule[i].start_at,
                            endTime: schedule[i].end_at,
                            activity_id: schedule[i].activity_id
                        });
                    }
                }
                results.push(_eventOfChild);
            });
            return resolve(results);
        })
    }

    _renderWeekdayOfChild({ item, index }) {
        if (item[0]) {
            return <View style={{ flex: 1 }}>
                {item.map((_item) => {
                    return <TouchableWithoutFeedback key={_item.id}
                        onPress={this._onClickTimetable.bind(this, _item)}
                        onLongPress={this._onCopySchedule.bind(this, _item)}
                    >
                        <View style={[
                            styles.itemEvent,
                            !_item.activity_id ? { borderTopColor: _item.color, borderBottomColor: _item.color } : { borderTopWidth: 0, borderBottomWidth: 0 },
                            { borderRightColor: calendarColor.border },
                            _item.title ? { backgroundColor: _hexToRgbA(_item.color) } : { backgroundColor: _item.color || '#fff' }]}>
                            {!!_item.subject && <StandardText small bold style={[styles.textEventSubject, { color: _item.color }]}>{_shortText(_item.subject, 16)}</StandardText>}
                            <StandardText small bold style={[styles.textEvent, _item.title ? { color: _item.color } : {}]}>{_shortText(_item.title, 16)}</StandardText>
                        </View>
                    </TouchableWithoutFeedback>
                })}
            </View>
        } else {
            return <TouchableWithoutFeedback key={item.id}
                onPress={this._onClickTimetable.bind(this, item)}
                onLongPress={this._onCopySchedule.bind(this, item)}
            // onLongPress={this._onClickTimetable.bind(this, item)}
            >
                <View style={[
                    { position: 'absolute', left: 100, top: 60, height: 100, zIndex: 99999 },
                    styles.itemEvent,
                    !item.activity_id ? { borderTopColor: item.color, borderBottomColor: item.color } : { borderTopWidth: 0, borderBottomWidth: 0 },
                    { borderRightColor: calendarColor.border },
                    item.title ? { backgroundColor: _hexToRgbA(item.color) } : { backgroundColor: item.color || '#fff' }]}>
                    {!!item.subject && <StandardText small bold style={[styles.textEventSubject, { color: item.color }]}>{_shortText(item.subject, 16)}</StandardText>}
                    <StandardText small bold style={[styles.textEvent, item.title ? { color: item.color } : {}]}>{_shortText(item.title, 16)}</StandardText>
                </View>
            </TouchableWithoutFeedback>
        }
    }

    _isRenderDayOfWeek(dayOfWeek) {
        let weekdays = this.state.weekdays.split(',');
        if (weekdays.indexOf(dayOfWeek.toString()) != -1) {
            return true;
        }
        return false;
    }

    _renderDayOfWeek(dayOfWeek) {
        return <View style={styles.itemDayOfWeek}>
            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', dayOfWeek).title}</StandardText>
        </View>
    }

    async _onClickTimetable(timeSelected) {
        if (!timeSelected.activity_id) {
            let daySelected = moment().isoWeekday(timeSelected.dayOfWeek.id).format('YYYY-MM-DD');
            this.setState({ timeSelected, daySelected });
            // create schedule
            if (timeSelected.title == '') {
                await this._checkPermission();
                if (this.state.childs.length <= 0) return noticeUtils.inform(noticeUtils.message.needCreateChild);
                let schedule = new Schedule();
                schedule.payment_date = daySelected;
                this.setState({
                    schedule
                });
                if (this.state.childSelected.id == -1) {
                    this.setState({ isSelectChildModalVisible: true })
                } else {
                    this.setState({ isOpenModal: true });
                }
            } else {
                // detail schedule
                this.setState({
                    schedule: {
                        ...timeSelected,
                        id: timeSelected.scheduleId,
                        name: timeSelected.title,
                        payment_date: moment(timeSelected.paymentDate).format('YYYY-MM-DD')
                    },
                    isOpenModal: true
                });
                this.isEditSchedule = true;
            }
        } else {
            // noticeUtils.inform(noticeUtils.message.noShowEvent)
        }
    }

    async _onCopySchedule(timeSelected) {
        this.setState({ timeSelected });
        await this._checkPermission();
        if (timeSelected.title) {
            if (!timeSelected.activity_id) {
                this.setState({
                    isCopyModalVisible: true
                });
            }
        } else {
            if (this.state.scheduleCopy) {
                this.setState({
                    isPasteModalVisible: true
                });
            } else {
                noticeUtils.inform(noticeUtils.message.noExistsCopy)
            }
        }
    }

    async _onChildSelected(childSelected) {
        if (childSelected.id != -1) {
            await this._checkPermission(childSelected.id);
            const { hourDatas } = this.state;
            this.childIdForAll = null;
            let _arrEvents = await this._generateEvents(this.timetableConfig, hourDatas);
            this.setState({
                childSelected,
                _arrEvents, _flexEvent: [1, 1, 1, 1, 1, 1, 1]
            }, () => this._getSchedule(childSelected));
        } else {
            this.setState({ childSelected })
            this._getScheduleForAll()
        }
    }

    async _onChangeName(_name) {
        if (this.state.schedule.edu_id) {
            let schedule = this.state.schedule;
            delete schedule.edu_id;
            this.setState({ schedule });
        }
        this._setOrganization('name', _name);
        const userToken = this.props.user.apiKey;
        let eduRespon = await sf.getServices('EducationService').findByName(_name, userToken);
        if (eduRespon && eduRespon.status == 200 && eduRespon.data && !eduRespon.data.error) {
            if (eduRespon.data.length > 0) {
                this.setState({ educations: eduRespon.data });
                if (!this.state.isSuggestEducation) this.setState({ isSuggestEducation: true })
                if (this.state.isSuggestLocation) this.setState({ isSuggestLocation: false })

            }
        } else {
            noticeUtils.inform(noticeUtils.message.errorServer);
        }
    }
    async _searchAddress(_address) {
        this._setOrganization("location", _address);
        let position = this.props.location;
        if (position.latitude && position.longitude) {
            let coordinate = `${position.longitude.toString()},${position.latitude.toString()}`;
            // let coordinate = '127.1054328,37.3595963';
            let respon = await sf.getServices('UserService')._naverSearchAddress(_address, coordinate);
            if (respon && respon.data && respon.status == 200 && respon.data.status == 'OK') {
                let locations = respon.data.places.filter((p) => p.road_address != '').map((p) => {
                    return {
                        address: p.road_address
                    }
                })
                this.setState({ locations });
                if (this.state.isSuggestEducation) this.setState({ isSuggestEducation: false })
                if (!this.state.isSuggestLocation) this.setState({ isSuggestLocation: true })
            }
        }
    }

    _selectAddress(address) {
        this._setOrganization("location", address.address);
        this.setState({ isSuggestLocation: false })
    }

    async _focusOpenEducation() {
        const userToken = this.props.user.apiKey;
        let eduRespon = await sf.getServices('EducationService').getList(userToken);
        if (eduRespon && eduRespon.status == 200 && eduRespon.data && !eduRespon.data.error) {
            if (eduRespon.data.length > 0) {
                this.setState({ educations: eduRespon.data });
            }
        } else {
            noticeUtils.inform(noticeUtils.message.errorServer);
        }
    }

    _selectEdu(schedule) {
        this.setState({
            schedule: Object.assign(this.state.schedule, { ...schedule, edu_id: schedule.id, subject: '' }),
            isSuggestEducation: false
        });
        this._eduSelected = schedule;
    }

    _renderChildList() {
        let childs = this.state.childs;
        return childs.map((c) => {
            return <TouchableWithoutFeedback key={c.id}>
                <View style={styles.childPicker}>
                    <StandardText title>{c.name}</StandardText>
                </View>
            </TouchableWithoutFeedback>
        })
    }

    _checkChildExist() {
        let _childs = this.state.childs;
        if (_childs.length == 0) {
            return Promise.resolve(false);
        } else {
            return Promise.resolve(true);
        }
    }

    async _callbackCreateChild() {
        await this._getTimetableSetting();
        this.setState({ childSelected: this.state.childs[0] }, async () => await this._getSchedule());
    }

    _handleOutside() {
        let { isSuggestEducation, isSuggestLocation } = this.state;
        if (isSuggestEducation) this.setState({ isSuggestEducation: false })
        if (isSuggestLocation) this.setState({ isSuggestLocation: false })
        Keyboard.dismiss();
    }

    _doCopySchedule(scheduleCopy) {
        scheduleCopy.child_id = this.state.childSelected.id;
        this.setState({ scheduleCopy, isCopyModalVisible: false });
    }

    async _doPasteSchedule(schedulePaste) {
        if (schedulePaste.child_id == -1) return noticeUtils.inform(noticeUtils.message.selectOneChild);
        // paste schedule
        this.setState({ isHandling: true, isPasteModalVisible: false });
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        let userToken = this.props.user.apiKey;
        let { timeSelected } = this.state;
        let daySelected = moment().isoWeekday(timeSelected.dayOfWeek.id).format('YYYY-MM-DD');
        let schedule = {
            child_id: schedulePaste.child_id,
            name: schedulePaste.title,
            subject: schedulePaste.subject,
            location: schedulePaste.location,
            fee: schedulePaste.fee,
            notification: schedulePaste.notification,
            payment_date: moment(schedulePaste.paymentDate, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm'),
            start_at: moment(daySelected + ' ' + timeSelected.startTime, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm:ss'),
            end_at: moment(daySelected + ' ' + timeSelected.endTime, 'YYYY-MM-DD HH:mm').format('DD-MM-YYYY HH:mm:ss')
        }
        if (schedulePaste.edu_id) {
            schedule.edu_id = parseInt(schedulePaste.edu_id)
        }
        let response = await sf.getServices("ScheduleService").create(schedule, userToken);
        this.setState({ isHandling: false, scheduleCopy: null });
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && !response.data.error) {
            noticeUtils.inform(noticeUtils.message.success);
            _removeNotification(`${schedulePaste.edu_id}${schedulePaste.child_id}`);
            this._registerReminder(`${schedulePaste.edu_id}${schedulePaste.child_id}`, schedulePaste);
            this._onUpdateEvent();
        } else {
            if (response.status == 422) {
                let errKeys = Object.keys(response.data);
                let msgError = '';
                errKeys.forEach((err) => {
                    msgError += response.data[err][0] + ', ';
                })
                noticeUtils.inform(msgError);
            } else noticeUtils.inform(noticeUtils.message.errorServer)
        }
    }

    _goDeleteSchedule(scheduleDelete) {
        Alert.alert(
            '이 일정은 삭제됩니다',
            scheduleDelete.title,
            [
                {
                    text: '취소',
                    onPress: () => this.setState({ isCopyModalVisible: false }),
                    style: 'cancel',
                },
                { text: '삭제', onPress: () => this._doDeleteSchedule(scheduleDelete) },
            ],
            { cancelable: false },
        );
    }

    async _doDeleteSchedule(scheduleDelete) {
        this.setState({ isHandling: true, isCopyModalVisible: false });
        let timeOut = _timeoutCancelHandling(() => this.setState({ isHandling: false }));
        let userToken = this.props.user.apiKey;
        let response = await sf.getServices("ScheduleService").deleteSchedule(scheduleDelete.scheduleId, userToken);
        this.setState({ isHandling: false });
        clearTimeout(timeOut);
        if (response && response.status == 200 && response.data && !response.data.error) {
            noticeUtils.inform(noticeUtils.message.success);
            this._onUpdateEvent(1);
            _removeNotification(`${scheduleDelete.edu_id}${scheduleDelete.child_id}`);
        } else {
            if (response.status == 422) {
                let errKeys = Object.keys(response.data);
                let msgError = '';
                errKeys.forEach((err) => {
                    msgError += response.data[err][0] + ', ';
                })
                noticeUtils.inform(msgError);
            } else noticeUtils.inform(noticeUtils.message.errorServer)
        }
    }

    _doCancelPasteSchedule() {
        this.setState({ isPasteModalVisible: false });
    }

    _goShare() {
        this.setState({ isVisibleShare: true })
    }

    _doShare(optionShare) {
        this.setState({ isVisibleShare: false }, async () => {
            if (optionShare == 0) {
                let { imageCaptureDate } = this.state;
                if (!imageCaptureDate) {
                    this.refs.viewShot.capture('viewShot').then(uri => {
                        this.simpleShare(uri);
                    });
                } else {
                    this.simpleShare(imageCaptureDate);
                }
            } else {
                this.navigate('shareSchedule');
            }

        });
    }

    onCapture(imageCaptureDate) {
        this.setState({ imageCaptureDate });
    }

    simpleShare(_url) {
        let options = {
            url: "data:image/png;base64," + _url,
            title: '초대하기'
        }
        Share.open(options)
            .then((res) => { })
            .catch((err) => { err && console.log(err); });
    }

    _renderRowCopy = (item, index) => {
        return <View>
            <StandardText bold>{item.title}</StandardText>
        </View>
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

    _notificationState(_notify) {
        if (_notify == 1) return true;
        return false;
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid.bind(this));
        await this._getTimetableSetting();
        if (this.props.navigation.state.params && this.props.navigation.state.params.childPerms) {
            /**
             * handle view shared timetable
             */
            let { childPerms, perms, owner } = this.props.navigation.state.params;
            const userToken = this.props.user.apiKey;
            let sharedChildResp = await sf.getServices("ChildService").getSharedChilds(userToken);
            if (sharedChildResp && sharedChildResp.status == 200 && sharedChildResp.data) {
                this.timetableInit = {
                    childPerms,
                    perms,
                    owner
                }
                if (perms == constants.permMaster) {
                    let _childs = sharedChildResp.data.master_permission_children.filter((c) => c.user_id == owner);
                    this.setState({
                        childs: _childs,
                        childSelected: _childs[0]
                    }, async () => await this._getSchedule());
                } else {
                    let _childs = sharedChildResp.data.view_permission_children.filter((c) => c.user_id == owner);
                    this.setState({
                        childs: _childs,
                        childSelected: _childs[0]
                    }, async () => await this._getSchedule());
                }
                this.setState({ isHandling: false });
            } else {
                noticeUtils.inform(noticeUtils.message.unauthorized);
                return this.props.navigation.goBack(null);
            }
        } else {
            if (this.state.childs[0]) {
                this.setState({ childSelected: this.state.childs[0] }, async () => await this._getSchedule());
            } else noticeUtils.inform(noticeUtils.message.needCreateChild);
            this.setState({ isHandling: false });
        }
    }

    render() {
        const { isHandling, schedule, hourDatas, timeSelected } = this.state;
        if (isHandling) {
            return <View style={styles.container}>
                <LoadingScreen />
            </View>
        }
        return (
            <View style={{ flex: 1 }}>
                <ViewShot ref="viewShot" options={{ format: "png", quality: 1, result: 'base64' }} style={{ flex: 1 }}>
                    {/* <ViewShot ref="viewShot" captureMode="mount" onCapture={this.onCapture.bind(this)} options={{ format: "jpg", quality: 0.9, result: 'base64' }} style={{ flex: 1 }}> */}
                    <Header screenProps={this.props}
                        rightButtonText="설정"
                        rightAction={this._goEditTime.bind(this)}
                        childs={this.state.childs}
                        childSelected={this.state.childSelected}
                        onChildSelect={this._onChildSelected.bind(this)} />

                    <View style={{ flex: 9, flexDirection: 'row', overflow: 'hidden' }}>
                        <ScrollView contentContainerStyle={{ flexDirection: 'row' }}>
                            <View style={styles.viewTime}>
                                <FlatList
                                    data={hourDatas}
                                    style={{ backgroundColor: buttonColor.bgWhite }}
                                    keyExtractor={(item, index) => String(item.id)}
                                    ListHeaderComponent={() => (
                                        <View style={styles.itemDayOfWeek}></View>
                                    )}
                                    renderItem={this._renderItemTime}
                                />
                            </View>
                            <ScrollView horizontal={true}>
                                <View style={styles.viewEvent}>
                                    {this._isRenderDayOfWeek(1) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[0] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 1).title}</StandardText>
                                        </View>
                                        <FlatList
                                            key={this.state._flexEvent[0] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite, position: 'absolute' }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[0]}
                                            numColumns={this.state._flexEvent[0] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 1)}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        />
                                    </View>}
                                    {this._isRenderDayOfWeek(2) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[1] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 2).title}</StandardText>
                                        </View>
                                        {this.state._arrEvents[1].map((item, index) => {
                                            return <TouchableWithoutFeedback key={index}
                                                onPress={this._onClickTimetable.bind(this, item)}
                                                onLongPress={this._onCopySchedule.bind(this, item)}
                                            >
                                                <View style={[
                                                    { position: 'absolute', top: 10, height: 100, zIndex: 99999 },
                                                    styles.itemEvent,
                                                    !item.activity_id ? { borderTopColor: item.color, borderBottomColor: item.color } : { borderTopWidth: 0, borderBottomWidth: 0 },
                                                    { borderRightColor: calendarColor.border },
                                                    item.title ? { backgroundColor: _hexToRgbA(item.color) } : { backgroundColor: item.color || '#fff' }]}>
                                                    {!!item.subject && <StandardText small bold style={[styles.textEventSubject, { color: item.color }]}>{_shortText(item.subject, 16)}</StandardText>}
                                                    <StandardText small bold style={[styles.textEvent, item.title ? { color: item.color } : {}]}>{_shortText(item.title, 16)}</StandardText>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        })}
                                        {/* <FlatList
                                            key={this.state._flexEvent[1] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite, overflow: 'hidden' }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[1]}
                                            numColumns={this.state._flexEvent[1] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 2)}
                                            // ListHeaderComponent={() => (
                                            //     <View style={styles.itemDayOfWeek}>
                                            //         <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 2).title}</StandardText>
                                            //     </View>
                                            // )}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        /> */}
                                    </View>}
                                    {this._isRenderDayOfWeek(3) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[2] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 3).title}</StandardText>
                                        </View>
                                        <FlatList
                                            key={this.state._flexEvent[2] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite, position: 'absolute' }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[2]}
                                            numColumns={this.state._flexEvent[2] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 3)}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        />
                                    </View>}
                                    {this._isRenderDayOfWeek(4) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[3] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 4).title}</StandardText>
                                        </View>
                                        <FlatList
                                            key={this.state._flexEvent[3] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[3]}
                                            numColumns={this.state._flexEvent[3] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 4)}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        />
                                    </View>}
                                    {this._isRenderDayOfWeek(5) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[4] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 5).title}</StandardText>
                                        </View>
                                        <FlatList
                                            key={this.state._flexEvent[4] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[4]}
                                            numColumns={this.state._flexEvent[4] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 5)}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        />
                                    </View>}
                                    {this._isRenderDayOfWeek(6) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[5] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 6).title}</StandardText>
                                        </View>
                                        <FlatList
                                            key={this.state._flexEvent[5] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[5]}
                                            numColumns={this.state._flexEvent[5] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 6)}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        />
                                    </View>}
                                    {this._isRenderDayOfWeek(7) && <View style={[styles.viewItemEvent, { width: ((width - width / 9) / this.state.dayDatas.length) * this.state._flexEvent[6] }]}>
                                        <View style={styles.itemDayOfWeek}>
                                            <StandardText bold small style={{ textAlign: 'center', color: '#7C878E' }}>{_findInArray(this.state.dayDatas, 'id', 7).title}</StandardText>
                                        </View>
                                        <FlatList
                                            key={this.state._flexEvent[6] || 1}
                                            style={{ backgroundColor: buttonColor.bgWhite }}
                                            extraData={this.state}
                                            data={this.state._arrEvents[6]}
                                            numColumns={this.state._flexEvent[6] || 1}
                                            keyExtractor={(item, index) => String(index)}
                                            // ListHeaderComponent={this._renderDayOfWeek.bind(this, 7)}
                                            renderItem={this._renderWeekdayOfChild.bind(this)}
                                        />
                                    </View>}
                                </View>
                            </ScrollView>
                        </ScrollView>
                    </View>
                </ViewShot>
                <Modal
                    isOpen={this.state.isCopyModalVisible}
                    backdropOpacity={0.5}
                    style={[modalStyles.modalCopy]}
                    position="center"
                    ref={"modalCopy"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalCopy.bind(this)}>
                    <View style={{ flex: 1 }}>
                        <PopupDetailTimetable
                            schedule={this.state.timeSelected}
                            onCopy={this._doCopySchedule.bind(this)}
                            onDelete={this._goDeleteSchedule.bind(this)}
                        />
                    </View>
                </Modal>
                <Modal
                    isOpen={this.state.isPasteModalVisible}
                    backdropOpacity={0.5}
                    style={[modalStyles.modalPaste]}
                    position="center"
                    ref={"modalPaste"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalPaste.bind(this)}>
                    <View style={{ flex: 1 }}>
                        <PopupPasteTimetable
                            childs={this._handleChildForRadio()}
                            schedule={this.state.scheduleCopy}
                            onPaste={this._doPasteSchedule.bind(this)}
                            onCancel={this._doCancelPasteSchedule.bind(this)}
                        />
                    </View>
                </Modal>
                <Modal
                    isOpen={this.state.isSelectChildModalVisible}
                    backdropOpacity={0.5}
                    style={[modalStyles.modalPaste]}
                    position="center"
                    ref={"modalSelectChild"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalSelectChild.bind(this)}>
                    <View style={{ flex: 1 }}>
                        <PopupSelectChildSchedule
                            childs={this._handleChildForRadio()}
                            onAccept={this._doAllCreateSchedule.bind(this)}
                            onCancel={this._onCloseModalSelectChild.bind(this)}
                        />
                    </View>
                </Modal>
                <Modal
                    isOpen={this.state.isOpenModal}
                    position="bottom"
                    backdropOpacity={0.5}
                    style={[modalStyles.modal]}
                    ref={"modal"}
                    swipeToClose={true}
                    onClosed={this._onCloseModal.bind(this)}>
                    <TouchableWithoutFeedback onPress={this._handleOutside.bind(this)} accessible={false}>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior="padding"
                        >
                            <View style={modalStyles.containderModal}>
                                <View style={modalStyles.headerModal}>
                                    <StandardText large>교육기관등록</StandardText>
                                </View>
                                <View style={modalStyles.contentModal}>
                                    <View style={modalStyles.viewTimePicked}>
                                        <StandardText bold>
                                            {timeSelected.dayOfWeek && timeSelected.dayOfWeek.title} {timeSelected.startTime}~{timeSelected.endTime}
                                        </StandardText>
                                    </View>
                                    <AdvanceInput
                                        title="기관명"
                                        rightIcon={schedule.name ? require('../../assets/icons/searchActive.png') : require('../../assets/icons/searchInactive.png')}
                                        propComponent={{
                                            placeholder: '기관명',
                                            placeholderTextColor: mainColor.placeholder,
                                            returnKeyType: 'done',
                                            onSubmitEditing: () => this.setState({ isSuggestEducation: false })
                                        }}
                                        value={schedule.name}
                                        style={{
                                            flex: 1,
                                            borderColor: schedule.name ? buttonColor.borderActive : mainColor.inputBorder
                                        }}
                                        // onFocus={this._focusOpenEducation.bind(this)}
                                        onChangeText={this._onChangeName.bind(this)}
                                        focusStyle={{ borderColor: buttonColor.borderActive }} />

                                    <SuggestComponent
                                        visible={this.state.isSuggestEducation}
                                        data={this.state.educations}
                                        onSelect={this._selectEdu.bind(this)} />

                                    <AdvanceInput
                                        title="위치"
                                        rightIcon={schedule.location ? require('../../assets/icons/addressActive.png') : require('../../assets/icons/addressInactive.png')}
                                        propComponent={{
                                            placeholder: '위치',
                                            placeholderTextColor: mainColor.placeholder
                                        }}
                                        value={schedule.location}
                                        style={{
                                            flex: 1,
                                            borderColor: schedule.location ? buttonColor.borderActive : mainColor.inputBorder
                                        }}
                                        onChangeText={this._searchAddress.bind(this)}
                                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                                    <SuggestComponent
                                        containerStyle={{ top: scale(122), left: '4%', right: '4%' }}
                                        visible={this.state.isSuggestLocation}
                                        data={this.state.locations}
                                        onSelect={this._selectAddress.bind(this)} />
                                    <AdvanceInput
                                        title="과목"
                                        rightIcon={schedule.subject ? require('../../assets/icons/subjectActive.png') : require('../../assets/icons/subjectInactive.png')}
                                        propComponent={{
                                            placeholder: '과목',
                                            placeholderTextColor: mainColor.placeholder
                                        }}
                                        value={schedule.subject}
                                        style={{
                                            flex: 1,
                                            borderColor: schedule.subject ? buttonColor.borderActive : mainColor.inputBorder
                                        }}
                                        onChangeText={this._setOrganization.bind(this, "subject")}
                                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                                    <AdvanceInput
                                        title="월 비용"
                                        propComponent={{
                                            placeholder: '월 비용',
                                            placeholderTextColor: mainColor.placeholder,
                                            keyboardType: 'numeric'
                                        }}
                                        value={_formatMoney(schedule.fee).toString()}
                                        hintText="원"
                                        style={{
                                            flex: 1,
                                            borderColor: schedule.fee ? buttonColor.borderActive : mainColor.inputBorder
                                        }}
                                        onChangeText={this._setOrganization.bind(this, "fee")}
                                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                                    <AdvanceInput
                                        title="납입일"
                                        rightIcon={require("../../assets/icons/pickDate.png")}
                                        propComponent={{
                                            placeholder: '납입일',
                                            placeholderTextColor: mainColor.placeholder,
                                            // editable: false
                                        }}
                                        style={{
                                            flex: 1,
                                            borderColor: schedule.payment_date ? buttonColor.borderActive : mainColor.inputBorder
                                        }}
                                        isDatePicker
                                        onDateReturn={this._setOrganization.bind(this, "payment_date")}
                                        value={schedule.payment_date}
                                        focusStyle={{ borderColor: buttonColor.borderActive }} />
                                    <AdvanceInput
                                        title="납입일 (알람설정)"
                                        style={{
                                            flex: 1,
                                            marginTop: scale(2)
                                        }}
                                        onSwitch={this._onSwitchAlert.bind(this)}
                                        switchValue={this._notificationState(schedule.notification)} />
                                    <View style={modalStyles.btn}>
                                        <SimpleButton
                                            onPress={this._doCreateTimetable.bind(this)}
                                            propComponent={{
                                                underlayColor: buttonColor.underlay,
                                                disabled: !this._onValidOrganization()
                                            }}
                                            style={this._onValidOrganization() ? modalStyles.btnActiveStyle : modalStyles.btnInactiveStyle}
                                            textStyle={this._onValidOrganization() ? modalStyles.textActiveStyle : modalStyles.textInactiveStyle}>등록</SimpleButton>
                                    </View>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </Modal>
                <Modal
                    isOpen={this.state.isVisibleShare}
                    backdropOpacity={0.5}
                    style={[modalStyles.modalShare]}
                    position="center"
                    ref={"modalShare"}
                    swipeToClose={true}
                    onClosed={this._onCloseModalShare.bind(this)}>
                    <View style={{ flex: 1 }}>
                        <PopupShareTimetable
                            ref="timetableShare"
                            onShareSelect={this._doShare.bind(this)} />
                    </View>
                </Modal>
                {(!this.state.isOpenModal && !this.timetableInit) && <FloatButton
                    icon={require('../../assets/icons/share1.png')}
                    iconStyle={{ width: scale(23), height: scale(27) }}
                    onPress={this._goShare.bind(this)}
                />}
            </View>
        )
    }

    onBackButtonPressAndroid() {
        if (this.state.isOpenModal || this.state.isVisibleShare) {
            this.setState({
                isOpenModal: false,
                isVisibleShare: false
            });
            return true
        } else return false;
    };

    componentWillUnmount() {
        if (this.state.scheduleCopy) {
            this.setState({ scheduleCopy: null })
        }
        if (this.state.isHandling) {
            this.setState({ isHandling: false });
        }
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

export default connect(mapStateToProps, bindAction)(Timetable);