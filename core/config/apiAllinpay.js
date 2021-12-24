//通商云
export default {
	//---------------------通商云标准接口-----------------------
	// 发送通商云认证验证码
	sendCode: "/dz-pay/v1/allinpay/yun-member/send-code",
	// 绑定认证手机
	bindPhone: "/dz-pay/v1/allinpay/yun-member/bind-phone",
	// 实名认证
	setRealName: "/dz-pay/v1/allinpay/yun-member/set-real-name",
	//电子协议签约-跳转url
	signContract: "/dz-pay/v1/allinpay/yun-member/sign-contract",
	//设置支付密码-跳转url
	setPayPwd: "/dz-pay/v1/allinpay/yun-member/set-pay-pwd",
	//修改支付密码-跳转url
	updatePayPwd: "/dz-pay/v1/allinpay/yun-member/update-pay-pwd",
	//重置支付密码-跳转url
	resetPayPwd: "/dz-pay/v1/allinpay/yun-member/reset-pay-pwd",
	//更换绑定手机-发送验证码
	updatePhoneBySendCode: "/dz-pay/v1/allinpay/yun-member/update-phone-by-send-code",
	//更换绑定手机-解绑
	updatePhoneByUnbind: "/dz-pay/v1/allinpay/yun-member/update-phone-by-unbind",
	//更换绑定手机-通过支付密码-跳转url
	updatePhoneByPayPwd: "/dz-pay/v1/allinpay/yun-member/update-phone-by-pay-pwd",
	//更换绑定手机-通过绑定银行卡-发送验证码
	updatePhoneByCardApply: "/dz-pay/v1/allinpay/yun-member/update-phone-by-card-apply",
	//更换绑定手机-通过绑定银行卡-确认
	updatePhoneByCardAgree: "/dz-pay/v1/allinpay/yun-member/update-phone-by-card-agree",
	//查询卡bin
	getCardBin: "/dz-pay/v1/allinpay/yun-member-card/get-card-bin",
	//银行卡列表
	getCardList: "/dz-pay/v1/allinpay/yun-member-card/index",
	//银行卡信息
	getCardInfo: "/dz-pay/v1/allinpay/yun-member-card/view",
	//请求绑卡-发送验证码
	bindCardApply: "/dz-pay/v1/allinpay/yun-member-card/bind-card-apply",
	//确认绑卡
	bindCardAgree: "/dz-pay/v1/allinpay/yun-member-card/bind-card-agree",
	//设置默认提现卡
	setDefaultWithdraw: "/dz-pay/v1/allinpay/yun-member-card/set-default-withdraw",
	//设置默认支付卡
	setDefaultPay: "/dz-pay/v1/allinpay/yun-member-card/set-default-pay",
	//设置安全卡
	setSafeCard: "/dz-pay/v1/allinpay/yun-member-card/set-safe-card",
	//解绑银行卡
	unbindCard: "/dz-pay/v1/allinpay/yun-member-card/unbind-card",
	//---------------------通商云E+接口-----------------------
	// 发送通商云认证验证码
	sendCodeEplus: "/dz-pay/v1/allinpay/eplus-member/send-code",
	// 绑定认证手机
	bindPhoneEplus: "/dz-pay/v1/allinpay/eplus-member/bind-phone",
	// 实名认证
	setRealNameEplus: "/dz-pay/v1/allinpay/eplus-member/set-real-name",
	//电子协议签约-跳转url
	signContractEplus: "/dz-pay/v1/allinpay/eplus-member/sign-contract",
	//查询卡bin
	getCardBinEplus: "/dz-pay/v1/allinpay/eplus-member-card/get-card-bin",
	//银行卡列表
	getCardListEplus: "/dz-pay/v1/allinpay/eplus-member-card/index",
	//银行卡信息
	getCardInfoEplus: "/dz-pay/v1/allinpay/eplus-member-card/view",
	//请求绑卡-发送验证码
	bindCardApplyEplus: "/dz-pay/v1/allinpay/eplus-member-card/bind-card-apply",
	//确认绑卡
	bindCardAgreeEplus: "/dz-pay/v1/allinpay/eplus-member-card/bind-card-agree",
	//设置默认提现卡
	setDefaultWithdrawEplus: "/dz-pay/v1/allinpay/eplus-member-card/set-default-withdraw",
	getQuerySignContract: "/dz-pay/v1/allinpay/eplus-member/query-sign-contract",
	
	
}