import 'babel-polyfill'
import 'fetch-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import reducer from 'reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga'
import domready from 'domready'
import { DEVELOPMENT } from 'constants/config'
import Page from './containers/Page'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (process.env.NODE_ENV === DEVELOPMENT) {
  middlewares.push(createLogger())
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer)
sagaMiddleware.run(rootSaga)

const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById('root')
  )

domready(() => {
  render(Page)
})


if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
  // module.hot.accept()
  // 模塊拆分單純時下面這樣用也可以
  module.hot.accept('./containers/Page', () => {
    const NewRoot = require('./containers/Page').default
    render(NewRoot)
  })
}
