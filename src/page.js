import 'babel-polyfill'
import 'fetch-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import reducer from 'reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/rootSaga'
import domready from 'domready'
import { DEVELOPMENT } from 'constants/config'

import 'assets/sass/styles'
import Title from 'components/Title'
import { html } from 'react-libs'
import 'react-libs/dist/react-libs.css'
import Progress from 'components/Progress'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (process.env.NODE_ENV === DEVELOPMENT) {
  middlewares.push(createLogger())
}

const store = compose(applyMiddleware(...middlewares))(createStore)(reducer)
sagaMiddleware.run(rootSaga)


const { CenterBox } = html

domready(() => {
  render((
    <Provider store={store}>
      <div className="scene" style={{width:'100%', height:'100%'}}>
        <figure className="scene__bg"></figure>
        <Title text="Page" />
        <CenterBox>
          <div className="scene__circle scene__circle--black"></div>
          <figure className="scene__icon" onClick={()=>{ location.replace('/base') }}></figure>
        </CenterBox>
        <Progress />
      </div>
    </Provider>
  ), document.getElementById('root'))
})
