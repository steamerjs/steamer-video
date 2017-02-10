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
            loop
        } = this.props;        



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