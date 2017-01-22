import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.less';

export default class SteamerVideo extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillReceiveProps(props) {
        
    }

    componentWillMount() {
        
    }

    componentDidMount() {

    }

    render() {
        let {
            autoplay,
            controls,
            preload,
            poster,
            src,
            type,
            muted,
            loop,
            // videoData,
        } = this.props;        

        // let v = videoData.list[0] || {},
        //     pic = v.pic_url || "";

        // let style = {
        //     backgroundImage: "url(" + pic + ")"
        // };

        return (
            <video
                className="sr-video-container" 
                src={src} 
                type={type}
                autoPlay={autoplay || false}
                preload={preload || true}
                controls={controls || false}
                muted={muted || false}
                poster={poster || null}
                loop={loop || false}
            >
            </video>
        )
    }
}