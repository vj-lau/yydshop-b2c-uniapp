<template>
	<view>
		<dz-navbar input-align="center" :title="language.wholesale.wholesaleTitle" class="navbar"></dz-navbar>
		<view class="content">
			<swiper :disable-touch="true" :autoplay="true" :vertical="true" circular class="dz-swiper" v-if="wholesaleGroupStateList.length > 0">
				<swiper-item class="dz-swiper-item" v-for="(item, index) in wholesaleGroupStateList" :key="index">
					<view class="notice">
						<image :src="item.member_head_portrait || missingFace"></image>
						<text>
							{{ item.member_nickname }} {{ $api.helper.formatString(language.wholesale.groupPrice, item.price || item.product_money) }}{{ item.product_name }}
						</text>
					</view>
				</swiper-item>
			</swiper>
			<view v-if="advList.length > 0"><dz-swiper :list="advList" borderRadius="0" name="cover" height="320" img-mode="scaleToFill" @click="swiperClick"></dz-swiper></view>
			<view class="marketing-list">
				<view class="item" v-for="(item, index) in wholesaleList" :key="index" @tap="toGroup(item.product.id)">
					<view class="img"><dz-image :src="item.product.picture" width="220" height="220"></dz-image></view>
					<view class="right">
						<view>
							<view class="title dz-line-2 dz-m-b-6">{{ item.product.name }}</view>
							<dz-tag class="text" size="mini" :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" mode="dark">
								{{ item.num }}{{ language.wholesale.yesGroup }}
							</dz-tag>
						</view>
						<view class="price-box">
							<view class="price" :style="{ color: theme.dzBaseColor }">
								<text>{{ language.application.moneySymbol }}</text>
								<text>{{ item.product.wholesale_price }}</text>
								<view class="price-tip">{{ language.application.moneySymbol }}{{ item.product.market_price || item.product.price }}</view>
							</view>
							<view class="group">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
									hover-class="none"
									size="mini"
									@click="toGroup(item.product.id)"
								>
									{{ language.wholesale.toWholesale }}
								</dz-button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
			<view class="dz-p-b-20">
				<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20"></dz-loadmore>	
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			missingFace: this.$api.assetsConfig.missingFace,
			empty: this.$api.assetsConfig.empty,
			page: 1,
			loading: false,
			loadingStatus: 'loading',
			wholesaleList: [],
			wholesaleGroupStateList: [],
			advList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({ title: this.$api.language.wholesale.wholesaleTitle });
		await this.$onLaunched;
		await this.getAdvList();
		await this.getWholesaleGroupState();
		await this.getWholesaleList();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.wholesaleList.length = 0;
		this.wholesaleGroupStateList.length = 0;
		this.getWholesaleGroupState();
		this.getWholesaleList();
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getWholesaleList();
	},
	methods: {
		async getWholesaleList() {
			if (this.loading) {
				return;
			}
			this.loading = true;
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.wholesaleProductIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(async res => {
					this.loading = false;
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.wholesaleList = [...this.wholesaleList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loading = false;
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		async getWholesaleGroupState() {
			await this.$api.http
				.get(this.$api.apiShop.wholesaleGroupState, {
					params: {
						page: this.page,
						state: '0,1,2,3',
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(async res => {
					res.data.forEach(item => {
						this.wholesaleGroupStateList.push(...item.list);
					});
				})
				.catch(err => {
					console.log(err);
				});
		},
		async getAdvList() {
			await this.$api.http
				.get(this.$api.apiShop.advList, {
					params: {
						location: 'wholesale_top'
					}
				})
				.then(async res => {
					this.advList = res.data.wholesale_top;
				})
				.catch(err => {
					console.log(err);
				});
		},
		swiperClick(index) {
			let item = this.advList[index];
			if(item.jump_type && item.jump_type == 'product_view' && this.$api.helper.isNumber(item.jump_link)) {
			 	this.toGroup(item.jump_link)
				return
			}
			this.$api.shop.advNavigate(item.jump_type, item.jump_link, item.id);
		},
		// 去开团
		toGroup(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.wholesaleProduct,
				query: {
					id: id
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	background-color: #f5f5f5;
	.dz-swiper {
		width: 100%;
		height: 100rpx;
		position: fixed;
		z-index: 99;
		background-color: rgba(0, 0, 0, 0.2);
	}
	.notice {
		width: 100%;
		height: 100rpx;

		display: flex;
		align-items: center;
		padding: 0 30rpx;

		image {
			flex-shrink: 0;
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		text {
			color: #ffffff;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	.marketing-list {
		padding: 20rpx;
		.item {
			display: flex;
			height: 220rpx;
			background-color: #ffffff;
			border-radius: 15rpx;
			overflow: hidden;
			margin-bottom: 20rpx;
			.img {
				width: 220rpx;
				height: 220rpx;
				flex-shrink: 0;
			}
			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 20rpx;
				.title {
					font-size: 28rpx;
					color: $dz-main-color;
				}
				.text {
					font-size: 24rpx;
				}
				.price-box {
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					.price {
						display: flex;
						align-items: flex-end;
						text:first-child {
							font-size: 22rpx;
						}
						text:last-child {
							font-size: 38rpx;
						}
						.price-tip {
							margin-left: 10rpx;
							font-size: 24rpx;
							color: $dz-tips-color;
							text-decoration: line-through;
						}
					}
					.group {
						padding: 10rpx 20rpx;
					}
				}
			}
		}
	}
}
</style>
