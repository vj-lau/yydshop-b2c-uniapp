export default {
	//手机号码区号与正则
	mobilePattern : {
	    '86': {label:"CN +86", pattern:/^(\+?86)?1\d{10}$/},//中国
		'852': {label:"HK +852", pattern:/^(\+?852)?[569]\d{3}\-?\d{4}$/},//香港
		'853': {label:"MO +853", pattern:/^(\+?853)?6\d{7}$/},//澳门
	    '886': {label:"TW +886", pattern:/^(\+?886|0)?9\d{8}$/},//台湾
		'1': {label:"US +1", pattern:/^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/},//美国,加拿大
		'7': {label:"RU +7", pattern:/^(\+?7|8)?9\d{9}$/},//俄罗斯
		'26': {label:"ZM +26", pattern:/^(\+?26)?09[567]\d{7}$/},//赞比亚
		'27': {label:"ZA +27", pattern:/^(\+?27|0)\d{9}$/},//南非
		'30': {label:"GR +30", pattern:/^(\+?30)?(69\d{8})$/},//希腊
		'32': {label:"BE +32", pattern:/^(\+?32|0)4?\d{8}$/},//比利时
		'33': {label:"FR +33", pattern:/^(\+?33|0)[67]\d{8}$/},//法国
		'34': {label:"ES +34", pattern:/^(\+?34)?(6\d{1}|7[1234])\d{7}$/},//西班牙
		'36': {label:"HU +36", pattern:/^(\+?36)(20|30|70)\d{7}$/},//匈牙利
		'39': {label:"IT +39", pattern:/^(\+?39)?\s?3\d{2} ?\d{6,7}$/},//意大利
		'44': {label:"GB +44", pattern:/^(\+?44|0)7\d{9}$/},//英国
		'45': {label:"DK +45", pattern:/^(\+?45)?(\d{8})$/},//丹麦
		'47': {label:"NO +47", pattern:/^(\+?47)?[49]\d{7}$/},//挪威
		'48': {label:"PL +48", pattern:/^(\+?48)? ?[5-8]\d ?\d{3} ?\d{2} ?\d{2}$/},//波兰
		'49': {label:"DE +49", pattern:/^(\+?49[ \.\-])?([\(]{1}[0-9]{1,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/},//德国
		'55': {label:"BR +55", pattern:/^(\+?55|0)\-?[1-9]{2}\-?[2-9]{1}\d{3,4}\-?\d{4}$/},//巴西
		'60': {label:"MS +60", pattern:/^(\+?6?01){1}(([145]{1}(\-|\s)?\d{7,8})|([236789]{1}(\s|\-)?\d{7}))$/},//马来西亚
		'61': {label:"AU +61", pattern:/^(\+?61|0)4\d{8}$/},//澳大利亚
		'63': {label:"PH +63", pattern:/^(\+?63)?\d{10}$/},//菲律宾
		'64': {label:"NZ +64", pattern:/^(\+?64|0)2\d{7,9}$/},//新西兰
		'65': {label:"SG +65", pattern:/^(\+?65)?\d{10}$/},//新加坡
		'66': {label:"TH +66", pattern:/^(\+?66)?\d{10}$/},//泰国
		'81': {label:"JP +81", pattern:/^(\+?81|0)\d{1,4}[ \-]?\d{1,4}[ \-]?\d{4}$/},//日本
		'82': {label:"KR +82", pattern:/^(\+?82)?0[71](?:\d{8,9})$/},//韩国
		'84': {label:"VN +84", pattern:/^(\+?84|0)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/},//越南
		'90': {label:"R +90", pattern:/^(\+?90|0)?5\d{9}$/},//土耳其
		'91': {label:"IN +91", pattern:/^(\+?91|0)?[789]\d{9}$/},//印度
		'213': {label:"DZ +213", pattern:/^(\+?213|0)(5|6|7)\d{8}$/},//阿尔及利亚
		'351': {label:"PT +351", pattern:/^(\+?351)?9[1236]\d{7}$/},//葡萄牙
		'358': {label:"FI +358", pattern:/^(\+?358|0)\s?(4(0|1|2|4|5)?|50)\s?(\d\s?){4,8}\d$/},//芬兰
		'381': {label:"RS +381", pattern:/^(\+3816|06)[- \d]{5,9}$/},//塞尔维亚
		'420': {label:"CZ +420", pattern:/^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/},//捷克
		'963': {label:"SY +963", pattern:/^(!?(\+?963)|0)?9\d{8}$/},//叙利亚
		'966': {label:"SA +966", pattern:/^(!?(\+?966)|0)?5\d{8}$/},//沙特
		'972': {label:"IL +972", pattern:/^(\+972|0)([23489]|5[0248]|77)[1-9]\d{6}$/},//以色列
	},
	//用户登录类型
	memberGroup:{
		DEFAULT:'tinyShop',
		PC : 'pc',
		IOS : 'ios',
		ANDROID : 'android',
		APP : 'app',
		H5 : 'h5',
		WECHAT : 'wechat',
		WECHAT_MP : 'wechatMp',
		ALI_MP : 'aliMp',
		QQ_MP : 'qqMp',
		BAIDU_MP : 'baiduMp',
		TOU_TIAO_MP : 'touTiaoMp',
		S_360_MP : '360Mp',
	},
	//订单类型
	orderType : {
		'combination':'组合套餐',
		'bargain':'砍价',
		'group_buy':'团购',
		'wholesale':'拼团',
		'presell_buy':'预售'
	},
	// 订单状态
	orderStatus: [
		{ key: 0, value: '待付款' },
		{ key: 1, value: '待发货' },
		{ key: 2, value: '已发货' },
		{ key: 3, value: '已收货' },
		{ key: 4, value: '已完成' },
		{ key: -1, value: '退货申请' },
		{ key: -2, value: '退货/退款/换货中' },
		{ key: -3, value: '退货/退款/换货完成' },
		{ key: -4, value: '已关闭' },
		{ key: -5, value: '撤销申请' },
		{ key: -101, value: '待成团' },
		{ key: 12, value: '部分发货' }
	],
	// 售后状态 
	refundStatus: [
		{ key: 1, value: '退货/退款/换货审核中' }, // 买家退款申请
		{ key: 2, value: '等待您退货' }, // 等待买家退货
		{ key: 3, value: '验收中' }, // 等待卖家确认收货
		{ key: 4, value: '退货/退款/换货中' }, // 等待卖家确认退款
		{ key: 5, value: '退货/退款成功' }, // 卖家同意退款
		{ key: 6, value: '待发货' }, // 等待卖家重新发货
		{ key: 7, value: '等待您确认收货' }, // 等待买家确认收货
		{ key: 8, value: '换货成功' }, // 买家确认收货
		{ key: -1, value: '不符合退货/退款要求' }, // 退款已拒绝
		{ key: -2, value: '退货/退款已关闭' }, // 退款已关闭
		{ key: -3, value: '申请不通过' }, // 退款申请不通过
	],
	//虚拟码
	orderProductVirtualTypeList: [
	    {
	      status: 0,
	      name: '未使用'
	    },
	    {
	      status: 1,
	      name: '已使用'
	    },
	    {
	      status: -1,
	      name: '已过期'
	    }
	],
	//分销中心
	distribution:{
		areaAgentShow:true,//是否显示区域代理功能
		statDetailShow:true,//分销订单统计是否以明细方式展现
	},
	profile:{
		tools:{
			wholesaleShow:true,//是否显示拼团
			liveShow:true,//是否显示直播
			bargainShow:true,//是否显示砍价
			virtualCodeShow:false,//是否显示虚拟码
		}
	},
	centerComponent: [
         {
            name: '头部',
            title: '头部',
            component: 'dz-my-head',
            container: false,
            icon: 'account-circle-fill',
            type: 'base',
            enableCustomTemplate: true,
            props: {
              isLogin: 1,
              loginBtnTop: 10,
              loginBtnWidth: 97,
              loginBtnHeight: 30,
              loginBtnColor: '#333',
              loginBtnBgColor: '#fff',
              loginBtnBold: 0,
              loginBtnFontSize: 14,
              height: 198,
              cover: '',
              colorType: '2',
              color: '#fff',
              bgColor: '#D51010',
              linearColor: {
                deg: 0,
                primaryColor: '#F04E2E',
                deputyColor: '#D51010',
                color: 'linear-gradient(0deg,#F04E2E 0%,#D51010 100%)',
              },
              isBottomRadius: 0,
              nicknameColor: '#fff',
              nicknameIsBold: 1,
              isSignin: 1,
			  signinMode: ['button'],
              sgninBgColor: '#fff',
              sgninColor: '#333',
              notifyType: 1,
              notifyColor: '#fff',
              isMemberLevel: 1,
              memberLevelType: 1,
              levelCaver:'',
              levelColor: '#fff',
              levelBgColor: '#FFD5CF',
              avatarSize: 60,
              isAvatarBorder: 1,
              avatarBorderColor: 'rgba(255,255,255,0.6)',
              avatarBorderSize: 3,
              badegColor: '#fff',
              badegBgColor: '#fa3534',
            },
          },
          {
            name: '统计菜单',
            title: '我的口袋',
            component: 'dz-statistics-meun',
            container: false,
            icon: 'pie-chart-2-fill',
            type: 'base',
            enableCustomTemplate: true,
            props: {
              pushTop: 90,
              paddingPushTop: 0,
              paddingTop: 0,
              paddingBottom: 0,
              leftRight: 10,
              isCellItem: 0,
              fontSize: 16,
              isBold: 1,
              arrow: 1,
              title: '我的口袋',
              value: '',
              col: 4,
              borderRadius: 10,
              borderShow: 0,
              margin: 0,
              bgColor: '',
              color: '#FFFFFF',
              numFontSize: 14,
              titleFontSize: 12,
              list: [
                {
                  title: '余额',
                  num: 99,
                  path: 'account',
                  key: '',
                  checked: true,
                },
                {
                  title: '积分',
                  num: 99,
                  path: 'integral',
                  key: '',
                  checked: true,
                },
                {
                  title: '优惠劵',
                  num: 99,
                  path: 'coupon',
                  key: '',
                  checked: true,
                },
                {
                  title: '购物车',
                  num: 99,
                  path: 'cart',
                  key: '',
                  checked: true,
                },
              ],
            },
          
          },
          {
            name: '我的订单',
            title: '我的订单',
            component: 'dz-my-order',
            container: false,
            icon: 'grid-fill',
            type: 'base',
            enableCustomTemplate: true,
            props: {
              pushTop: 10,
              badge: 1,
              menuPushTop: 0,
              paddingTop: 0,
              paddingBottom: 10,
              leftRight: 10,
              isCellItem: 1,
              fontSize: 16,
              isBold: 1,
              arrow: 1,
              title: '我的订单',
              value: '',
              col: 5,
              height: 7,
              borderRadius: 10,
              isPage: 0,
              mode: 'round',
              colNum: 2,
              isName: 1,
              widthHeight: 27,
              menuRadius: 10,
              bgColor: '#fff',
              dotColor: 'red',
              badegColor: '#fff',
              badegBgColor: '#fa3534',
              margin: 0,
              productLimit: 1,
              list: [
                {
                  title: '待付款',
                  cover: '',
                  activeMenuType: 'pageView',
                  pageView: 'orderIndex-2',
                  order_synthesize_key: '0',
                  checked: true,
                  icon: 'pay',
                },
                {
                  title: '待发货',
                  cover: '',
                  activeMenuType: 'pageView',
                  pageView: 'orderIndex-3',
                  order_synthesize_key: '1',
                  checked: true,
                  icon: 'deliver',
                },
                {
                  title: '待收货',
                  cover: '',
                  activeMenuType: 'pageView',
                  pageView: 'orderIndex-4',
                  order_synthesize_key: '2',
                  checked: true,
                  icon: 'send',
                },
                {
                  title: '评价',
                  cover: '',
                  activeMenuType: 'pageView',
                  pageView: 'evaluationIndex',
                  order_synthesize_key: '3',
                  checked: true,
                  icon: 'evaluate',
                },
                {
                  title: '售后',
                  cover: '',
                  activeMenuType: 'pageView',
                  pageView: 'refundList',
                  order_synthesize_key: '-1',
                  checked: true,
                  icon: 'refund',
                },
              ],
              radius: 0,
            },
          
          },
          {
            name: '分销',
            title: '分销',
            component: 'dz-distribution',
            container: false,
            type: 'base',
            icon: 'user-shared-2-fill',
            props: {
              pushTop: 0,
              mode: 'warehouse',
              paddingTop: 0,
              paddingBottom: 10,
              leftRight: 10,
              borderRadius: 10,
              isCellItem: 1,
              fontSize: 16,
              isBold: 1,
              arrow: 1,
              bgColor: '#fff',
              title: '经销商中心',
              value: '',
              cell: 4,
              store: [
                {
                  title: '累计佣金',
                  num: '9999.99',
                  key: 'accumulate_brokerage',
                  checked: true,
                },
                {
                  title: '可用佣金',
                  num: '9999.99',
                  key: 'user_brokerage',
                  checked: true,
                },
                {
                  title: '未结算佣金',
                  num: '9999.99',
                  key: 'frozen_brokerage',
                  checked: true,
                },
                {
                  title: '已提现',
                  num: '9999.99',
                  key: 'amount_drawn_brokerage',
                  checked: true,
                },
              ],
              warehouse: [
                {
                  title: '今日货款收益',
                  num: '9999.99',
                  key: 'date',
                  checked: true,
                },
                {
                  title: '本月货款收益',
                  num: '9999.99',
                  key: 'month',
                  checked: true,
                },
                {
                  title: '销货笔数',
                  num: '99',
                  key: 'sale_stock',
                  checked: true,
                },
                {
                  title: '累计货款收益',
                  num: '9999.99',
                  key: 'accumulate_brokerage',
                  checked: true,
                },
              ],
            },
         
          },
          {
            name: '分销',
            title: '分销',
            component: 'dz-distribution',
            container: false,
            type: 'base',
            icon: 'user-shared-2-fill',
            props: {
              pushTop: 0,
              mode: 'store',
              paddingTop: 0,
              paddingBottom: 10,
              leftRight: 10,
              borderRadius: 10,
              isCellItem: 1,
              fontSize: 16,
              isBold: 1,
              arrow: 1,
              bgColor: '#fff',
              title: '推广中心',
              value: '',
              cell: 4,
              store: [
                {
                  title: '累计佣金',
                  num: '9999.99',
                  key: 'accumulate_brokerage',
                  checked: true,
                },
                {
                  title: '可用佣金',
                  num: '9999.99',
                  key: 'user_brokerage',
                  checked: true,
                },
                {
                  title: '未结算佣金',
                  num: '9999.99',
                  key: 'frozen_brokerage',
                  checked: true,
                },
                {
                  title: '已提现',
                  num: '9999.99',
                  key: 'amount_drawn_brokerage',
                  checked: true,
                },
              ],
              warehouse: [
                {
                  title: '今日货款收益',
                  num: '9999.99',
                  key: 'date',
                  checked: true,
                },
                {
                  title: '本月货款收益',
                  num: '9999.99',
                  key: 'month',
                  checked: true,
                },
                {
                  title: '销货笔数',
                  num: '99',
                  key: 'sale_stock',
                  checked: true,
                },
                {
                  title: '累计货款收益',
                  num: '9999.99',
                  key: 'accumulate_brokerage',
                  checked: true,
                },
              ],
            },
          
          },
          {
            name: '我的足迹',
            title: '我的足迹',
            component: 'dz-foot-print',
            container: false,
            icon: 'footprint-fill',
            type: 'base',
            enableCustomTemplate: true,
            props: {
              pushTop: 0,
              paddingPushTop: 0,
              paddingTop: 0,
              paddingBottom: 10,
              topBottom: 0,
              leftRight: 10,
              borderRadius: 10,
              isCellItem: 1,
              fontSize: 16,
              isBold: 1,
              arrow: 1,
              bgColor: '#fff',
              title: '我的足迹',
              value: '',
              list: [
               
              ],
            },
           
          },
          {
            name: '卡片导航',
            title: '卡片导航',
            component: 'dz-card',
            container: false,
            icon: 'grid-fill',
            type: 'base',
            enableCustomTemplate: true,
            props: {
              pushTop: 0,
              badge: 1,
              menuPushTop: 10,
              paddingTop: 0,
              paddingBottom: 10,
              leftRight: 10,
              radius: 10,
              isCellItem: 1,
              fontSize: 16,
              isBold: 1,
              arrow: 0,
              title: '常用功能',
              value: '',
              col: 4,
              height: 7,
              borderRadius: 10,
              isPage: 0,
              mode: 'round',
              colNum: 2,
              isName: 1,
              widthHeight: 32,
              menuRadius: 10,
              bgColor: '#fff',
              dotColor: 'red',
              margin: 0,
              productLimit: 12,
              titleLink: {
                activeMenu: '',
                activeMenuType: '',
              },
              list: [
                {
                  active: 37,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '客服',
                  pageView: 'customerService',
                  pageName: '客服',
                  cover: '',
                  icon: 'xiaoheiqun',
                  color: '#FF6F8E',
                  id: 0,
                },
                {
                  active: 38,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '充值',
                  pageName: '充值',
                  pageView: 'recharge',
                  cover: '',
                  icon: 'rechargefill',
                  color: '#2EAFFF',
                  id: 1,
                },
                {
                  active: 7,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '余额',
                  pageName: '我的账户',
                  pageView: 'account',
                  cover: '',
                  icon: 'moneybagfill',
                  color: '#ffb928',
                  id: 2,
                },
               {
				   active: 10,
				   activeMenu: '1-1',
				   activeMenuType: 'pageView',
				   cate_title: '积分',
				   pageName: '我的积分',
				   pageView: 'integral',
				   cover: '',
				   icon: 'tubiao309',
				   color: '#FDC561',
				},
                {
                  active: 40,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '领劵中心',
                  pageName: '领劵中心',
                  pageView: 'couponList',
                  cover: '',
                  icon: 'ticket_money_fill',
                  color: '#ffb928',
                  id: 4,
                },
                {
                  active: 9,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '我的收藏',
                  pageName: '我的收藏',
                  pageView: 'collection',
                  cover: '',
                  icon: 'star2',
                  color: '#FF779F',
                  id: 5,
                },
                {
                  active: 9,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '地址管理',
                  pageName: '收货地址',
                  pageView: 'address',
                  cover: '',
                  icon: 'locationfill',
                  color: '#2EAFFF',
                  id: 6,
                },
                {
                  active: 19,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '积分签到',
                  pageName: '每日签到',
                  pageView: 'signIn',
                  cover: '',
                  icon: 'tagfill',
                  color: '#fc0e7a',
                  id: 7,
                },
                {
                  active: 36,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '热线',
                  pageName: '热线',
                  pageView: 'hotline',
                  cover: '',
                  icon: 'servicefill',
                  color: '#42E38D',
                  id: 8,
                },
                {
                  active: 28,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '区域申请',
                  pageName: '区域代理申请',
                  pageView: 'distributionApply',
                  cover: '',
                  icon: 'round_shop_fill',
                  color: '#FDC561',
                  id: 9,
                },
                {
                  active: 41,
                  activeMenu: '1-1',
                  activeMenuType: 'pageView',
                  cate_title: '设置',
                  pageName: '设置',
                  pageView: 'set',
                  cover: '',
                  icon: 'shezhi-tianchong',
                  color: '#dedfe6',
                  id: 10,
                },
              ],
            },
          
          },
         
    ],
};
