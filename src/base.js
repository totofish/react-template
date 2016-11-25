import 'babel-polyfill'
import 'fetch-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { browserHistory, useRouterHistory, Redirect, Router, Route, IndexRoute, IndexRedirect, applyRouterMiddleware } from 'react-router'
import { createHistory } from 'history'
import * as types from 'constants/actionTypes'
import createLogger from 'redux-logger'
import reducer from 'reducers'
import { useScroll } from 'react-router-scroll'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga'
import domready from 'domready'
import 'assets/sass/styles.scss'
import 'react-libs/dist/react-libs.css'


const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (process.env.NODE_ENV === 'development') {
  middlewares.push(createLogger())
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer)
sagaMiddleware.run(rootSaga)


// 動態載入component
function Stage(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('./components/Stage').default)
  })
}
function Scene(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('./components/Scene').default)
  })
}
function PageNotFound(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('./components/PageNotFound').default)
  })
}

const routes = require('./routes/indexRoute')
const history = useRouterHistory(createHistory)({ basename: '/base' })
store.dispatch({
  type: types.ROUTE_DATA,
  routes
})

domready(() => {
  render((
    <Provider store={store}>
      <Router history={history} render={applyRouterMiddleware(useScroll())}>
        <Route path="/" getComponent={Stage} childRoutes={routes}>
          {/* <IndexRedirect to="/home" /> */}
          <IndexRoute getComponent={Scene} jumpTo="home" />
        </Route>
        <Route path="*" getComponent={PageNotFound} />
      </Router>
    </Provider>
  ), document.getElementById('root'))
})
