import 'babel-polyfill'
import 'fetch-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory, useRouterHistory, applyRouterMiddleware } from 'react-router'
import { createHistory } from 'history'
import * as types from 'constants/actionTypes'
import createLogger from 'redux-logger'
import reducer from 'reducers'
import useScroll from 'react-router-scroll/lib/useScroll'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga'
import domready from 'domready'
import { DEVELOPMENT, BASE_PAGE_BASENAME } from 'constants/config'
import routes from './routes/indexRoute'
import Base from './containers/Base'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (process.env.NODE_ENV === DEVELOPMENT) {
  middlewares.push(createLogger())
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer)
sagaMiddleware.run(rootSaga)

const history = useRouterHistory(createHistory)({ basename: BASE_PAGE_BASENAME })
store.dispatch({
  type: types.ROUTE_DATA,
  routes
})

const routerMiddleware = applyRouterMiddleware(useScroll())

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component store={store} history={history} routerMiddleware={routerMiddleware} />
    </AppContainer>,
    document.getElementById('root')
  )

domready(() => {
  render(Base)
})

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
  module.hot.accept()
  // 下面這種方式感覺載入模塊拆分複雜時會無效
  // module.hot.accept('./containers/Base', () => {
  //   const NewRoot = require('./containers/Base').default
  //   render(NewRoot)
  // })
}
