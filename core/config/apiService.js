//系统内置微客服API接口(暂不启用)
export default {
	// 客服上传图片
	tinyServiceUploadFile : "/dz-service/v1/common/file/images",
	// 客服配置
	questionsIndex : "/dz-service/v1/questions/index",
	// 问题详情
	questionsView : "/dz-service/v1/questions/view",
	// 当前会话历史消息路由
	memberConversation : 'member.conversation',
	// 获取imOtp
	imOtp:"/dz-service/v1/im/otp",
	// 获取客服列表
	serviceList : "/dz-service/v1/im/service-list",
}