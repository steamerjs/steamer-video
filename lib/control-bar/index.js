'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ControlBar = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ControlBar = exports.ControlBar = function ControlBar(props) {
    var progressStyle = {
        width: props.videoCurrentProgress
    };
    var progressBtnStyle = {
        marginLeft: props.videoControlLen
    }; // 圈圈

    return _react2.default.createElement(
        'div',
        {
            className: 'steamer-video-bar',
            onTouchStart: props.manualAdjustProgress,
            onTouchMove: props.manualAdjustProgress,
            onTouchEnd: props.manualAdjustTime,
            onMouseDown: props.manualMouseDownAdjustProgress,
            onMouseMove: props.manualMouseAdjustProgress,
            onMouseUp: props.manualAdjustTime
        },
        _react2.default.createElement('div', { className: 'steamer-video-bar-progress', style: progressStyle }),
        _react2.default.createElement('div', { className: 'steamer-video-bar-control', style: progressBtnStyle })
    );
};