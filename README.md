steamer-video
==========

通用的steamer video组件

适用范围
----------

移动端React


示例
----------

```javascript
import Video from '../../lib';

export default class Wrapper extends Component {

	constructor(props, context) {
		super(props, context);
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
```

API
----------

### <Video />
Video视频React Element类

#### props说明
| 名称 | 类型 | 描述 |
| :------------- | :--------| :-- |
| videoData | Object | video数据，具体格式请参考示例 |


开发环境
----------

请打开两个cmd，运行以下两个命令
```shell
npm run dev
```
```shell
npm start
```


Fiddler配置
----------
http://steamer-video.com/index.html    path\steamer-video\example\dev\index.html
regex:^https?:\/\/steamer-video.com\/(.*)$    path\steamer-video\example\dev\$1