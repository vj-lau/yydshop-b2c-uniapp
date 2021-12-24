<template>
	<view class="content">
		<dz-navbar :title="title"></dz-navbar>
		<dz-parse :html="content" lazy-load></dz-parse>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			field: '',
			content: ''
		};
	},
	async onLoad(options) {
		uni.setNavigationBarTitle({
			title: options.title
		});
		this.title = options.title;
		this.field = options.field;
		await this.$onLaunched;
		this.getConfigList();
	},
	methods: {
		async getConfigList() {
			if (!this.field) {
				return;
			}
			await this.$api.http
				.get(this.$api.apiShop.commonProtocol, {
					params: {
						type: this.field
					}
				})
				.then(res => {
					this.content = res.data.content;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	background-color: #fff;
}
.content {
	padding: 20rpx;
	background-color: #fff;
}
</style>
