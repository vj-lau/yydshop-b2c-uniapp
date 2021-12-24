<template>
	<view class="mask" :class="show ? 'mask-show' : ''" :style="{backgroundColor: maskBg}" @tap="tapMask">
		<view class="popups" :class="[theme]" :style="[popupsStyle]">
			<text v-if="triangle" class="triangle" :class="dynPlace" />
			<scroll-view v-if="direction == 'row'" class="scroll-row" scroll-x="true" :style="{width: scrollWidth}">
				<view class="scroll-row-view" v-for="(item, idx) in popData" :key="idx" @tap.stop="tapItem(item)">
					<text :class="'scroll-row-text-' + theme" :disabled="item.disabled">{{item.title}}</text>
				</view>
			</scroll-view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * @property {String} maskBg 遮罩背景颜色，默认 rgba(0,0,0,0)，不透明 
	 * @property {Boolean} value 显示或隐藏菜单，默认false，true-显示，false-隐藏 
	 * @property {Number} x 长按组件的中心值，单位px
	 * @property {Number} y 长按组件的top或bootom值，单位px
	 * @property {String} theme popup的样式，默认light，支持light和dark
	 * @property {Number} gap
	 * @property {Boolean} triangle 是否显示三角图标，默认true，true-显示，false-隐藏
	 * @property {Boolean} dynamic 是否动态显示，默认false，true-是，false-否
	 * @property {Array} popData popup的按钮数据
	 * @property {String} direction 排列方向，默认column，支持column和row
	 * @property {String} placement 三角形图标相对于menu菜单的位置，默认top-start
	 * 									top-start、top-end
	 * 									bottom-start、bottom-end
	 * 									top-center、bottom-center
	 */
	let systemInfo = uni.getSystemInfoSync();
	export default {
		name: "yinrh-menu-popup",
		props: {
			maskBg: {
				type: String,
				default: 'rgba(0,0,0,0)'
			},
			value: {
				type: Boolean,
				default: false
			},
			x: {
				type: Number,
				default: 0
			},
			y: {
				type: Number,
				default: 0
			},
			theme: {
				type: String,
				default: 'light'
			},
			gap: {
				type: Number,
				default: 20
			},
			triangle: {
				type: Boolean,
				default: true
			},
			dynamic: {
				type: Boolean,
				default: false
			},
			popData: {
				type: Array,
				default: () => []
			},
			direction: {
				type: String,
				default: 'column'
			},
			placement: {
				type: String,
				default: 'top-start'
			}
		},
		watch: {
			value: {
				immediate: true,
				handler: async function(newVal, oldVal) {
					if (newVal) await this.popupsPosition()
					this.show = newVal
				}
			},
			placement: {
				immediate: true,
				handler(newVal, oldVal) {
					this.dynPlace = newVal
				}
			}
		},
		computed: {
			/**
			 * 根据menu列表来确定menu的宽度，最大宽度为屏幕宽度的0.8倍
			 * 每个字符串的左右边距是10，单位px
			 * 每个字符串的宽度 = len * 8 + 12，单位px
			 */
			scrollWidth() {
				let width = systemInfo.screenWidth * 0.8,
					ret = 0;
				this.popData.forEach((item, index) => {
					let len = String(item.title).length;
					ret += len * 8 + 12 + 20;
				});
				return (ret > width ? width : ret) + 'px';
			}
		},
		data() {
			return {
				arrowStyle: {}, // triangle的style，确定位置
				dynPlace: '', // 三角形箭头的class字符串
				show: false, // 是否显示遮罩，true-显示，false-不显示
				popupsTop: '0px', // 不用
				popupsLeft: '0px', // 不用
				popupsStyle: {} // popups的style，确定位置和方向
			}
		},
		mounted() {
			this.popupsPosition()
		},
		methods: {
			/**
			 * 遮罩显示或隐藏
			 */
			tapMask() {
				this.$emit('input', !this.value);
			},
			/**
			 * menu菜单按钮单击事件
			 * @param {Object} item
			 */
			tapItem(item) {
				if (item.disabled) return;
				this.$emit('tapPopup', item);
				this.$emit('input', !this.value);
			},
			/**
			 * 动态获得y的值
			 * @param {Object} y
			 * @param {Object} gap
			 */
			dynamicGetY(y, gap) {
				let h = systemInfo.windowHeight;
				y = y < gap ? gap : y;
				return h - y < gap ? (h - gap) : y;
			},
			/**
			 * 动态获得x的值
			 * @param {Object} x
			 * @param {Object} gap
			 */
			dynamicGetX(x, gap) {
				let w = systemInfo.windowWidth;
				x = x < gap ? gap : x;
				return w - x < gap ? (w - gap) : x;
			},
			/**
			 * 静态获得x或y的值
			 * @param {Object} v
			 */
			transformRpx(v) {
				return v * systemInfo.screenWidth / 375;
			},
			async popupsPosition() {
				let promise = new Promise((resolve, reject) => {
					let popups = uni.createSelectorQuery().in(this);
					popups.select(".popups").fields({
						size: true,
					}, (data) => {
						let x, y;
						if (this.dynamic) { // 动态
							x = this.dynamicGetX(this.x, this.gap);
							y = this.dynamicGetY(this.y, this.gap);
						} else { // 静态
							let _v = systemInfo.screenWidth / 375;
							x = this.x * _v;
							y = this.y * _v;
						}
						let _ssw = systemInfo.screenWidth,
							_rpx = uni.upx2px(20),
							_top = y - _rpx - data.height,
							left = (_ssw - data.width) / 2;
						this.dynPlace = this.placement; // 三角形箭头
						switch (this.dynPlace) {
							case 'top-start': // 上左，y为bottom
								this.popupsStyle = {
									top: `${y + _rpx}px`,
									left: '15px',
									flexDirection: this.direction
								};
								break;
							case 'top-end': // 上右，y为bottom
								this.popupsStyle = {
									top: `${y + _rpx}px`,
									right: '15px',
									flexDirection: this.direction
								};
								break;
							case 'top-center': // 上中，y为bottom
								this.popupsStyle = {
									top: `${y + _rpx}px`,
									left: `${left}px`,
									flexDirection: this.direction
								};
								break;
							case 'bottom-start': // 下左，y为top
								this.popupsStyle = {
									top: `${_top}px`,
									left: '15px',
									flexDirection: this.direction
								};
								break;
							case 'bottom-end': // 下右，y为top
								this.popupsStyle = {
									top: `${_top}px`,
									right: '15px',
									flexDirection: this.direction
								};
								break;
							case 'bottom-center': // 下中，y为top
								this.popupsStyle = {
									top: `${_top}px`,
									left: `${left}px`,
									flexDirection: this.direction
								};
								break;
						}
						resolve()
					}).exec();
				})
				return promise
			}
		}
	}
