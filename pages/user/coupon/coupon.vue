<template>
	<view>
		<dz-navbar :title="language.coupon.myCoupon"></dz-navbar>
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
						</view>
						<view class="time">
							{{
								$api.helper.formatString(
									language.product.couponUseRange,
									$api.helper.timeFormat(item.couponType.start_time, 'yyyy-mm-dd'),
									$api.helper.timeFormat(item.couponType.end_time ? item.couponType.end_time : item.end_time, 'yyyy-mm-dd')
								)
							}}
						</view>
						<text class="dz-font-24 dz-color-9 dz-m-r-10">{{ parseInt(item.range_type) === 1 ? '全场商品可用' : '部分商品可用' }}</text>
						<dz-tag
							class="dz-m-t-10"
							:show="parseInt(item.couponType.end_time ? item.couponType.end_time : item.end_time) > parseInt(new Date().getTime() / 1000)"
							:text="`有效期为${$api.helper.timeDayDiff(parseInt(new Date().getTime() / 1000), item.couponType.end_time ? item.couponType.end_time : item.end_time)}天`"
							type="info"
							size="mini"
							bgColor="#f3f4f6"
							borderColor="#f3f4f6"
						></dz-tag>
						<dz-tag
							class="dz-m-t-10"
							:show="parseInt(item.couponType.end_time ? item.couponType.end_time : item.end_time) < parseInt(new Date().getTime() / 1000)"
							text="已过期"
							type="info"
							size="mini"
							bgColor="#f3f4f6"
							borderColor="#f3f4f6"
						></dz-tag>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :src="emptyCoupon" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-p-b-20"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			assets: this.$api.assetsConfig,
			language: this.$api.language,
			emptyCoupon: this.$api.assetsConfig.emptyCoupon,
			imgCouponBg: this.$api.assetsConfig.couponBg,
			page: 1,
			loadingStatus: 'loading',
			couponList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.coupon.myCoupon
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
				.get(this.$api.apiShop.myCouponList, {
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
.content {
	padding: 20rpx 20rpx 0;
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
		}
		.btn {
			flex-shrink: 0;
			width: 128rpx;
		}
	}
}
</style>
