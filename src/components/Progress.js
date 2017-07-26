import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { PROCESS_GLOBAL, PROCESS_ALL } from '@/constants/config';

@connect(
  state => ({
    processing: state.processing,
  }),
  dispatch => bindActionCreators({

  }, dispatch),
)
export default class Progress extends Component {
  render() {
    const { processing } = this.props;
    // 只顯示PROCESS_GLOBAL, PROCESS_ALL層級的processing
    const list = processing.filter((item) => {
      if (item.level === PROCESS_GLOBAL || item.level === PROCESS_ALL) return true;
      return false;
    });
    return (
      <div className={classnames('progress', { 'progress--fade-out': list.length === 0 })}>
        <div className="progress__bar" style={{ width: '100%' }} />
      </div>
    );
  }
}

Progress.propTypes = {
  processing: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
};

Progress.defaultProps = {
  processing: [],
};
