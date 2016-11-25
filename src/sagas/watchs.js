import * as types from 'constants/actionTypes'
import { delay, takeEvery } from 'redux-saga'
import { call, put, fork, take, cancel } from 'redux-saga/effects'
import encodeQueryData, { getUrlQuery } from 'utility/encodeQueryData'
import { sysMessage } from 'actions/sys'
import { FetchException } from 'constants/config'
import jsonp from 'jsonp'

function fetchAPI(url, options) {
  return fetch(url, options)
          .then(response => response.json())
          .then(
            response => response,
            error => {
              throw new Error(response.statusText)
            }
          )
}

function api({ fullUrl, contentType, Authorization, method='GET', body }) {
  method = method.toLocaleUpperCase()
  contentType = contentType.toLocaleUpperCase()
  if(contentType === 'JSONP') method = 'GET'
  if(method === 'GET') {
    let urls = fullUrl.split('?')
    fullUrl = `${urls[0]}?${encodeQueryData({...getUrlQuery(urls[1] || ''), ...body})}`
  }
  if(contentType === 'JSONP') {
    return new Promise(function(resolve, reject) {
      jsonp(fullUrl, {}, (err, data) => {
        if(err) reject(err)
        else resolve(data)
      })
    })
  } else {
    let headers = { 'Content-Type': contentType === 'JSON' ? 'application/json' : 'application/x-www-form-urlencoded;charset=utf-8' }
    Authorization && (headers.Authorization = Authorization)
    return fetchAPI(fullUrl, {
      method : method,
      headers: headers,
      body   : method === 'GET' ? null : contentType === 'JSON' ? JSON.stringify(body) : encodeQueryData(body)
    })
  }
}

function* sendAPI(action) {
  try {
    // 正常程序
    if(action.processingStart) yield put(action.processingStart)
    const response = yield call(api, action.option)
    // yield put({
    //   type: types.API_SUCCESS,
    //   response
    // })
    if(action.success) {
      let next = action.success(response)
      if(next) yield put(next)
    }
    if(typeof action.processingEnd === 'object') yield put(action.processingEnd)
    if(typeof action.callback === 'function') action.callback.call(null, response)
  } catch (error) {
    // 失敗程序
    // yield put({
    //   type: types.API_ERROR,
    //   error
    // })
    yield put(sysMessage({
      type   : types.FAILED_FETCH,
      message: FetchException
    }))
    if(typeof action.processingEnd === 'object') yield put(action.processingEnd)
    if(typeof action.callback === 'function') action.callback.call(null, error)
  }
}

/////////////// Single API
export function* apiFlow(action) {
  const task = yield fork(sendAPI, action)
  yield take(types.API_CANCEL)
  yield cancel(task)
}

/////////////// Multi Step
function* multiFlow(action) {
  for(let i = 0, j = action.actions.length; i < j; i++) {
    try {
      let actionStep = action.actions[i]
      if(typeof actionStep === 'object') {
        if(actionStep.type === types.API_ASYNC) {
          yield call(sendAPI, actionStep)                   // api 異步處理
        } else if(actionStep.type === types.DELAY) {        // 暫停
          yield call(delay, actionStep.millisecond)
        } else {
          yield put(actionStep)                             // 一般 action 呼叫
        }
      } else if(typeof actionStep === 'function') {
        actionStep.call()
      }
    } catch (error) {
      yield put(sysMessage({
        type   : types.ACTION_STEP_ERROR,
        message: error
      }))
    }      
  }
  // yield put({ type: types.ACTION_STEP_END, id:action.id }) // 多筆呼叫結束
}

export function* MultiActionFlow(action) {
  const task = yield fork(multiFlow, action)
  yield take(types.ACTION_STEP_CANCEL)
  yield cancel(task)
}


/////////////////////////////////////
// 監控單筆API事件
/////////////////////////////////////
export function* watchApiAsync() {
  yield* takeEvery(types.API_ASYNC, apiFlow)
}

/////////////////////////////////////
// 監控逐步多筆Action事件
/////////////////////////////////////
export function* watchStepActionAsync() {
  yield* takeEvery(types.ACTION_STEP_ASYNC, MultiActionFlow)
}
