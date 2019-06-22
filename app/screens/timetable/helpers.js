

export function _toMinutes(time) {
    if (time) {
        if (typeof time == 'string') {
            return +time.split(':')[1] + +time.split(':')[0] * 60
        }
        return time.minutes() + time.hours() * 60
    }
    return 0
}

export function _toHour(hour) {
    return {
        hour: hour.split(' - ')[0],
        minute: hour.split(' - ')[1]
    }
}

export function _detectTime(hour) {
    return {
        hour: Number(hour.split(':')[0]),
        minute: Number(hour.split(':')[1])
    }
}

export function _compareGreateThanTime(compareTime, withCompare){
    let _compareTime = _toHour(compareTime);
    let _withCompare = _toHour(withCompare);
    if (compareTime == withCompare || (_compareTime.hour < _withCompare.hour) || (_compareTime.hour == _withCompare.hour && _compareTime.minute < _withCompare.minute)) {
        return true
    }
    return false
}