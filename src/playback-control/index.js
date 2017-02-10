import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { 
    getCurrentTime, 
    getTotalDuraction, 
    getIntervalTime, 
    getPercent,
    getCurrentCountDownTime,
} from '../lib/';

import { 
    PlayButton, 
    PauseButton, 
    CountDown,
} from '../button';
import { ControlBar } from "../control-bar";

import './index.less';


export default class PlayBackController extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            canPlay: false,                 
            isEnd: false,                   // 是否播放结束     
            isPlay: false,					// 是否正在播放
            // isMute: false,					// mute or note
            // audioControllerLen: "0",  		// audio controller length
            // audioVolumeBarLen: "0",			// current audio volume bar length
            videoCurrentProgress: "0",      // 进度条已播放的长度百分比
            videoControlLen: "0",			// 进度条圈圈控件离里进度条最左边的距离
            videoCurrentTime: 0,			// 当前播放的时间，单位为秒
        };
        this.startAdjusting = false;

        this.autoAdjustProgress = this.autoAdjustProgress.bind(this);
        this.manualAdjustProgress = this.manualAdjustProgress.bind(this);
        this.manualMouseDownAdjustProgress = this.manualMouseDownAdjustProgress.bind(this);
        this.manualMouseAdjustProgress = this.manualMouseAdjustProgress.bind(this);
        this.manualAdjustTime = this.manualAdjustTime.bind(this);
        this.play = this.play.bind(this);
        this.playing = this.playing.bind(this);
        this.pause = this.pause.bind(this);
        this.videoCanPlay = this.videoCanPlay.bind(this);
        this.videoTimeUpdate = this.videoTimeUpdate.bind(this);
        this.videoPlaying = this.videoPlaying.bind(this);
        this.videoEnded = this.videoEnded.bind(this);
        this.videoSeeking = this.videoSeeking.bind(this);
        this.loadNextVideo = this.loadNextVideo.bind(this);
        this.playNextVideo = this.playNextVideo.bind(this);

        this.video = {
            v: null,			// 当前播放的video element
            id: null,			// 当前播放的video的下标
            list: [],			// video element列表
            listLen: 0,			// video element列表长度
        };
        // control bar
        this.progress = {
            bar : {
                len: 0,
            },
            loadBar: {
                min: 0,
                max: 100,
            },
            progressBar: {
                min: 0,
                max: 100,
                accuTime: 0,    // already played time
                currentTime: 0, // current movie progress time 
                duration: 0, 	// total movie time
                durationText: "0:00", // total move time string  
            },
            controller: {
                start: 0,
                min: 0,
                max: 100,
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
    }
    componentWillReceiveProps(nextProps) {
        // this.initTicker(nextProps);
    }
    componentWillMount() {
        // this.initTicker(this.props);
    }
    componentDidMount() {
        let controlPos = document.querySelector('.video-bar-control').getBoundingClientRect();
        this.progress.controller.start = controlPos.left;

        this.initVideoList();
        this.initVideo(0);
        this.initVideoEvent();
    }
    componentWillUnmount() {
        console.log("=====componentWillUnmount child====");
        this.removeVideoEvent();
    }
    removeVideoEvent() {
        let v = this.video.v;
        v.removeEventListener('canplay', this.videoCanPlay);
        v.removeEventListener('timeupdate', this.videoTimeUpdate);
        v.removeEventListener('playing', this.videoPlaying);
        v.removeEventListener('ended', this.videoEnded);
        v.removeEventListener('seeking', this.videoSeeking);
    }
    initVideoEvent() {
        let v = this.video.v;
        v.addEventListener('canplay', this.videoCanPlay);
        v.addEventListener('timeupdate', this.videoTimeUpdate);
        v.addEventListener('playing', this.videoPlaying);
        v.addEventListener('ended', this.videoEnded);
        v.addEventListener('seeking', this.videoSeeking);
    }

    /**
     * 浏览器正在请求数据
     */
    videoSeeking(e) {
        this.setState({
            canPlay: false
        });
    }

    /**
     * 浏览器能够播放媒体，但估计以当前播放速率不能直接将媒体播完，播放期间需要缓冲
     */
    videoCanPlay(e) {
        this.setState({
            canPlay: true
        });
        
        let duration = e.target.duration;
        this.props.videoData.meta.totalDuration = duration;

        this.initProgress();
        this.initTicker(duration);

    }

    /**
     * 当前播放位置发生改变
     */
    videoTimeUpdate(e) {
        this.autoAdjustProgress(e);
    }

    /**
     * 播放结束
     */
    videoEnded(e) {
        this.playNextVideo();
        this.setState({
            isEnd: true
        });
    }

    /**
     * 开始播放
     */
    videoPlaying(e) {
        this.playing();
    }

    /**
     * 初始化video element列表
     */
    initVideoList() {
        this.video.list = document.getElementById(this.props.videoIdName).children;
        this.video.listLen = this.video.list.length;
    }

    /**
     * 初始化当前video
     * @param  {Integer} id 当前video的id
     */
    initVideo(id) {
        // todo 3是什么鬼？
        this.video.v = this.video.list[id % 3]; // 当前的video DOM对象
        this.video.id = id;
        let videoDataList = this.props.videoData.list;
        // 加载视频
        if (!this.video.v.src) {
            this.video.v.src = videoDataList[id].url;
            this.video.v.load();
        }
        // let the one with src on top
        for (let i = 0; i < this.video.listLen; i++) {
            let v = this.video.list[i];
            if (id % 3 === i) {
                v.style.display = "block";
                v.style.background = "#000";
            }
            else {
                v.style.display = "none";
            }
        }
    }
    /**
     * 初始化总播放时间
     * @param  {Float} 总播放时间
     */
    initTicker(duration) {
        // 已经设了就不再设duration了，这里改到timeupdate事件设，是为了兼容某些浏览器
        if (!this.progress.progressBar.duration) {
            this.progress.progressBar.duration = duration;

            // todo 在props的videoData上增加duration
            var videoId = this.video.id;
            if(this.props.videoData.list && this.props.videoData.list[videoId]) {
                this.props.videoData.list[videoId].duration = duration;
            }

            this.progress.progressBar.durationText = getTotalDuraction(this.progress.progressBar.duration);
        }
    }

    /**
     * 初始化 control bar
     */
    initProgress() {
        this.progress.bar.len = document.querySelector('.video-bar').clientWidth;
        this.progress.controller.max = this.progress.bar.len - 5;
    }
    /**
     * [auto ajdust the control bar while video is playing] 改变control bar
     * @param  {Object} e [event object]
     */
    autoAdjustProgress(e) {
        if (e.target.paused) {
            return;
        }
        
        this.initTicker(e.target.duration);

        let currentTime = e.target.currentTime,
            progressBar = this.progress.progressBar;

        let percentage = (progressBar.accuTime + currentTime) / progressBar.duration;
        
        percentage = getPercent(percentage);    // 更新百分比样式
        // console.dev(Math.round(percentage * 10000) / 100 + "%");


        this.adjustProgress(percentage);
    }
    /**
     * 用户操作(点击或移动)control bar，touchstart或touchmove时触发
     * @param  {Object} e 事件对象
     */
    manualAdjustProgress(e) {
        // if manual ,pause first
        this.pause();
        let progressBar = this.progress.progressBar,
            controller = this.progress.controller,
            bar = this.progress.bar;

        let diff = e.changedTouches[0].clientX - controller.start,
            percentage = diff / bar.len;


        percentage = getPercent(percentage);    // 根据鼠标位置对比，获取百分比

        this.adjustProgress(percentage, true);
    }

    /**
     * mouseDown事件处理
     */
    manualMouseDownAdjustProgress(e) {
        if (!this.state.canPlay) {
            return;
        }

        this.startAdjusting = true;
        this.manualMouseAdjustProgress(e);
    }

    /**
     * mouseMove事件处理
     */
    manualMouseAdjustProgress(e) {
        // if manual ,pause first
        if (!this.startAdjusting) {
            return;
        }

        this.pause();
        let progressBar = this.progress.progressBar,
            controller = this.progress.controller,
            bar = this.progress.bar;

        let diff = e.clientX - controller.start,
            percentage = diff / bar.len;
        percentage = getPercent(percentage);

        this.adjustProgress(percentage, true);
    }
    /**
     * 调整进度条位置
     * @param  {Float}  percentage  当前播放进度的比率
     * @param  {Boolean} isManual   是否手动操作
     */
    adjustProgress(percentage, isManual = false) {
        let progressBar = this.progress.progressBar,
            controller = this.progress.controller,
            bar = this.progress.bar;

        // 百分比
        let videoCurrentProgress = progressBar.min + percentage * progressBar.max;

        let clength = controller.min + percentage * bar.len;
            clength = (clength < controller.min) ? controller.min : clength;
            clength = (clength > controller.max) ? controller.max : clength;
        
        progressBar.currentTime = percentage * progressBar.duration;
        let interval = getIntervalTime(this.props.videoData.list, this.video.id);

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
    manualAdjustTime(e) {
        this.startAdjusting = false;

        let progressBar = this.progress.progressBar,
            videoDataList = this.props.videoData.list;
        let len = videoDataList.length,
            totalTime = 0;
        let interval = getIntervalTime(videoDataList, this.video.id);


        // 当前播放时间处于当前的播放片段时，改变video的currentTime
        if (progressBar.currentTime >= interval.min 
            && progressBar.currentTime <= interval.max) {
            this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
            this.play();
        }
        // if the current video piece is not in range, load the new piece
        else {
            for (let i = 0; i < len; i++) {
                let v = videoDataList[i];
                totalTime += v.duration;
                if (totalTime > progressBar.currentTime) {
                    progressBar.accuTime = totalTime - v.duration;
                    let volume = this.video.v.volume;
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
        let currentTime = this.state.videoCurrentTime;
        if (interval.max - currentTime <= 10) {
            this.loadNextVideo();
        }
    }
    // preload the next video
    loadNextVideo() {
        let videoData = this.props.videoData.list,
            len = videoData.length;
        // console.log(this.video, this.video.id, len - 1);
        if (this.video.id === len - 1) {
            return;
        }
        let nextVideoId = this.video.id + 1;
        let nextVideo = this.video.list[nextVideoId % 3];
        if (!nextVideo.src) {
            nextVideo.src = videoData[nextVideoId].url;
            nextVideo.volume = this.video.v.volume;
            nextVideo.load();
        }
    }
    // play tne next video
    playNextVideo() {
        let videoData = this.props.videoData.list,
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
    resume() {
        this.video.v.currentTime = 0;
    }
    play() {

        if (!this.state.canPlay || this.state.isPlay) {
            return;
        }

        if (this.state.isEnd) {
            this.resume();
        }

        this.setState({
            isPlay: true
        }, () => {
            this.video.v.play();
        });
    }
    playing() {
        this.setState({
            isPlay: true
        });
    }
    pause() {

        if (!this.state.canPlay) {
            return;
        }

        this.setState({
            isPlay: false
        }, () => {
            this.video.v.pause();
        });
    }
 
    render() {
            
            let playBtnStyle = {
                display: (this.state.canPlay && !this.state.isPlay) ? "block" : "none"
            };

            return (
                <div 
                    className="video-wrap"
                    onClick={this.play}
                >
                    <div className="video-loading">
                        {
                            this.state.canPlay ? 
                            null : <img src={require("../img/loading.gif")} />
                        }
                    </div>
                    <div className="video-play-btn" style={playBtnStyle}>
                        <img src={require("../img/playbtn.png")}/>
                    </div>
                    <div className="video-control">
                        {
                            (this.state.isPlay) ? 
                            <PlayButton pause={this.pause} /> : 
                            <PauseButton play={this.play}/>
                        }
                        <CountDown 
                            countDownTime={getCurrentCountDownTime(this.progress.progressBar.duration, this.state.videoCurrentTime)}
                        />
                        <ControlBar 
                            videoCurrentProgress={this.state.videoCurrentProgress}
                            videoControlLen={this.state.videoControlLen}
                            manualAdjustProgress={this.manualAdjustProgress}
                            manualAdjustTime={this.manualAdjustTime}
                            manualMouseAdjustProgress={this.manualMouseAdjustProgress}
                            manualMouseDownAdjustProgress={this.manualMouseDownAdjustProgress}
                        />
                    </div>
                </div>
            )
    }
}