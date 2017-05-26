import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'
import Progress from '@/components/Progress'

export default class Stage extends Component {
  constructor() {
    super()
  }

  componentDidMount() {
    // console.log(this.props)
  }

  render() {
    return (
      <div>
        <Switch>
          {
            this.props.routes.map((route, i) => {
              return <Route key={i} path={route.path} component={route.component}/>
            })
          }
        </Switch>
        <Progress />
      </div>
    )
  }
}
