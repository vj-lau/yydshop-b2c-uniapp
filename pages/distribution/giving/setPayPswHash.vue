<template>
	<view>
		<dz-navbar :is-fixed="true" :title="title" titleWidth="290"></dz-navbar>
		<view class="dz-form">
			<dz-form>
				<dz-form-item :label="language.modifyPassword.labelMobile" label-width="140">
					<input type="text" :value="'+' + String(areaCode) + '-' + mobile" :disabled="true" />
				</dz-form-item>
				<dz-form-item label="支付密码" label-width="140"><input type="text" v-model="password" placeholder="请输入支付密码" password maxlength="20" /></dz-form-item>
				<dz-form-item label="确认密码" label-width="140">
					<input type="text" v-model="confirmPassword" password placeholder="请输入确认支付密码" maxlength="20" />
				</dz-form-item>
				<dz-form-item :label="language.modifyPassword.labelCode" label-width="140">
					<input type="text" v-model="code" :disabled="loading" :placeholder="language.modifyPassword.codeHolder" />
					<dz-button
						slot="right"
						size="mini"
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
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
				:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
				hover-class="none"
				:loading="loading"
				@click="submit"
			>
				确定
			</dz-button>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
		<dz-modal
			v-model="bindMoible"
			:title="language.application.modalTitle"
			content="请您先绑定手机号再进行其它操作"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="false"
			@confirm="toPage('bindMobile')"
		></dz-modal>
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
			timeInterval: null,
			title: '',
			type: '',
			bindMoible: false
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
		this.title = '设置支付密码';
		if (!e.type) {
			this.title = '修改支付密码';
		} else {
			this.type = e.type;
		}
		uni.setNavigationBarTitle({
			title: this.title
		});
		await this.$onLaunched;
		uni.$on('updateMoible', data => {
			this.areaCode = this.$api.store.state.userInfo.mobile_area;
			this.mobile = this.$api.store.state.userInfo.mobile;
			this.waitingSecond = this.$api.appConfig.loginCodeSecond;
		});
		if (!this.mobile) {
			this.bindMoible = true;
		}
	},
	onShow() {
		this.computeLastCaptcha();
	},
	onUnload() {
		uni.$off('updateMoible');
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
			if (!this.mobile) {
				return (this.bindMoible = true);
			}
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.codeLoading
			});
			if (this.$api.helper.isMobile(String(this.areaCode) + this.mobile, this.areaCode)) {
				this.$api.http
					.post(this.$api.apiShop.smsCode, {
						mobile: this.mobile,
						mobile_area: this.areaCode,
						usage: 'set-pay-pwd'
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
			if (!this.mobile) {
				return (this.bindMoible = true);
			}
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
				pay_password: this.password,
				code: this.code
			};

			this.$api.http
				.post(this.$api.apiDistribution.setPayPassword, {
					...formData
				})
				.then(res => {
					this.loading = false;
					if (this.title == '设置支付密码') {
						this.$refs.dzToast.show({
							title: '设置密码成功',
							type: 'success'
						});
						uni.$emit('memberChange', {});
						setTimeout(() => {
							this.$api.router.redirectTo({
								route: this.$api.routesConfig.giving,
								query: {
									type: this.type == 'add' ? '' : this.type
								}
							});
						}, 300);
					} else {
						this.$refs.dzToast.show({
							title: '密码修改成功',
							type: 'success'
						});

						setTimeout(() => {
							this.$api.router.back();
						}, 300);
					}
				})
				.catch(err => {
					this.loading = false;
					this.$refs.dzToast.show({
						title: err,
						type: 'warning'
					});
				});
		},
		toPage(url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					type: 'brokerage'
				}
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
