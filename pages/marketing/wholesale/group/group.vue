<template>
	<view class="content">
		<dz-navbar :title="language.wholesaleGroup.wholesaleGroupTitle" :borderBottom="false"></dz-navbar>
		<dz-tabs-swiper
			:active-color="theme.dzBaseColor"
			ref="dzTabs"
			:list="list"
			:current="current"
			@change="change"
			:is-scroll="false"
			bar-height="8"
			style=" position: relative;
		z-index: 10;width: 750rpx;"
		></dz-tabs-swiper>
		<swiper :current="swiperCurrent" duration="200" @change="swiperChange" class="swiper-box">
			<swiper-item class="list-scroll-content" v-for="(tap, tapIndex) in list" :key="tapIndex">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<view class="order-box">
						<view class="item" v-for="(item, index) in wholesaleMemberList" :key="index">
							<view class="top">
								<view class="logo">
									<view v-if="(parseInt(item.state) === 0 || parseInt(item.state) === 1) && item.end_time_left && item.end_time_left > 0">
										{{ language.wholesaleGroup.wholesaleLeftTime }}
										<dz-count-down
											class="dz-m-l-10"
											:timestamp="item.end_time_left"
											:show-days="false"
											:color="theme.dzBaseColor"
											:separator-color="theme.dzBaseColor"
											:bg-color="'transparent'"
											@end="wholesaleTimeout(item.id)"
										></dz-count-down>
									</view>
									<view v-if="parseInt(item.state) > 1">{{ item.created_at | timeFormat }} {{ language.wholesaleGroup.wholesaleStart }}</view>
								</view>
								<view class="status" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)">
									{{ $api.helper.formatString(language.wholesaleGroup.wholesaleShareTip, parseInt(item.total_number) - parseInt(item.number)) }}
								</view>
								<view class="status" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left < 0)">
									{{ language.wholesaleGroup.wholesaleOutOfTime }}
								</view>
								<view class="status" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.state) === 0">{{ language.wholesaleGroup.wholesalePay }}</view>
								<view class="status" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.state) === 2">{{ language.wholesaleGroup.wholesaleSuccess }}</view>
								<view class="status" :style="{ color: theme.dzBaseColor }" v-if="parseInt(item.state) === 3">{{ language.wholesaleGroup.wholesaleFail }}</view>
							</view>
							<view class="order-content" @tap.stop="wholesaleProduct(item.product_id)">
								<view class="order-item">
									<view class="left">
										<view class="image"><dz-image :src="item.product_picture" borderRadius="10" width="170" height="170"></dz-image></view>
										<view class="title">
											<view class="name">{{ item.product_name }}</view>
											<view class="sku">{{ item.sku_name || language.application.defaultSkuName }}</view>
										</view>
									</view>
									<view class="right">
										<view class="price-box">
											<view>{{ language.application.moneySymbol }}{{ item.product_money || '0.00' }}</view>
											<view>x 1</view>
										</view>
									</view>
								</view>
							</view>
							<view class="tip">
								<text>{{ language.application.moneySymbol }}{{ item.product_money || '0.00' }}</text>
								{{ language.wholesaleGroup.wholesaleOrderTip }}
							</view>
							<view class="bottom">
								<view></view>
								<view class="btn" v-if="parseInt(item.state) === 0">
									<dz-button
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx' }"
										hover-class="none"
										size="mini"
										:border="false"
										shape="circle"
										@click="pay(item)"
									>
										{{ language.wholesaleGroup.wholesaleButtonPay }}
									</dz-button>
								</view>
								<view class="btn" v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)">
									<dz-button
										:border="false"
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
										hover-class="none"
										size="mini"
										shape="circle"
										@tap="toWholesaleDetail(item.id)"
									>
										{{ language.wholesaleGroup.wholesaleButtonShare }}
									</dz-button>
								</view>
								<view class="btn" v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left < 0)">
									<dz-button
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx' }"
										hover-class="none"
										size="mini"
										shape="circle"
										:border="false"
										@tap="toWholesaleDetail(item.id)"
									>
										{{ language.wholesaleGroup.wholesaleButtonDetail }}
									</dz-button>
								</view>
								<view class="btn" v-if="parseInt(item.state) > 1">
									<dz-button
										:border="false"
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx' }"
										hover-class="none"
										size="mini"
										shape="circle"
										@tap="toWholesaleDetail(item.id)"
									>
										{{ language.wholesaleGroup.wholesaleButtonDetail }}
									</dz-button>
									<dz-button
										v-if="parseInt(item.state) === 2"
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
										hover-class="none"
										size="mini"
										shape="circle"
										@tap="toOrderDetail(item)"
									>
										{{ language.wholesaleGroup.wholesaleButtonOrderDetail }}
									</dz-button>
								</view>
							</view>
						</view>
						<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :text="language.wholesaleGroup.wholesaleEmpty" :src="emptyOrder" iconSize="360"></dz-empty>
						<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-bottom="0" margin-top="20"></dz-loadmore>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			current: 0,
			swiperCurrent: 0,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			list: [
				{
					status: undefined,
					name: this.$api.language.wholesaleGroup.wholesaleStatusAll
				},
				{
					status: 1,
					name: this.$api.language.wholesaleGroup.wholesaleStatusProgress
				},
				{
					status: 2,
					name: this.$api.language.wholesaleGroup.wholesaleStatusSuccess
				},
				{
					status: 3,
					name: this.$api.language.wholesaleGroup.wholesaleStatusFail
				}
			],
			page: 1,
			wholesaleMemberList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: this.$api.language.wholesaleGroup.wholesaleGroupTitle
		});
		await this.$onLaunched;
		this.getWholesaleMemberIndex();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.wholesaleMemberList.length = 0;
		this.getWholesaleMemberIndex();
	},
	methods: {
		getWholesaleMemberIndex() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.wholesaleMemberIndex, {
					params: {
						page: this.page,
						state: this.list[this.current].status,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.wholesaleMemberList = [...this.wholesaleMemberList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		},
		change(index) {
			this.page = 1;
			this.wholesaleMemberList.length = 0;
			this.swiperCurrent = this.current = index;
		},
		swiperChange(e) {
			this.current = this.swiperCurrent = e.detail.current;
			this.page = 1;
			this.wholesaleMemberList.length = 0;
			this.getWholesaleMemberIndex();
		},
		onreachBottom() {
			if (this.loadingStatus == 'nomore') return;
			this.page++;
			this.getWholesaleMemberIndex();
		},
		//跳转商品
		wholesaleProduct(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.wholesaleProduct,
				query: {
					id: id
				}
			});
		},
		//拼团超时
		wholesaleTimeout(id) {
			for (let i = 0; i < this.wholesaleMemberList.length; i++) {
				if (this.wholesaleMemberList[i].id === id) {
					this.$set(this.wholesaleMemberList[i], 'state', 3);
					break;
				}
			}
		},
		// 拼团详情
		toWholesaleDetail(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.wholesaleDetail,
				query: {
					id
				}
			});
		},
		//订单详情
		toOrderDetail(item) {
			let userId = this.$api.store.state.userInfo.id;
			let orderId = '';
			for (let i = 0; i < item.order.length; i++) {
				if (item.order[i].buyer_id) {
					orderId = item.order[i].id;
					break;
				}
			}
			if (!orderId) {
				return;
			}
			this.$api.router.push({
				route: this.$api.routesConfig.orderDetail,
				query: {
					id: orderId
				}
			});
		},
		// 订单支付
		pay(item) {
			let userId = this.$api.store.state.userInfo.id;
			let orderId = '';
			for (let i = 0; i < item.order.length; i++) {
				if (item.order[i].buyer_id) {
					orderId = item.order[i].id;
					break;
				}
			}
			if (!orderId) {
				return;
			}
			this.$api.router.push({
				route: this.$api.routesConfig.pay,
				query: {
					id: orderId
				}
			});
		}
	}
};
</script>

<style lang="scss">
page,
.content {
	height: 100%;
}
.swiper-box {
	height: calc(100% - 84px - var(--status-bar-height));
}
.list-scroll-content {
	height: 100%;
}
.uni-swiper-item {
	height: auto;
}
.order-box {
	position: flex;
	height: auto;
	padding: 20rpx;
	box-sizing: border-box;
	.item {
		padding: 20rpx;
		background-color: #fff;
		border-radius: 15rpx;
		overflow: hidden;
		margin-bottom: 20rpx;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.logo {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: $dz-main-color;
			}
			.status {
			}
		}
	}
}
.order-content {
	margin-top: 30rpx;
	.order-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.left {
			display: flex;
			.image {
				flex-shrink: 0;
				width: 170rpx;
				height: 170rpx;
				border-radius: 10rpx;
			}
			.title {
				margin-left: 20rpx;
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
					color: $dz-tips-color;
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
}
.tip {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	width: 100;
	padding-top: 20rpx;
	font-size: 24rpx;
	color: $dz-tips-color;
	text {
		margin-left: 10rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
}
.bottom {
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;
}
</style>
