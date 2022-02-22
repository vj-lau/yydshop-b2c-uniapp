<template>
	<view>
		<!-- navbar -->
		<dz-navbar-immersive
			splitLine
			:isCustom="true"
			@init="initNavigation"
			@change="opacityChange"
			scrollRatio="0.3"
			:scrollTop="scrollTop"
			:title="barTitle"
			backgroundColor="#fff"
			:color="theme.dzMainColor"
		>
			<view class="dz-navbar-inner" :style="[navbarInnerStyle]">
				<view class="dz-navbar-content-title" :style="[titleStyle]">
					<view class="dz-title dz-line-1">{{ barTitle }}</view>
				</view>
				<!-- #ifndef MP -->
				<view class="dz-navbar-right" v-if="hasLogin">
					<view class="message-box right-item" @tap="toPage('notifyIndex')">
						<dz-icon name="message" size="48" :color="isColor ? navbarIconColor.notifyColor : theme.dzMainColor"></dz-icon>
						<dz-badge :count="notifyUnRead" :offset="[-10, -10]" :color="navbarIconColor.badegColor" :bgColor="navbarIconColor.badegBgColor"></dz-badge>
					</view>
				</view>
				<!-- #endif -->
			</view>
		</dz-navbar-immersive>
		<view class="dz-relative">
			<view v-for="(item, index) in componentList" :key="index">
				<view v-if="item.component == 'dz-my-head'" ref="profileHead" :style="{ width: '100%', overflow: 'hidden' }">
					<shop-my-head
						:config="item"
						:userInfo="userInfo"
						:hasLogin="hasLogin"
						:notifyUnRead="notifyUnRead"
						:isPromoterWarehouse="isPromoterWarehouse"
						:isPromoter="isPromoter"
						:signinToday="signinToday"
						:signinStatus="signinStatus"
						ref="myHeadRef"
						@click="toPage"
					></shop-my-head>
				</view>
				<!-- 统计菜单 -->
				<view v-if="item.component == 'dz-statistics-meun' && hasLogin" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<shop-statistics-meun :config="item" :userInfo="userInfo" :hasLogin="hasLogin" @click="toPage"></shop-statistics-meun>
				</view>
				<!-- 我的订单 -->
				<view v-if="item.component == 'dz-my-order'" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<shop-my-order :config="item" :userInfo="userInfo" :hasLogin="hasLogin"></shop-my-order>
				</view>
				<!-- 卡片菜单 -->
				<view v-if="item.component == 'dz-card'" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<shop-card-menu
						:config="item"
						:customerServiceUnread="customerServiceUnread"
						:customerService="customerService"
						:sessionFrom="sessionFrom"
						@click="gridAdvClick(index, $event)"
						@cellClick="sectionClick"
					></shop-card-menu>
				</view>
				<!-- 分销 -->
				<view
					v-if="
						hasLogin && item.component == 'dz-distribution' && ((isPromoterWarehouse && item.props.mode == 'warehouse') || (isPromoter && item.props.mode == 'store'))
					"
					:style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }"
				>
					<shop-distribution :config="item" :userInfo="userInfo" :userPromoter="userPromoter" :estimateStat="estimateStat" @click="toPage"></shop-distribution>
				</view>
				<!-- 我的足迹 -->
				<view v-if="item.component == 'dz-foot-print' && hasLogin" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<shop-foot-print :config="item" :list="footPrintList" @click="toPage"></shop-foot-print>
				</view>
				<!-- 轮播图 -->
				<view v-if="item.component == 'dz-swiper'" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
					<view :style="{ padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx` }">
						<dz-swiper
							name="cover"
							:list="item.props.list"
							:border-radius="parseInt(item.props.borderRadius) * 2"
							:mode="item.props.mode"
							:height="parseInt(item.props.height) * 2"
							:indicator-pos="item.props.indicatorPos"
							:effect3d="item.props.effect3d == 1 ? true : false"
							:title="item.props.title == 1 ? true : false"
							:bgColor="item.props.bgColor"
							@click="swiperClick(index, $event)"
						></dz-swiper>
					</view>
				</view>
				<!-- 广告 -->
				<view
					v-if="item.component == 'dz-banner'"
					class="dz-relative dz-banner"
					:style="{
						marginTop: `-${parseInt(item.props.pushTop) * 2}rpx`,
						padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx`
					}"
				>
					<view
						:style="{
							overflow: 'hidden',
							height: parseInt(item.props.height) * 2 + 'rpx'
						}"
					>
						<dz-image
							:src="item.props.cover"
							:borderRadius="parseInt(item.props.radius) * 2"
							:height="parseInt(item.props.height) * 2"
							@click="banner(item.props.link)"
						></dz-image>
						<block v-for="(area, areaIndex) in item.props.area" :key="areaIndex">
							<view
								class="dz-absolute"
								:style="{
									boxSizing: 'border-box',
									width: parseInt(area.width) * 2 + 'rpx',
									height: parseInt(area.height) * 2 + 'rpx',
									top: parseInt(area.top) * 2 + 'rpx',
									left: parseInt(area.left) * 2 + 'rpx'
								}"
								@tap.stop="banner(item.props.area[areaIndex].link)"
							>
								<dz-image v-if="area.cover" :src="area.cover" :width="parseInt(area.width) * 2" :height="parseInt(area.height) * 2"></dz-image>
							</view>
						</block>
					</view>
				</view>
				<!-- 标题 -->
				<view v-if="item.component == 'dz-title'">
					<dz-title
						:title="item.props.title"
						:mode="item.props.mode"
						:bar-color="item.props.barColor"
						:bar-bokeh-color="item.props.barBokehColor"
						:nameLeft="item.props.coverLeft"
						:nameRight="item.props.coverRight"
						:font-size="parseInt(item.props.fontSize) * 2"
						:barWidth="parseInt(item.props.barWidth) * 2"
						:barHeight="parseInt(item.props.barHeight) * 2"
						:title-color="item.props.titleColor"
						:tip-config="item.props.tipConfig"
						:icon-width="parseInt(item.props.iconWidth) * 2"
						:icon-height="parseInt(item.props.iconHeight) * 2"
					></dz-title>
				</view>
				<!-- 悬浮按钮 -->
				<view v-if="item.component == 'dz-fab'">
					<dz-fab
						:mode="item.props.mode"
						:bottom="parseInt(item.props.bottom) * 2"
						:right="parseInt(item.props.right) * 2"
						:width="parseInt(item.props.width) * 2"
						:height="parseInt(item.props.height) * 2"
						:radius="parseInt(item.props.radius) * 2"
						:btnRadius="parseInt(item.props.btnRadius) * 2"
						:btnList="item.props.list"
						:bgColor="item.props.bgColor"
						:color="item.props.color"
						:maskClosable="false"
						@click="fabClick($event, index)"
					></dz-fab>
				</view>
				<!-- 商品列表 -->
				<view v-if="item.component == 'dz-product-list'">
					<block v-if="item.props.isLoading == 2 || (item.props.isLoading == 1 && index == componentList.length - 1 && productConfig.loadingType == 'default')"></block>
					<block v-if="item.props.isList == 1 || item.props.isList == 2">
						<shop-product-list
							:list="index == componentList.length - 1 && item.props.isLoading == 1 ? productList : item.data"
							:theme="theme"
							:isList="item.props.isList == 1 ? true : false"
							:radius="parseInt(item.props.radius) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:cart="item.props.cart"
							:market-price-show="item.props.marketPriceShow"
						></shop-product-list>
					</block>
					<block v-if="item.props.isList == 3">
						<shop-product-max
							:list="index == componentList.length - 1 && item.props.isLoading == 1 ? productList : item.data"
							:theme="theme"
							:defaultList="item.props.list"
							:dataSource="item.props.dataSource"
							:radius="parseInt(item.props.radius) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:max-height="parseInt(item.props.maxHeight ? item.props.maxHeight : 160) * 2"
							:cart="item.props.cart"
							:market-price-show="item.props.marketPriceShow"
						></shop-product-max>
					</block>
					<block v-if="item.props.isList == 4">
						<shop-product-three
							:list="index == componentList.length - 1 && item.props.isLoading == 1 ? productList : item.data"
							:theme="theme"
							:defaultList="item.props.list"
							:dataSource="item.props.dataSource"
							:radius="parseInt(item.props.radius) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:market-price-show="item.props.marketPriceShow"
							:clearance="parseInt(item.props.clearance) * 2"
						></shop-product-three>
					</block>
					<block v-if="item.props.isLoading == 1 && index == componentList.length - 1">
						<dz-empty v-if="loadingStatus == 'nodata'" margin-top="60" :src="empty" iconSize="360"></dz-empty>
						<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
					</block>
				</view>
				<view v-if="item.component == 'dz-gap'"><dz-gap :height="parseInt(item.props.height) * 2" :bg-color="item.props.bgColor"></dz-gap></view>
				<!-- 公告 -->
				<view
					v-if="item.component == 'dz-notice-bar' && noticeShow"
					:style="{
						marginTop: `-${parseInt(item.props.pushTop) * 2}rpx`,
						position: 'relative',
						padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx`
					}"
				>
					<dz-notice-bar
						:list="noticeListInfo(item.props.list)"
						:mode="item.props.mode"
						:bg-color="item.props.bgColor"
						duration="5000"
						:volumeIcon="item.props.volumeIcon"
						:moreIcon="item.props.rightType == 'arrowRight' ? true : false"
						:closeIcon="item.props.rightType == 'close' ? true : false"
						:title="item.props.title"
						:title-style="item.props.titleStyle"
						:cover="item.props.cover"
						:widthHeight="parseInt(item.props.coverSize) * 2"
						:iconColor="item.props.iconColor"
						:rightColor="item.props.rightColor"
						:color="item.props.color"
						:borderRadius="parseInt(item.props.borderRadius) * 2"
						@click="noticeItmeClick(index, $event)"
						@getMore="noticeClick"
						@close="closeClick"
					></dz-notice-bar>
				</view>
			</view>
		</view>
		<!-- 应用维护 -->
		<dz-modal
			v-model="closeSite"
			width="80%"
			:show-confirm-button="false"
			:show-cancel-button="false"
			:title="language.application.siteCloseTitle"
			:confirm-color="theme.dzBaseColor"
		>
			<view class="dz-p-30 dz-font-sm">{{ closeSiteExplain }}</view>
		</dz-modal>
		<dz-modal
			v-model="bindMoible"
			:title="language.application.modalTitle"
			content="请您先绑定手机号再进行其它操作"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			cancel-text="暂不绑定"
			@confirm="toPage('bindMobile')"
		></dz-modal>
		<!-- tabbar -->
		<dz-tabbar
			v-if="tabbarList.props && tabbarList.props.dataSource != 'default'"
			:list="tabbarList.props.list.slice(0, tabbarList.props.num)"
			:bgColor="tabbarList.props.bgColor"
			:inactiveColor="tabbarList.props.inactiveColor"
			:activeColor="tabbarList.props.activeColor || theme.dzBaseColor"
			:mid-button="(parseInt(tabbarList.props.isButton) === 1 ? true : false) || false"
			:fontSize="parseInt(tabbarList.props.fontSize ? tabbarList.props.fontSize : 12) * 2"
		></dz-tabbar>
		<dz-tabbar v-else :list="defaultTabbarList" :activeColor="theme.dzBaseColor"></dz-tabbar>
		<!-- 签到积分提示 -->
		<dz-popup v-model="isPopupShow" mode="center" border-radius="30" :closeable="true" width="80%" :custom-style="{ overflow: 'visible' }">
			<view class="popup-box">
				<dz-icon name="tubiao309" size="90" :color="theme.dzBaseColor"></dz-icon>
				<view class="title">每日签到拿积分购好礼</view>
				<dz-button
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, margin: '30rpx 0' }"
					hover-class="none"
					shape="circle"
					@click="toPage('signIn')"
				>
					知道了
				</dz-button>
				<view class="tip">连续签到,可获得更多奖励哦!</view>
			</view>
		</dz-popup>
		<dz-toast ref="dzToast"></dz-toast>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" zIndex="981" @click="pageLoadingClick"></dz-page-loading>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
