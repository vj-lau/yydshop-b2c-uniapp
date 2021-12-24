<template>
	<view>
		<dz-navbar title="货款收益"></dz-navbar>
		<view class="tag-box">
			<dz-row gutter="16">
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">当日收益</view>
						<view>{{ estimateStat[0] ? estimateStat[0].warehouse.toFixed(2) : '0.00' }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">本月收益</view>
						<view>{{ estimateStat[1] ? estimateStat[1].warehouse.toFixed(2) : '0.00' }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">累计收益</view>
						<view>{{ userInfo.promoter ? userInfo.promoter.accumulate_brokerage : '0.00' }}</view>
					</view>
				</dz-col>
				<dz-col span="3">
					<view class="tag-item">
						<view class="title">待结算收益</view>
						<view>{{ userInfo.promoter ? userInfo.promoter.frozen_brokerage : '0.00' }}</view>
					</view>
				</dz-col>
			</dz-row>
		</view>
		<view class="order-box">
			<view class="order-item" v-for="(item, index) in promoterRecordTeamList" :key="index">
				<view class="num">
					<view>
						<text class="title">类型:</text>
						{{ parseInt(item.commission_type) == 1 ? '平台收益' : '货款结余' }}
					</view>
					<text :class="[colorFilters(item.state)]">{{ item.state | filterStateText }}</text>
				</view>
				<dz-line></dz-line>
				<view class="cell">
					<text>进货商ID:</text>
					{{ item.member.id }}
				</view>
				<view class="cell">
					<text>进货商昵称:</text>
					{{ item.member.nickname }}
				</view>
				<view class="cell">
					<text>销售商品:</text>
					{{ item.remark }}
				</view>
				<view class="cell">
					<text>销售数量:</text>
					{{ item.num }}
				</view>
				<view class="cell">
					<text>订单号:</text>
					{{ item.map_sn }}
				</view>
				<view class="cell dz-m-b-10">
					<text>销售时间:</text>
					{{ item.created_at | timeFormat }}
				</view>
				<dz-line></dz-line>
				<view class="price dz-m-t-10">
					收益金额：
					<text :style="{ color: theme.dzBaseColor }">{{ item.commission_money }}</text>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" text="暂无收益数据" margin-top="80" :src="emptyData" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-page-loading :show="loadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			emptyData: this.$api.assetsConfig.emptyData,
			page: 1,
			loadingStatus: 'loading',
			promoterRecordTeamList: [],
			loadingShow: true,
			pageLoadingStatus: 'loading',
			estimateStat: []
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '货款收益'
		});
		this.getIncomeList();
		this.getEstimateStat();
	},
	filters: {
		filterStateText(val) {
			switch (parseInt(val)) {
				case 1:
					return '已完成';
				case 0:
					return '待结算';
				case -1:
					return '已关闭';
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.promoterRecordTeamList.length = 0;
		this.loadingShow = true;
		this.userInfo = {};
		this.getIncomeList();
		this.getWarehouseIndex();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getIncomeList();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		colorFilters(val) {
			switch (parseInt(val)) {
				case 1:
					return 'color1';
				case 0:
					return 'color2';
				case -1:
					return 'color3';
			}
		},
		loadingClick() {
			this.getIncomeList();
		},
		getEstimateStat() {
			this.$api.http.get(this.$api.apiDistribution.estimateStat).then(res => {
				this.estimateStat = res.data.estimateStat;
			});
		},
		async getIncomeList() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiDistribution.promoterRecordIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.loadingShow = false;
					this.promoterRecordTeamList = [...this.promoterRecordTeamList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.tag-box {
	padding: 14rpx;
}
.tag-item {
	padding: 10rpx;
	background: #fff;
	border-radius: 15rpx;
	text-align: center;
	font-size: 24rpx;
	.title {
		color: #999;
	}
}
.color1 {
	color: #41cc8b;
}
.color2 {
	color: rgb(255, 196, 63);
}
.color3 {
	color: #fd5548;
}
.order-box {
	padding: 0 20rpx;
	.order-item {
		padding: 20rpx;
		background: #fff;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		.num {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;
			.title {
				color: #999;
				margin-right: 6rpx;
			}
		}
		.price {
			text-align: right;
			text {
				color: red;
			}
		}
		.cell {
			line-height: 46rpx;
			text {
				color: #999;
				margin-right: 6rpx;
			}
		}
	}
}

.order-content {
	display: flex;
	justify-content: space-between;
	margin: 15rpx 0;
	.left {
		display: flex;
		.image {
			flex-shrink: 0;
			width: 130rpx;
			height: 130rpx;
			border-radius: 10rpx;
		}
		.title {
			margin-left: 20rpx;
			.name {
				line-height: 40rpx;
				color: $dz-main-color;
				font-size: 28rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
			.sku {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.right {
		.price-box {
			margin-left: 10rpx;
			text-align: right;
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
}
</style>
