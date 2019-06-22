import {
    SET_USER,
    RECEIVE_ERROR,
    USER_TOKEN,
    UPDATING_USER,
    USER_TIMETABLE
} from "./types";

import sf from '../libs/serviceFactory';

function receiveData(data) {
    return {
        type: SET_USER,
        payload: data
    }
}

function receiveError() {
	return {
		type: RECEIVE_ERROR
	}
};

function updatingStateUser() {
    return {
        type: UPDATING_USER
    }
}

function saveUser(userInfo, userToken) {
    return {
        type: USER_TOKEN,
        payload: {
            userInfo,
            userToken
        }
    }
}

function saveTimetable(timetable) {
    return {
        type: USER_TIMETABLE,
        payload: {
            timetable
        }
    }
}

export function _actionSetUser(userInfo, userToken) {
    return (dispatch) => {
        dispatch(updatingStateUser())
        dispatch(saveUser(userInfo, userToken))
    }
}

export function _actionSetTimetable(data) {
    return (dispatch) => {
        dispatch(saveTimetable(data))
    }
}

export function actionGetUsers() {
    return (dispatch) => {
        sf.getServices('UserService').getList()
        .then(function(response) {
            dispatch(receiveData(response.data))
        })
        .catch(function(response){
            dispatch(receiveError());
        })
        
    }
}