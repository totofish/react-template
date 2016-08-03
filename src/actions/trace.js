import * as types from 'constants/actionTypes';

export const trace = (log) => {
  return {
    type: types.TRACE,
    log
  };
};
