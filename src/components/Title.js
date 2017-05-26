import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BaseComponent } from 'react-libs'
import * as sysAction from '@/actions/sys'
import * as processingAction from '@/actions/processing'
import * as getIPAction from '@/actions/getIP'
import * as multiAction from '@/actions/multiAction'
import * as getUTCAction from '@/actions/getUTC'
import * as types from '@/constants/actionTypes'
import config from '@/constants/config'
import { PROCESS_GLOBAL, PROCESS_ALL } from '@/constants/config'
import Crumbs from './Crumbs'

@connect(
  state => ({
    info: state.sys.info
  }),
  dispatch => bindActionCreators({
    ...sysAction, ...processingAction, ...getIPAction, ...multiAction, ...getUTCAction
  }, dispatch)
)
export default class Title extends BaseComponent {
  constructor(props) {
    super()
    this.click = this.click.bind(this)
    this.sendMultiAction = this.sendMultiAction.bind(this)
  }

  click() {
    if(this.props.history) this.props.history.push(this.props.jump.replace(':value', Date.now()))
  }

  sendMultiAction(){
    this.props.getIP()           // Get IP Service
    this.props.apiActionCancel() // 馬上取消Send API Action，因此store將不會取的IP回傳

    this.props.multiActionCancel() // 取消前一次的multiAction
    // 發送多筆連續Action,Callback Function或Delay Action
    this.props.multiAction({
      // id: 'stage-multi',
      actions: [
        () => { this.props.sysMessage({ type:types.TRACK, message:'循環開始' }) },
        // processingAction.processingStart(),

        sysAction.delay(500),
        sysAction.trace('trace 1'),
        () => { this.props.sysMessage({ type:types.TRACK, message:'trace 1' }) },

        sysAction.delay(500),
        sysAction.trace('trace 2'),
        () => { this.props.sysMessage({ type:types.TRACK, message:'trace 2' }) },

        sysAction.delay(500),
        sysAction.trace('trace 3'),
        () => { this.props.sysMessage({ type:types.TRACK, message:'trace 3' }) },

        sysAction.delay(500),
        sysAction.trace('trace 4'),
        () => { this.props.sysMessage({ type:types.TRACK, message:'trace 4' }) },

        sysAction.delay(500),
        // processingAction.processingEnd(),
        () => { this.props.sysMessage({ type:types.TRACK, message:'循環結束' }) },

        getIPAction.getIP({ callback: (response) => {
          console.info('IP:', response.ip)
        }}),

        getUTCAction.getUTCDate({ callback: (response) => {
          console.info('UTC+1:', response.headers.get('date'))
        }})
      ]
    })
  }

  render() {
    const { text, jump, pathname, history } = this.props
    return (
      <div className="scene__title">
        {config.mode}<br/>
        { pathname ? <Crumbs pathname={pathname} history={history} /> : null }
        { jump ? <button onClick={this.click} className="scene__button">Next Page</button> : null }

        <button onClick={this.sendMultiAction} className="scene__button">MultiAction API</button>
        <div className="scene__msg">{ this.props.info ? this.props.info.message : null }</div>
      </div>
    )
  }
}

Title.propTypes = {
  jump    : PropTypes.string,
  pathname: PropTypes.string,
  text    : PropTypes.string
}

Title.defaultProps = {
  jump   : '',
  text   : ''
}

