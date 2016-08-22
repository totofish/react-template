import { combineReducers } from 'redux'
import sys from './sys'
import processing from './processing'

const reducer = combineReducers({
  sys,
  processing
})

export default reducer
