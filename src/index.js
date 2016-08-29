import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { browserHistory, useRouterHistory, Redirect, Router, Route, IndexRoute, applyRouterMiddleware } from 'react-router'
import { createHistory } from 'history'
import createLogger from 'redux-logger'
import reducer from 'reducers'
import { useScroll } from 'react-router-scroll'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga'
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

const history = useRouterHistory(createHistory)({ basename: '/base' })
render((
  <Provider store={store}>
    <Router history={history} render={applyRouterMiddleware(useScroll())}>
      <Route path="/" getComponent={Stage}>
        <IndexRoute getComponent={Scene} jump="home" />
        <Route path="home" getComponent={Scene} jump="home/path" />
        <Route path="home/:path" getComponent={Scene} jump="/" />
      </Route>
      <Route path="*" getComponent={PageNotFound} />
    </Router>
  </Provider>
), document.getElementById('root'))
