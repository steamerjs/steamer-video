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
            // isMute: false,					// mute or note
            // audioControllerLen: "0",  		// audio controller length
            // audioVolumeBarLen: "0",			// current audio volume bar length
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
        _this.playing = _this.playing.bind(_this);
        _this.pause = _this.pause.bind(_this);
        _this.videoCanPlay = _this.videoCanPlay.bind(_this);
        _this.videoTimeUpdate = _this.videoTimeUpdate.bind(_this);
        _this.videoPlaying = _this.videoPlaying.bind(_this);
        _this.videoEnded = _this.videoEnded.bind(_this);
        _this.videoSeeking = _this.videoSeeking.bind(_this);
        _this.loadNextVideo = _this.loadNextVideo.bind(_this);
        _this.playNextVideo = _this.playNextVideo.bind(_this);

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
        // // audio setting
        // this.audio = {
        //     // audio bar
        //     bar: {
        //         len: 0,
        //     },
        //     // current audio volume bar
        //     volumeBar: {
        //         min: 0,
        //         max: 100,
        //     },
        //     // controller button
        //     controller: {
        //         start: 0,
        //         min: -5,
        //         max: 95,
        //     },
        // };
        return _this;
    }

    _createClass(PlayBackController, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // this.initTicker(nextProps);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            // this.initTicker(this.props);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var controlPos = document.querySelector('.video-bar-control').getBoundingClientRect();
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
         */

    }, {
        key: 'videoTimeUpdate',
        value: function videoTimeUpdate(e) {
            this.autoAdjustProgress(e);
        }

        /**
         * 播放结束
         */

    }, {
        key: 'videoEnded',
        value: function videoEnded(e) {
            this.playNextVideo();
            this.setState({
                isEnd: true
            });
        }

        /**
         * 开始播放
         */

    }, {
        key: 'videoPlaying',
        value: function videoPlaying(e) {
            this.playing();
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
            // todo 3是什么鬼？
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
                    v.style.background = "#000";
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

                // todo 在props的videoData上增加duration
                var videoId = this.video.id;
                if (this.props.videoData.list && this.props.videoData.list[videoId]) {
                    this.props.videoData.list[videoId].duration = duration;
                }

                this.progress.progressBar.durationText = (0, _lib.getTotalDuraction)(this.progress.progressBar.duration);
            }
        }

        /**
         * 初始化 control bar
         */

    }, {
        key: 'initProgress',
        value: function initProgress() {
            this.progress.bar.len = document.querySelector('.video-bar').clientWidth;
            this.progress.controller.max = this.progress.bar.len - 5;
        }
        /**
         * [auto ajdust the control bar while video is playing] 改变control bar
         * @param  {Object} e [event object]
         */

    }, {
        key: 'autoAdjustProgress',
        value: function autoAdjustProgress(e) {
            if (e.target.paused) {
                return;
            }

            this.initTicker(e.target.duration);

            var currentTime = e.target.currentTime,
                progressBar = this.progress.progressBar;

            var percentage = (progressBar.accuTime + currentTime) / progressBar.duration;

            percentage = (0, _lib.getPercent)(percentage); // 更新百分比样式
            // console.dev(Math.round(percentage * 10000) / 100 + "%");


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
         * @param  {Boolean} isManual   是否手动操作
         */

    }, {
        key: 'adjustProgress',
        value: function adjustProgress(percentage) {
            var isManual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

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

            if (!isManual && interval.max - progressBar.currentTime <= 10) {
                this.loadNextVideo();
            }

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

            // 当前播放时间处于当前的播放片段时，改变video的currentTime
            if (progressBar.currentTime >= interval.min && progressBar.currentTime <= interval.max) {
                this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
                this.play();
            }
            // if the current video piece is not in range, load the new piece
            else {
                    for (var i = 0; i < len; i++) {
                        var v = videoDataList[i];
                        totalTime += v.duration;
                        if (totalTime > progressBar.currentTime) {
                            progressBar.accuTime = totalTime - v.duration;
                            var volume = this.video.v.volume;
                            this.video.v.pause();
                            this.video.v.removeAttribute('src');
                            this.removeVideoEvent();
                            this.initVideo(i);
                            if (!this.video.v.src) {
                                this.video.v.src = videoDataList[i].url;
                            }
                            this.video.v.volume = volume;
                            this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
                            this.initVideoEvent();
                            this.play();
                            break;
                        }
                    }
                    interval.max = totalTime;
                }
            var currentTime = this.state.videoCurrentTime;
            if (interval.max - currentTime <= 10) {
                this.loadNextVideo();
            }
        }
        // preload the next video

    }, {
        key: 'loadNextVideo',
        value: function loadNextVideo() {
            var videoData = this.props.videoData.list,
                len = videoData.length;
            // console.log(this.video, this.video.id, len - 1);
            if (this.video.id === len - 1) {
                return;
            }
            var nextVideoId = this.video.id + 1;
            var nextVideo = this.video.list[nextVideoId % 3];
            if (!nextVideo.src) {
                nextVideo.src = videoData[nextVideoId].url;
                nextVideo.volume = this.video.v.volume;
                nextVideo.load();
            }
        }
        // play tne next video

    }, {
        key: 'playNextVideo',
        value: function playNextVideo() {
            var videoData = this.props.videoData.list,
                len = videoData.length;
            if (this.video.id === len - 1) {
                this.pause();
                return;
            }
            this.initVideo(this.video.id + 1);
            this.progress.progressBar.accuTime += this.props.videoData.list[this.video.id].duration;
            this.initVideoEvent();
            this.play();
        }
    }, {
        key: 'resume',
        value: function resume() {
            this.video.v.currentTime = 0;
        }
    }, {
        key: 'play',
        value: function play() {
            var _this2 = this;

            if (!this.state.canPlay || this.state.isPlay) {
                return;
            }

            if (this.state.isEnd) {
                this.resume();
            }

            this.setState({
                isPlay: true
            }, function () {
                _this2.video.v.play();
            });
        }
    }, {
        key: 'playing',
        value: function playing() {
            this.setState({
                isPlay: true
            });
        }
    }, {
        key: 'pause',
        value: function pause() {
            var _this3 = this;

            if (!this.state.canPlay) {
                return;
            }

            this.setState({
                isPlay: false
            }, function () {
                _this3.video.v.pause();
            });
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
                    className: 'video-wrap',
                    onClick: this.play
                },
                _react2.default.createElement(
                    'div',
                    { className: 'video-loading' },
                    this.state.canPlay ? null : _react2.default.createElement('img', { src: require("../img/loading.gif") })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'video-play-btn', style: playBtnStyle },
                    _react2.default.createElement('img', { src: require("../img/playbtn.png") })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'video-control' },
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