
import PushNotification from 'react-native-push-notification'

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
        console.log("init notify", `${id} - ${title} - ${date} - ${repeatType}`);
    }
}

export function _removeNotification(id) {
    PushNotification.cancelLocalNotifications({ id: String(id) });
    if (__DEV__) {
        console.log("remove notify", `${id}`);
    }
}