<template>
	<view>
		<dz-navbar title="申请售后"></dz-navbar>
		<view class="content">
			<dz-form labelPosition="top">
				<dz-form-item label="申请原因">
					<dz-input type="select" :value="refund_reason" placeholder="选择申请原因" :selectOpen="msgSelect" @click="tapSelect"></dz-input>
				</dz-form-item>
				<dz-form-item label="问题描述(选填)">
					<dz-input type="textarea" v-model="refund_explain" auto-height="auto-height" maxlength="100" placeholder="申请售后具体原因,如商品物流服务的问题"></dz-input>
				</dz-form-item>
			</dz-form>
			<view class="dz-uploader">
				<view class="uni-uploader-body">
					<dz-upload :custom-btn="true" :action="action" :header="header" :show-progress="false" @on-success="imgUploaded" max-count="6" @on-remove="imgRemove">
						<view slot="addBtn" class="uploaderBtn">
							<view class="dzicon-iconfont dzicon-cameraadd"></view>
							<view>上传凭证</view>
						</view>
					</dz-upload>
				</view>
				<view class="upload-tip">为了更好的给你提供售后服务,请务必上传故障图片.</view>
			</view>
		</view>
		<view class="footer-tip">提交服务单后,售后专员可能与您电话沟通,请保持手机畅通</view>
		<view class="footer">
			<dz-button :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, height: '100rpx' }" hover-class="none" shape="rightAngle" @click="submit">
				提交售后申请
			</dz-button>
		</view>
		<dz-select
			v-model="msgSelect"
			:safe-area-inset-bottom="true"
			:default-value="[defaultValue]"
			:list="msgContents[parseInt(this.refundData.refund_type) - 1]"
			@confirm="msgConfirm"
		></dz-select>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			imageList: [],
			action: `${this.$api.appConfig.apiDomain}${this.$api.apiShop.uploadImage}`,
			header: { 'x-api-key': this.$api.store.state.accessToken },
			check: false,
			msgSelect: false,
			msgContents: [
				[
					{
						value: '0',
						label: '收货地址错误'
					},
					{
						value: '1',
						label: '多拍/排错/不想要'
					},
					{
						value: '2',
						label: '快递一直未送到'
					},
					{
						value: '3',
						label: '未按约定时间发货'
					},
					{
						value: '4',
						label: '快递无跟踪记录'
					},
					{
						value: '5',
						label: '其它渠道更便宜'
					},
					{
						value: '7',
						label: '其它'
					}
				],
				[
					{
						value: '0',
						label: '七天无理由'
					},
					{
						value: '1',
						label: '缺失配件'
					},
					{
						value: '2',
						label: '发错货'
					},
					{
						value: '3',
						label: '质量问题'
					},
					{
						value: '4',
						label: '商品与页面描述不符'
					},
					{
						value: '5',
						label: '商品到货损坏'
					},
					{
						value: '6',
						label: '促销降价(报价问题)'
					},
					{
						value: '7',
						label: '其它渠道更便宜'
					},
					{
						value: '8',
						label: '其它'
					}
				],
				[
					{
						value: '0',
						label: '缺失配件'
					},
					{
						value: '1',
						label: '发错货'
					},
					{
						value: '2',
						label: '质量问题'
					},
					{
						value: '3',
						label: '商品与页面描述不符'
					},
					{
						value: '4',
						label: '商品到货损坏'
					},
					{
						value: '5',
						label: '促销降价(报价问题)'
					},
					{
						value: '6',
						label: '更换尺码'
					},
					{
						value: '7',
						label: '其它'
					}
				]
			],
			addressData: {},
			refundData: {},
			refund_reason: '',
			refund_explain: '',
			defaultValue: 0
		};
	},
	async onLoad(option) {
		this.refundData = option;
		await this.$onLaunched;
		uni.$on('getAddressData', data => {
			this.addressData = data;
		});
	},
	onUnload() {
		uni.$off(['getAddressData']);
	},
	methods: {
		msgConfirm(e) {
			this.defaultValue = e[0].value;
			this.refund_reason = e[0].label;
		},
		tapSelect() {
			this.msgSelect = true;
		},
		// 图片上传成功
		imgUploaded(list) {
			this.imageList.push(list.data.url);
		},
		// 删除图片
		imgRemove(index, list, name) {
			this.imageList.splice(index, 1);
		},
		submit() {
			let params = {};
			if (!this.refund_reason)
				return this.$refs.dzToast.show({
					title: '请选择申请原因',
					type: 'warning'
				});
			// if (this.imageList.length <= 0)
			// 	return this.$refs.dzToast.show({
			// 		title: '请上传凭证',
			// 		type: 'warning'
			// 	});
			params.refund_reason = this.refund_reason;
			if (this.refund_explain) {
				params.refund_explain = this.refund_explain;
			}
			params.id = this.refundData.id;
			params.refund_type = this.refundData.refund_type;
			params.refund_evidence = JSON.stringify(this.imageList);
			let url;
			this.$api.http
				.post(parseInt(this.refundData.order_status) == 4 ? this.$api.apiShop.orderCustomerRefundApply : this.$api.apiShop.orderRefundApply, {
					...params
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
		},
		checkboxChange(e) {
			this.check = e.value;
		},
		choiceAddress() {
			this.$api.router.push({
				route: this.$api.routesConfig.address,
				query: {
					source: 'orderCreate'
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 0 30rpx;
	background-color: #ffffff;
}
.dz-uploader {
	padding: 20rpx;
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}
	.uni-uploader-body {
		margin-top: 16rpx;
	}
	.upload-tip {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: $dz-tips-color;
	}
}
.uploaderBtn {
	width: 200rpx;
	height: 200rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #f4f5f6;
	border-radius: 10rpx;
	overflow: hidden;
	margin: 10rpx;
	.dzicon-cameraadd {
		font-size: 48rpx;
	}
}
.address-box {
	padding: 20rpx 30rpx;
	background-color: #fff;
	.name {
		font-size: 28rpx;
	}
}
.address {
	display: flex;
	align-items: center;
	padding: 20rpx 0;

	.dzicon-round_location_fill {
		font-size: 72rpx;
		margin-right: 20rpx;
	}
	.title {
		font-size: 32rpx;
		color: $dz-main-color;
		line-height: 54rpx;
	}
	.address-tip {
		margin: 6rpx 0;
		font-size: 28rpx;
		color: $dz-tips-color;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
}
.address-top,
.checked-address {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.checked {
		display: flex;
		align-items: center;
		view {
			font-size: 28rpx;
			color: $dz-tips-color;
		}
	}
	.dzicon-right {
		color: $dz-tips-color;
	}
}
.footer-tip {
	padding: 20rpx 30rpx;
	font-size: 24rpx;
	color: $dz-tips-color;
	margin-bottom: 100rpx;
}
.footer {
	width: 100%;
	position: fixed;
	bottom: 0;
	margin-bottom: env(safe-area-inset-bottom);
}
</style>
