<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="评价成功" :border-bottom="false"></dz-navbar>
		</dz-navbar-immersive>
		<!-- #ifndef MP -->
		<dz-navbar :is-fixed="false" :background="{ background: theme.dzBaseColor }" :border-bottom="false" :back-icon-color="theme.dzBaseFontColor">
			<view class="navbar">
				<dz-icon name="roundcheckfill" size="40" :color="theme.dzBaseFontColor"></dz-icon>
				<view class="title" :style="{ color: theme.dzBaseFontColor }">评价成功</view>
			</view>
			<view slot="right" style="width: 72rpx;"></view>
		</dz-navbar>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<dz-navbar
			title="评价成功"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
			:border-bottom="false"
			:background="{ background: theme.dzBaseColor }"
		></dz-navbar>
		<!-- #endif -->
		<view class="content dz-p-t-50" :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }">
			<!-- #ifdef MP -->
			<view class="dz-m-b-20"><dz-icon name="roundcheckfill" size="120" :color="theme.dzBaseFontColor"></dz-icon></view>
			<!-- #endif -->
			<view class="tip">感谢您的评论~</view>
			<view class="btn dz-m-t-40 dz-p-b-50">
				<view class="item dz-m-r-60" @tap="toHome" :style="{ borderColor: theme.dzBaseFontColor }">返回首页</view>
				<view class="item" @tap="toEvaluationDetail" :style="{ borderColor: theme.dzBaseFontColor }">查看我的评价</view>
			</view>
		</view>
		<!-- 推荐商品 -->
		<view class="product-box dz-m-t-30">
			<dz-title title="为你推荐" mode="line" :barColor="theme.dzBaseDisabled" v-if="guessYouLikeList.length > 0"></dz-title>
			<view class="product-list">
				<view class="product-item" v-for="(item, index) in guessYouLikeList" :key="index" @tap="toProductDetail(item)">
					<image :src="item.picture"></image>
					<view class="price-text">{{ item.name }}</view>
					<dz-tag
						v-if="item.marketing_type && item.marketing_type != 0"
						:bg-color="theme.dzBaseColor"
						:color="theme.dzBaseFontColor"
						size="mini"
						mode="dark"
						style="margin:0 0 10rpx 10rpx;"
					>
						{{ marketingType(item.marketing_type) }}
					</dz-tag>
					<view v-else style="height: 46rpx;"></view>
					<view style="display: flex; align-items: flex-end; padding-left: 10rpx;">
						<view class="price-box" :style="{ color: theme.dzBaseColor }">
							<text class="price-l">{{ language.application.moneySymbol }}</text>
							<text class="price-r">{{ item.price }}</text>
						</view>
						<view class="price-tip">{{ language.application.moneySymbol }}{{ item.market_price || item.price }}</view>
					</view>
				</view>
			</view>
			<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
			<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: [],
			scrollTop: 0,
			opacity: 0,
			detail: {}
		};
	},
	async onLoad(option) {
		await this.$onLaunched;
		this.getGuessYouLikeList();
		this.detail = option;
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getGuessYouLikeList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		opacityChange(e) {
			this.opacity = e.opacity;
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
		async getGuessYouLikeList() {
			this.loadingStatus = 'loading';
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
					console.log(err);
				});
		},
		toHome() {
			this.$api.router.switchTab({
				route: this.$api.routesConfig.index,
				query: {}
			});
		},
		// 查看评论
		toEvaluationDetail() {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluationDetail,
				query: {
					order_id: this.detail.order_id,
					product_id: this.detail.product_id
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
.navbar {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	.title {
		margin-left: 10rpx;
		font-size: 36rpx;
	}
}
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	.btn {
		display: flex;
		.item {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 220rpx;
			height: 60rpx;
			border-radius: 60rpx;
			border-width: 1rpx;
			border-style: solid;
		}
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
		border-radius: 12rpx;
		overflow: hidden;
		image {
			width: 342rpx;
			height: 342rpx;
		}
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
		.price-price {
			font-size: 24rpx;
			color: $dz-main-color;
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
