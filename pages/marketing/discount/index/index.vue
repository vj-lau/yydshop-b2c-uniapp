<template>
	<view class="discount-index">
		<dz-navbar :title="language.discount.discountTitle"></dz-navbar>
		<view class="content">
			<dz-swiper v-if="advList.length > 0" :list="advList" name="cover" height="320" border-radius="0" @click="swiperClick"></dz-swiper>
			<view class="banner-box">
				<dz-subsection
					:current="bannerCurrent"
					:active-color="theme.dzBaseFontColor"
					:list="bannerTab"
					:button-color="theme.dzBaseColor"
					@change="bannerChange"
				></dz-subsection>
				<view class="banner-card" v-show="bannerCurrent == 0">
					<view class="banner-item">
						<view class="item" v-for="(item, index) in discountData.discount && discountData.discount.slice(0, 3)" :key="index" @tap="toDiscount(item, 'data')">
							<view class="text">
								<view class="title">{{ item.discount_name }}</view>
								<view class="tip">{{ item.description }}</view>
							</view>
							<view style="margin-bottom: 15rpx;" v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)">
								<text>{{ language.discount.noTime }}</text>
								<dz-count-down
									v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)"
									:timestamp="parseInt(item.end_time_left)"
									separator="zd"
									:bg-color="theme.dzBaseColor"
									font-size="24"
									separator-size="22"
									:separator-color="theme.dzTipsColor"
									:color="theme.dzBaseFontColor"
									style="margin-left: 10rpx;"
									@end="timeOut(index)"
								></dz-count-down>
							</view>
							<view style="margin-bottom: 15rpx;" v-if="parseInt(item.state) != 1 && (item.end_time_left && item.end_time_left < 0)">
								<!-- 本场活动已结束 -->
								<text>{{ language.discount.timeOut }}</text>
							</view>
							<dz-image :src="item.cover" width="100%" height="320" borderRadius="20"></dz-image>
						</view>
						<view class="tip-box" v-if="parseInt(discountData.total) > 3">
							<view class="text">
								共有
								<dz-tag mode="dark" style="margin: 0 5rpx;" size="mini">{{ discountData.total }}</dz-tag>
								场活动， {{ language.discount.moreActivities }}
							</view>
							<view class="btn">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
									hover-class="none"
									size="medium"
									@click="toActivity('data')"
								>
									{{ language.discount.more }}
								</dz-button>
							</view>
						</view>
					</view>
				</view>
				<view class="banner-card" v-show="bannerCurrent == 1">
					<view class="banner-item">
						<view class="item" v-for="(item, index) in discountSoon.discount && discountSoon.discount.slice(0, 3)" :key="index" @tap="toDiscount(item, 'soon')">
							<view class="text">
								<view class="title">{{ item.discount_name }}</view>
								<view class="tip">{{ item.description }}</view>
							</view>
							<view style="margin-bottom: 15rpx;" v-if="parseInt(item.state) === 0">
								<text>活动即将开始</text>
								<dz-count-down
									v-if="parseInt(item.state) === 0"
									:timestamp="parseInt(item.start_time_left)"
									separator="zd"
									:bg-color="theme.dzBaseColor"
									font-size="24"
									separator-size="22"
									:separator-color="theme.dzTipsColor"
									:color="theme.dzBaseFontColor"
									style="margin-left: 10rpx;"
									@end="marketingStart(index)"
								></dz-count-down>
							</view>
							<view style="margin-bottom: 15rpx;" v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)">
								<text>{{ language.discount.noTime }}</text>
								<dz-count-down
									v-if="parseInt(item.state) === 1 && (item.end_time_left && item.end_time_left > 0)"
									:timestamp="parseInt(item.end_time_left)"
									separator="zd"
									:bg-color="theme.dzBaseColor"
									font-size="24"
									separator-size="22"
									:separator-color="theme.dzTipsColor"
									:color="theme.dzBaseFontColor"
									style="margin-left: 10rpx;"
									@end="timeOut(index)"
								></dz-count-down>
							</view>
							<view style="margin-bottom: 15rpx;" v-if="parseInt(item.state) != 1 && (item.end_time_left && item.end_time_left < 0)">
								<!-- 本场活动已结束 -->
								<text>{{ language.discount.timeOut }}</text>
							</view>
							<dz-image :src="item.cover" width="100%" height="320" borderRadius="20"></dz-image>
						</view>
						<view class="tip-box" v-if="parseInt(discountSoon.total) > 3">
							<view class="text">
								共有
								<dz-tag mode="dark" style="margin: 0 5rpx;" size="mini">{{ discountSoon.total }}</dz-tag>
								场活动， {{ language.discount.moreActivities }}
							</view>
							<view class="btn">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
									hover-class="none"
									size="medium"
									@click="toActivity('soon')"
								>
									{{ language.discount.more }}
								</dz-button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="product-box">
			<dz-title
				v-if="discountProductList.length > 0"
				:title="bannerCurrent == 1 ? language.discount.trailerGoods : language.discount.activitiesOfGoods"
				mode="line"
				:barColor="theme.dzBaseDisabled"
			></dz-title>
			<view class="product-list">
				<view class="product-item" v-for="(item, index) in discountProductList" :key="index" @tap="toProduct(item)">
					<dz-image :src="item.product_picture" width="342" height="342"></dz-image>
					<view class="price-text">{{ item.product_name }}</view>
					<dz-tag size="mini" style="margin:0 0 10rpx 10rpx;"  :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" mode="dark">
						{{ (parseFloat(item.discount) / 10).toFixed(1) }}折
					</dz-tag>
					<view style="display: flex; align-items: flex-end; padding-left: 10rpx;">
						<view class="price-box" :style="{ color: theme.dzBaseColor }">
							<text class="price-l">{{ language.application.moneySymbol }}</text>
							<text class="price-r">{{ marketingPrice(item) }}</text>
						</view>
						<view v-if="item.product" class="price-tip">{{ language.application.moneySymbol }}{{ item.product.price || item.product.market_price }}</view>
					</view>
				</view>
			</view>
			<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :text="noDataText" :src="empty" iconSize="360"></dz-empty>
			<view class="dz-p-b-20">
				<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20"></dz-loadmore>
			</view>
			<!-- 页面加载 -->
			<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			discountSoon: {},
			bannerTab: [{ name: this.$api.language.discount.activitiesAreBooming }, { name: this.$api.language.discount.trailer }],
			bannerCurrent: 0,
			advList: [],
			discountProductList: [],
			page: 1,
			loadingStatus: 'loading',
			discountData: {},
			discount: {},
			pageLoadingShow: false,
			pageLoadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({ title: this.$api.language.discount.discountTitle });
		this.pageLoadingStatus = 'loading';
		this.pageLoadingShow = true;
		await this.$onLaunched;
		await this.getDiscountProductIndex();
		await this.getAdvList();
		await this.getDiscountSoon();
		await this.getDiscountIndex();
		if (parseInt(this.discountData.total) === 0) {
			this.bannerCurrent = 1;
			this.discountProductSoon();
		}
		this.pageLoadingShow = false;
	},
	onPullDownRefresh() {
		this.loadingData();
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getDiscountProductIndex();
	},
	methods: {
		pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			this.loadingData();
		},
		swiperClick(index) {
			let item = this.advList[index];
			this.$api.shop.advNavigate(item.jump_type, item.jump_link, item.id);
		},
		async loadingData() {
			this.pageLoadingStatus = 'loading';
			this.pageLoadingShow = true;
			this.page = 1;
			this.discountProductList.length = 0;
			this.discountSoon = {};
			this.discountData = {};
			this.discount = {};
			this.advList.length = 0;
			this.bannerCurrent = 0;
			await this.getDiscountProductIndex();
			await this.getAdvList();
			await this.getDiscountSoon();
			await this.getDiscountIndex();
			if (parseInt(this.discountData.total) === 0) {
				this.bannerCurrent = 1;
				this.discountProductSoon();
			}
			this.pageLoadingShow = false;
		},
		async getAdvList() {
			await this.$api.http
				.get(this.$api.apiShop.advList, {
					params: {
						location: 'discount_top'
					}
				})
				.then(res => {
					this.advList = res.data.discount_top;
				})
				.catch(err => {
					console.log(err);
				});
		},
		// tap 改变
		bannerChange(index) {
			this.bannerCurrent = index;
			this.page = 1;
			this.discountProductList.length = 0;
			if (this.bannerCurrent == 1) {
				this.getDiscountSoon();
				this.discountProductSoon();
			} else {
				this.getDiscountIndex();
				this.getDiscountProductIndex();
			}
		},
		// 开始活动列表
		async getDiscountIndex() {
			await this.$api.http
				.get(this.$api.apiShop.discountIndex)
				.then(res => {
					this.discountData = res.data;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
			uni.stopPullDownRefresh();
		},
		// 预告活动列表
		async getDiscountSoon() {
			await this.$api.http
				.get(this.$api.apiShop.discountSoon)
				.then(res => {
					this.discountSoon = res.data;
				})
				.catch(err => {
					console.log(err);
				});
		},
		toActivity(type) {
			this.$api.router.push({
				route: this.$api.routesConfig.discountActivity,
				query: {
					type
				}
			});
		},
		// 开始活动商品列表
		async getDiscountProductIndex() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.discountProductIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.discountProductList = [...this.discountProductList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
						this.noDataText = this.language.discount.noActivities;
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
					console.log(err);
				});
		},
		// 预告活动商品列表
		async discountProductSoon() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.discountProductSoon, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.discountProductList = [...this.discountProductList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
						this.noDataText = this.language.discount.notrailerActivities;
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
		},

		toDiscount(item, type) {
			this.$api.router.push({
				route: this.$api.routesConfig.discountList,
				query: {
					id: item.id,
					cover: item.cover,
					name: item.discount_name,
					type
				}
			});
		},
		toProduct(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.discountProduct,
				query: {
					id: item.product_id
				}
			});
		},
		// 倒计时
		timeOut(index) {
			this.discountData.discount[index].end_time_left = -1;
			this.discountData.discount[index].state = 3;
			this.$set(this.discountData.discount, this.discountData.discount[index]);
		},
		//营销活动开始
		marketingStart(index) {
			this.discountSoon.discount[index].state = 1;
			this.$set(his.discountSoon.discount, this.discountSoon.discount[index]);
		},
		marketingPrice(val) {
			//限时折扣
			const decimal = val.decimal_reservation_number;
			const discount = val.discount;
			let price = val.product.price;

			//限时折扣价格保留方式
			switch (parseInt(decimal)) {
				case -1:
					//保留角和分
					price = this.$api.helper.toFixed((price * discount) / 100, 2);
					break;
				case 0:
					//抹去角和分
					price = Math.floor((price * discount) / 100) * 10;
					price = (Math.round(price * 10) / 100).toFixed(0);
					break;
				case 1:
					//抹去分
					price = this.$api.helper.toFixed((price * discount) / 100, 1);
					break;
				default:
					price = this.$api.helper.toFixed((price * discount) / 100, 2);
			}
			return parseFloat(price).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
.banner-box {
	margin-top: 20rpx;
	padding: 0 20rpx;
}
.banner-item {
	margin: 20rpx 0;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	border-radius: 20rpx;
	overflow: hidden;
	background-color: #ffffff;
	.item {
		padding: 20rpx;
		background-color: #ffffff;
		width: 100%;
		.text {
			padding-bottom: 10rpx;
			color: $dz-tips-color;
		}
		.title {
			color: $dz-main-color;
			font-size: 36rpx;
			font-weight: bold;
		}
		.name {
			color: $dz-tips-color;
			font-size: 24rpx;
		}
		image {
			width: 100%;
			height: 256rpx;
			border-radius: 10rpx;
			display: block;
		}
	}
}
.tip-box {
	padding: 0 20rpx;
	.text {
		color: $dz-tips-color;
		font-size: 24rpx;
	}
	.btn {
		display: flex;
		justify-content: center;
		padding: 20rpx 0 30rpx;
	}
}
.product-list {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin: 0 24rpx;
	.product-item {
		width: 342rpx;
		height: 520rpx;
		background-color: #fff;
		box-sizing: border-box;
		margin: 9rpx 0;
		border-radius: 15rpx;
		overflow: hidden;
		.price-box {
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
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
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
