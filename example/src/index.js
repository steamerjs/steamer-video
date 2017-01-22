import React, { Component } from 'react';
import { render } from 'react-dom';
import Video from '../../lib';

export default class Wrapper extends Component {

	constructor(props, context) {
		super(props, context);
	}

	componentDidMount() {
		
	}


	render() {

		let videoData = {
			meta: {
		        
		    },
		    list: [{
		    	url: "//sznk.fcloud.store.qq.com/store_raw_download?buid=16821&uuid=81994b5391ae4418a4a30d399b0781f2&fsname=kk 2016-12-21 22-18-15.mp4",
		    	pic_url: "http://p.qpic.cn/qqconadmin/0/772457145d19471bb1cf63ec659d0e7b/0"
		    }]
		};

		return (
	        <div>
	        	<Video 
	        		videoData={videoData}
	        	/>
	        </div>
		);
	}
}


render(
    <Wrapper />,
    document.getElementById('root')
);