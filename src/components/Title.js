import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as sysAction from 'actions/sys'
import * as processingAction from 'actions/processing'
import * as getIPAction from 'actions/getIP'
import * as multiAction from 'actions/multiAction'
import * as getUTCAction from 'actions/getUTC'
import * as types from 'constants/actionTypes'
import { BaseComponent } from 'react-libs'
import config from 'constants/config'
import Crumbs from './Crumbs'

export class Title extends BaseComponent {
  constructor(props) {
    super()
    this.click = this.click.bind(this)
    this.sendMultiAction = this.sendMultiAction.bind(this)
  }

  click() {
    if(this.props.router) this.props.router.push(this.props.jump.replace(':value', Date.now()))
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
        processingAction.processingStart(),

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
        processingAction.processingEnd(),
        () => { this.props.sysMessage({ type:types.TRACK, message:'循環結束' }) },

        getIPAction.getIP({ callback: (response) => {
          try {
            console.info('IP:', response.ip)
          } catch(e) {}
        }}),

        getUTCAction.getUTC({ callback: (response) => {
          try {
            console.info('UTC+1:', response.dateString)
          } catch(e) {}
        }})
      ]
    })
  }

  render() {
    const { text, jump } = this.props


    return (
      <div className="scene__title">
        {config.mode}<br/>
        { this.props.router ? <Crumbs /> : null }
        { jump ? <button onClick={this.click} className="scene__button">Next Page</button> : null }

        <button onClick={this.sendMultiAction} className="scene__button">MultiAction API</button>
        <div className="scene__msg">{ this.props.info ? this.props.info.message : null }</div>
      </div>
    )
  }
}

Title.propTypes = {
  jump  : PropTypes.string,
  router: PropTypes.object,
  text  : PropTypes.string
}

Title.defaultProps = {
  jump   : '',
  text   : ''
}

export default connect(
    state => ({
      info: state.sys.info
    }),
    dispatch => bindActionCreators({
      ...sysAction, ...processingAction, ...getIPAction, ...multiAction, ...getUTCAction
    }, dispatch)
)(Title)
