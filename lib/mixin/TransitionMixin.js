/**
 * import TransitionMixin, { AUTO_ALPHA } from '../animation/TransitionMixin';
 * class Hello extends TransitionMixin(Component, {fadeTime: 1, type: AUTO_ALPHA }) {...}
 */

import ReactDOM from 'react-dom';

export const AUTO_ALPHA = 'autoAlpha';

let TransitionMixin = (superclass, {fadeTime = 0.5, type = AUTO_ALPHA} = {}) => class extends superclass {

    // Start
    componentWillAppear(callback) {
        console.log('componentWillAppear');

        switch(type){
            case AUTO_ALPHA:
            default:
                console.log(ReactDOM.findDOMNode(this));
            break;

        }
        setTimeout(callback, fadeTime * 1000);
    }
    componentDidAppear() {}

    // Fade In
    componentWillEnter(callback) {
        console.log('componentWillEnter');
        setTimeout(callback, fadeTime * 1000);
    }
    componentDidEnter() {}

    // Fade Out
    componentWillLeave(callback) {
        console.log('componentWillLeave');
        setTimeout(callback, fadeTime * 1000);
    }
    componentDidLeave() {}

}

// export default TransitionMixin;
exports.default = TransitionMixin;
module.exports = exports['default'];
