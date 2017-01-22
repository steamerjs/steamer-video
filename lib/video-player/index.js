'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

require('./index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SteamerVideo = function (_Component) {
    _inherits(SteamerVideo, _Component);

    function SteamerVideo(props, context) {
        _classCallCheck(this, SteamerVideo);

        return _possibleConstructorReturn(this, (SteamerVideo.__proto__ || Object.getPrototypeOf(SteamerVideo)).call(this, props, context));
    }

    _createClass(SteamerVideo, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {}
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {}
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                autoplay = _props.autoplay,
                controls = _props.controls,
                preload = _props.preload,
                poster = _props.poster,
                src = _props.src,
                type = _props.type,
                muted = _props.muted,
                loop = _props.loop;

            // let v = videoData.list[0] || {},
            //     pic = v.pic_url || "";

            // let style = {
            //     backgroundImage: "url(" + pic + ")"
            // };

            return _react2.default.createElement('video', {
                className: 'sr-video-container',
                src: src,
                type: type,
                autoPlay: autoplay || false,
                preload: preload || true,
                controls: controls || false,
                muted: muted || false,
                poster: poster || null,
                loop: loop || false
            });
        }
    }]);

    return SteamerVideo;
}(_react.Component);

exports.default = SteamerVideo;