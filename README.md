## react-list-scroll

### Usage

```javascript
import Scroll from "react-list-scroll";
import List from "./list";

<Scroll
	
>
	<List></List>
</Scroll>
```

### Options

`props.xxx`

```javascript
<Scroll
	disable={xxx}
	isEnd={xxx}
	loadDataForScroll={() => {}}
>

</Scroll>
```

* disable
	- disable scroll event
* isEnd
	- the list reaches the end
* loadDataForScroll
	- callback passed from parent component

`this.scrollEle.xxx`

```javascript
<Scroll
	ref={(scrollEle) => {
		this.scrollEle = scrollEle;
	}}
>
</Scroll>

this.scrollEle.xxx
```

* prvScrollTop
	- position of last scroll



### Caveat
* If there two list, please put them inside Scroll like this:

```javascript
<Scroll>
	<List></List>
	<List></List>
</Scroll>
```

If your two-list scrolling is using `block` and `none` to display, please put your restoring scrolling position logic inside your switching tab logic.


如果是双列表滚动，且使用display的block和none切换，则请在切换列表的方法内，进行还原prvScrollTop


If your two-list scrolling requires destruction of another list, you can destroy `<Scroll>` and recreate it. After `componentWillMount` is called, you can restore the position via `prvScrollTop`

如果是双列表滚动，但使用替换的方式切换，则可以通过销毁<Scroll>同时重新创建，然后触发componentWillMount去还原prvScrollTop