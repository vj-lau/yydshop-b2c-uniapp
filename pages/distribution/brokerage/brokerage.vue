<template>
	<view>
		<!-- 我的佣金 -->
		<dz-navbar
			:title="language.distribution.myCommission"
			:title-color="theme.dzBaseFontColor"
			back-icon-color="#fff"
			:border-bottom="false"
			:background="{ background: theme.dzBaseColor }"
		></dz-navbar>
		<view class="pure_top" :style="{ background: theme.dzBaseColor }">
			<view class="card" :style="{ color: theme.dzBaseFontColor }">
				<view class="price-box">
					<view class="price">{{ language.application.moneySymbol }}{{ memberInfo.promoter ? memberInfo.promoter.user_brokerage : '0.00' }}</view>
					<!-- 可提现佣金金额 -->
					<view class="tip">{{ language.distribution.amountOfCommissionAvailableForWithdrawal }}</view>
					<view class="btn" @tap="toPage('brokerageCapital')">{{ language.distribution.theDetail }}</view>
				</view>
				<dz-row gutter="16" justify="space-between" class="dz-m-t-20">
					<dz-col span="3">
						<!-- 累计佣金 -->
						<view class="card-item">
							<text>{{ memberInfo.promoter ? memberInfo.promoter.accumulate_brokerage : '0.00' }}</text>
							<text class="dz-m-t-10">{{ language.profile.totalCommission }}</text>
						</view>
					</dz-col>
					<dz-col span="3">
						<!-- 可用佣金 -->
						<view class="card-item">
							<text>{{ memberInfo.promoter ? memberInfo.promoter.user_brokerage : '0.00' }}</text>
							<text class="dz-m-t-10">{{ language.profile.leftCommission }}</text>
						</view>
					</dz-col>
					<dz-col span="3">
						<!-- 销售笔数 -->
						<view class="card-item">
							<text>{{ memberInfo.promoter ? memberInfo.promoter.sell_num : '0.00' }}</text>
							<text class="dz-m-t-10">{{ language.distribution.salesNumber }}</text>
						</view>
					</dz-col>
					<dz-col span="3">
						<!-- 销售金额 -->
						<view class="card-item">
							<text>{{ memberInfo.promoter ? memberInfo.promoter.sell_money : '0.00' }}</text>
							<text class="dz-m-t-10">{{ language.distribution.theSalesAmount }}</text>
						</view>
					</dz-col>
				</dz-row>
			</view>
		</view>
		<!-- <view class="content">
			<dz-row gutter="16" justify="space-between">
				<dz-col span="4">
					<view class="card-item" @tap="toPage('brokerageCapital')">
						<text>{{memberInfo.promoter ? memberInfo.promoter.promoter_brokerage : '0.00'}}</text>
						<text class="dz-m-t-10">裂变分销</text>
					</view>
				</dz-col>
				<dz-col span="4">
					<view class="card-item" @tap="toPage('brokerageCapital')">
						<text>{{ memberInfo.promoter ? memberInfo.promoter.store_brokerage : '0.00'}}</text>
						<text class="dz-m-t-10">店铺分销</text>
					</view>
				</dz-col>
				<dz-col span="4">
					<view class="card-item" @tap="toPage('brokerageCapital')">
						<text>{{ memberInfo.promoter ? memberInfo.promoter.regional_agent_brokerage : '0.00'}}</text>
						<text class="dz-m-t-10">区域分销</text>
					</view>
				</dz-col>
			</dz-row>
		</view> -->
		<view class="dz-m-t-80 dz-flex dz-row-center">
			<view style="width: 90%;">
				<!-- 立即提现 -->
				<dz-button
					:disabled="parseInt(withdrawConfig.commission_withdraw_is_open) == 0"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
					hover-class="none"
					shape="circle"
					:border="false"
					@click="withdrawClick"
				>
					{{ parseInt(withdrawConfig.commission_withdraw_is_open) == 0 ? language.distribution.withdrawalClosed : language.distribution.immediateWithdrawal }}
				</dz-button>
			</view>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" :click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			memberInfo: {},
			withdrawConfig: {
				commission_withdraw_is_open: 1
			},
			loadingShow: false,
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.distribution.myCommission
		});
		await this.$onLaunched;
		this.getMemberIndex();
	},
	onPullDownRefresh() {
		this.memberInfo = {};
		this.getMemberIndex();
	},
	methods: {
		loadingClick() {
			this.getMemberIndex();
		},
		async getMemberIndex() {
			this.loadingShow = true;
			await this.$api.http
				.get(this.$api.apiDistribution.memberIndex)
				.then(res => {
					this.memberInfo = res.data;
				})
				.catch(err => {
					this.loadingStatus = 'error';
					return;
				});
			await this.$api.http
				.get(this.$api.apiDistribution.withdrawConfig)
				.then(res => {
					this.withdrawConfig = res.data;
				})
				.catch(err => {
					this.loadingStatus = 'error';
					return;
				});
			this.loadingShow = false;
			uni.stopPullDownRefresh();
		},
		toPage(url, data = {}) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					...data
				}
			});
		},
		async withdrawClick() {
			if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 1) {
				//通商云提现账号
				this.toPage('allinpayWithdraw');
			} else if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 2) {
				//通商云提现账号
				this.toPage('allinpayWithdrawE');
			} else {
				//普通提现账号
				this.toPage('distributionCash');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.pure_top {
	width: 100%;
	height: 360rpx;
	position: relative;
	z-index: 0;
	overflow: hidden;
}

.pure_top::after {
	content: '';
	width: 160%;
	height: 360rpx;
	position: absolute;
	left: -30%;
	top: 0;
	border-radius: 0 0 50% 50%;
}
.card {
	position: relative;
	z-index: 1;
	.price-box {
		text-align: center;
		position: relative;
		padding: 40rpx 0;
		.price {
			font-size: 48rpx;
		}
		.btn {
			position: absolute;
			height: 46rpx;
			top: 20rpx;
			right: 0;
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 46rpx;
			font-size: 28rpx;
			border-radius: 23rpx 0 0 23rpx;
			background-color: rgba(255, 255, 255, 0.4);
		}
	}
}
.card-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.content {
	position: relative;
	margin: -100rpx 24rpx 0;
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
}
</style>
