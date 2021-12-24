<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="我的账户"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'我的账户'"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
			:border-bottom="false"
			:background="{ background: theme.dzBaseColor }"
		></dz-navbar>
		<view class="pure_top" v-if="userInfo.account">
			<view class="pure_top_view" :style="{ background: theme.dzBaseColor }"></view>
			<view class="card">
				<view class="price-box">
					<view class="price">￥ {{ (userInfo && userInfo.account && userInfo.account.user_money) || '0.00' }}</view>
					<view class="tip">我的余额</view>
					<view class="dz-p-30" v-if="parseInt(shopSetting.is_open_recharge) === 1">
						<dz-button
							:border="false"
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
							hover-class="none"
							size="mini"
							@click="toPage('recharge')"
						>
							去充值
						</dz-button>
					</view>
				</view>
				<dz-row gutter="16" justify="space-between">
					<dz-col span="3">
						<view class="card-item" @tap="toPage('bill', 1)">
							<dz-icon name="babyfill" size="55" color="#ffb928"></dz-icon>
							<text class="dz-m-t-10">账单记录</text>
						</view>
					</dz-col>
					<dz-col span="3">
						<view class="card-item" @tap="toPage('bill', 2)">
							<dz-icon name="timefill" size="55" color="#2EAFFF"></dz-icon>

							<text class="dz-m-t-10">充值记录</text>
						</view>
					</dz-col>
					<dz-col span="3">
						<view class="card-item" @tap="toPage('bill', 3)">
							<dz-icon name="samefill" size="55" color="#FF6F8E"></dz-icon>
							<text class="dz-m-t-10">消费记录</text>
						</view>
					</dz-col>
					<dz-col span="3">
						<view class="card-item" @tap="toPage('integral')">
							<dz-icon name="tubiao309" size="55" color="#FDC561"></dz-icon>
							<text class="dz-m-t-10">积分中心</text>
						</view>
					</dz-col>
				</dz-row>
			</view>
		</view>
		<!-- 猜你喜欢 -->
		<shop-product-recommend :list="guessYouLikeList" :title="'专属推荐'" style="margin-top: 20rpx;" :theme="theme"></shop-product-recommend>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'nodata'" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			shopSetting: this.$api.shopSetting,
			empty: this.$api.assetsConfig.empty,
			memberInfo: {},
			loadingShow: false,
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: [],
			scrollTop: 0,
			opacity: 0
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '我的账户'
		});
		await this.$onLaunched;
		if (this.hasLogin) {
			this.getMemberIndex();
		}

		this.getGuessYouLikeList();
		wx.requestSubscribeMessage({
			tmplIds: ['W7BiFA-HwXPVWuVGHFZotNJi6rk1koEZxWvuFxyiHF0']
		});
	},
	onPullDownRefresh() {
		if (this.hasLogin) {
			this.getMemberIndex();
		}
		this.getGuessYouLikeList();
	},
	computed: {
		...mapState(['userInfo']),
		...mapGetters(['hasLogin']),
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getGuessYouLikeList();
	},
	methods: {
		...mapMutations(['setUserInfo']),
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		getMemberIndex() {
			this.$api.http
				.get(this.$api.apiShop.memberInfo)
				.then(res => {
					this.setUserInfo(res.data);
				})
				.catch(err => {});
		},
		toPage(url, status) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					status
				}
			});
		},
		// 专属推荐
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
		}
	}
};
</script>

<style lang="scss" scoped>
.pure_top {
	width: 100%;
	position: relative;
	z-index: 0;
	overflow: hidden;
	padding: 24rpx;
}

.pure_top_view {
	content: '';
	width: 160%;
	height: 260rpx;
	position: absolute;
	left: -30%;
	top: 0;
	border-radius: 0 0 50% 50%;
}

.card {
	position: relative;
	z-index: 1;
	background-color: #fff;
	padding: 30rpx;
	color: $dz-main-color;
	border-radius: 20rpx;
	overflow: hidden !important;
	.price-box {
		text-align: center;
		padding: 40rpx 0 50rpx;
		.price {
			font-size: 60rpx;
		}
		.tip {
			margin-top: 20rpx;
		}
	}
}
.card-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
}
</style>
