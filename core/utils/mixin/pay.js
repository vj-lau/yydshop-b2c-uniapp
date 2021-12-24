//支付
import { mapState, mapGetters, mapMutations } from 'vuex';
module.exports = {
	data() {
		return {
			//公共参数
			language: this.$api.language,
			theme: this.$api.theme,
			shopSetting: this.$api.shopSetting,
			submitting: false,
			pageLoadingStatus: 'loading',
			pageLoadingShow: true,
			id:'',
			type: '',//公众号使用
			auto: '',//公众号使用
			wxCode: '',//公众号使用
			money: 0,//支付金额
			checkType: 0,//支付类型
			payConfig: {},//支付配置
			payGroup: '',//支付组别
			orderInfo: {},//订单信息
			orderGroup: '',//订单组别
			group: '',//客户端组别
			payTradeno: '',//支付流水号
			submitQuery:{},//提交参数
			apiUrl:'',//API提交地址
			wxAutoParam:{},//微信自动登录带入参数
			lastCaptchaTimeStamp: 0,
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			timeInterval: null,
			//通商云标准版
			allinpaySubmitting: false,
			allinpayBankCardPaySubmitting: false,
			allinpayCardList: [],
			allinpayUserShow: false,
			allinpayUserModalShow: false,
			allinpayBindCardShow: false,
			allinpayBindCardModalShow: false,
			allinpayAddBankcardShow: false,
			allinpayBankcardListShow: false,
			allinpayBankcardPayShow: false,
			allinpayAliPayShow: false,
			allinpaySchemeShow: false,
			allinpayBindCardStep: [
				{ name: this.$api.language.orderPay.allinpayStep1 },
				{ name: this.$api.language.orderPay.allinpayStep2 },
				{ name: this.$api.language.orderPay.allinpayStep3 }
			],
			allinpayBindCardStepCurrent: 0,
			allinpayAuthMobile: this.$api.store.state.userInfo.mobile || '',
			allinpayAuthCode: '',
			allinpayRealname: this.$api.store.state.userInfo.realname || '',
			allinpayId: '',
			allinpayBankcardType: '1',
			allinpayBankcard: '',
			allinpayBankcardMobile: '',
			allinpayBankcardValidate: '',
			allinpayBankcardCvv: '',
			allinpayBankcardCode: '',
			allinpayBankcardDefault: false,
			allinpayBankcardIndex: 0, //当前已选择的支付银行卡
			allinpayBankCardItem: {}, //当前支付的银行卡
			allinpayBankCardPayCode: '',
			allinpaySchemeAlipay: '',
			//通商云E+版
			allinpayEplusSubmitting: false,
			allinpayEplusUserShow: false,
			allinpayEplusUserModalShow: false,
			allinpayEplusAliPayShow: false,
			allinpayEplusSchemeShow: false,
			allinpayEplusAuthMobile: this.$api.store.state.userInfo.mobile || '',
			allinpayEplusAuthCode: '',
			allinpayEplusSchemeAlipay: '',
		}
	},
	computed: {
		...mapState(['userInfo'])
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.orderPay.titleOrderPay
		});
		
		this.id = e.id;
		this.type = e.type;
		this.auto = e.auto;
		this.wxCode = e.code || '';
		this.orderGroup = e.orderGroup;
		
		await this.$onLaunched;
		
		// #ifdef APP-PLUS
		let platform = this.$api.systemInfo.platform;
		if (platform == 'ios') {
			this.group = 'ios';
		} else if (platform == 'android') {
			this.group = 'android';
		} else {
			this.group = 'app';
		}
		this.payGroup = 'app';
		// #endif
		
		// #ifdef H5
		if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
			this.group = 'wechat';
			this.payGroup = 'wechat';
		} else {
			this.group = 'h5';
			this.payGroup = 'h5';
		}
		// #endif
		
		// #ifdef  MP-WEIXIN
		this.group = 'wechatMp';
		this.payGroup = 'miniprogram';
		// #endif
		
		// #ifdef  MP-QQ
		this.group = 'qqMp';
		// #endif
		
		// #ifdef MP-ALIPAY
		this.group = 'aliMp';
		// #endif
		
		// #ifdef MP-BAIDU
		this.group = 'baiduMp';
		// #endif
		
		// #ifdef MP-TOUTIAO
		this.group = 'touTiaoMp';
		// #endif
		
		// #ifdef MP-360
		this.group = '360Mp';
		// #endif
		
		this.initData();
		console.log('mixin loaded');
	},
	onShow() {
		this.computeLastCaptcha();
		// 小程序跳回APP
		// #ifdef APP-PLUS
		let args = plus.runtime.arguments || '';
		if (args) {
			if (args == 'allinpayAppWxPaySuccess') {
				plus.runtime.arguments = null;
				plus.runtime.arguments = '';
				this.getPayResult();
			} else if (args == 'allinpayAppWxPayFail') {
				plus.runtime.arguments = null;
				plus.runtime.arguments = '';
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.allinpayAppWxPayFail,
					type: 'warning'
				});
			}
		}
		// #endif
	},
	methods: {
		...mapMutations(['setUserInfo']),
		//初始化公共数据
		async initData() {
			//获取支付配置
			await this.$api.http
				.get(this.$api.apiShop.payConfig, {
					params: {
						group: this.group
					}
				})
				.then(res => {
					this.payConfig = res.data;
					this.payModeAutoSelect();
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					return;
				});
			//获取用户信息
			await this.$api.http
				.get(this.$api.apiShop.memberInfo)
				.then(res => {
					if (res.data.mobile_area == '86') {
						this.allinpayAuthMobile = res.data.mobile;
					}
					this.setUserInfo(res.data);
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					return;
				});
			// 如果是通商云且开放快捷支付，获取银行卡列表
			if (parseInt(this.payConfig[`pay_${this.payGroup}_quick`]) === 1 && parseInt(this.payConfig.order_quickpay_pay) === 1) {
				await this.$api.http
					.get(this.$api.apiAllinpay.getCardList)
					.then(res => {
						this.allinpayCardList = res.data;
						this.allinpayBankcardIndex = 0;
						for (let i = 0; i < this.allinpayCardList.length; i++) {
							if (parseInt(this.allinpayCardList[i].is_default_pay) === 1) {
								this.allinpayBankcardIndex = i;
								break;
							}
						}
					})
					.catch(err => {
						this.pageLoadingStatus = 'error';
						return;
					});
			}
			//微信公众号配置注册
			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				this.$api.wxHelper.wxConfig(window.location.href);
			}
			// #endif
			this.initOrder();
		},
		//验证码倒计时
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
		//页面重新载入
		async pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			this.initData();
		},
		//支付类型自动选择
		payModeAutoSelect() {
			if (parseInt(this.payConfig[`pay_${this.payGroup}_wechatpay`]) > 0) {
				this.checkType = 1;
				return;
			}
			if (parseInt(this.payConfig[`pay_${this.payGroup}_alipay`]) > 0) {
				this.checkType = 2;
				return;
			}
			if (parseInt(this.payConfig[`pay_${this.payGroup}_quick`]) > 0) {
				this.checkType = 8;
				return;
			}
			if (parseInt(this.payConfig[`pay_${this.payGroup}_balance`]) > 0) {
				this.checkType = 5;
				return;
			}
			if (parseInt(this.payConfig[`pay_${this.payGroup}_brokerage`]) > 0) {
				this.checkType = 7;
				return;
			}
		},
		//支付方式切换
		checkboxChange(e) {
			this.checkType = e;
		},
		//余额支付
		async balancePaySubmit() {
			if (parseFloat(this.userInfo.account.user_money) < this.money) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.balanceError,
					type: 'warning'
				});
				this.submitting = false;
				return;
			}
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 5,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					this.payTradeno = res.data.out_trade_no;
					let post = {...this.submitQuery,out_trade_no:this.payTradeno};
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.paySuccess,
						query: post
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//佣金支付
		async brokeragePaySubmit(query) {
			if (!(this.userInfo.promoter && (this.userInfo.promoter.promoterFission || this.userInfo.promoter.promoterRegional || this.userInfo.promoter.promoterStore || this.userInfo.promoter.promoterWarehouse))) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.commissionError,
					type: 'warning'
				});
				this.submitting = false;
				return;
			}
			if (!this.userInfo.promoter || !this.userInfo.promoter.user_brokerage || parseFloat(this.userInfo.promoter.user_brokerage) < this.money) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.brokerageError,
					type: 'warning'
				});
				this.submitting = false;
				return;
			}
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 7,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					this.payTradeno = res.data.out_trade_no;
					let post = {...this.submitQuery,out_trade_no:this.payTradeno};
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.paySuccess,
						query: post
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//快捷支付
		async quickPaySubmit() {
			//目前只有通商云标准版快捷支付
			if (parseInt(this.payConfig[`pay_${this.payGroup}_quick_mode`]) === 3) {
				if (!this.allinpayBindCardCheck()) {
					this.allinpayBindCardModalShow = true;
					this.submitting = false;
					return;
				}
				this.allinpayBankCardItem = this.allinpayCardList[this.allinpayBankcardIndex];
				//提交支付订单
				await this.$api.http
					.post(this.apiUrl, {
						order_group: this.orderGroup,
						group: this.group,
						pay_type: 8,
						allinpay_card_id: this.allinpayBankCardItem.id,
						data: JSON.stringify(this.orderInfo)
					})
					.then(res => {
						if(res.data.payStatus===true){
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.orderPaid,
								type: 'warning'
							});
							return;
						}
						this.submitting = false;
						this.payTradeno = res.data.out_trade_no;
						this.allinpayBankCardPayCode = '';
						//打开绑卡支付填写验证码窗口
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.allinpayBankCardPayCodeSended,
							type: 'success'
						});
						this.allinpayBankcardPayShow = true;
					})
					.catch(err => {
						this.submitting = false;
					});
			} else {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.payTypeDisabledError,
					type: 'warning'
				});
				this.submitting = false;
				return;
			}
		},
		//微信支付
		async wechatPaySubmit() {
			let thirdpartyPayMode = parseInt(this.payConfig[`pay_${this.payGroup}_wechatpay_mode`]);
			let orderWechatMethod = parseInt(this.payConfig[`pay_${this.payGroup}_wechatpay_option_id`]);
			let orderWechatOption = this.payConfig[`pay_${this.payGroup}_wechatpay_option`];
			if (thirdpartyPayMode === 0 || orderWechatMethod === 0) {
				console.log(this.payConfig);
				console.log(this.payGroup);
				//支付关闭
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.payMethodClosed,
					type: 'warning'
				});
				this.submitting = false;
				return;
			}
			if (thirdpartyPayMode === 3) {
				//通商云微信支付
				//目前通商云微信支付仅支持
				//公众号端（H5收银台）
				//APP端（跳转小程序支付（集团））
				//小程序支付（集团）
		
				//验证是否已通联认证
				if (!this.allinpayUserCheck()) {
					this.allinpayUserModalShow = true;
					this.submitting = false;
					return;
				}
				switch (orderWechatOption.method) {
					// 通联原生支付
					case 'native':
						//通联原生
						// #ifdef APP-PLUS
						//TODO 暂未支持，一般企业不会申请
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						// #ifndef APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'h5_cashier':
						//微信支付(收银宝)_集团
						//公众号
						// #ifdef H5
						if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
							this.allinpayCashierOrgPayInWechat();
						} else {
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.wechatPayH5Tip,
								type: 'warning'
							});
							this.submitting = false;
							return;
						}
						// #endif
						// #ifdef APP-PLUS
						this.allinpayAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.wechatPayH5Tip,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;	
					case 'miniprogram':
						// 微信小程序支付（收银宝）集团
						// #ifdef MP-WEIXIN
						this.allinpayMiniprogramOrgPayInWechatMp();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayMiniprogramOrgPayInApp();
						// #endif
						// #ifndef MP-WEIXIN || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInAppOrWechatMp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'js':
						//微信JS支付(公众号)_集团
						// #ifdef H5
						if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
							this.normalNativePayInWechat();
						} else {
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payNotInWechat,
								type: 'warning'
							});
							this.submitting = false;
						}
						// #endif
						// #ifndef H5
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInWechat,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
				}
			} else if (thirdpartyPayMode === 4) {
				//通商云E+微信支付
				//目前通商云微信支付仅支持
				//公众号端（H5收银台）
				//APP端（跳转小程序支付（集团））
				//小程序支付（集团）

				//验证是否已通联E+认证
				if (!this.allinpayEplusUserCheck()) {
					this.allinpayEplusUserModalShow = true;
					this.submitting = false;
					return;
				}
				switch (orderWechatOption.method) {
					// 通联E+原生支付
					case 'native':
						//通联原生
						// #ifdef APP-PLUS
						//TODO 暂未支持，一般企业不会申请
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						// #ifndef APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'h5_cashier':
						//微信支付(收银宝)_集团
						//公众号
						// #ifdef H5
						if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
							this.allinpayEplusCashierOrgPayInWechat();
						} else {
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.wechatPayH5Tip,
								type: 'warning'
							});
							this.submitting = false;
							return;
						}
						// #endif
						// #ifdef APP-PLUS
						this.allinpayEplusAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.wechatPayH5Tip,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;	
					case 'miniprogram':
						// 微信小程序支付（收银宝）集团
						// #ifdef MP-WEIXIN
						this.allinpayEplusMiniprogramOrgPayInWechatMp();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayEplusMiniprogramOrgPayInApp();
						// #endif
						// #ifndef MP-WEIXIN || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInAppOrWechatMp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'js':
						//微信JS支付(公众号)_集团
						// #ifdef H5
						if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
							this.normalNativePayInWechat();
						} else {
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payNotInWechat,
								type: 'warning'
							});
							this.submitting = false;
						}
						// #endif
						// #ifndef H5
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInWechat,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
				}
			} else if (thirdpartyPayMode === 1) {
				//原生微信支付
				//公众号
				console.log('normalNativePayInWechat');
				// #ifdef H5
				if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
					this.normalNativePayInWechat();
				} else {
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.wechatPayH5Tip,
						type: 'warning'
					});
					this.submitting = false;
					return;
				}
				// #endif
				//小程序
				// #ifdef MP-WEIXIN
				this.normalNativePayInWechatMp();
				// #endif
				//APP
				// #ifdef APP-PLUS
				this.normalNativePayWxInApp();
				// #endif
			} else if (thirdpartyPayMode === 2) {
				//通联微信基础支付
				switch (orderWechatOption.method) {
					case 'h5_cashier':
						//公众号
						// #ifdef H5
						if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
							this.allinpayCashierOrgPayInWechat();
						} else {
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.wechatPayH5Tip,
								type: 'warning'
							});
							this.submitting = false;
							return;
						}
						// #endif
						// #ifdef MP || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.wechatPayH5Tip,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'miniprogram':
						// 微信小程序支付（收银宝）集团
						// #ifdef MP-WEIXIN
						this.normalNativePayInWechatMp();
						// #endif
						// #ifndef MP-WEIXIN
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInAppOrWechatMp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					// 微信JS支付（公众号）
					case 'js':
						//微信JS支付(公众号)_集团
						// #ifdef H5
						if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
							this.normalNativePayInWechat();
						} else {
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payNotInWechat,
								type: 'warning'
							});
							this.submitting = false;
						}
						// #endif
						// #ifndef H5
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInWechat,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
				}
			}
		},
		/**
		 * 通商云收银台集团/通联基础收银台
		 * 微信公众号中支付
		 */
		async allinpayCashierOrgPayInWechat() {
			//请求创建支付订单
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 1,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.payTradeno = res.data.out_trade_no;
					this.submitting = false;
					window.location.href = res.data.config;
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//通商云微信小程序支付集团（小程序中支付）
		async allinpayMiniprogramOrgPayInWechatMp() {
			let mpOpenid = '';
			await this.$api.http
				.post(this.$api.apiShop.isBindingCheck, {
					oauth_client: 'wechatMp'
				})
				.then(res => {
					mpOpenid = res.data.openid;
				})
				.catch(err => {
					this.submitting = false;
				});
			if (mpOpenid) {
				//如果已授权
				await this.$api.http
					.post(this.apiUrl, {
						order_group: this.orderGroup,
						group: this.group,
						pay_type: 1,
						openid: mpOpenid,
						data: JSON.stringify(this.orderInfo)
					})
					.then(res => {
						if(res.data.payStatus===true){
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.orderPaid,
								type: 'warning'
							});
							return;
						}
						this.payTradeno = res.data.out_trade_no;
						uni.requestPayment({
							...res.data.config,
							success: () => {
								this.submitting = false;
								this.getPayResult();
							},
							fail: paymentErr => {
								console.log(JSON.stringify(paymentErr));
								this.submitting = false;
								this.$refs.dzToast.show({
									title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
									type: 'warning'
								});
							}
						});
					})
					.catch(err => {
						this.submitting = false;
					});
			} else {
				//如果未授权，获取code
				uni.login({
					provider: 'weixin',
					success: async loginRes => {
						await this.$api.http
							.post(
								this.apiUrl,
								{
									order_group: this.orderGroup,
									group: this.group,
									pay_type: 1,
									data: JSON.stringify(this.orderInfo)
								},
								{ params: { code: loginRes.code } }
							)
							.then(res => {
								if(res.data.payStatus===true){
									this.$refs.dzToast.show({
										title: this.$api.language.orderPay.orderPaid,
										type: 'warning'
									});
									return;
								}
								this.payTradeno = res.data.out_trade_no;
								uni.requestPayment({
									...res.data.config,
									success: () => {
										this.submitting = false;
										this.getPayResult();
									},
									fail: paymentErr => {
										console.log(JSON.stringify(paymentErr));
										this.submitting = false;
										this.$refs.dzToast.show({
											title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
											type: 'warning'
										});
									}
								});
							})
							.catch(err => {
								this.submitting = false;
							});
					},
					fail: loginErr => {
						console.log(JSON.stringify(loginErr));
						this.submitting = false;
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
							type: 'warning'
						});
					}
				});
			}
		},
		//通商云微信小程序支付集团（APP中跳转小程序支付）
		async allinpayMiniprogramOrgPayInApp() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 1,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.payTradeno = res.data.out_trade_no;
					plus.share.getServices(
						serviceRes => {
							let sweixin = null;
							for (let i = 0; i < serviceRes.length; i++) {
								let t = serviceRes[i];
								if (t.id == 'weixin') {
									sweixin = t;
									break;
								}
							}
							if (!sweixin) {
								this.$refs.dzToast.show({
									title: this.$api.language.orderPay.launchMiniProgrameError,
									type: 'warning'
								});
								this.submitting = false;
								return;
							}
							//todo:这一句有点问题，这里仅仅针对普通订单
							sweixin.launchMiniProgram({
								id: this.$api.shopSetting.miniprogram_id,
								type: this.$api.shopSetting.miniprogram_type,
								path: this.$api.routesConfig.allinpayAppWxPay.path + '?order_id=' + this.orderInfo.order_id + '&member_id=' + this.orderInfo.member_id
							});
							this.submitting = false;
						},
						serviceErr => {
							console.log(JSON.stringify(serviceErr));
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payFailTip + serviceErr.message,
								type: 'warning'
							});
							this.submitting = false;
						}
					);
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//微信公众号原生支付
		async normalNativePayInWechat() {
			let wxOpenid = '';
			let _this = this;
			await this.$api.http
				.post(this.$api.apiShop.isBindingCheck, {
					oauth_client: 'wechat'
				})
				.then(res => {
					wxOpenid = res.data.openid;
				})
				.catch(err => {
					this.submitting = false;
				});
			if (wxOpenid) {
				//如果已授权
				await this.$api.http
					.post(this.apiUrl, {
						order_group: this.orderGroup,
						group: this.group,
						pay_type: 1,
						openid: wxOpenid,
						data: JSON.stringify(this.orderInfo)
					})
					.then(async res => {
						if(res.data.payStatus===true){
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.orderPaid,
								type: 'warning'
							});
							return;
						}
						this.payTradeno = res.data.out_trade_no;
						this.$api.jweixin.ready(() => {
							this.$api.jweixin.chooseWXPay({
								...res.data.config,
								success(res) {
									_this.submitting = false;
									_this.getPayResult();
								},
								fail(err) {
									_this.submitting = false;
									_this.$refs.dzToast.show({
										title: _this.$api.language.orderPay.wxPayFailTip,
										type: 'warning'
									});
								},
								cancel(msg) {
									_this.submitting = false;
								}
							});
						});
					})
					.catch(err => {
						this.submitting = false;
					});
			} else {
				//如果未授权，获取code
				if (this.wxCode) {
					console.log('wxCode got and pay');
					await this.$api.http
						.post(
							this.apiUrl,
							{
								order_group: this.orderGroup,
								group: this.group,
								pay_type: 1,
								data: JSON.stringify(this.orderInfo)
							},
							{ params: { code: this.wxCode } }
						)
						.then(async res => {
							if(res.data.payStatus===true){
								this.$refs.dzToast.show({
									title: this.$api.language.orderPay.orderPaid,
									type: 'warning'
								});
								return;
							}
							this.payTradeno = res.data.out_trade_no;
							this.$api.jweixin.ready(() => {
								this.$api.jweixin.chooseWXPay({
									...res.data.config,
									success(res) {
										_this.wxCode = '';
										_this.submitting = false;
										_this.getPayResult();
									},
									fail(res) {
										_this.wxCode = '';
										_this.submitting = false;
										_this.$refs.dzToast.show({
											title: _this.$api.language.orderPay.wxPayFailTip,
											type: 'warning'
										});
									},
									cancel(msg) {
										_this.wxCode = '';
										_this.submitting = false;
									}
								});
							});
						})
						.catch(err => {
							this.submitting = false;
						});
				} else {
					//向微信申请CODE
					let h5Url = this.$api.helper.delAllUrlParams(window.location.href);
					let url = this.$api.helper.objParseUrlAndParam(h5Url, { ...this.wxAutoParam, auto: 'wechat', r: this.$api.helper.guid(16) });
					//避免缓存
					url = encodeURIComponent(url);
					window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?
																				appid=${this.$api.shopSetting.wechat_appid}&
																				redirect_uri=${url}&
																				response_type=code&
																				scope=snsapi_userinfo&
																				state=STATE#wechat_redirect`;
				}
			}
		},
		//小程序原生支付
		async normalNativePayInWechatMp() {
			let mpOpenid = '';
			await this.$api.http
				.post(this.$api.apiShop.isBindingCheck, {
					oauth_client: 'wechatMp'
				})
				.then(res => {
					mpOpenid = res.data.openid;
				})
				.catch(err => {
					this.submitting = false;
				});
			if (mpOpenid) {
				//如果已授权
				await this.$api.http
					.post(this.apiUrl, {
						order_group: this.orderGroup,
						group: this.group,
						pay_type: 1,
						openid: mpOpenid,
						data: JSON.stringify(this.orderInfo)
					})
					.then(res => {
						if(res.data.payStatus===true){
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.orderPaid,
								type: 'warning'
							});
							return;
						}
						this.payTradeno = res.data.out_trade_no;
						uni.requestPayment({
							...res.data.config,
							timeStamp: res.data.config.timestamp,
							success: () => {
								this.submitting = false;
								this.getPayResult();
							},
							fail: paymentErr => {
								console.log(JSON.stringify(paymentErr));
								this.submitting = false;
								this.$refs.dzToast.show({
									title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
									type: 'warning'
								});
							}
						});
					})
					.catch(err => {
						this.submitting = false;
					});
			} else {
				//如果未授权，获取code
				uni.login({
					provider: 'weixin',
					success: async loginRes => {
						await this.$api.http
							.post(
								this.apiUrl,
								{
									order_group: this.orderGroup,
									group: this.group,
									pay_type: 1,
									data: JSON.stringify(this.orderInfo)
								},
								{ params: { code: loginRes.code } }
							)
							.then(res => {
								if(res.data.payStatus===true){
									this.$refs.dzToast.show({
										title: this.$api.language.orderPay.orderPaid,
										type: 'warning'
									});
									return;
								}
								this.payTradeno = res.data.out_trade_no;
								uni.requestPayment({
									...res.data.config,
									timeStamp: res.data.config.timestamp,
									success: () => {
										this.submitting = false;
										this.getPayResult();
									},
									fail: paymentErr => {
										console.log(JSON.stringify(paymentErr));
										this.submitting = false;
										this.$refs.dzToast.show({
											title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
											type: 'warning'
										});
									}
								});
							})
							.catch(err => {
								this.submitting = false;
							});
					},
					fail: loginErr => {
						console.log(JSON.stringify(loginErr));
						this.submitting = false;
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
							type: 'warning'
						});
					}
				});
			}
		},
		//APP原生微信支付
		async normalNativePayWxInApp() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 1,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.payTradeno = res.data.out_trade_no;
					uni.requestPayment({
						...res.data.config,
						success: () => {
							this.submitting = false;
							this.getPayResult();
						},
						fail: paymentErr => {
							console.log(JSON.stringify(paymentErr));
							this.submitting = false;
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
								type: 'warning'
							});
						}
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//支付宝支付
		aliPaySubmit() {
			let thirdpartyPayMode = parseInt(this.payConfig[`pay_${this.payGroup}_alipay_mode`]);
			let orderAliMethod = parseInt(this.payConfig[`pay_${this.payGroup}_alipay_option_id`]);
			let orderWechatOption = this.payConfig[`pay_${this.payGroup}_alipay_option`];
			if (orderAliMethod === 0 || orderAliMethod === 0) {
				//支付关闭
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.payMethodClosed,
					type: 'warning'
				});
				this.submitting = false;
				return;
			}
			if (thirdpartyPayMode === 3) {
				//通商云支付宝支付
				//目前仅支持收银台集团
				//应用于H5和APP
				//验证是否已通联认证
				if (!this.allinpayUserCheck()) {
					this.allinpayUserModalShow = true;
					this.submitting = false;
					return;
				}
				switch (orderWechatOption.method) {
					case 'native':
						//通联原生
						//TODO 暂未支持
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						break;
					case 'h5_cashier':
						//收银宝H5收银台_集团
						// #ifdef H5
						this.allinpayAlipayCashierOrgInH5();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInH5OrApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'app':
						//收银宝支付宝APP支付_集团
						//TODO 暂未支持
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						break;
					case 'js':
						//支付宝JS支付（生活号）
						//支付宝JS支付(生活号)_集团
						// #ifdef H5
						this.allinpayAlipayCashierOrgInH5();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInH5OrApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
				}
			} else if (thirdpartyPayMode === 4) {
				//通商云E+支付宝支付
				//目前仅支持收银台集团
				//应用于H5和APP
				//验证是否已通联认证
				if (!this.allinpayEplusUserCheck()) {
					this.allinpayEplusUserModalShow = true;
					this.submitting = false;
					return;
				}
				switch (orderWechatOption.method) {
					case 'native':
						//通联原生
						//TODO 暂未支持
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						break;
					case 'h5_cashier':
						//收银宝H5收银台_集团
						// #ifdef H5
						this.allinpayEplusAlipayCashierOrgInH5();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayEplusAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInH5OrApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'app':
						//收银宝支付宝APP支付_集团
						//TODO 暂未支持
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						break;
					case 'js':
						// 支付宝JS支付（生活号）
						//支付宝JS支付(生活号)_集团
						// #ifdef H5
						this.allinpayEplusAlipayCashierOrgInH5();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayEplusAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInH5OrApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
				}
			} else if (thirdpartyPayMode === 1) {
				//原生支付宝支付
				// #ifdef H5
				if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.payNotInH5,
						type: 'warning'
					});
					this.submitting = false;
				} else {
					this.normalNativePayAliInH5();
				}
				// #endif
				// #ifdef APP-PLUS
				this.normalNativePayAliInApp();
				// #endif
				// #ifndef H5 || APP-PLUS
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.payNotInH5OrApp,
					type: 'warning'
				});
				this.submitting = false;
				// #endif
			} else if (thirdpartyPayMode === 2) {
				//通联基础收银台支付
				switch (orderWechatOption.method) {
					case 'h5_cashier':
						// #ifdef H5
						this.allinpayAlipayCashierOrgInH5();
						// #endif
						// #ifdef APP-PLUS
						this.allinpayAlipayCashierOrgInApp();
						// #endif
						// #ifndef H5 || APP-PLUS
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payNotInH5OrApp,
							type: 'warning'
						});
						this.submitting = false;
						// #endif
						break;
					case 'app':
						//收银宝支付宝APP支付_集团
						//TODO 暂未支持
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payMethodNoSupported,
							type: 'warning'
						});
						this.submitting = false;
						break;
					case 'js':
						// 支付宝JS支付（生活号）
						//支付宝JS支付(生活号)_集团
						this.allinpayAlipayCashierOrgInH5();
						this.submitting = false;
						break;
				}
			}
		},
		/**
		 * 通联收银台集团支付宝H5/通联基础收银台
		 */
		async allinpayAlipayCashierOrgInH5() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 2,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					//跳转到支付宝打开支付页面
					this.submitting = false;
					this.payTradeno = res.data.out_trade_no;
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.aliMiddle,
						query:{...this.submitQuery,out_trade_no:this.payTradeno,url:encodeURIComponent(res.data.config)}
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		/**
		 * 通商云E+收银台集团/通联E+基础收银台
		 * 微信公众号中支付
		 */
		async allinpayEplusCashierOrgPayInWechat() {
			//请求创建支付订单
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 1,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.payTradeno = res.data.out_trade_no;
					this.submitting = false;
					window.location.href = res.data.config;
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//通商云E+微信小程序支付集团（小程序中支付）
		async allinpayEplusMiniprogramOrgPayInWechatMp() {
			let mpOpenid = '';
			await this.$api.http
				.post(this.$api.apiShop.isBindingCheck, {
					oauth_client: 'wechatMp'
				})
				.then(res => {
					mpOpenid = res.data.openid;
				})
				.catch(err => {
					this.submitting = false;
				});
			if (mpOpenid) {
				//如果已授权
				await this.$api.http
					.post(this.apiUrl, {
						order_group: this.orderGroup,
						group: this.group,
						pay_type: 1,
						openid: mpOpenid,
						data: JSON.stringify(this.orderInfo)
					})
					.then(res => {
						if(res.data.payStatus===true){
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.orderPaid,
								type: 'warning'
							});
							return;
						}
						this.payTradeno = res.data.out_trade_no;
						uni.requestPayment({
							...res.data.config,
							success: () => {
								this.submitting = false;
								this.getPayResult();
							},
							fail: paymentErr => {
								console.log(JSON.stringify(paymentErr));
								this.submitting = false;
								this.$refs.dzToast.show({
									title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
									type: 'warning'
								});
							}
						});
					})
					.catch(err => {
						this.submitting = false;
					});
			} else {
				//如果未授权，获取code
				uni.login({
					provider: 'weixin',
					success: async loginRes => {
						await this.$api.http
							.post(
								this.apiUrl,
								{
									order_group: this.orderGroup,
									group: this.group,
									pay_type: 1,
									data: JSON.stringify(this.orderInfo)
								},
								{ params: { code: loginRes.code } }
							)
							.then(res => {
								if(res.data.payStatus===true){
									this.$refs.dzToast.show({
										title: this.$api.language.orderPay.orderPaid,
										type: 'warning'
									});
									return;
								}
								this.payTradeno = res.data.out_trade_no;
								uni.requestPayment({
									...res.data.config,
									success: () => {
										this.submitting = false;
										this.getPayResult();
									},
									fail: paymentErr => {
										console.log(JSON.stringify(paymentErr));
										this.submitting = false;
										this.$refs.dzToast.show({
											title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
											type: 'warning'
										});
									}
								});
							})
							.catch(err => {
								this.submitting = false;
							});
					},
					fail: loginErr => {
						console.log(JSON.stringify(loginErr));
						this.submitting = false;
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
							type: 'warning'
						});
					}
				});
			}
		},
		//通商云微信小程序支付集团（APP中跳转小程序支付）
		async allinpayEplusMiniprogramOrgPayInApp() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 1,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.payTradeno = res.data.out_trade_no;
					plus.share.getServices(
						serviceRes => {
							let sweixin = null;
							for (let i = 0; i < serviceRes.length; i++) {
								let t = serviceRes[i];
								if (t.id == 'weixin') {
									sweixin = t;
									break;
								}
							}
							if (!sweixin) {
								this.$refs.dzToast.show({
									title: this.$api.language.orderPay.launchMiniProgrameError,
									type: 'warning'
								});
								this.submitting = false;
								return;
							}
							//todo:这一句有点问题,这个仅仅针对普通订单
							sweixin.launchMiniProgram({
								id: this.$api.shopSetting.miniprogram_id,
								type: this.$api.shopSetting.miniprogram_type,
								path: this.$api.routesConfig.allinpayAppWxPay.path + '?order_id=' + this.orderInfo.order_id + '&member_id=' + this.orderInfo.member_id
							});
							this.submitting = false;
						},
						serviceErr => {
							console.log(JSON.stringify(serviceErr));
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payFailTip + serviceErr.message,
								type: 'warning'
							});
							this.submitting = false;
						}
					);
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		/**
		 * 通联E+收银台集团支付宝H5/通联基础收银台
		 */
		async allinpayEplusAlipayCashierOrgInH5() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 2,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					//跳转到支付宝打开支付页面
					this.submitting = false;
					this.payTradeno = res.data.out_trade_no;
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.aliMiddle,
						query:{...this.submitQuery,out_trade_no:this.payTradeno,url:encodeURIComponent(res.data.config)}
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		/**
		 * 打开支付宝
		 */
		allinpaySchemeAlipayClick() {
			this.allinpaySchemeShow = false;
			this.allinpayAliPayShow = true;
		},
		/**
		 * 打开支付宝
		 */
		allinpayEplusSchemeAlipayClick() {
			this.allinpayEplusSchemeShow = false;
			this.allinpayEplusAliPayShow = true;
		},
		/**
		 * 通联标准版收银台集团支付宝H5/通联基础收银台
		 */
		async allinpayAlipayCashierOrgInApp() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 2,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.submitting = false;
					this.payTradeno = res.data.out_trade_no;
					let payUrl = 'alipays://platformapi/startapp?appId=20000067&url=' + encodeURIComponent(res.data.config);
					this.allinpayAliPayShow = true;
					plus.runtime.openURL(payUrl, error => {
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.openAlipayError,
							type: 'warning'
						});
						this.allinpayAliPayShow = false;
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		/**
		 * 通联E+收银台集团支付宝H5/通联基础收银台
		 */
		async allinpayEplusAlipayCashierOrgInApp() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 2,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.submitting = false;
					this.payTradeno = res.data.out_trade_no;
					let payUrl = 'alipays://platformapi/startapp?appId=20000067&url=' + encodeURIComponent(res.data.config);
					this.allinpayEplusAliPayShow = true;
					plus.runtime.openURL(payUrl, error => {
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.openAlipayError,
							type: 'warning'
						});
						this.allinpayEplusAliPayShow = false;
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//H5原生支付宝支付
		async normalNativePayAliInH5() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 2,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.submitting = false;
					this.payTradeno = res.data.out_trade_no;
					window.location.href = res.data.config.config;
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//APP原生支付宝支付
		async normalNativePayAliInApp() {
			await this.$api.http
				.post(this.apiUrl, {
					order_group: this.orderGroup,
					group: this.group,
					pay_type: 2,
					data: JSON.stringify(this.orderInfo)
				})
				.then(res => {
					if(res.data.payStatus===true){
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.orderPaid,
							type: 'warning'
						});
						return;
					}
					this.payTradeno = res.data.out_trade_no;
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: res.data.config.config,
						success: () => {
							this.submitting = false;
							this.getPayResult();
						},
						fail: paymentErr => {
							console.log(JSON.stringify(paymentErr));
							this.submitting = false;
							this.$refs.dzToast.show({
								title: this.$api.language.orderPay.payFailTip + paymentErr.errMsg,
								type: 'warning'
							});
						}
					});
				})
				.catch(err => {
					this.submitting = false;
				});
		},
		//查询支付结果
		getPayResult() {
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.payComplete,
				query: {...this.submitQuery,out_trade_no:this.payTradeno}
			});
		},
		//充值
		rechargeClick() {
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.recharge,
				query: {}
			});
		},
		//----------------------------------通商云E+版START--------------------------------
		//通商云E+开户检测
		allinpayEplusUserCheck() {
			//开户
			if (!this.userInfo.allinpay_eplus_member || parseInt(this.userInfo.allinpay_eplus_member.is_mobile) !== 1) {
				return false;
			}
			return true;
		},
		//通商云E+开户确认
		allinpayEplusAuthConfirm() {
			this.allinpayEplusUserShow = true;
		},
		//获取通商云E+认证短信
		async allinpayEplusAuthCodeSubmit() {
			if (this.allinpayEplusSubmitting) {
				return;
			}
			if (!this.$api.helper.isMobile(this.allinpayEplusAuthMobile, '86')) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.authMobileError,
					type: 'warning'
				});
				return;
			}
			await this.$api.http
				.post(this.$api.apiAllinpay.sendCodeEplus, { mobile: this.allinpayEplusAuthMobile })
				.then(res => {
					if (parseInt(res.data.is_mobile) === 1) {
						let user = this.userInfo;
						user.allinpay_eplus_member = res.data;
						this.setUserInfo(user);
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.allinpayAlreadyAuth,
							type: 'success'
						});
						//通商云E+没有快捷支付
						this.allinpayEplusUserShow = false;
						this.paySubmit();
					} else {
						this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
						this.computeLastCaptcha();
					}
				})
				.catch(err => {
					return;
				});
		},
		//通商云E+认证提交
		async allinpayEplusAuthSubmit() {
			if (this.allinpayEplusSubmitting) {
				return;
			}
			if (!this.$api.helper.isMobile(this.allinpayEplusAuthMobile, '86')) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.authMobileError,
					type: 'warning'
				});
				return;
			}
			if (!this.allinpayEplusAuthCode) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.codeError,
					type: 'warning'
				});
				return;
			}
			this.allinpayEplusSubmitting = true;
			//提交通商云认证
			await this.$api.http
				.post(this.$api.apiAllinpay.bindPhoneEplus, { code: this.allinpayEplusAuthCode })
				.then(res => {
					let user = this.userInfo;
					user.allinpay_eplus_member = res.data;
					this.setUserInfo(user);
					this.allinpayEplusSubmitting = false;
					//清除短信等待
					this.waitingCaptcha = false;
					if (this.timeInterval) {
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
				})
				.catch(err => {
					this.allinpayEplusSubmitting = false;
					return;
				});
			this.allinpayEplusUserShow = false;
			this.paySubmit();
		},
		//----------------------------------通商云E+版END--------------------------------
		//----------------------------------通商云标准版START--------------------------------
		//通商云开户检测
		allinpayUserCheck() {
			//开户
			if (!this.userInfo.allinpay_yun_member || parseInt(this.userInfo.allinpay_yun_member.is_mobile) !== 1) {
				return false;
			}
			return true;
		},
		//通商云绑卡检测
		allinpayBindCardCheck() {
			//开户
			if (!this.userInfo.allinpay_yun_member || parseInt(this.userInfo.allinpay_yun_member.is_mobile) !== 1) {
				this.allinpayBindCardStepCurrent = 0;
				return false;
			}
			//绑定银行卡需要实名认证
			if (parseInt(this.userInfo.allinpay_yun_member.is_realname) !== 1) {
				this.allinpayBindCardStepCurrent = 1;
				return false;
			}
			//绑定银行卡
			if (this.allinpayCardList.length === 0) {
				this.allinpayBindCardStepCurrent = 2;
				return false;
			}
			return true;
		},
		/**
		 * 通商云注册确认
		 */	
		allinpayAuthConfirm() {
			this.allinpayUserShow = true;
		},
		/**
		 * 通商云绑卡确认
		 */
		allinpayBindcardConfirm() {
			this.allinpayBindCardShow = true;
		},
		//获取通商云认证短信
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
						user.allinpay_user = res.data;
						this.setUserInfo(user);
						this.$refs.dzToast.show({
							title: this.$api.language.orderPay.allinpayAlreadyAuth,
							type: 'success'
						});
						//按支付模式直接进行支付或下一步
						if (this.checkType === 8) {
							if (this.allinpayBindCardCheck()) {
								this.allinpayUserShow = false;
								this.paySubmit();
							} else {
								this.allinpayUserShow = true;
							}
						} else {
							//继续支付
							this.allinpayUserShow = false;
							this.paySubmit();
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
				})
				.catch(err => {
					this.allinpaySubmitting = false;
					return;
				});
			//按支付模式直接进行支付或下一步
			if (this.checkType === 8) {
				if (this.allinpayBindCardCheck()) {
					this.allinpayUserShow = false;
					this.paySubmit();
				} else {
					this.allinpayUserShow = true;
				}
			} else {
				//继续支付
				this.allinpayUserShow = false;
				this.paySubmit();
			}
		},
		//通商云提交实名认证
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
				})
				.catch(err => {
					this.allinpaySubmitting = false;
					return;
				});
			if (this.allinpayBindCardCheck()) {
				this.allinpayUserShow = false;
				this.paySubmit();
			} else {
				this.allinpayUserShow = true;
			}
		},
		//获取通商云绑卡短信
		async allinpayBindcardCodeSubmit() {
			let postData = {};
			postData.card_no = this.allinpayBankcard;
			postData.card_phone = this.allinpayBankcardMobile;
			postData.is_default_pay = this.allinpayBankcardDefault ? 1 : 0;
		
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
			if (parseInt(this.allinpayBankcardType) === 2) {
				postData.validate = this.allinpayBankcardValidate;
				postData.cvv2 = this.allinpayBankcardCvv;
				if (!this.allinpayBankcardValidate) {
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.bankcardValidateError,
						type: 'warning'
					});
					return;
				}
				if (!this.allinpayBankcardCvv) {
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.bankcardCvvError,
						type: 'warning'
					});
					return;
				}
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
		//通商云请求绑卡认证
		async allinpayBindCardSubmit() {
			let postData = {};
			postData.card_no = this.allinpayBankcard;
			postData.code = this.allinpayBankcardCode;
			postData.is_default_pay = this.allinpayBankcardDefault ? 1 : 0;
		
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
			if (parseInt(this.allinpayBankcardType) === 2) {
				postData.validate = this.allinpayBankcardValidate;
				postData.cvv2 = this.allinpayBankcardCvv;
				if (!this.allinpayBankcardValidate) {
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.bankcardValidateError,
						type: 'warning'
					});
					return;
				}
				if (!this.allinpayBankcardCvv) {
					this.$refs.dzToast.show({
						title: this.$api.language.orderPay.bankcardCvvError,
						type: 'warning'
					});
					return;
				}
			}
			this.allinpaySubmitting = true;
			await this.$api.http
				.post(this.$api.apiAllinpay.bindCardAgree, { ...postData })
				.then(res => {
					this.allinpayBankcardIndex = 0;
					this.allinpayCardList.unshift(res.data);
					this.allinpaySubmitting = false;
					this.allinpayBankcard = '';
					this.allinpayBankcardCode = '';
					this.allinpayBankcardValidate = '';
					this.allinpayBankcardCvv = '';
					this.allinpayBankcardDefault = false;
					//清除短信等待
					this.waitingCaptcha = false;
					if (this.timeInterval) {
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
				})
				.catch(err => {
					this.allinpaySubmitting = false;
					return;
				});
			this.allinpayBindCardShow = false;
			this.allinpayAddBankcardShow = false;
			//继续支付
			this.paySubmit();
		},
		//通商云打开选择支付卡弹窗
		allinpayChoiceBankcardClick(e) {
			if (this.allinpayCardList.length > 0) {
				this.allinpayBankcardListShow = true;
			} else {
				if (!this.allinpayBindCardCheck()) {
					this.allinpayBindCardShow = true;
				} else {
					this.allinpayAddBankcardShow = true;
				}
			}
		},
		//通商云选择支付卡
		allinpayPayCardChange(e) {
			this.allinpayBankcardIndex = e.index;
			this.allinpayBankcardListShow = false;
		},
		//通商云增加支付卡
		allinpayBankcardAddClick(e) {
			this.allinpayBankcardListShow = false;
			if (!this.allinpayBindCardCheck()) {
				this.allinpayBindCardShow = true;
			} else {
				this.allinpayAddBankcardShow = true;
			}
		},
		//通商云支付卡支付提交
		async allinpayBindCardPaySubmit() {
			if (this.allinpayBankCardPaySubmitting) {
				return;
			}
			if (!this.allinpayBankCardPayCode) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.bankcardSendCodeError,
					type: 'warning'
				});
				return;
			}
			if (!this.payTradeno) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.payTradenoError,
					type: 'warning'
				});
				return;
			}
			this.allinpayBankCardPaySubmitting = true;
			await this.$api.http
				.post(this.$api.apiShop.payBySendCode, {
					code: this.allinpayBankCardPayCode,
					out_trade_no: this.payTradeno
				})
				.then(res => {
					this.allinpayBankCardPaySubmitting = false;
					this.allinpayBankcardPayShow = false;
					this.getPayResult();
				})
				.catch(err => {
					this.allinpayBankCardPaySubmitting = false;
					return;
				});
		},
		//----------------------------------通商云标准版END--------------------------------
	}
}
