<template>
	<view>
		<dz-navbar :title="'售后主页'" :borderBottom="false"></dz-navbar>
		<dz-tabs
			:list="list"
			:current="current"
			:is-scroll="false"
			bar-height="8"
			:active-color="theme.dzBaseColor"
			@change="tabChange"
			style="position: fixed;width: 100%;z-index: 2;"
		></dz-tabs>
		<view class="content">
			<block v-for="(item, index) in orderProduct" :key="index">
				<view class="product">
					<view class="order-tip">
						<view class="dz-flex">
							<view class="order">订单号:</view>
							<view class="number">{{ item.order_product_sn }}</view>
						</view>
						<view class="tip" :class="[item.refund_status == 5 ? 'success' : '']">{{ statusFilter(item.refund_status) }}</view>
					</view>
					<view class="item">
						<view class="image"><dz-image :src="item.product_picture" borderRadius="10" width="180" height="180"></dz-image></view>
						<view class="right">
							<view>
								<view class="title">{{ item.product_name }}</view>
								<view class="tip" :style="{ color: theme.dzBaseColor }">数量: {{ item.num }}</view>
							</view>
							<view class="refund-btn">
								<view></view>
								<view>
									<dz-button
										type="info"
										size="mini"
										shape="circle"
										hoverClass="none"
										:border="false"
										:custom-style="{ width: '120rpx', marginLeft: '20rpx', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
										@click="toRefund('refundDetail', item)"
									>
										查看详情
									</dz-button>
									<dz-button
										v-if="(item.order_status == 2 || item.order_status == 3 || item.order_status == 4) && item.refund_status == 2"
										type="info"
										size="mini"
										shape="circle"
										hoverClass="none"
										:border="false"
										:custom-style="{ width: '120rpx', marginLeft: '20rpx', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
										@click="toRefund('refundShipping', item)"
									>
										填写物流
									</dz-button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" text="暂无售后订单" :src="emptyOrder" iconSize="360"></dz-empty>
			<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-bottom="20"></dz-loadmore>
			<dz-toast ref="dzToast"></dz-toast>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			list: [
				{
					name: '全部'
				},
				{
					name: '处理中'
				},
				{
					name: '已完成'
				}
			],
			current: 0,
			orderProduct: [],
			page: 1,
			refundStatus: '1,2,3,4,5,-1,2,-3',
			loadingStatus: 'loading',
			refundStatusFilter: this.$api.dataConfig.refundStatus
		};
	},
	async onShow() {
		await this.$onLaunched;
		this.page = 1;
		this.orderProduct.length = 0;
		this.getOrderProductIndex();
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '售后主页'
		});
	},
	filters: {},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getOrderProductIndex();
	},
	methods: {
		statusFilter(val) {
			let state;
			this.refundStatusFilter.forEach(item => {
				if (item.key === parseInt(val)) {
					state = item.value;
				}
			});
			return state;
		},
		getOrderProductIndex() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.orderProductIndex, {
					params: {
						refund_status: this.refundStatus,
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.orderProduct = [...this.orderProduct, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
		},
		tabChange(e) {
			this.current = e;
			if (e == 0) {
				this.refundStatus = '1,2,3,4,5,-1,2,-3';
			} else if (e == 1) {
				this.refundStatus = '2,3,4,6,7,8,-1';
			} else {
				this.refundStatus = '-2,-3,5';
			}
			this.page = 1;
			this.orderProduct.length = 0;
			this.getOrderProductIndex();
		},
		toRefund(url, item) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: item.id,

					order_id: item.order_id
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	margin-top: 88rpx;
	padding: 20rpx;
}
.product {
	padding: 30rpx 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	.order-tip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		.order {
			color: $dz-main-color;
		}
		.number {
			margin-left: 10rpx;
			color: $dz-tips-color;
		}
		.tip {
		}
		.success {
			color: $dz-main-color;
		}
	}
	.item {
		display: flex;
		margin-top: 20rpx;
		.image {
			flex-shrink: 0;
			width: 180rpx;
			height: 180rpx;
			border-radius: 10rpx;
			background-color: $dz-bg-color;
		}
		.right {
			flex: 1;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				font-size: 28rpx;
				color: $dz-main-color;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.tip {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: $dz-tips-color;
			}

			.refund-btn {
				width: 100%;
				display: flex;
				justify-content: space-between;
			}
		}
	}
}
</style>
