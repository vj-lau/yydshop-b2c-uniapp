<template>
	<view>
		<scroll-view id="_scroll" scroll-x="true" class="scroll-tap" :scroll-left="slider.scrollLeft" scroll-with-animation>
			<view class="scroll-item" :id="'dz-tab-item-' + index" v-for="(item, index) in list" :key="index" @tap="tabClick(index)">
				<view class="image" :style="[activeStyle(index)]">
					<view v-if="index == 0" class="all">
						<dz-icon class="dz-m-l-4 dz-m-t-4" name="categoryfill" size="76" :color="index == activeIndex ? activeColor : '#DBDBDB'"></dz-icon>
					</view>
					<dz-image v-else :src="item.cover ? item.cover : pCover" borderRadius="12" width="100%" height="100%"></dz-image>
				</view>
				<view class="title dz-line-1" :style="{ color: index == activeIndex ? activeColor : inactiveColor }">{{ item.title }}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	name: 'shop-cate-tab',
	props: {
		//需循环的标签列表
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 当前活动tab的索引
		activeIndex: {
			type: [Number, String],
			default: 0
		},
		// 卡片背景颜色
		bgColor: {
			type: String,
			default: '#f3f4f6'
		},
		// 选中项的主题颜色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 未选中项的颜色
		inactiveColor: {
			type: String,
			default: '#303133'
		},
		// 无图片展示
		pCover: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			logo: this.$api.shopSetting.store_logo,
			tagIndex: 0,
			scorll: {},
			slider: {
				left: 0,
				width: 0,
				scrollLeft: 0
			}
		};
	},
	watch: {
		// 监听tab的变化，重新计算tab菜单的布局信息，因为实际使用中菜单可能是通过
		// 后台获取的（如新闻app顶部的菜单），获取返回需要一定时间，所以list变化时，重新获取布局信息
		list() {
			// 用$nextTick等待视图更新完毕后再计算tab的局部信息，否则可能因为tab还没生成就获取，就会有问题
			this.$nextTick(() => {
				this.calcScrollPosition();
			});
		}
	},
	computed: {
		activeStyle(index) {
			return index => {
				let style = {};
				if (index == this.activeIndex && index != 0) {
					style.border = `1px solid ${this.activeColor}`;
					style.background = '';
				} else {
					style = {
						background: this.bgColor
					};
				}
				return style;
			};
		}
	},
	mounted() {
		this.tagIndex = this.activeIndex;
		this.$nextTick(() => {
			this.calcScrollPosition();
		});
	},
	methods: {
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
			let data = this.list;
			if (data.length == 0) return false;
			const query = uni.createSelectorQuery().in(this);
			query
				.select('#dz-tab-item-' + index)
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
			let _slider = this.list[index]._slider;
			let scorll_left = (this.scorll && this.scorll.left) || 0;
			this.slider = {
				left: _slider.left - scorll_left,
				width: _slider.width,
				scrollLeft: _slider.scrollLeft - scorll_left
			};
		},
		tabClick(index) {
			this.tagIndex = index;
			this.tabToIndex(index);
			this.$emit('tabClick', index);
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-tap {
	white-space: nowrap;
	touch-action: none;
	.scroll-item {
		display: inline-block;
		text-align: center;
		margin-right: 16rpx;
		.image {
			width: 110rpx;
			height: 110rpx;
			margin-bottom: 6rpx;
			border-radius: 12rpx;
			box-sizing: border-box;
			.all {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
			}
		}
		.title {
			width: 110rpx;
			font-size: 22rpx;
		}
	}
	.scroll-item:last-child {
		margin-right: 0;
	}
}
</style>
