<template>
	<view>
		<dz-navbar title="升级日志" :borderBottom="false"></dz-navbar>
		<view class="content">
			<view class="storeLevel-item" v-for="(item, index) in storeLevelLog" :key="index">
				<view class="num">
					<text class="title">变更等级:</text>
					<text v-if="item.newWarehouseLevel" :style="{ color: theme.dzBaseColor }">{{ item.newWarehouseLevel.name }}</text>
					<text v-else :style="{ color: theme.dzBaseColor }">无</text>
				</view>
				<dz-line></dz-line>
				<view class="cell">
					<text>初始等级:</text>
					<text v-if="item.oldWarehouseLevel" :style="{ color: '#333' }">{{ item.oldWarehouseLevel.name }}</text>
					<text v-else :style="{ color: '#333' }">无</text>
				</view>
				<view class="cell">
					<text>原因:</text>
					<text>{{ levelChange(item.group) }}</text>
				</view>
				<view class="cell">
					<text>时间:</text>
					<text>{{ item.created_at | timeFormat }}</text>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" text="暂无售后订单" :src="emptyOrder" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-p-b-20"><dz-loadmore :status="loadingStatus"></dz-loadmore></view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			storeLevelLog: [],
			page: 1,
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '升级日志'
		});
		await this.$onLaunched;
		this.getStoreLevelLog();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.storeLevelLog.length = 0;
		this.loadingStatus = 'loading';
		this.getStoreLevelLog();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getStoreLevelLog();
	},
	methods: {
		levelChange(val) {
			if (val == 'order_pay') {
				return '自购升级';
			} else if (val == 'purchase_order_pay') {
				return '销货升级';
			} else {
				return '人工调整';
			}
		},
		getStoreLevelLog() {
			this.loadingStatus = 'loading';
			let params = {};
			params.page = this.page;
			params.page_size = this.$api.appConfig.pageSize;
			this.$api.http
				.get(this.$api.apiDistribution.warehouseLevelLog, {
					params
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.storeLevelLog = [...this.storeLevelLog, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding: 20rpx 20rpx 0;
	.storeLevel-item {
		padding: 20rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		.num {
			display: flex;
			margin-bottom: 10rpx;
			.title {
				color: #999;
				margin-right: 6rpx;
			}
			.color1 {
				color: #d8d8d8;
			}
			.color2 {
				color: rgb(255, 196, 63);
			}
		}
		.price {
			text-align: right;
			text {
				color: red;
			}
		}
		.cell {
			line-height: 46rpx;
			text {
				color: #999;
				margin-right: 6rpx;
			}
		}
	}
}
</style>
