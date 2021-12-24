<template>
	<view class="dz-button-tabs" :style="{
		background: bgColor,
		padding: `${padding}rpx`,
		margin: `${topBottom}rpx ${leftRight}rpx`,
		borderRadius: `${radius}rpx`
	}">
		<!-- $mGetRect()对组件根节点无效，因为写了.in(this)，故这里获取内层接点尺寸 -->
		<view :id="id">
			<scroll-view scroll-x class="dz-scroll-view" :scroll-left="scrollLeft" scroll-with-animation>
				<view class="dz-scroll-box" :class="{'dz-tabs-scorll-flex': !isScroll}" :style="{height: height + 'rpx'}">
					<view class="dz-tab-item dz-line-1" :id="'dz-tab-item-' + index" v-for="(item, index) in list" :key="index" @tap="clickTab(index)"
					 :style="[tabItemStyle(index)]">
						{{ item[name] || item['name']}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	/**
	 * tabs 标签
	 * @description 该组件，是一个tabs标签组件，在标签多的时候，可以配置为左右滑动，标签少的时候，可以禁止滑动。 该组件的一个特点是配置为滚动模式时，激活的tab会自动移动到组件的中间位置。 
	 * @property {Boolean} is-scroll tabs是否可以左右拖动（默认true）
	 * @property {Array} list 标签数组，元素为对象，如[{name: '推荐'}]
	 * @property {String Number} current 指定哪个tab为激活状态（默认0）
	 * @property {String Number} height 导航栏的高度，单位rpx（默认60）
	 * @property {String Number} border-radius tab圆角，单位rpx（默认30）
	 * @property {String Number} font-size tab文字大小，单位rpx（默认30）
	 * @property {String} active-color 滑块和激活tab文字的颜色（默认#2979ff）
	 * @property {String} inactive-color tabs文字颜色（默认#303133）
	 * @property {Object} active-item-style 活动tabs item的样式，对象形式
	 * @property {String Number} item-width 标签的宽度（默认auto）
	 * @property {String Number} gutter 单个tab标签的左右内边距之和，单位rpx（默认40）
	 * @property {String} bg-color tabs导航栏的背景颜色（默认#ffffff）
	 * @property {String} name 组件内部读取的list参数中的属性名（tab名称），（默认name）
	 * @property {String} count 组件内部读取的list参数中的属性名（badge徽标数），同name属性的使用，（默认count）
	 * @property {Array} offset 设置badge徽标数的位置偏移，格式为 [x, y]，也即设置的为top和right的值，单位rpx（默认[5, 20]）
	 * @property {Boolean} bold 激活选项的字体是否加粗（默认true）
	 * @event {Function} change 点击标签时触发
	 * @example <dz-tabs ref="tabs" :list="list" :is-scroll="false"></dz-tabs>
	 */
	export default {
		name: "dz-button-tabs",
		props: {
			// 导航菜单是否需要滚动，如只有2或者3个的时候，就不需要滚动了，此时使用flex平分tab的宽度
			isScroll: {
				type: Boolean,
				default: true
			},
			//需循环的标签列表
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			// 当前活动tab的索引
			current: {
				type: [Number, String],
				default: 0
			},
			// 导航栏的高度和行高
			height: {
				type: [String, Number],
				default: 60
			},
			// 内边距
			padding: {
				type: [String, Number],
				default: 0
			},
			// 圆角
			radius: {
				type: [String, Number],
				default:  0
			},
			// tab圆角
			buttonRadius: {
				type: [String, Number],
				default: 12
			},
			// 左右边距
			leftRight: {
				type: [String, Number],
				default: 20
			},
			// 上下边距
			topBottom: {
				type: [String, Number],
				default: 10
			},
			// 字体大小
			fontSize: {
				type: [String, Number],
				default: 30
			},
			// 选中项的主题颜色
			activeColor: {
				type: String,
				default: '#fff'
			},
			// 未选中项的颜色
			inactiveColor: {
				type: String,
				default: '#303133'
			},
			// 选中项的背景颜色
			activeBgColor: {
				type: String,
				default: '#2979ff'
			},
			// 未选中项的颜色
			inactiveBgColor: {
				type: String,
				default: '#fff'
			},
			// 单个tab的左或有内边距（左右相同）
			gutter: {
				type: [String, Number],
				default: 30
			},
			// 导航栏的背景颜色
			bgColor: {
				type: String,
				default: ''
			},
			// 读取传入的数组对象的属性(tab名称)
			name: {
				type: String,
				default: 'name'
			},
			
			// 活动tab字体是否加粗
			bold: {
				type: Boolean,
				default: true
			},
			// 当前活动tab item的样式
			activeItemStyle: {
				type: Object,
				default() {
					return {}
				}
			},
			// 标签的宽度
			itemWidth: {
				type: [Number, String],
				default: 'auto'
			}
		},
		data() {
			return {
				scrollLeft: 0, // 滚动scroll-view的左边滚动距离
				tabQueryInfo: [], // 存放对tab菜单查询后的节点信息
				componentWidth: 0, // 屏幕宽度，单位为px
				parentLeft: 0, // 父元素(tabs组件)到屏幕左边的距离
				id: this.$api.helper.guid(), // id值
				currentIndex: this.current,
				
			};
		},
		watch: {
			// 监听tab的变化，重新计算tab菜单的布局信息，因为实际使用中菜单可能是通过
			// 后台获取的（如新闻app顶部的菜单），获取返回需要一定时间，所以list变化时，重新获取布局信息
			list(n, o) {
				// list变动时，重制内部索引，否则可能导致超出数组边界的情况
				if(n.length !== o.length) this.currentIndex = 0;
				// 用$nextTick等待视图更新完毕后再计算tab的局部信息，否则可能因为tab还没生成就获取，就会有问题
				this.$nextTick(() => {
					this.init();
				});
			},
			current: {
				immediate: true,
				handler(nVal, oVal) {
					// 视图更新后再执行移动操作
					this.$nextTick(() => {
						this.currentIndex = nVal;
						this.scrollByIndex();
					});
				}
			},
		},
		computed: {
			// tab的样式
			tabItemStyle() {
				return (index) => {
					let style = {
						height: this.height + 'rpx',
						'line-height': this.height + 'rpx',
						'font-size': this.fontSize + 'rpx',
						padding: this.isScroll ? `0 ${this.gutter}rpx` : '',
						borderRadius: this.buttonRadius + 'rpx',
						flex: this.isScroll ? 'auto' : '1',
						width: this.$api.components.addUnit(this.itemWidth),
						background: this.inactiveBgColor
					};
					// 字体加粗
					if (index == this.currentIndex && this.bold) style.fontWeight = 'bold';
					if (index == this.currentIndex) {
						style.color = this.activeColor;
						style.background = this.activeBgColor;
						// 给选中的tab item添加外部自定义的样式
						style = Object.assign(style, this.activeItemStyle);
					} else {
						style.color = this.inactiveColor;
					}
					return style;
				}
			}
		},
		methods: {
			// 设置一个init方法，方便多处调用
			async init() {
				// 获取tabs组件的尺寸信息
				let tabRect = await this.$mGetRect('#' + this.id);
				// tabs组件距离屏幕左边的宽度
				this.parentLeft = tabRect.left;
				// tabs组件的宽度
				this.componentWidth = tabRect.width;
				this.getTabRect();
			},
			// 点击某一个tab菜单
			clickTab(index) {
				// 点击当前活动tab，不触发事件
				if(index == this.currentIndex) return ;
				// 发送事件给父组件
				this.$emit('change', index);
			},
			// 查询tab的布局信息
			getTabRect() {
				// 创建节点查询
				let query = uni.createSelectorQuery().in(this);
				// 历遍所有tab，这里是执行了查询，最终使用exec()会一次性返回查询的数组结果
				for (let i = 0; i < this.list.length; i++) {
					// 只要size和rect两个参数
					query.select(`#dz-tab-item-${i}`).fields({
						size: true,
						rect: true
					});
				}
				// 执行查询，一次性获取多个结果
				query.exec(
					function(res) {
						this.tabQueryInfo = res;
						// 初始化滚动条和移动bar的位置
						this.scrollByIndex();
					}.bind(this)
				);
			},
			// 滚动scroll-view，让活动的tab处于屏幕的中间位置
			scrollByIndex() {
				// 当前活动tab的布局信息，有tab菜单的width和left(为元素左边界到父元素左边界的距离)等信息
				let tabInfo = this.tabQueryInfo[this.currentIndex];
				if (!tabInfo) return;
				// 活动tab的宽度
				let tabWidth = tabInfo.width;
				// 活动item的左边到tabs组件左边的距离，用item的left减去tabs的left
				let offsetLeft = tabInfo.left - this.parentLeft;
				// 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
				let scrollLeft = offsetLeft - (this.componentWidth - tabWidth) / 2;
				this.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft;
			}
		},
		mounted() {
			this.init();
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../css/style.components.scss";
	
	view,
	scroll-view {
		box-sizing: border-box;
	}

	/* #ifndef APP-NVUE */
	::-webkit-scrollbar,
	::-webkit-scrollbar,
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
	/* #endif */

	.dz-scroll-box {
		position: relative;
		/* #ifdef MP-TOUTIAO */
		white-space: nowrap;
		/* #endif */
	}

	/* #ifdef H5 */
	// 通过样式穿透，隐藏H5下，scroll-view下的滚动条
	scroll-view ::v-deep ::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
	/* #endif */

	.dz-scroll-view {
		width: 100%;
		white-space: nowrap;
		position: relative;
	}

	.dz-tab-item {
		position: relative;
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		margin-right: 20rpx;
		text-align: center;
		transition-property: background-color, color;
	}
	.dz-tab-item:last-child {
		margin-right: 0rpx;
	}
	

	.dz-tabs-scorll-flex {
		@include vue-flex;
		justify-content: space-between;
	}
</style>
