import {
    SET_LOCATION
} from "../actions/types";
const DEFAULT_STATE = {
    latitude: null,
    longitude: null
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_LOCATION:
            return {
                ...state,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude
            }
        default:
            return state
    }
}