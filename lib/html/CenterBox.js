import React, { Component } from 'react';

export default class CenterBox extends Component {
    constructor() {
        super();
    }
    render() {
      return (
        <div className="center-box">
          <div className="center-box__container">
            <div className="center-box__middle">
              { this.props.children }
            </div>
          </div>
        </div>
      );
    };
};

CenterBox.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
};

// exports.default = CenterBox;
module.exports = exports['default'];
