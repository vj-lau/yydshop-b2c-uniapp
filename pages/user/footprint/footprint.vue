<template>
	<view>
		<dz-navbar :title="language.user.footprintTitle"></dz-navbar>
		<view class="content">
			<view v-for="(item, index) in footprintList" :key="index">
				<dz-swipe-action
					style="border-bottom: 1rpx solid #f3f3f3;"
					:index="index"
					:show="item.show"
					:key="item.id"
					:options="actionOptions"
					@click="actionClick(item.id, index)"
					@open="open"
				>
					<view class="item" @tap="toProductDetail(item)">
						<view class="img">
							<view class="image"><dz-image :src="item.product.picture" borderRadius="10" width="180" height="180"></dz-image></view>
							<view class="status" v-if="parseInt(item.product.product_status) == 0">{{ language.user.theShelves }}</view>
						</view>
						<view class="right">
							<view class="name">
								<view class="title">
									<dz-icon
										class="dz-m-r-10"
										:color="theme.dzBaseColor"
										name="memberDiscount"
										v-if="item.memberDiscount && item.memberDiscount.discount && item.memberDiscount.discount > 0"
									></dz-icon>
									{{ item.product.name }}
								</view>
								<view class="tip" v-if="item.marketing_type">
									<dz-tag :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" size="mini" mode="dark">{{ marketingType(item.marketing_type) }}</dz-tag>
								</view>
							</view>
							<view class="price-box" :style="{ color: theme.dzBaseColor }">
								<view class="icon">{{ language.application.moneySymbol }}</view>
								<view class="price">{{ currentPrice(item) }}</view>
							</view>
						</view>
					</view>
				</dz-swipe-action>
			</view>
			<dz-empty v-if="loadingStatus == 'noData'" :text="language.user.record" margin-top="80" :src="emptyFootprint" iconSize="360"></dz-empty>
			<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		</view>
		<shop-product-recommend :list="guessYouLikeList" title="猜你喜欢" :theme="theme"></shop-product-recommend>
		<dz-empty v-if="loadingStatus == 'noData' && loadingProductStatus == 'noData' && footprintList.length == 0" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore
			v-if="loadingStatus == 'noData' && loadingProductStatus != 'noData' && footprintList.length == 0"
			:status="loadingProductStatus"
			margin-top="20"
			margin-bottom="20"
		></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			emptyFootprint: this.$api.assetsConfig.emptyFootprint,
			empty: this.$api.assetsConfig.empty,
			page: 1,
			loadingStatus: 'loading',
			footprintList: [],
			actionOptions: [
				{
					text: this.$api.language.application.delete,
					style: {
						backgroundColor: this.$api.theme.dzTypeError
					}
				}
			],
			loadingProductStatus: null,
			guessYouLikeList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({ title: this.$api.language.user.footprintTitle });
		await this.$onLaunched;
		this.getFootprint();
	},
	computed: {
		...mapState(['userInfo'])
	},
	onReachBottom() {
		if (this.footprintList.length > 0) {
			if (this.loadingStatus == 'nomore') return;
			this.page++;
			this.getFootprint();
		} else {
			if (this.loadingProductStatus == 'nomore') return;
			this.page++;
			this.getGuessYouLikeList();
		}
	},
	methods: {
		getFootprint() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.footPrintList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					res.data.forEach(item => {
						item.show = false;
					});
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.footprintList = [...this.footprintList, ...res.data];
					if (this.page == 1 && res.data.length === 0) {
						this.loadingStatus = 'noData';
						this.getGuessYouLikeList();
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
		},
		// 计算价格
		currentPrice(item) {
			let price = item.product.minPriceSku.price;
			// 云仓分销进货价格
			let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
			if (item.warehouseCommissionRate && item.warehouseCommissionRate.is_distribution == 1 && level_id) {
				let commission_rate = item.warehouseCommissionRate.commission_rate;
				let skus = [];
				for (let key in commission_rate) {
					if (commission_rate[key][level_id] && parseFloat(commission_rate[key][level_id].brokerage) > 0) {
						skus.push(commission_rate[key][level_id].brokerage);
					}
				}
				price = skus.length ? this.get_min(skus) : item.product.minPriceSku.price;
			}
			if (item.memberDiscount && parseFloat(item.memberDiscount.discount) > 0) {
				//会员折扣
				price = parseFloat(price * (1 - parseFloat(item.memberDiscount.discount) / 100)).toFixed(2);
			}
			return parseFloat(price).toFixed(2);
		},
		get_min(list) {
			return Math.min.apply(
				Math,
				list.map(item => {
					return parseFloat(item);
				})
			);
		},
		marketingType(val) {
			let type;
			switch (val) {
				case 'bargain':
					type = this.language.user.bargain;
					break;
				case 'discount':
					type = this.language.user.discount;
					break;
				case 'wholesale':
					type = this.language.user.wholesale;
					break;
				case 'group_buy':
					type = this.language.user.group;
					break;
			}
			return type;
		},
		open(index) {
			this.footprintList[index].show = true;
			this.footprintList.map((val, key) => {
				if (index != key) this.footprintList[key].show = false;
			});
		},
		// 删除商品
		actionClick(id, index) {
			this.$api.http
				.delete(
					this.$api.apiShop.footPrintDel,
					{},
					{
						params: {
							id
						}
					}
				)
				.then(res => {
					this.footprintList.splice(index, 1);
					this.$refs.dzToast.show({
						title: this.$api.language.user.delProduct,
						type: 'success'
					});
					if (this.footprintList.length == 0) {
						this.loadingStatus = 'noData';
						this.page = 1;
						this.getGuessYouLikeList();
					}
				});
		},
		toProductDetail(item) {
			if (parseInt(item.product.product_status) == 0)
				return this.$refs.dzToast.show({
					title: this.$api.language.user.productTheShelves,
					type: 'warning'
				});
			let url;
			if (item.marketing_type) {
				if (item.marketing_type == 'group_buy') {
					url = 'groupProduct';
				} else {
					url = `${item.marketing_type}Product`;
				}
			} else {
				url = 'product';
			}
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: item.product.minPriceSku.product_id
				}
			});
		},
		async getGuessYouLikeList() {
			this.loadingProductStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.guessYouLikeList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingProductStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.guessYouLikeList = [...this.guessYouLikeList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingProductStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingProductStatus = 'loadmore';
					console.log(err);
				});
		}
	}
};
</script>

<style lang="scss">
.item {
	display: flex;
	padding: 20rpx;
	background-color: #ffffff;
	.img {
		flex-shrink: 0;
		width: 180rpx;
		height: 180rpx;
		border-radius: 10rpx;
		position: relative;
		overflow: hidden;
		.image {
			width: 180rpx;
			height: 180rpx;
			background-color: $dz-bg-color;
		}
		.status {
			position: absolute;
			width: 100%;
			padding: 10rpx 0;
			text-align: center;
			background-color: rgba(0, 0, 0, 0.6);
			bottom: 0;
			z-index: 2;
			font-size: 28rpx;
			color: #fff;
		}
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 20rpx;
		.name {
			.title {
				width: 510rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 28rpx;
				color: $dz-main-color;
			}
			.tip {
				width: 510rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
		.price-box {
			display: flex;
			align-items: center;
			.icon {
				font-size: 24rpx;
			}
			.price {
				font-size: 32rpx;
			}
		}
	}
}
</style>
