import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Route, Link, Switch, Redirect } from 'react-router-dom'
import { html } from 'react-libs'
import Title from '@/components/Title'

// 如要內嵌img
// var img = require("url!assets/images/file.png")
// console.info(img)

@connect(
  state => ({
    routeData: state.routeData
  }),
  dispatch => bindActionCreators({

  }, dispatch)
)
export default class Scene extends Component {
  constructor() {
    super()
    this.searchRoute = this.searchRoute.bind(this)
  }

  searchRoute(routeData, path) {
    let route
    for(let i=0, j=routeData.length; i<j; i++) {
      if(routeData[i].path === path) return routeData[i]
      if(routeData[i].routes) route = this.searchRoute(routeData[i].routes, path)
      if(route) return route
    }
    return false
  }

  render() {
    let { redirect, jumpTo, location, match, history, routeData } = this.props
    let route = this.searchRoute(routeData, match.path)

    // Redirect
    if(redirect) return (
      <div>
        <Redirect from={match.path} to={redirect}/>
        <Switch>
          {
            route.routes ? 
              route.routes.map((route, i) => {
                return <Route key={i} path={route.path} component={route.component}/>
              })
              : null
          }
        </Switch>
      </div>
    )

    // Content
    return (
      <div>
        {
          location.pathname !== match.url ? null :
            <div className="scene" style={{width:'100%', height:'100%'}}>
              <figure className="scene__bg"></figure>
              <Title jump={this.props.jumpTo} history={history} pathname={match.path} />
              <html.CenterBox>
                <div className="scene__circle"></div>
                <figure className="scene__icon" onClick={()=>{ window.location.replace('/page') }}></figure>
              </html.CenterBox>
            </div>
        }
        <Switch>
          {
            route.routes ? 
              route.routes.map((route, i) => {
                return <Route key={i} path={route.path} component={route.component}/>
              })
              : null
          }
        </Switch>
      </div>
    )
  }
}