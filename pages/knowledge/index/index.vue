<template>
	<view class="knowledge-container">
		<dz-navbar title="知识付费首页"></dz-navbar>
		<view class="dz-p-24">
			<view class="dz-font-36 dz-m-b-20 dz-color-9">{{ title }}</view>
			<view class="dz-flex">
				<view style="flex-shrink: 0; margin-right: 10rpx;width: 30px;font-size: 30rpx;line-height: 60rpx;">类型</view>
				<dz-button-tabs
					style="width: 660rpx"
					:list="list"
					name="title"
					:height="50"
					:button-radius="12"
					bg-color="#fff"
					:active-color="theme.dzBaseFontColor"
					inactive-color="#333"
					:active-bg-color="theme.dzBaseColor"
					inactive-bg-color="#fff"
					:bold="true"
					:current="cateIndex"
					@change="cate"
				></dz-button-tabs>
			</view>
			<view class="dz-flex">
				<view style="flex-shrink: 0; margin-right: 10rpx;width: 30px;font-size: 30rpx;line-height: 60rpx;">分类</view>
				<dz-button-tabs
					style="width: 660rpx"
					:list="childList"
					name="title"
					:height="50"
					:button-radius="12"
					bg-color="#fff"
					:active-color="theme.dzBaseFontColor"
					inactive-color="#333"
					:active-bg-color="theme.dzBaseColor"
					inactive-bg-color="#fff"
					:bold="true"
					:current="child"
					@change="childCate"
				></dz-button-tabs>
			</view>
		</view>
		<view class="content">
			<dz-row gutter="20">
				<dz-col :span="4" v-for="item in content" :key="item.id">
					<view @click="particulars(item.id)" class="div">
						<image :src="item.cover"></image>
						<view class="txt">{{ item.title }}</view>
					</view>
				</dz-col>
			</dz-row>
		</view>
		<dz-loadmore v-if="loading" status="loading" margin-top="20" margin-bottom="20"></dz-loadmore>
		<view v-if="!content.length && !loading" class="dz-flex dz-flex-column dz-row-center">
			<dz-image :src="empty" width="360" height="360"></dz-image>
			<view style="color: rgb(192, 196, 204);">暂无知识内容~</view>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
		<!-- 提示 -->
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '全部',
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.emptyOrder,
			list: [],
			childList: [{ id: '9999999', title: '全部' }],
			cateIndex: 0,
			child: 0,
			content: [],
			allId: null,
			loadingShow: true,
			loading: false,
			loadingStatus: 'loading'
		};
	},
	async onLoad() {
		await this.$onLaunched;
		this.getList();
	},
	onPullDownRefresh() {
		this.getList();
		this.title = '全部';
		this.cateIndex = 0;
		this.child = 0;
	},
	methods: {
		getList() {
			this.$api.http.get(this.$api.apiShop.knowledgeCate).then(res => {
				this.list = res.data;
				this.list.unshift({
					id: '9999999',
					title: '全部'
				});
			});
			this.getContent();
			uni.stopPullDownRefresh();
		},
		cate(index, id, cate_id) {
			if (index == 0) {
				this.title = '全部';
				this.getContent();
				return (this.cateIndex = 0);
			}
			this.allId = this.list[index].id;
			this.getCateContent(this.allId);
			this.child = 0;
			this.cateIndex = index;
			this.title = this.list[index].title;
			this.$api.http
				.get(this.$api.apiShop.knowledgeChildCate, {
					params: {
						pid: id
					}
				})
				.then(res => {
					this.childList = res.data;
					this.childList.unshift({
						id: '9999999',
						title: '全部'
					});
				});
		},
		childCate(index, id) {
			if (index == 0) {
				if (this.cateIndex == 0) {
					this.getContent();
				} else {
					this.getCateContent(this.allId);
				}

				return (this.child = index);
			}
			this.child = index;
			this.getCateContent(id);
		},
		// 获取知识付费列表
		getContent() {
			this.$api.http
				.get(this.$api.apiShop.knowledgeList)
				.then(res => {
					this.content = res.data;
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 根据分类id获取知识付费列表
		getCateContent(id) {
			this.loading = true;
			this.content = [];
			this.$api.http
				.get(this.$api.apiShop.knowledgeList, {
					params: {
						cate_id: id
					}
				})
				.then(res => {
					this.content = res.data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 跳转到详情列表
		particulars(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.knowledgeParticulars,
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

<style lang="scss">
page,
.knowledge-container {
	height: 100%;
	background-color: #fff;
	.content {
		margin: 0 12rpx 20rpx;
		.div {
			margin-bottom: 20rpx;
			width: 100%;
			image {
				width: 100%;
				height: 300rpx;
				border-radius: 15rpx;
			}
			.txt {
				padding: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}
</style>
