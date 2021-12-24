import $mRequest from './luch-request/index';
import $mHelper from './helper';
import $mAppConfig from '../config/appConfig';
import $mResponseCode from '../config/responseCode';
import $mLanguage from '../config/language';
import $mShopSetting from '../config/shopSetting';
import $mApiShop from '../config/apiShop';
import $mStore from '@/store';

const $mHttp = new $mRequest();
const info = uni.getSystemInfoSync();

$mHttp.setConfig((config) => {
	config.baseURL = $mAppConfig.apiDomain
	config.header['Content-Type'] = 'application/json';
	config.header['device-name'] = info.brand; // 设备名称
	config.header['width'] = info.screenWidth; // 屏幕宽度
	config.header['height'] = info.screenHeight; // 屏幕高度
	config.header['os'] = info.platform; // 客户端平台
	config.header['os-version'] = info.system; // 操作系统版本
	config.dataType = 'json'
	config.responseType = 'text'
	return config
})

$mHttp.validateStatus = (statusCode) => {
	return statusCode === 200
}

$mHttp.interceptors.request.use((config) => {
	config.data = config.data ? config.data : {};
	config.header['x-api-key'] = $mStore.state.accessToken;
	if ($mAppConfig.mutiMerchants) {
		config.header['merchant-id'] = $mStore.state.userInfo.merchant_id || 0;
	}
	$mHelper.log(config);
	return config;
}, config => {
	return Promise.reject(config)
})

$mHttp.interceptors.response.use(async (response) =>{
	$mHelper.log(response);
	if (response.data.code == $mResponseCode.successCode) {
		//H5版本更新
		console.log(response.data.ver)
		console.log($mAppConfig.version)
		// #ifdef H5
		if(response.data.ver && $mHelper.compareVersion(response.data.ver,$mAppConfig.version)){
			alert('系统检测到升级版本，点击确认进行更新');
			location.href = $mAppConfig.h5Domain;
			return;
		}
		// #endif
		//配置更新
		if(response.config.url != $mApiShop.configList && response.data.conf!=$mShopSetting.config_md5_verify){
			$mHelper.log('----------------配置更新----------------')
			let field = Object.keys($mShopSetting).join(',');
			await $mHttp.get($mApiShop.configList, {
					params: {
						field: field
					}
				}).then(async res => {
					let arr = Object.keys($mShopSetting);
					for (let i = 0; i < arr.length; i++) {
						if (res.data[arr[i]]) {
							$mShopSetting[arr[i]] = res.data[arr[i]];
						}
					}
					$mStore.commit('setShopSetting', res.data);
				});
		}
		return response.data;
	} else {
		switch (response.data.code) {
			case $mResponseCode.accountValidationFailedCode:
				$mHelper.toast('您的登录令牌已过期,请重新登录~');
				$mStore.dispatch('reLogin');
				break;
			case $mResponseCode.dataValidationFailedCode:
				$mHelper.toast(response.data.message);
				break;
			case $mResponseCode.requestsTooMany:
				$mHelper.toast('您操作的太快啦，休息一下吧~');
				break;
			case $mResponseCode.requestErrorCode:
				$mHelper.toast('错误的请求');
				break;
			case $mResponseCode.methodRefusedCode:
				$mHelper.toast('您的请求被拒绝了');
				break;
			case $mResponseCode.resourceNotExistCode:
				if(response.data.message){
					$mHelper.toast(response.data.message);
				}else{
					$mHelper.toast('资源错误');
				}
				break;
			case $mResponseCode.methodNotAllowdCode:
				$mHelper.toast('当前操作不被允许');
				break;
			case $mResponseCode.maintainCode:
				if(response.data.data){
					$mHelper.toast(response.data.data);
				}else{
					$mHelper.toast('维护中...');
				}
				break;
			case $mResponseCode.errorCode:
				$mHelper.toast('服务器打瞌睡了~');
				break;
			default:
				$mHelper.toast(response.data.message);
				break;
		}
		return Promise.reject(response.data.message);
	}
}, (error) => {
	$mHelper.log(error);
	return Promise.reject(error);
})

export default $mHttp
