<template>
	<view>
		<dz-navbar :title="title"></dz-navbar>
		<view class="content">
			<view class="banner" v-if="discountProduct.length > 0"><dz-image :src="banner" width="100%" height="320"></dz-image></view>
			<view class="product-card" v-if="discountProduct.length > 0">
				<view class="title">{{ language.discount.localCommodities }}</view>
				<view class="item" v-for="(item, index) in discountProduct" :key="index" @tap="puy(item)">
					<view class="image"><dz-image :src="item.product.picture" width="180" height="180" borderRadius="12"></dz-image></view>
					<view class="right">
						<view>
							<view class="name">{{ item.product.name }}</view>
							<view class="tip">{{ item.product.sketch }}</view>
						</view>
						<view class="price-box">
							<view class="price">
								<view class="price-content" :style="{ color: theme.dzBaseColor }">
									<text class="price-l">{{ language.application.moneySymbol }}</text>
									<text class="price-r">{{ marketingPrice(item) }}</text>
								</view>
								<view class="text">{{ language.application.moneySymbol }}{{ item.product.price || item.product.market_price }}</view>
							</view>
							<view class="btn">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx', height: '50rpx' }"
									hover-class="none"
									size="medium"
									@click="puy(item)"
								>
									{{ language.discount.buy }}
								</dz-button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="margin-top: -20rpx;" class="dz-p-b-20">
				<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus"></dz-loadmore>
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
			banner: '',
			title: '',
			id: '',
			page: 1,
			loadingStatus: 'loading',
			discountProduct: [],
			type: ''
		};
	},
	async onLoad(option) {
		this.banner = option.cover;
		this.title = option.name;
		this.id = option.id;
		this.type = option.type;
		uni.setNavigationBarTitle({ title: option.name });
		await this.$onLaunched;
		this.getDiscountProductIndex();
	},
	onPullDownRefresh() {
		this.discountProduct.length = 0;
		this.page = 1;
		this.getDiscountProductIndex();
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getDiscountProductIndex();
	},
	methods: {
		async getDiscountProductIndex() {
			this.loadingStatus = 'loading';
			let path = this.type == 'data' ? (path = 'discountProductIndex') : 'discountProductSoon';
			this.$api.http
				.get(this.$api.apiShop[path], {
					params: {
						discount_id: this.id,
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.discountProduct = [...this.discountProduct, res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
					this.discountProduct = res.data;
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
					console.log(err);
				});
			uni.stopPullDownRefresh();
		},
		marketingPrice(val) {
			//限时折扣
			const decimal = val.decimal_reservation_number;
			const discount = val.discount;
			let price = val.product.price;

			//限时折扣价格保留方式
			switch (parseInt(decimal)) {
				case -1:
					//保留角和分
					price = this.$api.helper.toFixed((price * discount) / 100, 2);
					break;
				case 0:
					//抹去角和分
					price = Math.floor((price * discount) / 100) * 10;
					price = (Math.round(price * 10) / 100).toFixed(0);
					break;
				case 1:
					//抹去分
					price = this.$api.helper.toFixed((price * discount) / 100, 1);
					break;
				default:
					price = this.$api.helper.toFixed((price * discount) / 100, 2);
			}
			return parseFloat(price).toFixed(2);
		},
		puy(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.discountProduct,
				query: {
					id: item.product_id
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	width: 100%;
	.banner {
		image {
			width: 100%;
		}
	}

	.product-card {
		position: relative;
		top: -60rpx;
		margin: 0 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #fff;
		.title {
			margin-bottom: 30rpx;
			font-size: 36rpx;
			font-weight: 700;
			color: $dz-main-color;
		}
		.item {
			display: flex;
			margin-bottom: 40rpx;
			.image {
				flex-shrink: 0;
				width: 180rpx;
				height: 180rpx;
				border-radius: 10rpx;
			}
			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20rpx;
				.name {
					width: 451rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-size: 28rpx;
					color: $dz-main-color;
				}
				.tip {
					width: 451rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 24rpx;
					color: $dz-tips-color;
				}
				.price-box {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.price {
						display: flex;
						align-items: flex-end;
						.price-content {
							.price-l {
								font-size: 24rpx;
							}
							.price-r {
								font-size: 32rpx;
								font-weight: bold;
							}
						}
						.text {
							color: $dz-tips-color;
							font-size: 24rpx;
							font-weight: 400;
							margin-left: 10rpx;
							text-decoration: line-through;
						}
					}
				}
			}
		}
		.item:last-child {
			margin-bottom: 20rpx;
		}
	}
}
</style>
