<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.bindMobile.titleBindMobile"></dz-navbar>
		<view class="dz-form">
			<dz-form>
				<dz-form-item :label="language.bindMobile.labelMobile" label-width="130">
					<view class="dz-flex">
						<view class="dz-flex-3" @click="areaClick"><input :disabled="true" v-model="areaCodeLabel" /></view>
						<view class="dz-flex-9"><input type="text" v-model="mobile" :disabled="loading" :placeholder="language.bindMobile.mobileHolder" /></view>
					</view>
				</dz-form-item>
				<dz-form-item :label="language.bindMobile.labelCode" label-width="130">
					<input type="text" v-model="code" :disabled="loading" :placeholder="language.bindMobile.codeHolder" />
					<dz-button
						slot="right"
						type="info"
						size="mini"
						hoverClass="none"
						:border="false"
						:customStyle="{ background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
						:disabled="codeDisabled || waitingCaptcha"
						@click="getCode"
					>
						{{ waitingCaptcha ? $api.helper.formatString(language.bindMobile.getCaptchaLater, waitingSecond) : language.bindMobile.getCaptcha }}
					</dz-button>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="button" style="margin-top: 100rpx;">
			<dz-button :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" :border="false" hover-class="none" @click="submit">
				{{ language.bindMobile.submit }}
			</dz-button>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<view class="button" style="margin-top: 30rpx;" v-if="wechatMpBindMobile">
			<dz-button type="success" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">{{ language.thirdPartyLogin.mpSubmit }}</dz-button>
		</view>
		<!-- #endif -->
		<dz-select mode="single-column" v-model="areaSelect" :safe-area-inset-bottom="true" :list="mobileAreaInfo" @confirm="areaConfirm"></dz-select>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			mobilePattern: this.$api.dataConfig.mobilePattern,
			wechatMpBindMobile: this.$api.appConfig.wechatMpBindMobile,
			mobileAreaInfo: [],
			areaSelect: false,
			areaCode: this.$api.store.state.lastSelectMobileArea || this.$api.appConfig.mobileArea,
			areaCodeLabel: '',
			mobile: '',
			code: '',
			loading: false,
			lastCaptchaTimeStamp: 0,
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			timeInterval: null,
			type: ''
		};
	},
	computed: {
		...mapState(['userInfo']),
		codeDisabled() {
			if (this.$api.helper.isMobile(this.areaCode + this.mobile, this.areaCode)) {
				return false;
			}
			return true;
		}
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.bindMobile.titleBindMobile
		});
		await this.$onLaunched;
		if (e.type) {
			this.type = e.type;
		}
		this.areaCodeLabel = this.mobilePattern[this.areaCode].label;
		for (let area in this.mobilePattern) {
			this.mobileAreaInfo.push({
				value: area,
				label: this.mobilePattern[area].label
			});
		}
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
			if (this.userInfo.mobile) {
				this.$refs.dzToast.show({
					title: this.$api.language.bindMobile.bindError,
					type: 'warning'
				});
				return;
			}
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.codeLoading
			});
			if (this.$api.helper.isMobile(String(this.areaCode) + this.mobile, this.areaCode)) {
				this.$api.http
					.post(this.$api.apiShop.smsCode, {
						mobile: this.mobile,
						mobile_area: this.areaCode,
						usage: 'up-mobile'
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
			if (this.userInfo.mobile) {
				this.$refs.dzToast.show({
					title: this.$api.language.bindMobile.bindError,
					type: 'warning'
				});
				return;
			}
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.authLoading,
				mask: true
			});
			const _this = this;
			uni.login({
				provider: 'weixin',
				success: async function(loginRes) {
					await _this.$api.http
						.post(_this.$api.apiShop.mpWechatMobileBind, {
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							code: loginRes.code
						})
						.then(res => {
							uni.hideLoading();
							let mobile = res.data;
							_this.$api.store.commit('setUserMobile', mobile);
							_this.$api.store.commit('setUserMobileArea', '86');
							let pages = getCurrentPages();
							if (pages.length < 2) {
								uni.reLaunch({
									url: _this.$api.appConfig.indexPath
								});
							} else {
								_this.$api.router.back(1);
							}
						})
						.catch(err => {
							uni.hideLoading();
						});
				},
				fail: function() {
					uni.hideLoading();
					_this.$refs.dzToast.show({
						title: this.$api.language.thirdPartyLogin.getWechatAuthServiceError,
						type: 'warning'
					});
				}
			});
		},
		//修改手机号码
		submit() {
			if (this.userInfo.mobile) {
				this.$refs.dzToast.show({
					title: this.$api.language.bindMobile.bindError,
					type: 'warning'
				});
				return;
			}
			if (this.loading) {
				return;
			}
			if (!this.$api.helper.isMobile(this.areaCode + this.mobile, this.areaCode)) {
				this.$refs.dzToast.show({
					title: this.$api.language.bindMobile.mobileError,
					type: 'warning'
				});
				return;
			}
			if (!this.code) {
				this.$refs.dzToast.show({
					title: this.$api.language.bindMobile.codeError,
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
				.post(this.$api.apiShop.mobileBind, {
					...formData
				})
				.then(res => {
					this.loading = false;
					uni.hideLoading();
					this.$api.store.commit('setUserMobile', this.mobile);
					this.$api.store.commit('setUserMobileArea', this.areaCode);
					if (this.type) {
						uni.$emit('updateMoible');
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
					uni.hideLoading();
					this.$refs.dzToast.show({
						title: err,
						type: 'warning'
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
