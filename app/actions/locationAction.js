import {
    SET_LOCATION
} from "./types";

function receiveData(data) {
    return {
        type: SET_LOCATION,
        payload: data
    }
}

export function _actionSetLocation(location) {
    return (dispatch) => {
        dispatch(receiveData(location));
    }
}