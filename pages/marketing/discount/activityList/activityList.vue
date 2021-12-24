<template>
	<view class="activity">
		<dz-navbar :title="language.discount.activitiesList"></dz-navbar>
		<view class="content" v-if="discountData.length > 0">
			<view class="activity-item" v-for="(item, index) in discountData" :key="index" @tap="toDiscount(item)">
				<dz-image :src="item.cover" width="100%" height="320"></dz-image>
				<view class="msg">
					<view v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)">
						<text>{{ language.discount.noTime }}</text>
						<dz-count-down
							:timestamp="parseInt(item.end_time_left)"
							separator="zd"
							:bg-color="theme.dzBaseColor"
							font-size="24"
							separator-size="22"
							:separator-color="theme.dzTipsColor"
							:color="theme.dzBaseFontColor"
							style="margin-left: 10rpx;"
							@end="timeOut(index)"
						></dz-count-down>
					</view>
					<text v-if="parseInt(item.state) != 1 && (item.end_time_left && item.end_time_left < 0)">{{ language.discount.timeOut }}</text>
					<view class="title">{{ item.discount_name }}</view>
					<view class="tip">{{ item.description }}</view>
				</view>
			</view>
		</view>
		<view v-if="loadingStatus != 'nodata'" class="dz-p-b-20"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			discountData: [],
			loadingStatus: 'loading',
			type: ''
		};
	},
	async onLoad(option) {
		this.type = option.type;
		uni.setNavigationBarTitle({ title: this.$api.language.discount.activitiesList });
		await this.$onLaunched;
		this.getDiscountIndex();
	},
	onPullDownRefresh() {
		this.discountData.length = 0;
		this.getDiscountIndex();
	},
	methods: {
		async getDiscountIndex() {
			this.loadingStatus = 'loading';
			let path = this.type == 'data' ? (path = 'discountIndex') : 'discountSoon';
			await this.$api.http
				.get(this.$api.apiShop[path])
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.discountData = res.data.discount;
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		toDiscount(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.discountList,
				query: {
					id: item.id,
					cover: item.cover,
					name: item.discount_name,
					type: this.type
				}
			});
		},
		// 倒计时
		timeOut(index) {
			this.discountData[index].state = 3;
			this.discountData[index].end_time_left = -1;
			this.$set(this.discountData, this.discountData[index]);
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 20rpx;
	background-color: #fff;
}
.activity-item {
	border-radius: 20rpx 20rpx 0 0;
	overflow: hidden;
	width: 100%;
	margin-bottom: 40rpx;
	image {
		width: 100%;
		height: 320rpx;
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
	}
	text {
		color: $dz-tips-color;
	}
	.msg {
		padding: 10rpx 20rpx;
	}
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: $dz-main-color;
		margin-bottom: 6rpx;
	}
	.tip {
		font-size: 24rpx;
		color: $dz-tips-color;
	}
}
</style>
