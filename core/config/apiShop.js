//API接口
export default {
	// 获取省市区列表
	provinceList: "/dz-shop/v1/common/provinces/index",
	// 收藏商品
	collectCreate: "/dz-shop/v1/common/collect/create",
	// 删除收藏商品
	collectDel: "/dz-shop/v1/common/collect/delete",
	// 分享/转发
	transmitCreate: "/dz-shop/v1/common/transmit/create",
	// 广告
	advList: "/dz-shop/v1/common/adv/index",
	// 首页弹窗
	popAdv: "/dz-shop/v1/common/pop-adv/index",
	//设置广告查看次数
	advView: '/dz-shop/v1/common/adv/view',
	//设置弹窗广告查看次数
	advPopView: '/dz-shop/v1/common/pop-adv/view',
	// 配置
	configList: "/dz-shop/v1/common/config/index",
	// 协议
	commonProtocol: '/dz-shop/v1/common/protocol/detail',
	// 支付配置
	payConfig: "/dz-shop/v1/common/pay/config",
	// 支付
	payCreate: "/dz-shop/v1/common/pay/create",
	// 无授权支付
	payCreateNoAuth: "/dz-shop/v1/common/pay/create-no-auth",
	// 通商云快捷支付确认
	payBySendCode: "/dz-shop/v1/common/pay/pay-by-send-code",
	// 支付结果
	payLog: "/dz-shop/v1/common/pay-log/find-by-out-trade-no",
	// 微信sdk
	wechatConfig: "/dz-shop/v1/third-party/wechat-js-sdk",
	// 公告列表
	notifyAnnounceIndex: "/dz-shop/v1/common/notify-announce/index",
	// 公告详情
	notifyAnnounceView: "/dz-shop/v1/common/notify-announce/view",
	// 联系我们
	getTel: '/dz-shop/v1/common/site/index',
	// 商品自提点
	pickupPointIndex: '/dz-shop/v1/common/pickup-point/index',
	// 站点帮助-列表
	helperIndex: '/dz-shop/v1/common/helper/index',
	// 站点帮助-详情
	helperView: '/dz-shop/v1/common/helper/view',
	//设备推送
	bindingEquipment: '/dz-shop/v1/member/auth/binding-equipment',
	// 密码注册
	registerByPass: "/dz-shop/v1/site/register",
	// 密码登录
	loginByPass: "/dz-shop/v1/site/login",
	// 手机注册或登录
	registerOrLogin: "/dz-shop/v1/site/register-or-login",
	// 微信小程序手机注册或登录（强制绑定手机模式）
	mpWechatRegisterOrLogin: '/dz-shop/v1/site/wechat-mobile-register-or-login',
	// 无手机号码的账户绑定手机号码
	mobileBind: "/dz-shop/v1/site/mobile-bind",
	// 无手机号码的账户通过小程序授权绑定手机号码
	mpWechatMobileBind: "/dz-shop/v1/site/wechat-mobile-bind",
	// 验证旧手机号
	mobileUnBind: "/dz-shop/v1/site/mobile-unbind",
	// 更换新手机号
	mobileReBind: "/dz-shop/v1/site/mobile-rebind",
	// 通过小程序授权更换新的手机号码
	mpWechatMobileModify: "/dz-shop/v1/site/wechat-mobile-modify",
	// 微信公众号授权登录
	wechatH5Login: "/dz-shop/v1/third-party/wechat",
	// 微信小程序授权登录
	mpWechatLogin: "/dz-shop/v1/third-party/wechat-mp",
	// 新版微信小程序授权登录
	mpWechatLogin2: "/dz-shop/v1/third-party/wechat-mp2",
	// 微信小程序手机号绑定(非强制绑定手机模式)
	mpWechatMobileLogin: '/dz-shop/v1/third-party/wechat-mp-mobile',
	// 微信APP授权登录(APP本地登录模式)
	appWechatLogin: "/dz-shop/v1/third-party/wechat-app",
	// 微信APP授权登录(code模式)
	thirdPartyWechatOpenPlatform: '/dz-shop/v1/third-party/wechat-open-platform',
	// 苹果授权登录
	thirdPartyApple: '/dz-shop/v1/third-party/apple',
	//获取商品微信小程序码
	thirdPartyQrCode: '/dz-shop/v1/third-party/qr-code',
	//获取微信小程序码
	thirdPartyWechatQrCode: '/dz-shop/v1/third-party/wechat-qr-code',
	//获取微信公众号关注二维码
	thirdPartyWechatOfficialQrCode: '/dz-shop/v1/third-party/wechat-official-qr-code',
	//重新生成微信公众号关注二维码
	thirdPartyWechatOfficialQrCodeCreate: '/dz-shop/v1/third-party/wechat-official-qr-code-create',
	// 密码重置
	updatePassword: "/dz-shop/v1/site/up-pwd",
	// 第三方绑定
	authLogin: "/dz-shop/v1/member/auth/create",
	// 查询绑定状态
	isBindingCheck: "/dz-shop/v1/member/auth/is-binding",
	// 手机号登录
	loginBySmsCode: "/dz-shop/v1/site/mobile-login",
	// 获取手机验证码
	smsCode: "/dz-shop/v1/site/sms-code",
	// 退出登录
	logout: "/dz-shop/v1/site/logout",
	// 刷新TOKEN
	refreshToken: "/dz-shop/v1/site/refresh",
	// 登录令牌有效性检测
	verifyAccessToken: '/dz-shop/v1/site/verify-access-token',
	//通商云发送绑定手机验证码
	allinpayBindMobileSendCode: "/dz-shop/v1/allinpay/user/send-code",
	//通商云绑定手机
	allinpayBindMobile: "/dz-shop/v1/allinpay/user/bind-phone",
	//通商云实名认证
	allinpaySetRealName: "/dz-shop/v1/allinpay/user/set-real-name",
	//通商云签约
	allinpaySignContract: "/dz-shop/v1/allinpay/user/sign-contract",
	//通商云获取已绑定银行卡列表
	allinpayCardIndex: "/dz-shop/v1/allinpay/card/index",
	//通商云请求绑定银行卡
	allinpayBindCardApply: "/dz-shop/v1/allinpay/card/bind-card-apply",
	//通商云确认绑定银行卡
	allinpayBindCardAgree: "/dz-shop/v1/allinpay/card/bind-card-agree",
	//通商云设置为默认银行卡
	allinpaySetDefaultWithdraw: "/dz-shop/v1/allinpay/card/set-default-withdraw",
	//通商云解绑卡
	allinpayUnbindCard: "/dz-shop/v1/allinpay/card/unbind-card",
	//通商云查询卡信息
	allinpayViewCard: "/dz-shop/v1/allinpay/card/view",
	// 首页列表
	indexList: "/dz-shop/v1/index/index",
	//比较少产品的首页列表
	fewIndexList: "/dz-shop/v1/index/few-index",
	// diy首页
	indexDiy: '/dz-shop/v1/index/custom-page',
	// diy自定义页面
	customPage: '/dz-shop/v1/index/custom',
	// 我的装饰
	customCenter: '/dz-shop/v1/index/custom-center',
	// diy底部导航栏
	diyTabbar: '/dz-shop/v1/index/custom-tab',
	// 分类样式
	customCate: '/dz-shop/v1/index/custom-cate',
	// 产品分类列表
	productCate: "/dz-shop/v1/product/cate/index",
	// 品牌列表
	brandIndex: '/dz-shop/v1/product/brand/index',
	// 首页推荐分类
	productCateList: "/dz-shop/v1/product/cate/list",
	// 产品列表
	productList: "/dz-shop/v1/product/product/index",
	// 产品详情
	productDetail: "/dz-shop/v1/product/product/view",
	// 猜你喜欢
	guessYouLikeList: "/dz-shop/v1/product/product/guess-you-like",
	// 添加购物车
	cartItemCreate: "/dz-shop/v1/member/cart-item/create",
	// 购物车列表
	cartItemList: "/dz-shop/v1/member/cart-item/index",
	// 购物车数量
	cartItemCount: "/dz-shop/v1/member/cart-item/count",
	// 删除购物车商品
	cartItemDel: "/dz-shop/v1/member/cart-item/delete-ids",
	// 清空购物车
	cartItemClear: "/dz-shop/v1/member/cart-item/clear",
	// 修改购物车商品数量
	cartItemUpdateNum: "/dz-shop/v1/member/cart-item/update-num",
	// 修改购物车商品sku
	cartItemUpdateSku: "/dz-shop/v1/member/cart-item/update-sku",
	// 订单创建
	orderCreate: "/dz-shop/v1/order/order/create",
	// 订单预览
	orderPreview: "/dz-shop/v1/order/order/preview",
	// 取消未支付订单
	orderClose: "/dz-shop/v1/member/order/close",
	// 选择快递运费计算
	orderFreightFee: "/dz-shop/v1/order/order/freight-fee",
	// 快递费，快递公司获取
	orderFreightFeeInfo: "/dz-shop/v1/order/order/freight-fee-info",
	// 商品评价列表
	evaluateList: "/dz-shop/v1/product/evaluate/index",
	// 商品评价详情
	evaluateProduct: "/dz-shop/v1/product/evaluate/product",
	// 商品物流详情
	orderProductExpressDetails: "/dz-shop/v1/member/order-product-express/details",
	// 拼团首页(拼团产品列表)
	wholesaleProductIndex: "/dz-shop/v1/marketing/wholesale-product/index",
	// 开团列表
	wholesaleIndex: "/dz-shop/v1/marketing/wholesale/index",
	// 开团详情
	wholesaleView: "/dz-shop/v1/marketing/wholesale/view",
	// 开团滚动信息
	wholesaleGroupState: "/dz-shop/v1/marketing/wholesale/group-state",
	// 我的开团列表
	wholesaleMemberIndex: '/dz-shop/v1/member/wholesale/index',
	// 我的开团订单详情
	wholesaleMemberView: '/dz-shop/v1/member/wholesale/view',
	// 砍价活动首页
	bargainIndex: '/dz-shop/v1/marketing/bargain/index',
	// 砍价商品列表
	bargainProductIndex: '/dz-shop/v1/marketing/bargain-product/index',
	// 创建砍价
	bargainLaunchCreate: '/dz-shop/v1/marketing/bargain-launch/create',
	// 砍价详情
	bargainLaunchView: '/dz-shop/v1/marketing/bargain-launch/view',
	// 帮好友砍价
	bargainPartakeCreate: '/dz-shop/v1/marketing/bargain-partake/create',
	// 我的砍价列表
	bargainLaunchIndex: '/dz-shop/v1/marketing/bargain-launch/index',
	// 生成砍价订单号
	bargainLaunchBuildOrder: '/dz-shop/v1/marketing/bargain-launch/build-order',
	//团购
	groupBuyIndex: '/dz-shop/v1/marketing/group-buy/index',
	//限时折扣已开始活动列表
	discountIndex: '/dz-shop/v1/marketing/discount/index',
	//限时折扣未开始活动列表
	discountSoon: '/dz-shop/v1/marketing/discount/soon',
	//限时折扣已开始产品列表
	discountProductIndex: '/dz-shop/v1/marketing/discount-product/index',
	//限时折扣未开始产品列表
	discountProductSoon: '/dz-shop/v1/marketing/discount-product/soon',
	//限时折扣产品列表（不分是否开始）
	discountProductList: '/dz-shop/v1/marketing/discount-product/list',
	//组合套餐详情
	combinationView: '/dz-shop/v1/marketing/combination/view',
	// 个人信息
	memberInfo: "/dz-shop/v1/member/member/index",
	//个人账户信息
	account: "/dz-shop/v1/member/account/account",
	// 个人信息修改
	memberUpdate: "/dz-shop/v1/member/member/update",
	// 真实姓名修改(如果已实名则无法修改)
	memberRealnameUpdate: "/dz-shop/v1/member/member/set-real-name",
	// 推荐人修改
	memberUpdateReferrer: "/dz-shop/v1/member/member/update-referrer",
	// 收货地址列表
	addressList: "/dz-shop/v1/member/address/index",
	// 默认收货地址
	addressDefault: "/dz-shop/v1/member/address/default",
	// 默认收货地址
	addressDetail: "/dz-shop/v1/member/address/view",
	// 创建收货地址
	addressCreate: "/dz-shop/v1/member/address/create",
	// 修改收货地址
	addressUpdate: "/dz-shop/v1/member/address/update",
	// 修改收货地址
	addressDelete: "/dz-shop/v1/member/address/delete",
	// 获取优惠券列表
	couponList: "/dz-shop/v1/marketing/coupon-type/index",
	// 获取我的优惠券列表
	myCouponList: "/dz-shop/v1/member/coupon/index",
	// 我的优惠券详情
	myCouponDetail: "/dz-shop/v1/member/coupon/view",
	// 优惠券详情
	couponDetail: "/dz-shop/v1/marketing/coupon-type/view",
	// 领取优惠券
	couponReceive: "/dz-shop/v1/marketing/coupon-type/create",
	// 清除优惠券
	couponClear: "/dz-shop/v1/member/coupon/clear",
	// 获取我的订单
	orderList: "/dz-shop/v1/member/order/index",
	// 订单商品
	orderProductIndex: '/dz-shop/v1/member/order-product/index',
	// 订单确认收货
	orderTakeDelivery: "/dz-shop/v1/member/order/take-delivery",
	// 退货/退款申请
	orderRefundApply: "/dz-shop/v1/member/order-product/refund-apply",
	// 产品退货提交物流
	orderProductSalesReturn: "/dz-shop/v1/member/order-product/refund-sales-return",
	// 换货确认收货
	orderProductSalesDelivery: "/dz-shop/v1/member/order-product/refund-sales-delivery",
	// 关闭退货/退款申请
	closeOrderRefundApply: "/dz-shop/v1/member/order-product/refund-close",
	// 获取订单详情
	orderDetail: "/dz-shop/v1/member/order/view",
	// 删除已关闭订单
	orderDelete: "/dz-shop/v1/member/order/delete",
	// 获取我的足迹
	footPrintList: "/dz-shop/v1/member/footprint/index",
	// 删除我的足迹
	footPrintDel: "/dz-shop/v1/member/footprint/delete",
	// 收藏列表
	collectList: "/dz-shop/v1/member/collect/index",
	// 积分余额日志
	creditsLogList: "/dz-shop/v1/member/credits-log/index",
	// 创建订单评价
	evaluateCreate: "/dz-shop/v1/member/evaluate/create",
	// 追加评价
	evaluateAgain: "/dz-shop/v1/member/evaluate/again",
	// 发票列表
	invoiceList: "/dz-shop/v1/member/invoice/index",
	// 发票列表
	invoiceCreate: "/dz-shop/v1/member/invoice/create",
	// 发票编辑
	invoiceUpdate: "/dz-shop/v1/member/invoice/update",
	// 发票详情
	invoiceDetail: "/dz-shop/v1/member/invoice/view",
	// 默认发票
	invoiceDefault: "/dz-shop/v1/member/invoice/default",
	// 删除发票
	invoiceDel: "/dz-shop/v1/member/invoice/delete",
	// 开票列表
	orderInvoiceList: "/dz-shop/v1/member/order-invoice/index",
	// 意见反馈列表
	opinionList: "/dz-shop/v1/member/opinion/index",
	// 意见反馈创建
	opinionCreate: "/dz-shop/v1/member/opinion/create",
	// 意见反馈详情
	opinionDetail: "/dz-shop/v1/member/opinion/view",
	// 第三方授权列表
	thirdPartyAuthList: "/dz-shop/v1/member/auth/index",
	// 解除第三方授权列表
	thirdPartyAuthDelete: "/dz-shop/v1/member/auth/delete",
	// 充值金额
	rechargeConfigIndex: "/dz-shop/v1/member/recharge-config/index",
	// 申请退款/退货
	orderCustomerRefundApply: "/dz-shop/v1/member/order-customer/apply",
	// 退货提交物流
	orderCustomerSalesReturn: "/dz-shop/v1/member/order-customer/sales-return",
	// 换货确认收货
	orderCustomerSalesDelivery: "/dz-shop/v1/member/order-customer/sales-delivery",
	// 退款/退货关闭申请
	orderCustomerRefundClose: "/dz-shop/v1/member/order-customer/close",
	// 上传图片
	uploadImage: "/dz-shop/v1/common/file/images",
	// 上传图片
	uploadBase64Image: "/dz-shop/v1/common/file/base64",
	// 消息列表
	notifyIndex: '/dz-shop/v1/member/notify/index',
	// 消息详情
	notifyView: '/dz-shop/v1/member/notify/view',
	// 单个消息阅读
	notifyRead: '/dz-shop/v1/member/notify/read',
	// 阅读全部消息
	notifyReadAll: '/dz-shop/v1/member/notify/read-all',
	//未读数量
	notifyUnRead: '/dz-shop/v1/member/notify/un-read-count',
	// 会员等级
	memberLevelIndex: '/dz-shop/v1/member/member-level/index',
	// 直播列表
	miniProgramLiveIndex: '/dz-shop/v1/marketing/mini-program-live/index',
	// 虚拟码列表
	orderProductVirtualIndex: '/dz-shop/v1/member/order-product-virtual/index',
	// 虚拟码详情
	orderProductVirtualView: '/dz-shop/v1/member/order-product-virtual/view',
	// 虚拟码核销
	productVirtualVerificationVerify: '/dz-shop/v1/order/product-virtual-verification/verify',
	// 获取消息推送配置
	notifySubscriptionConfigIndex: '/dz-shop/v1/member/notify-subscription-config/index',
	// 修改消息推送
	notifySubscriptionConfigUpConfig: '/dz-shop/v1/member/notify-subscription-config/up-config',
	//签到首页
	signinIndex: '/dz-shop/v1/marketing/signin/index',
	//获取用户签到信息
	signinInfo: '/dz-shop/v1/marketing/signin/info',
	//获取用户某月签到日志，get参数year,month,不传为当前月份
	signinLog: '/dz-shop/v1/marketing/signin/log',
	//获取用户签到规则
	signinRule: '/dz-shop/v1/marketing/signin/rule',
	//获取签到奖励（根据用户具体签到信息往后推算）
	signinRuleFormat: '/dz-shop/v1/marketing/signin/rule-format',
	//积分签到
	signin: '/dz-shop/v1/marketing/signin/signin',
	//积分排名，get参数num
	ranking: '/dz-shop/v1/marketing/signin/ranking',
	//测评数据
	appraisalList: 'dz-evaluate/v1/subject/view',
	//测评数据
	appraisalPreserve: 'dz-evaluate/v1/answer/create',
	// 测算
	calculateIndex: '/dz-fortune/v1/subject/view',
	// 测算是否已支付
	calculateIsPay: '/dz-fortune/v1/subject/is-pay',
	// 测算提交
	calculateSubmit: '/dz-fortune/v1/subject/submit',
	// 测算配置
	calculateConfig: '/dz-fortune/v1/subject/config',
	// 测算收费模式
	calculatePayConfirm: '/dz-fortune/v1/subject/pay-confirm',
	// 测算支付
	calculatePay: '/dz-fortune/v1/subject/pay-submit',
	// 知识付费列表
	knowledgeList: 'dz-knowledge/v1/knowledge/index',
	// 知识付费内容列表
	knowledgeContentList: '/dz-knowledge/v1/knowledge/view',
	// 顶级分类列表
	knowledgeCate: '/dz-knowledge/v1/knowledge/top-cates',
	// 子分类列表
	knowledgeChildCate: '/dz-knowledge/v1/knowledge/child-cates',
	// 知识付费内容列表
	knowledgeContent: '/dz-knowledge/v1/knowledge/view-content',
	// 知识付费配置
	knowledgeConfig: '/dz-knowledge/v1/knowledge/pay-confirm',
	// 知识付费支付
	knowledgePay: '/dz-knowledge/v1/knowledge/pay-submit',
	// 知识付费是否支付
	knowledgePayCreate: '/dz-knowledge/v1/knowledge/content-is-pay',
	// 获取自定义表单
	customForm: '/dz-shop/v1/index/custom-form',
	// 提交自定义表单
	customFormCreate: '/dz-shop/v1/index/custom-form-info-create',
	// 提货码验证
	roductPickupCheck: '/dz-shop/v1/order/product-pickup/check',
	// 提货发货
	roductPickupCreate: '/dz-shop/v1/order/product-pickup/create',
	miniprogramSubConfig: '/dz-shop/v1/notify/miniprogram-sub-config',
	
}
