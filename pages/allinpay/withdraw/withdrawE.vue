<template>
	<view>
		<dz-navbar :title="'申请提现'"></dz-navbar>
		<view class="content">
			<dz-cell-item title="暂不支持提现" :border-bottom="false" hover-class="none" :arrow="false" v-if="parseInt(withdrawConfig.withdraw_is_open) == 0"></dz-cell-item>
			<view class="dz-p-30" :style="{color:theme.dzBaseColor}">
				<view>可提现至：银行卡</view>
			</view>
			<dz-cell-group :border="false">
				<dz-cell-item v-if="withdrawData" icon="round_redpacket_fill" icon-size="60" :icon-style="{'color': '#FDC561','margin-right': '30rpx'}" :title="`银联卡  ${withdrawData.account_number}`"  :label="`${withdrawData.bank_name}  ${withdrawData.mobile}`" :border-bottom="false" hover-class="none" @tap="toWithdraw"></dz-cell-item>
				<dz-cell-item  v-else icon="round_redpacket_fill"  icon-size="60" :icon-style="{'color': '#FDC561','margin-right': '30rpx'}" title="请选择提现账号" :border-bottom="false" hover-class="none" @tap="toWithdraw"></dz-cell-item>
			</dz-cell-group>
			<dz-field
				label-width="90"
				label=" ￥"
				v-model="money"
				placeholder="请输入提现金额"
				:border-bottom="false"
			>
			</dz-field>	
		</view>
		<view class="tip" :style="{ color: theme.dzBaseColor }">
			<view>可提金额：{{ withdrawConfig.promoter && withdrawConfig.promoter.user_brokerage }}元</view>
			<view>起提金额：{{ withdrawConfig.commission_withdraw_lowest_money }}元</view>
			<view>单次可提：{{ parseFloat(withdrawConfig.commission_withdraw_highest_money) > 0 ? withdrawConfig.commission_withdraw_highest_money + '元' : '不限' }}</view>
		</view>
		
		<view class="dz-p-l-30 dz-p-r-30 dz-color-9">
			<view v-for="(item, index) in withdrawConfig.commission_withdraw_desc" :key="index">{{ item }}</view>
		</view>
		
		<view class="dz-m-t-80">
			<dz-button :custom-style="{background:(parseInt(withdrawConfig.withdraw_is_open) == 0 || submitting)?theme.dzBaseDisabled:theme.dzBaseColor,color:theme.dzBaseFontColor,width:'90%'}" hover-class="none" shape="circle" :disabled="parseInt(withdrawConfig.withdraw_is_open) == 0 || submitting" @click="withdrawCreate">申请提现</dz-button>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
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
					<dz-button :custom-style="{background:allinpaySubmitting?theme.dzBaseDisabled:theme.dzBaseColor,color:theme.dzBaseFontColor,marginTop:'50rpx',marginLeft:'20rpx',marginRight:'20rpx'}" hover-class="none" :loading="allinpaySubmitting" @click="allinpayAuthSubmit">
						{{ language.orderPay.authSubmitLabel }}
					</dz-button>
				</view>
				<view v-if="allinpayStepCurrent === 1">
					<view class="dz-p-l-20 dz-p-r-20">
						<dz-field :label="language.orderPay.realnameLabel" v-model="allinpayRealname"></dz-field>
						<dz-field :label="language.orderPay.idLabel" v-model="allinpayId"></dz-field>
					</view>
					<dz-button :custom-style="{background:allinpaySubmitting?theme.dzBaseDisabled:theme.dzBaseColor,color:theme.dzBaseFontColor,marginTop:'50rpx',marginLeft:'20rpx',marginRight:'20rpx'}" hover-class="none" :loading="allinpaySubmitting" @click="allinpayRealnameSubmit">
						{{ language.orderPay.realnameSubmitLabel }}
					</dz-button>
				</view>
				<view v-if="allinpayStepCurrent === 2">
					<dz-button :custom-style="{background:allinpaySubmitting?theme.dzBaseDisabled:theme.dzBaseColor,color:theme.dzBaseFontColor,marginTop:'50rpx',marginLeft:'20rpx',marginRight:'20rpx'}" hover-class="none" :loading="allinpaySubmitting" @click="allinpaySignSubmit">
						前往签约
					</dz-button>
				</view>
			</view>
		</dz-popup>
	</view>
