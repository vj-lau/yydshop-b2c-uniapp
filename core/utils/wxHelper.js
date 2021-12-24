//微信H5方法集合
import $mHelper from './helper.js';
import $mHttp from './http';
import $mApiShop from '../config/apiShop';
// #ifdef H5
import $mJweixin from './jweixin';
// #endif
import $mStore from '../../store/index.js';

//微信配置注册
async function wxConfig(url) {
	// #ifdef H5
	if ($mHelper.h5IsWechat()) {
		//IOS只用注册一次
		if($mHelper.h5IsIosOrAndroid()=='ios' && $mStore.state.iosWxConfig==true){
			return;
		}
		//无能的微信必须加上onMenuShareAppMessage和onMenuShareTimeline，updateAppMessageShareData和updateTimelineShareData才起作用
		const jsApiList = JSON.stringify([
			'chooseWXPay',
			'scanQRCode',
			'openAddress',
			'updateAppMessageShareData',
			'updateTimelineShareData',
			'onMenuShareAppMessage',
			'onMenuShareTimeline',
		]);
		await $mHttp
			.post($mApiShop.wechatConfig, {
				url: url,
				jsApiList, // 需要调用微信的原生方法
				debug: false // 是否打开调试
			})
			.then(res => {
				$mJweixin.config({
					...res.data
				});
			}).catch(err => {
				console.log(err);
			})
	}
	$mStore.commit('setIosWxConfig',true);
	// #endif
}

//微信分享
async function wxShare(configUrl, title, desc, link, imgUrl) {
	// #ifdef H5
	if (!$mHelper.h5IsWechat()) {
		return;
	}
	await wxConfig(configUrl);
	$mJweixin.ready(function() {
		$mJweixin.updateAppMessageShareData({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		$mJweixin.updateTimelineShareData({
			title: title, // 分享标题
			link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		$mJweixin.onMenuShareAppMessage({
			title: title, // 分享标题
			desc: desc, // 分享描述
			link: link, // 分享链接
			imgUrl: imgUrl, // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});
		//分享到朋友圈
		$mJweixin.onMenuShareTimeline({
			title: title, // 分享标题
			link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: imgUrl, // 分享图标
			success: function() {
				// 用户点击了分享后执行的回调函数
			}
		});
	});
	// #endif
}

export default {
	wxConfig,
	wxShare
}
