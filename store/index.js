import Vue from 'vue'
import Vuex from 'vuex'

import $mAppConfig from '@/core/config/appConfig'
import $mTabbarConfig from '@/core/config/tabbarConfig'
import $mRoutesConfig from '@/core/config/routesConfig'
import $mRouter from '@/core/utils/router'


Vue.use(Vuex);

const EMPTY = {
	accessToken: "",
	refreshToken: "",
	userInfo: {},
	userPromoter: {},
	promoCode: "",
	lastLoginTime: 0,
	jumpUpdateVersion: "",
	productSearch: [],
	productSearchDefault: "",
	productSearchHot: [],
	cartNum: 0,
	imHistory: [],
	imNoRead: 0,
	shopSetting: {},
	customerTheme:'',
	lastCaptchaTimeStamp:0,
	lastInputMobile:'',
	lastSelectMobileArea:$mAppConfig.mobileArea,
	cartPageListen:false, //购物车页面是否处于监听状态
	styleLoadingType: 'loading-1',
	wechatTip: 1,//微信端提示
	popupAdvTime: 0,
	isAgree: true,//  控制服务协议显示
	isGuide: true, // 控制引导页显示
	isPopAdv: 0, // 控制是否首次点击弹窗
	iosWxConfig:false ,//是否IOS已经注册了微信SDK
	supplier: {} ,// 供应商入驻
	allinpayMode: '',  // 1标准通商云  2通商云E+ 当前属于那个通商云环境
	profileNoticeTime: '',
	signinTime: '', // 签到时间
	wechatMpLogin: null, // 是否是小程序登录
};
const CACHE = uni.getStorageSync('appCache') || EMPTY;

//去除所有历史消息的tip类型
if (CACHE.imHistory) {
	for (let index = CACHE.imHistory.length - 1; index >= 0; index--) {
		if (CACHE.imHistory[index].tip === true) {
			CACHE.imHistory.splice(index, 1);
		}
	}
}

//初始化自定义TABBAR
const TABBARLIST = $mTabbarConfig.tabbarList;
if(TABBARLIST.length > $mAppConfig.cartBarIndex && CACHE.accessToken){
	TABBARLIST[$mAppConfig.cartBarIndex].count =  CACHE.cartNum;
}

