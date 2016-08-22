import * as types from 'constants/actionTypes'

/**
 * 依序批次Actions
 * @param  id      批次id,可不傳
 * @param  actions 一個array,內容可以接受function || action
 * @return         Multi Action
 */
const multiAction = ({ id, actions }) => {
  return {
    type: types.ACTION_STEP_ASYNC,
    id,
    actions
  }
}

export default multiAction;
