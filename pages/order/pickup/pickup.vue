<template>
	<view>
		<dz-navbar title="提货"></dz-navbar>
		<view class="product">
			<view v-if="orderDetail.order" class="cell-item">
				<view class="order">
					<view class="order-tetle">订单编号</view>
					<view class="order-num">{{ orderDetail.order.order_sn }}</view>
				</view>
				<view v-if="isPickupType()" @tap="all" :style="{ color: theme.dzBaseColor }">{{ isAll ? '取消全选' : '全选' }}</view>
			</view>
			<block v-for="(item, index) in orderDetail.product" :key="index">
				<view class="order-item">
					<view class="left" @tap="checkboxTap(index, item.checked)">
						<view class="image">
							<dz-image :src="item.product_picture" borderRadius="10" width="170" height="170"></dz-image>
							<text v-if="item.shipping_status == 1" class="tip">已提</text>
						</view>
						<view class="title">
							<view class="name">
								<dz-tag
									class="dz-m-r-10"
									:bg-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseFontColor"
									mode="dark"
									size="mini"
									:show="parseInt(item.gift_flag) > 0 ? true : false"
									:text="language.orderCreate.giveaways"
								></dz-tag>
								{{ item.product_name }}
							</view>
							<view class="dz-flex dz-row-between">
								<view>
									<view class="sku">{{ item.sku_name || '默认款' }}</view>
									<view class="dz-m-t-10" :style="{ color: theme.dzBaseColor }">
										<text class="dz-m-r-4">￥{{ item.price }}</text>
										x {{ item.num }}
									</view>
								</view>
								<view>
									<dz-checkbox
										shape="circle"
										:active-color="theme.dzBaseColor"
										:value="item.checked"
										:name="index"
										:disabled="
											!(
												item.shipping_status == 0 &&
												(item.refund_status == 0 || item.refund_status == -3 || item.refund_status == -2 || item.refund_status == -1)
											)
										"
									></dz-checkbox>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<dz-page-loading :show="loadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
		<view class="footer">
			<view class="footer-bottom">
				<view v-if="!isPickupType()">
					<dz-button
						:custom-style="{ background: '#FFF', border: '1rpx solid rgba(0,0,0,0.12)' }"
						hover-class="none"
						:border="false"
						size="medium"
						shape="circle"
						@click="backClick"
					>
						返回
					</dz-button>
				</view>
				<view v-else>
					<dz-button
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						:border="false"
						size="medium"
						shape="circle"
						@click="submit"
					>
						提货
					</dz-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			loadingShow: true,
			pageLoadingStatus: 'loading',
			orderDetail: {},
			isAll: false,
			pickupCode: ''
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: '提货'
		});
		this.pickupCode = option.code;
		this.getOrder();
	},
	methods: {
		loadingClick() {
			this.getOrder();
		},
		async getOrder() {
			await this.$api.http
				.post(this.$api.apiShop.roductPickupCheck, {
					code: this.pickupCode
				})
				.then(res => {
					this.loadingShow = false;
					this.orderDetail = res.data;
					this.orderDetail.product.forEach(item => {
						item.checked = false;
					});
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
		},
		checkboxTap(index, e) {
			if (this.isPickupType()) {
				this.checkboxChange(index, { value: !e });
			}
		},
		checkboxChange(index, e) {
			this.orderDetail.product[index].checked = e.value;
			this.$set(this.orderDetail.product, index, this.orderDetail.product[index]);
			let orderLength1 = 0;
			let orderLength2 = 0;
			if (this.orderDetail.product) {
				orderLength1 = this.orderDetail.product.filter(
					item =>
						item.shipping_status == 0 && item.checked && (item.refund_status == 0 || item.refund_status == -3 || item.refund_status == -2 || item.refund_status == -1)
				).length;
				orderLength2 = this.orderDetail.product.filter(
					item => item.shipping_status != 0 && (item.refund_status != 0 || item.refund_status != -3 || item.refund_status != -2 || item.refund_status != -1)
				).length;
				this.isAll = orderLength1 + orderLength2 == this.orderDetail.product.length;
			}
		},
		all() {
			this.isAll = !this.isAll;
			this.orderDetail.product.forEach((item, index) => {
				if (item.shipping_status == 0 && (item.refund_status == 0 || item.refund_status == -3 || item.refund_status == -2 || item.refund_status == -1)) {
					item.checked = this.isAll;
					this.$set(this.orderDetail.product, index, this.orderDetail.product[index]);
				} else {
					item.checked = false;
					this.$set(this.orderDetail.product, index, this.orderDetail.product[index]);
				}
			});
		},
		isPickupType() {
			if (this.orderDetail.product) {
				return this.orderDetail.product.some(
					item => item.shipping_status == 0 && (item.refund_status == 0 || item.refund_status == -3 || item.refund_status == -2 || item.refund_status == -1)
				);
			}
		},
		isPickupOrder() {
			if (this.orderDetail.product) {
				return this.orderDetail.product.some(item => item.checked == true);
			}
		},
		backClick() {
			this.$api.router.back();
		},
		submit() {
			if (!this.isPickupOrder())
				return this.$refs.dzToast.show({
					title: '请选择商品！',
					type: 'warning'
				});
			let order_product_ids = {};

			this.orderDetail.product.forEach((item, index) => {
				if (item.shipping_status == 0 && item.checked && (item.refund_status == 0 || item.refund_status == -3 || item.refund_status == -2 || item.refund_status == -1)) {
					order_product_ids[index] = item.id;
				}
			});

			this.$api.http
				.post(this.$api.apiShop.roductPickupCreate, {
					id: this.orderDetail.order.id,
					order_product_ids
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: '操作成功',
						type: 'success'
					});
					this.isAll = false;
					this.getOrder();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.product {
	padding: 20rpx;
	background-color: #ffffff;
	.cell-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
		.order {
			flex: 1;
			display: flex;
			align-items: center;
			.order-tetle {
				font-size: 28rpx;
				color: $dz-content-color;
				margin-right: 20rpx;
			}
			.order-num {
				width: 300rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: $dz-tips-color;
			}
		}
	}
	.order-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
		.left {
			display: flex;
			width: 100%;
			.image {
				position: relative;
				flex-shrink: 0;
				width: 170rpx;
				height: 170rpx;
				border-radius: 10rpx;
				background-color: $dz-bg-color;

				.tip {
					display: flex;
					align-items: center;
					justify-content: center;
					position: absolute;
					top: 0;
					left: 0;
					height: 35rpx;
					width: 70rpx;
					font-size: 24rpx;
					color: #ffffff;
					background-color: $dz-type-warning;
					border-radius: 10rpx 0 10rpx 0;
				}
			}
			.title {
				margin-left: 20rpx;
				flex: 1;
				.name {
					line-height: 40rpx;
					color: $dz-main-color;
					font-size: 28rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.sku {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: $dz-content-color;
				}
			}
		}

		.right {
			.price-box {
				margin-left: 10rpx;
				text-align: right;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
	}
	.order-item:last-child {
		margin-bottom: 10rpx;
	}
}
.footer {
	position: fixed;
	bottom: 0;
	z-index: 2;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	.footer-bottom {
		width: 100%;
		height: 110rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: env(safe-area-inset-bottom);
	}
}
</style>
