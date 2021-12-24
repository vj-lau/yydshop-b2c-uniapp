<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.modifyPassword.titleModifyPassword"></dz-navbar>
		<view class="dz-form">
			<dz-form>
				<dz-form-item :label="language.modifyPassword.labelMobile" label-width="140">
					<dz-input type="text" :value="'+' + String(areaCode) + '-' + mobile" :disabled="true" />
				</dz-form-item>
				<dz-form-item :label="language.modifyPassword.labelPassword" label-width="140">
					<dz-input type="password" v-model="password" maxlength="20" placeholder="请输入密码" />
				</dz-form-item>
				<dz-form-item :label="language.modifyPassword.labelConfirmPassword" label-width="140">
					<dz-input type="password" v-model="confirmPassword" maxlength="20" placeholder="请输入确认密码" />
				</dz-form-item>
				<dz-form-item :label="language.modifyPassword.labelCode" label-width="140">
					<dz-input type="text" v-model="code" :disabled="loading" :placeholder="language.modifyPassword.codeHolder" />
					<dz-button
						slot="right"
						type="info"
						size="mini"
						hover-class="none"
						:border="false"
						:custom-style="{ background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
						:disabled="codeDisabled || waitingCaptcha"
						@click="getCode"
					>
						{{ waitingCaptcha ? $api.helper.formatString(language.modifyPassword.getCaptchaLater, waitingSecond) : language.modifyPassword.getCaptcha }}
					</dz-button>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="button" style="margin-top: 100rpx;">
			<dz-button
				:border="false"
				:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
				hover-class="none"
				:loading="loading"
				@click="submit"
			>
				{{ language.modifyPassword.submit }}
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
			password: '',
			confirmPassword: '',
			loading: false,
			lastCaptchaTimeStamp: 0,
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			timeInterval: null
		};
	},
	computed: {
		codeDisabled() {
			if (this.$api.helper.isMobile(this.areaCode + this.mobile, this.areaCode)) {
				return false;
			}
			return true;
		}
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.modifyPassword.titleModifyPassword
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
		areaClick() {
			this.areaSelect = true;
		},
		areaConfirm(e) {
			this.areaCode = e[0].value;
			this.areaCodeLabel = e[0].label;
		},
		getCode() {
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.codeLoading
			});
			if (this.$api.helper.isMobile(String(this.areaCode) + this.mobile, this.areaCode)) {
				this.$api.http
					.post(this.$api.apiShop.smsCode, {
						mobile: this.mobile,
						mobile_area: this.areaCode,
						usage: 'up-pwd'
					})
					.then(res => {
						uni.hideLoading();
						this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
						this.computeLastCaptcha();
					})
					.catch(err => {
						uni.hideLoading();
					});
			} else {
				this.$refs.dzToast.show({
					title: this.$api.language.thirdPartyLogin.mobileError,
					type: 'warning'
				});
				uni.hideLoading();
			}
		},
		//修改密码
		submit() {
			if (this.loading) {
				return;
			}
			if (!this.password) {
				this.$refs.dzToast.show({
					title: '请输入密码',
					type: 'warning'
				});
				return;
			}
			if (!this.confirmPassword) {
				this.$refs.dzToast.show({
					title: '请重新输入密码',
					type: 'warning'
				});
				return;
			}
			if (this.password != this.confirmPassword) {
				this.$refs.dzToast.show({
					title: '两次输入的密码不一致',
					type: 'warning'
				});
				return;
			}
			if (!this.code) {
				this.$refs.dzToast.show({
					title: '请输入手机验证码',
					type: 'warning'
				});
				return;
			}
			this.loading = true;

			let formData = {
				mobile: this.mobile,
				mobile_area: this.areaCode,
				password: this.password,
				password_repetition: this.confirmPassword,
				code: this.code
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
			formData.group = 'qliMp';
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
				.post(this.$api.apiShop.updatePassword, {
					...formData
				})
				.then(res => {
					this.loading = false;
					this.$api.store.commit('login', res.data);
					this.$refs.dzToast.show({
						title: '密码修改成功',
						type: 'success'
					});
				})
				.catch(err => {
					this.loading = false;
					this.$refs.dzToast.show({
						title: err,
						type: 'error'
					});
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
