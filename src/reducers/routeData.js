import * as types from '@/constants/actionTypes'


export default function routeData(state = null, action) {
  switch (action.type) {
    case types.ROUTE_DATA:
      return action.routes
      
    default:
      return state
  }
}
