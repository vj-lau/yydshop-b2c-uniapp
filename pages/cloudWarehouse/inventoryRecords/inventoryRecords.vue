<template>
	<view>
		<dz-navbar title="库存记录"></dz-navbar>
		<view class="tag-box">
			<dz-row gutter="16">
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">今日进货箱数</view>
						<view>{{ statisticsInfo.today_purchase_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">本月进货箱数</view>
						<view>{{ statisticsInfo.this_month_purchase_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">上月进货箱数</view>
						<view>{{ statisticsInfo.last_month_purchase_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">累计进货箱数</view>
						<view>{{ statisticsInfo.total_purchase_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">今日销货箱数</view>
						<view>{{ statisticsInfo.today_sale_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">本月销货箱数</view>
						<view>{{ statisticsInfo.this_month_sale_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">上月销货箱数</view>
						<view>{{ statisticsInfo.last_month_sale_stock }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">累计销货箱数</view>
						<view>{{ statisticsInfo.total_sale_stock }}</view>
					</view>
				</dz-col>
			</dz-row>
		</view>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in statisticsList" :key="index">
				<view class="num">
					<text>{{ item.group | filtersGroup }}单号:</text>
					{{ item.order_sn }}
				</view>
				<dz-line></dz-line>
				<view class="product-content">
					<view class="left">
						<view class="image">
							<dz-image :src="item.sku.picture ? item.sku.picture : item.product.picture" borderRadius="10" width="130" height="130"></dz-image>
						</view>
						<view class="product-msg">
							<view class="name">{{ item.product_name }}</view>
							<view class="sku">{{ item.sku_name || '默认款' }}</view>
						</view>
					</view>
					<view class="right">
						<view class="price-box">
							<view>{{ item.group | filtersGroup }}价</view>
							<view class="dz-color-3">￥{{ price(item) }}</view>
							<view class="dz-color-3">x{{ parseInt(item.num) < 0 ? Math.abs(parseInt(item.num)) : parseInt(item.num) }}</view>
						</view>
					</view>
				</view>
				<!-- <view class="name dz-p-t-10">{{ item.product_name }}</view>
				<view class="price">
					{{ item.group | filtersGroup }}价:
					<text>{{ price(item) }} x {{ parseInt(item.num) < 0 ? Math.abs(parseInt(item.num)) : parseInt(item.num) }}</text>
				</view> -->
				<view v-if="item.group != 'manual' && item.group != 'pickup'">
					<view class="cell">
						<text>{{ item.group | filtersGroupText }}商ID:</text>
						{{ item.reMember ? item.reMember.id : '无' }}
					</view>
					<view class="cell">
						<text>{{ item.group | filtersGroupText }}商昵称:</text>
						{{ item.reMember ? item.reMember.nickname : '平台' }}
					</view>
				</view>
				<view class="cell">
					<text>{{ item.group | filtersGroup }}时间:</text>
					{{ item.created_at | timeFormat }}
				</view>
				<view class="cell dz-m-b-10">
					<text>支付时间:</text>
					{{ (parseInt(item.created_at) + $api.helper.random(300, 600)) | timeFormat }}
				</view>
				<dz-line></dz-line>
				<view class="price dz-m-t-10 sum">
					{{ item.group | filtersGroup }}总价：
					<text :style="{ color: theme.dzBaseColor }">{{ item.product_total_price }}</text>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" text="暂无库存记录" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			statisticsInfo: {
				last_month_purchase_stock: 0,
				last_month_sale_stock: 0,
				this_month_purchase_stock: 0,
				this_month_sale_stock: 0,
				today_purchase_stock: 0,
				today_sale_stock: 0,
				total_purchase_stock: 69,
				total_sale_stock: 12
			},
			statisticsList: [],
			page: 1,
			pageLoadingShow: false,
			loadingStatus: 'loading',
			pageLoadingStatus: 'loading'
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '库存记录'
		});
		this.statistics();
		this.stockLog();
	},
	filters: {
		filtersGroup(val) {
			switch (val) {
				case 'purchase':
					return '进货';
					break;
				case 'sale':
					return '销货';
					break;
				case 'pickup':
					return '提货';
					break;
				case 'refund':
					return '退货';
					break;
				case 'manual':
					return '手提';
					break;
			}
		},
		filtersGroupText(val) {
			switch (val) {
				case 'purchase':
					return '供应';
					break;
				case 'sale':
					return '进货';
					break;
				case 'pickup':
					return '提货';
					break;
				case 'refund':
					return '退货';
					break;
				case 'manual':
					return '手提';
					break;
			}
		}
	},
	onPullDownRefresh() {
		this.pageLoadingShow = true;
		this.page = 1;
		this.statisticsInfo = {};
		this.statisticsList.length = 0;
		this.statistics();
		this.stockLog();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.stockLog();
	},
	methods: {
		pageLoadingClick() {
			this.statistics();
		},
		price(val) {
			let sum;
			sum = (parseFloat(val.product_total_price) / parseInt(val.num)).toFixed(2);
			return sum > 0 ? sum : Math.abs(sum);
		},
		statistics() {
			this.$api.http
				.get(this.$api.apiDistribution.statistics)
				.then(res => {
					this.statisticsInfo = res.data;
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});
		},
		stockLog() {
			this.$api.http
				.get(this.$api.apiDistribution.stockLog, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.statisticsList = [...this.statisticsList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.tag-box {
	padding: 14rpx 14rpx 0;
}
.tag-item {
	padding: 10rpx;
	margin-bottom: 16rpx;
	background: #fff;
	border-radius: 15rpx;
	text-align: center;
	font-size: 24rpx;
	.title {
		color: #999;
	}
}
.order-box {
	padding: 0 20rpx;
	.order-item {
		padding: 20rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		.num {
			margin-bottom: 10rpx;
			text {
				margin-right: 6rpx;
				color: #999;
			}
		}
		.price {
			text-align: right;
			color: #999;
			text {
				color: #333;
				margin-left: 6rpx;
			}
		}
		.cell {
			line-height: 46rpx;
			text {
				margin-right: 6rpx;
				color: #999;
			}
		}
		.sum {
			color: #333;
			text {
				margin-left: 6rpx;
			}
		}
	}
}

.product-content {
	display: flex;
	justify-content: space-between;
	margin: 15rpx 0;
	.left {
		display: flex;
		.image {
			flex-shrink: 0;
			width: 130rpx;
			height: 130rpx;
			border-radius: 10rpx;
			background-color: $dz-bg-color;
		}
		.product-msg {
			margin-left: 20rpx;
			.name {
				line-height: 40rpx;
				color: $dz-main-color;
				font-size: 28rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.sku {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.right {
		flex-shrink: 0;
		.price-box {
			margin-left: 10rpx;
			text-align: right;
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
}
</style>
