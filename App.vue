<script>
import $mThemeConfig from '@/core/config/themeConfig';
export default {
	onLaunch: function() {
		console.log('App Launch');
		this.init();
	},
	onShow: function(options) {
		console.log('App Show');
		// #ifdef MP-WEIXIN
		if(options.referrerInfo && options.referrerInfo.extraData){
			console.log(options);
			uni.navigateTo({
				url:'/pages/notice/success'
			})
		}
		// #endif
	},
	onHide: function() {
		console.log('App Hide');
	},
	onError: function(err) {
		//全局错误监听
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
			const res = uni.getSystemInfoSync();
			let errMsg = `手机品牌：${res.brand}；手机型号：${res.model}；操作系统版本：${res.system}；客户端平台：${res.platform}；错误描述：${err}`;
			console.log('发生错误：' + errMsg);
		});
		// #endif
	},
	methods: {
		async init() {
			//微信小程序升级
			// #ifdef MP-WEIXIN
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res) {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success(res) {
									if (res.confirm) {
										updateManager.applyUpdate();
									}
								}
							});
						});
						updateManager.onUpdateFailed(function(res) {
							wx.showModal({
								title: '发现新版本',
								content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开'
							});
						});
					}
				});
			} else {
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法更好体验程序，请升级到最新微信版本后重试。',
					showCancel: false
				});
			}
			// #endif

			// #ifdef APP-PLUS
			// 锁定方向
			plus.screen.lockOrientation('portrait-primary');
			// 监听推送点击事件
			plus.push.addEventListener(
				'click',
				msg => {
					this.$api.shop.navTo(JSON.parse(msg.content), 'click');
				},
				false
			);
			// 监听在线消息事件
			plus.push.addEventListener(
				'receive',
				msg => {
					this.$api.shop.navTo(JSON.parse(msg.content), 'receive');
				},
				false
			);
			// #endif

			// 配置初始化
			await this.getSettingList();
			//验证TOKEN
			const token = this.$api.store.state.accessToken;
			if (token) {
				this.handleVerifyAccessToken(token);
			}

			//登录初始化
			if (this.$api.store.getters.hasLogin) {
				// #ifdef APP-PLUS
				const client = plus.push.getClientInfo();
				this.handleBindingEquipment(client.clientid, this.$api.store.state.accessToken);
				// #endif
			}

			//获取客服未读数量
			this.$api.shop.getCustomerServiceUnread();

			//预加载页面
			// #ifdef H5 || APP-NVUE
			for (let i = 0; i < this.$api.tabbarConfig.tabbarList.length; i++) {
				uni.preloadPage({ url: this.$api.tabbarConfig.tabbarList[i].pagePath });
			}
			// #endif

			//完成基础加载
			this.$isResolve();
			// 初始化底部导航栏
			await this.getDiyTabbar();
		},
		//验证TOKEN
		async handleVerifyAccessToken(token) {
			await this.$api.http.post(this.$api.apiShop.verifyAccessToken, { token }).then(res => {
				if (!res.data.token) {
					this.$api.store.commit('logout');
				}
			});
		},
		//推送
		async handleBindingEquipment(id, token) {
			const oauth_client = uni.getSystemInfoSync().platform;
			await this.$api.http.post(this.$api.apiShop.bindingEquipment, {
				token,
				oauth_client,
				oauth_client_user_id: id
			});
		},
		// 获取全局配置
		async getSettingList() {
			let field = Object.keys(this.$api.shopSetting).join(',');
			await this.$api.http
				.get(this.$api.apiShop.configList, {
					params: {
						field: field
					}
				})
				.then(async res => {
					this.initSetting(res.data);
					this.$api.store.commit('setShopSetting', res.data);
				});
		},
		// 初始化全局配置
		initSetting(data) {
			let filed = Object.keys(this.$api.shopSetting);
			for (let i = 0; i < filed.length; i++) {
				if (data[filed[i]]) {
					this.$api.shopSetting[filed[i]] = data[filed[i]];
				}
			}
			//如果客户皮肤自定义
			if (data.style_user_is_open && parseInt(data.style_user_is_open) === 1) {
				let ct = this.$api.store.state.customerTheme;
				if (ct && $mThemeConfig[ct]) {
					this.$api.theme = { ...this.$api.theme, ...$mThemeConfig[ct].colors };
				} else {
					if ($mThemeConfig[data.style_type]) {
						this.$api.theme = { ...this.$api.theme, ...$mThemeConfig[data.style_type].colors };
					}
				}
			} else {
				if ($mThemeConfig[data.style_type]) {
					this.$api.theme = { ...this.$api.theme, ...$mThemeConfig[data.style_type].colors };
				}
				this.$api.store.commit('setCustomerTheme', '');
			}
			//如果客户Loading自定义
			if (data.style_loading_is_open && parseInt(data.style_loading_is_open) == 1) {
				this.$api.store.commit('setLoadingType',this.$api.store.state.styleLoadingType);
			}else {
				this.$api.store.commit('setLoadingType', data.style_loading_type);
			}
			//根据不同的应用切换默认登录地址
			// #ifdef APP-PLUS
			switch (parseInt(this.$api.shopSetting.app_login_default)) {
				case 0:
					this.$api.routesConfig.login.path = '/pages/login/login/login';
					break;
				case 1:
					this.$api.routesConfig.login.path = '/pages/login/wechatAuthLogin/wechatAuthLogin';
					break;
				case 2:
					this.$api.routesConfig.login.path = '/pages/login/passwordLogin/passwordLogin';
					break;
			}
			// #endif
			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				switch (parseInt(this.$api.shopSetting.wechat_login_default)) {
					case 0:
						this.$api.routesConfig.login.path = '/pages/login/login/login';
						break;
					case 1:
						this.$api.routesConfig.login.path = '/pages/login/wechatAuthLogin/wechatAuthLogin';
						break;
					case 2:
						this.$api.routesConfig.login.path = '/pages/login/passwordLogin/passwordLogin';
						break;
				}
			} else {
				switch (parseInt(this.$api.shopSetting.h5_login_default)) {
					case 0:
						this.$api.routesConfig.login.path = '/pages/login/login/login';
						break;
					case 2:
						this.$api.routesConfig.login.path = '/pages/login/passwordLogin/passwordLogin';
						break;
				}
			}
			// #endif
			// #ifdef MP-WEIXIN
			switch (parseInt(this.$api.shopSetting.miniprogram_login_default)) {
				case 0:
					this.$api.routesConfig.login.path = '/pages/login/login/login';
					break;
				case 1:
					this.$api.routesConfig.login.path = '/pages/login/wechatAuthLogin/wechatAuthLogin';
					break;
				case 2:
					this.$api.routesConfig.login.path = '/pages/login/passwordLogin/passwordLogin';
					break;
			}
			// #endif
		},
		// 初始化底部导航栏
		getDiyTabbar() {
			this.$api.http.get(this.$api.apiShop.diyTabbar).then(res => {
				if (res.data.component) {
					let tabbarList = JSON.parse(res.data.component);
					this.$api.store.commit('setTabbarList', tabbarList);
				}
			});
		}
	}
};
</script>

<style lang="scss">
/* 图标 */
@import '/core/iconfont.css';
/* 全局样式 */
@import '/core/main.scss';
@import '/core/css/animation.css';
</style>
