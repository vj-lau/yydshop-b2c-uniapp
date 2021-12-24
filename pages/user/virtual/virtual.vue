<template>
	<view class="content">
		<dz-navbar :title="language.virtual.virtualIndexTitle"></dz-navbar>
		<dz-tabs-swiper
			:activeColor="theme.dzBaseColor"
			ref="dzTabs"
			:list="list"
			:current="current"
			@change="change"
			:is-scroll="false"
			bar-height="8"
			style=" position: relative;
		z-index: 10;width: 750rpx;"
		></dz-tabs-swiper>
		<swiper :current="swiperCurrent" duration="200" @change="swiperChange" class="swiper-box">
			<swiper-item class="list-scroll-content" v-for="(tap, tapIndex) in list" :key="tapIndex">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<view>
						<view class="dz-list" v-if="orderProductVirtualList.length > 0">
							<view class="dz-list-item" @tap="virtualDetailClick(item.id)" v-for="(item, index) in orderProductVirtualList" :key="index">
								<view class="left"><image class="image" :src="item.orderProduct.product_picture" mode="aspectFill"></image></view>
								<view class="mid">
									<view class="title dz-line-2">{{ item.product_name }}</view>
									<view class="time">{{ item.created_at | timeFormat }}</view>
								</view>
								<view class="right">
									<view>{{ language.virtual.useTime }}</view>
									<text class="change-num" :style="{ color: theme.dzBaseColor }">
										{{ parseInt(item.confine_use_number) === 0 ? language.virtual.noLimit : item.confine_use_number }}
									</text>
								</view>
							</view>
						</view>
						<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
						<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
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
			current: 0,
			swiperCurrent: 0,
			list: this.$api.dataConfig.orderProductVirtualTypeList,
			orderProductVirtualList: []
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.virtual.virtualIndexTitle
		});
		await this.$onLaunched;
		this.getorderProductVirtualIndex();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.orderProductVirtualList.length = 0;
		this.getorderProductVirtualIndex();
	},
	methods: {
		change(index) {
			this.page = 1;
			this.orderProductVirtualList.length = 0;
			this.swiperCurrent = this.current = index;
		},
		swiperChange(e) {
			this.current = this.swiperCurrent = e.detail.current;
			this.page = 1;
			this.orderProductVirtualList.length = 0;
			this.getorderProductVirtualIndex();
		},
		async getorderProductVirtualIndex() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.orderProductVirtualIndex, {
					params: {
						page: this.page,
						state: this.list[this.current].status,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					uni.stopPullDownRefresh();
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.orderProductVirtualList = [...this.orderProductVirtualList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					uni.stopPullDownRefresh();
				});
		},
		onreachBottom() {
			if (this.loadingStatus == 'nomore') return;
			this.page++;
			this.getorderProductVirtualIndex();
		},
		virtualDetailClick(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.virtualDetail,
				query: {
					id: id
				}
			});
		}
	}
};
</script>

<style lang="scss">
page,
.content {
	height: 100%;
}

.swiper-box {
	height: calc(100% - 84px - var(--status-bar-height));
}
.list-scroll-content {
	height: 100%;
}
.uni-swiper-item {
	height: auto;
}

.dz-list {
	padding-top: 20rpx;
	margin-bottom: 40rpx;
	.dz-list-item {
		background-color: #fff;
		display: flex;
		align-items: center;
		border-radius: 12rpx;
		box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
		padding: 20rpx 30rpx;
		margin: 0 20rpx 20rpx;
		.left {
			.image {
				width: 160rpx;
				height: 140rpx;
				border-radius: 12rpx;
				margin-right: 20rpx;
			}
		}

		.mid {
			flex: 1;
			.title {
				margin-top: 10rpx;
				font-size: 28rpx;
				color: $dz-main-color;
			}
			.time {
				margin-top: 10upx;
				font-size: 24rpx;
				color: $dz-light-color;
			}
		}

		.right {
			margin-left: 30rpx;
			text-align: center;
			.change-num {
				font-size: 28rpx;
			}
		}
	}
}
</style>
