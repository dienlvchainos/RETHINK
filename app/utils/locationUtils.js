import { Geolocation } from 'react-native';

export function _initLocation() {
    return new Promise((resolve) => {
        return navigator.geolocation.getCurrentPosition(
            (position) => {
                return resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                })
            },
            (error) => resolve({error}),
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
        );
    });
}