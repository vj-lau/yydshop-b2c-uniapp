<template>
	<view>
		<dz-navbar :title="'客服服务'"></dz-navbar>
		<view class="service-index">
			<view class="header">
				<view class="service-item" @tap="service">
					<text class="dzicon-iconfont dzicon-message icon"></text>
					<text>联系客服</text>
					<text class="time">{{ serviceConfig.config.service_working_hours }}</text>
				</view>
				<view class="service-item" @tap="callPhone">
					<text class="dzicon-iconfont dzicon-phone icon"></text>
					<text>专属热线</text>
					<text class="time">{{ serviceConfig.config.service_on_line_working_hours }}</text>
				</view>
			</view>
			<view class="title">常见问题</view>
			<view v-if="serviceConfig.questions.length > 0">
				<dz-cell-group v-for="(item, index) in serviceConfig.questions" :key="index" :arrow="true">
					<dz-cell-item :title="`${index + 1}. ${item.title}`" @tap="detail(item.id)"></dz-cell-item>
				</dz-cell-group>
			</view>
			<view class=" dz-text-center text-grey padding" v-if="serviceConfig.questions.length == 0 && loaded">暂无常见问题</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			serviceConfig: {
				config: {},
				questions: []
			},
			loaded: false
		};
	},
	async onLoad() {
		await this.$onLaunched;
		this.getQuestionsIndex();
	},
	methods: {
		async getQuestionsIndex() {
			await this.$api.http.get(this.$api.apiService.questionsIndex).then(res => {
				this.serviceConfig = res.data;
			});
			this.loaded = true;
		},
		service() {
			this.$api.router.push({
				route: this.$api.routesConfig.service,
				query: {}
			});
		},
		callPhone() {
			if (!this.serviceConfig.config.service_mobile) {
				return;
			}
			uni.makePhoneCall({
				phoneNumber: this.serviceConfig.config.service_mobile
			});
		},
		detail(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.serviceDetail,
				query: {
					id: id
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}

.service-index {
	.header {
		display: flex;
		justify-content: space-between;
		text-align: center;
		margin: 60rpx 120rpx;

		.service-item {
			line-height: 1.5;

			.icon {
				display: block;
				font-size: 72rpx;
				color: #333;
			}
			.time {
				display: block;
				font-size: 24rpx;
				color: #909399;
			}
		}
	}
	.title {
		height: 80rpx;
		background-color: #f8f8f8;
		line-height: 80rpx;
		padding: 0 30rpx;
	}
}
</style>
