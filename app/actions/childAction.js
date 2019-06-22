import {
    SET_CHILD,
    SET_CHILDS,
    SET_DELETED
} from "./types";

function receiveData(data) {
    return {
        type: SET_CHILD,
        payload: data
    }
}

function receiveList(data) {
    return {
        type: SET_CHILDS,
        payload: data
    }
}

function receiveChildDeleted(childId) {
    return {
        type: SET_DELETED,
        payload: childId
    }
}

export function _actionSetChild(child) {
    return (dispatch) => {
        dispatch(receiveData(child));
    }
}

export function _actionSetChildList(childs) {
    return (dispatch) => {
        dispatch(receiveList(childs));
    }
}

export function _actionVerifyDeletedChild(childId) {
    return (dispatch) => {
        dispatch(receiveChildDeleted(childId));
    }
}