import {
  SET_CHILD,
  SET_CHILDS,
  SET_DELETED
} from "../actions/types";
const DEFAULT_STATE = {
  selected: {},
  list: [],
  childDeleting: null
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SET_CHILD:
      return {
        ...state,
        selected: action.payload
      }
    case SET_CHILDS:
      return {
        ...state,
        list: action.payload
      }
    case SET_DELETED:
      return {
        ...state,
        childDeleting: action.payload
      }
    default:
      return state
  }
}