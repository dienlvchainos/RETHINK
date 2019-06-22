import moment from 'moment';

const WEEKDAYS = [
    {
        "id": 1,
        "title": "월"
    },
    {
        "id": 2,
        "title": "화"
    },
    {
        "id": 3,
        "title": "수"
    },
    {
        "id": 4,
        "title": "목"
    },
    {
        "id": 5,
        "title": "금"
    },
    {
        "id": 6,
        "title": "토"
    },
    {
        "id": 7,
        "title": "일"
    }
]

export function _getDayOfWeek(dayOfWeek) {
    return WEEKDAYS[dayOfWeek - 1].title;
}

const REMINDERS = [
    { value: 'once', time: 0, duration: 'second' },
    { value: '5m', time: 5, duration: 'minutes' },
    { value: '10m', time: 10, duration: 'minutes' },
    { value: '15m', time: 15, duration: 'minutes' },
    { value: '30m', time: 30, duration: 'minutes' },
    { value: '1h', time: 1, duration: 'hour' },
    { value: '2h', time: 2, duration: 'hours' },
    { value: '3h', time: 3, duration: 'hours' },
    { value: '12h', time: 12, duration: 'hours' },
    { value: '1d', time: 1, duration: 'day' },
    { value: '2d', time: 1, duration: 'day' },
    { value: '1w', time: 1, duration: 'week' },
]

export function _detectReminder(_reminder, startDate) {
    let _objReminder = REMINDERS.find((r) => r.value == _reminder) || REMINDERS[0];
    return {
        _reminder: _reminder != 'once' ? _objReminder : null,
        _time: moment(startDate).subtract(_objReminder.time, _objReminder.duration).format('YYYY-MM-DD HH:mm')
    }
}

const REPEATS = [
    { id: 'daily', value: 'day' },
    { id: 'weekly', value: 'week' },
    { id: 'monthly', value: 'month' },
    { id: 'yearly', value: 'year' },
]

export function _detectRepeat(_repeat) {
    let _temp = REPEATS.find((r) => r.id == _repeat);
    return _temp ? _temp.value : '';
}