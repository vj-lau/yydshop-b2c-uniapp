<template>
	<view class="product-box">
		<view
			class="product-item"
			v-for="(item, index) in list"
			:key="index"
			@tap="productTab(item.id)"
			:style="{
				margin: `${topBottom}rpx ${leftRight}rpx`,
				borderRadius: `${radius}rpx`,
				overflow: 'hidden'
			}"
		>
			<view class="image" :style="{ height: dataSource == 'manual' ? `${maxHeight}rpx` : '320rpx' }">
				<dz-image :src="dataSource == 'manual' ? diyPicture(index) : item.picture" width="100%" :height="dataSource == 'manual' ? maxHeight : 320"></dz-image>
			</view>
			<view class="dz-p-20 dz-relative">
				<view class="flex">
					<view class="name dz-line-2"><dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>{{ item.name }}</view>
					<view class="sum">{{ item.total_sales }}人购买</view>
				</view>
				<view class="tip">{{ item.sketch }}</view>
				<view>
					<text class="dz-font-price  dz-font-34 dz-font-weight-light" :style="{ color: theme.dzBaseColor }">{{ currentPrice(item) }}</text>
					<text  v-if="marketPriceShow == 1 && item.market_price" style="margin-left:12rpx; text-decoration: line-through;font-size: 24rpx; color: #999"> 
               
               
              
                ￥{{ $api.helper.toFloat(item.market_price).toFixed(2) }}
             </text>
					<dz-tag
						class="dz-m-l-10"
						:bg-color="theme.dzBaseColor"
						:border-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						:show="item.is_commission_product == 1"
						mode="dark"
						size="mini"
						text="升级产品"
					></dz-tag>
					<dz-tag
						class="dz-m-l-10"
						:bg-color="theme.dzBaseColor"
						:border-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						:show="item.is_open_presell == 1"
						mode="dark"
						size="mini"
						text="预售"
					></dz-tag>
					<dz-tag
						class="dz-m-l-10"
						:bg-color="theme.dzBaseColor"
						:border-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						:show="item.min_buy > 1"
						mode="dark"
						size="mini"
						:text="`${item.min_buy}件起售`"
					></dz-tag>
					<dz-tag
						class="dz-m-l-10"
						:bg-color="theme.dzBaseColor"
						:border-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						:show="item.max_buy > 0"
						mode="dark"
						size="mini"
						:text="`限购${item.max_buy}件`"
					></dz-tag>
					<dz-tag
						class="dz-m-l-10"
						:bg-color="theme.dzBaseColor"
						:border-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						:show="item.give_point > 0"
						mode="dark"
						size="mini"
						text="赠送积分"
					></dz-tag>
					<dz-tag
						class="dz-m-l-10"
						:bg-color="theme.dzBaseColor"
						:border-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						:show="item.max_use_point > 0"
						mode="dark"
						size="mini"
						text="积分抵现"
					></dz-tag>
				</view>
				<view
					v-if="cart.status == 1"
					class="cart dz-flex dz-row-center"
					:style="{
						background: cart.color,
						borderRadius: `${cart.radius * 2}rpx`
					}"
					@tap.stop="toggleSpec(item)"
				>
					<dz-icon :name="cart.type == 'add' ? 'add2' : 'cart'" color="#fff" :size="36"></dz-icon>
				</view>
			</view>
		</view>
		<!-- 规格弹窗 -->
		<dz-popup v-model="specShow" mode="bottom" border-radius="40" closeIcon="roundclose" closeIconSize="40" :closeable="true">
			<shop-attr-content :product="productDetail" :buyNumber="currentNumber" buttonName="加入购物车" @confirm="attrConfirmClick"></shop-attr-content>
		</dz-popup>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import assetsConfig from '@/core/config/assetsConfig';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			specShow: false,
			currentNumber: 1,
			currentSkuId: '',
			currentSkuNumber: '',
			productDetail: {}
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
		// 上下边距
		maxHeight: {
			type: [String, Number],
			default: 0
		},
		cart: {
			type: Object,
			default() {
				return {};
			}
		},
		// 是否显示划线价格
		marketPriceShow: {
			type: [String, Number],
			default: 1
		},
	},
	filters: {
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}w`;
			}
			return val;
		},
		filterTagName(val) {
			if (val.commissionRate) {
				// 分销商品
				return assetsConfig.distribution;
			} else if (parseInt(val.is_open_presell) === 1) {
				// 预售商品
				return assetsConfig.presale;
			} else if (parseInt(val.is_virtual) === 1) {
				// 虚拟产品
				return assetsConfig.virtual;
			} else if (parseInt(val.shopping_type) === 1) {
				// 包邮产品
				return assetsConfig.pinkage;
			}
			// else if(parseInt(val.is_open_member_discount) === 1){

			// }
		}
	},
	computed: {
		...mapState(['userInfo'])
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
					if (commission_rate[key][level_id] &&  parseFloat(commission_rate[key][level_id].brokerage) > 0) {
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
		},
		//打开属性选择
		toggleSpec(row) {
			if (parseInt(row.status) === 0) {
				this.$refs.dzToast.show({
					title: this.$api.language.cart.notSale,
					type: 'warning'
				});
				return;
			}
			if (!this.$api.store.getters.hasLogin) {
				this.$api.router.push({
					route: this.$api.routesConfig.login
				});
				return;
			}
			this.$api.throttle(() => {
				this.getProductDetail(row);
			}, 500);
		},
		//属性选择确认
		attrConfirmClick(data) {
			this.currentSkuId = data.skuId;
			this.currentSkuNumber = data.skuNumber;
			this.addToCart();
		},
		//获取商品详情
		async getProductDetail(row) {
			this.currentSkuId = row.sku_id;
			this.currentNumber = row.number;
			
			await this.$api.http
				.get(this.$api.apiShop.productDetail, {
					params: {
						id: row.product_id || row.id
					}
				})
				.then(res => {
					let data = res.data;
					data.sku_name = row.sku_name;
					data.sku_data = res.data.sku.length ? res.data.sku[0].data : '';
					this.productDetail = data;
					this.specShow = true;
				});
		},
		//加入购物车
		async addToCart() {
			if (!this.$api.store.getters.hasLogin) {
				this.$api.router.push({
					route: this.$api.routesConfig.login
				});
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});

				return;
			}
			await this.$api.http
				.post(this.$api.apiShop.cartItemCreate, {
					sku_id: this.currentSkuId,
					num: this.currentSkuNumber
				})
				.then(() => {
					this.$refs.dzToast.show({
						title: this.$api.language.product.addToCartSuccess,
						type: 'success'
					});
					this.specShow = false;
					//购物车页面打开的情况下发送事件
					if (this.$api.store.state.cartPageListen) {
						uni.$emit('cartNumChange', {});
					} else {
						this.getCartCount();
					}
				});
		},
		//获取购物车数量
		async getCartCount() {
			this.$api.http.get(this.$api.apiShop.cartItemCount).then(res => {
				this.$api.store.commit('setCartNum', res.data);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.product-box {
	.product-item {
		background: #fff;
		.image {
			width: 100%;
			height: 320rpx;
		}
		.flex {
			display: flex;
			justify-content: space-between;

			.sum {
				flex-shrink: 0;
				margin-left: 10rpx;
				font-size: 26rpx;
				color:rgba(0, 0, 0, 0.6);
			}
		}
		.name {
			font-size: 26rpx;
			
			color: rgba(0, 0, 0, 0.8);
		}
		.tip {
			padding: 10rpx 0;
			font-size: 26rpx;
			color: #999;
		}
	}
}
.cart {
	position: absolute;
	right: 20rpx;
	bottom: 20rpx;
	width: 52rpx;
	height: 52rpx;
}
</style>
