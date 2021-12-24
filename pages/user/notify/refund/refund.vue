<template>
	<view>
		<dz-navbar title="售后服务" :border-bottom="false"></dz-navbar>
		<view>
			<block v-for="(item, index) in notifyList" :key="index">
				<view class="order">
					<view class="time">{{ item.notify.created_at | timeFormat }}</view>
					<view class="item" @tap="tapPage(item, index)" v-if="item.notify">
						<view class="title">
							<view class="name">{{ item.notify.title }}</view>
							<view class="message" :style="{ background: theme.dzBaseColor }" v-if="parseInt(item.is_read) == 0"></view>
						</view>
						<view class="tip">{{ item.notify.content }}</view>
						<view class="status" v-if="parseInt(item.is_read) == 1">已读</view>
					</view>
				</view>
			</block>
			<dz-empty v-if="loadingStatus == 'noData'" text="还没有消息" margin-top="80" :src="emptyMsg" iconSize="360"></dz-empty>
			<view v-if="loadingStatus != 'noData'" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore :status="loadingStatus"></dz-loadmore></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyMsg: this.$api.assetsConfig.emptyMsg,
			page: 1,
			notifyList: [],
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '售后服务'
		});
		await this.$onLaunched;
		this.getNotifyIndex();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getNotifyIndex();
	},
	methods: {
		async getNotifyIndex() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.notifyIndex, {
					params: {
						target_type: 'order_return_apply,order_return_customer_apply,order_return_money',
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
		},
		tapPage(item, index) {
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
.order {
	padding: 20rpx 20rpx 0 20rpx;
	.time {
		text-align: center;
		margin-bottom: 20rpx;
	}
	.item {
		background-color: #ffffff;
		border-radius: 15rpx;
		margin-bottom: 30rpx;
		padding: 30rpx;
		position: relative;
		overflow: hidden;
	}
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.name {
			font-size: 32rpx;
			color: $dz-main-color;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.message {
			flex-shrink: 0;
			margin-left: 20rpx;
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
		}
	}
	.tip {
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
		padding: 0 20rpx;
		color: #ffffff;
		border-radius: 0 0 15rpx 0;
	}
}
</style>
