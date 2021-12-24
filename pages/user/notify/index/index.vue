<template>
	<view>
		<dz-navbar :title="`消息${count(NotifyUnRead)}`" :border-bottom="false">
			<!-- #ifndef MP-WEIXIN -->
			<view slot="right" class="navbar-right">
				<view class="dzicon-iconfont dzicon-icon"></view>
				<view @tap="tapNotifyReadAll">全部已读</view>
			</view>
			<!-- #endif -->
		</dz-navbar>
		<!-- #ifdef MP -->
		<view class="dz-edit-notify">
			<view>共有 {{ count(NotifyUnRead) }} 条未读消息</view>
			<view>
				<dz-button
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
					:border="false"
					hover-class="none"
					:plain="true"
					size="mini"
					shape="circle"
					throttleTime="200"
					@click="tapNotifyReadAll"
				>
					全部已读
				</dz-button>
			</view>
		</view>
		<!-- #endif -->
		<view class="content">
			<view class="tap">
				<view class="item" @tap="pageTap('notifyRefund')">
					<view class="icon"><text class="dzicon-iconfont dzicon-servicefill"></text></view>
					<view class="text">售后服务</view>
				</view>
				<view class="item" @tap="pageTap('notifyLogistics')">
					<view class="icon icon-color"><text class="dzicon-iconfont dzicon-deliver_fill"></text></view>
					<view class="text">交易物流</view>
				</view>
				<view class="item" @tap="pageTap('notify')">
					<view class="icon icon-color2"><text class="dzicon-iconfont dzicon-notificationfill"></text></view>
					<view class="text">服务通知</view>
				</view>
			</view>
			<view class="product-banner">
				<block v-for="(item, index) in notifyList" :key="index">
					<view class="banner-item" @tap="navTap(item, index)">
						<view class="title">
							<view class="name">{{ item.notify.title }}</view>
							<view class="time">
								<view>{{ item.notify.created_at | timeFormat }}</view>
								<view class="message" :style="{ background: theme.dzBaseColor }" v-if="parseInt(item.is_read) == 0"></view>
							</view>
						</view>
						<view class="tip">{{ item.notify.content }}</view>
						<view class="status" v-if="parseInt(item.is_read) == 1">已读</view>
					</view>
				</block>
				<dz-empty v-if="loadingStatus == 'noData'" text="还没有消息" margin-top="80" :src="emptyMsg" iconSize="360"></dz-empty>
				<view v-if="loadingStatus != 'noData'" class="dz-ios-p-bline"><dz-loadmore :status="loadingStatus"></dz-loadmore></view>
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyMsg: this.$api.assetsConfig.emptyMsg,
			NotifyUnRead: 0,
			page: 1,
			notifyList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '消息中心'
		});
		await this.$onLaunched;
		this.getNotifyIndex();
	},
	async onShow() {
		await this.$onLaunched;
		this.getNotifyUnRead();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.notifyList.length = 0;
		this.getNotifyIndex();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getNotifyIndex();
	},
	methods: {
		count(val) {
			let count;
			if (parseInt(val) == 0) {
				count = '';
				// #ifdef MP
				count = 0;
				// #endif
			} else if (parseInt(val) > 99) {
				count = '(' + '99' + '+' + ')';
			} else {
				count = `(${val})`;
			}
			return count;
		},
		async getNotifyUnRead() {
			await this.$api.http.get(this.$api.apiShop.notifyUnRead).then(res => {
				this.NotifyUnRead = res.data.count;
			});
		},
		async tapNotifyReadAll() {
			if (parseInt(this.NotifyUnRead) == 0)
				return this.$refs.dzToast.show({
					title: '暂无未读消息',
					type: 'warning'
				});
			await this.$api.http.get(this.$api.apiShop.notifyReadAll).then(res => {
				for (let i = 0; i < this.notifyList.length; i++) {
					this.$set(this.notifyList[i], 'is_read', 1);
				}
				this.getNotifyUnRead();
			});
		},
		async getNotifyIndex() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.notifyIndex, {
					params: {
						type: 2,
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.notifyList = [...this.notifyList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		pageTap(url, id) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: id
				}
			});
		},
		navTap(item, index) {
			this.$api.http
				.get(this.$api.apiShop.notifyRead, {
					params: {
						notify_id: item.notify_id
					}
				})
				.then(res => {
					this.notifyList[index].is_read = 1;
					this.$set(this.notifyList, this.notifyList[index]);
					this.$api.shop.navTo(item.notify);
				});
		}
	}
};
</script>

<style lang="scss">
.navbar-right {
	display: flex;
	align-items: center;
	padding-right: 32rpx;
}
.dzicon-icon {
	margin-right: 10rpx;
	font-size: 48rpx;
}
.content {
	padding: 20rpx;
}
.tap {
	display: flex;
	justify-content: space-between;
	background-color: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	.item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		.icon {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100rpx;
			height: 100rpx;
			margin: 10rpx;
			border-radius: 50%;
			background-color: rgba(64, 158, 255, 0.21);
			font-size: 52rpx;
			color: #409eff;
		}
		.icon-color {
			color: #e80f2e;
			background-color: rgba(247, 165, 165, 0.28);
		}
		.icon-color2 {
			color: #ffc20e;
			background-color: rgba(255, 194, 14, 0.25098);
		}
		.text {
			font-size: 28rpx;
			color: $dz-main-color;
		}
	}
}
.product-banner {
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 0 0 0;
		.name {
			font-size: 32rpx;
			color: $dz-main-color;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-right: 20rpx;
		}
		.time {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: $dz-content-color;
			.message {
				margin-left: 10rpx;
				width: 12rpx;
				height: 12rpx;
				border-radius: 50%;
			}
		}
	}
	.tip {
		padding: 20rpx 0 0 0;
		font-size: 24rpx;
		color: $dz-tips-color;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.status {
		position: absolute;
		left: 0;
		top: 0;
		font-size: 22rpx;
		background-color: rgba(102, 102, 102, 0.4);
		padding: 2rpx 20rpx;
		color: #ffffff;
		border-radius: 0 0 20rpx 0;
	}
}
.banner-item {
	background-color: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	padding: 30rpx;
	position: relative;
	overflow: hidden;
}
.banner-img {
	position: relative;
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	image {
		width: 100%;
		height: 320rpx;
		display: block;
	}
	.content-box {
		padding: 30rpx;
	}
}

.dz-edit-notify {
	width: 100%;
	border-radius: 12rpx;
	overflow: hidden;
	padding: 24rpx 30rpx 0 30rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: $dz-main-color;
	font-size: 24rpx;
}
</style>
