<template>
	<view class="three-line" :style="{ margin: `${topBottom}rpx ${leftRight - clearance / 2}rpx ${topBottom - clearance}rpx` }">
		<dz-row :gutter="clearance">
			<dz-col v-for="(item, index) in list" :key="index" :span="4">
				<view class="item" :style="{ marginBottom: clearance + 'rpx' }" @tap="productTab(item.id)">
					<dz-image :src="item.picture" width="100%" :height="(width - leftRight * 2 - clearance * 2) / 3"></dz-image>
					<view class="center-view">
						<view class="name dz-line-2 dz-font-24" :style="{ width: `${(width - leftRight * 2 - clearance * 2) / 3 - 24}rpx` }">
							<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>
							{{ item.name }}
						</view>
						<view class="dz-line-1 dz-m-t-20">
							<text class="dz-font-24" :style="{ color: theme.dzBaseColor }">￥</text>
							<text class="dz-font-28 dz-font-weight" :style="{ color: theme.dzBaseColor }">{{ currentPrice(item) }}</text>
							<text v-if="marketPriceShow == 1 && item.market_price" style="text-decoration: line-through; transform: scale(0.8);color: #999">
								<text class="dz-font-24">￥</text>
								<text class="dz-font-24 ">{{ $api.helper.toFloat(item.market_price).toFixed(2) }}</text>
							</text>
						</view>
					</view>
				</view>
			</dz-col>
		</dz-row>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
import assetsConfig from '@/core/config/assetsConfig';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			width: 750
		};
	},
	props: {
		// 商品
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		theme: {
			type: Object,
			default() {
				return {};
			}
		},
		// 是否显示标签  比如: 分销商品,预售商品等
		isTag: {
			type: Boolean,
			default: false
		},
		radius: {
			type: [String, Number],
			default: 0
		},
		// 左右边距
		leftRight: {
			type: [String, Number],
			default: 0
		},
		// 上下边距
		topBottom: {
			type: [String, Number],
			default: 0
		},
		defaultList: {
			type: Array,
			default() {
				return [];
			}
		},
		dataSource: {
			type: String,
			default: 'default'
		},
		// 是否显示划线价格
		marketPriceShow: {
			type: [String, Number],
			default: 1
		},
		// 井模式缝隙
		clearance: {
			type: Number,
			default: 12
		}
	},
	filters: {
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}w`;
			}
			return val;
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	mounted() {
		this.width = systemInfo && systemInfo.safeArea.windowWidth ? systemInfo.safeArea.windowWidth * 2 : 750;
	},
	methods: {
		// 计算价格
		currentPrice(item) {
			let price = item.price;
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
				price = skus.length ? this.get_min(skus) : item.price;
			}
			if (item.memberDiscount && parseFloat(item.memberDiscount.discount) > 0) {
				//会员折扣
				price = parseFloat(price * (1 - parseFloat(item.memberDiscount.discount) / 100)).toFixed(2);
			}
			return parseFloat(price).toFixed(2);
		},
		diyPicture(index) {
			let picture = this.list[index].picture;
			if (this.defaultList.length && this.defaultList[index].picture) {
				picture = this.defaultList[index].diyPicture ? this.defaultList[index].diyPicture : this.list[index].picture;
			}
			return picture;
		},
		get_min(list) {
			return Math.min.apply(
				Math,
				list.map(item => {
					return parseFloat(item);
				})
			);
		},
		productTab(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id: id
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cart {
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	width: 52rpx;
	height: 52rpx;
}
.three-line {
	.item {
		overflow: hidden;
		background: #fff;
		border-radius: 18rpx;
		.center-view {
		
			
			padding: 6rpx 12rpx 12rpx;
			.name {
					height: 64rpx;
					line-height: 32rpx;
			}
		}
	}
}
</style>
