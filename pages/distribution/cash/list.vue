<template>
	<view>
		<dz-navbar :title="'提现记录'" :borderBottom="false"></dz-navbar>
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
			<view class="card" v-for="(item, index) in withdrawList" :key="index">
				<view class="tip">流水号: {{ item.withdraw_no }}</view>
				<view class="flex dz-m-t-10">
					<view class="icon">
						<view class="dzicon-iconfont dzicon-card_fill" v-if="item.account_type == 1"></view>
						<view class="dzicon-iconfont dzicon-wechat" v-if="item.account_type == 2"></view>
						<view class="dzicon-iconfont dzicon-alip" v-if="item.account_type == 3"></view>
						<view>
							提现到{{ item.realname }}
							<text v-if="item.account_type === '4'">余额</text>
							<text v-else>{{ item.account_type | accountTypeFilter }} - {{ item.mobile }}</text>
						</view>
					</view>
					<view class="price">{{ item.cash }}</view>
				</view>
				<view class="flex dz-m-t-10 tip">
					<view class="time">申请时间: {{ item.created_at | timeFormat }}</view>
					<view class="status_0" v-if="item.state == 0">审核中</view>
					<view class="status_1" v-if="item.state == -1">已拒绝</view>
					<view class="status_2" v-if="item.state == 1">已通过</view>
				</view>
				<view class="tip dz-m-t-10" v-if="parseInt(item.payment_date) != 0">到账日期: {{ item.payment_date | timeFormat }}</view>
				<view class="tip dz-m-t-10" v-if="item.memo">备注: {{ item.memo }}</view>
			</view>
		</view>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="140"></dz-loadmore>
		<dz-empty :text="'暂无提现记录'" v-if="loadingStatus == 'noData'" marginTop="80" :src="emptyOrder" iconSize="360"></dz-empty>
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
					value: '1',
					name: '已通过'
				},
				{
					value: '0',
					name: '审核中'
				},
				{
					value: '-1',
					name: '已拒绝'
				}
			],
			current: 0,
			page: 1,
			state: 1,
			withdrawList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '提现记录'
		});
		await this.$onLaunched;
		this.getWithdrawList();
	},
	filters: {
		accountTypeFilter(val) {
			const accountTypeArr = ['', '银联卡', '微信', '支付宝'];
			return accountTypeArr[parseInt(val)];
		},
		transferTypeFilter(val) {
			const transferTypeArr = ['', '线下转账', '线上转账'];
			return transferTypeArr[parseInt(val)];
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.withdrawList.length = 0;
		this.getWithdrawList();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getWithdrawList();
	},
	methods: {
		async getWithdrawList() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiDistribution.withdrawList, {
					params: {
						page: this.page,
						state: this.state,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.withdrawList = [...this.withdrawList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		},
		tabChange(e) {
			this.current = e;
			this.state = this.tabList[e].value;
			this.page = 1;
			this.withdrawList.length = 0;
			this.getWithdrawList();
		}
	}
};
</script>

<style lang="scss">
.content {
	margin-top: 82rpx;
}
.card {
	padding: 20rpx 30rpx;
	background: #ffffff;
	border-bottom: 1rpx solid $dz-border-color;
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32rpx;
		color: $dz-main-color;
		.status_0 {
			color: #fdc561;
		}
		.status_1 {
			color: $dz-type-error;
		}
		.status_2 {
			color: $dz-type-success;
		}
	}
	.icon {
		display: flex;
		align-items: center;
		.dzicon-iconfont {
			margin-right: 10rpx;
			font-size: 40rpx;
		}
		.dzicon-alip {
			color: #00a0e9;
		}
		.dzicon-card_fill {
			color: #fdc561;
		}
		.dzicon-wechat {
			color: $dz-type-success;
		}
	}
	.price {
		flex-shrink: 0;
	}
	.tip {
		font-size: 26rpx;
		color: $dz-main-color;
	}
	.time {
		color: $dz-tips-color;
	}
}
.card:last-child {
	border-bottom: none;
}
</style>
