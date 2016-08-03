'use strict';

/* import Style */
require('./libs.scss');


module.exports = {
  html: {
    CenterBox: require('./html/CenterBox')
  },
  BaseComponent  : require('./base/BaseComponent'),
  TransitionMixin: require('./mixin/TransitionMixin')
}
