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
        this.pause = this.pause.bind(this);
        this.videoCanPlay = this.videoCanPlay.bind(this);
        this.videoTimeUpdate = this.videoTimeUpdate.bind(this);
        this.videoPlaying = this.videoPlaying.bind(this);
        this.videoEnded = this.videoEnded.bind(this);
        this.videoSeeking = this.videoSeeking.bind(this);
        this.switchPlayOrPause = this.switchPlayOrPause.bind(this);

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
    }
    componentWillMount() {
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
     * @param  {Object} e 事件对象
     */
    videoSeeking(e) {
        this.setState({
            canPlay: false
        });
    }

    /**
     * 浏览器能够播放媒体，但估计以当前播放速率不能直接将媒体播完，播放期间需要缓冲
     * @param  {Object} e 事件对象
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
     * @param  {Object} e 事件对象
     */
    videoTimeUpdate(e) {
        this.autoAdjustProgress(e);
    }

    /**
     * 播放结束
     * @param  {Object} e 事件对象
     */
    videoEnded(e) {
        // this.playNextVideo();
        this.setState({
            isEnd: true
        });

        // 重置视频
        // this.resume();
        this.pause();

        this.adjustProgress(0);
    }

    /**
     * 开始播放
     * @param  {Object} e 事件对象
     */
    videoPlaying(e) {
        this.setState({
            isPlay: true
        });

       
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
                // v.style.background = "#000";
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
            this.progress.progressBar.durationText = getTotalDuraction(this.progress.progressBar.duration);

            // todo 在props的videoData上增加duration
            var videoId = this.video.id;
            if(this.props.videoData.list && this.props.videoData.list[videoId] 
                && !this.props.videoData.list[videoId].duration) {
                this.props.videoData.list[videoId].duration = duration;
            }
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
     * 自动播放视频时改变进度条
     * @param  {Object} e 事件对象
     */
    autoAdjustProgress(e) {
        if (e.target.paused) {
            return;
        }
        
        // this.initTicker(e.target.duration);

        let currentTime = e.target.currentTime,
            progressBar = this.progress.progressBar;

        let percentage = (progressBar.accuTime + currentTime) / progressBar.duration;
        
        percentage = getPercent(percentage);    // 更新百分比样式

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
     * @param  {Object} e 事件对象
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
     * @param  {Object} e 事件对象
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
     */
    adjustProgress(percentage) {
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


        this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
        this.play();


    }

    /**
     * 重新开始视频
     */
    resume() {
        // this.video.v.currentTime = 0;
    }

    /**
     * 播放视频
     */
    play() {
        if (this.state.isPlay || !this.video.v.paused) {
            return;
        }


        this.setState({
            isPlay: true
        }, () => {
            // pause方法之后紧跟着play方法会报错，所以设置150ms延迟
            setTimeout(() => {
                this.video.v.play();
            }, 150);
            
        });

        this.props.setHasPlayed && this.props.setHasPlayed();
    }


    /**
     * 暂停视频
     */
    pause() {
        if (!this.video.v.played) {
            return;
        }

        this.setState({
            isPlay: false
        }, () => {
            this.video.v.pause();
        });
    }

    /**
     * 切换播放与暂停
     */
    switchPlayOrPause() {
        if(!this.state.canPlay) {
            return;
        }

        if(this.state.isPlay) {
            this.pause();
            
        } else {
            this.play();
        }
    }
 
    render() {
            
            let playBtnStyle = {
                display: (this.state.canPlay && !this.state.isPlay) ? "block" : "none"
            };

            return (
                <div 
                    className="video-wrap"
                >
                    <div className="video-mask" onClick={this.switchPlayOrPause}></div>
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