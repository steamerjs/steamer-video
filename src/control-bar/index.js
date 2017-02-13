import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import "./index.less";

export const ControlBar = function(props) {
    let progressStyle = {
        width: props.videoCurrentProgress
    };
    let progressBtnStyle = {
        marginLeft: props.videoControlLen
    };  // 圈圈

    return (
        <div 
            className="steamer-video-bar"
            onTouchStart={props.manualAdjustProgress}
            onTouchMove={props.manualAdjustProgress}
            onTouchEnd={props.manualAdjustTime}
            onMouseDown={props.manualMouseDownAdjustProgress}
            onMouseMove={props.manualMouseAdjustProgress}
            onMouseUp={props.manualAdjustTime}
        >
            <div className="steamer-video-bar-progress" style={progressStyle}></div>
            <div className="steamer-video-bar-control" style={progressBtnStyle}></div>
        </div>
    )
};