import $mLanguage from './language';
import $mAssetsConfig from './assetsConfig';
import $mAppConfig from './appConfig';

//商城配置
class Setting {
	constructor() {
		this.h5_url = $mAppConfig.h5Domain;
		this.store_name = $mLanguage.application.appName; //应用名称
		this.store_logo = $mAssetsConfig.logo; // 应用Logo
		this.app_service_type = 0; //客服模式 0无 1预留 2小程序原生客服 3芝麻小客服
		this.app_service_zmxkf_url = '';//芝麻小客服渠道链接
		this.is_open_commission = 0; //是否开启分销
		this.is_open_recharge = 1;//开启充值入口
		this.is_open_site = 1;//开启应用
		this.close_site_explain = '';//关闭应用说明
		
		this.style_user_is_open = 0;//用户端是否可以选择皮肤
		this.style_type = 'red';//默认皮肤
		
		this.h5_login_default = 0;//H5默认登录模式
		
		this.third_party_register = 1;// 第三方注册绑定设置
		this.sms_code_length = 4;//手机验证码长度
		this.login_is_open = 0;//是否关闭登录
		
		// 公众号自动登录
		this.wechat_share_page_auto_login = 0;
		// 公众号登录方式  
		this.wechat_login_mode = [];
		this.wechat_login_default = 0;
		// 小程序登录方式
		this.miniprogram_login_mode = [];
		this.miniprogram_login_default = 0;
		// H5登录方式
		this.h5_login_mode = [];
		this.h5_login_default = 0;
		// APP登录方式
		this.app_login_mode = [];
		this.app_login_default = 0;
		// 用户协议勾选
		this.app_agreement_default_select = 0;//协议勾选 0无勾选框 1默认勾选 2默认不勾选
		this.mobile_show_apple_login = 1;//APP在IOS下是否显示苹果登录
		
		this.show_profile_tools_wholesale = 0;//个人中心工具栏显示拼团
		this.show_profile_tools_live = 0;//个人中心工具栏显示直播
		this.show_profile_tools_bargain = 0;//个人中心工具栏显示砍价
		this.show_profile_tools_virtual = 0;//个人中心工具栏显示虚拟码
		
		this.show_distribution_agent_area = 1;//是否显示区域代理功能
		this.show_distribution_stat_detail = 1;//分销订单统计是否以明细方式展现
		this.commission_transfer_is_open = 1;
		this.member_show_parent = 0; // 是否显示推荐人
		
		this.wechat_appid = '';//公众号appid,这里也判断是否需要做公众号相关处理
		this.miniprogram_id = '';//小程序原始ID
		this.miniprogram_type = 0;//小程序版本类型
		
		this.product_share_title = $mLanguage.application.shareTitle;
		this.bargain_share_title = $mLanguage.application.bargainShareTitle;
		this.bargain_detail_share_title = $mLanguage.application.bargaiDetailShareTitle;
		this.wholesale_share_title = $mLanguage.application.wholesaleShareTitle;
		this.wholesale_detail_share_title = $mLanguage.application.wholesaleDetailShareTitle;
		this.discount_share_title = $mLanguage.application.discountShareTitle;
		this.group_share_title = $mLanguage.application.groupShareTitle;
		
		this.signin_is_open = 0;//是否开启积分签到
		this.signin_base_points = 1;//积分签到基础积分
		this.signin_days_cycle = 30;//积分签到周期
		
		this.style_loading_is_open = 0; // 是否开启页面加载
		this.style_loading_type = 'loading-1'; // 页面加载类型
		
		this.style_attention_mini_program_name = '';
		this.style_attention_mini_program_logo = '';
		this.style_attention_official_account_qrcode = '';
		this.style_attention_official_account_name = '';
		this.style_attention_official_account_name = '';
		this.style_attention_app_guide = [];
		
		this.product_poster_is_open = 1;
		this.product_poster_qr_type = 'common_qr';
		this.search_show_length = 6	;
		this.config_md5_verify = '';
		this.order_refund_cancel_reapply = 0; // 是否用户取消售后后可重新申请
		this.notify_miniprogram_sub = {};
		
		//版权
		// #ifdef H5
		this.copyright_show = 0;
		this.copyright_logo = '';
		this.copyright_companyname='';
		this.copyright_icp='';
		this.copyright_url='';
		this.copyright_desc='';
		// #endif
	}
}

export default new Setting();