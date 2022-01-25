import appConfig from "./appConfig.js"

const PATH = appConfig.assetsPath;
const SRC = PATH + '/empty';
const SIGNIN_PATH = PATH + '/signin/';
/* 
 * 图片静态资源表，所有图片资源路径在这统一管理，不应该写死在页面中，该数据挂载到Vue原型中。
 * 页面使用：this.$api.assetsPath.grid_1
 * CSS背景：应尽量使用:style="" 行内样式设置背景图
 * PATH说明：本地路径或者服务器路径
 * 
 * 举例：<image :src="grid_1">  需要在data中映射 grid_1: this.$api.assetsConfig.grid_1
 * 
 * 特别注意：经测试小程序中不支持 <image :src="$api.assetsConfig.grid_1"> 该用法
 */

export default {
	//logo
	logo: PATH + "/logo.png",
	//直播图标
	iconLive: PATH + "/icon-live.png",
	//拼团图标
	iconWholesale: PATH + "/icon-wholesale.png",
	//砍价图标
	iconBargain: PATH + "/icon-bargain.png",
	//限时折扣图标
	iconDiscount: PATH + "/icon-discount.png",
	//团购秒杀图标
	iconGroup: PATH + "/icon-group.png",
	//新品图标
	iconNew: PATH + "/icon-new.png",
	//推荐产品图标
	iconRecommend: PATH + "/icon-recommend.png",
	//热门产品图标
	iconHot: PATH + "/icon-hot.png",
	//猜你喜欢商品图标
	iconLike: PATH + "/icon-like.png",
	// 默认分类图标
	iconCategoryDefault: PATH + "/icon-category-default.png",
	// 分销tag
	distribution: PATH + '/distribution.png',
	// 预售tag
	presale: PATH + '/presale.png',
	// 虚拟tag
	virtual: PATH + '/virtual.png',
	// 包邮tag
	pinkage: PATH + '/pinkage.png',
	// vip背景
	vipCardBg: PATH + '/vip-card.png',
	// vip价格
	vipPrice: PATH + '/vip-price.png',
	// 默认头像
	missingFace: PATH + '/missing-face.png',
	// 拼团标签
	wholesaleTag: PATH + '/wholesale-tag.png',
	// 团购标签
	groupTag: PATH + '/group-tag.png',
	// 砍价标签
	bargainTag: PATH + '/bargain-tag.png',
	// 折扣标签
	discountTag: PATH + '/discount-tag.png',
	// 视频播放
	videoPlayer: PATH + '/video-player.png',
	// 虚拟icon
	iconVirtual: PATH + '/icon-virtual.png',
	//步骤右箭头
	stepArrow: PATH + '/step-arrow.png',
	//优惠券背景
	couponBg: PATH + '/coupon-bg.png',
	//预售
	presellStep1: PATH + '/presell-step-1.png',
	presellStep2: PATH + '/presell-step-2.png',
	presellStep3: PATH + '/presell-step-3.png',
	presellStep4: PATH + '/presell-step-4.png',
	//拼团
	wholesaleStep1: PATH + '/wholesale-step-1.png',
	wholesaleStep2: PATH + '/wholesale-step-2.png',
	wholesaleStep3: PATH + '/wholesale-step-3.png',
	wholesaleStep4: PATH + '/wholesale-step-4.png',
	// 会员等级图标
	memberLevel: PATH + '/member-level.png',
	// 分销等级图标
	promoterLevel: PATH + '/promoter-level.png',
	//成功
	success: PATH + '/success.png',
	//失败
	failure: PATH + '/failure.png',
	//等待
	waitting: PATH + '/waitting.png',
	//超时
	timeout: PATH + '/timeout.png',
	// 微信胶囊
	capsule: PATH + "/capsule.png",
	// 小程序引导
	smallProgramBoot: PATH + "/small-program-boot.png",
	//浏览器中打开
	liveWechat: PATH + "/live_weixin.png",
	// 无数据状态
	// 商品为空
	empty: SRC + '/empty.png',
	// 地址为空
	emptyAddress: SRC + '/empty-address.png',
	// 购物车为空
	emptyCart: SRC + '/empty-cart.png',
	// 优惠劵为空
	emptyCoupon: SRC + '/empty-coupon.png',
	// 统计数据为空
	emptyData: SRC + '/empty-data.png',
	// 浏览数据为空
	emptyFootprint: SRC + '/empty-footprint.png',
	// 消息为空
	emptyMsg: SRC + '/empty-msg.png',
	// 订单为空
	emptyOrder: SRC + '/empty-order.png',
	// 搜索为空
	emptySearch: SRC + '/empty-search.png',
	// 邀请好友为空
	emptyUser: SRC + '/empty-user.png',
	// 积分签到
	signImgCalendar: SIGNIN_PATH + 'sign_img_calendar.png',
	signImgRanking: SIGNIN_PATH + 'sign_img_ranking.png',
	signImgTriangle: SIGNIN_PATH + 'sign_img_triangle.png',
	signImgLeftarrow: SIGNIN_PATH + 'sign_img_leftarrow.png',
	signImgGoto: SIGNIN_PATH + 'sign_img_goto.png',
	signedInImg: SIGNIN_PATH + 'signed_in_img.png',
	signImgGift: SIGNIN_PATH + 'sign_img_gift.png',
	signImgDouble: SIGNIN_PATH + 'sign_img_double.png',
	signImgMedal: SIGNIN_PATH + 'sign_img_medal.png',
	signImgFirst: SIGNIN_PATH + 'sign_img_first.png',
	signImgSecond: SIGNIN_PATH + 'sign_img_second.png',
	signImgThird: SIGNIN_PATH + 'sign_img_third.png',
	// 小程序分享朋友圈引导图
	guide: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATgAAADICAMAAABLRA31AAAC61BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8JS/TAAAAA+HRSTlMAAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXV5fYGFiY2Rl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'





}
