<template>
	<view class="bargain-address">
		<dz-navbar :title="'选择收货地址'">
			<view slot="right" @tap.stop="addAddress('add')"><dz-icon name="roundaddfill" size="44" style="margin-right: 30rpx;color: #606266;"></dz-icon></view>
		</dz-navbar>
		<view class="address-tab" v-if="showTab">
			<dz-tabs :list="list" :is-scroll="false" :current="currentCateIndex" font-size="28" height="80" :activeColor="theme.dzBaseColor" @change="tabsChange"></dz-tabs>
		</view>
		<view class="content" :style="{ marginTop: showTab ? '86rpx' : '0' }">
			<view class="address-box" v-show="currentCateIndex == 0">
				<view v-if="addressList.length > 0">
					<view class="list">
						<view class="row" v-for="(row, index) in addressList" :key="index" @tap="submit(row, 'address')">
							<view class="center">
								<view class="name-tel">
									<view class="name">{{ row.realname }}</view>
									<view class="tel">{{ row.mobile }}</view>
									<view class="default" :style="{ color: theme.dzBaseColor, borderColor: theme.dzBaseColor }" v-if="row.is_default == 1">
										{{ language.address.defaultAddress }}
									</view>
								</view>
								<view class="address">{{ row.address_name }} {{ row.address_details }}</view>
							</view>
							<view class="right">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
									hover-class="none"
									size="mini"
									@click="submit(row, 'address')"
								>
									选择
								</dz-button>
							</view>
						</view>
					</view>
				</view>
				<dz-loadmore v-if="loadingType != 'nodata'" :status="loadingType" margin-top="20" margin-bottom="20"></dz-loadmore>
				<view v-if="loadingType == 'nodata'"><dz-empty :text="language.address.noAddress" marginTop="80" :src="emptyAddress" iconSize="360"></dz-empty></view>
			</view>
			<view v-show="currentCateIndex == 1">
				<view class="bargain-shop">
					<view class="shop-item" v-for="(item, index) in pickupPoint" :key="index" @tap="submit(item)">
						<view class="item-left">
							<view class="shop-title">
								<text>{{ item.name }}</text>
								<text class="moble">{{ item.mobile }}</text>
							</view>
							<view class="shop-address">
								<text class="dzicon-iconfont dzicon-locationfill"></text>
								<text>地址: {{ item.address_name }}{{ item.address }}</text>
							</view>
						</view>
						<view class="item-right" style="margin-right: 10rpx;">
							<dz-button
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
								hover-class="none"
								size="mini"
								@click="submit(item)"
							>
								选择
							</dz-button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			emptyAddress: this.$api.assetsConfig.emptyAddress,
			list: [{ name: '选择地址' }, { name: '门店自提' }],
			currentCateIndex: 0,
			page: 1,
			addressList: [],
			loadingType: 'loading',
			data: null,
			product: null,
			pickupPoint: [],
			showTab: false
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: '收货地址'
		});
		if (e.data) {
			this.data = JSON.parse(e.data);
		}
		this.product = e;
		await this.$onLaunched;
		this.getPickupPointIndex();
	},
	async onShow() {
		this.page = 1;
		this.addressList = [];
		this.loadingType = 'loading';
		await this.$onLaunched;
		this.getAddress();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.loadingType = 'loading';
		this.addressList.length = 0;
		this.getAddress();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.page++;
		this.getAddress();
	},
	methods: {
		async submit(item, type) {
			let params = {};
			if (this.product) {
				params.bargain_id = JSON.parse(this.product.product).bargain_id;
			}
			if (type) {
				params.address_id = item.id;
				params.shipping_type = 1;
			}
			// 自提
			if (this.pickupPoint.length > 0 && !type) {
				params.shipping_type = 2;
				params.pickup_id = item.id;
			}
			await this.$api.http
				.post(this.$api.apiShop.bargainLaunchCreate, {
					type: this.data.type,
					sku_id: JSON.parse(this.data.data).sku_id,
					...params
				})
				.then(res => {
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.bargainDetails,
						query: {
							id: res.data.id,
							source: 1
						}
					});
				})
				.catch(err => {
					console.log(err);
				});
		},
		tabsChange(index) {
			this.currentCateIndex = index;
			if (index === 0) {
				return;
			}
		},
		async getAddress() {
			this.loadingType = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.addressList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingType = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.addressList = [...this.addressList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingType = 'nodata';
					}
					uni.stopPullDownRefresh();
				})
				.catch(err => {
					uni.stopPullDownRefresh();
				});
		},
		addAddress(type) {
			this.$api.router.push({
				route: this.$api.routesConfig.addressManage,
				query: {
					type: type
				}
			});
		},
		// 获取自提门店地址
		getPickupPointIndex() {
			this.$api.http.get(this.$api.apiShop.pickupPointIndex).then(res => {
				this.pickupPoint = res.data;
				if (this.pickupPoint.length > 0) {
					this.showTab = true;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.address-tab {
	width: 100%;
	position: fixed;
	z-index: 992;
}
.list {
	flex-wrap: wrap;
	.row {
		display: flex;
		width: 100%;
		padding: 20rpx 2%;
		background-color: #ffffff;
		border-bottom: 1rpx solid $dz-border-color;
		.center {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding-left: 10rpx;
			.name-tel {
				display: flex;
				width: 100%;
				align-items: baseline;

				.name {
					font-size: 34rpx;
				}

				.tel {
					margin-left: 30rpx;
					font-size: 24rpx;
					color: #777;
				}

				.default {
					font-size: 22rpx;
					padding: 0 18rpx;
					border-radius: 24rpx;
					margin-left: 20rpx;
					border-width: 1rpx;
					border-style: solid;
				}
			}

			.address {
				width: 100%;
				padding: 10rpx 0;
				font-size: 24rpx;
				display: flex;
				line-height: 1.5;
				align-items: baseline;
				color: $dz-content-color;
			}
		}
		.right {
			display: flex;
			align-items: center;
			margin-right: 10rpx;
		}
	}
}
.bargain-shop {
	.shop-item {
		padding: 20rpx 2%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
		border-bottom: 1rpx solid $dz-border-color;

		.shop-title {
			color: $dz-main-color;
			font-size: 28rpx;
			.moble {
				margin-left: 20rpx;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
		.shop-address {
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
}
</style>
