<template>
	<view>
		<dz-navbar :title="'评价'" :borderBottom="false"></dz-navbar>
		<dz-tabs
			:list="list"
			:current="current"
			:is-scroll="false"
			bar-height="8"
			:active-color="theme.dzBaseColor"
			style="position: fixed;width: 100%; z-index: 3;"
			@change="tabChange"
		></dz-tabs>
		<view class="content">
			<block v-for="(item, index) in productList" :key="index">
				<view class="order-item">
					<view class="product" @tap="toOrderDetail(item)">
						<view class="image"><dz-image :src="item.product_picture" borderRadius="10" width="170" height="170"></dz-image></view>
						<view class="right">
							<view class="right-l">
								<view class="title">{{ item.product_name }}</view>
								<view class="price-box">
									<view>￥{{ item.product_money }}</view>
									<view>x{{ item.num }}</view>
								</view>
							</view>
							<view class="right-r">{{ item.sku_name || '默认款' }}</view>
						</view>
					</view>
					<view class="footer">
						<view class="time">发货时间: {{ item.created_at | timeFormat }}</view>
						<view>
							<dz-button
								v-if="current == 0 && parseInt(item.is_evaluate) == 0"
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
								:border="false"
								hover-class="none"
								size="mini"
								shape="circle"
								@click="toEvaluation(item)"
							>
								去评论
							</dz-button>
							<dz-button
								v-if="current == 1 && parseInt(item.is_evaluate) == 1"
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
								hover-class="none"
								:border="false"
								size="mini"
								shape="circle"
								@click="toEvaluation(item, 'add')"
							>
								写追论
							</dz-button>
							<dz-button
								v-if="current == 1 && item.is_evaluate == 2"
								type="info"
								:border="false"
								:disabled="true"
								size="mini"
								shape="circle"
								:custom-style="{ width: '120rpx', marginLeft: '20rpx', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
							>
								已评论
							</dz-button>
							<dz-button
								v-if="current == 1 || parseInt(item.is_evaluate) == 2"
								type="info"
								size="mini"
								hoverClass="none"
								:border="false"
								shape="circle"
								:custom-style="{ width: '120rpx', marginLeft: '20rpx', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
								@click="toEvaluationDetail(item)"
							>
								查看评论
							</dz-button>
						</view>
					</view>
				</view>
			</block>
			<dz-empty v-if="evaluationLoadingStatus == 'noData'" margin-top="80" :text="evaluationTip" :src="emptyOrder" iconSize="360"></dz-empty>
			<view v-if="evaluationLoadingStatus != 'noData'" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore margin-top="20" :status="loadingStatus"></dz-loadmore></view>
		</view>
		<shop-product-recommend :list="guessYouLikeList" :theme="theme"></shop-product-recommend>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<view v-if="isStatus" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			empty: this.$api.assetsConfig.empty,
			list: [
				{
					name: '待评价'
				},
				{
					name: '已评价'
				}
			],
			current: 0,
			orderId: '',
			productList: [],
			loadingStatus: '',
			page: 1,
			guessYouLikeList: [],
			evaluationTip: '暂无待评论商品',
			pageEvaluation: 1,
			evaluationLoadingStatus: '',
			isStatus: false
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '评价'
		});
		await this.$onLaunched;
		uni.$on('evaluationStatus', data => {
			this.page = 0;
			this.productList.length = 0;
			this.getOrderProductIndex();
		});
		this.orderId = option.id;
		this.getOrderProductIndex();
	},
	onUnload() {
		uni.$off(['evaluationStatus']);
	},
	onReachBottom() {
		if (this.productList.length < this.$api.appConfig.pageSize && this.orderId) {
			if (this.loadingStatus == 'nomore') return;
			this.isStatus = true;
			this.loadingStatus = 'loading';
			this.page++;

			this.getGuessYouLikeList();
		} else {
			if (this.evaluationLoadingStatus == 'nomore') return;
			this.pageEvaluation++;
			this.getOrderProductIndex();
		}
	},
	methods: {
		tabChange(e) {
			this.current = e;
			this.pageEvaluation = 1;
			this.productList.length = 0;
			this.evaluationTip = parseInt(this.current) == 0 ? '暂无待评论商品' : '暂无已评论商品';
			this.getOrderProductIndex();
			if (this.orderId) {
				this.page = 1;
				this.isStatus = false;
				this.guessYouLikeList.length = 0;
			}
		},
		async getOrderProductIndex() {
			this.evaluationLoadingStatus = 'loading';
			let params = {};
			params.order_status = '3,4';
			params.is_evaluate = this.current;
			if (params.is_evaluate == 1) {
				params.is_evaluate = params.is_evaluate + ',2';
			}
			if (this.orderId) {
				params.order_id = this.orderId;
			}
			this.$api.http
				.get(this.$api.apiShop.orderProductIndex, {
					params: {
						page: this.pageEvaluation,
						...params,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.evaluationLoadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.productList = [...this.productList, ...res.data];
					if (this.pageEvaluation == 1 && res.data.length == 0) {
						this.evaluationLoadingStatus = 'noData';
						if (this.orderId) {
							console.log('11');
							this.loadingStatus = 'loading';
							this.getGuessYouLikeList();
						}
					} else {
						if (this.orderId) {
							console.log('11');
							this.loadingStatus = 'loading';
							this.getGuessYouLikeList();
						}
					}
				})
				.catch(err => {
					this.evaluationLoadingStatus = 'loadmore';
				});
		},
		async getGuessYouLikeList() {
			await this.$api.http
				.get(this.$api.apiShop.guessYouLikeList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.guessYouLikeList = [...this.guessYouLikeList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
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
		// 订单详情
		toOrderDetail(item) {
			if (this.current == 0) {
				console.log(item);
				this.$api.router.push({
					route: this.$api.routesConfig.orderDetail,
					query: {
						id: item.order_id
					}
				});
			} else {
				this.toEvaluationDetail(item);
			}
		},
		// 去评论
		toEvaluation(item, type) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluation,
				query: {
					data: JSON.stringify(item),
					type: type
				}
			});
		},
		// 查看评论
		toEvaluationDetail(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluationDetail,
				query: {
					order_id: item.order_id,
					product_id: item.id
				}
			});
		},
		toProductDetail(item) {
			if (parseInt(item.product_status) == 0)
				return this.$refs.dzToast.show({
					title: this.$api.language.user.productTheShelves,
					type: 'warning'
				});
			let url;
			if (item.marketing_type && item.marketing_type != 0) {
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
					id: item.id
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	margin-top: 88rpx;
	padding: 20rpx;
}
.order-item {
	margin-bottom: 20rpx;
	padding: 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
}
.product {
	display: flex;

	.image {
		flex-shrink: 0;
		width: 170rpx;
		height: 170rpx;
		border-radius: 10rpx;
	}
	.right {
		margin-left: 20rpx;
		flex: 1;
		.right-l {
			display: flex;
			justify-content: space-between;
			.title {
				line-height: 40rpx;
				color: $dz-main-color;
				font-size: 28rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.price-box {
				margin-left: 10rpx;
				text-align: right;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
		.right-r {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: $dz-content-color;
		}
	}
}
.footer {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 30rpx;
	.time {
		font-size: 24rpx;
		color: $dz-tips-color;
	}
}
</style>
