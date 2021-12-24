<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.thirdPartyLogin.titleLogin"></dz-navbar>
		<view class="mobile-bind" v-if="mobileBindShow">
			<view class="dz-form">
				<dz-form-item :label="language.thirdPartyLogin.labelMobile" label-width="130">
					<view class="dz-flex">
						<view class="dz-flex-3" @click="areaClick"><input :disabled="true" v-model="areaCodeLabel" /></view>
						<view class="dz-flex-9"><input type="text" v-model="mobile" :disabled="loading" :placeholder="language.thirdPartyLogin.mobileHolder" /></view>
					</view>
				</dz-form-item>
				<dz-form-item :label="language.thirdPartyLogin.labelCode" label-width="130">
					<input type="text" v-model="code" :disabled="loading" :placeholder="language.thirdPartyLogin.codeHolder" />
					<dz-button slot="right" type="info" size="mini" :disabled="codeDisabled || waitingCaptcha" @click="getCode">
						{{ waitingCaptcha ? $api.helper.formatString(language.thirdPartyLogin.getCaptchaLater, waitingSecond) : language.thirdPartyLogin.getCaptcha }}
					</dz-button>
				</dz-form-item>
			</view>
			<view class="tip">{{ language.thirdPartyLogin.mobileLoginTips }}</view>
			<view class="button" style="margin-top: 100rpx;">
				<dz-button :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" @click="submit">
					{{ language.thirdPartyLogin.submit }}
				</dz-button>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="button" style="margin-top: 50rpx;" v-if="wechatMpBindMobile">
			<dz-button type="success" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">{{ language.thirdPartyLogin.mpSubmit }}</dz-button>
		</view>
		<!-- #endif -->
		<dz-select mode="single-column" v-model="areaSelect" :safe-area-inset-bottom="true" :list="mobileAreaInfo" @confirm="areaConfirm"></dz-select>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			mobilePattern: this.$api.dataConfig.mobilePattern,
			wechatMpBindMobile: this.$api.appConfig.wechatMpBindMobile,
			mobileBindShow: false,
			mobileAreaInfo: [],
			areaSelect: false,
			areaCode: this.$api.store.state.lastSelectMobileArea || this.$api.appConfig.mobileArea,
			areaCodeLabel: '',
			mobile: this.$api.store.state.lastInputMobile || '',
			code: '',
			source: '',
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
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.thirdPartyLogin.titleLogin
		});
		await this.$onLaunched;
		this.areaCodeLabel = this.mobilePattern[this.areaCode].label;
		for (let area in this.mobilePattern) {
			this.mobileAreaInfo.push({ value: area, label: this.mobilePattern[area].label });
		}
		this.source = e.source || '';
		// //判断数据
		if (!this.$api.store.state.thirdPartyUserInfo.type) {
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.fail,
				query: {}
			});
		}
		// #ifndef MP-WEIXIN
		this.mobileBindShow = true;
		// #endif
		// #ifdef MP-WEIXIN
		this.mobileBindShow = !this.$api.appConfig.wechatMpOnlyBindMobile;
		// #endif
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
				title: this.$api.language.thirdPartyLogin.codeLoading,
				mask: true
			});
			if (this.$api.helper.isMobile(String(this.areaCode) + this.mobile, this.areaCode)) {
				this.$api.http
					.post(this.$api.apiShop.smsCode, {
						mobile: this.mobile,
						mobile_area: this.areaCode,
						usage: 'register-or-login'
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
			} else {
				this.$refs.dzToast.show({
					title: this.$api.language.thirdPartyLogin.mobileError,
					type: 'warning'
				});
				uni.hideLoading();
			}
		},
		//微信小程序手机号授权
		getPhoneNumber(e) {
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.authLoading,
				mask: true
			});
			const _this = this;
			let pages = getCurrentPages();
			uni.login({
				provider: 'weixin',
				success: async function(loginRes) {
					await _this.$api.http
						.post(_this.$api.apiShop.mpWechatRegisterOrLogin, {
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: loginRes.code,
							promo_code: _this.$api.store.state.promoCode
						})
						.then(async res => {
							_this.$api.store.commit('login', res.data);
							_this.$api.store.commit('setWechatMpLogin', true);
							uni.$emit('customPageChange', {});
							uni.$emit('sgninChange');
							if (parseInt(_this.$api.shopSetting.app_service_type) > 0) {
							}

							await _this.authBinding();

							uni.hideLoading();

							let pageBack = 1;
							if (_this.source == 'autoLogin') {
								pageBack = 1;
							} else {
								pageBack = 2;
							}
							if (pages.length <= pageBack) {
								uni.reLaunch({
									url: _this.$api.appConfig.indexPath
								});
							} else {
								_this.$api.router.back(pageBack);
							}
						})
						.catch(err => {
							uni.hideLoading();
							_this.$refs.dzToast.show({
								title: _this.$api.language.thirdPartyLogin.getWechatAuthInfoError,
								type: 'error'
							});
						});
				},
				fail: function() {
					uni.hideLoading();
					_this.$refs.dzToast.show({
						title: _this.$api.language.thirdPartyLogin.getWechatAuthServiceError,
						type: 'error'
					});
				}
			});
		},
		//绑定手机号注册
		async submit() {
			if (this.loading) {
				return;
			}
			if (!this.$api.helper.isMobile(this.areaCode + this.mobile, this.areaCode)) {
				this.$refs.dzToast.show({
					title: this.$api.language.thirdPartyLogin.mobileError,
					type: 'warning'
				});
				return;
			}
			if (!this.code) {
				this.$refs.dzToast.show({
					title: this.$api.language.thirdPartyLogin.codeError,
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
				promo_code: this.$api.store.state.promoCode,
				nickname: '+' + this.areaCode + ' ' + this.$api.helper.maskCode(this.mobile, 3, 4)
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

			await this.$api.http
				.post(this.$api.apiShop.registerOrLogin, {
					...formData
				})
				.then(async res => {
					this.$api.store.commit('login', res.data);
					// 是否小程序登录
					if (res.data.member && res.data.member.auth && res.data.member.auth.wechatMp) {
						this.$api.store.commit('setWechatMpLogin', true);
					}
					uni.$emit('customPageChange', {});
					uni.$emit('sgninChange');
					if (parseInt(this.$api.shopSetting.app_service_type) > 0) {
					}
					await this.authBinding();
					this.loading = false;
					uni.hideLoading();
					// 获取当前页面栈，如果页面栈小于3，则直接跳转到首页
					let pages = getCurrentPages();
					if (pages.length < 3) {
						uni.reLaunch({
							url: this.$api.appConfig.indexPath
						});
					} else {
						this.$api.router.back(2);
					}
				})
				.catch(err => {
					this.loading = false;
					uni.hideLoading();
				});
		},
		//第三方登录绑定
		async authBinding() {
			let auth = this.$api.store.state.thirdPartyUserInfo;
			console.log(JSON.stringify(auth));
			let authType = auth.type;
			let authInfo = auth.userInfo;
			let authClient;
			// #ifdef APP-PLUS
			if (authType == 'apple') {
				authClient = 'apple';
			} else if (authType == 'wechat') {
				authClient = 'wechatOP';
			}
			// #endif
			// #ifdef H5
			if (authType == 'wechat') {
				authClient = 'wechat';
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (authType == 'wechat') {
				authClient = 'wechatMp';
			}
			// #endif
			await this.$api.http
				.post(this.$api.apiShop.authLogin, {
					...authInfo,
					oauth_client: authClient,
					unionid: authInfo.unionid || '',
					gender: authInfo.sex || authInfo.gender,
					oauth_client_user_id: authInfo.user || authInfo.openid || authInfo.openId,
					head_portrait: authInfo.headimgurl || authInfo.avatarUrl,
					nickname: authInfo.nickname || authInfo.nickName
				})
				.then(res => {
					let userInfo = this.$api.store.state.userInfo;
					if (authInfo.nickname || authInfo.nickName) {
						this.$api.store.commit('setUserNickname', authInfo.nickname || authInfo.nickName);
					}
					if (authInfo.headimgurl || authInfo.avatarUrl) {
						this.$api.store.commit('setUserHeadPortrait', authInfo.headimgurl || authInfo.avatarUrl);
					}
				})
				.catch(err => {
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
