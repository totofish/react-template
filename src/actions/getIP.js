import * as types from 'constants/actionTypes'
import { processingStart, processingEnd } from 'actions/processing'
import * as sysAction from 'actions/sys'
import { multiAction } from 'actions/multiAction'
import config from 'constants/config'


/**
 * Get IP API
 * @param  callback  回呼function
 * @return Get IP Action
 */
export const getIP = ({ callback=null }={}) => {
  return {
    type: types.API_ASYNC,
    option: {
      fullUrl      : config.IP_API,
      method       : 'GET',
      contentType  : 'form',
      body         : { format: 'json' }
    },
    callback,
    processingStart: processingStart('ip'),
    processingEnd  : processingEnd('ip'),
    success        : ipResponse
  }
}

const ipResponse = (response) => {
  return sysAction.sysMessage({
    type   : 'IP',
    message: response.ip
  })

  // let animation = []
  // for(let i=0, j = response.ip.length; i < j; i++) {
  //   animation.push(
  //     sysAction.delay(50),
  //     sysAction.sysMessage({
  //       type   : types.TRACK,
  //       message: response.ip.substr(0, i)
  //     })
  //   )
  // }
  // return multiAction({
  //   actions: animation
  // })
}
