import shallowCompare from 'react-addons-shallow-compare';
import React, { Component } from 'react';

class BaseComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}

exports.default = BaseComponent;
module.exports = exports['default'];
