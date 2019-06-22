import { Platform } from 'react-native';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';

export default class AppConfig {
    static API_SERVER = 'http://45.76.55.157';
    static API_VERSION = '';
    static DEV = true;

    static dev() {
        return AppConfig.DEV ? AppConfig.DEV : true;
    }

    static getApiUrl() {
        return AppConfig.dev() ? AppConfig.API_SERVER : AppConfig.API_SERVER;
    }

    static getApiVersion() {
        return AppConfig.API_VERSION;
    }

    static getApiVersion() {

    }

    static getTimeout() {
        return 30000;
    }

    static getTimeNotification() {
        return {
            hour: 8,
            minute: 0
        }
    }

    static getScheduleHeight() {
        return 80
    }

    static _initMonthLoadeds() {
        return [
            `${moment().subtract(3, 'months').format('YYYY')}-${moment().subtract(3, 'months').format('MM')}`
                `${moment().subtract(2, 'months').format('YYYY')}-${moment().subtract(2, 'months').format('MM')}`
                `${moment().subtract(1, 'months').format('YYYY')}-${moment().subtract(1, 'months').format('MM')}`
                `${moment().format('YYYY')}-${moment().format('MM')}`
                `${moment().add(1, 'M').format('YYYY')}-${moment().add(1, 'M').format('MM')}`
                `${moment().add(2, 'M').format('YYYY')}-${moment().add(2, 'M').format('MM')}`
                `${moment().add(3, 'M').format('YYYY')}-${moment().add(3, 'M').format('MM')}`
        ]
    }

    static _configPushNotification() {
        PushNotification.configure({
            onRegister: function (token) {

            },
            onNotification: function (notification) {

            },
            senderID: "184655701825",
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }

    static _configImagePicker() {
        return {
            width: 450,
            height: 450,
            cropping: true,
            mediaType: 'photo',
            includeBase64: true,
            cropperCircleOverlay: true,
            compressImageQuality: Platform.OS === 'ios' ? 0.8 : 1,
        }
    }
}