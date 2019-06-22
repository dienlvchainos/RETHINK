import { AsyncStorage } from'react-native'
// import AsyncStorage from '@react-native-community/async-storage';

export function _setStorage(key, data) {
    return AsyncStorage.setItem(key, data);
}

export function _getStorage(key) {
    return AsyncStorage.getItem(key);
}

export function _removeStore(key) {
    return AsyncStorage.removeItem(key);
}