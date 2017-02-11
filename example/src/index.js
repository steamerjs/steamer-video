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
		    list: [
		    {
		    	url: "//sznk.fcloud.store.qq.com/store_raw_download?buid=16821&uuid=81994b5391ae4418a4a30d399b0781f2&fsname=kk 2016-12-21 22-18-15.mp4",
		    	pic_url: "http://p.qpic.cn/qqconadmin/0/772457145d19471bb1cf63ec659d0e7b/0",
		    	duration: 95.446
		    },
		    {
		    	url: "//sznk.fcloud.store.qq.com/store_raw_download?buid=16821&uuid=330229704ea54fb887c03bb4fbfffc71&fsname=格式工厂5510  壕哥【离殇哥】最后2分钟5510频道V587的画面~1.mp4",
		    	pic_url: "//p.qpic.cn/qqconadmin/0/7edcf9acdf284a77af56d3edd1154cd6/0",
		    	duration: 93.7
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