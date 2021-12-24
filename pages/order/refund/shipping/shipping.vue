<template>
	<view>
		<dz-navbar :title="'填写物流信息'"></dz-navbar>
		<view class="content">
			<dz-form labelPosition="top">
				<dz-form-item label="快递公司"><dz-input v-model="shippingCompany" type="text" placeholder="请输入快递公司"></dz-input></dz-form-item>
				<dz-form-item label="快递单号"><dz-input type="text" v-model="shippingCode" placeholder="请输入快递单号"></dz-input></dz-form-item>
			</dz-form>
		</view>
		<view class="dz-m-t-60">
			<dz-button :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }" hover-class="none" @click="submit">提交</dz-button>
		</view>
		<!-- 确定物流提醒 -->
		<dz-modal
			v-model="isShow"
			:mask-close-able="false"
			content="请确定填写物流无误再提交哦"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			:async-close="true"
			@cancel="shippingCancel"
			@confirm="shippingConfirm"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			isShow: false,
			refundDetail: {},
			shippingId: '',
			shippingCompany: '',
			shippingCode: ''
		};
	},
	async onLoad(option) {
		console.log(option, 'option===');
		this.refundDetail = option;
		console.log(this.refundDetail, 'refundDetail===');
		this.shippingId = this.refundDetail.id;
		console.log(this.shippingId, 'shippingId===');
		await this.$onLaunched;
	},
	methods: {
		submit() {
			if (!this.shippingCompany)
				return this.$refs.dzToast.show({
					title: '请输入快递公司',
					type: 'warning'
				});
			if (!this.shippingCode)
				return this.$refs.dzToast.show({
					title: '请输入快递单号',
					type: 'warning'
				});
			this.isShow = true;
		},
		shippingCancel() {
			this.isShow = false;
		},
		shippingConfirm() {
			this.$api.http
				.post(this.refundDetail.order_status == 4 ? this.$api.apiShop.orderCustomerSalesReturn : this.$api.apiShop.orderProductSalesReturn, {
					id: this.shippingId,
					refund_shipping_code: this.shippingCode,
					refund_shipping_company: this.shippingCompany
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: '提交成功',
						type: 'success'
					});
					uni.$emit('refundChange', {});
					setTimeout(() => {
						this.$api.router.back();
					}, 1000);
				});
			this.isShow = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding: 0 30rpx;
	background-color: #ffffff;
}
</style>