</template>

<script>
	import { mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				language: this.$api.language,
				theme:this.$api.theme,
				withdrawConfig: {},
				withdrawData: null,
				money: null,
				loadingShow: true,
				loadingStatus: 'loading',
				submitting:false,
				waitingSecond: 0,
				timeInterval:null,
				waitingCaptcha:false,
				allinpayShow:false,
				allinpayAddCardButtonDisable:false,
				allinpaySubmitting:false,
				lastCaptchaTimeStamp: 0,
				allinpayStep:[
					{ name: '认证' },
					{ name: '实名' },
					{ name: '签约' }
				],
				allinpayStepCurrent:0,
				allinpayAuthMobile:this.$api.store.state.userInfo.mobile || '',
				allinpayAuthCode:'',
				allinpayRealname:this.$api.store.state.userInfo.realname || '',
				allinpayId:'',
				allinpayAddBankcardShow:false,
				allinpayBankcard: '',
				allinpayBankcardMobile: '',
				allinpayBankcardCode: '',
				allinpayBankcardDefault: false,
			}
		},
		async onLoad() {
			uni.setNavigationBarTitle({
				title:'申请提现'
			})
			uni.$on('getBankAccount', data => {
				this.withdrawData = data;
			});
			uni.$on('updateBankAccount', data => {
				this.getWithdrawConfig()
			});
			await this.$onLaunched;
			this.getWithdrawConfig()
		},
		onShow() {
			this.getMemberInfo();
			this.getAllinpayInfo();
		},
		computed:{
			...mapState(['userInfo'])
		},
		methods: {
			...mapMutations(['setUserInfo']),
			getMemberInfo() {
				this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
					this.setUserInfo(res.data)
				}).catch(err => {
			
				});
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
			loadingClick() {
				this.getWithdrawConfig();
			},
			getWithdrawConfig() {
				this.$api.http.get(this.$api.apiDistribution.withdrawConfig).then(res=>{
					this.withdrawConfig = res.data;
					this.withdrawData = res.data.default_allinpay_card;
					this.withdrawConfig.commission_withdraw_desc = this.withdrawConfig.commission_withdraw_desc.split(/[\n]/g);
					this.loadingShow = false;
				}).catch(err=>{
					this.loadingStatus = 'error';
				})
			},
			getAllinpayInfo() {
				this.$api.http
					.get(this.$api.apiAllinpay.getQuerySignContract)
					.then(res => {
						this.userInfo.allinpay_eplus_member = res.data;
						let user = this.userInfo;
						user.allinpay_eplus_member = res.data;
						this.$api.store.commit('setUserInfo', user);
					})
					.catch(err => {});
			},
			toWithdraw() {
				this.$api.router.push({
					route: this.$api.routesConfig.allinpayCardE,
					query: {
						source: 1
					}
				})
			},
			// 申请提现
			withdrawCreate() {
				if(!this.allinpayCheck()){
					this.allinpayShow=true;
					return;
				}
				if(this.submitting){
					return;
				}
				this.money = parseFloat(this.money) || '';
				if (!this.money) {
					this.$refs.dzToast.show({
						title: '请输入提现金额',
						type: 'warning'
					})
					return;
				}
				this.money = parseFloat(this.money);
				if (!this.withdrawData) {
					this.$refs.dzToast.show({
						title: '请选择提现账号',
						type: 'warning'
					})
					return;
				}
				if (this.money < parseFloat(this.withdrawConfig.commission_withdraw_lowest_money)) {
					this.$refs.dzToast.show({
						title: `至少提现：${this.withdrawConfig.commission_withdraw_lowest_money}元`,
						type: 'warning'
					})
					return;
				}
				if (parseFloat(this.withdrawConfig.commission_withdraw_highest_money)>0 && this.money > parseFloat(this.withdrawConfig.commission_withdraw_highest_money)) {
					this.$refs.dzToast.show({
						title: `单次只能提现：${this.withdrawConfig.commission_withdraw_highest_money}元`,
						type: 'warning'
					})
					return;
				}
				if (this.money > parseFloat(this.withdrawConfig.promoter.user_brokerage)) {
					this.$refs.dzToast.show({
						title: '您的可提金额不够啊',
						type: 'warning'
					})
					return;
				}
				this.submitting=true;
				const params = {};
				params.bank_account_id = this.withdrawData.id;
				params.money = this.money;
				
				// #ifdef APP-PLUS
				let platform = this.$api.systemInfo.platform;
				if (platform == 'ios') {
					params.group = 'ios';
				} else if (platform == 'android') {
					params.group = 'android';
				} else {
					params.group = 'app';
				}
				// #endif
				
				// #ifdef H5
				if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
					params.group = 'wechat';
				} else {
					params.group = 'h5';
				}
				// #endif
				
				// #ifdef  MP-WEIXIN
				params.group = 'wechatMp';
				// #endif
				
				// #ifdef  MP-QQ
				params.group = 'qqMp';
				// #endif
				
				// #ifdef MP-ALIPAY
				params.group = 'aliMp';
				// #endif
				
				// #ifdef MP-BAIDU
				params.group = 'baiduMp';
				// #endif
				
				// #ifdef MP-TOUTIAO
				params.group = 'touTiaoMp';
				// #endif
				
				// #ifdef MP-360
				params.group = '360Mp';
				// #endif
				
				this.$api.http.post(this.$api.apiDistribution.withdrawCreate,params).then(res=>{
					this.submitting=false;
					this.$refs.dzToast.show({
						title: '提交成功',
						back: true
					})
					//重新获取配置
					this.getWithdrawConfig();
				}).catch(err=>{
					this.submitting=false;
				})
			},
			//通商云注册实名签约检测
			allinpayCheck() {
				//开户
				if (!this.userInfo.allinpay_eplus_member || parseInt(this.userInfo.allinpay_eplus_member.is_mobile) !== 1) {
					this.allinpayStepCurrent = 0;
					return false;
				}
				//实名认证
				if (parseInt(this.userInfo.allinpay_eplus_member.is_realname) !== 1) {
					this.allinpayStepCurrent = 1;
					return false;
				}
				//签约
				if (parseInt(this.userInfo.allinpay_eplus_member.is_sign) !== 1) {
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
					.post(this.$api.apiAllinpay.sendCodeEplus, { mobile: this.allinpayAuthMobile })
					.then(res => {
						if (parseInt(res.data.is_mobile) === 1) {
							let user = this.userInfo;
							user.allinpay_eplus_member = res.data;
							this.setUserInfo(user);
							this.$api.helper.toast(this.$api.language.orderPay.allinpayAlreadyAuth);
							if(this.allinpayCheck()){
								this.allinpayShow=false;
							}else{
								this.allinpayShow=true;
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
					.post(this.$api.apiAllinpay.bindPhoneEplus, { code: this.allinpayAuthCode })
					.then(res => {
						let user = this.userInfo;
						user.allinpay_eplus_member = res.data;
						this.setUserInfo(user);
						this.allinpaySubmitting = false;
						//清除短信等待
						this.waitingCaptcha = false;
						if (this.timeInterval) {
							clearInterval(this.timeInterval);
							this.timeInterval = null;
						}
						if(this.allinpayCheck()){
							this.allinpayShow=false;
						}else{
							this.allinpayShow=true;
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
					.post(this.$api.apiAllinpay.setRealNameEplus, { realname: this.allinpayRealname, identity_card: this.allinpayId })
					.then(res => {
						let user = this.userInfo;
						user.allinpay_eplus_member = res.data;
						this.setUserInfo(user);
						this.allinpaySubmitting = false;
						if(this.allinpayCheck()){
							this.allinpayShow=false;
						}else{
							this.allinpayShow=true;
						}
					})
					.catch(err => {
						this.allinpaySubmitting = false;
					});
			},
			//通商云签约
			async allinpaySignSubmit(){
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
				params.jump_url = url;
				// #endif
				params.jump_page_type = jump_page_type;
				
				await this.$api.http
					.get(this.$api.apiAllinpay.signContractEplus, {
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
			},
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx 0;
		background-color: #FFFFFF;
	}
	.tip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		font-size: 24rpx;
		color:$dz-type-error;
	}
	.tip-text {
		padding:  0 30rpx;
		font-size: 24rpx;
		color: #999;
	}
</style>
