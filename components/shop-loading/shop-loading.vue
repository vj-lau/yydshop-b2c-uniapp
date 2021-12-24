<template>
	<view class="shop-loading">
		<!-- loading -->
		<view v-if="mode == 'loading-1'" class="la-square-jelly-box la-2x" :style="[loadingSize]">
			<view :style="[loadingStyle]"></view>
			<view></view>
		</view>
		<view
			v-if="mode == 'loading-2'"
			class="spinner-inside"
			:style="{
				width: size + 110 + 'rpx'
			}"
		>
			<view :style="{ backgroundColor: color }" class="bounce1"></view>
			<view :style="{ backgroundColor: color }" class="bounce2"></view>
			<view :style="{ backgroundColor: color }" class="bounce3"></view>
		</view>
		<view v-if="mode == 'loading-3'" class="loading_3"></view>
		<view v-if="mode == 'loading-4'" class="loading-4">
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
		</view>
		<view v-if="mode == 'loading-5'" class="loading-5"></view>
		<view v-if="mode == 'loading-6'" class="loading-6"></view>
		<view v-if="mode == 'loading-7'" class="loading-7">
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
			<text :style="[loadingStyle]"></text>
		</view>
		<view v-if="mode == 'loading-8'" class="loading-8" :style="{
				width: `80rpx`,
				height: `80rpx`
			}">
			<view class="load8-container container1">
				<view :style="[loadingStyle]" class="circle1"></view>
				<view :style="[loadingStyle]" class="circle2"></view>
				<view :style="[loadingStyle]" class="circle3"></view>
				<view :style="[loadingStyle]" class="circle4"></view>
			</view>
			<view class="load8-container container2">
				<view :style="[loadingStyle]" class="circle1"></view>
				<view :style="[loadingStyle]" class="circle2"></view>
				<view :style="[loadingStyle]" class="circle3"></view>
				<view :style="[loadingStyle]" class="circle4"></view>
			</view>
			<view class="load8-container container3">
				<view :style="[loadingStyle]" class="circle1"></view>
				<view :style="[loadingStyle]" class="circle2"></view>
				<view :style="[loadingStyle]" class="circle3"></view>
				<view :style="[loadingStyle]" class="circle4"></view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * loading 加载动画
 * @description 警此组件为一个小动画，目前用在loadmore加载更多和switch开关等组件的正在加载状态场景。
 * @property {String} mode 模式选择，（默认circle）
 * @property {String} color 动画活动区域的颜色，只对 mode = flower 模式有效（默认#c7c7c7）
 * @property {String Number} size 加载图标的大小，单位rpx（默认34）
 * @property {Boolean} show 是否显示动画（默认true）
 * @example <dz-loading mode="circle"></dz-loading>
 */
export default {
	name: 'shop-loading',
	props: {
		// 动画的类型
		mode: {
			type: String,
			default: 'loading-1'
		},
		// 动画的颜色
		color: {
			type: String,
			default: '#c7c7c7'
		},
		// 加载图标的大小，单位rpx
		size: {
			type: [String, Number],
			default: '34'
		},
		borderColor: {
			type: String,
			default: '#e4e4e4'
		}
	},
	computed: {
		// 加载中动画的样式
		loadingStyle() {
			let style = {};
			if (this.mode == 'loading-1') {
				style.background = `${this.color ? this.color : '#c7c7c7'}`;
				style.borderColor = `${this.color ? this.color : '#c7c7c7'}`;
			}
			if (this.mode == 'loading-4') {
				style.background = `${this.color ? this.color : '#c7c7c7'}`;
			}
			if (this.mode == 'loading-8') {
				style.background = `${this.color ? this.color : '#5cdbd3'}`;
			}
			return style;
		},
		// loading大小
		loadingSize() {
			let style = {};
			style.width = this.size + 'rpx';
			style.height = this.size + 'rpx';
			return style;
		}
	}
};
</script>

<style lang="scss" scoped>
.shop-loading {
	display: flex;
	align-items: center;
	justify-content: center;
}

// loading1
.la-square-jelly-box,
.la-square-jelly-box > view {
	position: relative;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box;
}

.la-square-jelly-box {
	display: block;
	font-size: 0;
	color: #fff;
}

