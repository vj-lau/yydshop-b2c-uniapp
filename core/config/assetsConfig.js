import appConfig from "./appConfig.js"

const PATH = appConfig.assetsPath;
const SRC = PATH+'/empty';
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
	memberLevel: PATH +   '/member-level.png',
	// 分销等级图标
	promoterLevel:  PATH + '/promoter-level.png',
	//成功
	success:PATH + '/success.png',
	//失败
	failure:PATH + '/failure.png',
	//等待
	waitting:PATH + '/waitting.png',
	//超时
	timeout:PATH + '/timeout.png',
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
	signImgCalendar:  SIGNIN_PATH + 'sign_img_calendar.png',
	signImgRanking:  SIGNIN_PATH + 'sign_img_ranking.png',
	signImgTriangle:  SIGNIN_PATH + 'sign_img_triangle.png',
	signImgLeftarrow:  SIGNIN_PATH + 'sign_img_leftarrow.png',
	signImgGoto:  SIGNIN_PATH + 'sign_img_goto.png',
	signedInImg:  SIGNIN_PATH + 'signed_in_img.png',
	signImgGift:  SIGNIN_PATH + 'sign_img_gift.png',
	signImgDouble: SIGNIN_PATH + 'sign_img_double.png',
	signImgMedal: SIGNIN_PATH + 'sign_img_medal.png',
	signImgFirst: SIGNIN_PATH + 'sign_img_first.png',
	signImgSecond: SIGNIN_PATH + 'sign_img_second.png',
	signImgThird: SIGNIN_PATH + 'sign_img_third.png',
	
	
	
	
	
}
