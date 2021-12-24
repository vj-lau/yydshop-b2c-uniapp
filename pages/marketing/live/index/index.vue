<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="直播间"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'直播间'"
			:isFixed="true"
			:background="{ background: theme.dzBaseColor }"
			:border-bottom="false"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
		></dz-navbar>
		<view class="pure_top"><view class="pure_top_view" :style="{ background: theme.dzBaseColor }"></view></view>
		<view class="swiper"><dz-swiper :list="swiperBanner" name="cover" height="320" border-radius="20" bg-color="" class="swiper-banner"></dz-swiper></view>
		<dz-tabs :list="tabList" :current="current" :is-scroll="false" bar-height="8" :active-color="theme.dzBaseColor" @change="tabChange" bg-color=""></dz-tabs>
		<view class="container">
			<view class="item" v-for="(item, index) in miniProgramLivelist" :key="index" @tap="ToLive(item)">
				<view class="right">
					<image :src="item.cover" lazy-load></image>
					<view class="tag dz-flex" :style="{ background: parseInt(item.live_status) === 102 ? theme.dzBaseDisabled : 'rgba(0, 0, 0, 0.5)' }">
						<shop-loading v-if="parseInt(item.live_status) === 101" mode="loading-7"></shop-loading>
						<text class="dz-m-l-6">{{ item.live_status | filterStateText }}</text>
					</view>
					<view class="live">
						<view class="title dz-line-1" style="width: 450rpx;">{{ item.name }}</view>
						<view class="name">主播: {{ item.anchor_name || '匿名' }}</view>
						<view class="time" v-if="item.live_status === '101'">直播开始于 {{ item.start_time | timeFormat }}</view>
						<view class="time" v-if="item.live_status === '102'">直播于 {{ item.start_time | timeFormat }} 开始</view>
						<view class="time" v-if="item.live_status === '103'">直播: {{ item.start_time | timeFormat }} - {{ item.end_time | timeFormat }}</view>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="60" class="dz-m-b-60" text="暂无直播记录" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<shop-product-recommend :list="guessYouLikeList" title="猜你喜欢" :theme="theme"></shop-product-recommend>
		<dz-empty v-if="loadingStatus == 'nodata' && loadingProductStatus == 'nodata' && miniProgramLivelist.length == 0" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore
			v-if="loadingStatus == 'nodata' && loadingProductStatus != 'nodata' && miniProgramLivelist.length == 0"
			:status="loadingProductStatus"
			margin-top="20"
			margin-bottom="20"
		></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			swiperBanner: [],
			tabList: [
				{
					state: 101,
					name: '进行中'
				},
				{
					state: 102,
					name: '未开始'
				},
				{
					state: 103,
					name: '已结束'
				}
			],
			current: 0,
			state: 101,
			page: 1,
			miniProgramLivelist: [],
			loadingStatus: 'loading',
			loadingProductStatus: null,
			guessYouLikeList: [],
			scrollTop: 0,
			opacity: 0
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '直播间'
		});
		this.state = this.tabList[this.current].state;
		await this.$onLaunched;
		this.theme = this.$api.theme;
		this.getMiniProgramLiveIndex();
		this.getAdvList();
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	filters: {
		filterStateText(val) {
			switch (parseInt(val, 10)) {
				case 101:
					return '直播中';
				case 102:
					return '未开始';
				case 103:
					return '已结束';
			}
		},
		filterStateTag(val) {
			switch (parseInt(val, 10)) {
				case 101:
					return 'primary';
				case 102:
					return 'warning';
				case 103:
					return 'info';
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.miniProgramLivelist.length = 0;
		this.guessYouLikeList.length = 0;
		this.swiperBanner.length = 0;
		this.getMiniProgramLiveIndex();
		this.getAdvList();
	},
	onReachBottom() {
		if (this.miniProgramLivelist.length > 0) {
			if (this.loadingStatus == 'nomore') return;
			this.page++;
			this.getMiniProgramLiveIndex();
		} else {
			if (this.loadingProductStatus == 'nomore') return;
			this.page++;
			this.getGuessYouLikeList();
		}
	},
	methods: {
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		tabChange(e) {
			this.current = e;
			this.page = 1;
			this.state = this.tabList[e].state;
			this.miniProgramLivelist.length = 0;
			this.guessYouLikeList.length = 0;
			this.getMiniProgramLiveIndex();
		},
		async getMiniProgramLiveIndex() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.miniProgramLiveIndex, {
					params: {
						page: this.page,
						live_status: this.state,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.miniProgramLivelist = [...this.miniProgramLivelist, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
						this.getGuessYouLikeList();
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
		},
		ToLive(item) {
			this.$api.shop.liveNavigate(item.room_id);
		},
		async getAdvList() {
			await this.$api.http
				.get(this.$api.apiShop.advList, {
					params: {
						location: 'live_top'
					}
				})
				.then(async res => {
					this.swiperBanner = res.data.live_top;
				})
				.catch(err => {
					console.log(err);
				});
			uni.stopPullDownRefresh();
		},
		// 为你推荐
		async getGuessYouLikeList() {
			this.loadingProductStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.guessYouLikeList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingProductStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.guessYouLikeList = [...this.guessYouLikeList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingProductStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingProductStatus = 'loadmore';
					console.log(err);
				});
		}
	}
};
</script>

<style lang="scss">
.container {
	position: relative;
	padding: 24rpx;
}

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
.item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 220rpx;
	background: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
	.right {
		display: flex;
		align-items: center;
		position: relative;
		image {
			flex-shrink: 0;
			width: 220rpx;
			height: 220rpx;
		}
		.live {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-content: space-around;
			margin: 20rpx;
			color: $dz-main-color;
			.title {
				font-size: 32rpx;
			}
			.name {
				padding: 20rpx 0 10rpx;

				color: $dz-tips-color;
			}
		}
		.tag {
			position: absolute;
			top: 20rpx;
			left: 20rpx;
			height: 52rpx;
			padding: 0 12rpx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.5);
			border-radius: 26rpx 26rpx 26rpx 0;
		}
	}
	.left {
		margin-right: 20rpx;
	}
}
</style>