const store = new Vuex.Store({
	state: {
		appCache: CACHE,
		//用户token
		accessToken: CACHE.accessToken,
		//刷新token
		refreshToken: CACHE.refreshToken,
		//用户信息
		userInfo: CACHE.userInfo,
		//用户推广员身份信息
		userPromoter: CACHE.userPromoter,
		//推荐码
		promoCode: CACHE.promoCode,
		//上次登录时间
		lastLoginTime: CACHE.loginTime,
		//跳过的升级版本
		jumpUpdateVersion: CACHE.jumpUpdateVersion,
		//商品历史搜索
		productSearch: CACHE.productSearch,
		//默认搜索关键字
		productSearchDefault: CACHE.productSearchDefault,
		//热门搜索
		productSearchHot: CACHE.productSearchHot,
		//购物车数量
		cartNum: CACHE.cartNum,
		//历史聊天消息，仅保存最后100条
		imHistory: CACHE.imHistory,
		//当前未读聊天消息数量
		imNoRead: CACHE.imNoRead,
		//商城设置
		shopSetting: CACHE.shopSetting,
		//客户端皮肤设置
		customerTheme:CACHE.customerTheme,
		//客户端Loading设置
		styleLoadingType: CACHE.styleLoadingType,
		//上一次获取验证码时间
		lastCaptchaTimeStamp: CACHE.lastCaptchaTimeStamp,
		//上一次输入的手机号码
		lastInputMobile:CACHE.lastInputMobile,
		//上一次选择的手机区域
		lastSelectMobileArea:CACHE.lastSelectMobileArea,
		//当前是否处于聊天面板
		isImPanel: false,
		//当前是否人工客服服务
		isStuffService: false,
		//网络状态，用于下载提醒
		networkState: 'unknown',
		//第三方登录用户授权信息
		thirdPartyUserInfo:{type:'',userInfo:{}},
		//tabbar配置
		tabbarList: TABBARLIST,
		//未读客服消息
		customerServiceUnread:0,
		// 控制关注公众号和小程序
		wechatTip: CACHE.wechatTip,
		// 首页广告控制
		popupAdvTime: CACHE.popupAdvTime,
		// 控制服务协议显示
		isAgree: CACHE.isAgree,
		// 控制引导页显示
		isGuide: CACHE.isGuide,
		// 控制是否首次点击弹窗
		isPopAdv: CACHE.isPopAdv,
		// 是否IOS已注册了SDK
		iosWxConfig : false,
		// 供应商入驻
		supplier: CACHE.supplier,
		 // 当前属于那个通商云环境
		allinpayMode: CACHE.allinpayMode,
		// 我的提示公告关闭
		profileNoticeTime: CACHE.profileNoticeTime,
		// 签到时间
		signinTime: CACHE.signinTime,
		// 是否是小程序登录
		wechatMpLogin: CACHE.wechatMpLogin
	},
	getters: {
		// 用户是否登录
		hasLogin: state => {
			if (state.accessToken) {
				return true
			} else {
				return false
			}
		}
	},
	mutations: {
		login(state, provider) {
			state.appCache.accessToken = state.accessToken = provider.access_token;
			state.appCache.refreshToken = state.refreshToken = provider.refresh_token;
			state.appCache.userInfo = state.userInfo = provider.member;
			state.appCache.userPromoter = state.userPromoter = provider.member.promoter;
			state.appCache.lastLoginTime = state.lastLoginTime = new Date().getTime() / 1000

			uni.setStorageSync("appCache", state.appCache);
			this.commit('setCartNum', provider.member.cart_num);
			uni.$emit('cartNumChange',{});
		},
		logout(state) {
			state.appCache.accessToken = state.accessToken = "";
			state.appCache.refreshToken = state.refreshToken = "";
			state.appCache.userInfo = state.userInfo = {};
			state.appCache.userPromoter = state.userPromoter = {};
			state.appCache.supplier = state.supplier = {};
			state.appCache.wechatMpLogin = state.wechatMpLogin = null;
			uni.setStorageSync("appCache", state.appCache);
			this.commit('setCartNum', 0);
			uni.$emit('cartNumChange',{});
		},
		setUserInfo(state, provider) {
			state.appCache.userInfo = state.userInfo = provider;
			state.appCache.userPromoter = state.userPromoter = provider.promoter || {};

			uni.setStorageSync("appCache", state.appCache);
		},
		setUserHeadPortrait(state, provider) {
			state.appCache.userInfo.head_portrait = state.userInfo.head_portrait = provider;

			uni.setStorageSync("appCache", state.appCache);
		},
		setUserNickname(state, provider){
			state.appCache.userInfo.nickname = state.userInfo.nickname = provider;
			
			uni.setStorageSync("appCache", state.appCache);
		},
		setUserMobile(state, provider){
			state.appCache.userInfo.mobile = state.userInfo.mobile = provider;
			
			uni.setStorageSync("appCache", state.appCache);
		},
		setUserMobileArea(state, provider){
			state.appCache.userInfo.mobile_area = state.userInfo.mobile_area = provider;
			
			uni.setStorageSync("appCache", state.appCache);
		},
		setPromoCode(state, provider) {
			state.appCache.promoCode = state.promoCode = provider;

			uni.setStorageSync("appCache", state.appCache);
		},
		setJumpUpdateVersion(state, provider) {
			state.appCache.jumpUpdateVersion = state.jumpUpdateVersion = provider;

			uni.setStorageSync("appCache", state.appCache);
		},
		setProductSearch(state, provider) {
			state.appCache.productSearch = state.productSearch = provider;

			uni.setStorageSync("appCache", state.appCache);
		},
		setProductSearchDefault(state, provider) {
			state.appCache.productSearchDefault = state.productSearchDefault = provider;

			uni.setStorageSync("appCache", state.appCache);
		},
		setProductSearchHot(state, provider) {
			state.appCache.productSearchHot = state.productSearchHot = provider;

			uni.setStorageSync("appCache", state.appCache);
		},
		setCartNum(state, provider) {
			state.appCache.cartNum = state.cartNum = provider;
			state.appCache.userInfo.cart_num = state.userInfo.cart_num = provider;

			uni.setStorageSync("appCache", state.appCache);

			if ($mAppConfig.cartBarIndex > -1) {
				// 原生tabbar
				if (provider == 0) {
					uni.removeTabBarBadge({
						index: $mAppConfig.cartBarIndex
					})
				} else {
					uni.setTabBarBadge({
						index: $mAppConfig.cartBarIndex,
						text: String(provider)
					})
				}
				// 非原生tabbar
				if(state.tabbarList.component == 'dz-tabbar') {
					state.tabbarList.props.list.forEach((item,index)=>{
						if(item.pagePath == '/pages/main/cart/cart') {
							state.tabbarList.props.list[index].count =provider
							
						}
						
					})
					
				}else {
					if(state.tabbarList.length>$mAppConfig.cartBarIndex){
						state.tabbarList[$mAppConfig.cartBarIndex].count = provider;
					}
				}
				
			}
		},
		addImHistory(state, provider) {
			if (provider) {
				let data = state.imHistory;
				data.push(provider);
				if (data.length > $mAppConfig.imHisotryNum) {
					data = data.splice(0, data.length - $mAppConfig.imHisotryNum);
				}

				state.appCache.imHistory = data;

				uni.setStorageSync("appCache", state.appCache);

				state.imHistory = data
				if (!state.isImPanel) {
					this.commit('addImNoRead', 1);
				}
			}
		},
		clearImHistory(state) {
			state.appCache.imHistory = state.imHistory = [];
			state.appCache.imHistory = [];
			state.appCache.imNoRead = state.imNoRead = 0;

			uni.setStorageSync("appCache", state.appCache);
		},
		addImNoRead(state, provider) {
			state.appCache.imNoRead = state.imNoRead = state.imNoRead + provider;
			if (state.imNoRead > $mAppConfig.imHisotryNum) {
				state.appCache.imNoRead = state.imNoRead = $mAppConfig.imHisotryNum
			}
			uni.setStorageSync("appCache", state.appCache);
		},
		setIsImPanel(state, provider) {
			state.isImPanel = provider;
			if (provider) {
				state.appCache.imNoRead = state.imNoRead = 0;
				uni.setStorageSync("appCache", state.appCache);
			}
		},
		setShopSetting(state, provider) {
			state.appCache.shopSetting = state.shopSetting = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setIsStuffService(state, provider) {
			state.isStuffService = provider;
		},
		setShareDownloadItem(state, provider) {
			state.shareDownloadItem = provider;
		},
		setLastCaptchaTimeStamp(state, provider) {
			state.appCache.lastCaptchaTimeStamp = state.lastCaptchaTimeStamp = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setLastInputMobile(state, provider){
			state.appCache.lastInputMobile = state.lastInputMobile = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setLastSelectMobileArea(state, provider){
			state.appCache.lastSelectMobileArea = state.lastSelectMobileArea = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setNetworkState(state, provider) {
			state.networkState = provider;
		},
		setThirdPartyUserInfo(state, provider) {
			state.thirdPartyUserInfo = provider;
		},
		setTabbarList(state, provider) {
			state.tabbarList = provider;
			this.commit('setCartNum', state.cartNum);
		},
		setCartPageListen(state,provider){
			state.cartPageListen = provider;
		},
		setCustomerTheme(state,provider){
			state.appCache.customerTheme=state.customerTheme = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setLoadingType(state,provider){
			state.appCache.styleLoadingType =state.styleLoadingType = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setCustomerServiceUnread(state,provider){
			state.customerServiceUnread = provider;
		},
		setWechatTip(state,provider) {
			state.appCache.wechatTip = state.wechatTip = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setPopupAdvTime(state,provider) {
			state.appCache.popupAdvTime = state.popupAdvTime = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setIsAgree(state,provider) {
			state.appCache.isAgree = state.isAgree = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setIsGuide(state,provider) {
			state.appCache.isGuide = state.isGuide = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setIsPopAdv(state,provider) {
			state.appCache.isPopAdv = state.isPopAdv = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setSupplier(state,provider) {
			state.appCache.supplier = state.supplier = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setIosWxConfig(state,provider) {
			state.iosWxConfig = provider;
		},
		setAllinpayMode(state,provider) {
			state.appCache.allinpayMode = state.allinpayMode = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setProfileNoticeTime(state,provider) {
			state.appCache.profileNoticeTime = state.profileNoticeTime = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setSigninTime(state,provider) {
			state.appCache.signinTime = state.signinTime = provider;
			uni.setStorageSync("appCache", state.appCache);
		},
		setWechatMpLogin(state,provider) {
			state.appCache.wechatMpLogin = state.wechatMpLogin = provider;
			uni.setStorageSync("appCache", state.appCache);
		}
	},
	actions: {
		networkStateChange({
			commit
		}, info) {
			commit("setNetworkState", info);
		},
		login({
			commit
		}, info) {
			commit("login", info);
		},
		reLogin({
			commit
		}, info) {
			commit("logout", "");
			$mRouter.push({
				route: $mRoutesConfig.login
			});
		},
		logout({
			commit
		}, info) {
			commit("logout");
		},
	}
})

export default store
