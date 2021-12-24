<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.modifyMobile.titleModifyMobile"></dz-navbar>
		<view class="dz-form">
			<dz-form label-width="130" labelAlign="left">
				<dz-form-item :label="language.modifyMobile.labelMobileOld"><dz-input type="text" :value="'+' + String(areaCode) + '-' + mobile" :disabled="true" /></dz-form-item>
				<dz-form-item :label="language.modifyMobile.labelCode">
					<input type="text" v-model="code" :disabled="loading" :placeholder="language.modifyMobile.codeHolder" />
					<dz-button
						slot="right"
						size="mini"
						hoverClass="none"
						:border="false"
						:customStyle="{ background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
						:disabled="waitingCaptcha"
						@click="getCode"
					>
						{{ waitingCaptcha ? $api.helper.formatString(language.modifyMobile.getCaptchaLater, waitingSecond) : language.modifyMobile.getCaptcha }}
					</dz-button>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="button" style="margin-top: 100rpx;">
			<dz-button :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" :border="false" hover-class="none" @click="submit">
				{{ language.modifyMobile.submitVerify }}
			</dz-button>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			areaCode: this.$api.store.state.userInfo.mobile_area,
			mobile: this.$api.store.state.userInfo.mobile,
			code: '',
			loading: false,
			lastCaptchaTimeStamp: 0,
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			timeInterval: null
		};
	},
	computed: {},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.modifyMobile.titleModifyMobile
		});
		await this.$onLaunched;
	},
	onShow() {
		this.computeLastCaptcha();
	},
	methods: {
		computeLastCaptcha() {
			if (this.timeInterval) {
				return;
			}
			this.lastCaptchaTimeStamp = this.$api.store.state.lastCaptchaTimeStamp;
			let timeNow = parseInt(new Date().getTime() / 1000);
			let timeDiff = timeNow - this.lastCaptchaTimeStamp;
			if (timeDiff < this.$api.appConfig.loginCodeSecond && timeDiff >= 0) {
				this.waitingCaptcha = true;
				this.waitingSecond = this.$api.appConfig.loginCodeSecond - timeDiff;
				this.timeInterval = setInterval(() => {
					this.waitingSecond--;
					if (this.waitingSecond <= 0) {
						this.waitingCaptcha = false;
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
				}, 1000);
			} else {
				this.waitingCaptcha = false;
			}
		},
		getCode() {
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.codeLoading
			});
			this.$api.http
				.post(this.$api.apiShop.smsCode, {
					mobile: this.mobile,
					mobile_area: this.areaCode,
					usage: 'unbind'
				})
				.then(res => {
					uni.hideLoading();
					this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
					this.$api.store.commit('setLastInputMobile', this.mobile);
					this.$api.store.commit('setLastSelectMobileArea', this.areaCode);
					this.computeLastCaptcha();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//验证旧手机号码
		submit() {
			if (this.loading) {
				return;
			}
			if (!this.code) {
				this.$refs.dzToast.show({
					title: this.$api.language.modifyMobile.codeError,
					type: 'warning'
				});
				return;
			}
			this.loading = true;
			uni.showLoading({
				mask: true
			});
			let formData = {
				mobile: this.mobile,
				mobile_area: this.areaCode,
				code: this.code,
				id: this.$api.store.state.userInfo.id
			};

			// #ifdef APP-PLUS
			let platform = this.$api.systemInfo.platform;
			if (platform == 'ios') {
				formData.group = 'ios';
			} else if (platform == 'android') {
				formData.group = 'android';
			} else {
				formData.group = 'app';
			}
			// #endif

			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				formData.group = 'wechat';
			} else {
				formData.group = 'h5';
			}
			// #endif

			// #ifdef  MP-WEIXIN
			formData.group = 'wechatMp';
			// #endif

			// #ifdef  MP-QQ
			formData.group = 'qqMp';
			// #endif

			// #ifdef MP-ALIPAY
			formData.group = 'aliMp';
			// #endif

			// #ifdef MP-BAIDU
			formData.group = 'baiduMp';
			// #endif

			// #ifdef MP-TOUTIAO
			formData.group = 'touTiaoMp';
			// #endif

			// #ifdef MP-360
			formData.group = '360Mp';
			// #endif

			this.$api.http
				.post(this.$api.apiShop.mobileUnBind, {
					...formData
				})
				.then(res => {
					this.loading = false;
					uni.hideLoading();
					//跳转到第二步
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.modifyMobileStep2,
						query: {}
					});
				})
				.catch(err => {
					this.loading = false;
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-form {
	background-color: #fff;
	padding: 0 20rpx;
}

.tip {
	margin-top: 30rpx;
	text-align: center;
	color: $dz-tips-color;
	font-size: 24rpx;
}

.button {
	margin: 0 30rpx;
}
</style>
