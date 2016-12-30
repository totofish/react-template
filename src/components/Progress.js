import React, { PropTypes, Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { processGlobalLevel, processAllLevel } from 'constants/config'
import classnames from 'classnames'

class Progress extends Component {
  constructor() {
    super()
  }

  render() {
    // 只顯示processGlobalLevel, processAllLevel層級的processing
    let list = this.props.processing.filter((item) => {
      if(item.level === processGlobalLevel || item.level === processAllLevel) return true
      return false
    })
    return (
      <div className={classnames('progress', {'progress--fade-out': list.length === 0})}>
        <div className="progress__bar" style={{width: '100%'}}></div>
      </div>
    )
  }
}

export default connect(
    state => ({
      processing: state.processing
    }),
    dispatch => bindActionCreators({

    }, dispatch)
)(Progress)