.la-square-jelly-box.la-dark {
	color: #333;
}

.la-square-jelly-box > view {
	display: inline-block;
	float: none;
	background-color: pink;
	border: 0 solid pink;
}

.la-square-jelly-box {
	width: 32rpx;
	height: 32rpx;
}

.la-square-jelly-box > view:nth-child(1),
.la-square-jelly-box > view:nth-child(2) {
	position: absolute;
	left: 0;
	width: 100%;
}

.la-square-jelly-box > view:nth-child(1) {
	top: -25%;
	z-index: 1;
	height: 100%;
	border-radius: 10%;
	-webkit-animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
	-moz-animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
	-o-animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
	animation: square-jelly-box-animate 0.6s -0.1s linear infinite;
}

.la-square-jelly-box > view:nth-child(2) {
	bottom: -9%;
	height: 10%;
	background: #000;
	border-radius: 50%;
	opacity: 0.2;
	-webkit-animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
	-moz-animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
	-o-animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
	animation: square-jelly-box-shadow 0.6s -0.1s linear infinite;
}

.la-square-jelly-box.la-2x {
	width: 64rpx;
	height: 64rpx;
}

@-webkit-keyframes square-jelly-box-animate {
	17% {
		border-bottom-right-radius: 10%;
	}

	25% {
		-webkit-transform: translateY(25%) rotate(22.5deg);
		transform: translateY(25%) rotate(22.5deg);
	}

	50% {
		border-bottom-right-radius: 100%;
		-webkit-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
		transform: translateY(50%) scale(1, 0.9) rotate(45deg);
	}

	75% {
		-webkit-transform: translateY(25%) rotate(67.5deg);
		transform: translateY(25%) rotate(67.5deg);
	}

	100% {
		-webkit-transform: translateY(0) rotate(90deg);
		transform: translateY(0) rotate(90deg);
	}
}

@-moz-keyframes square-jelly-box-animate {
	17% {
		border-bottom-right-radius: 10%;
	}

	25% {
		-moz-transform: translateY(25%) rotate(22.5deg);
		transform: translateY(25%) rotate(22.5deg);
	}

	50% {
		border-bottom-right-radius: 100%;
		-moz-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
		transform: translateY(50%) scale(1, 0.9) rotate(45deg);
	}

	75% {
		-moz-transform: translateY(25%) rotate(67.5deg);
		transform: translateY(25%) rotate(67.5deg);
	}

	100% {
		-moz-transform: translateY(0) rotate(90deg);
		transform: translateY(0) rotate(90deg);
	}
}

@-o-keyframes square-jelly-box-animate {
	17% {
		border-bottom-right-radius: 10%;
	}

	25% {
		-o-transform: translateY(25%) rotate(22.5deg);
		transform: translateY(25%) rotate(22.5deg);
	}

	50% {
		border-bottom-right-radius: 100%;
		-o-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
		transform: translateY(50%) scale(1, 0.9) rotate(45deg);
	}

	75% {
		-o-transform: translateY(25%) rotate(67.5deg);
		transform: translateY(25%) rotate(67.5deg);
	}

	100% {
		-o-transform: translateY(0) rotate(90deg);
		transform: translateY(0) rotate(90deg);
	}
}

@keyframes square-jelly-box-animate {
	17% {
		border-bottom-right-radius: 10%;
	}

	25% {
		-webkit-transform: translateY(25%) rotate(22.5deg);
		-moz-transform: translateY(25%) rotate(22.5deg);
		-o-transform: translateY(25%) rotate(22.5deg);
		transform: translateY(25%) rotate(22.5deg);
	}

	50% {
		border-bottom-right-radius: 100%;
		-webkit-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
		-moz-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
		-o-transform: translateY(50%) scale(1, 0.9) rotate(45deg);
		transform: translateY(50%) scale(1, 0.9) rotate(45deg);
	}

	75% {
		-webkit-transform: translateY(25%) rotate(67.5deg);
		-moz-transform: translateY(25%) rotate(67.5deg);
		-o-transform: translateY(25%) rotate(67.5deg);
		transform: translateY(25%) rotate(67.5deg);
	}

	100% {
		-webkit-transform: translateY(0) rotate(90deg);
		-moz-transform: translateY(0) rotate(90deg);
		-o-transform: translateY(0) rotate(90deg);
		transform: translateY(0) rotate(90deg);
	}
}

