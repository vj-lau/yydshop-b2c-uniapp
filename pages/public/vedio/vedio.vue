<template>
	<view class="container"><video class="dz-video" :src="url" enable-danmu danmu-btn controls autoplay></video></view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			url: ''
		};
	},
	onLoad(e) {
		this.url = e.url;
		let title = e.title || this.language.vedio.titleVedio;
		uni.setNavigationBarTitle({
			title: title
		});
	},
	methods: {}
};
</script>

<style lang="scss">
page,
.container {
	height: 100%;
	background-color: #000000;
}
.container {
	display: flex;
	align-items: center;
	justify-content: center;
}
.dz-video {
	width: 100%;
	height: 100%;
}
</style>