</script>

<style lang="scss" scoped>
	/** mask：遮罩 */
	.mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9999;
		visibility: hidden;
		transition: background 0.3s ease-in-out;

		&.mask-show {
			visibility: visible;
		}
	}

	/** menu：菜单弹窗 */
	.popups {
		position: absolute;
		display: flex;
		height: 90rpx;
		border-radius: 20rpx;
		box-shadow: 0px 0px 4rpx rgba(0, 0, 0, 0.16);
		
	}

	/** scroll-row：支持横向滑动 */
	.scroll-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 90rpx;
		overflow: hidden;
		white-space: nowrap;
		box-sizing: border-box;
		
		
	}

	.scroll-row-view {
		width: auto;
		height: 50rpx;
		display: inline-block;
		margin-top: 20rpx;
		border-right: 2px solid #f3f4e6;
		
	}

	.scroll-row-view:last-child {
		border-right: 0px solid #f3f4e6;
	}

	/** scroll-view横向滑动dark的文本样式 */
	.scroll-row-text-dark {
		width: auto;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #222;
		font-size: 30rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	/** scroll-view横向滑动dark的disabled文本样式 */
	.scroll-row-text-dark[disabled] {
		color: #222 !important;
	}

	/** scroll-view横向滑动light的文本样式 */
	.scroll-row-text-light {
		width: auto;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #515A6E;
		font-size: 30rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	/** scroll-view横向滑动light的disabled文本样式 */
	.scroll-row-text-light[disabled] {
		color: #222 !important;
	}

	.triangle {
		width: 0px;
		height: 0px;
	}

	/** dark：popups的theme值，黑底白字 */
	.dark {
		background-color: #fff;

		.top-start:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 40rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}

		.top-end:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 40rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}

		.top-center:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 47%;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}

		.bottom-start:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 40rpx;
			border-width: 20rpx 20rpx 0;
			border-style: solid;
			border-color: #fff transparent transparent;
		}

		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 40rpx;
			border-width: 20rpx 20rpx 0;
			border-style: solid;
			border-color: #fff transparent transparent;
		}

		.bottom-center:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 47%;
			border-width: 20rpx 20rpx 0;
			border-style: solid;
			border-color: transparent transparent transparent;
		}
	}

	/** light：popups的theme值，白底黑字 */
	.light {
		background: #FFFFFF;
		box-shadow: 0upx 0upx 30upx rgba(0, 0, 0, 0.2);

		.top-start:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 40rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #FFFFFF;
		}

		.top-end:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 20px;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #FFFFFF;
		}

		.top-center:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 48%;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #FFFFFF;
		}

		.bottom-start:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 20px;
			border-width: 20rpx 20rpx 0;
			border-style: solid;
			border-color: #FFFFFF transparent transparent;
		}

		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 20px;
			border-width: 20rpx 20rpx 0;
			border-style: solid;
			border-color: #FFFFFF transparent transparent;
		}

		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 48%;
			border-width: 20rpx 20rpx 0;
			border-style: solid;
			border-color: #FFFFFF transparent transparent;
		}
	}





	.popups.item:last-child {
		border: none;
	}

	._right {
		border-right: 2rpx solid #CCCCCC;
	}

	._right:last-child {
		border-right: 0px solid #CCCCCC;
	}

	._bottom {
		border-bottom: 2rpx solid #CCCCCC;
	}

	._bottom:last-child {
		border-bottom: 0px solid #CCCCCC;
	}
</style>
