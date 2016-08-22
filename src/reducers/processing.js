import * as types from 'constants/actionTypes';


let defaultState = {
  show : false,
  level: 'all'
}

export default function processing(state = defaultState, action) {
  switch (action.type) {
    case types.PROCESSING_START:
      return {
        ...state,
        show : true,
        level: action.level
      };
    case types.PROCESSING_END:
      return {
        ...state,
        show : false,
        level: action.level
      };
    default:
      return state;
  }
}
