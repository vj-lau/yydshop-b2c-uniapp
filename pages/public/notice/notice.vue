<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.noticeIndex.titleNotice"></dz-navbar>
		<view class="notice-item" v-for="item in announceList" :key="item.id">
			<text class="time">{{ item.created_at | timeFormat }}</text>
			<view class="content" @tap.stop="noticeTap(item.id)">
				<text class="title">{{ item.title }}</text>
				<view class="img-wrapper" v-if="item.cover"><image class="pic" mode="aspectFit" :src="item.cover"></image></view>
				<text class="introduce" v-if="item.synopsis">{{ item.synopsis }}</text>
				<view class="bot b-t">
					<text>{{ language.noticeIndex.viewDetail }}</text>
					<dz-icon name="right" size="32"></dz-icon>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" :bg-color="theme.dzBgColor" margin-top="20" margin-bottom="20"></dz-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			announceList: [],
			loading: false,
			loadingStatus: 'loading',
			page: 1
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({ title: this.$api.language.noticeIndex.titleNotice });
		await this.$onLaunched;
		this.getNotifyAnnounceIndex();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.announceList.length = 0;
		this.getNotifyAnnounceIndex();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getNotifyAnnounceIndex();
	},
	methods: {
		async getNotifyAnnounceIndex(type) {
			if (this.loading) {
				uni.stopPullDownRefresh();
				return;
			}
			this.loading = true;
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.notifyAnnounceIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loading = false;
					uni.stopPullDownRefresh();
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.announceList = [...this.announceList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(() => {
					uni.stopPullDownRefresh();
					this.loading = false;
					this.loadingStatus = 'loadmore';
				});
		},
		noticeTap(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.noticeDetail,
				query: {
					id: id
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.notice-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.time {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80rpx;
	padding-top: 10rpx;
	font-size: 26rpx;
	color: $dz-tips-color;
}

.content {
	width: 710rpx;
	padding: 0 24rpx;
	background-color: #fff;
	border-radius: 20rpx;
}

.title {
	display: flex;
	align-items: center;
	height: 90rpx;
	font-size: 32rpx;
	color: $dz-main-color;
}

.img-wrapper {
	width: 100%;
	height: 260rpx;
	position: relative;
}

.pic {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 6rpx;
}

.cover {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	font-size: 36rpx;
	color: #fff;
}

.introduce {
	display: inline-block;
	padding: 16rpx 0;
	font-size: 28rpx;
	color: $dz-content-color;
	line-height: 38rpx;
}

.bot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80rpx;
	font-size: 24rpx;
	color: $dz-light-color;
	position: relative;
}
</style>
