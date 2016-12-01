import * as types from '../constants/actionTypes'

/**
 * 開始Processing狀態
 * @param  level  廣播特定層級的Processing，預設'global',也接收false
 * @return Processing Start Action
 */
export const processingStart = (level = 'global') => {
  if(!level) return
  return {
    type : types.PROCESSING_START,
    level: level
  }
}

/**
 * 停止Processing狀態
 * @param  level  預設'global',或指定停止特定層級Processing,'all'=停止所有層級Processing,也接收false
 * @return Processing End Action
 */
export const processingEnd = (level = 'global') => {
  if(!level) return
  return {
    type: types.PROCESSING_END,
    level: level
  }
}