@-webkit-keyframes square-jelly-box-shadow {
	50% {
		-webkit-transform: scale(1.25, 1);
		transform: scale(1.25, 1);
	}
}

@-moz-keyframes square-jelly-box-shadow {
	50% {
		-moz-transform: scale(1.25, 1);
		transform: scale(1.25, 1);
	}
}

@-o-keyframes square-jelly-box-shadow {
	50% {
		-o-transform: scale(1.25, 1);
		transform: scale(1.25, 1);
	}
}

@keyframes square-jelly-box-shadow {
	50% {
		-webkit-transform: scale(1.25, 1);
		-moz-transform: scale(1.25, 1);
		-o-transform: scale(1.25, 1);
		transform: scale(1.25, 1);
	}
}

// loading2
.spinner-inside {
	margin: 25rpx auto;
	text-align: center;
}

.spinner-inside > view {
	width: 24rpx;
	height: 24rpx;
	margin-right: 4rpx;
	border-radius: 100%;
	display: inline-block;
	-webkit-animation: bouncedelay 1.4s infinite ease-in-out;
	animation: bouncedelay 1.4s infinite ease-in-out;
	/* Prevent first frame from flickering when animation starts */
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.spinner-inside .bounce1 {
	-webkit-animation-delay: -0.32s;
	animation-delay: -0.32s;
}

.spinner-inside .bounce2 {
	-webkit-animation-delay: -0.16s;
	animation-delay: -0.16s;
}

@-webkit-keyframes bouncedelay {
	0%,
	80%,
	100% {
		-webkit-transform: scale(0);
	}
	40% {
		-webkit-transform: scale(1);
	}
}

@keyframes bouncedelay {
	0%,
	80%,
	100% {
		transform: scale(0);
		-webkit-transform: scale(0);
	}
	40% {
		transform: scale(1);
		-webkit-transform: scale(1);
	}
}

.loading_3 {
	position: relative;
	margin-left: -40rpx;
}
.loading_3:before {
	width: 20rpx;
	height: 20rpx;
	border-radius: 20rpx;
	background: blue;
	content: '';
	position: absolute;
	background: #7a80fc;
	animation: loading_3_before 1.2s infinite ease-in-out;
}

.loading_3:after {
	width: 20rpx;
	height: 20rpx;
	border-radius: 20rpx;
	background: blue;
	content: '';
	position: absolute;
	background: #42e38d;
	left: 22rpx;
	animation: loading_3_after 1.2s infinite ease-in-out;
}

@keyframes loading_3_before {
	0% {
		transform: translateX(0px) rotate(0deg);
	}
	50% {
		transform: translateX(30rpx) scale(1.2) rotate(260deg);
		background: #42e38d;
	}
	100% {
		transform: translateX(0px) rotate(0deg);
	}
}
@keyframes loading_3_after {
	0% {
		transform: translateX(0px);
	}
	50% {
		transform: translateX(-30rpx) scale(1.2) rotate(-260deg);
		background: #7a80fc;
	}
	100% {
		transform: translateX(0px);
	}
}

.loading-4 {
	width: 36px;
	height: 12px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
}
.loading-4 text {
	display: inline-block;
	width: 3px;
	height: 100%;
	border-radius: 1.5px;
	background: lightgreen;
	-webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
	0%,
	100% {
		height: 12px;
	}
	50% {
		height: 22px;
		margin-top: -10px;
	}
}
.loading-4 text:nth-child(2) {
	-webkit-animation-delay: 0.13s;
}
.loading-4 text:nth-child(3) {
	-webkit-animation-delay: 0.26s;
}
.loading-4 text:nth-child(4) {
	-webkit-animation-delay: 0.39s;
}
.loading-4 text:nth-child(5) {
	-webkit-animation-delay: 0.52s;
}
.loading-4 text:nth-child(6) {
	-webkit-animation-delay: 0.67s;
}

.loading-5 {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: inline-block;
	border-top: 6rpx solid #42e38d;
	border-right: 6rpx solid transparent;
	-webkit-animation: rotation 1s linear infinite;
	animation: rotation 1s linear infinite;
}
.loading-5:after {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	border-left: 6rpx solid #ff3d00;
	border-bottom: 6rpx solid transparent;
	animation: rotation 0.5s linear infinite reverse;
}

@-webkit-keyframes rotation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.loading-6 {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: inline-block;
	position: relative;
	border: 5rpx solid #333;
	-webkit-animation: rotation 1s linear infinite;
	animation: rotation 1s linear infinite;
}
.loading-6:after {
	content: '';
	position: absolute;
	left: 4rpx;
	top: 4rpx;
	border: 2rpx solid #333;
	width: 9rpx;
	margin: 7rpx;
	height: 9rpx;
	background: #333;
	border-radius: 50%;
}

@keyframes rotation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.loading-7 {
	display: flex;
	justify-content: space-between;
	width: 32rpx;
	height: 16rpx;
	margin: 0 auto;
}
.loading-7 text {
	display: inline-block;
	width: 6rpx;
	height: 100%;
	background: red;
	border-radius: 4rpx;
	-webkit-animation: mplive 0.9s ease infinite;
}
@-webkit-keyframes mplive {
    0%,
    100% {
      height: 20rpx;
    }
    50% {
      height: 30rpx;
      margin-top: -10rpx;
    }
  }
.loading-7 text:nth-child(2) {
	-webkit-animation-delay: 0.13s;
}
.loading-7 text:nth-child(3) {
	-webkit-animation-delay: 0.26s;
}

/* load8 */
.loading-8 {
	margin: auto;
	position: relative;
}

.container1 > view,
.container2 > view,
.container3 > view {
	width: 12px;
	height: 12px;
	border-radius: 100%;
	position: absolute;
	-webkit-animation: bouncedelay 1.2s infinite ease-in-out;
	animation: bouncedelay 1.2s infinite ease-in-out;
	-webkit-animation-fill-mode: both;
	animation-fill-mode: both;
}

.loading-8 .load8-container {
	position: absolute;
	width: 100%;
	height: 100%;
}

.container2 {
	-webkit-transform: rotateZ(45deg);
	transform: rotateZ(45deg);
}

.container3 {
	-webkit-transform: rotateZ(90deg);
	transform: rotateZ(90deg);
}

.circle1 {
	top: 0;
	left: 0;
}
.circle2 {
	top: 0;
	right: 0;
}
.circle3 {
	right: 0;
	bottom: 0;
}
.circle4 {
	left: 0;
	bottom: 0;
}

.container2 .circle1 {
	-webkit-animation-delay: -1.1s;
	animation-delay: -1.1s;
}

.container3 .circle1 {
	-webkit-animation-delay: -1s;
	animation-delay: -1s;
}

.container1 .circle2 {
	-webkit-animation-delay: -0.9s;
	animation-delay: -0.9s;
}

.container2 .circle2 {
	-webkit-animation-delay: -0.8s;
	animation-delay: -0.8s;
}

.container3 .circle2 {
	-webkit-animation-delay: -0.7s;
	animation-delay: -0.7s;
}

.container1 .circle3 {
	-webkit-animation-delay: -0.6s;
	animation-delay: -0.6s;
}

.container2 .circle3 {
	-webkit-animation-delay: -0.5s;
	animation-delay: -0.5s;
}

.container3 .circle3 {
	-webkit-animation-delay: -0.4s;
	animation-delay: -0.4s;
}

.container1 .circle4 {
	-webkit-animation-delay: -0.3s;
	animation-delay: -0.3s;
}

.container2 .circle4 {
	-webkit-animation-delay: -0.2s;
	animation-delay: -0.2s;
}

.container3 .circle4 {
	-webkit-animation-delay: -0.1s;
	animation-delay: -0.1s;
}

@-webkit-keyframes bouncedelay {
	0%,
	80%,
	100% {
		-webkit-transform: scale(0);
	}
	40% {
		-webkit-transform: scale(1);
	}
}

@keyframes bouncedelay {
	0%,
	80%,
	100% {
		transform: scale(0);
		-webkit-transform: scale(0);
	}
	40% {
		transform: scale(1);
		-webkit-transform: scale(1);
	}
}
</style>
