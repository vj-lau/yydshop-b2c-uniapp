<template>
	<view>
		<dz-navbar :title="title"></dz-navbar>
		<view class="tap dz-m-t-20" v-if="cateData.length > 0">
			<view>
				<scroll-view scroll-x class="scroll-tap">
					<block v-for="(item, index) in cateData" :key="index">
						<view class="scroll-item dz-line-1" @tap="cateTap(item)">
							<view class="text dz-line-1">{{ item.title }}</view>
						</view>
					</block>
				</scroll-view>
			</view>
		</view>
		<!--文章列表-->
		<dz-article
			:list="articleList"
			:mode="articleConfig.mode"
			:defaultList="articleConfig.list"
			:data-source="articleConfig.dataSource"
			:top-bottom="parseInt(articleConfig.topBottom) * 2"
			:left-right="parseInt(articleConfig.leftRight) * 2"
			:card-margin="parseInt(articleConfig.cardMargin) * 2"
			:card-padding="parseInt(articleConfig.cardPadding) * 2"
			:content-padding="parseInt(articleConfig.contentPadding) * 2"
			:radius="parseInt(articleConfig.radius) * 2"
			:radius1="parseInt(articleConfig.radius1) * 2"
			:radius2="parseInt(articleConfig.radius2) * 2"
			:width="parseInt(articleConfig.width) * 2"
			:height="parseInt(articleConfig.height) * 2"
			:is-description="articleConfig.isDescription"
			:is-time="articleConfig.isTime"
			:is-view-count="articleConfig.isViewCount"
		></dz-article>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.emptyOrder,
			articleList: [],
			cateId: '',
			loadingStatus: 'loading',
			page: 1,
			articleConfig: {
				cardMargin: 10,
				cardPadding: 0,
				contentPadding: 10,
				dataSource: 'manual',
				height: 160,
				isDescription: 1,
				isTime: 1,
				isViewCount: 1,
				leftRight: 10,
				mode: 'max',
				num: 1,
				radius: 10,
				radius1: 10,
				radius2: 0,
				topBottom: 10,
				width: 112
			},
			cateData: [],
			title: ''
		};
	},
	async onLoad(option) {
		this.title = option.title;
		this.cateId = option.id;
		if (option.title) {
			uni.setNavigationBarTitle({
				title: option.title
			});
		} else {
			uni.setNavigationBarTitle({
				title: '文章列表'
			});
		}
		await this.$onLaunched;
		this.getCateChilds();
		this.getArticle();
	},
	onPullDownRefresh: function() {
		this.page = 1;
		this.cateData.length = 0;
		this.articleList.length = 0;
		this.getCateChilds();
		this.getArticle();
	},
	// 页面上拉触底事件的处理函数
	onReachBottom: function() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getArticle();
	},
	methods: {
		async getCateChilds() {
			await this.$api.http
				.get(this.$api.apiArticle.articleCateChilds, {
					params: {
						id: this.cateId
					}
				})
				.then(res => {
					this.cateData = res.data;
				});
		},
		async getArticle() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiArticle.getArticleIndex, {
					params: {
						page: this.page,
						cate_id: this.cateId,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.articleList = [...this.articleList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		cateTap(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.articleList,
				query: {
					id: item.id,
					title: item.title
				}
			});
		},
		detailTap(id, title) {
			this.$api.router.push({
				route: this.$api.routesConfig.articleDetail,
				query: {
					id: id,
					title: title
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.tap {
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	.title {
		padding: 20rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
	.scroll-tap {
		white-space: nowrap;
		padding: 0 20rpx;
		.scroll-item {
			display: inline-block;

			margin-right: 20rpx;
			border-radius: 30rpx;
			background-color: #ffffff;
		}
		.text {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 160rpx;
			height: 60rpx;
		}
	}
}
</style>
