<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.login.titlePasswordLogin"></dz-navbar>
		<view class="wrap">
			<view class="content">
				<view class="logo"><image :src="logo" mode="widthFix"></image></view>
				<view class="dz-flex">
					<view class="dz-flex-3 dz-text-center areacode" @click="areaClick"><input :disabled="true" v-model="areaCodeLabel" /></view>
					<view class="dz-flex-9"><input type="text" v-model="mobile" :disabled="loading" :placeholder="language.login.mobileHolder" /></view>
				</view>
				<dz-line></dz-line>
				<view class="dz-flex dz-m-t-30">
					<view class="dz-flex-3 dz-text-center"><input :disabled="true" :value="language.login.passwordLabel" /></view>
					<view class="dz-flex-9"><input type="text" v-model="password" :password="true" :disabled="loading" :placeholder="language.login.passwordHolder" /></view>
				</view>
				<dz-line></dz-line>
				<view class="tips">{{ language.login.passwordLoginTips }}</view>

				<block v-if="!closeLogin">
					<dz-button
						:custom-style="{ background: theme.dzBaseDisabled, color: theme.dzBaseFontColor }"
						hover-class="none"
						:border="false"
						:disabled="true"
						class="getCaptcha"
					>
						应用暂时关闭登录
					</dz-button>
				</block>
				<block v-else>
					<dz-button
						:loading="loading"
						@click="submit"
						:custom-style="{ background: submitDisabled || loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						:border="false"
						:disabled="submitDisabled"
						class="getCaptcha"
					>
						{{ language.login.passwordLoginSumbit }}
					</dz-button>
				</block>

				<view class="alternative dz-flex">
					<view v-if="isMobileLogin" class="mobile dz-flex-1 dz-text-center" @tap="mobileLoginClick">{{ language.login.mobileLogin }}</view>
					<view class="issue dz-flex-1 dz-text-center" @tap="helperClick">{{ language.login.getProblem }}</view>
				</view>
			</view>
			<view class="buttom">
				<view class="loginType">
					<view v-show="showWechatLogin" class="wechat item" @tap="wechatSubmit">
						<view class="icon"><dz-icon size="70" name="wechat" color="rgb(83,194,64)"></dz-icon></view>
						{{ language.login.wechatLogin }}
					</view>
					<!-- 					<view class="QQ item">
						<view class="icon"><dz-icon size="70" name="qq" color="rgb(17,183,233)"></dz-icon></view>
						{{language.login.qqLogin}}
					</view> -->
					<!-- #ifdef APP-PLUS -->
					<view v-if="appAppleLogin && showAppleLogin" class="apple item" @tap="appleSubmit">
						<view class="icon"><dz-icon size="70" name="iOS" color="rgb(0,0,0)"></dz-icon></view>
						{{ language.login.appleLogin }}
					</view>
					<!-- #endif -->
				</view>
				<view class="hint">
					<block v-if="agreeMode == 0">
						{{ language.login.loginAgree + appName }}
						<text class="link" @tap="protocal(language.login.userAgreement, 'register')">{{ language.login.userAgreement }}</text>
						、
						<text class="link" @tap="protocal(language.login.privacyAgreement, 'privacy')">{{ language.login.privacyAgreement }}</text>
						， {{ $api.helper.formatString(language.login.grantAuthorization, appName) }}
					</block>
					<block v-else>
						<view class="dz-text-center">
							<dz-checkbox v-model="agreeCheck" shape="circle" :active-color="theme.dzBaseColor">
								我已仔细阅读并同意
								<text class="link" @tap="protocal(language.login.userAgreement, 'register')">{{ language.login.userAgreement }}</text>
								、
								<text class="link" @tap="protocal(language.login.privacyAgreement, 'privacy')">{{ language.login.privacyAgreement }}</text>
							</dz-checkbox>
						</view>
					</block>
				</view>
			</view>
		</view>
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
			logo: this.$api.shopSetting.store_logo,
			appName: this.$api.shopSetting.store_name,
			agreeMode: parseInt(this.$api.shopSetting.app_agreement_default_select),
			closeLogin: parseInt(this.$api.shopSetting.login_is_open) == 1,
			h5_login_mode: [],
			h5_login_default: '',
			isWechatlLogin: false,
			wechat_login_mode: [],
			wechat_login_default: '',
			passwordLogin: false,
			app_login_mode: [],
			app_login_default: '',
			appAppleLogin: parseInt(this.$api.shopSetting.mobile_show_apple_login) == 1,
			showAppleLogin: false,
			agreeCheck: true,
			mobilePattern: this.$api.dataConfig.mobilePattern,
			mobileAreaInfo: [],
			areaSelect: false,
			areaCode: this.$api.store.state.lastSelectMobileArea || this.$api.appConfig.mobileArea,
			areaCodeLabel: '',
			mobile: this.$api.store.state.lastInputMobile || '',
			password: '',
			loading: false,
			showWechatLogin: false,
			isMobileLogin: false,
			canIUseProfile: false
		};
	},
	computed: {
		submitDisabled() {
			if (this.$api.helper.isMobile(this.areaCode + this.mobile, this.areaCode) && this.password) {
				return false;
			}
			return true;
		}
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.login.titlePasswordLogin
		});
		// #ifdef MP-WEIXIN
		// 新版小程序登录判断
		if (uni.getUserProfile) {
			this.canIUseProfile = true;
		}
		// #endif
		await this.$onLaunched;
		this.logo = this.$api.shopSetting.store_logo;
		this.appName = this.$api.shopSetting.store_name;
		this.agreeMode = parseInt(this.$api.shopSetting.app_agreement_default_select);
		this.closeLogin = parseInt(this.$api.shopSetting.login_is_open) == 1;

		// 微信公众号
		this.wechat_login_mode = this.$api.shopSetting.wechat_login_mode;
		this.wechat_login_default = parseInt(this.$api.shopSetting.wechat_login_default);
		// 小程序
		this.miniprogram_login_mode = this.$api.shopSetting.miniprogram_login_mode;
		this.miniprogram_login_default = parseInt(this.$api.shopSetting.miniprogram_login_default);
		// h5
		this.h5_login_mode = this.$api.shopSetting.h5_login_mode;
		this.h5_login_default = parseInt(this.$api.shopSetting.h5_login_default);
		// app
		this.app_login_mode = this.$api.shopSetting.app_login_mode;
		this.app_login_default = parseInt(this.$api.shopSetting.app_login_default);

		this.appAppleLogin = parseInt(this.$api.shopSetting.mobile_show_apple_login) == 1;
		this.areaCodeLabel = this.mobilePattern[this.areaCode].label;
		for (let area in this.mobilePattern) {
			this.mobileAreaInfo.push({ value: area, label: this.mobilePattern[area].label });
		}
		if (this.agreeMode == 0) {
			this.agreeCheck = true;
		} else if (this.agreeMode == 1) {
			this.agreeCheck = true;
		} else if (this.agreeMode == 2) {
			this.agreeCheck = false;
		}
		// 微信授权登录
		this.initThirdPartyLogin();
		// 手机号+验证码登录
		this.initMobileLogin();
	},
	methods: {
		// 微信授权登录
		initThirdPartyLogin() {
			this.showWechatLogin = false;
			this.showAppleLogin = false;

			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '' && (this.wechat_login_mode.includes('1') || parseInt(this.wechat_login_default) === 1)) {
				this.showWechatLogin = true;
			}
			// #endif

			// #ifdef APP-PLUS
			if (this.app_login_mode.includes('1') || this.app_login_default == 1) {
				this.showWechatLogin = true;
				if (this.$api.systemInfo.platform == 'ios') {
					this.showAppleLogin = true;
				}
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.miniprogram_login_mode.includes('1') || this.miniprogram_login_default == 1) {
				this.showWechatLogin = true;
			}
			// #endif
		},
		initMobileLogin() {
			this.isMobileLogin = false;
			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '' && (this.wechat_login_mode.includes('0') || parseInt(this.wechat_login_default) === 0)) {
				this.isMobileLogin = true;
			} else if (this.h5_login_mode.includes('0') || this.h5_login_default == 0) {
				this.isMobileLogin = true;
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.miniprogram_login_mode.includes('0') || this.miniprogram_login_default == 0) {
				this.isMobileLogin = true;
			}
			// #endif

			// #ifdef APP-PLUS
			if (this.app_login_mode.includes('0') || this.app_login_default == 0) {
				this.isMobileLogin = true;
			}
			// #endif
		},
		areaClick() {
			this.areaSelect = true;
		},
		areaConfirm(e) {
			this.areaCode = e[0].value;
			this.areaCodeLabel = e[0].label;
		},
		//微信登录
		wechatSubmit() {
			let _this = this;

			if (!this.closeLogin) {
				this.$refs.dzToast.show({
					title: '应用暂时关闭登录',
					type: 'warning'
				});
				return;
			}

			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选会员协议',
					type: 'warning'
				});
				return;
			}

			uni.showLoading({
				title: this.$api.language.login.wechatLoading,
				mask: true
			});

			// #ifdef APP-PLUS
			plus.oauth.getServices(
				function(services) {
					let weixinService;
					if (services && services.length > 0) {
						for (let i = 0; i < services.length; i++) {
							if (services[i].id === 'weixin') {
								weixinService = services[i];
								break;
							}
						}
						if (!weixinService) {
							uni.hideLoading();
							_this.$refs.dzToast.show({
								title: _this.$api.language.login.uninstallWechatAuthService,
								type: 'warning'
							});
							return;
						}
						let platform = _this.$api.systemInfo.platform;
						let group = 'tinyShopApp';
						if (platform == 'ios') {
							group = 'tinyShopIos';
						} else if (platform == 'android') {
							group = 'tinyShopAndroid';
						}
						weixinService.authorize(
							e => {
								let authApi = `${_this.$api.apiShop.thirdPartyWechatOpenPlatform}?code=${e.code || ''}&group=${group}&promo_code=${_this.$api.store.state
									.promoCode || ''}`;
								_this.wechatAuthLogin(authApi);
							},
							function(err) {
								uni.hideLoading();
								_this.$refs.dzToast.show({
									title: err.message.split(',')[0],
									type: 'error'
								});
							}
						);
					} else {
						uni.hideLoading();
						_this.$refs.dzToast.show({
							title: _this.$api.language.login.getAuthServiceError,
							type: 'error'
						});
					}
				},
				function() {
					// 获取 services 失败
					uni.hideLoading();
					_this.$refs.dzToast.show({
						title: _this.$api.language.login.getWechatAuthServiceError,
						type: 'error'
					});
				}
			);
			// #endif

			// #ifdef MP-WEIXIN
			if (this.canIUseProfile) {
				uni.getUserProfile({
					desc: 'Wexin',
					success: profileRes => {
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								uni.getUserInfo({
									provider: 'weixin',
									success: function(infoRes) {
										let params = {};
										params.promo_code = _this.$api.store.state.promoCode || '';
										params.signature = infoRes.signature;
										params.encryptedData = infoRes.encryptedData;
										params.rawData = infoRes.rawData;
										params.iv = infoRes.iv;
										params.code = loginRes.code;

										params.userInfo = profileRes.rawData;
										let authApi = _this.$api.apiShop.mpWechatLogin2;
										_this.wechatAuthLogin(authApi, params);
									},
									fail: function() {
										uni.hideLoading();
										_this.$api.helper.toast('获取微信手机授权失败');
									}
								});
							},
							fail: function() {
								uni.hideLoading();
								_this.$api.helper.toast('获取微信授权服务失败');
							}
						});
					},
					fail: err => {
						_this.$api.helper.toast('获取微信授权服务失败');
					}
				});
			} else {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								let params = {};
								params.promo_code = _this.$api.store.state.promoCode || '';
								let authApi = _this.$api.apiShop.mpWechatLogin;
								params = { ...infoRes, ...params };
								params.code = loginRes.code;
								_this.wechatAuthLogin(authApi, params);
							},
							fail: function() {
								uni.hideLoading();
								_this.$refs.dzToast.show({
									title: _this.$api.language.thirdPartyLogin.getWechatAuthInfoError,
									type: 'error'
								});
							}
						});
					},
					fail: function() {
						uni.hideLoading();
						_this.$refs.dzToast.show({
							title: _this.$api.language.login.getWechatAuthServiceError,
							type: 'error'
						});
					}
				});
			}
			// #endif

			// #ifdef H5
			let h5LoginUrl = this.$api.shopSetting.h5_url;
			if (h5LoginUrl.endsWith('/')) {
				h5LoginUrl = h5LoginUrl.substr(0, h5LoginUrl.length - 1);
			}
			h5LoginUrl += this.$api.routesConfig.loginWechat;
			//避免缓存
			h5LoginUrl += '?r=' + this.$api.helper.guid(16);
			h5LoginUrl = encodeURIComponent(h5LoginUrl);
			let jumpUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?
														appid=${this.$api.shopSetting.wechat_appid}&
														redirect_uri=${h5LoginUrl}&
														response_type=code&
														scope=snsapi_userinfo&
														state=STATE#wechat_redirect`;
			window.location.href = jumpUrl;
			// #endif
		},
		//微信授权
		async wechatAuthLogin(authApi, params = {}) {
			await this.$api.http
				.post(authApi, params)
				.then(res => {
					uni.hideLoading();
					uni.$emit('customPageChange', {});
					uni.$emit('sgninChange');
					// 是否小程序登录
					this.$api.store.commit('setWechatMpLogin', true);
					if (!res.data.login) {
						this.$api.store.commit('setThirdPartyUserInfo', { type: 'wechat', userInfo: res.data.user_info });
						this.$api.router.push({
							route: this.$api.routesConfig.thirdPartyLogin
						});
					} else {
						this.$api.store.commit('login', res.data.user_info);
						if (parseInt(this.$api.shopSetting.app_service_type) > 0) {
						}
						let pages = getCurrentPages();
						if (pages.length < 2) {
							uni.reLaunch({
								url: this.$api.appConfig.indexPath
							});
						} else {
							this.$api.router.back(1);
						}
					}
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//苹果登录
		appleSubmit() {
			let _this = this;

			if (!this.closeLogin) {
				this.$refs.dzToast.show({
					title: '应用暂时关闭登录',
					type: 'warning'
				});
				return;
			}

			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选会员协议',
					type: 'warning'
				});
				return;
			}

			uni.showLoading({
				title: this.$api.language.login.iosLoading
			});

			plus.oauth.getServices(
				function(services) {
					let appleService;
					if (services && services.length > 0) {
						for (let i = 0; i < services.length; i++) {
							if (services[i].id === 'apple') {
								appleService = services[i];
								break;
							}
						}
						if (!appleService) {
							uni.hideLoading();
							_this.$refs.dzToast.show({
								title: _this.$api.language.login.uninstallIosAuthService,
								type: 'warning'
							});

							return;
						}
						appleService.login(
							async e => {
								await _this.$api.http
									.post(_this.$api.apiShop.thirdPartyApple, {
										...e.target.appleInfo,
										promo_code: _this.$api.store.state.promoCode || ''
									})
									.then(res => {
										uni.hideLoading();
										uni.$emit('customPageChange', {});
										uni.$emit('sgninChange');
										if (!res.data.login) {
											_this.$api.store.commit('setThirdPartyUserInfo', { type: 'apple', userInfo: res.data.user_info });
											_this.$api.router.push({
												route: _this.$api.routesConfig.thirdPartyLogin
											});
										} else {
											_this.$api.store.commit('login', res.data.user_info);
											if (parseInt(_this.$api.shopSetting.app_service_type) > 0) {
											}
											let pages = getCurrentPages();
											if (pages.length < 2) {
												uni.reLaunch({
													url: _this.$api.appConfig.indexPath
												});
											} else {
												_this.$api.router.back(1);
											}
										}
									})
									.catch(() => {
										uni.hideLoading();
										_this.$refs.dzToast.show({
											title: _this.$api.language.login.getIosAuthInfoError,
											type: 'error'
										});
									});
							},
							function() {
								//  授权失败
								uni.hideLoading();
								_this.$refs.dzToast.show({
									title: _this.$api.language.login.getIosAuthServiceError,
									type: 'error'
								});
							}
						);
					}
				},
				function() {
					// 获取 services 失败
					uni.hideLoading();
					_this.$refs.dzToast.show({
						title: _this.$api.language.login.getIosAuthServiceError,
						type: 'error'
					});
				}
			);
		},
		//手机号密码登录
		async submit() {
			if (this.loading) {
				return;
			}
			if (!this.closeLogin) {
				this.$refs.dzToast.show({
					title: '应用暂时关闭登录',
					type: 'warning'
				});

				return;
			}
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选会员协议',
					type: 'warning'
				});
				return;
			}
			this.loading = true;
			if (!this.$api.helper.isMobile(String(this.areaCode) + this.mobile, this.areaCode)) {
				this.loading = false;
				this.$refs.dzToast.show({
					title: this.$api.language.login.mobileError,
					type: 'warning'
				});
				return;
			}
			if (!this.password) {
				this.loading = false;
				this.$refs.dzToast.show({
					title: this.$api.language.login.passwordError,
					type: 'warning'
				});
				return;
			}
			let formData = {
				mobile: this.mobile,
				mobile_area: this.areaCode,
				password: this.password
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
				.post(this.$api.apiShop.loginByPass, {
					...formData
				})
				.then(res => {
					this.$api.store.commit('login', res.data);
					// 是否小程序登录
					if (res.data.member && res.data.member.auth && res.data.member.auth.wechatMp) {
						this.$api.store.commit('setWechatMpLogin', true);
					}
					uni.$emit('customPageChange', {});
					uni.$emit('sgninChange');
					if (parseInt(this.$api.shopSetting.app_service_type) > 0) {
					}
					let pages = getCurrentPages();
					if (pages.length < 2) {
						uni.reLaunch({
							url: this.$api.appConfig.indexPath
						});
					} else {
						this.$api.router.back(1);
					}
				})
				.catch(err => {
					this.loading = false;
				});
		},
		//协议
		protocal(title, field) {
			this.$api.router.push({
				route: this.$api.routesConfig.aboutProtocol,
				query: {
					title,
					field
				}
			});
		},
		//手机号登录
		mobileLoginClick() {
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.mobileLogin,
				query: {}
			});
		},
		//帮助
		helperClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.helper,
				query: {}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}

.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;
		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		.logo {
			text-align: center;
			margin-bottom: 80rpx;

			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 28rpx;
			}
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $dz-type-info;
			margin-bottom: 60rpx;
			margin-top: 20rpx;
		}
		.getCaptcha {
			font-size: 30rpx;
			padding: 12rpx 0;
		}
		.alternative {
			color: $dz-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 60rpx;
		}
	}
	.buttom {
		position: relative;
		.loginType {
			display: flex;
			width: 100%;
			padding: 100rpx 150rpx 150rpx 150rpx;
			justify-content: space-between;

			.item {
				display: flex;
				flex-direction: column;
				width: 100%;
				align-items: center;
				justify-content: center;
				color: $dz-content-color;
				font-size: 24rpx;

				.icon {
					margin-bottom: 10rpx;
				}
			}
		}

		.hint {
			position: absolute;
			width: 100%;
			padding: 0 40rpx;
			padding-bottom: env(safe-area-inset-bottom);
			font-size: 20rpx;
			color: $dz-tips-color;
			bottom: -60rpx;
			left: 0;
			z-index: 10;
			.link {
				color: $dz-type-warning;
			}
		}
	}
}
</style>
