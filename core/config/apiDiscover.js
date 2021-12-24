//微分享API接口
export default {
	// 首页
	discoverIndex : "/tiny-discover/v1/index/index",
	// 顶级分类
	discoverCateTops : "/tiny-discover/v1/cate/tops",
	// 子分类
	discoverCateChilds : "/tiny-discover/v1/cate/childs",
	// 内容列表
	discoverContent : "/tiny-discover/v1/content/index",
	//收藏列表
	discoverCollection : "/tiny-discover/v1/collection/index",
	// 内容详情
	discoverContentView : "/tiny-discover/v1/content/view",
	// 添加点赞
	discoverLikeCreate: "/dz-discover/v1/like/create",
	// 取消点赞
	discoverLikeDelete: "/dz-discover/v1/like/delete",
	// 添加收藏
	discoverCollectionCreate: "/dz-discover/v1/collection/create",
	// 取消收藏
	discoverCollectionDelete: "/dz-discover/v1/collection/delete",
	// 增加分享次数
	discoverShareTime : "/dz-discover/v1/content/share-time",
}