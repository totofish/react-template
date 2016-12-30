import React, { Component } from 'react'
import Progress from './Progress'

export default class Stage extends Component {
  render() {
    return (
      <div>
        {this.props.children}

        <Progress />
      </div>
    )
  }
}
