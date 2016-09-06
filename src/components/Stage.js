import React, { Component } from 'react'

export default class Stage extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
