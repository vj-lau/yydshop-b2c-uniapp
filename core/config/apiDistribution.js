//API接口
export default {
	// 个人信息
	memberIndex: "/dz-shop/v1/distribution/member/index",
	// 提现账号列表
	bankAccountIndex: "/dz-shop/v1/distribution/bank-account/index",
	// 删除提现账号
	bankAccountDelete: "/dz-shop/v1/distribution/bank-account/delete",
	// 更新提现账号
	bankAccountUpdate: "/dz-shop/v1/distribution/bank-account/update",
	// 新增提现账号
	bankAccountCreate: "/dz-shop/v1/distribution/bank-account/create",
	// 提现账号详情
	bankAccountView: "/dz-shop/v1/distribution/bank-account/view",
	// 提现配置
	withdrawConfig: "/dz-shop/v1/distribution/commission-withdraw/config",
	// 提现申请
	withdrawCreate: "/dz-shop/v1/distribution/commission-withdraw/create",
	// 提现申请列表
	withdrawList: "/dz-shop/v1/distribution/commission-withdraw/index",
	// 分销商申请进度
	promoterApplySchedule: '/dz-shop/v1/distribution/promoter-apply/schedule',
	// 分销商申请记录
	promoterApplyIndex: '/dz-shop/v1/distribution/promoter-apply/index',
	// 分销商申请配置
	promoterLevelConfig: '/dz-shop/v1/distribution/promoter-level/config',
	// 分销商申请
	promoterApplyCreate: '/dz-shop/v1/distribution/promoter-apply/create',
	// 区域代理申请进度
	regionalAgentApplySchedule: '/dz-shop/v1/distribution/regional-apply/index',
	// 区域代理申请配置
	regionalLevelConfig: '/dz-shop/v1/distribution/regional-level/config',
	// 区域代理申请
	regionalApplyCreate: '/dz-shop/v1/distribution/regional-apply/create',
	// 裂变分销商级别列表
	promoterLevelIndex: '/dz-shop/v1/distribution/promoter-level/index',
	// 裂变分销下一级分销商条件
	promoterNextLevel: '/dz-shop/v1/distribution/promoter-level/next-level',
	// 店铺分销商级别列表
	promoterStoreLevelIndex: '/dz-shop/v1/distribution/store-level/index',
	// 云仓分销商级别列表
	promoterWarehouseLevelIndex: '/dz-shop/v1/distribution/warehouse-level/index',
	//店铺分销下一级分销商条件
	storeNextLevel: '/dz-shop/v1/distribution/store-level/next-level',
	// 推广二维码
	memberQr: '/dz-shop/v1/distribution/member/qr',
	// 上级分销商
	distributionMemberParent: '/dz-shop/v1/distribution/member/parent',
	// 下级分销商
	distributionMemberChild: '/dz-shop/v1/distribution/member/child',
	// 店铺分销下级分销商
	distributionMemberStoreChild: '/dz-shop/v1/distribution/member/store-child',
	// 云仓分销下级分销商
	distributionMemberWarehouseChild: '/dz-shop/v1/distribution/member/warehouse-child',
	// 佣金流水（标准版）
	promoterRecordIndex: '/dz-shop/v1/distribution/promoter-record/index',
	// 自推订单
	promoterRecordSelf: '/dz-shop/v1/distribution/promoter-record/self',
	// 自推订单统计
	promoterRecordSelfStat: '/dz-shop/v1/distribution/promoter-record/self-stat',
	// 团队订单
	promoterRecordTeam: '/dz-shop/v1/distribution/promoter-record/team',
	// 团队订单统计
	promoterRecordTeamStat: '/dz-shop/v1/distribution/promoter-record/team-stat',
	// 分享海报
	distributionPosterIndex: "/dz-shop/v1/distribution/poster/index",
	// 佣金流水（店铺分销版）
	promoterCapitalIndex: "/dz-shop/v1/distribution/user-brokerage-log/index",
	// 设置支付密码
	setPayPassword:"/dz-shop/v1/site/set-pay-password",
	// 佣金转赠配置
	transferConfig:"/dz-shop/v1/distribution/commission-transfer/config",
	// 查询佣金转赠收款人信息
	findReciver:"/dz-shop/v1/member/member/find-by-id",
	// 发起佣金转赠
	transferCreate:"/dz-shop/v1/distribution/commission-transfer/create",
	// 转赠记录
	givingRecord:"/dz-shop/v1/distribution/commission-transfer/index",
	
	warehouseIndex: "/dz-shop/v1/member/member/warehouse-index",
	warehouseProduct: "/dz-shop/v1/warehouse/product/index",
	warehouseProductDetail: "/dz-shop/v1/warehouse/product/view",
	
	orderPreview: "/dz-shop/v1/warehouse/purchase-order/preview",
	orderCreate: "/dz-shop/v1/warehouse/purchase-order/create",
	orderView: "/dz-shop/v1/warehouse/purchase-order/view",
	statistics: "/dz-shop/v1/warehouse/stock-log/statistics",
	stockLog: "/dz-shop/v1/warehouse/stock-log/index",
	
	
	// 提货订单信息
	pickUpPorduct: '/dz-shop/v1/warehouse/pick-up-order/preview',
	// 创建提货订单
	pickUpOrder: '/dz-shop/v1/warehouse/pick-up-order/create',
	// 计算提货运费
	freightFee: '/dz-shop/v1/warehouse/pick-up-order/freight-fee',
	// 计算提货运费
	freightFeeInfo: '/dz-shop/v1/warehouse/pick-up-order/freight-fee-info',
	// 提货创建
	warehousePickUpCreate: "/dz-shop/v1/warehouse/pick-up-order/create",
	// 运费信息
	warehouseFreightFeeInfo: "/dz-shop/v1/warehouse/pick-up-order/freight-fee-info",
	// 升级日志
	warehouseLevelLog:"/dz-shop/v1/distribution/warehouse-level/log",
	// 货款收益
	promoterRecordIndex: "/dz-shop/v1/distribution/promoter-record/index",
	// 排行榜
	warehouseRanking: "/dz-shop/v1/warehouse/ranking/index",
	// 分销收益
	estimateStat: "/dz-shop/v1/distribution/member/estimate-stat"
	
	
}
