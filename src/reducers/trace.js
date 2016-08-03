import * as types from 'constants/actionTypes';

const trace = (state = { log: '' }, action) => {
  switch (action.type) {
    case types.TRACE:
      console.info(action.log);
      return {
        ...state,
        log: action.log
      };
    default:
      return state;
  };
};

export default trace;
