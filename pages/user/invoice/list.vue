<template>
	<view class="invoice-history">
		<dz-navbar input-align="center" :title="language.invoice.invoiceHistory"></dz-navbar>
		<view class="dz-list" v-if="invoiceList.length > 0">
			<view class="dz-list-item" v-for="(item, index) in invoiceList" :key="index" @tap="navTo(item.order_id)">
				<view class="wrapper">
					<view class="address-box">
						<view class="order-fl">
							{{ language.invoice.orderNumber }}
							<text class="order-sn">{{ item.order_sn }}</text>
						</view>
						<view class="order-wrapper">
							<text class="address">
								{{ item.title }}
								<text v-if="item.content">{{ ` - ${item.content}` }}</text>
							</text>
							<text class="address">
								{{ language.invoice.invoiceSum }}
								<text class="base-color">{{ item.tax_money }}</text>
							</text>
						</view>
					</view>
					<view class="u-box">
						<view class="dz-inline-1">
							<text class="name">[{{ parseInt(item.type, 10) === 1 ? language.orderCreate.company : language.orderCreate.name }}]</text>
							<text class="mobile">{{ item.duty_paragraph || language.invoice.personalInvoicesHaveNoTaxNumber }}</text>
						</view>
						<text class="time">{{ item.created_at | timeFormat }}</text>
					</view>
				</view>
			</view>
			<dz-loadmore v-if="loadingType != 'nodata'" :status="loadingType" margin-top="20" margin-bottom="20"></dz-loadmore>
		</view>
		<view><dz-empty :text="language.invoice.noInvoiceData" v-if="invoiceList.length === 0 && !loading" marginTop="80" :src="emptyOrder" iconSize="360"></dz-empty></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			page: 1,
			loadingType: 'loading',
			invoiceList: [],
			loading: true
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.invoice.invoiceHistory
		});
		await this.$onLaunched;
		this.initData();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.invoiceList = [];
		this.getInvoiceList();
	},
	// 加载更多
	onReachBottom() {
		this.page++;
		this.getInvoiceList();
	},
	methods: {
		// 数据初始化
		initData() {
			this.getInvoiceList();
		},
		// 获取发票历史
		async getInvoiceList(type) {
			await this.$api.http
				.get(this.$api.apiShop.orderInvoiceList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loading = false;
					uni.stopPullDownRefresh();
					if (res.code == this.$api.responseCode.successCode) {
						this.loadingType = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
						this.invoiceList = [...this.invoiceList, ...res.data];
						if (this.page == 1 && res.data.length == 0) {
							this.loadingType = 'nodata';
						}
					}
				})
				.catch(() => {
					this.loading = false;
					uni.stopPullDownRefresh();
					this.loadingType = 'loadmore';
				});
		},
		navTo(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.orderDetail,
				query: {
					id: id
				}
			});
		}
	}
};
</script>

<style lang="scss">
.dz-list {
	position: relative;
	.dz-list-item {
		background-color: #ffffff;
		padding: 20rpx 30rpx;
	}
	.u-box {
		font-size: 28rpx;
		color: $dz-tips-color;
		margin-top: 16rpx;
		.name {
			margin-right: 30rpx;
		}
	}
}
.wrapper {
	display: flex;
	flex-direction: column;
	flex: 1;
}
.address-box {
	.order-fl {
		font-size: 24rpx;
		color: $dz-main-color;
		margin-bottom: 10rpx;
		.order-sn {
			margin-left: 14rpx;
		}
	}
	.order-wrapper {
		display: flex;
		justify-content: space-between;
		.address {
			font-size: 30rpx;
			color: $dz-main-color;
		}
	}
}
.u-box {
	font-size: 28rpx;
	color: $dz-tips-color;
	margin-top: 16rpx;
	display: flex;
	justify-content: space-between;
	.name {
	}
	.time {
		font-size: 26rpx;
	}
}
</style>
