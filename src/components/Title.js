import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { trace } from 'actions/trace';
import { BaseComponent } from 'react-libs';
import { global } from 'constants/config';

export class Title extends BaseComponent {
  constructor(props) {
    super();
    this.click = this.click.bind(this);
  }

  click() {
    if(this.props.router) this.props.router.push(this.props.jump);
  }

  componentDidMount() {
    this.props.trace(this.props.text);
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.trace(this.props.text);
  }

  render() {
    const { text, jump } = this.props;


    return (
      <div className="scene__title">
        {global.mode} page is <span style={{color:'red'}}>{text}</span>.
        { jump ? <button onClick={this.click} className="scene__button">{jump}</button> : null }
      </div>
    );
  };
};

Title.propTypes = {
  jump  : PropTypes.string,
  router: PropTypes.object,
  text  : PropTypes.string
};

Title.defaultProps = {
  jump   : '',
  text   : ''
};

export default connect(
    state => ({
      // log: state.trace.log
    }),
    dispatch => bindActionCreators({
      trace
    }, dispatch)
)(Title);
