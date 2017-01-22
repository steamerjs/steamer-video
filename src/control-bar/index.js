import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import "./index.less";

export const ControlBar = function(props) {
    let progressStyle = {
        width: props.videoCurrentProgress
    };
    let progressBtnStyle = {
        marginLeft: props.videoControlLen
    };

    return (
        <div 
            className="video-bar"
            onTouchStart={props.manualAdjustProgress}
            onTouchMove={props.manualAdjustProgress}
            onTouchEnd={props.manualAdjustTime}
            onMouseDown={props.manualMouseDownAdjustProgress}
            onMouseMove={props.manualMouseAdjustProgress}
            onMouseUp={props.manualAdjustTime}
        >
            <div className="video-bar-progress" style={progressStyle}></div>
            <div className="video-bar-control" style={progressBtnStyle}></div>
        </div>
    )

    // return (
    //     <div className="sr-controlbar-wrapper" 
    //         onTouchStart={props.manualAdjustProgress}
    //         onTouchMove={props.manualAdjustProgress}
    //         onTouchEnd={props.manualAdjustTime}
    //     >
    //         <div className="sr-controlbar-item"></div>
    //         <div className="sr-controlbar-load"></div>
    //         <div className="sr-controlbar-progress" style={progressStyle}></div>
    //         <div className="sr-control-btn" style={progressBtnStyle}></div>
    //     </div>
    // )
};