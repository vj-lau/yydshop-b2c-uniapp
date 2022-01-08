//系统配置

const CONFIG = {
	//开发环境配置
	development: {
		//缺省应用名称
		appName:{
			chs:'...',
			cht:'...',
			eng:'mall',
		},
		//缺省h5访问域名
		h5Domain: 'https://yydshop-b2c-dev.vjlau.com/app',
		//api访问域名
		apiDomain: 'https://yydshop-b2c-dev.vjlau.com/api',
		//静态资源路径(网络资源或者本地资源，小程序不支持本地资源)
		assetsPath: "https://yydshop-b2c-dev.vjlau.com/static/app/",
		//默认语言包
		language: 'chs',
		//手机注册默认区号
		mobileArea:'86',
		//首页位置
		indexPath: "/pages/main/index/index",
		//如果购物车在底部导航栏，底部导航栏的索引，-1表示不在底部导航栏
		cartBarIndex: 3,
		//如果消息在底部导航栏，底部导航栏的索引，-1表示不在底部导航栏
		messageBarIndex: -1,
		//默认每一页的数量
		pageSize: 10,
		//登录验证码倒计时
		loginCodeSecond: 60,
		//APP是否检测自动升级
		appCheckUpdate: true,
		//当前version，非APP的版本号，APP的版本号直接获取
		version:'1.0.4',
	},
	//生产环境配置
	production: {
		//缺省应用名称
		appName:{
			chs:'...',
			cht:'...',
			eng:'mall',
		},
		//缺省h5访问域名
		h5Domain: 'https://yydshop-b2c-dev.vjlau.com/app',
		//api访问域名
		apiDomain: 'https://yydshop-b2c-dev.vjlau.com/api',
		//静态资源路径(网络资源或者本地资源，小程序不支持本地资源)
		assetsPath: "https://yydshop-b2c-dev.vjlau.com/static/app/",
		//默认语言包
		language: 'chs',
		//手机注册默认区号
		mobileArea:'86',
		//首页位置
		indexPath: "/pages/main/index/index",
		//如果购物车在底部导航栏，底部导航栏的索引，-1表示不在底部导航栏
		cartBarIndex: 3,
		//如果消息在底部导航栏，底部导航栏的索引，-1表示不在底部导航栏
		messageBarIndex: -1,
		//默认每一页的数量
		pageSize: 10,
		//登录验证码倒计时
		loginCodeSecond: 60,
		//APP是否检测自动升级
		appCheckUpdate: true,
		//当前version，非APP的版本号，APP的版本号直接获取
		version:'1.0.4',
	}
}

export default CONFIG[process.env.NODE_ENV];
