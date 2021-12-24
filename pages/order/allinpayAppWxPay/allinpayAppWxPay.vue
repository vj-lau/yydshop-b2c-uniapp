<template>
	<view class="screen">
		<view class="warp">
			<view>
				<view class="dz-text-center"><dz-icon name="wechat" size="100" color="rgb(83,194,64)"></dz-icon></view>
				<view class="dz-text-center dz-p-t-20 tip">
					<dz-loading :show="loading" class="dz-m-r-20"></dz-loading>
					{{ tip }}
				</view>
				<view class="dz-m-t-60 dz-m-l-20 dz-m-r-20" v-if="!loading">
					<button
						class="mix-btn"
						:style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						open-type="launchApp"
						:app-parameter="parameter"
						binderror="launchAppError"
					>
						{{ language.allinpayAppWxPay.backToApp }}
					</button>
				</view>
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			tip: this.$api.language.allinpayAppWxPay.tip,
			loading: true,
			parameter: 'allinpayAppWxPayFail',
			orderInfo: {},
			options: {}
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.allinpayAppWxPay.titleAllinpayAppWxPay
		});
		this.options = e;
		await this.$onLaunched;
		this.payOrder();
	},
	methods: {
		payOrder() {
			this.orderInfo.order_id = parseInt(this.options.order_id);
			this.orderInfo.member_id = this.options.member_id;
			uni.login({
				provider: 'weixin',
				success: async loginRes => {
					await this.$api.http
						.post(
							this.$api.apiShop.payCreateNoAuth,
							{
								order_group: 'order',
								group: 'tinyShopWechatMp',
								pay_type: 1,
								data: JSON.stringify(this.orderInfo)
							},
							{ params: { code: loginRes.code } }
						)
						.then(res => {
							uni.requestPayment({
								...res.data.config,
								success: () => {
									this.parameter = 'allinpayAppWxPaySuccess';
									this.tip = this.$api.language.allinpayAppWxPay.completeTip;
									this.loading = false;
								},
								fail: paymentErr => {
									console.log(JSON.stringify(paymentErr));
									this.$refs.dzToast.show({
										title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
										type: 'warning'
									});
									this.tip = this.$api.language.allinpayAppWxPay.errTip;
									this.loading = false;
								}
							});
						})
						.catch(err => {
							this.tip = this.$api.language.allinpayAppWxPay.errTip;
							this.loading = false;
						});
				},
				fail: loginErr => {
					console.log(JSON.stringify(loginErr));
					this.tip = this.$api.language.allinpayAppWxPay.errTip;
					this.loading = false;
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
						type: 'warning'
					});
				}
			});
		},
		launchAppError(e) {
			console.log(JSON.stringify(e));
		}
	}
};
</script>

<style lang="scss">
.screen {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 1;
	background-color: #fff;
	transition: transform 0.3s;
}

.warp {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.tip {
	font-size: 28rpx;
	color: $dz-tips-color;
}

.mix-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 400rpx;
	height: 70rpx;
	font-size: 32rpx;
	border-radius: 10rpx;
}
</style>
