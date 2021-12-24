<template>
	<view
		:style="{
			margin: `${topBottom}rpx ${leftRight}rpx`,
			backgroundColor: bgColor,
			borderRadius: `${radius}rpx`,
			overflow: 'hidden'
		}"
	>
		<view v-if="list.length > 0 && propsConfig.styleGroup == 'oneLine'" style="position: relative" @tap="liveIndexClick">
			<dz-image :src="list[0] && list[0].cover" height="320"></dz-image>
			<view class="tag dz-flex" :style="{ background: parseInt(list[0].live_status) === 102 ? theme.dzBaseDisabled : 'rgba(0, 0, 0, 0.5)' }">
				<shop-loading v-if="parseInt(list[0].live_status) === 101" mode="loading-7"></shop-loading>
				<text v-if="parseInt(list[0].live_status) === 101" class="dz-m-l-6">直播中</text>
				<text v-if="parseInt(list[0].live_status) === 102" class="dz-m-l-6">预告</text>
				<text v-if="parseInt(list[0].live_status) === 103" class="dz-m-l-6">已结束</text>
			</view>
			<view class="user-info">
				<view class="dz-line-2 dz-m-b-6">{{ list[0].name }}</view>
				<view>直播时间: {{ list[0].start_time | timeFormat('mm-dd hh:MM') }}</view>
			</view>
		</view>
		<view v-else class="mplive">
			<dz-cell-item
				v-if="propsConfig.titleShow == 1"
				:title="propsConfig.title"
				:icon="propsConfig.coverShow == 1 ? propsConfig.titleCover : ''"
				:iconSize="propsConfig.coverSize * 2"
				:borderBottom="false"
				hover-class="none"
				:value="propsConfig.titleRight"
				:title-style="{ fontSize: `${propsConfig.titleSize * 2}rpx`, fontWeight: propsConfig.isBold == 1 ? 'bold' : '500', color: propsConfig.titleColor }"
				:value-style="{ fontSize: `${propsConfig.titleRightSize * 2}rpx`, color: propsConfig.titleRightColor }"
				:rightColor="propsConfig.titleRightColor"
				:rightSize="propsConfig.titleRightSize * 2"
				@click="liveIndexClick"
			></dz-cell-item>
			<scroll-view
				v-if="propsConfig.styleGroup == 'slide'"
				scroll-x
				class="h-list"
				:class="[list.length === 0 ? 'dz-box-shadow' : '', propsConfig.titleShow == 0 ? 'dz-m-t-10' : '']"
			>
				<view class="h-item" v-for="(item, index) in list" :key="index" @tap.stop="productTab(item)">
					<view class="img-box">
						<view class="h-item-img"><dz-image :src="item.cover" width="192" height="192" borderRadius="15"></dz-image></view>

						<view v-if="item.live_status == '101'" class="status dz-flex dz-row-center">
							<view><shop-loading mode="loading-7"></shop-loading></view>
							<text class="dz-m-l-8">直播中</text>
						</view>
						<view v-if="item.live_status == '102'" class="status">直播时间: {{ item.start_time | timeFormat('hh:MM') }}</view>
						<view v-if="item.live_status == '103'" class="status">已结束</view>

						<view v-if="parseInt(item.live_status) === 102" class="tip" :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }">
							预告 {{ item.start_time | timeFormat('mm-dd') }}
						</view>
					</view>

					<view class="title dz-line-2">{{ item.name }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: '#fff'
		},
		// 左右边距
		leftRight: {
			type: [String, Number],
			default: 0
		},
		// 上下边距
		topBottom: {
			type: [String, Number],
			default: 0
		},
		// 圆角
		radius: {
			type: [Number, String],
			default: 12
		},
		propsConfig: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			theme: this.$api.theme
		};
	},
	methods: {
		//直播首页
		liveIndexClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.liveIndex
			});
		},
		//直播房间
		liveTap(roomId) {
			this.$api.shop.liveNavigate(roomId);
		}
	}
};
</script>

<style lang="scss" scoped>
.tag {
	position: absolute;
	top: 20rpx;
	left: 20rpx;
	height: 52rpx;
	padding: 0 12rpx;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 26rpx 26rpx 26rpx 0;
}
.user-info {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 14rpx 20rpx;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.5);
}
.mplive {
	margin-right: 20rpx;
	.h-list {
		padding: 0 10rpx;
		margin-top: -20rpx;
		background-color: #ffffff;
		white-space: nowrap;
		.h-item {
			margin: 10rpx 10rpx 10rpx 10rpx;
			padding: 10rpx 0 5rpx;
			display: inline-block;
			background-color: #fff;
			font-size: 22rpx;
			width: 192rpx;
			border-radius: 6rpx;
			.h-item-img {
				display: inline-block;
				width: 192rpx;
				height: 192rpx;
				border-radius: 15rpx;
				overflow: hidden;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
			}
			.img-box {
				width: 100%;
				position: relative;
				width: 192rpx;
				height: 192rpx;
				border-radius: 15rpx;
				overflow: hidden;
				.status {
					position: absolute;
					bottom: 0;
					width: 100%;
					padding: 10rpx 0;
					text-align: center;
					background-color: rgba(0, 0, 0, 0.4);
					z-index: 2;
					font-size: 24rpx;
					color: #fff;
				}
				.tip {
					position: absolute;
					left: 0;
					top: 0;
					padding: 4rpx 8rpx;
					font-size: 24rpx;
					border-radius: 0 0 15rpx 0;
				}
			}
			.title {
				width: 192rpx;
				white-space: normal;
				height: 56rpx;
				line-height: 28rpx;
				font-size: 22rpx;
				padding: 0 10rpx;
				margin: 10rpx 0;
			}
		}
	}
}
</style>
