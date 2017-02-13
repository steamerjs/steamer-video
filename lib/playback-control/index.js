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

var _lib = require('../lib/');

var _button = require('../button');

var _controlBar = require('../control-bar');

require('./index.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PlayBackController = function (_Component) {
    _inherits(PlayBackController, _Component);

    function PlayBackController(props, context) {
        _classCallCheck(this, PlayBackController);

        var _this = _possibleConstructorReturn(this, (PlayBackController.__proto__ || Object.getPrototypeOf(PlayBackController)).call(this, props, context));

        _this.state = {
            canPlay: false,
            isEnd: false, // 是否播放结束     
            isPlay: false, // 是否正在播放
            videoCurrentProgress: "0", // 进度条已播放的长度百分比
            videoControlLen: "0", // 进度条圈圈控件离里进度条最左边的距离
            videoCurrentTime: 0 };
        _this.startAdjusting = false;

        _this.autoAdjustProgress = _this.autoAdjustProgress.bind(_this);
        _this.manualAdjustProgress = _this.manualAdjustProgress.bind(_this);
        _this.manualMouseDownAdjustProgress = _this.manualMouseDownAdjustProgress.bind(_this);
        _this.manualMouseAdjustProgress = _this.manualMouseAdjustProgress.bind(_this);
        _this.manualAdjustTime = _this.manualAdjustTime.bind(_this);
        _this.play = _this.play.bind(_this);
        _this.pause = _this.pause.bind(_this);
        _this.videoCanPlay = _this.videoCanPlay.bind(_this);
        _this.videoTimeUpdate = _this.videoTimeUpdate.bind(_this);
        _this.videoPlaying = _this.videoPlaying.bind(_this);
        _this.videoEnded = _this.videoEnded.bind(_this);
        _this.videoSeeking = _this.videoSeeking.bind(_this);
        _this.switchPlayOrPause = _this.switchPlayOrPause.bind(_this);

        _this.video = {
            v: null, // 当前播放的video element
            id: null, // 当前播放的video的下标
            list: [], // video element列表
            listLen: 0 };
        // control bar
        _this.progress = {
            bar: {
                len: 0
            },
            loadBar: {
                min: 0,
                max: 100
            },
            progressBar: {
                min: 0,
                max: 100,
                accuTime: 0, // already played time
                currentTime: 0, // current movie progress time 
                duration: 0, // total movie time
                durationText: "0:00" },
            controller: {
                start: 0,
                min: 0,
                max: 100
            }
        };
        return _this;
    }

    _createClass(PlayBackController, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {}
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var controlPos = document.querySelector('.steamer-video-bar-control').getBoundingClientRect();
            this.progress.controller.start = controlPos.left;

            this.initVideoList();
            this.initVideo(0);
            this.initVideoEvent();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            console.log("=====componentWillUnmount child====");
            this.removeVideoEvent();
        }
    }, {
        key: 'removeVideoEvent',
        value: function removeVideoEvent() {
            var v = this.video.v;
            v.removeEventListener('canplay', this.videoCanPlay);
            v.removeEventListener('timeupdate', this.videoTimeUpdate);
            v.removeEventListener('playing', this.videoPlaying);
            v.removeEventListener('ended', this.videoEnded);
            v.removeEventListener('seeking', this.videoSeeking);
        }
    }, {
        key: 'initVideoEvent',
        value: function initVideoEvent() {
            var v = this.video.v;
            v.addEventListener('canplay', this.videoCanPlay);
            v.addEventListener('timeupdate', this.videoTimeUpdate);
            v.addEventListener('playing', this.videoPlaying);
            v.addEventListener('ended', this.videoEnded);
            v.addEventListener('seeking', this.videoSeeking);
        }

        /**
         * 浏览器正在请求数据
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'videoSeeking',
        value: function videoSeeking(e) {
            this.setState({
                canPlay: false
            });
        }

        /**
         * 浏览器能够播放媒体，但估计以当前播放速率不能直接将媒体播完，播放期间需要缓冲
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'videoCanPlay',
        value: function videoCanPlay(e) {
            this.setState({
                canPlay: true
            });

            var duration = e.target.duration;
            this.props.videoData.meta.totalDuration = duration;

            this.initProgress();
            this.initTicker(duration);
        }

        /**
         * 当前播放位置发生改变
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'videoTimeUpdate',
        value: function videoTimeUpdate(e) {
            this.autoAdjustProgress(e);
        }

        /**
         * 播放结束
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'videoEnded',
        value: function videoEnded(e) {
            this.setState({
                isEnd: true
            });

            this.pause();

            this.adjustProgress(0);
        }

        /**
         * 开始播放
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'videoPlaying',
        value: function videoPlaying(e) {
            this.setState({
                isPlay: true
            });
        }

        /**
         * 初始化video element列表
         */

    }, {
        key: 'initVideoList',
        value: function initVideoList() {
            this.video.list = document.getElementById(this.props.videoIdName).children;
            this.video.listLen = this.video.list.length;
        }

        /**
         * 初始化当前video
         * @param  {Integer} id 当前video的id
         */

    }, {
        key: 'initVideo',
        value: function initVideo(id) {
            this.video.v = this.video.list[id % 3]; // 当前的video DOM对象
            this.video.id = id;
            var videoDataList = this.props.videoData.list;
            // 加载视频
            if (!this.video.v.src) {
                this.video.v.src = videoDataList[id].url;
                this.video.v.load();
            }

            // let the one with src on top
            for (var i = 0; i < this.video.listLen; i++) {
                var v = this.video.list[i];
                if (id % 3 === i) {
                    v.style.display = "block";
                } else {
                    v.style.display = "none";
                }
            }
        }
        /**
         * 初始化总播放时间
         * @param  {Float} 总播放时间
         */

    }, {
        key: 'initTicker',
        value: function initTicker(duration) {
            // 已经设了就不再设duration了，这里改到timeupdate事件设，是为了兼容某些浏览器
            if (!this.progress.progressBar.duration) {
                this.progress.progressBar.duration = duration;
                this.progress.progressBar.durationText = (0, _lib.getTotalDuraction)(this.progress.progressBar.duration);

                // todo 在props的videoData上增加duration
                var videoId = this.video.id;
                if (this.props.videoData.list && this.props.videoData.list[videoId] && !this.props.videoData.list[videoId].duration) {
                    this.props.videoData.list[videoId].duration = duration;
                }
            }
        }

        /**
         * 初始化 control bar
         */

    }, {
        key: 'initProgress',
        value: function initProgress() {
            this.progress.bar.len = document.querySelector('.steamer-video-bar').clientWidth;
            this.progress.controller.max = this.progress.bar.len - 5;
        }
        /**
         * 自动播放视频时改变进度条
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'autoAdjustProgress',
        value: function autoAdjustProgress(e) {
            if (e.target.paused) {
                return;
            }

            var currentTime = e.target.currentTime,
                progressBar = this.progress.progressBar;

            var percentage = (progressBar.accuTime + currentTime) / progressBar.duration;

            percentage = (0, _lib.getPercent)(percentage); // 更新百分比样式

            this.adjustProgress(percentage);
        }
        /**
         * 用户操作(点击或移动)control bar，touchstart或touchmove时触发
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'manualAdjustProgress',
        value: function manualAdjustProgress(e) {
            // if manual ,pause first
            this.pause();
            var progressBar = this.progress.progressBar,
                controller = this.progress.controller,
                bar = this.progress.bar;

            var diff = e.changedTouches[0].clientX - controller.start,
                percentage = diff / bar.len;

            percentage = (0, _lib.getPercent)(percentage); // 根据鼠标位置对比，获取百分比

            this.adjustProgress(percentage, true);
        }

        /**
         * mouseDown事件处理
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'manualMouseDownAdjustProgress',
        value: function manualMouseDownAdjustProgress(e) {
            if (!this.state.canPlay) {
                return;
            }

            this.startAdjusting = true;
            this.manualMouseAdjustProgress(e);
        }

        /**
         * mouseMove事件处理
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'manualMouseAdjustProgress',
        value: function manualMouseAdjustProgress(e) {
            // if manual ,pause first
            if (!this.startAdjusting) {
                return;
            }

            this.pause();
            var progressBar = this.progress.progressBar,
                controller = this.progress.controller,
                bar = this.progress.bar;

            var diff = e.clientX - controller.start,
                percentage = diff / bar.len;
            percentage = (0, _lib.getPercent)(percentage);

            this.adjustProgress(percentage, true);
        }

        /**
         * 调整进度条位置
         * @param  {Float}  percentage  当前播放进度的比率
         */

    }, {
        key: 'adjustProgress',
        value: function adjustProgress(percentage) {
            var progressBar = this.progress.progressBar,
                controller = this.progress.controller,
                bar = this.progress.bar;

            // 百分比
            var videoCurrentProgress = progressBar.min + percentage * progressBar.max;

            var clength = controller.min + percentage * bar.len;
            clength = clength < controller.min ? controller.min : clength;
            clength = clength > controller.max ? controller.max : clength;

            progressBar.currentTime = percentage * progressBar.duration;
            var interval = (0, _lib.getIntervalTime)(this.props.videoData.list, this.video.id);

            this.setState({
                videoCurrentProgress: videoCurrentProgress + "%",
                videoControlLen: clength + "px",
                videoCurrentTime: progressBar.currentTime
            });
        }

        /**
         * touchend或mouseDown的处理
         * @param  {Object} e 事件对象
         */

    }, {
        key: 'manualAdjustTime',
        value: function manualAdjustTime(e) {
            this.startAdjusting = false;

            var progressBar = this.progress.progressBar,
                videoDataList = this.props.videoData.list;
            var len = videoDataList.length,
                totalTime = 0;
            var interval = (0, _lib.getIntervalTime)(videoDataList, this.video.id);

            this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
            this.play();
        }

        /**
         * 重新开始视频
         */

    }, {
        key: 'resume',
        value: function resume() {}
        // this.video.v.currentTime = 0;


        /**
         * 播放视频
         */

    }, {
        key: 'play',
        value: function play() {
            var _this2 = this;

            if (this.state.isPlay || !this.video.v.paused) {
                return;
            }

            this.setState({
                isPlay: true
            }, function () {
                // pause方法之后紧跟着play方法会报错，所以设置150ms延迟
                setTimeout(function () {
                    _this2.video.v.play();
                }, 150);
            });

            this.props.setHasPlayed && this.props.setHasPlayed();
        }

        /**
         * 暂停视频
         */

    }, {
        key: 'pause',
        value: function pause() {
            var _this3 = this;

            if (!this.video.v.played) {
                return;
            }

            this.setState({
                isPlay: false
            }, function () {
                _this3.video.v.pause();
            });
        }

        /**
         * 切换播放与暂停
         */

    }, {
        key: 'switchPlayOrPause',
        value: function switchPlayOrPause() {
            if (!this.state.canPlay) {
                return;
            }

            if (this.state.isPlay) {
                this.pause();
            } else {
                this.play();
            }
        }
    }, {
        key: 'render',
        value: function render() {

            var playBtnStyle = {
                display: this.state.canPlay && !this.state.isPlay ? "block" : "none"
            };

            return _react2.default.createElement(
                'div',
                {
                    className: 'steamer-video-wrap'
                },
                _react2.default.createElement('div', { className: 'steamer-video-mask', onClick: this.switchPlayOrPause }),
                _react2.default.createElement(
                    'div',
                    { className: 'steamer-video-loading' },
                    this.state.canPlay ? null : _react2.default.createElement('img', { src: require("../img/loading.gif") })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'steamer-video-play-btn', style: playBtnStyle },
                    _react2.default.createElement('img', { src: require("../img/playbtn.png") })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'steamer-video-control' },
                    this.state.isPlay ? _react2.default.createElement(_button.PlayButton, { pause: this.pause }) : _react2.default.createElement(_button.PauseButton, { play: this.play }),
                    _react2.default.createElement(_button.CountDown, {
                        countDownTime: (0, _lib.getCurrentCountDownTime)(this.progress.progressBar.duration, this.state.videoCurrentTime)
                    }),
                    _react2.default.createElement(_controlBar.ControlBar, {
                        videoCurrentProgress: this.state.videoCurrentProgress,
                        videoControlLen: this.state.videoControlLen,
                        manualAdjustProgress: this.manualAdjustProgress,
                        manualAdjustTime: this.manualAdjustTime,
                        manualMouseAdjustProgress: this.manualMouseAdjustProgress,
                        manualMouseDownAdjustProgress: this.manualMouseDownAdjustProgress
                    })
                )
            );
        }
    }]);

    return PlayBackController;
}(_react.Component);

exports.default = PlayBackController;