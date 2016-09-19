import * as types from 'constants/actionTypes'
import { processingStart, processingEnd } from 'actions/processing'
import { sysMessage } from 'actions/sys'

/**
 * 取得 UTC+1 的現在標準時間
 * @param  callback  回呼function
 * @return Get UTC Action
 */
export const getUTC = ({ callback=null }={}) => {
  return {
    type: types.API_ASYNC,
    option: {
      fullUrl      : 'http://www.timeapi.org/utc/now.json',
      contentType  : 'jsonp',
      body         : { r: Date.now() }
    },
    callback,
    processingStart: processingStart('utc'),
    processingEnd  : processingEnd('utc'),
    success: getUTCResponse
  }
}

const getUTCResponse = (response) => {
  return sysMessage({
    type   : 'UTC+1',
    message: response.dateString
  })
}
