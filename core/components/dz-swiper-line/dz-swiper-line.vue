<template>
	<view class="_tab-box">
		<scroll-view id="_scroll" :scroll-x="true" class="scroll-view-h" scroll-with-animation :scroll-left="slider.scrollLeft">
			<view class="_scroll-content">
				<view class="_tab-item-box" :class="[defaultConfig.itemWidth ? '_clamp' : '_flex']">
					<block v-for="(item, index) in tabList" :key="index">
						<view class="_item" :id="'_tab_' + index" :style="{ width: defaultConfig.itemWidth ? defaultConfig.itemWidth + 'px' : '' }"></view>
					</block>
				</view>
				<view
					class="_underline"
					:style="{
						transform: 'translateX(' + slider.left + 'px)',
						width: slider.width + 'px',
						height: defaultConfig.underLineHeight + 'rpx',
						backgroundColor: activeColor
					}"
				/>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'dz-swiper-line',
	props: {
		tabData: {
			type: Array,
			default: () => []
		},
		activeIndex: {
			type: Number,
			default: 0
		},
		// 选中项的主题颜色
		activeColor: {
			type: String,
			default: 'rgba(255, 255, 255, 0.8)'
		},
		config: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			tabList: [],
			tagIndex: 0,
			slider: {
				left: 0,
				width: 0,
				scrollLeft: 0
			},
			scorll: {},
			defaultConfig: {
				// item宽度 0为自动
				itemWidth: 15,
				// 下划线宽度 rpx  注意：设置了此值 underLinePadding 失效
				underLineWidth: 15,
				// 下划线高度 rpx
				underLineHeight: 5,
				// 下划线颜色
				underLineColor: '#fff'
			}
		};
	},
	watch: {
		config(value) {
			this.updateConfig();
		},
		activeIndex: {
			immediate: true,
			handler(nVal, oVal) {
				// 视图更新后再执行移动操作
				this.$nextTick(() => {
					this.tagIndex = nVal;
					this.tabClick(nVal);
				});
			}
		}
	},
	created() {
		// 将list的数据，传入tabList数组，因为不能修改props传递的list值
		// 可以接受直接数组形式，或者数组元素为对象的形式，如：['简介', '评论'],或者[{name: '简介'}, {name: '评论'}]
		this.tabList = this.tabData.map((val, index) => {
			if (typeof val != 'object') {
				let obj = {
					width: 0,
				};
				return obj;
			} else {
				val.width = 0;
				return val;
			}
		});
	},
	mounted() {
	
			setTimeout(() => {
				this.calcScrollPosition();
			}, 10);
		
	},
	methods: {
		updateConfig() {
			this.defaultConfig = Object.assign(this.defaultConfig, this.config);
		},
		calcScrollPosition() {
			const query = uni.createSelectorQuery().in(this);

			query
				.select('#_scroll')
				.boundingClientRect(res => {
					this.scorll = res;
					this.updateTabWidth();
				})
				.exec();
		},
		updateTabWidth(index = 0) {
			let data = this.tabList;

			if (data.length == 0) return false;

			const query = uni.createSelectorQuery().in(this);

			query
				.select('#_tab_' + index)
				.boundingClientRect(res => {
					data[index]._slider = {
						width: res.width,
						left: res.left,
						scrollLeft: res.left - (data[index - 1] ? data[index - 1]._slider.width : 0)
					};
					if (this.tagIndex == index) {
						this.tabToIndex(this.tagIndex);
					}

					index++;

					if (data.length > index) {
						this.updateTabWidth(index);
					}
				})
				.exec();
		},

		tabToIndex(index) {
			if(this.tabList.length == 0) return
			let _slider = this.tabList[index]._slider;
			if(!_slider) return
			let width = this.defaultConfig.underLineWidth;
			// if (!width) {
			// 	console.log(this.defaultConfig.itemWidth,)
			// 	if (this.defaultConfig.itemWidth) {
			// 		width = uni.upx2px(this.defaultConfig.itemWidth);
			// 	}
			// // 	width += uni.upx2px(this.defaultConfig.underLinePadding) * 2;
			// }
			let scorll_left = 0
			if(this.scorll){
				scorll_left = this.scorll.left || 0;
			}
			this.slider = {
				left: _slider.left - scorll_left + (_slider.width - width) / 2,
				width: width,
				scrollLeft: _slider.scrollLeft - scorll_left
			};
		},

		tabClick(index) {
			this.tagIndex = index;
			this.tabToIndex(index);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';

._tab-box {
	width: 100%;
	@include vue-flex;
	position: relative;
	height: 5rpx;
	border-radius: 2.5rpx;
	background: hsla(0, 0%, 100%, 0.3);
	z-index: 10;
	.scroll-view-h {
		white-space: nowrap;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		._scroll-content {
			width: 100%;
			height: 100%;
			position: relative;

			._tab-item-box {
				height: 100%;
				&._flex {
					@include vue-flex;
					._item {
						flex: 1;
					}
				}
				&._clamp {
					._item {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				._item {
					height: 100%;
					display: inline-block;
					text-align: center;
					position: relative;
					text-align: center;
				}
			}
			._underline {
				height: 5rpx;
				border-radius: 2.5rpx;
				transition: 0.5s;
				position: absolute;
				bottom: 0;
			}
		}
	}
}
</style>
