<template>
	<view class="diy-page">
		<dz-navbar title="内容"></dz-navbar>
		<view class="box">
			<view class="title">{{ list.title }}</view>
			<view class="content"><dz-parse :html="list.content" lazy-load></dz-parse></view>
		</view>
		<!-- 加载 -->
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: {},
			id: null,
			loadingShow: true,
			loadingStatus: 'loading'
		};
	},
	async onLoad(e) {
		this.id = e.id;
		await this.getList();
	},
	methods: {
		getList() {
			this.$api.http
				.post(this.$api.apiShop.knowledgeContent, {
					id: this.id
				})
				.then(res => {
					this.list = res.data;
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
		}
	}
};
</script>

<style lang="scss" scoped>
page,
.diy-page {
	height: 100%;
	background-color: #fff;
}
.box {
	width: 100%;
	padding: 10rpx;
	.title {
		text-align: center;
		font-weight: 520;
		color: #000;
		font-size: 35rpx;
	}
	.content {
		margin-top: 20rpx;
	}
}
</style>
