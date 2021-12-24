<template>
	<view>
		<view class="content">
			<dz-navbar :title="language.publicText.resetPassword"></dz-navbar>
			<dz-form :model="form">
				<dz-form-item :label="language.user.mobile" label-width="150">
					<input :disabled="true" v-model="areaCodeLabel" @tap="areaTap" style="width: 140rpx;" />
					<dz-input v-model="form.mobile" maxlength="11" :placeholder="language.login.mobileHolder"></dz-input>
				</dz-form-item>
				<dz-form-item :label="language.publicText.password" label-width="150" prop="password">
					<dz-input v-model="form.password" type="password" :placeholder="language.publicText.inputPassword"></dz-input>
				</dz-form-item>
				<dz-form-item :label="language.publicText.confirmPassword" label-width="150">
					<dz-input v-model="form.password_repetition" type="password" :placeholder="language.publicText.inputConfirmPassword"></dz-input>
				</dz-form-item>
				<dz-form-item :label="language.publicText.code" label-width="150">
					<dz-input v-model="form.code" :placeholder="language.publicText.inputCode" type="text"></dz-input>
					<dz-button
						slot="right"
						size="mini"
						:loading="loading"
						@click="getCode"
						type="info"
						:border="false"
						:disabled="submitDisabled || waitingCaptcha"
						class="getCaptcha"
					>
						{{ waitingCaptcha ? $api.helper.formatString(language.login.getCaptchaLater, waitingSecond) : language.login.getCaptcha }}
					</dz-button>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="btn">
			<dz-button
				:loading="submitLoading"
				:custom-style="{ background: submitLoading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
				hover-class="none"
				@click="submit"
			>
				{{ language.publicText.confirm }}
			</dz-button>
		</view>
		<dz-modal
			v-model="isModal"
			:title="language.publicText.passwordChangedSuccessfully"
			:content="language.publicText.loginLook"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="modalCancel"
			@confirm="modalConfirm"
		></dz-modal>
		<dz-select mode="single-column" v-model="areaSelect" :safe-area-inset-bottom="true" :list="mobileAreaInfo" @confirm="areaConfirm"></dz-select>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			loading: false,
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			form: {},
			mobileAreaInfo: [],
			mobilePattern: this.$api.dataConfig.mobilePattern,
			areaCode: this.$api.appConfig.mobileArea,
			areaCodeLabel: '',
			areaSelect: false,
			submitLoading: false,
			isModal: false
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.publicText.resetPassword
		});
		await this.$onLaunched;
		this.areaCodeLabel = this.mobilePattern[this.areaCode].label;
		for (let area in this.mobilePattern) {
			this.mobileAreaInfo.push({ value: area, label: this.mobilePattern[area].label });
		}
		this.form.mobile = this.userInfo.mobile || '';
	},
	onShow() {
		this.computeLastCaptcha();
	},
	computed: {
		...mapState(['userInfo']),
		submitDisabled() {
			if (this.$api.helper.isMobile(this.areaCode + this.form.mobile, this.mobileArea)) {
				return false;
			}
			return true;
		}
	},
	methods: {
		areaTap() {
			this.areaSelect = true;
		},
		areaConfirm(e) {
			this.areaCode = e[0].value;
			this.areaCodeLabel = e[0].label;
		},
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
		// 获取验证码
		getCode() {
			if (this.loading) {
				return;
			}
			this.loading = true;
			if (this.$api.helper.isMobile(String(this.areaCode) + this.form.mobile, this.areaCode)) {
				this.$api.http
					.post(this.$api.apiShop.smsCode, {
						mobile: this.form.mobile,
						mobile_area: this.areaCode,
						usage: 'up-pwd'
					})
					.then(res => {
						this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
						this.computeLastCaptcha();
						this.loading = false;
					})
					.catch(err => {
						this.loading = false;
					});
			} else {
				this.loading = false;
				this.$refs.dzToast.show({
					title: this.$api.language.login.mobileError,
					type: 'warning'
				});
			}
		},
		submit() {
			if (this.form.password != this.form.password_repetition) {
				this.$refs.dzToast.show({
					title: this.$api.language.publicText.inconsistentPasswords,
					type: 'warning'
				});
				return;
			}
			const rule = [
				{ name: 'mobile', checkType: 'phoneno', checkRule: '11,11', errorMsg: this.language.address.correctPhoneNumber },
				{ name: 'password', checkType: 'string', checkRule: '6,20', errorMsg: this.language.publicText.passwordLength },
				{ name: 'code', checkType: 'notnull', checkRule: '', errorMsg: this.language.publicText.inputCode }
			];
			const checkRes = this.$api.graceChecker.check(this.form, rule);
			if (!checkRes) {
				this.$refs.dzToast.show({
					title: this.$api.graceChecker.error,
					type: 'warning'
				});
				return;
			}
			/*  #ifdef  APP-PLUS  */
			this.form.group = 'app';
			/*  #endif  */
			/*  #ifdef H5  */
			this.form.group = 'h5';
			/*  #endif  */
			/*  #ifdef  MP-WEIXIN  */
			this.form.group = 'wechatMp';
			/*  #endif  */
			/*  #ifdef  MP-QQ  */
			this.form.group = 'qqMp';
			/*  #endif  */
			this.submitLoading = true;
			this.$api.http
				.post(this.$api.apiShop.updatePassword, {
					...this.form
				})
				.then(res => {
					// this.$api.helper.toast(this.language.publicText.passwordChangedSuccessfully)
					this.$api.store.commit('login', res.data);
					this.isModal = true;
					this.submitLoading = false;
				})
				.catch(err => {
					this.isModal = true;
					this.submitLoading = false;
				});
		},
		// 取消登录
		modalCancel() {
			this.$api.router.back();
		},
		// 确定
		modalConfirm() {
			this.isModal = false;
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.login,
				query: {}
			});
		}
	}
};
</script>

<style>
.content {
	padding: 0 30rpx;
	background-color: #ffffff;
}
.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 60rpx;
}
</style>
