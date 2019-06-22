import AppConfig from '../config';
import constant from '../constants';
import notice from '../utils/noticeUtils';
import language from '../utils/languageUtils';
import { isNil } from 'lodash';
import Numeral from './numeral';

export function _getAvatarChild(avatar) {
    return AppConfig.getApiUrl() + '/resources/images/child/' + avatar
}

export function _getAvatarUser(avatar) {
    if (avatar.includes('file://') || avatar.includes('http://') || avatar.includes('https://')) {
        return avatar;
    }
    return AppConfig.getApiUrl() + '/resources/images/user/' + avatar
}

export function _handleBirthday(birthday) {
    if (birthday) {
        if (typeof birthday == 'string') {
            return birthday;
        } else if (typeof birthday == 'object') {
            return birthday.date
        }
        return new Date();
    }
    return new Date();
}

export function _handleDateObject(_date) {
    if (_date) {
        if (typeof _date == 'string') {
            return _date;
        } else if (typeof _date == 'object') {
            return _date.date
        }
        return new Date();
    }
    return new Date();
}

export function _timeoutCancelHandling(_callback, _message = notice.message.undefineError) {
    let timeOut = setTimeout(() => {
        _callback();
        notice.inform(_message);
    }, AppConfig.getTimeout())
    return timeOut;
}

export function _renderButtonText(rowData) {
    const { icon, title } = rowData;
    return ' ';
}

export function _renderRelationship(relation) {
    switch (relation) {
        case constant.mother:
            return language.mother;
        case constant.father:
            return language.father;
        case constant.grandmother:
            return language.grandmother;
        case constant.grandfather:
            return language.grandfather;
        case constant.other:
            return language.other;
    }
}

export function _hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.3)';
    }
    throw new Error('Bad Hex');
}

export function _shortText(_text, len = 14) {
    if (_text && _text.length >= len) return _text.substring(0, len - 1) + '...';
    return _text;
}

export function _findInArray(_arr, _keyFind, _valueFind, _returnDefault) {
    return _arr.find((_a) => _a[_keyFind] == _valueFind) || _returnDefault;
}

export function _formatMoney(amount, currency, zeroValue) {
    if (amount == 0) return 0;
    let numberOfDecimalDigits = currency == 'kwr' ? 0 : 10;
    let format = numberOfDecimalDigits == 0 ?
        '0,0' :
        '0,0.[' + Array(numberOfDecimalDigits + 1).join('0') + ']';
    if (isNil(zeroValue)) {
        zeroValue = '';
    }
    return amount ? Numeral(amount).format(format) : zeroValue;
}

export function _getQueryStringParameter(url) {

    if (url) {
        if (url.split("?").length > 0) {
            query = url.split("?")[1];
        }
    } else {
        url = window.location.href;
        query = window.location.search.substring(1);
    }
    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
};

export function _totalInArray(_arr, _keyCal) {
    return _arr.reduce((acc, curr) => acc + (curr[_keyCal] || 0), 0);
}

export async function _asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index);
    }
}

// export const _randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)

export const _randomColor = () => {
    let colors = ["#FFB900", "#E74856", "#0078D7", "#0099BC", "#7A7574", "#767676",
    "#FF8C00", "#E81123", "#0063B1", "#2D7D9A", "#5D5A58", "#4C4A48", "#F7630C", "#EA005E", "#8E8CD8",
    "#00B7C3", '#B93B50', '#E36179', '#FE90A9', '#FED6DE', '#FFECF0',
    '#AF5030', '#E0744E', '#FB9A7A', '#FEDBC8', '#FFEFE0', '#00CC6A',
    '#A7741B', '#DAA22B', '#F5D065', '#F9EEAC', '#FCF9D0', '#B146C2',
    '#167263', '#26AA85', '#69D4A6', '#CDF4D5', '#EBFAE2', '#D13438',
    '#333FA5', '#4E6CE0', '#7FA9FD', '#CDE2FF', '#E8F4FF', '#FF4343',
    '#A485C9', '#8D4DE2', '#BB8EF5', '#E3D1F9', '#F7EAFD',
    '#5D6067', '#767D85', '#A9AEB2', '#D9DBDA', '#EFEFEF'];

    return colors[Math.floor(Math.random()*colors.length)];
}

export function _formatPercent(_number) {
    return (_number * 100).toFixed(2)
}