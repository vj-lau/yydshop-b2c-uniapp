<template>
	<view>
		<dz-navbar :title="'账单明细'" :border-bottom="false"></dz-navbar>
		<dz-tabs
			:list="tabList"
			:current="current"
			:is-scroll="false"
			bar-height="8"
			:active-color="theme.dzBaseColor"
			@change="tabChange"
			style="position: fixed;width: 100%;z-index: 2;"
		></dz-tabs>
		<view class="content">
			<view class="item" v-for="(item, index) in creditsLogList" :key="index">
				<view v-if="item.remark" class="name">{{ item.remark }}</view>
				<view v-else class="name">{{ item.credit_group | filtersType }}</view>
				<view class="price">
					<text class="time">{{ item.created_at | timeFormat }}</text>
					<text :style="{ color: parseFloat(item.num) >= 0 ? theme.dzBaseColor : '' }">{{ item.num | numFilter }}</text>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="160" text="暂无账单记录" :src="emptyOrder" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore :status="loadingStatus" :margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			tabList: [
				{
					state: undefined,
					name: '全部'
				},
				{
					state: 1,
					name: '充值'
				},
				{
					state: 2,
					name: '消费'
				}
			],
			current: 0,
			page: 1,
			state: 1,
			creditsLogList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '账单明细'
		});
		this.current = parseInt(option.status - 1);
		this.state = this.tabList[this.current].state;
		await this.$onLaunched;
		this.getCreditsLogList();
	},
	filters: {
		numFilter(val) {
			return val >= 0 ? `+${val.toString()}` : val;
		},
		filtersType(type) {
			let tag = '';
			switch (type) {
				case 'shop_order_pay':
					tag = '订单余额支付';
					break;
				case 'shop_order_refund':
					tag = '订单退款';
					break;
				case 'manager':
					tag = '手动操作';
					break;
			}
			return tag;
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
		tabChange(e) {
			this.current = e;
			this.page = 1;
			this.creditsLogList.length = 0;
			this.state = this.tabList[e].state;
			this.getCreditsLogList();
		},
		getCreditsLogList() {
			this.loadingStatus = 'loading';
			let params = {};
			if (this.state != 0) {
				params.num_type = this.state;
			}
			this.$api.http
				.get(this.$api.apiShop.creditsLogList, {
					params: {
						credit_type: 1,
						...params,
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
	margin-top: 82rpx;
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
