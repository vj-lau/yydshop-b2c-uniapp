<template>
	<view class="product-box">
		<dz-title :title="title" mode="line" :barColor="theme.dzBaseDisabled" v-if="list.length > 0"></dz-title>
		<view class="product-list dz-m-t-10">
			<view class="product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<view class="product-item" v-if="(index + 1) % 2 !== 0" @tap="toProductDetail(item)">
						<image :src="item.picture" mode="widthFix"></image>
						<view class="price-text"><dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>{{ item.name }}</view>

					<!-- 	<dz-tag
							v-if="item.marketing_type && item.marketing_type != 0"
							:bg-color="theme.dzBaseColor"
							:color="theme.dzBaseFontColor"
							size="mini"
							mode="dark"
							style="margin:0 0 10rpx 10rpx;"
						>
							{{ marketingType(item.marketing_type) }}
						</dz-tag> -->
						<view style="height: 46rpx;"></view>
						<view class="price-box" :style="{ color: theme.dzBaseColor }">
							<span class="price-l">{{ language.application.moneySymbol }}</span>
							<span class="price-r">{{ currentPrice(item) }}</span>
							<span v-if="item.market_price" class="price-tip">{{ language.application.moneySymbol }}{{ $api.helper.toFloat(item.market_price).toFixed(2) }}</span>
						</view>
					</view>
				</block>
			</view>
			<view class="product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<view class="product-item" v-if="(index + 1) % 2 === 0" :key="index" @tap="toProductDetail(item)">
						<image :src="item.picture" mode="widthFix"></image>
						<view class="price-text">{{ item.name }}</view>

						<!-- <dz-tag
							v-if="item.marketing_type && item.marketing_type != 0"
							:bg-color="theme.dzBaseColor"
							:color="theme.dzBaseFontColor"
							size="mini"
							mode="dark"
							style="margin:0 0 10rpx 10rpx;"
						>
							{{ marketingType(item.marketing_type) }}
						</dz-tag> -->
						<view  style="height: 46rpx;"></view>
						<view class="price-box" :style="{ color: theme.dzBaseColor }">
							<span class="price-l">{{ language.application.moneySymbol }}</span>
							<span class="price-r">{{ currentPrice(item) }}</span>
							<span v-if="item.market_price" class="price-tip">{{ language.application.moneySymbol }}{{ $api.helper.toFloat(item.market_price).toFixed(2) }}</span>
						</view>
					</view>
				</block>
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	props: {
		// 列表
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		title: {
			type: String,
			default: '为你推荐'
		},
		theme: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			language: this.$api.language
		};
	},
	computed:{
		...mapState(['userInfo'])
	},
	methods: {
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
		// 计算价格
		currentPrice(item) {
			let price = item.price;
			// 云仓分销进货价格
			let level_id = this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id || ''
			if(item.warehouseCommissionRate && item.warehouseCommissionRate.is_distribution == 1 && level_id) {
				let commission_rate  = item.warehouseCommissionRate.commission_rate
				let skus = []
				for(let key in commission_rate) {
					if(commission_rate[key][level_id] && parseFloat(commission_rate[key][level_id].brokerage) > 0) {
						skus.push(commission_rate[key][level_id].brokerage)
					}
					
				}
				price = skus.length ? this.get_min(skus) : item.price
			}
			if (item.memberDiscount && parseFloat(item.memberDiscount.discount) > 0) {
				//会员折扣
				price = parseFloat(price * (1 - parseFloat(item.memberDiscount.discount) / 100)).toFixed(2);
			}
			return price;
		},
		get_min (list){
		       return Math.min.apply(Math,list.map(item => { return parseFloat(item) }))
		},
		toProductDetail(item) {
			if (parseInt(item.product_status) == 0)
				return this.$refs.dzToast.show({
					title: this.$api.language.user.productTheShelves,
					type: 'warning'
				});
			let url = 'product';
			// if (item.marketing_type && item.marketing_type != 0) {
			// 	if (item.marketing_type == 'group_buy') {
			// 		url = 'groupProduct';
			// 	} else {
			// 		url = `${item.marketing_type}Product`;
			// 	}
			// } else {
			// 	url = 'product';
			// }
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: item.id
				}
			});
		}
	}
};
</script>

<style lang="scss">
.product-list {
	padding: 0 20rpx;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;

	.product-list-container {
		flex: 1;
		margin-right: 20rpx;
	}
	.product-list-container:last-child {
		margin-right: 0;
	}
	.product-item {
		width: 100%;
		background-color: #fff;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
		image {
			width: 100%;
			display: block;
		}
		.price-box {
			padding: 0 10rpx 10rpx 10rpx;
			.price-l {
				font-size: 24rpx;
			}
			.price-r {
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.price-text {
			margin: 10rpx;
			height: 64rpx; //这里的高度必须为line-height*显示行数
			color: $dz-main-color;
			font-size: 26rpx;
			line-height: 32rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.price-price {
			font-size: 24rpx;
			color: $dz-main-color;
		}
		.price-tip {
			font-size: 24rpx;
			color: $dz-tips-color;
			text-decoration: line-through;
			margin-left: 10rpx;
		}
	}
}
</style>
