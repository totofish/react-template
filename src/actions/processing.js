import * as types from '../constants/actionTypes'
import { processGlobalLevel, processAllLevel } from 'constants/config'

/**
 * 開始Processing狀態
 * @param  level  廣播特定層級的Processing，預設'global'
 * @param  id
 * @return Processing Start Action
 */
export const processingStart = (level = processGlobalLevel, id = '#') => {
  if(!level) return
  return {
    type : types.PROCESSING_START,
    level,
    id
  }
}

/**
 * 停止Processing狀態
 * @param  level  廣播特定層級的Processing，預設'global','all'=停止所有層級Processing
 * @param  id
 * @return Processing End Action
 */
export const processingEnd = (level = processGlobalLevel, id = '#') => {
  if(!level) return
  return {
    type: types.PROCESSING_END,
    level,
    id
  }
}
