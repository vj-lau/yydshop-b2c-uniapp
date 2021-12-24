<template>
	<view>
		<dz-navbar :title="'申请提现'"></dz-navbar>
		<view class="content">
			<dz-cell-item
				title="暂不支持提现"
				:border-bottom="false"
				hover-class="none"
				:arrow="false"
				v-if="parseInt(withdrawConfig.commission_withdraw_is_open) == 0"
			></dz-cell-item>
			<view class="dz-p-30" :style="{ color: theme.dzBaseColor }">
				<view>
					可提现至：
					<text class="dz-m-r-10" v-if="parseInt(withdrawConfig.commission_withdraw_union) === 1">银行卡</text>
					<text class="dz-m-r-10" v-if="parseInt(withdrawConfig.commission_withdraw_wechat) === 1">微信</text>
					<text class="dz-m-r-10" v-if="parseInt(withdrawConfig.commission_withdraw_ali) === 1">支付宝</text>
				</view>
			</view>
			<dz-cell-group :border="false">
				<dz-cell-item
					v-if="withdrawData"
					icon="round_redpacket_fill"
					icon-size="60"
					:icon-style="{ color: '#FDC561', 'margin-right': '30rpx' }"
					:title="`${withdrawData.account_type_name}  ${withdrawData.account_number}`"
					:label="`${withdrawData.realname}  ${withdrawData.branch_bank_name}  ${withdrawData.mobile}`"
					:border-bottom="false"
					hover-class="none"
					@tap="toWithdraw"
				></dz-cell-item>
				<dz-cell-item
					v-else
					icon="round_redpacket_fill"
					icon-size="60"
					:icon-style="{ color: '#FDC561', 'margin-right': '30rpx' }"
					title="请选择提现账号"
					:border-bottom="false"
					hover-class="none"
					@tap="toWithdraw"
				></dz-cell-item>
			</dz-cell-group>
			<dz-field label-width="90" label=" ￥" v-model="money" placeholder="请输入提现金额" :border-bottom="false"></dz-field>
		</view>
		<view class="tip" :style="{ color: theme.dzBaseColor }">
			<view>可提金额：{{ withdrawConfig.promoter && withdrawConfig.promoter.user_brokerage }}元</view>
			<view>起提金额：{{ withdrawConfig.commission_withdraw_lowest_money }}元</view>
			<view>单次可提：{{ parseFloat(withdrawConfig.commission_withdraw_highest_money) > 0 ? withdrawConfig.commission_withdraw_highest_money + '元' : '不限' }}</view>
		</view>
		<view class="dz-p-l-30 dz-p-r-30 dz-color-9">
			<view v-for="(item, index) in withdrawConfig.commission_withdraw_desc" :key="index">{{ item }}</view>
		</view>
		<view class="dz-m-t-80 dz-flex dz-row-center">
			<view style="width: 90%;">
				<dz-button
					:custom-style="{
						background: parseInt(withdrawConfig.withdraw_is_open) == 0 || submitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor
					}"
					:border="false"
					hover-class="none"
					shape="circle"
					:disabled="parseInt(withdrawConfig.withdraw_is_open) == 0 || submitting"
					@click="withdrawCreate"
				>
					{{ parseInt(withdrawConfig.commission_withdraw_is_open) == 0 ? language.distribution.withdrawalClosed : language.distribution.immediateWithdrawal }}
				</dz-button>
			</view>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			withdrawConfig: {},
			withdrawData: null,
			money: null,
			loadingShow: true,
			loadingStatus: 'loading',
			submitting: false
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '申请提现'
		});
		uni.$on('getBankAccount', data => {
			this.withdrawData = data;
		});
		uni.$on('updateBankAccount', data => {
			this.getWithdrawConfig();
		});
		await this.$onLaunched;
		this.getWithdrawConfig();
	},
	methods: {
		loadingClick() {
			this.getWithdrawConfig();
		},
		getWithdrawConfig() {
			this.$api.http
				.get(this.$api.apiDistribution.withdrawConfig)
				.then(res => {
					this.withdrawConfig = res.data;
					this.withdrawData = res.data.default_bank_account;
					this.withdrawConfig.commission_withdraw_desc = this.withdrawConfig.commission_withdraw_desc.split(/[\n]/g);
					this.loadingShow = false;
				})
				.catch(err => {
					setTimeout(() => {
						this.$api.router.back();
					}, 1000);
					return;
					this.loadingStatus = 'error';
				});
		},
		toWithdraw() {
			this.$api.router.push({
				route: this.$api.routesConfig.distributionWithdraw,
				query: {
					source: 1
				}
			});
		},
		// 申请提现
		withdrawCreate() {
			if (this.submitting) {
				return;
			}
			this.money = parseFloat(this.money) || '';
			if (!this.withdrawData) {
				this.$refs.dzToast.show({
					title: '请选择提现账号',
					type: 'warning'
				});
				return;
			}
			if (!this.money) {
				this.$refs.dzToast.show({
					title: '请输入提现金额',
					type: 'warning'
				});
				this.money = '';
				return;
			}
			if (this.money < parseFloat(this.withdrawConfig.commission_withdraw_lowest_money)) {
				this.$refs.dzToast.show({
					title: `至少提现：${this.withdrawConfig.commission_withdraw_lowest_money}元`,
					type: 'warning'
				});
				return;
			}
			if (parseFloat(this.withdrawConfig.commission_withdraw_highest_money) > 0 && this.money > parseFloat(this.withdrawConfig.commission_withdraw_highest_money)) {
				this.$refs.dzToast.show({
					title: `单次只能提现：${this.withdrawConfig.commission_withdraw_highest_money}元`,
					type: 'warning'
				});
				return;
			}
			if (this.money > parseFloat(this.withdrawConfig.promoter.user_brokerage)) {
				this.$refs.dzToast.show({
					title: '您的可提金额不够啊',
					type: 'warning'
				});
				return;
			}
			this.submitting = true;
			const params = {};
			params.bank_account_id = this.withdrawData.id;
			params.money = this.money;

			// #ifdef APP-PLUS
			let platform = this.$api.systemInfo.platform;
			if (platform == 'ios') {
				params.group = 'ios';
			} else if (platform == 'android') {
				params.group = 'android';
			} else {
				params.group = 'app';
			}
			// #endif

			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				params.group = 'wechat';
			} else {
				params.group = 'h5';
			}
			// #endif

			// #ifdef  MP-WEIXIN
			params.group = 'wechatMp';
			// #endif

			// #ifdef  MP-QQ
			params.group = 'qqMp';
			// #endif

			// #ifdef MP-ALIPAY
			params.group = 'aliMp';
			// #endif

			// #ifdef MP-BAIDU
			params.group = 'baiduMp';
			// #endif

			// #ifdef MP-TOUTIAO
			params.group = 'touTiaoMp';
			// #endif

			// #ifdef MP-360
			params.group = '360Mp';
			// #endif

			this.$api.http
				.post(this.$api.apiDistribution.withdrawCreate, params)
				.then(res => {
					this.submitting = false;
					this.$refs.dzToast.show({
						title: '提交成功',
						type: 'success'
					});
					setTimeout(() => {
						this.$api.router.push({
							route: this.$api.routesConfig.brokerage
						});
					}, 1000);

					//重新获取配置
					// this.getWithdrawConfig();
				})
				.catch(err => {
					this.submitting = false;
				});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 20rpx 0;
	background-color: #ffffff;
}
.tip {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	font-size: 24rpx;
}
</style>
