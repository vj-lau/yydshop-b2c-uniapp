<template>
	<view class="group">
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="预售专区"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'预售专区'"
			:isFixed="true"
			:background="{ background: theme.dzBaseColor }"
			:border-bottom="false"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
		></dz-navbar>
		<view class="pure_top"><view class="pure_top_view" :style="{ background: theme.dzBaseColor }"></view></view>
		<view class="swiper"><dz-swiper :list="advList" name="cover" height="320" border-radius="20" bg-color="" activeColor="#222" class="swiper-banner"></dz-swiper></view>
		<view class="content">
			<view class="product-box">
				<view class="item" v-for="(item, index) in groupBuyList" :key="index" @tap="banicBuying(item)">
					<view class="image"><dz-image :src="item.product.picture" width="260" height="260" borderRadius="15"></dz-image></view>
					<view class="right">
						<view>
							<view class="title">{{ item.product.name }}</view>
							<view class="tip">{{ item.product.sketch }}</view>
							<view style="margin-top: 30rpx;">
								<text
									class="group-tip"
									v-if="parseInt(item.state) == 1 && (item.end_time_left && item.end_time_left > 0)"
									:class="{ on: parseInt(item.state) !== 1 }"
								>
									距预售结束还剩
								</text>
								<dz-count-down
									v-if="parseInt(item.state) === 1"
									:timestamp="item.end_time_left"
									separator="zd"
									:bg-color="theme.dzBaseColor"
									font-size="24"
									separator-size="22"
									:separator-color="theme.dzTipsColor"
									:color="theme.dzBaseFontColor"
									style="margin-left: 10rpx;"
									@end="timeOut(index)"
								></dz-count-down>
								<text v-if="parseInt(item.state) == 0 && (item.start_time_left && item.start_time_left > 0)">{{ language.product.marketingStart }}</text>
								<text v-if="parseInt(item.state) == 3 && (item.end_time_left && item.end_time_left < 0)">{{ language.product.marketingFinished }}</text>
								<dz-count-down
									v-if="parseInt(item.state) === 0"
									:timestamp="item.start_time_left"
									separator="10"
									:bg-color="parseInt(item.state) !== 1 ? theme.dzTipsColor : theme.dzBaseColor"
									font-size="24"
									separator-size="22"
									:separator-color="theme.dzTipsColor"
									:color="theme.dzBaseFontColor"
									style="margin-left: 10rpx;"
									@end="StartTimeOut(index)"
								></dz-count-down>
							</view>
						</view>
						<view>
							<dz-tag shape="circle" size="mini" mode="dark" :bg-color="theme.dzBaseDisabled" :border-color="theme.dzBaseDisabled" :color="theme.dzBaseFontColor">
								可抵3000
							</dz-tag>
						</view>
						<view class="price-box">
							<view class="price">
								<view class="m-price" :style="{ color: theme.dzBaseColor }">
									<text class="dz-font-32 dz-m-r-10">定金</text>
									<text>{{ language.application.moneySymbol }}</text>
									<text class="price-num">{{ item.ladder.price }}</text>
								</view>
								<!-- <view class="price-tip">{{language.application.moneySymbol}}{{item.product.price}}</view> -->
							</view>
							<view>
								<dz-button
									:custom-style="{
										background: parseInt(item.state) == 3 && (item.end_time_left && item.end_time_left < 0) ? theme.dzBaseDisabled : theme.dzBaseColor,
										color: theme.dzBaseFontColor
									}"
									hover-class="none"
									:disabled="parseInt(item.state) == 3 && (item.end_time_left && item.end_time_left < 0)"
									size="mini"
									shape="circle"
									:border="false"
									@click="banicBuying(item)"
								>
									付定金
								</dz-button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			page: 1,
			groupBuyList: [],
			advList: [],
			loadingStatus: 'loading',
			scrollTop: 0,
			opacity: 0
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.group.groupTitle
		});
		await this.$onLaunched;
		this.getGroupBuy();
		this.getAdvList();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.groupBuyList.length = 0;
		this.advList.length = 0;
		this.getGroupBuy();
		this.getAdvList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	methods: {
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		async getGroupBuy() {
			if (this.loading) {
				return;
			}
			this.loading = true;
			this.loadingStatus = 'loading';

			await this.$api.http
				.get(this.$api.apiShop.groupBuyIndex, {
					page: this.page,
					page_size: this.$api.appConfig.pageSize
				})
				.then(res => {
					this.loading = false;
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.groupBuyList = [...this.groupBuyList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loading = false;
					this.loadingStatus = 'loadmore';
					console.log(err);
				});
		},
		async getAdvList() {
			await this.$api.http
				.get(this.$api.apiShop.advList, {
					params: {
						location: 'group_buy_top'
					}
				})
				.then(async res => {
					this.advList = res.data.group_buy_top;
				})
				.catch(err => {
					console.log(err);
				});
			uni.stopPullDownRefresh();
		},
		// 立即抢购
		banicBuying(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.groupProduct,
				query: {
					id: item.product_id
				}
			});
		},
		// 倒计时
		timeOut(index) {
			this.groupBuyList[index].state = 1;
			this.groupBuyList[index].end_time_left = -1;

			this.$set(this.groupBuyList, this.groupBuyList[index]);
		},
		StartTimeOut(index) {
			this.groupBuyList[index].state = 1;
			this.groupBuyList[index].start_time_left = -1;
			this.$set(this.groupBuyList, this.groupBuyList[index]);
		}
	}
};
</script>

<style lang="scss" scoped>
.pure_top {
	width: 100%;
	height: 400rpx;
	position: relative;
	z-index: 0;
	overflow: hidden;
}

.pure_top_view {
	content: '';
	width: 160%;
	height: 320rpx;
	position: absolute;
	left: -30%;
	top: 0;
	border-radius: 0 0 50% 50%;
}

.swiper {
	position: relative;
	z-index: 99;
	padding: 20rpx 24rpx 30rpx;
	margin-top: -360rpx;
}

.swiper-banner {
	overflow: hidden;
	padding-bottom: 50rpx;
}

.product-box {
	margin-top: -40rpx;
	padding: 20rpx;
	// background-color: #FFFFFF;
	.item {
		display: flex;
		padding: 20rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		background-color: #ffffff;
		.image {
			flex-shrink: 0;
			width: 260rpx;
			height: 260rpx;
			border-radius: 15rpx;
		}
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 15rpx;
			.title {
				width: 400rpx;
				font-size: 36rpx;
				color: $dz-main-color;
				font-weight: 600;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.tip {
				width: 400rpx;
				font-size: 24rpx;
				color: $dz-tips-color;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.group-tip {
				font-size: 24rpx;
				color: $dz-tips-color;
			}
			.on {
				color: $dz-main-color;
			}
			.price-box {
				display: flex;
				justify-content: space-between;
				.price {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: $dz-tips-color;
					.m-price {
						.price-num {
							font-size: 36rpx;
							font-weight: bold;
						}
					}
					.price-tip {
						margin-left: 10rpx;
						text-decoration: line-through;
					}
				}
			}
		}
	}
}
</style>
