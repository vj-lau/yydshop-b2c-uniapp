<template>
	<view class="result-content">
		<dz-navbar title="结果"></dz-navbar>
		<block v-for="(item, index) in result" :key="index">
			<view v-if="item.content.content">
				<view class="title dz-flex">
					<view class="circle dz-m-r-12" :style="{ background: theme.dzBaseColor }"></view>
					<text>{{ item.title }}</text>
				</view>
				<view class="tip"><dz-parse class="dz-product-img" :html="item.content.content" lazy-load></dz-parse></view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			result: []
		};
	},
	onLoad(option) {
		this.result = uni.getStorageSync('calculateResult');
	}
};
</script>

<style lang="scss" scoped>
page,
.result-content {
	background: #fff;
	height: 100%;
}
.result-content {
	padding: 30rpx;
}
.title {
	margin-bottom: 30rpx;
	.circle {
		width: 16rpx;
		height: 16rpx;
		border-radius: 8rpx;
	}
}
.tip {
	margin-bottom: 30rpx;
	padding: 30rpx;
	background: #f7f8fa;
	border-radius: 20rpx;
	// color: #c0c4cc;
}
</style>
