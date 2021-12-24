<template>
	<view>
		<dz-navbar :title="'申请退款'"></dz-navbar>
		<view class="content">
			<dz-form labelPosition="top" :border-bottom="false">
				<dz-form-item label="退款原因"><dz-input v-model="refund_reason" type="text" :border="true" placeholder="请输入退款原因"></dz-input></dz-form-item>
				<view class="price-box">
					<view>{{ infoData.warehouse_is_pickup == 1 ? '退增库存' : '退款金额' }}</view>
					<view class="price" :style="{ color: theme.dzBaseColor }">
						<text v-if="infoData.warehouse_is_pickup == 1">{{ infoData.num }}件</text>
						<text v-else>￥{{ money }}</text>
					</view>
					<!-- <view>退款金额</view>
					<view class="price" :style="{ color: theme.dzBaseColor }">￥{{ money }}</view> -->
				</view>
				<dz-form-item label="退款说明(选填)">
					<dz-input type="textarea" v-model="refund_explain" :border="true" auto-height="auto-height" maxlength="200" placeholder="200字内"></dz-input>
				</dz-form-item>
			</dz-form>
			<view class="tip">
				<view>温馨提示: 订单退款金额已支付金额为准,不包括优惠劵抵扣金额,且订单申请退款后优惠劵将不会返还,请您谨慎操作</view>
				<view class="dz-m-t-10">无质量问题退货所产生的物流费用由买家承担,从退款中直接扣除</view>
			</view>
		</view>
		<view class="footer">
			<dz-button :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, height: '100rpx' }" hover-class="none" shape="rightAngle" @click="submit">
				提交退款申请
			</dz-button>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			refund_reason: '误购',
			refund_explain: '',
			refundId: '',
			pay_money: '',
			infoData: {},
			shipping_money: 0,
			money: 0
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '申请退款'
		});
		this.infoData = JSON.parse(option.data);
		this.shipping_money = option.shipping_money;
		this.shipping_money > 0
			? (this.money = (parseFloat(this.shipping_money) + parseFloat(this.infoData.product_money)).toFixed(2))
			: (this.money = this.infoData.product_money);
		await this.$onLaunched;
	},
	methods: {
		submit() {
			if (!this.refund_reason)
				return this.$refs.dzToast.show({
					title: '请输入退款原因',
					type: 'warning'
				});
			let params = {};
			params.id = this.infoData.id;
			params.refund_reason = this.refund_reason;
			params.refund_type = 1;
			if (this.refund_explain) {
				params.refund_explain = this.refund_explain;
			}
			this.$api.http
				.post(this.$api.apiShop.orderRefundApply, {
					...params
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: '提交成功',
						type: 'success'
					});
					setTimeout(() => {
						this.$api.router.redirectTo({
							route: this.$api.routesConfig.orderDetail,
							query: {
								id: this.infoData.order_id
							}
						});
					}, 1000);
				});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 0 30rpx;
	background: #ffffff;
	.price-box {
		display: flex;
		padding: 20rpx 0rpx 10rpx;
		font-size: 28rpx;
		.price {
			margin-left: 10rpx;
		}
	}
}
.tip {
	padding: 20rpx 0;
	font-size: 28rpx;
	color: $dz-tips-color;
}
.footer {
	width: 100%;
	position: fixed;
	bottom: 0;
	margin-bottom: env(safe-area-inset-bottom);
}
</style>
