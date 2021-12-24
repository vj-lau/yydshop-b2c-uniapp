<template>
	<view>
		<dz-navbar title="详情"></dz-navbar>
		<view class="status" :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }">
			<view class="title dz-flex dz-row-between">
				<view>{{ refundStatusFilter(refundDetail.refund_status) }}</view>
				<view
					v-if="
						(parseInt(refundDetail.order_status) == 2 || parseInt(refundDetail.order_status) == 3 || parseInt(refundDetail.order_status) == 4) &&
							parseInt(refundDetail.refund_status) == 7
					"
				>
					<view>
						<dz-button
							:plain="true"
							type="info"
							shape="circle"
							hoverClass="node"
							:custom-style="{ background: theme.dzBaseLight, borderColor: theme.dzBaseDisabled, color: theme.dzBaseColor, width: '160rpx' }"
							@click="salesDelivery()"
						>
							确认收货
						</dz-button>
					</view>
				</view>
			</view>
			<view class="time" v-if="parseInt(refundDetail.refund_status) == 5">退款原路返还至您的支付账户</view>
			<view class="time" v-if="parseInt(refundDetail.refund_status) == 5">2天内到账 到账时间个别银行间有所差异</view>
			<view class="time" v-if="parseInt(refundDetail.refund_status) == 4">预计24小时内审核</view>
		</view>
		<view class="content" v-if="parseInt(refundDetail.refund_type) != 3 && refundDetail.warehouse_is_pickup == 0">
			<dz-cell-item center title="退款金额" :value="`￥${money}`" hover-class="none" :arrow="false"></dz-cell-item>
		</view>
		<view class="content" v-else><dz-cell-item center title="退增库存" :value="refundDetail.num" hover-class="none" :arrow="false"></dz-cell-item></view>
		<view class="product dz-m-t-20">
			<dz-cell-item center title="退货/退款/换货信息" hover-class="none" :arrow="false" :borderBottom="false"></dz-cell-item>
			<view class="item">
				<view class="image"><dz-image :src="refundDetail.product_picture" borderRadius="10" width="180" height="180"></dz-image></view>
				<view class="right">
					<view>
						<view class="title">{{ refundDetail.product_name }}</view>
						<view class="tip">数量: {{ refundDetail.num }}</view>
					</view>
				</view>
			</view>
			<view class="message">
				<view v-if="refundDetail.refund_reason">退款原因: {{ refundDetail.refund_reason }}</view>
				<view v-if="refundDetail.refund_status == 5">实际退款金额: ￥{{ refundDetail.refund_balance_money }}</view>
				<view v-if="refundDetail.warehouse_is_pickup == 0">退款金额: ￥{{ money }}</view>
				<view>申请时间: {{ refundDetail.created_at | timeFormat('yyyy-mm-dd') }}</view>
				<view>退款编号: {{ refundDetail.order_product_sn }}</view>

				<view v-if="refundDetail.refund_shipping_code">退款物流单号: {{ refundDetail.refund_shipping_code }}</view>
				<view v-if="refundDetail.refund_shipping_company && parseInt(refundDetail.refund_shipping_company) != 0">
					退款物流公司: {{ refundDetail.refund_shipping_company }}
				</view>
				<view v-if="refundDetail.refund_resend_shipping_code" class="dz-flex dz-row-between">
					<view>重发物流单号: {{ refundDetail.refund_resend_shipping_code }}</view>
					<view>
						<dz-button
							:plain="true"
							type="info"
							size="mini"
							shape="circle"
							hoverClass="none"
							:border="false"
							:custom-style="{ height: '40rpx', background: '#FFF', lineHeight: '40rpx', border: '1rpx solid rgba(0,0,0,0.12)' }"
							@click="copy(refundDetail.refund_resend_shipping_code)"
						>
							复制
						</dz-button>
					</view>
				</view>
				<view v-if="refundDetail.refund_resend_shipping_company">重发物流公司: {{ refundDetail.refund_resend_shipping_company }}</view>
			</view>
			<view
				class="dz-flex dz-row-right dz-m-r-30 dz-p-b-30"
				v-if="(refundDetail.order_status == 2 || refundDetail.order_status == 3 || refundDetail.order_status == 4) && refundDetail.refund_status == 2"
			>
				<view>
					<dz-button :plain="true" type="info" shape="circle" style="width: 152rpx;height: 56rpx;background: #fff;" @click="toPage('refundShipping', refundDetail)">
						填写物流
					</dz-button>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-bottom dz-flex">
				<view class="dz-flex-1" v-if="customerService">
					<dz-button
						open-type="contact"
						:sessionFrom="sessionFrom"
						type="info"
						hoverClass="none"
						shape="circle"
						:border="false"
						:custom-style="{ width: '90%', background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
						@click="serviceTap"
					>
						<dz-icon name="service_light" size="48"></dz-icon>
						<text class="dz-m-l-10">联系客服</text>
					</dz-button>
				</view>
				<view class="dz-flex-1">
					<dz-button
						type="info"
						shape="circle"
						hoverClass="none"
						:border="false"
						:custom-style="{ width: '90%', background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
						@click="phone"
					>
						<dz-icon name="phone_light" size="48"></dz-icon>
						<text class="dz-m-l-10">热线电话</text>
					</dz-button>
				</view>
			</view>
		</view>
		<dz-modal
			v-model="salesDeliveryModalShow"
			:mask-close-able="false"
			content="是否确认已经收到货？"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			:async-close="true"
			@cancel="salesDeliveryCancel"
			@confirm="salesDeliveryConfirm"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			refundDetail: {},
			customerService: false, //是否使用客服
			sessionFrom: '',
			salesDeliveryModalShow: false,
			shipping_money: 0,
			money: 0,
			orderId: '',
			orderItemId: '',
			pageLoadingStatus: 'loading',
			pageLoadingShow: true
		};
	},
	async onLoad(option) {
		await this.$onLaunched;
		let serviceType = parseInt(this.$api.shopSetting.app_service_type);
		if (serviceType > 0) {
			if (this.$api.store.getters.hasLogin) {
				this.sessionFrom =
					'{"source":"' +
					'订单编号：' +
					this.refundDetail.order_sn +
					'","mobile":"' +
					this.$api.store.state.userInfo.mobile +
					'","sex":"' +
					this.$api.store.state.userInfo.gender +
					'","nickName":"' +
					this.$api.store.state.userInfo.nickname +
					'","avatarUrl":"' +
					this.$api.store.state.userInfo.head_portrait +
					'"}';
			}
			//2为小程序原生客服，3为芝麻小客服
			if (serviceType === 2) {
				// #ifdef MP-WEIXIN
				this.customerService = true;
				// #endif
			}
			if (serviceType === 3) {
				this.customerService = true;
			}
		}
		this.orderId = option.id;
		this.orderItemId = option.order_id;
		this.shipping_money = option.shipping_money;
		this.getOrderDetail();
	},
	methods: {
		loadingClick() {
			this.getOrderDetail();
		},
		async getOrderDetail() {
			await this.$api.http
				.get(this.$api.apiShop.orderDetail, {
					params: {
						id: this.orderItemId
					}
				})
				.then(res => {
					let productItem = res.data.product.filter(item => item.id == this.orderId);
					this.refundDetail = productItem[0];
					this.shipping_money > 0
						? (this.money = (parseFloat(this.shipping_money) + parseFloat(this.refundDetail.product_money)).toFixed(2))
						: (this.money = this.refundDetail.product_money);
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});
		},
		refundStatusFilter(status) {
			let state;
			this.$api.dataConfig.refundStatus.forEach(item => {
				if (item.key === parseInt(status)) {
					state = item.value;
				}
			});
			return state;
		},
		toPage(url, item) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					data: JSON.stringify(item)
				}
			});
		},
		phone() {
			this.$api.http
				.get(this.$api.apiShop.configList, {
					params: {
						field: 'store_refund_mobile'
					}
				})
				.then(res => {
					if (!res.data.store_refund_mobile)
						return this.$refs.dzToast.show({
							title: '暂无联系方式',
							type: 'warning'
						});
					uni.makePhoneCall({
						phoneNumber: res.data.store_refund_mobile
					});
				});
		},
		serviceTap() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			//微信原生小程序客服
			if (serviceType === 2) {
				// #ifndef MP-WEIXIN
				this.$refs.dzToast.show({
					title: '请在小程序中打开客服',
					type: 'warning'
				});
				// #endif
			} else if (serviceType === 3) {
				//芝麻小客服
				// #ifndef MP-WEIXIN
				let customerServiceUrl = this.$api.shopSetting.app_service_zmxkf_url;
				if (!customerServiceUrl) {
					this.$refs.dzToast.show({
						title: '客服暂未配置',
						type: 'warning'
					});
					return;
				}
				if (this.$api.store.getters.hasLogin) {
					let params = {
						source: encodeURIComponent('订单编号：' + this.refundDetail.order_sn),
						openid: this.$api.store.state.userInfo.id,
						mobile: this.$api.store.state.userInfo.mobile,
						sex: this.$api.store.state.userInfo.gender,
						nickName: encodeURIComponent(this.$api.store.state.userInfo.nickname),
						avatarUrl: encodeURIComponent(this.$api.store.state.userInfo.head_portrait)
					};
					customerServiceUrl = this.$api.helper.objParseUrlAndParam(customerServiceUrl, params);
					this.$api.shop.clearCustomerServiceRead();
					this.$api.router.push({
						route: this.$api.routesConfig.webview,
						query: {
							url: this.$api.helper.strEncode(customerServiceUrl)
						}
					});
				} else {
					//要求先登录
					this.$api.router.push({
						route: this.$api.routesConfig.login
					});
				}
				// #endif
			}
		},
		salesDelivery() {
			this.salesDeliveryModalShow = true;
		},
		salesDeliveryCancel() {
			this.salesDeliveryModalShow = false;
		},
		salesDeliveryConfirm() {
			this.salesDeliverySubmit();
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '物流单号已复制到剪贴板',
				type: 'success'
			});
		},
		async salesDeliverySubmit() {
			await this.$api.http
				.post(this.refundDetail.order_status == 4 ? this.$api.apiShop.orderCustomerSalesDelivery : this.$api.apiShop.orderProductSalesDelivery, {
					id: this.refundDetail.id
				})
				.then(res => {
					this.salesDeliveryModalShow = false;
					this.$refs.dzToast.show({
						title: '提交成功',
						type: 'success'
					});
					uni.$emit('refundChange', {});
					setTimeout(() => {
						this.$api.router.back();
					}, 1000);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.status {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 200rpx;
	padding: 0 30rpx;
	.title {
		font-size: 36rpx;
		margin-bottom: 20rpx;
	}
	.time {
		font-size: 24rpx;
	}
}
.content {
	background-color: #ffffff;
}
.product {
	background-color: #ffffff;
}
.item {
	display: flex;
	padding: 0 30rpx;
	.image {
		flex-shrink: 0;
		width: 180rpx;
		height: 180rpx;
		border-radius: 10rpx;
		background-color: $dz-bg-color;
	}
	.right {
		margin-left: 20rpx;
		.title {
			font-size: 28rpx;
			color: $dz-main-color;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.tip {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
}
.message {
	padding: 20rpx 30rpx;
	font-size: 28rpx;
	color: $dz-tips-color;
	view {
		line-height: 54rpx;
	}
}
.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: #ffffff;
	.footer-bottom {
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		margin-bottom: env(safe-area-inset-bottom);
	}
}
</style>
