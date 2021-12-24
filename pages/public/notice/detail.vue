<template>
	<view>
		<dz-navbar :is-fixed="true" :title="pageTitle"></dz-navbar>
		<view class="container">
			<view class="dz-news-title">{{ announceDetail.title }}</view>
			<view class="dz-sub-info">
				<view class="dz-sub-left">{{ announceDetail.created_at | timeFrom }}</view>
				<view class="dz-sub-right">{{ language.application.read }} {{ announceDetail.view ? parseInt(announceDetail.view) + 1 : '' }}</view>
			</view>
			<view class="dz-news-content"><dz-parse :html="announceDetail.content"></dz-parse></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			announceDetail: {},
			id: '',
			pageTitle: this.$api.language.noticeDetail.titleNoticeDetail
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({ title: this.$api.language.noticeDetail.titleNoticeDetail });
		this.id = e.id;
		await this.$onLaunched;
		this.getNotifyAnnounceView(e.id);
	},
	methods: {
		async getNotifyAnnounceView(id) {
			await this.$api.http
				.get(this.$api.apiShop.notifyAnnounceView, { params: { id: id } })
				.then(res => {
					this.announceDetail = res.data;
					this.pageTitle = res.data.title;
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
	color: $dz-main-color;
}

.container {
	padding: 40rpx 30rpx 110rpx 30rpx;
	box-sizing: border-box;
}

.dz-news-title {
	font-size: 48rpx;
	font-weight: 500;
	text-align: justify;
}

.dz-sub-info {
	padding-top: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: $dz-tips-color;
}

.dz-news-content {
	padding-top: 40rpx;
}
</style>
