import {
  SET_USER,
  USER_TOKEN,
  UPDATING_USER,
  USER_TIMETABLE
} from "../actions/types";
const DEFAULT_STATE = {
  data: {},
  apiKey: '',
  timetable: {},
  isUpdating: false
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        data: action.payload
      }
    case UPDATING_USER:
      return {
        ...state,
        isUpdating: true
      }
    case USER_TOKEN:
      return {
        ...state,
        data: action.payload.userInfo,
        apiKey: action.payload.userToken,
        isUpdating: false
      }
    case USER_TIMETABLE:
      return {
        ...state,
        timetable: action.payload.timetable
      }
    default:
      return state
  }
}