<template>
	<view>
		<dz-navbar :title="language.coupon.couponTitle"></dz-navbar>
		<view class="banner" :style="{ background: theme.dzBaseColor }" v-if="couponList.length > 0">
			<view class="tetle">{{ language.coupon.couponTip }}</view>
			<view class="tip">{{ language.coupon.couponText }}</view>
		</view>
		<view class="content">
			<view class="item" v-for="(item, index) in couponList" :key="index">
				<image :src="imgCouponBg" class="dz-coupon-bg" mode="widthFix"></image>
				<view class="dz-coupon-item-left">
					<view class="money">
						<view class="money-l" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.type) === 1">
							<text style="font-size: 30rpx;font-weight: 400;">{{ language.application.moneySymbol }}</text>
							<text class="price">{{ item.money }}</text>
						</view>
						<view class="money-l" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.type) === 2">
							<text class="price">{{ item.discount / 10 }}</text>
							<text style="font-size: 30rpx;font-weight: 400;">{{ language.orderCreate.discount }}券</text>
						</view>
					</view>
					<view v-if="item.usableProduct.length == 0 && parseFloat(item.at_least) == 0">{{ language.coupon.noThreshold }}</view>
					<view v-else-if="item.usableProduct.length > 0 && parseFloat(item.at_least) == 0">{{ language.coupon.someGoodsAvailable }}</view>
					<view v-else class="dz-coupon-intro">{{ $api.helper.formatString(language.product.couponCondition, item.at_least) }}</view>
				</view>
				<view class="dz-coupon-item-right">
					<view class="left">
						<view class="top">
							<view class="name">
								<view class="text">{{ item.title }}</view>
							</view>
							<view class="btn">
								<dz-button
									:border="false"
									@click="onCoupon(item)"
									size="mini"
									shape="circle"
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
									hover-class="none"
								>
									{{ language.product.couponGet }}
								</dz-button>
							</view>
						</view>
						<view class="dz-rule-box">
							<view class="dz-coupon-circle dz-flex-s"></view>
							<text class="dz-coupon-text dz-color-9">{{ parseInt(item.range_type) === 1 ? '全场商品可用' : '部分商品可用' }}</text>
						</view>
						<view class="dz-rule-box">
							<view class="dz-coupon-circle dz-flex-s"></view>
							<view class="dz-coupon-text dz-color-9">
								<text v-if="parseInt(item.term_of_validity_type) === 1">{{ $api.helper.formatString(language.product.couponValidity, item.fixed_term) }}</text>
								<text v-else>
									{{
										$api.helper.formatString(
											language.product.couponUseRange,
											$api.helper.timeFormat(item.start_time, 'yyyy-mm-dd'),
											$api.helper.timeFormat(item.end_time, 'yyyy-mm-dd')
										)
									}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :text="language.product.noCouponsAvailable" :src="emptyCoupon" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" :margin-top="couponList.length > 0 ? 20 : 50" margin-bottom="20"></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			assets: this.$api.assetsConfig,
			language: this.$api.language,
			imgCouponBg: this.$api.assetsConfig.couponBg,
			page: 1,
			emptyCoupon: this.$api.assetsConfig.emptyCoupon,
			loadingStatus: 'loading',
			couponList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.coupon.couponTitle
		});
		await this.$onLaunched;
		this.getCouponList();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.couponList.length = 0;
		this.getCouponList();
	},
	methods: {
		getCouponList() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.couponList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSzie
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.couponList = [...this.couponList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					console.log(err);
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		onCoupon(item) {
			this.$api.http
				.post(this.$api.apiShop.couponReceive, {
					id: item.id
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: this.$api.language.product.couponGetSuccess,
						type: 'success'
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getCouponList();
	}
};
</script>

<style lang="scss">
.banner {
	height: 300rpx;
	border-radius: 0 0 30% 30%;
	text-align: center;
	.tetle {
		padding-top: 40rpx;
		font-size: 58rpx;
		font-family: PingFang;
		font-weight: 800;
		background: linear-gradient(0deg, #fffefa 0%, #f0ce86 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.tip {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #ffffff;
	}
}
.content {
	padding: 0 20rpx;
	margin-top: -40rpx;
}
.item {
	width: 100%;
	height: 210rpx;
	margin-bottom: 20rpx;
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	overflow: hidden;

	.dz-coupon-bg {
		width: 100%;
		height: 210rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}
	.dz-coupon-item-left {
		width: 218rpx;
		height: 210rpx;
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		.money {
			display: flex;
			align-items: center;
			justify-content: center;
			.money-l {
				font-size: 58rpx;
				font-weight: bold;
			}
		}
		.dz-coupon-intro {
			background: $dz-bg-color;
			padding: 8rpx 10rpx;
			font-size: 26rpx;
			line-height: 26rpx;
			font-weight: 400;
			color: $dz-content-color;
			margin-top: 18rpx;
			border-radius: 6rpx;
		}
	}
	.dz-coupon-item-right {
		flex: 1;
		height: 210rpx;
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		box-sizing: border-box;
		overflow: hidden;
		.left {
			width: 100%;
			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.name {
				display: flex;
				margin-bottom: 30rpx;
				font-size: 28rpx;
				color: $dz-main-color;
				.dz-coupon-tip {
					width: 60rpx;
					height: 38rpx;
					font-size: 25rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					transform: scale(0.9);
					transform-origin: 0 center;
					border-radius: 4rpx;
					flex-shrink: 0;
				}
			}
			.coupon-tip,
			.time {
				font-size: 24rpx;
				color: $dz-tips-color;
			}
			.dz-rule-box {
				display: flex;
				align-items: center;
				transform: scale(0.8);
				transform-origin: 0 100%;
			}

			.dz-padding-btm {
				padding-bottom: 6rpx;
			}

			.dz-coupon-circle {
				width: 8rpx;
				height: 8rpx;
				margin-right: 8rpx;
				background: rgb(160, 160, 160);
				border-radius: 50%;
			}
		}
		.btn {
			flex-shrink: 0;
			width: 128rpx;
		}
	}
}
</style>
