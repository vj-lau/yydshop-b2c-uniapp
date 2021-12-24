<template>
	<view>
		<dz-navbar :title="language.profile.myCollection"></dz-navbar>
		<view class="content" v-if="collectList.length > 0">
			<view class="item" v-for="(item, index) in collectList" :key="index" @tap="toProductDetail(item)">
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
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" :text="language.user.noCollection" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
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
			empty: this.$api.assetsConfig.empty,
			loadingStatus: 'loading',
			page: 1,
			collectList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.myCollection
		});
		await this.$onLaunched;
		this.getCollectList();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		getCollectList() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.collectList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.collectList = [...this.collectList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					console.log(err);
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
		}
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getCollectList();
	}
};
</script>

<style lang="scss" scoped>
.item {
	display: flex;
	padding: 20rpx;
	background-color: #ffffff;
	border-bottom: 1rpx solid $dz-border-color;
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
				padding: 10rpx 0;
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
.item:last-child {
	border-bottom: 0px;
}
</style>
