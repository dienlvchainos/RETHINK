import React from 'react'
import { Platform } from 'react-native'
// import BackgroundTimer from 'react-native-background-timer'
import PushNotification from 'react-native-push-notification'
import moment from 'moment'
import sf from '../../libs/serviceFactory';
import { _findInArray } from '../../helpers';
import AppConfig from '../../config';
import { _detectReminder, _detectRepeat } from '../../utils/dateUtils';
import constants from '../../constants';
// import firebase from 'react-native-firebase';

export async function _initEvent(childs, userToken) {
    _from = moment().format('DD-MM-YYYY');
    _to = moment().add(45, 'days').format('DD-MM-YYYY');
    let scheduleRespon = await sf.getServices('CalendarService').getListEventByRange(_from, _to, userToken);
    for (let i = 0; i < scheduleRespon.data.length; i++) {
        let _reminder = _detectReminder(scheduleRespon.data[i].reminder, scheduleRespon.data[i].start_at);
        let _time = _reminder._time;
        let _sub = _reminder._reminder ? `in ${_reminder._reminder.time} ${_reminder._reminder.duration}` : '';
        if (scheduleRespon.data[i].notification_repeat == constants.none) {
            _createNotification(scheduleRespon.data[i].id, scheduleRespon.data[i].name, _sub, _time);
        } else {
            let _repeatType = _detectRepeat(scheduleRespon.data[i].notification_repeat);
            _createNotification(scheduleRespon.data[i].id, scheduleRespon.data[i].name, _sub, _time, _repeatType);
        }
    }
}

export function _createNotification(id, title, message, date, repeatType) {
    let _notify = {
        id: String(id),
        title,
        message,
        date: new Date(date.replace(' ', 'T')),
        visibility: 'public'
    }
    if (repeatType) _notify.repeatType = repeatType.value;
    PushNotification.localNotificationSchedule(_notify);
    if (__DEV__) {
        console.log("init notify", `${title} - ${date} - ${repeatType}`);
    }
}

export async function _initSchedule(childs, userToken) {
    PushNotification.cancelAllLocalNotifications()
    _from = moment().subtract(45, "days").format('DD-MM-YYYY');
    _to = moment().add(45, 'days').format('DD-MM-YYYY');
    let scheduleRespon = await sf.getServices('ScheduleService').getAllByDate(_from, _to, userToken);
    for (let i = 0; i < scheduleRespon.data.length; i++) {
        if (scheduleRespon.data[i].payment_date) {
            let _time = moment(scheduleRespon.data[i].payment_date).set(AppConfig.getTimeNotification());
            if (scheduleRespon.data[i].notification == 1 && moment().isBefore(_time)) {
                let _sub = `${scheduleRespon.data[i].subject} 에 대한 ${_findInArray(childs, 'id', scheduleRespon.data[i].child_id).name} 의 학비를 지불합니다`;
                _createNotification(`${scheduleRespon.data[i].edu_id}${scheduleRespon.data[i].child_id}`, scheduleRespon.data[i].name, _sub, _time.format('YYYY-MM-DD HH:mm'));
            }
        }
    }
}

export function _cancelLocalNotification() {
    PushNotification.cancelAllLocalNotifications();
}