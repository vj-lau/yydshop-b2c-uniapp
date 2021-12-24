<template>
	<view>
		<dz-navbar :title="title"></dz-navbar>
		<view class="dz-invoice">
			<dz-form label-width="140">
				<dz-form-item :label="language.invoice.invoiceType">
					<view class="dz-addr-label">
						<text
							v-for="(item, index) in invoiceType"
							:key="index"
							class="dz-label-item"
							:style="{
								background: item.value == invoiceData.type ? theme.dzBaseColor : '',
								borderColor: item.value == invoiceData.type ? theme.dzBaseColor : '',
								color: item.value == invoiceData.type ? theme.dzBaseFontColor : ''
							}"
							@tap="changeType(item.value)"
						>
							{{ item.name }}
						</text>
					</view>
				</dz-form-item>
				<dz-form-item :label="language.invoice.invoiceTitle">
					<dz-input v-model="invoiceData.title" :placeholder="language.invoice.inputInvoiceTitle"></dz-input>
				</dz-form-item>
				<dz-form-item v-if="parseInt(invoiceData.type) === 1" :label="language.invoice.invoiceNumber">
					<dz-input v-model="invoiceData.duty_paragraph" :placeholder="language.invoice.inputInvoiceNumber"></dz-input>
				</dz-form-item>
				<dz-form-item label="电子邮箱"><dz-input v-model="invoiceData.email" placeholder="请输入电子邮箱"></dz-input></dz-form-item>
				<dz-form-item :label="language.invoice.setTolerant">
					<dz-switch v-model="switchDefault" slot="right" :active-color="theme.dzBaseColor" @change="switchChange(invoiceData.is_default)"></dz-switch>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="dz-addr-save">
			<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" @click="saveInfo">
				{{ language.invoice.saveTheMessage }}
			</dz-button>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			title: '',
			manageType: '',
			source: '',
			id: '',
			invoiceData: {
				type: 2,
				title: '',
				duty_paragraph: '',
				is_default: ''
			},
			switchDefault: false,
			invoiceType: [{ name: this.$api.language.invoice.company, value: 1 }, { name: this.$api.language.invoice.name, value: 2 }],
			reqBody: {},
			data: null
		};
	},
	async onLoad(e) {
		this.title = this.language.invoice.addInvoice;
		if (e.type === 'edit') {
			this.title = this.language.invoice.editInvoice;
		}
		uni.setNavigationBarTitle({
			title: this.title
		});
		this.manageType = e.type;
		this.source = e.source;
		this.id = e.id;

		await this.$onLaunched;

		this.initData();
	},
	methods: {
		async initData() {
			if (this.manageType == 'edit') {
				await this.$api.http
					.get(this.$api.apiShop.invoiceDetail, {
						params: {
							id: this.id
						}
					})
					.then(async res => {
						this.invoiceData = res.data;
						this.switchDefault = parseInt(this.invoiceData.is_default) == 1;
					});
			}
		},
		saveInfo() {
			this.reqBody['title'] = this.invoiceData['title'];
			let checker;
			if (parseInt(this.invoiceData['type']) === 1) {
				this.reqBody['duty_paragraph'] = this.invoiceData['duty_paragraph'];
				let cInvoiceRule = [
					{
						name: 'title',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: this.language.invoice.invoiceTitleError
					},
					{
						name: 'duty_paragraph',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: this.language.invoice.invoiceParagraphError
					}
				];
				checker = this.$api.graceChecker.check(this.reqBody, cInvoiceRule);
			} else if (parseInt(this.invoiceData['type']) === 2) {
				let pInvoiceRule = [
					{
						name: 'title',
						checkType: 'notnull',
						checkRule: '',
						errorMsg: this.language.invoice.invoiceTitleError
					}
				];
				checker = this.$api.graceChecker.check(this.reqBody, pInvoiceRule);
			}
			if (!checker) {
				this.$refs.dzToast.show({
					title: this.$api.graceChecker.error,
					type: 'warning'
				});
				return;
			}
			if (this.manageType === 'edit') {
				this.handleInvoiceUpdate(this.invoiceData);
			} else {
				this.handleInvoiceCreate(this.invoiceData);
			}
		},
		// 编辑发票
		async handleInvoiceUpdate(params) {
			await this.$api.http
				.put(this.$api.apiShop.invoiceUpdate, params, {
					params: {
						id: params.id
					}
				})
				.then(res => {
					if (res.code == this.$api.responseCode.successCode) {
						this.$refs.dzToast.show({
							title: this.$api.language.invoice.invoiceEditSuccess,
							type: 'success'
						});
						if (this.source) {
							uni.$emit('getInvoice', res.data);
							this.$api.router.back(2);
						} else {
							uni.$emit('invoiceChange', {});
							this.$api.router.back();
						}
					}
				})
				.catch(() => {});
		},
		// 新增发票
		async handleInvoiceCreate(params) {
			await this.$api.http
				.post(this.$api.apiShop.invoiceCreate, params)
				.then(res => {
					if (res.code == this.$api.responseCode.successCode) {
						this.$refs.dzToast.show({
							title: this.$api.language.invoice.invoiceAddSuccess,
							type: 'success'
						});
						if (this.source) {
							uni.$emit('getInvoice', res.data);
							this.$api.router.back(2);
						} else {
							uni.$emit('invoiceChange', {});
							this.$api.router.back();
						}
					}
				})
				.catch(() => {});
		},
		changeType(e) {
			this.invoiceData.type = e;
		},
		switchChange(e) {
			if (e == 1) {
				this.invoiceData.is_default = 0;
				this.switchDefault = false;
			} else {
				this.invoiceData.is_default = 1;
				this.switchDefault = true;
			}
		}
	}
};
</script>

<style lang="scss">
.dz-invoice {
	padding: 0 30rpx;
	background-color: #ffffff;
}

.dz-addr-label {
	display: flex;
}

.dz-label-item {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 90rpx;
	height: 50rpx;
	background: $dz-bg-color;
	border-radius: 25rpx;
	font-size: 26rpx;
	margin-right: 20rpx;
	transform: scale(0.9);
}

.dz-switch-small {
	transform: scale(0.8);
	transform-origin: 100% center;
}

/* #ifndef H5 */
.dz-switch-small .wx-switch-input {
	margin: 0 !important;
}

/* #endif */

/* #ifdef H5 */
>>> uni-switch .uni-switch-input {
	margin-right: 0 !important;
}

/* #endif */

.dz-addr-save {
	padding: 24rpx;
	margin-top: 100rpx;
	.btn {
		height: 80rpx;
		border-radius: 10rpx;
	}
}
</style>
