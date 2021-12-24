<template>
	<view
		class="dz-product-list"
		:class="[isList ? 'dz-product-bg-list' : '']"
		:style="{
			margin: `${topBottom}rpx ${leftRight}rpx`,

			borderRadius: isList ? `${radius}rpx` : '',
			overflow: 'hidden'
		}"
	>
		<view class="dz-product-list-container" :style="{ marginRight: isList ? 0 : '20rpx' }">
			<block v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view
					v-if="(index + 1) % 2 !== 0 || isList"
					class="dz-product-item"
					@tap.stop="productTab(item.id)"
					:class="[isList ? 'dz-product-flex-list' : '']"
					hover-class="hover"
					:hover-start-time="150"
				>
					<view class="dz-product-image-wrapper">
						<image :src="item.picture" :mode="isList ? 'aspectFill' : 'widthFix'" :preview="false" :class="[isList ? 'dz-product-list-img' : 'dz-product-img']"></image>
						<view class="triangle-wrapper"><image class="triangle-tag" :src="item | filterTagName"></image></view>
					</view>
					<view class="dz-pro-content" v-if="item" :style="{ marginRight: isList ? 0 : '10rpx' }">
						<view class="dz-pro-tit">
							<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>
							<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="virtualProduct" v-if="parseInt(item.is_virtual) === 1"></dz-icon>
							{{ item.name }}
						</view>
						<view>
							<view class="dz-pro-price">
								<text class="dz-sale-price" :style="{ color: theme.dzBaseColor }" :class="[parseInt(item.point_exchange_type) > 2 ? '' : 'dz-font-price']">
									{{ parseInt(item.point_exchange_type) > 2 ? item.point_exchange + language.shopProductList.point : currentPrice(item) }}
								</text>
								<text class="dz-factory-price dz-font-price" v-if="marketPriceShow == 1 && item.market_price">
									{{ $api.helper.toFloat(item.market_price).toFixed(2) }}
								</text>
							</view>
							<view class="dz-pro-pay" v-if="item">
								<text>
									<text :style="{ color: theme.dzBaseColor }">{{ item.total_sales | filterTotalSales }}</text>
									{{ language.shopProductList.paidNumber }}
								</text>
								<!-- <text @tap.stop="toggleSpec(item)" class="iconfont dzicon-iconfont dzicon-cart" :style="{ color: theme.dzBaseColor }"></text> -->
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
				</view>
				<!--商品列表-->
			</block>
		</view>
		<view class="dz-product-list-container" v-if="!isList" style="margin-right: 0;">
			<block v-for="(item, index) in list" :key="index">
				<!--商品列表-->
				<view
					v-if="(index + 1) % 2 === 0"
					class="dz-product-item"
					@tap.stop="productTab(item.id)"
					:class="[isList ? 'dz-product-flex-list' : '']"
					hover-class="hover"
					:hover-start-time="150"
				>
					<view class="dz-product-image-wrapper">
						<image :src="item.picture" :mode="isList ? 'aspectFill' : 'widthFix'" :preview="false" :class="[isList ? 'dz-product-list-img' : 'dz-product-img']"></image>
						<view class="triangle-wrapper" v-if="item.shipping_type === '1' || item.is_virtual === '1' || item.commissionRate || item.is_open_presell === '1'">
							<image class="triangle-tag" :src="item | filterTagName"></image>
						</view>
					</view>
					<view class="dz-pro-content" v-if="item">
						<view class="dz-pro-tit">
							<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>
							<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="virtualProduct" v-if="parseInt(item.is_virtual) === 1"></dz-icon>
							{{ item.name }}
						</view>
						<view>
							<view class="dz-pro-price">
								<text class="dz-sale-price" :style="{ color: theme.dzBaseColor }" :class="[parseInt(item.point_exchange_type) > 2 ? '' : 'dz-font-price']">
									{{ parseInt(item.point_exchange_type) > 2 ? item.point_exchange + language.shopProductList.point : currentPrice(item) }}
								</text>
								<text class="dz-factory-price dz-font-price" v-if="marketPriceShow == 1 && item.market_price">
									{{ $api.helper.toFloat(item.market_price).toFixed(2) }}
								</text>
							</view>
							<view class="dz-pro-pay" v-if="item">
								<text>
									<text :style="{ color: theme.dzBaseColor }">{{ item.total_sales | filterTotalSales }}</text>
									{{ language.shopProductList.paidNumber }}
								</text>
								<!-- <text @tap.stop="toggleSpec(item)" :style="{ color: theme.dzBaseColor }" class="iconfont dzicon-iconfont dzicon-cart"></text> -->
							</view>
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
				<!--商品列表-->
			</block>
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
		// 列表
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 是否以列表展示 | 列表或大图
		isList: {
			type: Boolean,
			default: false
		},
		theme: {
			type: Object,
			default() {
				return {};
			}
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
		}
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
		productTab(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id: id
				}
			});
		},

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
				price = parseFloat(price * (1 - parseFloat(item.memberDiscount.discount) / 100));
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
.dz-product-list {
	// background-color: $dz-bg-color;
	// padding: 0 20rpx;
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
	.dz-product-list-container {
		flex: 1;
		margin-right: 20rpx;
	}
	.dz-product-list-container:last-child {
		margin-right: 0rpx !important;
	}
	.dz-product-item {
		width: 100%;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
		// border: 0px solid black;
	}
	.dz-product-list-item {
		// width: 48vw;
		width: 100%;
		box-sizing: border-box;
	}
	.dz-product-flex-list {
		width: 100%;
		display: flex;
		// margin-bottom: 10rpx !important;
		padding: 20rpx 0 2rpx !important;
	}
	.dz-product-image-wrapper {
		// border-radius: 6rpx;
		overflow: hidden;
		position: relative;

		flex-shrink: 0;
		.dz-product-img {
			// width: calc(50vw - 20rpx);
			// height: calc(50vw - 20rpx) !important;
			width: 100%;
			// border-radius: 12rpx;
			display: block;
		}
		.dz-product-list-img {
			border-radius: 19rpx;
			// width: 400rpx;
			// height: 240rpx !important;
			width: 252rpx;
			height: 252rpx !important;
			display: block;
			flex-shrink: 0;
			background-color: $dz-bg-color;
		}
		.sketch {
			width: 100%;
			background-color: rgba(0, 0, 0, 0.4);
			position: absolute;
			border-bottom-left-radius: 6rpx;
			bottom: 0;
			padding: 0 8rpx;
			right: 0;
			color: #fff;
			font-size: 24rpx;
		}
		.triangle-wrapper {
			border-top-left-radius: 6rpx;
			position: absolute;
			overflow: hidden;
			top: 0;
			left: 0;
			.triangle-tag {
				width: 64rpx;
				height: 64rpx;
			}
		}
	}
	.dz-pro-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		box-sizing: border-box;
		padding: 20rpx;
		.dz-pro-tit {
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
		.dz-pro-price {
			padding-top: 18rpx;
		}
		.dz-sale-price {
			font-size: 34rpx;
			font-weight: 500;
		}
		.dz-factory-price {
			font-size: 24rpx;
			color: $dz-tips-color;
			text-decoration: line-through;
			padding-left: 12rpx;
		}
		.dz-pro-pay {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: 10rpx;
			font-size: 24rpx;
			color: $dz-content-color;
			.iconfont {
				font-size: 38rpx;
				padding: 0 10rpx;
			}
		}
		.cart {
			position: absolute;
			right: 20rpx;
			bottom: 20rpx;
			width: 52rpx;
			height: 52rpx;
		}
	}
}

.dz-product-bg-list {
	padding: 4rpx 0rpx 2rpx 24rpx;
	background: #ffffff;
}
</style>
