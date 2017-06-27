import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
// import { Redirect, Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { DEVELOPMENT, BASE_PAGE_BASENAME } from '@/constants/config'
import 'react-libs/dist/react-libs.css'
import routes from '@/routes/indexRoute'
import '@/assets/sass/styles.scss'

// 動態載入component
import StageComponent from 'bundle-loader?lazy&name=base-page!../components/Stage'
import PageNotFoundComponent from 'bundle-loader?lazy&name=base-page!../components/PageNotFound'
import Bundle from '@/components/Bundle'

const Stage = (data, { ...props }) => (
  <Bundle load={StageComponent}>
    {(Comp) => <Comp {...data} {...props} />}
  </Bundle>
)

const PageNotFound = ({ ...props }) => (
  <Bundle load={PageNotFoundComponent}>
    {(Comp) => <Comp { ...props }/>}
  </Bundle>
)

export default function Base(props) {
  const { store } = props
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path={BASE_PAGE_BASENAME} component={Stage.bind(this, {routes})}/>
          <Route component={PageNotFound}/>
        </Switch>
      </Router>
    </Provider>
  )
}
