import * as types from 'constants/actionTypes'
import { processingStart, processingEnd, randomRocessId } from 'actions/processing'
import * as sysAction from 'actions/sys'
import { multiAction } from 'actions/multiAction'
import config, { PROCESS_GLOBAL, PROCESS_ALL } from 'constants/config'


/**
 * 取得 UTC+1 的現在標準時間
 * @param  callback  回呼function
 * @return Get UTC Action
 */
export const getUTC = ({ callback=null, processLevel=PROCESS_GLOBAL, processId=randomRocessId() }={}) => {
  return {
    type: types.API_ASYNC,
    option: {
      fullUrl      : config.UTC_API,
      contentType  : 'jsonp',
      body         : { r: Date.now() }
    },
    callback,
    processingStart: processingStart(processLevel, processId),
    processingEnd  : processingEnd(processLevel, processId),
    success        : getUTCResponse
  }
}

const getUTCResponse = (response) => {
  // return sysAction.sysMessage({
  //   type   : 'UTC+1',
  //   message: response.dateString
  // })

  let animation = []
  let s = 80
  for(let i=0, j = response.dateString.length; i < j; i++) {
    s-=2
    animation.push(
      sysAction.delay(s),
      sysAction.sysMessage({
        type   : types.TRACK,
        message: response.dateString.substr(0, i)
      })
    )
  }
  return multiAction({
    actions: animation
  })
}
