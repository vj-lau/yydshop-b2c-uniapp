<template>
	<view class="withdraw">
		<dz-navbar :title="'提现账号'"></dz-navbar>
		<view class="dz-list" v-if="bankAccountList.length > 0">
			<view v-for="(item, index) in bankAccountList" :key="index">
				<dz-swipe-action
					style="border-bottom: 1rpx solid #f3f3f3; width: 100%;"
					:index="item.id"
					:show="item.show"
					:key="item.id"
					:options="actionOptions"
					@click="actionClick"
					@open="open"
				>
					<view class="dz-list-item" @tap="checkBankAccount(item)">
						<view class="mid">
							<view class="t-box" :style="{ color: theme.dzBaseColor, borderColor: theme.dzBaseColor }">
								<text v-if="parseInt(item.is_default_withdraw) === 1" class="tag">默认</text>
								<view class="dzicon-iconfont dzicon-card_fill"></view>
								<text>{{ item.account_number }}</text>
							</view>
							<view class="u-box">
								<text class="name">{{ userInfo.allinpay_yun_member && userInfo.allinpay_yun_member.realname }}</text>
								<text class="name">{{ item.bank_name }}</text>
								<text>{{ item.mobile }}</text>
							</view>
						</view>
					</view>
				</dz-swipe-action>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn">
				<view style="flex: 1;">
					<dz-button
						:custom-style="{ background: allinpayAddCardButtonDisable ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
						:border="false"
						hover-class="none"
						shape="circle"
						:disabled="allinpayAddCardButtonDisable"
						@click="addWithdraw()"
					>
						新建提现账号
					</dz-button>
				</view>
			</view>
		</view>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="140"></dz-loadmore>
		<dz-empty :text="'暂无提现账号,去添加吧~'" v-if="loadingStatus == 'noData'" marginTop="80" :src="emptyOrder" iconSize="360"></dz-empty>
		<dz-modal :value="isModal" :showCancelButton="true" @confirm="confirm" :async-close="true" @cancel="cancel" :content="'确定要删除该提现账号吗'"></dz-modal>
		<!--通商云开户实名认证-->
		<dz-popup v-model="allinpayShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<dz-steps :active-color="theme.dzBaseColor" :list="allinpayStep" :current="allinpayStepCurrent" mode="number" icon="round_record_fill"></dz-steps>
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayTip }}</view>
				<view v-if="allinpayStepCurrent === 0">
					<view class="dz-p-l-20 dz-p-r-20">
						<dz-field :label="language.orderPay.mobileLabel" v-model="allinpayAuthMobile"></dz-field>
						<dz-field :label="language.orderPay.codeLabel" v-model="allinpayAuthCode">
							<dz-button slot="right" size="mini" type="info" :disabled="waitingCaptcha" @click="allinpayAuthCodeSubmit">
								{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
							</dz-button>
						</dz-field>
					</view>
					<dz-button
						:custom-style="{
							background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						:loading="allinpaySubmitting"
						@click="allinpayAuthSubmit"
					>
						{{ language.orderPay.authSubmitLabel }}
					</dz-button>
				</view>
				<view v-if="allinpayStepCurrent === 1">
					<view class="dz-p-l-20 dz-p-r-20">
						<dz-field :label="language.orderPay.realnameLabel" v-model="allinpayRealname"></dz-field>
						<dz-field :label="language.orderPay.idLabel" v-model="allinpayId"></dz-field>
					</view>
					<dz-button
						:custom-style="{
							background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						:loading="allinpaySubmitting"
						@click="allinpayRealnameSubmit"
					>
						{{ language.orderPay.realnameSubmitLabel }}
					</dz-button>
				</view>
				<view v-if="allinpayStepCurrent === 2">
					<dz-button
						:custom-style="{
							background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						:loading="allinpaySubmitting"
						@click="allinpaySignSubmit"
					>
						前往签约
					</dz-button>
				</view>
			</view>
		</dz-popup>
		<!--增加通商云银行卡-->
		<dz-popup v-model="allinpayAddBankcardShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayTip }}</view>
				<view class="dz-p-l-20 dz-p-r-20">
					<dz-field :label="language.orderPay.realnameLabel" :disabled="true" :value="userInfo.realname"></dz-field>
					<dz-field :label="language.orderPay.bankcardLabel" :placeholder="language.orderPay.bankcardHolderLabel" v-model="allinpayBankcard"></dz-field>
					<dz-field :label="language.orderPay.bankMobileLabel" v-model="allinpayBankcardMobile"></dz-field>
					<dz-field :label="language.orderPay.codeLabel" v-model="allinpayBankcardCode">
						<dz-button
							slot="right"
							size="mini"
							type="info"
							hover-class="none"
							:border="false"
							:custom-style="{ border: '1rpx solid rgba(0,0,0,0.12)' }"
							:disabled="waitingCaptcha"
							@click="allinpayBindcardCodeSubmit"
						>
							{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
						</dz-button>
					</dz-field>
					<dz-form-item class="dz-p-l-10 dz-p-r-30" label="默认卡" label-width="130" label-align="center">
						<dz-switch slot="right" v-model="allinpayBankcardDefault" :active-color="theme.dzBaseColor"></dz-switch>
					</dz-form-item>
				</view>
				<dz-button
					:custom-style="{
						background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					hover-class="none"
					:border="false"
					class="dz-m-t-50 dz-m-l-20 dz-m-r-20"
					:loading="allinpaySubmitting"
					@click="allinpayBindCardSubmit"
				>
					{{ language.orderPay.bindcardSubmitLabel }}
				</dz-button>
			</view>
		</dz-popup>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			loading: false,
			loadingStatus: 'loading',
			page: 1,
			bankAccountList: [],
			actionOptions: [
				{
					text: this.$api.language.application.delete,
					style: {
						backgroundColor: this.$api.theme.dzTypeError
					}
				},
				{
					text: '默认卡',
					style: {
						backgroundColor: this.$api.theme.dzTypeWarning
					}
				}
			],
			isModal: false,
			delId: '',
			source: '',
			lastCaptchaTimeStamp: 0,
			timeInterval: null,
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			allinpayAddCardButtonDisable: false,
			allinpaySubmitting: false,
			allinpayStep: [{ name: '认证' }, { name: '实名' }, { name: '签约' }],
			allinpayShow: false,
			allinpayStepCurrent: 0,
			allinpayAuthMobile: this.$api.store.state.userInfo.mobile || '',
			allinpayAuthCode: '',
			allinpayRealname: this.$api.store.state.userInfo.realname || '',
			allinpayId: '',
			allinpayAddBankcardShow: false,
			allinpayBankcard: '',
			allinpayBankcardMobile: '',
			allinpayBankcardCode: '',
			allinpayBankcardDefault: false,	
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '提现账号'
		});
		await this.$onLaunched;
		uni.$on('bankAccountChange', data => {
			this.initData();
		});
		this.source = option.source;
		this.initData();
	},
	async onShow() {
		//为避免数据更新不及时，这里获取用户最新信息
		await this.$onLaunched;
		this.getMemberInfo();
		this.computeLastCaptcha();
	},
	onUnload() {
		uni.$off('bankAccountChange');
	},
	onPullDownRefresh() {
		this.initData();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getBankAccountIndex();
	},
	methods: {
		...mapMutations(['setUserInfo']),
		getMemberInfo() {
			this.$api.http
				.get(this.$api.apiShop.memberInfo)
				.then(res => {
					this.setUserInfo(res.data);
				})
				.catch(err => {});
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
		initData() {
			this.page = 1;
			this.bankAccountList.length = 0;
			this.loadingStatus = 'loading';
			this.getBankAccountIndex();
		},
		async getBankAccountIndex() {
			await this.$api.http
				.get(this.$api.apiAllinpay.getCardList, {
					params: {
						card_type: 1,
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					res.data.forEach(item => {
						item.show = false;
					});
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.bankAccountList = [...this.bankAccountList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(() => {
					if (this.page == 1) {
						this.loadingStatus = 'noData';
						this.allinpayAddCardButtonDisable = true;
					}
				});
			uni.stopPullDownRefresh();
		},
		open(index) {
			this.bankAccountList[index].show = true;
			this.bankAccountList.map((val, key) => {
				if (index != key) this.bankAccountList[key].show = false;
			});
		},
		actionClick(id, action) {
			if (action == 1) {
				//设置默认
				this.setAccountDefault(id);
			} else {
				//删除
				this.isModal = true;
				this.delId = id;
			}
		},
		// 选择提现账号
		checkBankAccount(item) {
			if (this.source) {
				uni.$emit('getBankAccount', item);
				this.$api.router.back();
			}
		},
		confirm() {
			this.bankAccountDel(this.delId);
		},
		cancel() {
			this.isModal = false;
		},
		async bankAccountDel(id) {
			await this.$api.http
				.delete(
					this.$api.apiAllinpay.unbindCard,
					{},
					{
						params: {
							id: id
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: '解绑银行卡成功',
						type: 'success'
					});
					this.initData();
					uni.$emit('updateBankAccount');
					this.isModal = false;
				})
				.catch(err => {
					this.isModal = false;
				});
		},
		async setAccountDefault(id) {
			uni.showLoading({
				mask: true
			});
			await this.$api.http
				.post(
					this.$api.apiAllinpay.setDefaultWithdraw,
					{},
					{
						params: {
							id: id
						}
					}
				)
				.then(res => {
					uni.hideLoading();
					this.$refs.dzToast.show({
						title: '设置默认提现卡成功',
						type: 'success'
					});
					uni.$emit('bankAccountChange', {});
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		addWithdraw() {
			if (this.allinpayCheck()) {
				this.allinpayAddBankcardShow = true;
			} else {
				this.allinpayShow = true;
			}
		},
		//新增银行卡短信
		async allinpayBindcardCodeSubmit() {
			let postData = {};
			postData.card_no = this.allinpayBankcard;
			postData.card_phone = this.allinpayBankcardMobile;
			postData.is_default_withdraw = this.allinpayBankcardDefault ? 1 : 0;
			postData.is_default_pay = 0;

			if (this.allinpaySubmitting) {
				return;
			}
			if (!this.allinpayBankcard) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.bankcardError,
					type: 'warning'
				});
				return;
			}
			if (!this.allinpayBankcardMobile) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.bankcardMobileError,
					type: 'warning'
				});
				return;
			}
			await this.$api.http
				.post(this.$api.apiAllinpay.bindCardApply, { ...postData })
				.then(res => {
					this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
					this.computeLastCaptcha();
				})
				.catch(err => {
					return;
				});
		},
		//请求绑卡认证
		async allinpayBindCardSubmit() {
			let postData = {};
			postData.card_no = this.allinpayBankcard;
			postData.code = this.allinpayBankcardCode;
			postData.is_default_withdraw = this.allinpayBankcardDefault ? 1 : 0;

			if (this.allinpaySubmitting) {
				return;
			}
			if (!this.allinpayBankcard) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.bankcardError,
					type: 'warning'
				});
				return;
			}
			if (!this.allinpayBankcardCode) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.bankcardCodeError,
					type: 'warning'
				});
				return;
			}
			this.allinpaySubmitting = true;
			await this.$api.http
				.post(this.$api.apiAllinpay.bindCardAgree, { ...postData })
				.then(res => {
					this.allinpayAddBankcardShow = false;
					this.allinpaySubmitting = false;
					this.allinpayBankcard = '';
					this.allinpayBankcardCode = '';
					this.allinpayBankcardDefault = false;
					//清除短信等待
					this.waitingCaptcha = false;
					if (this.timeInterval) {
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
					uni.$emit('bankAccountChange', {});
				})
				.catch(err => {
					this.allinpaySubmitting = false;
					return;
				});
		},
		//通商云注册实名签约检测
		allinpayCheck() {
			//开户
			if (!this.userInfo.allinpay_yun_member || parseInt(this.userInfo.allinpay_yun_member.is_mobile) !== 1) {
				this.allinpayStepCurrent = 0;
				return false;
			}
			//实名认证
			if (parseInt(this.userInfo.allinpay_yun_member.is_realname) !== 1) {
				this.allinpayStepCurrent = 1;
				return false;
			}
			//签约
			if (parseInt(this.userInfo.allinpay_yun_member.is_sign) !== 1) {
				this.allinpayStepCurrent = 2;
				return false;
			}
			return true;
		},
		//通商云认证验证码
		async allinpayAuthCodeSubmit() {
			if (this.allinpaySubmitting) {
				return;
			}
			if (!this.$api.helper.isMobile(this.allinpayAuthMobile, '86')) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.authMobileError,
					type: 'warning'
				});
				return;
			}
			await this.$api.http
				.post(this.$api.apiAllinpay.sendCode, { mobile: this.allinpayAuthMobile })
				.then(res => {
					if (parseInt(res.data.is_mobile) === 1) {
						let user = this.userInfo;
						user.allinpay_yun_member = res.data;
						this.setUserInfo(user);
						this.$api.helper.toast(this.$api.language.orderPay.allinpayAlreadyAuth);
						if (this.allinpayCheck()) {
							this.allinpayShow = false;
						} else {
							this.allinpayShow = true;
						}
					} else {
						this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
						this.computeLastCaptcha();
					}
				})
				.catch(err => {
					return;
				});
		},
		//通商云认证提交
		async allinpayAuthSubmit() {
			if (this.allinpaySubmitting) {
				return;
			}
			if (!this.$api.helper.isMobile(this.allinpayAuthMobile, '86')) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.authMobileError,
					type: 'warning'
				});
				return;
			}
			if (!this.allinpayAuthCode) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.codeError,
					type: 'warning'
				});
				return;
			}
			this.allinpaySubmitting = true;
			//提交通商云认证
			await this.$api.http
				.post(this.$api.apiAllinpay.bindPhone, { code: this.allinpayAuthCode })
				.then(res => {
					let user = this.userInfo;
					user.allinpay_yun_member = res.data;
					this.setUserInfo(user);
					this.allinpaySubmitting = false;
					//清除短信等待
					this.waitingCaptcha = false;
					if (this.timeInterval) {
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
					if (this.allinpayCheck()) {
						this.allinpayShow = false;
					} else {
						this.allinpayShow = true;
					}
				})
				.catch(err => {
					this.allinpaySubmitting = false;
				});
		},
		//提交实名认证
		async allinpayRealnameSubmit() {
			if (this.allinpaySubmitting) {
				return;
			}
			if (!this.allinpayRealname) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.realNameError,
					type: 'warning'
				});
				return;
			}
			if (!this.$api.helper.isIdCard(this.allinpayId)) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.idError,
					type: 'warning'
				});
				return;
			}
			this.allinpaySubmitting = true;
			await this.$api.http
				.post(this.$api.apiAllinpay.setRealName, { realname: this.allinpayRealname, identity_card: this.allinpayId })
				.then(res => {
					let user = this.userInfo;
					user.allinpay_yun_member = res.data;
					this.setUserInfo(user);
					this.allinpaySubmitting = false;
					if (this.allinpayCheck()) {
						this.allinpayShow = false;
					} else {
						this.allinpayShow = true;
					}
				})
				.catch(err => {
					this.allinpaySubmitting = false;
				});
		},
		//通商云签约
		async allinpaySignSubmit() {
			if (this.allinpaySubmitting) {
				return;
			}
			this.allinpaySubmitting = true;
			let params = {};
			// #ifdef H5
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			url = this.$api.routesConfig.success.path;
			params.jump_url = encodeURIComponent(domain + url);
			// #endif
			//兼容通商云老版本
			let jump_page_type = 1;
			// #ifdef MP-WEIXIN
			jump_page_type =2;
			params.jump_url = this.$api.routesConfig.success.path;
			// #endif
			params.jump_page_type = jump_page_type;
			
			await this.$api.http
				.get(this.$api.apiAllinpay.signContract, {
					params: {
						...params
					}
				})
				.then(res => {
					this.allinpaySubmitting = false;
					this.allinpayShow = false;
					// #ifdef APP-PLUS || APP-NVUE || APP-PLUS-NVUE || APP-VUE
					this.$api.router.push({
						route: this.$api.routesConfig.webview,
						query: {
							url: this.$api.helper.strEncode(res.data)
						}
					});
					// #endif
					// #ifdef H5
					window.location.href = res.data;
					// #endif
					// #ifdef MP-WEIXIN
					console.log('MP-WEIXIN');
					wx.navigateToMiniProgram({
						appId:'wxc46c6d2eed27ca0a',
						path:'pages/merchantAddress/merchantAddress',
						extraData:{
							targetUrl:res.data
						},
						envVersion:'release',
						success(res){
							console.log(res)
						}
					});
					// #endif
				})
				.catch(err => {
					this.allinpaySubmitting = false;
				});
			this.allinpaySubmitting = false;
		}
	}
};
</script>

<style lang="scss">
.dz-list {
	.dz-list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 20rpx;
	}
}
.t-box {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	color: $dz-main-color;
	.tag {
		font-size: 22rpx;
		padding: 0 18rpx;
		border-radius: 24rpx;
		margin-right: 20rpx;
		border-width: 1rpx;
		border-style: solid;
	}
	.dzicon-iconfont {
		margin-right: 10rpx;
		font-size: 40rpx;
	}
	.dzicon-card_fill {
		color: $dz-type-warning-dark;
	}
}
.u-box {
	font-size: 28rpx;
	color: $dz-main-color;
	margin-top: 16rpx;
	.name {
		margin-right: 30rpx;
	}
}
.footer {
	width: 100%;
	position: fixed;
	z-index: 99;
	background-color: #fff;
	bottom: 0;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);	
}
.footer-btn {
	width: 100%;
	height: 120rpx;
	display: flex;
	align-items: center;
	margin-bottom: env(safe-area-inset-bottom);
}
</style>
