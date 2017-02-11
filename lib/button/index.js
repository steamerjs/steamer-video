'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CountDown = exports.PauseButton = exports.PlayButton = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayButton = exports.PlayButton = function PlayButton(props) {
    return _react2.default.createElement(
        'div',
        { className: 'pause', onClick: props.pause },
        _react2.default.createElement('img', { src: require('./img/pause.png') })
    );
};

var PauseButton = exports.PauseButton = function PauseButton(props) {
    return _react2.default.createElement(
        'div',
        { className: 'pause', onClick: props.play },
        _react2.default.createElement('img', { src: require('./img/play.png') })
    );
};

var CountDown = exports.CountDown = function CountDown(props) {

    return _react2.default.createElement(
        'div',
        { className: 'timing' },
        props.countDownTime
    );
};