import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Redirect, Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import routes from '../routes/indexRoute'
import 'assets/sass/styles.scss'
import 'react-libs/dist/react-libs.css'

// 動態載入component
function Stage(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../components/Stage').default)
  }, 'page')
}
function Scene(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../components/Scene').default)
  }, 'page')
}
function PageNotFound(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../components/PageNotFound').default)
  }, 'page')
}

export default class Base extends Component {
  render() {
    const { store, history, routerMiddleware } = this.props
    // if(!this.routes) this.routes = routes
    return (
      <Provider store={store}>
        <Router key={Date.now()} history={history} render={routerMiddleware}>
          <Route path="/" getComponent={Stage} childRoutes={routes}>
            {/* <IndexRedirect to="/home" /> */}
            <IndexRoute getComponent={Scene} jumpTo="home" />
          </Route>
          <Route path="*" getComponent={PageNotFound} />
        </Router>
      </Provider>
    )
  }
}

Base.propTypes = {
  store           : PropTypes.object.isRequired,
  history         : PropTypes.object.isRequired,
  routerMiddleware: PropTypes.func.isRequired
}
