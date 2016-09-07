import * as types from 'constants/actionTypes'
import { processingStart, processingEnd } from 'actions/processing'
import { sysMessage } from 'actions/sys'
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
    success: ipResponse
  }
}

const ipResponse = (response) => {
  return sysMessage({
    type   : 'IP',
    message: response.ip
  })
}

/**
 * API Action Cancel
 * @return Object 中斷等待中的API Action
 */
export const apiActionCancel = () => {
  return {
    type: types.API_CANCEL
  }
}
