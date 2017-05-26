import React, { Component } from 'react'
import { BaseComponent, html } from 'react-libs'

export default class PageNotFound extends BaseComponent {

  render() {
    let style = {
      'page-not-found': {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#e2fffa',
        color: '#757575'
      },
      'icon': {
        fontSize: 150,
        marginBottom: 10
      }
    }

    return (
      <div style={style['page-not-found']}>
        <html.CenterBox>
          <i className="material-icons" style={style['icon']}>&#xE87B;</i>
          <br/>
          The requested URL was not found
        </html.CenterBox>
      </div>
    )
  }
}
