<template>
	<view>
		<dz-navbar :title="type ? '货款转赠记录' : '佣金转赠记录'" :border-bottom="false"></dz-navbar>
		<dz-tabs
			:list="tabList"
			:current="current"
			:is-scroll="false"
			bar-height="8"
			:active-color="theme.dzBaseColor"
			@change="tabChange"
			style="position: fixed;width: 100%;z-index: 2;"
		></dz-tabs>
		<view class="container">
			<view class="record">
				<view class="item" v-for="(item, index) in givingRecordList" :key="index">
					<view class="left">
						<image :src="item.receiver.head_portrait || missingFace"></image>
						<view class="user-info">
							<view class="title">ID: {{ item.receiver.id }}</view>
							<view class="title">用户名: {{ item.receiver.nickname }}</view>
							<view class="title">手机号: {{ item.receiver.mobile }}</view>

							<view class="time">申请时间: {{ item.created_at | timeFormat }}</view>
						</view>
					</view>
					<view style="display: flex; flex-direction: column;">
						<view class="right">{{ item.cash }}</view>
						<view class="flex dz-m-t-74 tip">
							<view class="status_0" v-if="item.state == 0">审核中</view>
							<view class="status_1" v-if="item.state == -1">已拒绝</view>
							<view class="status_2" v-if="item.state == 1">已通过</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" text="暂无转赠记录" :src="emptyOrder" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-ios-m-bline dz-p-b-20">
			<dz-loadmore  :status="loadingStatus" margin-top="20"></dz-loadmore>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			type: '',
			givingRecordList: [],
			missingFace: this.$api.assetsConfig.missingFace,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			page: 1,
			loadingStatus: 'loading',
			current: 0,
			tabList: [
				{
					value: '1',
					name: '已通过'
				},
				{
					value: '0',
					name: '审核中'
				},
				{
					value: '-1',
					name: '已拒绝'
				}
			],
			state: 1,
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type ? '货款转赠记录' : '佣金转赠记录'
		});
		if(option.type) {
			this.type = option.type
		}
		this.getGivingRecord();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.givingRecordList.length = 0;
		this.getGivingRecord();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getGivingRecord();
	},
	methods: {
		getGivingRecord() {
			this.loadingStatus = 'loading';
			this.$api.http
				.get(this.$api.apiDistribution.givingRecord, {
					params: {
						page: this.page,
						state: this.state,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.givingRecordList = [...this.givingRecordList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		},
		tabChange(e) {
			this.current = e;
			this.state = this.tabList[e].value;
			this.page = 1;
			this.givingRecordList.length = 0;
			this.getGivingRecord();
		}
	}
};
</script>

<style lang="scss">
.container {
	margin-top: 82rpx;
	.record {
		padding: 0 20rpx;
		background: #fff;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 10rpx;
			border-bottom: 1rpx solid $dz-bg-color;

			.left {
				display: flex;
				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 40rpx;
				}
			}
			.user-info {
				margin-left: 20rpx;
				.title {
				}
				.time {
					margin-top: 6rpx;
					font-size: 26rpx;
					color: #999;
				}
			}
		}
		.item:last-child {
			border: none;
		}
	}
}
.right {
	font-size: 32rpx;
}
.flex {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 32rpx;
	color: $dz-main-color;
	.status_0 {
		color: #fdc561;
	}
	.status_1 {
		color: $dz-type-error;
	}
	.status_2 {
		color: $dz-type-success;
	}
}
.tip {
	font-size: 26rpx;
	color: $dz-main-color;
}
.time {
	color: $dz-tips-color;
}
</style>
