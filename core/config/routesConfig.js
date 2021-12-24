/* 
 * 路由表对象：
 * 该文件挂载在Vue
 * 作用：调用router对象的方法 传入以下对应的路由对象
 * 示例：this.$api.router.push({route:this.$api.routesConfig.main,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 * 
 * 配置参数项说明： 
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */
import $mAppConfig from "./appConfig.js";
import $mHelper from "../utils/helper.js";

export default {
	// --------------------------微商城路由----------------------------
	// tabbar
	index: {
		name: "首页",
		path: "/pages/main/index/index"
	},

	category: {
		name: "分类",
		path: "/pages/main/category/category"
	},

	discover: {
		name: '商学院',
		path: "/pages/main/discover/discover"
	},

	cart: {
		name: "购物车",
		path: "/pages/main/cart/cart"
	},
	profile: {
		name: "我的",
		path: "/pages/main/profile/profile"
	},

	//public
	search: {
		name: "搜索",
		path: "/pages/public/search/search"
	},
	notice: {
		name: "公告",
		path: "/pages/public/notice/notice"
	},
	noticeDetail: {
		name: "公告详情",
		path: "/pages/public/notice/detail"
	},
	vedio: {
		name: "视频",
		path: "/pages/public/vedio/vedio"
	},
	webview: {
		name: "浏览器",
		path: "/pages/public/webview/webview"
	},
	helper: {
		name: "帮助",
		path: "/pages/public/helper/helper"
	},
	helperDetail: {
		name: "帮助详情",
		path: "/pages/public/helper/detail"
	},
	article: {
		name: "文章中心",
		path: "/pages/public/article/article",
		requiresAuth: false
	},
	articleList: {
		name: "文章列表",
		path: "/pages/public/article/list",
		requiresAuth: false
	},
	articleDetail: {
		name: "文章详情",
		path: "/pages/public/article/detail",
		requiresAuth: false
	},
	customPage: {
		name: "自定义页面",
		path: "/pages/public/customPage/customPage"
	},
	
	customForm: {
		name: "自定义表单",
		path: "/pages/public/customForm/customForm"
	},
	
	//login
	login: {
		name: "登录/注册",
		path: "/pages/login/login/login"
	},
	mobileLogin: {
		name: "手机登录",
		path: "/pages/login/login/login"
	},
	wechatAuthLogin: {
		name: "授权登录",
		path: "/pages/login/wechatAuthLogin/wechatAuthLogin"
	},
	loginCode: {
		name: "获取验证码",
		path: "/pages/login/code/code"
	},
	thirdPartyLogin: {
		name: '第三方绑定手机号/注册',
		path: "/pages/login/thirdPartyLogin/thirdPartyLogin"
	},
	bindMobile: {
		name: "绑定手机号",
		path: "/pages/login/bindMobile/bindMobile",
		requiresAuth: true
	},
	modifyMobileStep1: {
		name: "修改手机号",
		path: "/pages/login/modifyMobile/modifyMobileStep1",
		requiresAuth: true
	},
	modifyMobileStep2: {
		name: "修改手机号",
		path: "/pages/login/modifyMobile/modifyMobileStep2",
		requiresAuth: true
	},
	loginWechat: {
		name: "公众号登录",
		path: "/pages/login/wechat/wechat"
	},
	passwordLogin: {
		name: "密码登录",
		path: "/pages/login/passwordLogin/passwordLogin"
	},
	modifyPassword: {
		name: "设置/修改密码",
		path: "/pages/login/modifyPassword/modifyPassword",
		requiresAuth: true
	},

	// notify
	notifyIndex: {
		name: "消息",
		path: "/pages/user/notify/index/index"
	},
	notifyLogistics: {
		name: "物流交易",
		path: "/pages/user/notify/logistics/logistics"
	},
	notifyRefund: {
		name: "售后服务",
		path: "/pages/user/notify/refund/refund"
	},
	notify: {
		name: "服务通知",
		path: "/pages/user/notify/notify/notify"
	},

	//product
	product: {
		name: "产品详情",
		path: "/pages/product/product/product"
	},
	productList: {
		name: "产品列表",
		path: "/pages/product/list/list"
	},
	evaluationList: {
		name: "评价列表",
		path: "/pages/product/evaluation/evaluation"
	},

	//bargain
	bargainIndex: {
		name: "砍价活动",
		path: "/pages/marketing/bargain/index/index",
	},
	bargainProduct: {
		name: "砍价商品详细",
		path: "/pages/marketing/bargain/product/product",
	},
	bargainList: {
		name: "砍价列表",
		path: "/pages/marketing/bargain/list/list",
	},
	bargainAddress: {
		name: "砍价地址选择",
		path: "/pages/marketing/bargain/address/address",
		requiresAuth: true
	},
	bargainDetails: {
		name: "砍价详情",
		path: "/pages/marketing/bargain/details/details",
	},
	myBargain: {
		name: "我的砍价",
		path: "/pages/marketing/bargain/my/my",
		requiresAuth: true
	},

	//wholesale
	wholesaleIndex: {
		name: "拼团活动",
		path: "/pages/marketing/wholesale/index/index"
	},
	wholesaleGroup: {
		name: "拼团列表",
		path: "/pages/marketing/wholesale/group/group",
		requiresAuth: true
	},
	wholesaleProduct: {
		name: "拼团产品",
		path: "/pages/marketing/wholesale/product/product"
	},
	wholesaleDetail: {
		name: "拼团详情",
		path: "/pages/marketing/wholesale/detail/detail"
	},

	// group 
	groupIndex: {
		name: "团购活动",
		path: "/pages/marketing/group/index/index"
	},
	groupProduct: {
		name: "团购产品",
		path: "/pages/marketing/group/product/product"
	},

	// discount
	discountIndex: {
		name: "折扣活动",
		path: "/pages/marketing/discount/index/index"
	},
	discountActivity: {
		name: "活动列表",
		path: "/pages/marketing/discount/activityList/activityList"
	},
	discountProduct: {
		name: "折扣产品",
		path: "/pages/marketing/discount/product/product"
	},
	discountList: {
		name: "单个折扣活动列表",
		path: "/pages/marketing/discount/list/list"
	},

	//presale
	presaleIndex: {
		name: "预售",
		path: "/pages/marketing/presale/index/index"
	},

	//combination
	combinationList: {
		name: "组合套餐",
		path: "/pages/marketing/combination/list/list"
	},

	//live
	liveIndex: {
		name: "微信直播",
		path: "/pages/marketing/live/index/index"
	},

	calculateIndex: {
		name: "人生测算",
		path: "/pages/marketing/calculate/index/index"
	},

	calculatePay: {
		name: "人生测算支付",
		path: "/pages/order/pay/calculatePay"
	},
	calculateResult: {
		name: "人生测算支付",
		path: "/pages/marketing/calculate/result/result"
	},

	//order
	orderCreate: {
		name: "创建订单",
		path: "/pages/order/create/create",
		requiresAuth: true
	},
	orderIndex: {
		name: "我的订单",
		path: "/pages/order/order/order",
		requiresAuth: true
	},
	orderDetail: {
		name: "订单详情",
		path: "/pages/order/detail/detail",
		requiresAuth: true
	},
	pay: {
		name: "订单支付",
		path: "/pages/order/pay/pay",
		requiresAuth: true
	},
	allinpayAppWxPay: {
		name: "订单支付",
		path: "/pages/order/allinpayAppWxPay/allinpayAppWxPay",
		requiresAuth: true
	},
	aliMiddle:{
		name: "支付宝支付",
		path: "/pages/order/pay/aliMiddle",
		requiresAuth: true
	},
	orderPickup: {
		name: "提货",
		path: "/pages/order/pickup/pickup",
		requiresAuth: true
	},

	//service
	serviceIndex: {
		name: "联系客服",
		path: "/pages/product/service/index/index",
		requiresAuth: true
	},
	serviceDetail: {
		name: "客服详情",
		path: "/pages/product/service/detail/detail",
		requiresAuth: true
	},
	service: {
		name: "客服",
		path: "/pages/product/service/service/service",
		requiresAuth: true
	},

	//notice
	success: {
		name: "操作成功",
		path: "/pages/notice/success",
		requiresAuth: false
	},
	fail: {
		name: "操作失败",
		path: "/pages/notice/fail",
		requiresAuth: false
	},
	paySuccess: {
		name: "支付成功",
		path: "/pages/notice/paySuccess",
		requiresAuth: true
	},
	payComplete: {
		name: "支付结果",
		path: "/pages/notice/payComplete",
		requiresAuth: true
	},
	allinpayAppWxPaySuccess: {
		name: "支付成功",
		path: "/pages/notice/allinpayAppWxPaySuccess",
		requiresAuth: false
	},

	//user
	userinfo: {
		name: "用户资料",
		path: "/pages/user/userinfo/userinfo",
		requiresAuth: true
	},
	collection: {
		name: "我的收藏",
		path: "/pages/user/collection/collection",
		requiresAuth: true
	},
	footprint: {
		name: "我的足迹",
		path: "/pages/user/footprint/footprint",
		requiresAuth: true
	},
	coupon: {
		name: "我的优惠券",
		path: "/pages/user/coupon/coupon",
		requiresAuth: true
	},
	myCouponDetail: {
		name: "优惠券详情",
		path: "/pages/user/coupon/myCoupon",
		requiresAuth: true
	},
	couponList: {
		name: "领劵中心",
		path: "/pages/user/coupon/list",
		requiresAuth: true
	},
	address: {
		name: "收货地址",
		path: "/pages/user/address/address",
		requiresAuth: true
	},
	addressManage: {
		name: "收货地址管理",
		path: "/pages/user/address/manage",
		requiresAuth: true
	},
	virtualIndex: {
		name: "虚拟码",
		path: "/pages/user/virtual/virtual",
		requiresAuth: true
	},
	virtualDetail: {
		name: "虚拟码详情",
		path: "/pages/user/virtual/detail",
		requiresAuth: true
	},
	recharge: {
		name: "充值",
		path: "/pages/order/pay/recharge",
		requiresAuth: true
	},
	account: {
		name: "账户",
		path: "/pages/user/account/index/index",
		requiresAuth: true
	},
	bill: {
		name: "账单",
		path: "/pages/user/account/bill/bill",
		requiresAuth: true
	},
	integral: {
		name: "积分",
		path: "/pages/user/account/integral/integral",
		requiresAuth: true
	},
	integralDetail: {
		name: "积分明细",
		path: "/pages/user/account/integral/detail",
		requiresAuth: true
	},
	level: {
		name: "会员等级",
		path: "/pages/user/account/level/level",
		requiresAuth: true
	},
	set: {
		name: "设置",
		path: "/pages/user/set/set",
		requiresAuth: true
	},
	signIn: {
		name: "签到",
		path: "/pages/user/signIn/index",
		requiresAuth: true
	},
	supplier:{
		name: "供应商入驻",
		path: "/pages/user/supplier/supplier",
	},

	avatarCropper: {
		name: "头像裁剪",
		path: "/core/components/dz-avatar-cropper/dz-avatar-cropper",
		requiresAuth: true
	},
	authorization: {
		name: "授权",
		path: "/pages/set/authorization/list",
		requiresAuth: true
	},
	authorization: {
		name: "授权",
		path: "/pages/set/authorization/list",
		requiresAuth: true
	},
	feedbackDetail: {
		name: "反馈详情",
		path: "/pages/set/feedback/detail",
		requiresAuth: true
	},
	feedbackList: {
		name: "我的反馈",
		path: "/pages/set/feedback/list",
		requiresAuth: true
	},
	feedback: {
		name: "意见反馈",
		path: "/pages/user/set/feedback/feedback",
		requiresAuth: true
	},
	loading: {
		name: "Loading加载动画",
		path: "/pages/user/set/loading/loading",
	},
	invoiceList: {
		name: "开票历史",
		path: "/pages/user/invoice/list",
		requiresAuth: true
	},
	invoice: {
		name: "开票列表",
		path: "/pages/user/invoice/invoice",
		requiresAuth: true
	},
	invoiceManage: {
		name: "开票管理",
		path: "/pages/user/invoice/manage",
		requiresAuth: true
	},
	refundIndex: {
		name: "售后服务",
		path: "/pages/order/refund/index/index",
		requiresAuth: true
	},
	refundList: {
		name: "售后主页",
		path: "/pages/order/refund/list/list",
		requiresAuth: true
	},
	refund: {
		name: "售后",
		path: "/pages/order/refund/refund/refund",
		requiresAuth: true
	},
	refundDetail: {
		name: "售后详情页",
		path: "/pages/order/refund/detail/detail",
		requiresAuth: true
	},
	refundShipping: {
		name: "售后物流信息填写",
		path: "/pages/order/refund/shipping/shipping",
		requiresAuth: true
	},
	refundOrder: {
		name: "申请退款",
		path: "/pages/order/refund/order/order",
		requiresAuth: true
	},
	customerIndex: {
		name: "售后服务",
		path: "/pages/order/customer/index/index",
		requiresAuth: true
	},
	evaluation: {
		name: "评价",
		path: "/pages/order/evaluation/evaluation",
		requiresAuth: true
	},
	evaluationIndex: {
		name: '评价列表',
		path: "/pages/order/evaluation/index/index",
		requiresAuth: true
	},
	evaluationDetail: {
		name: '评价详情',
		path: "/pages/order/evaluation/detail/detail",
		requiresAuth: true
	},
	evaluationStatus: {
		name: '评价状态',
		path: "/pages/order/evaluation/status/status",
		requiresAuth: true
	},
	orderItem: {
		name: "订单商品列表",
		path: "/pages/order/item",
		requiresAuth: true
	},
	shipping: {
		name: "订单物流",
		path: "/pages/order/shipping/shipping",
		requiresAuth: true
	},
	shippingReturn: {
		name: "退货物流",
		path: "/pages/order/shipping/return",
		requiresAuth: true
	},
	distribution: {
		name: "分销商",
		path: "/pages/distribution/index/index",
		requiresAuth: true
	},
	brokerage: {
		name: "佣金",
		path: "/pages/distribution/brokerage/brokerage",
		requiresAuth: true
	},
	brokerageCapital: {
		name: "佣金明细",
		path: "/pages/distribution/brokerage/capital",
		requiresAuth: true
	},
	distributionApply: {
		name: "申请推广员",
		path: "/pages/distribution/apply/apply",
		requiresAuth: true
	},
	distributionApplyAgncy: {
		name: "申请区域代理",
		path: "/pages/distribution/apply/applyAgncy",
		requiresAuth: true
	},
	distributionApplyHistory: {
		name: "申请历史",
		path: "/pages/distribution/apply/applyHistory",
		requiresAuth: true
	},
	distributionRegionalApply: {
		name: "区域代理",
		path: "/pages/distribution/regional/apply",
		requiresAuth: true
	},
	distributionSpread: {
		name: "裂变分销信息",
		path: "/pages/distribution/spread/spread",
		requiresAuth: true
	},
	distributionStore: {
		name: "店铺分销信息",
		path: "/pages/distribution/store/store",
		requiresAuth: true
	},
	distributionAgent: {
		name: "分销团队",
		path: "/pages/distribution/agent/agent",
		requiresAuth: true
	},
	distributionOrder: {
		name: "自推订单",
		path: "/pages/distribution/order/order",
		requiresAuth: true
	},
	distributionPromote: {
		name: "推广二维码",
		path: "/pages/distribution/spread/promote",
		requiresAuth: true
	},
	distributionWithdraw: {
		name: "提现账号",
		path: "/pages/distribution/withdraw/withdraw",
		requiresAuth: true
	},
	distributionWithdrawManage: {
		name: "提现账号管理",
		path: "/pages/distribution/withdraw/manage",
		requiresAuth: true
	},
	distributionCash: {
		name: "提现",
		path: "/pages/distribution/cash/cash",
		requiresAuth: true
	},
	distributionCashList: {
		name: "提现记录",
		path: "/pages/distribution/cash/list",
		requiresAuth: true
	},
	distributionPoster: {
		name: "推广海报",
		path: "/pages/distribution/poster/poster",
		requiresAuth: true
	},
	giving: {
		name: "佣金转赠",
		path: "/pages/distribution/giving/giving",
		requiresAuth: true
	},
	setPayPswHash: {
		name: "设置支付密码",
		path: "/pages/distribution/giving/setPayPswHash",
		requiresAuth: true
	},
	rankingList: {
		name: "排行榜",
		path: "/pages/distribution/rankingList/rankingList"
	},
	givingRecord: {
		name: "佣金转赠记录",
		path: "/pages/distribution/giving/givingRecord",
		requiresAuth: true
	},
	cloudWarehouse: {
		name: "云仓",
		path: "/pages/cloudWarehouse/index/index",
		requiresAuth: true
	},
	income: {
		name: "收益",
		path: "/pages/cloudWarehouse/income/income",
		requiresAuth: true
	},
	inventoryRecords: {
		name: "库存记录",
		path: "/pages/cloudWarehouse/inventoryRecords/inventoryRecords",
		requiresAuth: true
	},
	inventoryManagement: {
		name: "库存管理",
		path: "/pages/cloudWarehouse/inventoryManagement/inventoryManagement",
		requiresAuth: true
	},
	incomingGoods: {
		name: "进货",
		path: "/pages/cloudWarehouse/incomingGoods/incomingGoods",
		requiresAuth: true
	},
	incomingGoodsCreate: {
		name: "进货信息",
		path: "/pages/cloudWarehouse/create/create"
	},
	pickUpGoods: {
		name: "提货",
		path: "/pages/cloudWarehouse/pickUpGoods/pickUpGoods",
		requiresAuth: true
	},
	storeLevelLog: {
		name: "申请区域合伙人",
		path: "/pages/cloudWarehouse/storeLevelLog/storeLevelLog",
		requiresAuth: true
	},
	
	//allinpay
	allinpayCard: {
		name: "银行卡",
		path: "/pages/allinpay/card/card",
		requiresAuth: true
	},
	allinpayWithdraw: {
		name: "提现",
		path: "/pages/allinpay/withdraw/withdraw",
		requiresAuth: true
	},
	allinpayCardE: {
		name: "银行卡",
		path: "/pages/allinpay/card/cardE",
		requiresAuth: true
	},
	allinpayWithdrawE: {
		name: "提现",
		path: "/pages/allinpay/withdraw/withdrawE",
		requiresAuth: true
	},

	// share
	shareCollection: {
		name: "我的收藏",
		path: "/pages/user/share/collection/collection",
		requiresAuth: true
	},
	shareIndex: {
		name: "发现",
		path: "/pages/share/share",
		requiresAuth: false
	},
	shareList: {
		name: "列表",
		path: "/pages/user/share/list/list",
		requiresAuth: false
	},
	shareCate: {
		name: "全部分类",
		path: "/pages/share/cate",
		requiresAuth: false
	},
	shareDetail: {
		name: "详情",
		path: "/pages/user/share/detail/detail",
		requiresAuth: false
	},
	about: {
		name: "关于",
		path: "/pages/user/set/about/about"
	},
	aboutProtocol: {
		name: "协议",
		path: "/pages/user/set/about/protocol"
	},
	weappPay: {
		name: "微信小程序支付",
		path: "/pages/user/money/weappPay"
	},
	weappSuccess: {
		name: "支付成功",
		path: "/pages/user/money/weappSuccess"
	},
	couponDetail: {
		name: "优惠券详情",
		path: "/pages/user/coupon/detail",
		requiresAuth: false
	},
	// 测评
	appraisalIndex: {
		name: "测评首页",
		path: "/pages/marketing/appraisal/index/index"
	},
	appraisalSubject: {
		name: "测评题目",
		path: "/pages/marketing/appraisal/subject/subject"
	},
	appraisalTestResult: {
		name: "测评结果",
		path: "/pages/marketing/appraisal/testResult/testResult"
	},
	//知识付费
	knowledgeIndex: {
		name: "知识付费首页",
		path: "/pages/knowledge/index/index"
	},
	knowledgeParticulars: {
		name: "知识付费详情",
		path: "/pages/knowledge/particulars/particulars"
	},
	knowledgeContent: {
		name: "知识付费内容",
		path: "/pages/knowledge/content/content"
	},
	knowledgePay: {
		name: "支付页面",
		path: "/pages/order/pay/knowledgePay"
	},
}
