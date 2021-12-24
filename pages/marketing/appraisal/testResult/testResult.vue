<template>
	<view>
		<dz-navbar title="测评结果"></dz-navbar>
		<dz-empty v-if="list == null" text="暂无测评结果" :src="empty" iconSize="360"></dz-empty>
		<view v-else>
			<view class="form-box"><dz-parse :html="list.suggest" lazy-load></dz-parse></view>
			<view class="dz-content">
				<dz-cell-item
					title="推荐商品"
					:arrow="false"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
					:border-bottom="false"
				></dz-cell-item>
				<view style="margin-top: -20rpx;">
					<scroll-view scroll-x class="h-list-history" v-if="list.products.length != 0">
						<view class="h-item-history" v-for="item in list.products" :key="item.id" @tap.stop="navToProduct(item, item.product_id)">
							<view class="h-item-img"><dz-image :src="item.product_picture" borderRadius="12" width="180" height="180" mode="aspectFill"></dz-image></view>
							<view class="h-item-text">{{ item.product_name }}</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			score: null,
			subject_id: null,
			loadingShow: true,
			loadingStatus: 'loading',
			list: {
				products: ['0']
			}
		};
	},
	async onLoad(e) {
		this.score = e.score;
		this.subject_id = e.subject_id;
		await this.$onLaunched;
		this.getList();
	},
	methods: {
		getList() {
			this.$api.http
				.post(this.$api.apiShop.appraisalPreserve, {
					subject_id: this.subject_id,
					score: this.score
				})
				.then(res => {
					this.list = res.data;
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
		},
		navToProduct(type, id) {
			if (parseInt(type.status) == 0)
				return this.$refs.dzToast.show({
					title: this.$api.language.user.productTheShelves,
					type: 'warning'
				});
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id: id
				}
			});
		},
		loadingClick() {
			this.getList();
		}
	}
};
</script>

<style lang="scss" scoped>
.form-box {
	background: #fff;
	padding: 20rpx;
}

.dz-content {
	background-color: #fff;
	margin: 24rpx 0 0 0;
	border-radius: 20rpx;
	box-shadow: 0rpx 5rpx 25rpx rgba(0, 0, 0, 0.05);
	overflow: hidden;
}

.h-list-history {
	margin: 0;
	padding-left: 20rpx;
	border-radius: 10rpx;
	white-space: nowrap;

	.h-item-history {
		background-color: #fff;
		display: inline-block;
		font-size: 24rpx;
		color: $dz-tips-color;
		width: 180rpx;
		margin: 20rpx 20rpx 0 0;
		border-radius: 10upx;
		position: relative;
		top: 0;
		overflow: hidden;

		.h-item-img {
			width: 100%;
			height: 180rpx;
			border-radius: 12rpx;
		}

		.tag {
			position: absolute;
			border-top-left-radius: 12rpx;
			top: 0;
			left: 0;
			width: 60rpx;
			height: 60rpx;
		}

		.h-item-text {
			display: flex;
			white-space: normal;
			width: 170rpx;
			height: 52rpx;
			line-height: 26rpx;
			font-size: 20rpx;
			margin: 10rpx 6rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
}

.no-foot-print {
	text-align: center;
	padding: 48rpx 0;
}
</style>