import $mAssetsConfig from '@/core/config/assetsConfig.js';
import tabbarConfig from '@/core/config/tabbarConfig';

import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			barTitle: '',
			theme: this.$api.theme,
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			dataConfig: this.$api.dataConfig,
			memberLevel: $mAssetsConfig.memberLevel,
			bindMoible: false,
			closeSite: false,
			closeSiteExplain: '',
			top: 0,
			opacity: 0,
			scrollTop: 0,
			titleWidth: 250,
			missingFace: this.$api.assetsConfig.missingFace,
			footPrintList: [],
			isColor: true,
			notifyUnRead: 0,
			hotLine: '',
			frozenCommissionModalShow: false,
			lastInitTime: 0,
			customerService: false,
			sessionFrom: '',
			isPopupShow: false,
			defaultTabbarList: tabbarConfig.tabbarList,
			estimateStat: [],
			componentList: [],
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			navbarIconColor: {
				notifyColor: '#fff',
				badegColor: '#fff',
				badegBgColor: '#fa3534'
			},
			productConfig: {},
			page: 1,
			productList: [],
			loadingStatus: 'loading',
			empty: this.$api.assetsConfig.empty,
			signinToday: false,
			signinStatus: false,
			signinMode: [],
			isLogin: false
		};
	},
	computed: {
		...mapState(['tabbarList', 'userInfo', 'userPromoter', 'customerServiceUnread', 'profileNoticeTime', 'signinTime']),
		...mapGetters(['hasLogin']),
		// 导航栏内部盒子的样式
		navbarInnerStyle() {
			let style = {};
			// 导航栏宽度，如果在小程序下，导航栏宽度为胶囊的左边到屏幕左边的距离
			style.height = this.navbarHeight + 'px';
			// // 如果是各家小程序，导航栏内部的宽度需要减少右边胶囊的宽度
			// #ifdef MP
			let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
			style.marginRight = rightButtonWidth + 'px';
			// #endif
			return style;
		},
		// 导航中间的标题的样式
		titleStyle() {
			let style = {};
			// #ifndef MP
			style.left = (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + 'px';
			style.right = (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + 'px';
			// #endif
			// #ifdef MP
			// 此处是为了让标题显示区域即使在小程序有右侧胶囊的情况下也能处于屏幕的中间，是通过绝对定位实现的
			let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
			style.left = (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + 'px';
			style.right = rightButtonWidth - (systemInfo.windowWidth - uni.upx2px(this.titleWidth)) / 2 + rightButtonWidth + 'px';
			// #endif
			style.width = uni.upx2px(this.titleWidth) + 'px';
			style.opacity = this.opacity;
			return style;
		},
		// 转换字符数值为真正的数值
		navbarHeight() {
			// #ifdef APP-PLUS || H5
			return this.height ? this.height : 44;
			// #endif
			// #ifdef MP
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
			// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
			let height = systemInfo.platform == 'ios' ? 44 : 48;
			return this.height ? this.height : height;
			// #endif
		},
		// 是否(裂变/区域/店铺)分销
		isPromoter() {
			let isRegional = false;
			if (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterRegional && this.userInfo.promoter.promoterRegional.length) {
				isRegional = this.userInfo.promoter.promoterRegional.some(item => item.state == 1);
			}
			return (
				this.userInfo &&
				this.userInfo.promoter &&
				((this.userInfo.promoter.promoterFission && this.userInfo.promoter.promoterFission.state == 1 && this.userInfo.promoter_fission_is_open == 1) ||
					(this.userInfo.promoter.promoterRegional && this.userInfo.promoter_regional_is_open == 1 && isRegional && this.userInfo.promoter.promoterRegional.length > 0) ||
					(this.userInfo.promoter.promoterStore &&
						this.userInfo.promoter.promoterStore.state == 1 &&
						this.userInfo.promoter_store_is_open == 1 &&
						this.userInfo.promoter.promoterStore.level_id > 0))
			);
		},
		// 是否店铺分销
		isPromoterStore() {
			return (
				this.userInfo &&
				this.userInfo.promoter &&
				this.userInfo.promoter_store_is_open == 1 &&
				this.userInfo.promoter.promoterStore &&
				this.userInfo.promoter.promoterStore.state == 1 &&
				this.userInfo.promoter.promoterStore.level_id > 0
			);
		},
		// 是否云仓分销
		isPromoterWarehouse() {
			return (
				this.userInfo.promoter &&
				this.userInfo.promoter_warehouse_is_open == 1 &&
				this.userInfo.promoter.promoterWarehouse &&
				this.userInfo.promoter.promoterWarehouse.state == 1 &&
				this.userInfo.promoter.promoterWarehouse.level_id > 0
			);
		},
		noticeShow() {
			if (!this.componentList.length) return false;
			let status = this.componentList.some(item => item.component == 'dz-notice-bar');
			if (!status) return false;
			let tiem = new Date().getTime() / 1000;
			if (this.profileNoticeTime && tiem < this.profileNoticeTime) {
				return false;
			} else {
				return true;
			}
		}
	},
	async onLoad(e) {
		await this.$onLaunched;
		let pages = getCurrentPages();
		this.barTitle = this.$api.language.profile.titleProfile;
		if (this.tabbarList.props && this.tabbarList.props.dataSource != 'default') {
			const list = this.tabbarList.props.list;
			const route = list.filter(item => item.pagePath == `/${pages[pages.length - 1].route}`);
			this.barTitle = route[0].text;
		}
		uni.setNavigationBarTitle({ title: this.barTitle });
		uni.$on('themeChange', () => {
			this.theme = this.$api.theme;
			this.getInfoData();
		});
		this.closeSite = parseInt(this.$api.shopSetting.is_open_site) !== 1;
		this.closeSiteExplain = this.$api.shopSetting.close_site_explain;
		uni.$on('sgninChange', data => {
			this.signinToday = false;
			if (data && data.type == 'update') {
				this.signinStatus = true;
			}
			if (data && data.type == 'logout') {
				this.signinStatus = false;
				this.$api.store.commit('setSigninTime', 0);
			}
			if (!data) {
				this.isLogin = true;
			}
			if (this.hasLogin && !data) {
				this.getInfoData();
			}
		});
		this.getInfoData();
	},
	onUnload() {
		this.$off(['themeChange', 'sgninChange']);
	},
	async onShow() {
		if (!this.hasLogin) {
			this.footPrintList = [];
			return;
		}
		await this.$onLaunched;
		this.theme = this.$api.theme;
		this.shopSetting = this.$api.shopSetting;
		this.initData();
		setTimeout(() => {
			if (this.$refs.myHeadRef && this.signinToday && !this.isLogin) {
				this.$refs.myHeadRef[0].initAnimation();
			}
		}, 40);
	},
	onHide() {
		this.isLogin = false;
	},
	onPullDownRefresh() {
		if (!this.hasLogin) return uni.stopPullDownRefresh();
		this.page = 1;
		this.productList.length = 0;
		this.initData();
		this.getInfoData();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nodata' || this.loadingStatus == 'nomore' || JSON.stringify(this.productConfig) == '{}') return;
		this.page++;
		if (this.productConfig.loadingType == 'default') {
			this.getProductList();
			return;
		}
		this.getGuessYouLikeList();
	},
	onReady() {
		//H5刷新后，scrollTop位置停留在上次位置，这时候没有触发onPageScroll事件，所以需要进行初始化
		// #ifdef H5
		if (this.$refs.profileHead) {
			let top = this.$refs.profileHead.$el.getBoundingClientRect().top;
			this.scrollTop = Math.abs(top);
		}
		// #endif
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		async getGuessYouLikeList() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.guessYouLikeList, {
					params: {
						page: this.page,
						page_size: this.productConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.productConfig.pageSize ? 'loadmore' : 'nomore';
					this.productList = [...this.productList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		async getProductList() {
			this.loadingStatus = 'loading';
			const params = {};
			if (this.productConfig.cate_id) {
				params.cate_id = this.productConfig.cate_id;
			}
			if (this.productConfig.is_new) {
				params.is_new = this.productConfig.is_new;
			}
			if (this.productConfig.is_recommend) {
				params.is_recommend = this.productConfig.is_recommend;
			}
			if (this.productConfig.is_hot) {
				params.is_hot = this.productConfig.is_hot;
			}
			await this.$api.http
				.get(this.$api.apiShop.productList, {
					params: {
						...params,
						page: this.page,
						page_size: this.productConfig.pageSize
					}
				})
				.then(async res => {
					this.loadingStatus = res.data.length == this.productConfig.pageSize ? 'loadmore' : 'nomore';
					this.productList = [...this.productList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		pageLoadingClick() {
			this.getInfoData();
		},
		async getInfoData() {
			this.pageLoadingShow = true;
			this.$api.http
				.get(this.$api.apiShop.customCenter)
				.then(res => {
					this.componentList = this.$api.dataConfig.centerComponent;

					if (res.data.decorate.component.length) {
						this.componentList = res.data.decorate.component;

						if (this.componentList[this.componentList.length - 1].component == 'dz-product-list') {
							let config = this.componentList[this.componentList.length - 1];
							if (config.props.isLoading == 1) {
								this.productConfig = config.props.productForm;

								if (this.productConfig.loadingType == 'default') {
									this.getProductList();
								} else {
									this.getGuessYouLikeList();
								}
							}
						}
					} else {
						this.componentList.forEach(item => {
							if (item.component == 'dz-my-head') {
								item.props.linearColor.color = `linear-gradient(30deg, ${this.theme.dzBaseDark}, ${this.theme.dzBaseColor})`;
								item.props.color = this.theme.dzBaseFontColor;
								item.props.levelColor = this.theme.dzBaseFontColor;
								item.props.levelBgColor = this.theme.dzBaseDisabled;
								item.props.levelCaver = this.memberLevel;
								this.navbarIconColor.notifyColor = this.theme.dzBaseFontColor;
							}
						});
					}
					let component = this.componentList.find(item => item.component == 'dz-my-head');
					if (component) {
						this.signinMode = component.props.signinMode;
						if (this.signinMode.length && component.props.isSignin == 1) {
							let isOpenSignin = parseInt(this.$api.shopSetting.signin_is_open) == 1;
							if (isOpenSignin && this.hasLogin && (this.userInfo.mobile != '' || parseInt(this.$api.shopSetting.third_party_register) == 1)) {
								this.getSigninInfo();
							}
						}
					}
					this.customTitle = res.data.decorate.title;
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});

			uni.stopPullDownRefresh();
		},
		async getSigninInfo() {
			let time = new Date().getTime() / 1000;
			let timeDay = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000;
			await this.$api.http.get(this.$api.apiShop.signinInfo).then(res => {
				this.signinToday = res.data.signin_today == 1 ? false : true;
				if (this.$refs.myHeadRef && this.signinToday) {
					this.$refs.myHeadRef[0].initAnimation();
				}
				if (!this.signinMode.includes('popup')) return;
				if (this.signinTime && time < this.signinTime) {
					this.isPopupShow = false;
				} else {
					if (this.signinToday) {
						this.isPopupShow = true;
						this.$api.store.commit('setSigninTime', timeDay);
					}
				}
			});
		},
		async initData() {
			await this.getMemberInfo();
			await this.getNotifyUnRead();
			await this.getFootprintList();
			await this.initCustomerService();
			await this.$api.shop.getCustomerServiceUnread();
		},
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
				if (res.data.promoter && res.data.promoter.promoterWarehouse) {
					this.getEstimateStat();
				}
				//如果没有手机号，且强制绑定手机号
				if (res.data.mobile == '' && parseInt(this.$api.shopSetting.third_party_register) != 1) {
					this.bindMoible = true;
				}
			});
			uni.stopPullDownRefresh();
		},
		getEstimateStat() {
			this.$api.http.get(this.$api.apiDistribution.estimateStat).then(res => {
				this.estimateStat = res.data.estimateStat;
			});
		},
		async getFootprintList() {
			let now = Date.parse(new Date()) / 1000;
			if (now - this.lastInitTime > 60) {
				this.lastInitTime = now;
				await this.$api.http.get(this.$api.apiShop.footPrintList).then(res => {
					this.footPrintList = res.data;
				});
			}
		},
		async getNotifyUnRead() {
			//通知消息
			await this.$api.http.get(this.$api.apiShop.notifyUnRead).then(res => {
				this.notifyUnRead = res.data.count;
			});
		},
		noticeListInfo(val) {
			if (!val.length) return [];
			let list = [];
			val.forEach(item => {
				list.push(item.title);
			});
			return list;
		},
		closeClick() {
			let timeDay = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000;
			this.$api.store.commit('setProfileNoticeTime', timeDay);
		},
		//初始化客服
		initCustomerService() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			if (serviceType > 0) {
				if (this.$api.store.getters.hasLogin) {
					this.sessionFrom =
						'{"source":"用户中心","mobile":"' +
						this.$api.store.state.userInfo.mobile +
						'","sex":"' +
						this.$api.store.state.userInfo.gender +
						'","nickName":"' +
						this.$api.store.state.userInfo.nickname +
						'","avatarUrl":"' +
						this.$api.store.state.userInfo.head_portrait +
						'"}';
				}
				//2为小程序原生客服，3为芝麻小客服
				if (serviceType === 2) {
					// #ifdef MP-WEIXIN
					this.customerService = true;
					// #endif
				}
				if (serviceType === 3) {
					this.customerService = true;
				}
			}
		},
		initNavigation(e) {
			this.opacity = e.opacity;
			this.top = e.top;
		},
		opacityChange(e) {
			this.opacity = e.opacity;
			this.isColor = parseInt(this.opacity) == 1 ? false : true;
		},
		toPage(url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url]
			});
			if (url == 'signIn') {
				this.isPopupShow = false;
			}
		},
		fabClick(itemIndex, index) {
			const item = this.componentList[index].props.list[itemIndex].link;
			this.$api.shop.linkJump(item);
		},
		// 轮播图
		swiperClick(index, itemIndex) {
			const item = this.componentList[index].props.list[itemIndex];
			this.$api.shop.linkJump(item);
		},
		// 卡片导航
		gridAdvClick(index, itemIndex) {
			const item = this.componentList[index].props.list[itemIndex];
			// 客服
			if (item.activeMenuType && item.pageView == 'customerService') {
				this.serviceTap();
				return;
			}
			// 热线
			if (item.activeMenuType && item.pageView == 'hotline') {
				this.phone();
				return;
			}
			if (item.activeMenuType && item.pageView == 'distributionApply' && this.userInfo && this.userInfo.promoter_regional_is_open != 1) {
				return this.$refs.dzToast.show({
					title: `未开启${item.cate_title ? item.cate_title : '区域申请'}，请联系工作人员`,
					type: 'warning'
				});
			}
			this.$api.shop.linkJump(item);
		},
		sectionClick(item) {
			this.$api.shop.linkJump(item);
		},
		// 更多公告
		noticeClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.notice
			});
		},
		// 公告详情
		noticeItmeClick(index, itemIndex) {
			const item = this.componentList[index].props.list[itemIndex];
			if (!item.id) return;
			this.$api.router.push({
				route: this.$api.routesConfig.noticeDetail,
				query: {
					id: item.id
				}
			});
		},
		// 广告
		banner(val) {
			this.$api.shop.linkJump(val);
		},
		phone() {
			if (this.hotLine) {
				uni.makePhoneCall({
					phoneNumber: this.hotLine
				});
				return;
			}
			this.$api.http
				.get(this.$api.apiShop.configList, {
					params: {
						field: 'store_hot_line'
					}
				})
				.then(res => {
					this.hotLine = res.data.store_hot_line;
					if (!this.hotLine)
						return this.$refs.dzToast.show({
							title: this.$api.language.profile.hotlineEmpty,
							type: 'warning'
						});
					uni.makePhoneCall({
						phoneNumber: res.data.store_hot_line
					});
				});
		},
		//客服
		serviceTap() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			if (serviceType === 2) {
				//微信原生小程序客服
				// #ifndef MP-WEIXIN
				this.$refs.dzToast.show({
					title: '请在小程序中打开客服',
					type: 'warning'
				});
				// #endif
			} else if (serviceType === 3) {
				//芝麻小客服
				// #ifndef MP-WEIXIN
				let customerServiceUrl = this.$api.shopSetting.app_service_zmxkf_url;
				if (!customerServiceUrl) {
					this.$refs.dzToast.show({
						title: '客服暂未配置',
						type: 'warning'
					});
					return;
				}
				if (this.$api.store.getters.hasLogin) {
					let params = {
						source: '用户中心',
						openid: this.$api.store.state.userInfo.id,
						mobile: this.$api.store.state.userInfo.mobile,
						sex: this.$api.store.state.userInfo.gender,
						nickName: encodeURIComponent(this.$api.store.state.userInfo.nickname),
						avatarUrl: encodeURIComponent(this.$api.store.state.userInfo.head_portrait)
					};
					customerServiceUrl = this.$api.helper.objParseUrlAndParam(customerServiceUrl, params);

					this.$api.shop.clearCustomerServiceRead();

					this.$api.router.push({
						route: this.$api.routesConfig.webview,
						query: {
							url: this.$api.helper.strEncode(customerServiceUrl)
						}
					});
				} else {
					//要求先登录
					this.$api.router.push({
						route: this.$api.routesConfig.login
					});
				}
				// #endif
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-navbar-inner {
	height: 44px;
	display: flex;
	justify-content: space-between;
	position: relative;
	align-items: center;
}

.dz-navbar-content-title {
	display: flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	position: absolute;
	left: 0;
	right: 0;
	height: 60rpx;
	text-align: center;
	flex-shrink: 0;
}

.dz-title {
	line-height: 60rpx;
	font-size: 32rpx;
	flex: 1;
	color: $dz-main-color;
}

.dz-navbar-right {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.right-item {
	margin: 0 32rpx;
	position: relative;
	color: $dz-main-color;
	display: flex;
}

.dz-banner {
	image{
		display: inline-block;
	}
}

// 积分签到弹窗
.popup-box {
	padding: 40rpx;
	text-align: center;
	.title {
		margin-top: 20rpx;
		color: $dz-main-color;
		font-size: 36rpx;
	}
	.tip {
		font-size: 24rpx;
		color: $dz-tips-color;
	}
}
</style>
