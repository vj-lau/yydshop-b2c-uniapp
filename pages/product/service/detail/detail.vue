<template>
	<view class="service-detail">
		<dz-navbar :title="'常见问题'"></dz-navbar>
		<view class="question padding solid-bottom" v-if="questionDetail">{{ questionDetail.title }}</view>
		<view class="answer padding" v-if="questionDetail">
			<view class="dz-news-content"><dz-parse :html="questionDetail.content"></dz-parse></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			questionDetail: {}
		};
	},
	async onLoad(e) {
		await this.$onLaunched;
		this.getQuestionsView(e.id);
	},
	methods: {
		async getQuestionsView(id) {
			await this.$api.http
				.get(this.$api.apiService.questionsView, {
					params: {
						id: id
					}
				})
				.then(res => {
					this.questionDetail = res.data;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fff;
}
.service-detail {
	margin-top: 40rpx;
	font-size: 28rpx;
	.question,
	.answer {
		margin: 20rpx 30rpx;
	}
	.answer-content {
		display: inline-block;
		margin-left: 6rpx;
	}
}
</style>
