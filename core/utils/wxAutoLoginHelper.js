//微信自动登录
import $mHelper from './helper.js';
import $mHttp from './http';
import $mRouter from './router';
import $mWebsocket from './websocket';
import $mAppConfig from '../config/appConfig';
import $mApiShop from '../config/apiShop';
import $mLanguage from '../config/language';
import $mRoutesConfig from '../config/routesConfig';

import $mStore from '@/store';

function login(){
	if($mStore.getters.hasLogin){
		return;
	}
	// #ifdef H5 
	if($mHelper.h5IsWechat()){
		let url = window.location.href;
		url = $mHelper.delUrlParams(url,'code');
		url = encodeURIComponent(url);
		let jumpUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?
													appid=${$mStore.state.shopSetting.wechat_appid}&
													redirect_uri=${url}&
													response_type=code&
													scope=snsapi_userinfo&
													state=STATE#wechat_redirect`;
		window.location.href = jumpUrl;
	}
	// #endif
}

async function wechatCodeLogin(code){
	// #ifdef H5
	if($mHelper.h5IsWechat()){
		await $mHttp
			.get($mApiShop.wechatH5Login, {
				params: {
					code: code,
					promo_code: $mStore.state.promoCode
				}
			})
			.then(res => {
				if (!res.data.login) {
					$mStore.commit('setThirdPartyUserInfo', {type:'wechat',userInfo:res.data.user_info.original});
					$mRouter.redirectTo({
						route: $mRoutesConfig.thirdPartyLogin,
						query:{
							source:'autoLogin'
						}
					});
				} else {
					$mStore.commit('login', res.data.user_info);
					if (parseInt($mStore.state.shopSetting.app_service_type)>0) {
						
					}
				}
			})
			.catch(err => {
			});
	}
	// #endif
}

export default {
	login,
	wechatCodeLogin
}
