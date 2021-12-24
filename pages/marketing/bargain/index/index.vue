<template>
	<view class="">
		<dz-navbar :is-fixed="true" :title="language.bargain.bargainIndexTitle"></dz-navbar>
		<view class="list">
			<view class="listitem" v-for="(item, index) in list" :key="index">
				<!--banner-->
				<view class="item_top" @click="seeMore(item.id, item.cover, item.name)">
					<view class="img_box"><dz-image :src="item.cover" width="100%" height="200"></dz-image></view>
				</view>
				<!--info-->
				<view class="theme">
					<view class="theme_header" @click="seeMore(item.id, item.cover, item.name)">
						<view class="title dz-line-2">{{ item.name }}</view>
						<view class="des">
							{{ item.description }}
							<dz-icon name="right"></dz-icon>
						</view>
					</view>
					<view class="state">
						<block v-if="parseInt(item.state) === 1 || parseInt(item.state) === 0">
							<view>
								<dz-tag :type="parseInt(item.state) === 1 ? 'error' : 'success'">
									<text class="dz-m-r-20 dz-font-20">{{ item.state == 1 ? language.bargain.progress : language.bargain.startSoon }}</text>
									<dz-count-down
										:timestamp="parseInt(item.state) === 1 ? item.end_time_left : item.start_time_left"
										:color="parseInt(item.state) === 1 ? theme.dzTypeError : theme.dzTypeSuccess"
										:separator-color="parseInt(item.state) === 1 ? theme.dzTypeError : theme.dzTypeSuccess"
										:separator="'zh'"
										font-size="20"
										separator-size="20"
										bg-color="transparent"
										@end="countDownEnd(item.id)"
									></dz-count-down>
								</dz-tag>
							</view>
						</block>
						<block v-else>
							<view>
								<dz-tag type="info">{{ language.bargain.alreadyOver }}</dz-tag>
							</view>
						</block>
					</view>
				</view>
				<!-- 多个显示 -->
				<scroll-view scroll-x="true" class="scroll" v-if="item.products.length >= 3">
					<view class="xx">
						<view class="item_bot">
							<view class="bot_item" v-for="(value, key) in item.products" :key="key" @click="itemTab(value.product.id)">
								<image :src="value.product.picture" mode=""></image>
								<view class="price" :style="{ color: theme.dzBaseColor }">
									{{ language.application.moneySymbol
									}}{{ $api.helper.toFixed(value.product.price - (1 - $api.helper.toFloat(value.min_rate / 100)) * value.product.price, 2) }}
								</view>
								<view class="oldprice">{{ language.application.moneySymbol }}{{ value.product.market_price }}</view>
							</view>
							<view class="more" v-if="item.productCount > product_limit">
								<view class="morein" @click="seeMore(item.id, item.cover, item.name)">
									<view class="">{{ language.bargain.viewMore }}</view>
									<view style="margin-top: 10rpx;" class="dzicon-iconfont dzicon-roundrightfill"></view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- 单个显示-->
				<block v-if="item.products.length === 1">
					<view class="single" v-for="(value, key) in item.products" :key="key" @click="itemTab(value.product.id)">
						<view class="single_left"><dz-image :src="value.product.picture" width="200" height="200" borderRadius="20"></dz-image></view>
						<view class="single_right">
							<view class="single_title">{{ value.product_name }}</view>
							<view class="des">{{ value.product.sketch }}</view>
							<view class="price" :style="{ color: theme.dzBaseColor }">
								<view class="pleft" :style="{ color: theme.dzBaseColor }">
									<text class="rmb">{{ language.application.moneySymbol }}</text>
									<text class="num">
										{{ $api.helper.toFixed(value.product.price - (1 - $api.helper.toFloat(value.min_rate / 100)) * value.product.price, 2) }}
									</text>
								</view>
								<view class="pr">{{ $api.helper.formatString(language.bargain.joinNumber, value.sales) }}</view>
							</view>
						</view>
					</view>
				</block>
				<!-- 两个显示 -->
				<view class="double" v-if="item.products.length === 2">
					<view class="double_item" v-for="(value, key) in item.products" :key="key" @click="itemTab(value.product.id)">
						<view class="image"><dz-image :src="value.product.picture" width="100%" height="300" borderRadius="20"></dz-image></view>

						<view class="double_title pad8">{{ value.product_name }}</view>
						<view class="double_price pad8">
							<view class="double_price_now" :style="{ color: theme.dzBaseColor }">
								<text class="double_rmb">{{ language.application.moneySymbol }}</text>
								<view class="double_num">
									{{ $api.helper.toFixed(value.product.price - (1 - $api.helper.toFloat(value.min_rate / 100)) * value.product.price, 2) }}
								</view>
							</view>
						</view>
						<view class="people pad8">{{ $api.helper.formatString(language.bargain.joinNumber, value.sales) }}</view>
					</view>
				</view>
			</view>
			<view class="dz-p-t-10">
				<dz-empty v-if="productLoadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
				<dz-loadmore v-if="productLoadingStatus != 'nodata'" :status="productLoadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
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
			empty: this.$api.assetsConfig.empty,
			list: [],
			page: 0,
			product_limit: 6,
			productLoadingStatus: 'loading',
			loading: false
		};
	},
	onReachBottom() {
		if (this.loading || this.productLoadingStatus === 'nomore') return;
		this.getList();
	},
	onPullDownRefresh() {
		this.page = 0;
		this.list = [];
		this.getList();
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.bargain.bargainIndexTitle
		});
		await this.$onLaunched;
		this.getList();
	},
	methods: {
		itemTab(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.bargainProduct,
				query: {
					id: id
				}
			});
		},
		seeMore(id, cover, name) {
			this.$api.router.push({
				route: this.$api.routesConfig.bargainList,
				query: {
					id,
					cover,
					name
				}
			});
		},
		countDownEnd(id) {
			for (let i = 0; i < this.list.length; i++) {
				if (this.list[i].id === id) {
					if (parseInt(this.list[i].state) === 0) {
						this.$set(this.list[i], 'state', 1);
					} else {
						this.$set(this.list[i], 'state', 2);
					}
					break;
				}
			}
		},
		async getList() {
			if (this.loading) return;
			this.page++;
			this.loading = true;
			this.productLoadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.bargainIndex, {
					params: {
						page: this.page,
						product_limit: this.product_limit,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.list = [...this.list, ...res.data];
					this.productLoadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					if (this.page === 1 && res.data.length === 0) {
						this.productLoadingStatus = 'nodata';
					}
					this.loading = false;
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	padding: 20rpx;
	color: $dz-main-color;

	.listitem {
		width: 100%;
		background-color: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 20rpx;

		.item_top {
			position: relative;
			margin-bottom: 20rpx;
			.img_box {
				width: 100%;
				height: 200rpx;
			}
		}

		.theme {
			padding: 0 20rpx 10rpx;

			.theme_header {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title {
					color: $dz-main-color;
					font-size: 34rpx;
					font-weight: bold;
				}

				.des {
					font-size: 26rpx;
					color: $dz-content-color;
				}
			}

			.state {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 20rpx 0;
			}
		}

		.scroll {
			width: 100%;
			white-space: nowrap;
		}

		.item_bot {
			text-align: center;
			display: flex;
			padding-bottom: 6rpx;

			.bot_item {
				position: relative;
				display: inline-block;
				margin-left: 16rpx;
			}

			image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 20rpx;
				overflow: hidden;
				vertical-align: middle;
			}

			.price {
				font-weight: bold;
			}

			.oldprice {
				color: $dz-tips-color;
				font-size: 24rpx;
				text-decoration: line-through;
			}

			.more {
				margin-left: 16rpx;

				// display: flex;
				// justify-content: center;
				// align-items: center;
				// flex-direction: column;
				.morein {
					width: 180rpx;
					height: 180rpx;
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
				}
			}
		}

		// 单个显示
		.single {
			display: flex;
			padding: 0 10rpx 10rpx;

			.single_left {
				margin-right: 20rpx;
			}

			.single_right {
				display: flex;
				flex-direction: column;
				justify-content: center;

				.single_title {
					font-size: 28rpx;
					font-weight: bold;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.des {
					width: 450rpx;
					font-size: 26rpx;
					margin: 6rpx 0;
					color: $dz-tips-color;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.price {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.pr {
						font-size: 24rpx;
						color: $dz-tips-color;
						padding-right: 8rpx;
					}

					.pleft {
					}

					.rmb {
						font-size: 30rpx;
					}

					.num {
						font-size: 34rpx;
					}
				}
			}
		}

		// 两个显示
		.double {
			display: flex;
			justify-content: space-around;
			border-radius: 20rpx;
			overflow: hidden;

			.double_item {
				width: 48%;
				// height: 300rpx;
				padding-bottom: 16rpx;

				.image {
					width: 100%;
					height: 300rpx;
				}

				.pad8 {
					padding: 0 8rpx;
				}

				.double_title {
					font-size: 28rpx;
					font-weight: bold;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.double_price {
					display: flex;

					.double_price_now {
						display: flex;
						align-items: center;

						.double_rmb {
							font-size: 30rpx;
						}

						.double_num {
							font-size: 34rpx;
						}
					}

					.double_price_old {
						display: flex;
						align-items: center;
						font-size: 24rpx;
						transform: scale(0.9);
						text-decoration: line-through;
						margin-left: 16rpx;
						color: $dz-tips-color;
					}
				}

				.people {
					color: $dz-content-color;
					font-size: 24rpx;
				}
			}
		}
	}
}
</style>
