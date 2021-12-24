<template>
	<view :style="{ background: bgColor }">
		<view v-if="mode == 'line'" :style="[customStyle]" class="title-icon">
			<view class="name" :style="[nameStyle]">{{ title }}</view>
			<view class="border" :style="[lineStyle]"></view>
		</view>
		<view v-if="mode == 'icon'" class="title-icon" :style="[customStyle]">
			<dz-icon v-if="nameLeft || nameRight" :name="nameLeft ? nameLeft : nameRight" :width="iconWidth" :height="iconHeight"></dz-icon>
			<dz-icon v-else name="lightfill" size="36" :color="iconColor"></dz-icon>

			<view class="dz-flex dz-flex-column dz-flex-ajc dz-m-l-14 dz-m-r-14">
				<view class="name" :style="[nameStyle]">{{ title }}</view>
				<view v-if="tipConfig.status == 1" class="dz-m-t-5" :style="[tipStyle]">{{ tipConfig.title }}</view>
			</view>
			<dz-icon v-if="nameLeft || nameRight" :name="nameRight ? nameRight : nameLeft" :width="iconWidth" :height="iconHeight"></dz-icon>
			<dz-icon v-else name="lightfill" size="36" :color="iconColor"></dz-icon>
		</view>
		<view v-if="mode == 'linear'" class="linear">
			<view class="left" :style="[linearLeftStyle]"></view>
			<view class="name" :style="[nameStyle]">{{ title }}</view>
			<view class="right" :style="[linearRightStyle]"></view>
		</view>
		<view v-if="mode == 'text'">
			<view class="name" :style="[nameStyle]">{{ title }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		// 模式  边框 / (icon 图片)
		mode: {
			type: String,
			default: 'iocn'
		},
		nameLeft: {
			type: String,
			default: 'lightfill'
		},
		nameRight: {
			type: String,
			default: 'lightfill'
		},
		// 标题名称
		title: {
			type: String,
			default: '为你推荐'
		},
		// icon 或 图片大小
		size: {
			type: [Number, String],
			default: '36'
		},
		// 副标题
		tipConfig: {
			type: Object,
			default() {
				return {
					title: '描述',
					status: 1,
					fontSize: 12,
					color: '#333'
				};
			}
		},
		// 左边iocn 或 图片大小
		iconWidth: {
			type: [Number, String],
			default: '26'
		},
		// 右边iocn 或 图片大小
		iconHeight: {
			type: [Number, String],
			default: '26'
		},
		// icon 颜色
		iconColor: {
			type: String,
			default: '#2979ff'
		},
		// 自定义样式
		customStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 字体大小
		fontSize: {
			type: [String, Number],
			default: 36
		},
		// 字体颜色
		titleColor: {
			type: String,
			default: '#333'
		},

		// 选中项的主题颜色
		barColor: {
			type: String,
			default: '#2979ff'
		},
		barBokehColor: {
			type: String,
			default: '#f3f4f6'
		},
		// 底部边框bar的宽度，单位rpx
		barWidth: {
			type: [String, Number],
			default: 190
		},
		// bar的高度
		barHeight: {
			type: [String, Number],
			default: 16
		},
		// bar的位置
		barTop: {
			type: [String, Number],
			default: 49
		},
		// 底部边框的自定义样式
		barStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: ''
		},
		bold: {
			type: Boolean,
			default: true
		},
		// 字体位置
		textAlign: {
			type: String,
			default: 'left'
		}
	},
	computed: {
		// 边框自定义样式
		lineStyle() {
			let style = {
				width: this.barWidth + 'rpx',
				'background-color': this.barColor,
				height: this.barHeight + 'rpx',
				// 设置一个很大的值，它会自动取能用的最大值，不用高度的一半，是因为高度可能是单数，会有小数出现
				'border-radius': `${this.barHeight / 2}px`,
				top: this.barTop + 'rpx'
			};
			Object.assign(style, this.barStyle);
			return style;
		},
		// 标题自定义样式
		nameStyle() {
			let style = {
				fontSize: this.fontSize + 'rpx',
				color: this.titleColor
			};
			if (this.mode == 'text') {
				style.textAlign = this.textAlign;
			}
			return style;
		},
		// 副标题样式
		tipStyle() {
			let style = {
				fontSize: parseInt(this.tipConfig.fontSize) * 2 + 'rpx',
				color: this.tipConfig.color,
				fontWeight: this.bold ? 'bold' : 500
			};
			return style;
		},
		linearRightStyle() {
			let style = {
				width: this.barWidth + 'rpx',
				borderRadius: `${this.barHeight}rpx 0 0 ${this.barHeight}rpx`,
				height: this.barHeight + 'rpx',
				background: `linear-gradient(to left,${this.barBokehColor},${this.barColor})`
			};

			return style;
		},
		linearLeftStyle() {
			let style = {
				width: this.barWidth + 'rpx',
				borderRadius: `0 ${this.barHeight}rpx ${this.barHeight}rpx 0`,
				height: this.barHeight + 'rpx',
				background: `linear-gradient(to right,${this.barBokehColor},${this.barColor})`
			};

			return style;
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';
.title-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 20rpx 0;
	position: relative;
}
.name {
	margin: 0 20rpx;
	font-size: 36rpx;
	font-weight: bold;
	position: relative;
	z-index: 1;
}
.border {
	position: absolute;
	z-index: 0;
}
.linear {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
