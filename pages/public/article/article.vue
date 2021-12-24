<template>
	<view>
		<dz-navbar title="文章中心"></dz-navbar>
		<!--banner-->
		<dz-swiper
			v-if="banner.length"
			name="cover"
			:list="banner"
			:mode="'round'"
			:height="320"
			indicator-pos="bottomCenter"
			bgColor=""
			borderRadius="0"
			@click="swiperClick"
		></dz-swiper>
		<view class="tap dz-m-t-20" v-if="cateData.length > 0">
			<view class="title">栏目</view>
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
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.emptyOrder,
			banner: [],
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
			cateData: []
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: '文章中心'
		});
		if (e.cate_id) {
			this.cateId = e.cate_id;
		}
		await this.$onLaunched;
		this.getIndex();
		this.getArticle();
	},
	onPullDownRefresh: function() {
		this.page = 1;
		this.banner.length = 0;
		this.articleList.length = 0;
		this.getIndex();
		this.getArticle();
	},
	// 页面上拉触底事件的处理函数
	onReachBottom: function() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getArticle();
	},
	methods: {
		async getIndex() {
			await this.$api.http.get(this.$api.apiArticle.articleIndex).then(res => {
				this.banner = res.data.adv;
				this.cateData = res.data.cate;
			});
		},
		async getArticle() {
			if (this.loading) {
				uni.stopPullDownRefresh();
				return;
			}
			this.loadding = true;
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiArticle.getArticleIndex, {
					params: {
						page: this.page
					}
				})
				.then(res => {
					this.loading = false;
					uni.stopPullDownRefresh();
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.articleList = [...this.articleList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					uni.stopPullDownRefresh();
					this.loading = false;
					this.loadingStatus = 'loadmore';
				});
		},
		bannerTap(item) {
			if (this.$api.helper.isNumber(item.jump_link)) {
				this.$api.router.push({
					route: this.$api.routesConfig.articleDetail,
					query: {
						id: item.jump_link
					}
				});
			}
		},
		// 轮播图
		swiperClick(index) {
			const item = this.banner[index];
			this.$api.shop.advNavigate(item.jump_type, item.jump_link, item.id);
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
	margin: 0 20rpx;
	.title {
		padding-bottom: 20rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
	.scroll-tap {
		white-space: nowrap;

		.scroll-item {
			display: inline-block;
			margin-right: 20rpx;
			border-radius: 30rpx;
			background-color: #ffffff;
		}
		.scroll-item:last-child {
			margin-right: 0rpx;
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
