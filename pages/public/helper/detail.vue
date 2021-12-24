<template>
	<view>
		<dz-navbar :title="title" :border-bottom="false"></dz-navbar>
		<view class="content" v-if="helperView">
			<view class="title">{{ helperView.title }}</view>
			<!-- <view class="time">{{ helperView.created_at | timeFormat}}</view> -->
			<view class="news-content"><dz-parse :html="helperView.content"></dz-parse></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			helperView: {}
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: e.title
		});
		this.title = e.title;
		await this.$onLaunched;
		this.getHelperView(e.id);
	},
	methods: {
		getHelperView(id) {
			this.$api.http
				.get(this.$api.apiShop.helperView, {
					params: {
						id
					}
				})
				.then(res => {
					this.helperView = res.data;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}
.content {
	padding: 30rpx;
	.title {
		margin-bottom: 20rpx;
		color: $dz-main-color;
		font-size: 48rpx;
		font-weight: bold;
	}
	.time {
		padding: 20rpx 0 30rpx;
		font-size: 24rpx;
		color: $dz-tips-color;
	}
}
</style>
