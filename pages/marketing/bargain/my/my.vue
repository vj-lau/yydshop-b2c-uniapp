<template>
	<view>
		<dz-navbar :title="language.bargain.myBargain"></dz-navbar>
		<view class="product-box">
			<block v-for="(item, index) in bargainLaunch" :key="index">
				<view class="item" v-if="item.sku" @click="bargainTap(item.product_id, 'bargainProduct')">
					<view class="image"><dz-image :src="item.sku.baseProduct.picture" borderRadius="10" width="200" height="200"></dz-image></view>
					<view class="right">
						<view>
							<view class="title">{{ item.sku.baseProduct.name }}</view>
							<view>
								<!-- 活动即将开始/还剩-->
								<text
									class="group-tip"
									v-if="parseInt(item.state) != 3 && parseInt(item.state) != 2 && (item.end_time_left && item.end_time_left > 0)"
									:class="{ on: parseInt(item.state) != 1 }"
								>
									{{ parseInt(item.state) != 1 ? language.group.theEventIsAboutToBegin : language.group.surplus }}
								</text>
								<dz-count-down
									v-if="parseInt(item.state) === 1"
									:timestamp="item.end_time_left"
									separator="zd"
									:bg-color="theme.dzBaseColor"
									font-size="24"
									separator-size="22"
									:separator-color="theme.dzTipsColor"
									:color="theme.dzBaseFontColor"
									style="margin-left: 10rpx;"
									@end="timeOut(index)"
								></dz-count-down>
								<view class="group-tip" v-if="item.order && parseInt(item.order.order_status) == 0 && item.order.close_left_time > 0">
									剩余支付时间
									<dz-count-down
										:timestamp="item.order.close_left_time"
										:show-days="false"
										:color="theme.dzBaseFontColor"
										fontSize="24"
										separator-size="22"
										separator="zd"
										:separator-color="theme.dzTipsColor"
										style="margin-left: 10rpx;"
										:bg-color="theme.dzBaseColor"
										@end="timePayOut(index)"
									></dz-count-down>
								</view>
								<view v-if="item.order && item.order.close_left_time < 0" class="group-tip">支付已关闭</view>
							</view>
						</view>
						<view class="price-box">
							<view class="price">
								<view class="m-price" v-if="parseInt(item.state) === 1">{{ $api.helper.formatString(language.bargain.bargainSuccess, item.surplus_money) }}</view>
								<view v-if="parseInt(item.state) === 3">{{ language.bargain.bargainerror }}</view>
								<view v-if="parseInt(item.state) === 2">{{ language.bargain.bargainStatusSuccess }}</view>
							</view>
							<view>
								<!-- 去支付 -->
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, marginRight: '20rpx' }"
									hover-class="none"
									size="mini"
									:border="false"
									shape="circle"
									@click="toPay(item)"
									v-if="
										(item.end_time_left > 0 && (item.order_id == 0 && parseInt(item.state) === 2)) ||
											(item.order && item.order.close_left_time > 0 && item.order.pay_status == 0)
									"
								>
									去支付
								</dz-button>
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
									hover-class="none"
									size="mini"
									shape="circle"
									:border="false"
									@click="bargainTap(item.id, 'bargainDetails')"
									v-if="parseInt(item.state) === 1"
								>
									{{ language.bargain.bargains }}
								</dz-button>
								<!-- 再砍一个 -->
								<dz-button
									:plain="true"
									:border="false"
									size="mini"
									shape="circle"
									hoverClass="none"
									:customStyle="{ background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
									@click="bargainTap(item.product_id, 'bargainProduct')"
									v-else-if="parseInt(item.state) === 2"
								>
									砍价详情
								</dz-button>
								<dz-button
									type="default"
									:plain="true"
									hoverClass="none"
									:border="false"
									size="mini"
									shape="circle"
									:customStyle="{ background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
									@click="bargainTap(item.id, 'bargainProduct')"
									v-else
								>
									砍价详情
								</dz-button>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :text="language.bargain.bargainEmpty" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			loadingStatus: 'loading',
			page: 1,
			bargainLaunch: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.language.bargain.myBargain
		});
		await this.$onLaunched;
		this.getBargainLaunch();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.bargainLaunch.length = 0;
		this.getBargainLaunch();
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getBargainLaunch();
	},
	methods: {
		async getBargainLaunch() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.bargainLaunchIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.bargainLaunch = [...this.bargainLaunch, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
					console.log(err);
				});
			uni.stopPullDownRefresh();
		},
		// 去支付
		async toPay(item) {
			let orderId = item.order_id;
			if (item.order_id == 0 && item.state == 2) {
				uni.showLoading({
					title: '正在生成订单...'
				});
				await this.$api.http
					.get(this.$api.apiShop.bargainLaunchBuildOrder, {
						params: { id: item.id }
					})
					.then(res => {
						orderId = res.data.order_id;
						this.page = 1;
						this.bargainLaunch.length = 0;
						this.getBargainLaunch();
					})
					.finally(() => {
						uni.hideLoading();
					});
			}

			if (orderId > 0) {
				this.$api.router.push({
					route: this.$api.routesConfig.orderDetail,
					query: {
						id: orderId
					}
				});
			}
		},
		bargainTap(id, url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id
				}
			});
		},
		timeOut(index) {
			this.bargainLaunch[index].state = 3;
			this.bargainLaunch[index].end_time_left = -1;
			this.$set(this.bargainLaunch, index, this.bargainLaunch[index]);
		},
		timePayOut(index) {
			this.bargainLaunch[index].order.close_left_time = -1;
			this.$set(this.bargainLaunch, index, this.bargainLaunch[index]);
		}
	}
};
</script>

<style lang="scss">
.product-box {
	padding: 20rpx 20rpx 0;
	.item {
		display: flex;
		padding: 20rpx;
		border-radius: 15rpx;
		margin-bottom: 20rpx;
		background-color: #ffffff;
		.image {
			flex-shrink: 0;
			width: 200rpx;
			height: 200rpx;
			border-radius: 10rpx;
		}
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 15rpx;
			.title {
				width: 450rpx;
				font-size: 28rpx;
				color: $dz-main-color;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.group-tip {
				margin-top: 6rpx;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
			.on {
				color: $dz-main-color;
			}
			.price-box {
				display: flex;
				justify-content: space-between;
				.price {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: $dz-tips-color;
					.m-price {
						color: $dz-type-error;
					}
				}
			}
		}
	}
}
</style>
