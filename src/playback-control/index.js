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
            isEnd: false,                
            isPlay: false,					// playing or not
            isMute: false,					// mute or note
            audioControllerLen: "0",  		// audio controller length
            audioVolumeBarLen: "0",			// current audio volume bar length
            videoCurrentProgress: "0",      // current video played progress
            videoControlLen: "0",			// current video played progress btn
            videoCurrentTime: 0,			// video current time
        };
        this.startAdjusting = false;
        // this.toggleAudio = this.toggleAudio.bind(this);
        // this.adjustAudio = this.adjustAudio.bind(this);
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
            v: null,			// current playing video element
            id: null,			// the id of the specifying video data
            list: [],			// video elements
            listLen: 0,			// number of video elements
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
        // audio setting
        this.audio = {
            // audio bar
            bar: {
                len: 0,
            },
            // current audio volume bar
            volumeBar: {
                min: 0,
                max: 100,
            },
            // controller button
            controller: {
                start: 0,
                min: -5,
                max: 95,
            },
        };
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

    videoSeeking(e) {
        this.setState({
            canPlay: false
        });
    }

    videoCanPlay(e) {
        this.setState({
            canPlay: true
        });
        
        let duration = e.target.duration;
        this.props.videoData.meta.totalDuration = duration;

        // if (this.props.videoData.list.length) {
        //     this.props.videoData.list[0].duration = duration;
        // }

        this.initProgress();
        this.initTicker(duration);

    }
    videoTimeUpdate(e) {
        this.autoAdjustProgress(e);
    }
    videoEnded(e) {
        this.playNextVideo();
        this.setState({
            isEnd: true
        });
    }
    videoPlaying(e) {
        this.playing();
    }
    /**
     * [init video element list]
     */
    initVideoList() {
        this.video.list = document.getElementById(this.props.videoIdName).children;
        this.video.listLen = this.video.list.length;
    }
    /**
     * [init video itself]
     * @param  {Integer} id [current video id]
     */
    initVideo(id) {
        this.video.v = this.video.list[id % 3];
        this.video.id = id;
        let videoDataList = this.props.videoData.list;
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
        // console.log(this.video.id);
    }
    /**
     * [init the ticker riger next to play button]
     * @param  {Object} props [props passed from parent component]
     */
    initTicker(duration) {
        // 已经设了就不再设duration了，这里改到timeupdate事件设，是为了兼容某些浏览器
        if (!this.progress.progressBar.duration) {
            this.progress.progressBar.duration = duration;
            this.progress.progressBar.durationText = getTotalDuraction(this.progress.progressBar.duration);
        }
    }
    /**
     * [init video control bar]
     */
    initProgress() {
        this.progress.bar.len = document.querySelector('.video-bar').clientWidth;
        this.progress.controller.max = this.progress.bar.len - 5;
    }
    /**
     * [auto ajdust the control bar while video is playing]
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
        
        percentage = getPercent(percentage);
        // console.dev(Math.round(percentage * 10000) / 100 + "%");
        this.adjustProgress(percentage);
    }
    /**
     * [manually adjust the control bar by user]
     * @param  {Object} e [event object]
     */
    manualAdjustProgress(e) {
        // if manual ,pause first
        this.pause();
        let progressBar = this.progress.progressBar,
            controller = this.progress.controller,
            bar = this.progress.bar;
        let diff = e.changedTouches[0].clientX - controller.start,
            percentage = diff / bar.len;
        percentage = getPercent(percentage);
        console.dev(Math.round(percentage * 10000) / 100 + "%");
        this.adjustProgress(percentage, true);
    }

    manualMouseDownAdjustProgress(e) {
        if (!this.state.canPlay) {
            return;
        }

        this.startAdjusting = true;
        this.manualMouseAdjustProgress(e);
    }

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
        console.dev(Math.round(percentage * 10000) / 100 + "%");
        this.adjustProgress(percentage, true);
    }
    /**
     * [common logic adjust the bar]
     * @param  {Float}  percentage  [playing percent]
     * @param  {Boolean} isManual   [auto or manual]
     */
    adjustProgress(percentage, isManual = false) {
        let progressBar = this.progress.progressBar,
            controller = this.progress.controller,
            bar = this.progress.bar;
        let videoCurrentProgress = progressBar.min + percentage * progressBar.max;
        let clength = controller.min + percentage * bar.len;
            clength = (clength < controller.min) ? controller.min : clength;
            clength = (clength > controller.max) ? controller.max : clength;
        
        progressBar.currentTime = percentage * progressBar.duration;
        let interval = getIntervalTime(this.props.videoData.list, this.video.id);
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
    manualAdjustTime(e) {
        this.startAdjusting = false;

        let progressBar = this.progress.progressBar,
            videoDataList = this.props.videoData.list;
        let len = videoDataList.length,
            totalTime = 0;
            // isInCurrentPiece = false;
        let interval = getIntervalTime(videoDataList, this.video.id);
        // console.log(this.video.id, interval.min, interval.max);
        // in current video piece, directly change video current time prop
        if (progressBar.currentTime >= interval.min 
            && progressBar.currentTime <= interval.max) {
            this.video.v.currentTime = progressBar.currentTime - progressBar.accuTime;
            // console.log(this.video.v.currentTime, progressBar.currentTime, progressBar.accuTime, progressBar.currentTime - progressBar.accuTime);
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