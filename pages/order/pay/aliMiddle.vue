<template>
	<view class="screen">
		<view class="warp">
			<view>
				<view class="dz-text-center"><dz-icon name="alip" size="100" color="rgb(0,164,233)"></dz-icon></view>
				<view class="dz-text-center dz-p-t-20 tip">点击“确认支付”会要求支付宝授权，请选择允许</view>
				<a target="_blank" class="link" :href="schemeAlipay" @tap="schemeAlipayClick"><dz-button class="dz-m-t-50" @click="schemeAlipayClick">确认支付</dz-button></a>
				<dz-button v-if="alipayResultShow" class="dz-m-t-50" @click="getPayResult">如已支付完成，点击查看支付结果</dz-button>
			</view>
		</view>
		<view v-if="wechatTipshow">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="pay-tip">
				<view class="dz-content"><image :src="live" width="100%"></image></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			wechatTipshow: false,
			live: this.$api.assetsConfig.liveWechat,
			params: {},
			url: '',
			schemeAlipay: '',
			aliPayShow: false,
			alipayResultShow: false
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: '支付宝支付'
		});
		await this.$onLaunched;
		// #ifdef H5
		if (this.$api.helper.h5IsWechat()) {
			this.wechatTipshow = true;
		}
		this.params = e;
		this.url = e.url;
		this.schemeAlipay = 'alipays://platformapi/startapp?appId=20000067&url=' + encodeURIComponent(this.url);
		console.log(this.url);
		console.log(this.schemeAlipay);
		// #endif
		// #ifndef H5
		console.log('not in browser');
		// #endif
	},
	methods: {
		tapBack() {
			this.$api.router.back();
		},
		schemeAlipayClick() {
			this.alipayResultShow = true;
		},
		getPayResult() {
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.payComplete,
				query: { ...this.params }
			});
		}
	}
};
</script>

<style lang="scss">
.screen {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 1;
	background-color: #fff;
	transition: transform 0.3s;
}

.warp {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.tip {
	font-size: 26rpx;
	color: $dz-tips-color;
}
.mask {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 9999998;
	background-color: rgba(0, 0, 0, 0.6);
}
.pay-tip {
	position: fixed;
	z-index: 9999999;
	top: 20rpx;
	right: 30rpx;
}
.link {
	text-decoration: none;
}
</style>
