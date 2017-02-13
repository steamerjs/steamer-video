import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.less';
import PlayBackController from './playback-control';
import VideoPlayer from './video-player';

export default class Video extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			hasPlayed: false	// 是否已经播放过	
		};

		this.setHasPlayed = this.setHasPlayed.bind(this);
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		
	}

	componentWillUnmount() {
		
	}

	setHasPlayed() {
		this.setState({
			hasPlayed: true
		});
	}

	render() {

		let {
			videoData,
		} = this.props;

		let windowScrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
			windowScrollTop += 80;


		let style = {
			display: "block",
			height: window.document.body.scrollHeight + "px",
			width: window.document.body.clientWidth + "px",
		};

		let v = videoData.list[0] || {},
            pic = v.pic_url || "";
            pic = pic.replace("http:", "").replace("https:", "");

        let videoFrameStyle = {
            backgroundImage: "url(" + pic + ")"
        };


		return (
			<div 
				className="steamer-video-wrapper" 
				style={style}
				onTouchMove={(e) => {
					e.preventDefault();
				}}
			>
				<div 
					className="steamer-video-player"
				>
					<div className="steamer-video-frame" style={videoFrameStyle}>
						<div id="steamer-video-list" className={this.state.hasPlayed ? "" : "none"}>
							<VideoPlayer 
								className="steamer-video-frame"
			                    type={"video/mp4"}
			                    autoplay={false}
			                    preload={true}
			                    poster={require("./img/black-bg.png")}
							/>
							
						</div>
						{
							videoData.list[0].url ? 
								<PlayBackController 
									videoData={videoData} 
									videoIdName={"steamer-video-list"}
									setHasPlayed={this.setHasPlayed}
								/> : null
						}
					</div>
				</div>
			</div>
		)
	}
}