import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import "./index.less";

export const PlayButton = function(props) {
    return (
        <div className="steamer-video-pause" onClick={props.pause}>
            <img src={require('./img/pause.png')}/>
        </div>
    )
};

export const PauseButton = function(props) {
    return (
        <div className="steamer-video-pause" onClick={props.play}>
            <img src={require('./img/play.png')}/>
        </div>
    )
}

export const CountDown = function(props) {
    
    return (
        <div className="steamer-video-timing">{props.countDownTime}</div>
    )
};