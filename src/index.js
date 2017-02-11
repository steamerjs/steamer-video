import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.less';
import PlayBackController from './playback-control';
import VideoPlayer from './video-player';

export default class Video extends Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			
		};
	}

	componentWillMount() {
		
	}

	componentDidMount() {
		
	}

	componentWillUnmount() {
		
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
				className="video-wrapper" 
				style={style}
				onTouchMove={(e) => {
					e.preventDefault();
				}}
			>
				{/*
				<div 
					className="video-cover"
				></div>*/}
				<div 
					className="video-player"
				>
					<div className="video-frame" style={videoFrameStyle}>
						<div id="video-list">
							<VideoPlayer 
								className="video-frame"
			                    type={"video/mp4"}
			                    autoplay={false}
			                    preload={true}
			                    poster={require("./img/black-bg.png")}
							/>
						</div>
						{/*<div className="video-list-innert-mask"></div>
						<div className="mask"></div>*/}
						{
							videoData.list[0].url ? 
								<PlayBackController 
									videoData={videoData} 
									videoIdName={"video-list"}
								/> : null
						}
					</div>
					{/*
					<div className="video-card">
						<div className="profile-action">
						</div>
					</div>*/}
				</div>
			</div>
		)
	}
}