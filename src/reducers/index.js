import { combineReducers } from 'redux';
import sys from './sys';
import processing from './processing';
import routeData from './routeData';

const reducer = combineReducers({
  sys,
  processing,
  routeData,
});

export default reducer;
