/* 高性能自定义tabbar配置
在pages.json中正常定义tabbar逻辑和字段，只需配置tabBar字段list中的pagePath属性即可
在各个tabbar页面引入dz-tabbar组件，组件会默认自动通过uni.hideTabBar()隐藏系统tabbar
通过vuex引用同一份tabbar组件的list参数，这样可以做到修改某一个页面的dz-tabbar数据，其他页面的dz-tabbar也能同步更新
组件内部会自动处理各种跳转的逻辑，同时需要注意以下两点：
要在list参数中配置pagePath路径，此路径为pages.json中定义的tabbar字段的路径
此种方式，无需通过v-model绑定活动项，内部会自动进行判断和跳转

// 非凸起按钮未激活的图标，可以是内置图标名或自定义扩展图标库的图标
// 或者png图标的【绝对路径】，建议尺寸为80px * 80px
// 如果是中间凸起的按钮，只能使用图片，且建议为120px * 120px的png图片
iconPath: "home",
// 激活(选中)的图标，同上
selectedIconPath: "home-fill",
// 显示的提示文字
text: '首页',
// 红色角标显示的数字，如果需要移除角标，配置此参数为0即可
count: 2,
// 如果配置此值为true，那么角标将会以红点的形式显示
isDot: true,
// 如果是凸起按钮项，需配置此值为true
midButton: false,
// 点击某一个item时，跳转的路径，此路径必须是pagees.json中tabBar字段中定义的路径
pagePath: '', */

var tabbarList = [{
	iconPath: "home",
	selectedIconPath: "homefill",
	text: '首页',
	count: 0,
	isDot: false,
	midButton: false,
	pagePath: '/pages/main/index/index'
},
{
	iconPath: "category",
	selectedIconPath: "categoryfill",
	text: '分类',
	count: 0,
	isDot: false,
	midButton: false,
	pagePath: '/pages/main/category/category'
},
{
	iconPath: "discover",
	selectedIconPath: "discoverfill",
	text: '商学院',
	count: 0,
	isDot: false,
	midButton: false,
	pagePath: '/pages/main/discover/discover'
},
{
	iconPath: "cart",
	selectedIconPath: "cartfill",
	text: '购物车',
	count: 0,
	isDot: false,
	midButton: false,
	pagePath: '/pages/main/cart/cart'
},
{
	iconPath: "my",
	selectedIconPath: "myfill",
	text: '我的',
	count: 0,
	isDot: false,
	midButton: false,
	pagePath: '/pages/main/profile/profile'
}
]

export default {
	tabbarList
}
