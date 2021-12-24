<template>
	<view>
		<dz-navbar title="库存管理"></dz-navbar>
		<view v-if="currentNumber > 1" class="fixed-box dz-flex dz-row-center">每次最低进货数量是{{ currentNumber }}件</view>
		<view class="card-box " :class="currentNumber > 1 ? 'dz-m-t-80' : ''">
			<view class="card-item" v-for="(item, index) in porductList" :key="index">
				<view class="image"><dz-image :src="item.picture" width="180" height="180" border-radius="15"></dz-image></view>
				<view class="right">
					<view class="porduct-name">{{ item.name }}</view>
					<view class="sum">库存量: {{ stock(item.sku) }}件</view>
					<view class="btn-box dz-m-t-10">
						<dz-button
							size="mini"
							:custom-style="{
								width: '120rpx',
								height: '52rpx',
								lineHeight: '52rpx',
								background: '#fff',
								border: '1rpx solid rgba(0,0,0,0.12)',
								color: '#333',
								marginRight: '20rpx',
								fontSize: '26rpx'
							}"
							hover-class="none"
							shape="circle"
							:border="false"
							@click="toPageTap('incomingGoods', item)"
						>
							进货
						</dz-button>
						<dz-button
							size="mini"
							:border="false"
							:custom-style="{
								width: '120rpx',
								height: '52rpx',
								lineHeight: '52rpx',
								background: theme.dzBaseColor,
								color: theme.dzBaseFontColor,
								fontSize: '26rpx'
							}"
							hover-class="none"
							shape="circle"
							@click="toPageTap('pickUpGoods', item)"
						>
							提货
						</dz-button>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" text="暂无商品" margin-top="80" :src="emptyData" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-p-b-20"><dz-loadmore :status="loadingStatus" margin-bottom="20"></dz-loadmore></view>
		<dz-page-loading :show="loadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
		<!-- 规格弹窗 -->
		<dz-popup v-model="specShow" mode="bottom" border-radius="40" closeIcon="roundclose" closeIconSize="40" :closeable="true">
			<shop-attr-content :product="productDetail" :buyNumber="currentNumber" :currentMinMum="currentNumber" buttonName="确定" @confirm="attrConfirmClick"></shop-attr-content>
		</dz-popup>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyData: this.$api.assetsConfig.emptyData,
			porductList: [],
			loadingShow: false,
			pageLoadingStatus: 'loading',
			loadingStatus: 'loading',
			page: 1,
			specShow: false,
			currentSkuId: '',
			currentNumber: 1,
			productDetail: {}
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '库存记录'
		});
		uni.$on('orderGroupChange', data => {
			this.page = 1;
			this.porductList.length = 0;
			this.warehouseProduct();
		});
		this.warehouseProduct();
		if (this.userPromoter && this.userPromoter.promoterWarehouse && this.userPromoter.promoterWarehouse.warehouseLevel) {
			const min_purchase_num = this.userPromoter.promoterWarehouse.warehouseLevel.min_purchase_num;
			this.currentNumber = min_purchase_num > 0 ? min_purchase_num : 1;
		}
	},
	onUnload() {
		this.$off('orderGroupChange');
	},
	onPullDownRefresh() {
		this.page = 1;
		this.porductList.length = 0;
		this.loadingShow = true;
		this.warehouseProduct();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.warehouseProduct();
	},
	computed: {
		...mapState(['userPromoter'])
	},
	methods: {
		loadingClick() {
			this.warehouseProduct();
		},
		async warehouseProduct() {
			await this.$api.http
				.get(this.$api.apiDistribution.warehouseProduct, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
					this.loadingShow = false;
					this.porductList = [...this.porductList, ...res.data];
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
			uni.stopPullDownRefresh();
		},
		stock(sku) {
			let stock = 0;
			if (sku.length) {
				sku.forEach(item => {
					stock += item.warehouseProductStock ? parseInt(item.warehouseProductStock.user_stock) : 0;
				});
			}
			return stock;
		},
		//属性选择确认
		attrConfirmClick(data) {
			this.$api.router.push({
				route: this.$api.routesConfig.incomingGoods,
				query: {
					id: this.productDetail.id,
					minNum: this.currentNumber,
					...data
				}
			});
			this.specShow = false;
		},
		//获取商品详情
		async getProductDetail(row) {
			this.currentSkuId = row.sku_id;
			await this.$api.http
				.get(this.$api.apiDistribution.warehouseProductDetail, {
					params: {
						id: row.product_id
					}
				})
				.then(res => {
					let data = res.data;
					data.sku_data = row.sku_data;
					this.productDetail = data;
					this.specShow = true;
				});
		},
		toPageTap(url, val) {
			if (url == 'incomingGoods') {
				this.getProductDetail({
					sku_id: val.sku[0].id,
					sku_data: val.sku[0].data,
					number: 1,
					product_id: val.id
				});
				return;
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig[url],
					query: {
						id: val.id
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.fixed-box {
	position: fixed;
	width: 100%;
	height: 86rpx;
	padding: 0 20rpx;
	background: #fff7ec;
	color: #f90;
	z-index: 2;
}
.tip {
	text {
		margin-right: 10rpx;
		color: #333;
	}
	padding: 20rpx 20rpx 0 20rpx;
	color: rgb(250, 52, 52);
}
.card-box {
	padding: 20rpx;
}
.card-item {
	display: flex;
	padding: 20rpx;
	margin-bottom: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	.image {
		flex-shrink: 0;
		width: 180rpx;
		height: 180rpx;
		margin-right: 20rpx;
		border-radius: 10rpx;
		background: $dz-bg-color;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.porduct-name {
			height: 80rpx;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.sum {
			color: #999;
		}
		.btn-box {
			width: 260rpx;
			margin-left: auto;
		}
	}
}
</style>
