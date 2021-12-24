<template>
	<view class="">
		<dz-navbar :is-fixed="true" :title="title"></dz-navbar>
		<dz-image :src="cover" width="100%" height="320"></dz-image>
		<view class="double">
			<view class="double_item" v-for="(item, index) in list" :key="index" @click="itemTab(item.product.id)">
				<image :src="item.product.picture" mode="widthFix"></image>
				<view class="double_title pad8">{{ item.product_name }}</view>
				<view class="double_price pad8">
					<view class="double_price_now" :style="{ color: theme.dzBaseColor }">
						<text class="double_rmb">{{ language.application.moneySymbol }}</text>
						<view class="double_num">{{ $api.helper.toFixed(item.product.price - (1 - $api.helper.toFloat(item.min_rate / 100)) * item.product.price, 2) }}</view>
					</view>
				</view>
				<view class="people pad8">{{ $api.helper.formatString(language.bargain.joinNumber, item.sales) }}</view>
			</view>
		</view>
		<view class="dz-p-t-10">
			<dz-empty v-if="productLoadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
			<dz-loadmore v-if="productLoadingStatus != 'nodata'" :status="productLoadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
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
.double {
	display: flex;
	padding: 10rpx 20rpx;
	justify-content: space-between;
	flex-wrap: wrap;

	.double_item {
		width: 49%;
		padding-bottom: 16rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		margin-bottom: 10rpx;

		image {
			width: 100%;
			height: 354rpx;
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
			color: $dz-tips-color;
			font-size: 24rpx;
		}
	}
}
</style>
