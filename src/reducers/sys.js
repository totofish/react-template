import * as types from 'constants/actionTypes';


let defaultState = {
  info : null
}

export default function sys(state = defaultState, action) {
  switch (action.type) {
    case types.SYS_MESSAGE:
      return { ...state, info: action.message }

    case types.SYS_MESSAGE_CLEAR:
      var stateClone = { ...state };
      delete stateClone.info;
      return stateClone

    case types.TRACE:
      return { ...state, trace: action.log }

    default:
      return state
  }
}
