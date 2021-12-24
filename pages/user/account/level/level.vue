<template>
	<view>
		<dz-navbar title="会员等级"></dz-navbar>
		<view class="account-level">
			<view class="title">会员级别列表</view>
			<view class="advance-area">
				<view class="flex-box tc thead">
					<view class="item-3">级别名称</view>
					<view class="item-3">升级条件(元)</view>
					<view class="item-3">说明</view>
				</view>
				<view class="flex-box table tc" v-for="(item, index) in memberLevelList" :key="index">
					<text class="item-3">{{ item.name }}</text>
					<text class="item-3">
						<text>{{ item.upgrade_condition.toString() }}</text>
					</text>
					<text class="item-3 font-sm"><text>会员商品有折扣优惠</text></text>
				</view>
			</view>
		</view>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStaus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageLoadingShow: true,
			pageLoadingStaus: 'loading',
			memberLevelList: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '会员等级'
		});
		await this.$onLaunched;
		this.getMemberLevelIndex();
	},
	methods: {
		loadingClick() {
			this.getMemberLevelIndex();
		},
		getMemberLevelIndex() {
			this.$api.http
				.get(this.$api.apiShop.memberLevelIndex)
				.then(res => {
					this.memberLevelList = res.data;
					this.pageLoadingShow = false;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingShow = 'error';
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}
.account-level {
	padding: 30rpx;
	display: flex;
	flex: 1;
	flex-direction: column;
	.flex-box {
		display: flex;
		flex-wrap: wrap;
	}
	.flex-box > .item-2 {
		flex: 0 0 50%;
	}
	.flex-box > .item-3 {
		flex: 0 0 33.3333%;
		height: 100rpx;
	}
	.flex-box > .item-4 {
		flex: 0 0 25%;
	}
	.title {
		margin: 30rpx 0;
		font-size: 32rpx;
		font-weight: 600;
		color: $dz-main-color;
	}
	//普通表格
	.genaral-area {
		.item-2 {
			font-size: 26rpx;
			border: 1rpx solid $dz-border-color;
			border-width: 1rpx 1rpx 0 0;
			padding: 16rpx 0;
			box-sizing: border-box;
			text-align: center;

			&:first-child {
				border-left-width: 1rpx;
			}

			&:last-child {
				border-right-width: 1rpx;
			}
		}

		.thead {
			.item-2 {
				font-weight: bold;

				box-sizing: border-box;
			}
		}

		.table {
			&:last-child {
				border-bottom: 1rpx solid $dz-border-color;
			}

			.item-2 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
	}
	// 多行合并表格
	.advance-area {
		.item-3,
		.item-4 {
			font-size: 26rpx;
			border: 1rpx solid $dz-border-color;
			border-width: 1rpx 1rpx 0 0;
			box-sizing: border-box;
			text-align: center;
			&:first-child {
				border-left-width: 1rpx;
			}

			&:last-child {
				border-right-width: 1rpx;
			}
		}
		.thead {
			.item-3,
			.item-4 {
				font-weight: bold;
				padding: 16rpx 0;
				box-sizing: border-box;
			}
		}
		.table {
			&:last-child {
				border-bottom: 1rpx solid $dz-border-color;
			}

			.item-3,
			.item-4 {
				display: flex;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
			}
		}
		.table-flex {
			flex: 1;

			.item {
				border-bottom: 1rpx solid $dz-border-color;
				padding: 10rpx 0;
				box-sizing: border-box;

				&:last-child {
					border-width: 0;
				}
			}
		}
		.font-sm {
			font-size: 24rpx;
			padding: 0 10rpx;
		}
	}
}
</style>
