import React, { Component } from 'react'

export default class EmptyPage extends Component {
  render() {
    return <div>{ this.props.children || null }</div>
  }
}
