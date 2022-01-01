<template>
	<view class="">
		<dz-navbar :is-fixed="true" :title="title"></dz-navbar>
		<dz-image :src="cover" width="100%" height="320"></dz-image>
		<view class="product-box">
			<view class="item" v-for="(item, index) in list" :key="index" @tap="itemTab(item.product.id)">
				<view class="image"><dz-image :src="item.product.picture" width="200" height="200" borderRadius="12"></dz-image></view>
				<view class="right">
					<view>
						<view class="title">{{ item.product.name }}</view>
						<view class="tip">{{ item.product.sketch }}</view>
					</view>
					<view class="dz-m-t-30 dz-color-9">{{ $api.helper.formatString(language.bargain.joinNumber, item.sales) }}</view>
					<view class="price-box">
						<view class="price">
							<view class="m-price" :style="{ color: theme.dzBaseColor }">
								<text>{{ language.application.moneySymbol }}</text>
								<text class="price-num">
									{{ $api.helper.toFixed(item.product.price - (1 - $api.helper.toFloat(item.min_rate / 100)) * item.product.price, 2) }}
								</text>
							</view>
						</view>
						<view>
							<dz-button
								:custom-style="{
									background: theme.dzBaseColor,
									color: theme.dzBaseFontColor
								}"
								hover-class="none"
								size="mini"
								shape="circle"
								:border="false"
								@click="banicBuying(item.product.id)"
							>
								去砍价
							</dz-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="productLoadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<view class="dz-p-b-20">
			<dz-loadmore v-if="productLoadingStatus != 'nodata'" :status="productLoadingStatus" margin-top="20"></dz-loadmore>	
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
			title: '',
			cover: '',
			name: '',
			id: '',
			page: 0,
			list: [],
			loading: false,
			productLoadingStatus: 'loading'
		};
	},
	async onLoad(e) {
		this.id = e.id;
		this.cover = e.cover;
		this.title = e.name;
		uni.setNavigationBarTitle({
			title: this.title || this.$api.language.bargainListTitle
		});
		await this.$onLaunched;
		this.getList();
	},
	onPullDownRefresh() {
		this.page = 0;
		this.list = [];
		this.getList();
	},
	onReachBottom() {
		if (this.loading || this.productLoadingStatus === 'nomore') return;
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
		async getList() {
			if (this.loading) return;
			this.page++;
			this.productLoadingStatus = 'loading';
			this.loading = true;
			await this.$api.http
				.get(this.$api.apiShop.bargainProductIndex, {
					params: {
						id: this.id,
						page: this.page,
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
.product-box {
	padding: 20rpx;
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
			border-radius: 12rpx;
		}
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 15rpx;
			.title {
				width: 460rpx;
				font-size: 28rpx;
				color: $dz-main-color;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.tip {
				width: 460rpx;
				font-size: 24rpx;
				color: $dz-tips-color;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
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
						.price-num {
							font-size: 36rpx;
							font-weight: bold;
						}
					}
				}
			}
		}
	}
}
</style>
