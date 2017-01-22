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
            isEnd: false,
            isPlay: false, // playing or not
            isMute: false, // mute or note
            audioControllerLen: "0", // audio controller length
            audioVolumeBarLen: "0", // current audio volume bar length
            videoCurrentProgress: "0", // current video played progress
            videoControlLen: "0", // current video played progress btn
            videoCurrentTime: 0 };
        _this.startAdjusting = false;
        // this.toggleAudio = this.toggleAudio.bind(this);
        // this.adjustAudio = this.adjustAudio.bind(this);
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
            v: null, // current playing video element
            id: null, // the id of the specifying video data
            list: [], // video elements
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
        // audio setting
        _this.audio = {
            // audio bar
            bar: {
                len: 0
            },
            // current audio volume bar
            volumeBar: {
                min: 0,
                max: 100
            },
            // controller button
            controller: {
                start: 0,
                min: -5,
                max: 95
            }
        };
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
    }, {
        key: 'videoSeeking',
        value: function videoSeeking(e) {
            this.setState({
                canPlay: false
            });
        }
    }, {
        key: 'videoCanPlay',
        value: function videoCanPlay(e) {
            this.setState({
                canPlay: true
            });

            var duration = e.target.duration;
            this.props.videoData.meta.totalDuration = duration;

            // if (this.props.videoData.list.length) {
            //     this.props.videoData.list[0].duration = duration;
            // }

            this.initProgress();
            this.initTicker(duration);
        }
    }, {
        key: 'videoTimeUpdate',
        value: function videoTimeUpdate(e) {
            this.autoAdjustProgress(e);
        }
    }, {
        key: 'videoEnded',
        value: function videoEnded(e) {
            this.playNextVideo();
            this.setState({
                isEnd: true
            });
        }
    }, {
        key: 'videoPlaying',
        value: function videoPlaying(e) {
            this.playing();
        }
        /**
         * [init video element list]
         */

    }, {
        key: 'initVideoList',
        value: function initVideoList() {
            this.video.list = document.getElementById(this.props.videoIdName).children;
            this.video.listLen = this.video.list.length;
        }
        /**
         * [init video itself]
         * @param  {Integer} id [current video id]
         */

    }, {
        key: 'initVideo',
        value: function initVideo(id) {
            this.video.v = this.video.list[id % 3];
            this.video.id = id;
            var videoDataList = this.props.videoData.list;
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
            // console.log(this.video.id);
        }
        /**
         * [init the ticker riger next to play button]
         * @param  {Object} props [props passed from parent component]
         */

    }, {
        key: 'initTicker',
        value: function initTicker(duration) {
            // 已经设了就不再设duration了，这里改到timeupdate事件设，是为了兼容某些浏览器
            if (!this.progress.progressBar.duration) {
                this.progress.progressBar.duration = duration;
                this.progress.progressBar.durationText = (0, _lib.getTotalDuraction)(this.progress.progressBar.duration);
            }
        }
        /**
         * [init video control bar]
         */

    }, {
        key: 'initProgress',
        value: function initProgress() {
            this.progress.bar.len = document.querySelector('.video-bar').clientWidth;
            this.progress.controller.max = this.progress.bar.len - 5;
        }
        /**
         * [auto ajdust the control bar while video is playing]
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

            percentage = (0, _lib.getPercent)(percentage);
            // console.dev(Math.round(percentage * 10000) / 100 + "%");
            this.adjustProgress(percentage);
        }
        /**
         * [manually adjust the control bar by user]
         * @param  {Object} e [event object]
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
            percentage = (0, _lib.getPercent)(percentage);
            console.dev(Math.round(percentage * 10000) / 100 + "%");
            this.adjustProgress(percentage, true);
        }
    }, {
        key: 'manualMouseDownAdjustProgress',
        value: function manualMouseDownAdjustProgress(e) {
            if (!this.state.canPlay) {
                return;
            }

            this.startAdjusting = true;
            this.manualMouseAdjustProgress(e);
        }
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
            console.dev(Math.round(percentage * 10000) / 100 + "%");
            this.adjustProgress(percentage, true);
        }
        /**
         * [common logic adjust the bar]
         * @param  {Float}  percentage  [playing percent]
         * @param  {Boolean} isManual   [auto or manual]
         */

    }, {
        key: 'adjustProgress',
        value: function adjustProgress(percentage) {
            var isManual = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var progressBar = this.progress.progressBar,
                controller = this.progress.controller,
                bar = this.progress.bar;
            var videoCurrentProgress = progressBar.min + percentage * progressBar.max;
            var clength = controller.min + percentage * bar.len;
            clength = clength < controller.min ? controller.min : clength;
            clength = clength > controller.max ? controller.max : clength;

            progressBar.currentTime = percentage * progressBar.duration;
            var interval = (0, _lib.getIntervalTime)(this.props.videoData.list, this.video.id);
            // console.log(!isManual, interval.max, progressBar.currentTime);
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
         * [touchend then start change video currentTime]
         * @param  {Object} e [event object]
         */

    }, {
        key: 'manualAdjustTime',
        value: function manualAdjustTime(e) {
            this.startAdjusting = false;

            var progressBar = this.progress.progressBar,
                videoDataList = this.props.videoData.list;
            var len = videoDataList.length,
                totalTime = 0;
            // isInCurrentPiece = false;
            var interval = (0, _lib.getIntervalTime)(videoDataList, this.video.id);
            // console.log(this.video.id, interval.min, interval.max);
            // in current video piece, directly change video current time prop
            if (progressBar.currentTime >= interval.min && progressBar.currentTime <= interval.max) {
                this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
                // console.log(this.video.v.currentTime, progressBar.currentTime, progressBar.accuTime, progressBar.currentTime - progressBar.accuTime);
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
        // init video volume part
        // initAudio() {
        //     this.audio.controller.start = document.querySelector('.sr-control-panel-right').offsetLeft + 30;
        //     this.audio.bar.len = document.querySelector('.sr-audio-bar').clientWidth;
        //     this.setState({
        //         audioControllerLen: "95px",
        //         audioVolumeBarLen: "100px",
        //     });
        // }
        // // mute the audio or not
        // toggleAudio() {
        //     let isMute = this.state.isMute,
        //         controller = this.audio.controller,
        //         volumeBar = this.audio.volumeBar;
        //     this.setState({
        //         isMute: isMute ? false : true,
        //         audioControllerLen: isMute ? controller.max + "px" : controller.min + "px",
        //         audioVolumeBarLen: isMute ? volumeBar.max + "%" : volumeBar.min + "%",	
        //     }, () => {
        //         this.video.v.volume = (this.state.isMute) ? 0 : 1;
        //     });
        // }
        // move / touch the audio bar
        // adjustAudio(e) {
        //     let controller  = this.audio.controller,
        //         bar = this.audio.bar,
        //         volumeBar = this.audio.volumeBar;
        //     let diff = e.changedTouches[0].clientX - controller.start,
        //         percentage = diff / bar.len;
        //     percentage = (percentage > 1) ? 1 : percentage,
        //     percentage = (percentage < 0) ? 0 : percentage;
        //     // controller length
        //     let clength = controller.min + percentage * bar.len;
        //         clength = (clength < controller.min) ? controller.min : clength;
        //         clength = (clength > controller.max) ? controller.max : clength;
        //     // current volume bar length
        //     let blength = volumeBar.min + percentage * 100;
        //         blength = (blength < volumeBar.min) ? volumeBar.min : blength;
        //         blength = (blength > volumeBar.max) ? volumeBar.max : blength;
        //     // set video volume
        //     this.video.v.volume = percentage;
        //     this.setState({
        //         audioControllerLen: clength,
        //         audioVolumeBarLen: blength + "%"
        //     });
        //     if (clength === controller.min && !this.state.mute 
        //         || clength > controller.min && this.state.mute) {
        //         this.toggleAudio();
        //     }
        // }

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