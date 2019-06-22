import { PermissionsAndroid } from 'react-native';

export function _requestLocationPermission() {
    return new Promise(async (resolve) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'GPS 권한에 대한 재검토',
                    message: '앱이 내 위치에 액세스하도록 허용하십시오',
                    buttonNeutral: '나중에 다시 확인',
                    buttonNegative: '취소',
                    buttonPositive: '적용',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return resolve({error: null});
            } else {
                return resolve({error: 1});
            }
        } catch (err) {
            resolve({error: 1})
        }
    })
}

export function _checkLocationPermission() {
    return new Promise(async (resolve) => {
        try {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return resolve({error: null});
            } else {
                return resolve({error: 1});
            }
        } catch (err) {
            resolve({error: 1})
        }
    })
}