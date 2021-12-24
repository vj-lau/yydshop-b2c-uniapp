<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="我的积分"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'我的积分'"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
			:border-bottom="false"
			:background="{ background: theme.dzBaseColor }"
		></dz-navbar>
		<view class="pure_top" v-if="userInfo.account">
			<view class="pure_top_view" :style="{ background: theme.dzBaseColor }"></view>
			<view class="card">
				<view class="price-box">
					<view class="price">
						<view class="dzicon-iconfont dzicon-tubiao309"></view>
						<view class="integral">{{ (userInfo.account && userInfo.account.user_integral) || '0' }}</view>
					</view>
					<view class="btn" @tap="toPage('integralDetail')"><text>明细</text></view>
				</view>
			</view>
		</view>
		<view class="content">
			<dz-row gutter="16" justify="space-between" class="dz-m-t-20">
				<dz-col span="4">
					<view class="card-item">
						<text>{{ (userInfo.account && userInfo.account.accumulate_integral) || '0' }}</text>
						<text class="dz-m-t-10">累计积分</text>
					</view>
				</dz-col>
				<dz-col span="4">
					<view class="card-item">
						<text>{{ (userInfo.account && Math.abs(parseInt(userInfo.account.consume_integral))) || '0' }}</text>
						<text class="dz-m-t-10">累计消费</text>
					</view>
				</dz-col>
				<dz-col span="4">
					<view class="card-item">
						<text>{{ (userInfo.account && userInfo.account.frozen_integral) || '0' }}</text>
						<text class="dz-m-t-10">冻结积分</text>
					</view>
				</dz-col>
			</dz-row>
		</view>
		<view class="integral-product dz-m-t-20"><dz-title title="积分商品" mode="line" :barColor="theme.dzBaseDisabled"></dz-title></view>
		<shop-product-list :list="integralList" :theme="theme" toBottom="20" leftRight="20"></shop-product-list>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" text="暂无积分商品" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			integralList: [],
			page: 1,
			loadingStatus: 'loading',
			scrollTop: 0,
			opacity: 0
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '我的积分'
		});
		await this.$onLaunched;
		if (this.hasLogin) {
			this.getMemberIndex();
		}
		this.getProductList();
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
	onPullDownRefresh() {
		this.page = 1;
		this.integralList.length = 0;
		if (this.hasLogin) {
			this.getMemberIndex();
		}
		this.getProductList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getProductList();
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
		toPage(url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url]
			});
		},
		getProductList() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiShop.productList, {
					params: {
						page: this.page,
						is_integral: 1,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.integralList = [...this.integralList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.pure_top {
	width: 100%;
	height: 360rpx;
	position: relative;
	z-index: 0;
	overflow: hidden;
}
.pure_top_view {
	content: '';
	width: 160%;
	height: 360rpx;
	position: absolute;
	left: -30%;
	top: 0;
	border-radius: 0 0 50% 50%;
}
.card {
	position: relative;
	z-index: 1;
	color: #ffffff;
	.price-box {
		text-align: center;
		position: relative;
		padding: 40rpx 0;

		.price {
			display: flex;
			align-items: center;
			justify-content: center;
			.dzicon-tubiao309 {
				padding-top: 12rpx;
				margin-right: 20rpx;
				font-size: 46rpx;
			}
			.integral {
				font-size: 60rpx;
			}
		}
		.btn {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40rpx;

			text {
				margin-top: 40rpx;
				padding: 0 20rpx;
				line-height: 40rpx;
				font-size: 24rpx;
				border-radius: 20rpx;
				background-color: rgba(255, 255, 255, 0.4);
			}
		}
	}
}
.card-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.content {
	position: relative;
	margin: -100rpx 24rpx 0;
	padding: 30rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
}
</style>
