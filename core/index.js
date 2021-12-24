//页面混合数据方法
import $mMixin from './utils/mixin/mixin';

//全局存储
import $mStore from '@/store';

//全局请求
import $mHttp from './utils/http';

//全局方法
import $mGraceChecker from './utils/graceChecker';
import $mHelper from './utils/helper';
import $mAppUpdate from './utils/appUpdate';
import $mShop from './utils/shop';
import $mWxHelper from './utils/wxHelper';
import $mWxAutoLoginHelper from './utils/wxAutoLoginHelper';
import $mComponents from './utils/components';
import $mThrottle from './utils/throttle';

//路由
import $mRouter from './utils/router';

//内置即时通讯
import $mWebsocket from './utils/websocket';

//微信公众号SDK
// #ifdef H5
import $mJweixin from './utils/jweixin';
// #endif

//配置
import $mShopSetting from './config/shopSetting';
import $mApiService from './config/apiService';
import $mApiShare from './config/apiShare';
import $mApiShop from './config/apiShop';
import $mApiDistribution from './config/apiDistribution';
import $mApiMerchant from './config/apiMerchant';
import $mApiVersions from './config/apiVersions';
import $mApiArticle from './config/apiArticle';
import $mApiAllinpay from './config/apiAllinpay';
import $mAppConfig from './config/appConfig';
import $mAssetsConfig from './config/assetsConfig';
import $mLanguage from './config/language';
import $mResponseCode from './config/responseCode';
import $mRoutesConfig from './config/routesConfig';
import $mWebsocketConfig from './config/websocketConfig';
import $mDataConfig from './config/dataConfig';
import $mZIndex from './config/zIndex'
import $mTheme from './config/theme';
import $mTabbarConfig from './config/tabbarConfig';

//网络状态监听
uni.getNetworkType({
	success: function(res) {
		$mStore.dispatch("networkStateChange", res.networkType);
	}
})

uni.onNetworkStatusChange(function(res) {
	$mStore.dispatch("networkStateChange", res.networkType);
})

//全局挂载
const api = {
	store: $mStore,
	shopSetting: $mShopSetting,
	apiService: $mApiService,
	apiShare: $mApiShare,
	apiShop: $mApiShop,
	apiDistribution: $mApiDistribution,
	apiMerchant: $mApiMerchant,
	apiVersions: $mApiVersions,
	apiArticle: $mApiArticle,
	apiAllinpay:$mApiAllinpay,
	appConfig: $mAppConfig,
	assetsConfig: $mAssetsConfig,
	language: $mLanguage,
	responseCode: $mResponseCode,
	routesConfig: $mRoutesConfig,
	websocketConfig: $mWebsocketConfig,
	dataConfig: $mDataConfig,
	graceChecker: $mGraceChecker,
	helper: $mHelper,
	shop: $mShop,
	wxHelper:$mWxHelper,
	wxAutoLoginHelper:$mWxAutoLoginHelper,
	components: $mComponents,
	throttle: $mThrottle,
	router: $mRouter,
	http: $mHttp,
	websocket: $mWebsocket,
	appUpdate: $mAppUpdate,
	zIndex: $mZIndex,
	theme: $mTheme,
	tabbarConfig: $mTabbarConfig,
	// #ifdef H5
	jweixin: $mJweixin,
	// #endif
	systemInfo: uni.getSystemInfoSync()
}

const install = Vue => {
	Vue.mixin($mMixin);
	Vue.filter('timeFormat', (timestamp, format = 'yyyy-mm-dd hh:MM') => {
		return $mHelper.timeFormat(timestamp, format);
	})
	Vue.filter('timeFrom', (timestamp, format = 'yyyy-mm-dd hh:MM') => {
		return $mHelper.timeFrom(timestamp, format);
	})
	Vue.prototype.$api = api;
	
	Vue.prototype.$onLaunched = new Promise(resolve => {
	    Vue.prototype.$isResolve = resolve
	})
}

export default {
	install
}
