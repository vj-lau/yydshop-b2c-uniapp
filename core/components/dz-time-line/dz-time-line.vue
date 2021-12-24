<template>
	<view class="dz-time-axis">
		<slot />
	</view>
</template>

<script>
	/**
	 * timeLine 时间轴
	 * @description 时间轴组件一般用于物流信息展示，各种跟时间相关的记录等场景。
	 */
	// 例子
	// <template>
	// 	<dz-time-line>
	// 		<dz-time-line-item nodeTop="2">
	// 			<!-- 此处自定义了左边内容，用一个图标替代 -->
	// 			<template v-slot:node>
	// 				<view class="dz-node" style="background: #19be6b;">
	// 					<dz-icon name="pushpin-fill" color="#fff" :size="24"></dz-icon>
	// 				</view>
	// 			</template>
	// 			<template v-slot:content>
	// 				<view>
	// 					<view class="dz-order-title">待取件</view>
	// 					<view class="dz-order-desc">[自提柜]您的快件已放在楼下侧门，直走前方53.6米，左拐约10步，再右拐直走，见一红灯笼停下，叩门三下，喊“芝麻开门”即可。</view>
	// 					<view class="dz-order-time">2019-05-08 12:12</view>
	// 				</view>
	// 			</template>
	// 		</dz-time-line-item>
	// 		<dz-time-line-item>
	// 			<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
	// 			<template v-slot:content>
	// 				<view>
	// 					<view class="dz-order-desc">【深圳市】日照香炉生紫烟，遥看瀑布挂前川，飞流直下三千尺，疑是银河落九天。</view>
	// 					<view class="dz-order-time">2019-12-06 22:30</view>
	// 				</view>
	// 			</template>
	// 		</dz-time-line-item>
	// 	</dz-time-line>
	// </template>
	
	// <style lang="scss" scoped>
	// 	.dz-node {
	// 		width: 44rpx;
	// 		height: 44rpx;
	// 		border-radius: 100rpx;
	// 		display: flex;
	// 		justify-content: center;
	// 		align-items: center;
	// 		background: #d0d0d0;
	// 	}
		
	// 	.dz-order-title {
	// 		color: #333333;
	// 		font-weight: bold;
	// 		font-size: 32rpx;
	// 	}
		
	// 	.dz-order-desc {
	// 		color: rgb(150, 150, 150);
	// 		font-size: 28rpx;
	// 		margin-bottom: 6rpx;
	// 	}
		
	// 	.dz-order-time {
	// 		color: rgb(200, 200, 200);
	// 		font-size: 26rpx;
	// 	}
	// </style>
	export default {
		name: "dz-time-line",
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../css/style.components.scss";
	
	.dz-time-axis {
		padding-left: 40rpx;
		position: relative;
	}

	.dz-time-axis::before {
		content: " ";
		position: absolute;
		left: 0;
		top: 12rpx;
		width: 1px;
		bottom: 0;
		border-left: 1px solid #ddd;
		transform-origin: 0 0;
		transform: scaleX(0.5);
	}
</style>
