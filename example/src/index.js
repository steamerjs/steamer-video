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
		    list: [
		    {
		    	url: "//sznk.fcloud.store.qq.com/store_raw_download?buid=16821&uuid=330229704ea54fb887c03bb4fbfffc71&fsname=格式工厂5510  壕哥【离殇哥】最后2分钟5510频道V587的画面~1.mp4",
		    	pic_url: "//p.qpic.cn/qqconadmin/0/7edcf9acdf284a77af56d3edd1154cd6/0"
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