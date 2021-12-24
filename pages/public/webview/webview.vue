<template>
	<view><web-view :webview-styles="webviewStyles" :src="url" @message="handleMessage"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			url: '',
			webviewStyles: {
				progress: {
					color: this.$api.theme.dzBaseColor
				}
			}
		};
	},
	onLoad(e) {
		this.url = this.$api.helper.strDecode(e.url);
		uni.setNavigationBarTitle({
			title: this.$api.shopSetting.store_name
		});
	},
	methods: {
		//H5需要使用window.postMessage
		handleMessage(e) {
			console.log('接收到的消息：' + JSON.stringify(e.detail.data));
		}
	}
};
</script>

<style></style>
