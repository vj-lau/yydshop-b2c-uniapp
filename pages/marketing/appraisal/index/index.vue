<template>
	<view>
		<dz-navbar title="测评首页" :immersive="true"></dz-navbar>
		<view class="form-box">
			<img :style="{ width: '100%', height: parseInt(pageConfig.pictureHeight) + 'px' }" :src="list.cover" />
			<view class="title">{{ list.title }}</view>
			<view class="btn">
				<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" @click="open">立即开启</dz-button>
			</view>
		</view>
	</view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
export default {
	data() {
		return {
			theme: this.$api.theme,
			id: null,
			list: {},
			pageConfig: {
				pictureHeight: 667
			}
		};
	},
	async onLoad(e) {
		this.id = e.cate_id;
		await this.$onLaunched;
		this.getList();
	},
	methods: {
		getList() {
			this.$api.http
				.get(this.$api.apiShop.appraisalList, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					this.list = res.data;
					this.pageConfig.pictureHeight = systemInfo.windowHeight;
				});
		},
		open() {
			this.$api.router.push({
				route: this.$api.routesConfig.appraisalSubject,
				query: {
					cate_id: this.id
				}
			});
		}
	}
};
</script>

<style lang="scss">
.form-box {
	background: #fff;
	position: relative;

	img {
		display: block;
		width: 100%;
		height: 100%;
		background-repeat: no-repeat;
		top: 0;
		left: 0;
		z-index: 0;
		background-size: cover;
		background-position: center center;
		overflow: hidden;
		font-size: 0;
		width: 100%;
		vertical-align: bottom;
	}

	.title {
		width: 100%;
		padding: 0 30rpx;
		position: absolute;
		font-size: 60rpx;
		top: 200rpx;
		text-align: center;
		color: #fff;
	}

	.btn {
		width: 50%;
		position: absolute;
		bottom: 150rpx;
		left: 25%;
	}
}
</style>
