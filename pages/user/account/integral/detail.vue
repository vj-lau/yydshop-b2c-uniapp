<template>
	<view>
		<dz-navbar :title="'积分明细'"></dz-navbar>
		<view class="content">
			<view class="item" v-for="(item, index) in creditsLogList" :key="index">
				<view class="name">{{ item.remark }}</view>
				<view class="price">
					<text class="time">{{ item.created_at | timeFormat }}</text>
					<text :style="{ color: parseFloat(item.num) >= 0 ? theme.dzBaseColor : '' }">{{ item.num | numFilter }}</text>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="160" text="暂无记录" :src="emptyOrder" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore :status="loadingStatus" :margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			page: 1,
			creditsLogList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '积分明细'
		});
		await this.$onLaunched;
		this.getCreditsLogList();
	},
	filters: {
		numFilter(val) {
			return val >= 0 ? `+${val.toString()}` : val;
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.creditsLogList.length = 0;
		this.getCreditsLogList();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getCreditsLogList();
	},
	methods: {
		getCreditsLogList() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.creditsLogList, {
					params: {
						page: this.page,
						page_size: 15
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == 15 ? 'loadmore' : 'nomore';
					this.creditsLogList = [...this.creditsLogList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss">
.content {
	.item {
		background-color: #ffffff;
		padding: 20rpx 30rpx;
		.name {
			font-size: 30rpx;
			color: $dz-main-color;
			padding: 10rpx 0 5rpx;
		}
		.price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: $dz-main-color;
			.time {
				margin-left: 10rpx;
				font-size: 28rpx;
				color: $dz-tips-color;
			}
		}
	}
}
</style>
