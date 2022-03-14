<template>
	<view
		class="custom-page"
		:style="{
			background: config.pageColorMode == 'default' ? config.pageColor : config.pageLinearColor && config.pageLinearColor.color ? config.pageLinearColor.color : '#f3f4f6'
		}"
	>
		<dz-navbar-immersive
			v-if="!pageType && config.isNavColor == 1"
			splitLine
			scrollRatio="0.3"
			:isCustom="true"
			@change="opacityChange"
			:scrollTop="scrollTop"
			backgroundColor="#fff"
			:style="[navbarStyle]"
		>
			<dz-navbar :title="customTitle"></dz-navbar>
		</dz-navbar-immersive>
		<view v-if="authsType" class="dz-flex dz-flex-column dz-row-center" style="height: 100%;margin-top: -20%;">
			<view class="dz-m-b-10"><dz-icon :name="auths[authsType].icon" :size="auths[authsType].size" color="#dedfe6"></dz-icon></view>
			<text v-if="authsType == 'auths'">{{ auths[authsType].tip }}</text>
			<view class="dz-m-t-30">
				<dz-button
					size="medium"
					hoverClass="none"
					:border="false"
					shape="circle"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
					@click="toBack(authsType)"
				>
					{{ auths[authsType].btnText }}
				</dz-button>
			</view>
			<view v-if="authsType == 'login'" class="dz-m-t-20 dz-font-24 dz-color-9" @tap="toBack('auths')">{{ auths[authsType].tip }}</view>
		</view>
		<view
			v-else
			class="dz-relative"
			:style="{
				background: config.pageColorMode == 'default' ? config.pageColor : config.pageLinearColor && config.pageLinearColor.color ? config.pageLinearColor.color : '#f3f4f6'
			}"
		>
			<view v-if="!pageType" class="dz-relative" style="z-index: 991;">
				<dz-navbar
					:title="customTitle"
					:is-fixed="config.isNavColor == 0"
					:background="{ background: config.isNavColor == 0 ? '#fff' : config.navBgColor }"
					:border-bottom="false"
					:back-icon-color="config.isNavColor == 0 ? '#303133' : config.navColor"
					:title-color="config.isNavColor == 0 ? '#303133' : config.navColor"
				></dz-navbar>
			</view>
			<view v-if="config.backgroundPicture" class="custom-bg-img">
				<image
					:src="config.backgroundPicture"
					:style="{ width: '100%', height: config.isHeight == 0 ? parseInt(config.pictureHeight) * 2 + 'rpx' : parseInt(config.pictureHeight) + 'px' }"
				></image>
			</view>
			<view class="dz-relative">
				<view v-for="(item, index) in componentDiy" :key="index">
					<view v-if="item.component == 'dz-gap'"><dz-gap :height="parseInt(item.props.height) * 2" :bg-color="item.props.bgColor"></dz-gap></view>
					<view v-if="item.component == 'dz-search'">
						<dz-navbar :is-fixed="true" :is-back="false" input-align="center" :borderBottom="false" :background="{ background: item.props.searchBgColor }">
							<view
								:style="{
									width: '100%',
									padding: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
								}"
								class="dz-flex"
							>
								<view v-if="item.props.isDiy == 1 && item.props.isLeft == 1" class="dz-m-r-20">
									<view v-if="item.props.leftType == 1">{{ item.props.leftText }}</view>
									<view v-if="item.props.leftType == 2">
										<dz-image
											:src="item.props.cover"
											:height="parseInt(item.props.coverSize) * 2"
											:width="parseInt(item.props.coverSize) * 2"
											:borderRadius="parseInt(item.props.borderRadius) * 2"
										></dz-image>
									</view>
								</view>

								<dz-search
									class="dz-flex-1"
									:disabled="true"
									:shape="item.props.shape"
									:value="item.props.value"
									:input-align="item.props.inputAlign"
									:bg-color="item.props.bgColor"
									:show-action="item.props.showAction == 1 ? true : false"
									@tap="searchTap(item.props.value)"
								></dz-search>
								<view v-if="item.props.isDiy == 1 && item.props.isRight == 1" class="dz-m-l-20">
									<view v-if="item.props.rightType == 1">
										<dz-icon name="scan" :color="item.props.rightStyle.color" :size="parseInt(item.props.rightStyle.fontSize) * 2" @tap="scanTap()"></dz-icon>
									</view>
									<view v-if="item.props.rightType == 2">
										<dz-icon
											name="message_fill_light"
											:color="item.props.rightStyle.color"
											:size="parseInt(item.props.rightStyle.fontSize) * 2"
											@tap="toPage('notifyIndex')"
										></dz-icon>
										<dz-badge :count="notifyUnRead" :offset="[10, 10]"></dz-badge>
									</view>
								</view>
							</view>
						</dz-navbar>
					</view>
					<!-- 公告 -->
					<view
						v-if="item.component == 'dz-notice-bar'"
						:style="{
							margin: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
						}"
					>
						<dz-notice-bar
							:list="notifyAnnounce"
							:mode="item.props.mode"
							:bg-color="item.props.bgColor"
							duration="5000"
							:volumeIcon="item.props.volumeIcon"
							:moreIcon="item.props.moreIcon == 1 ? true : false"
							:title="item.props.title"
							:title-style="item.props.titleStyle"
							:cover="item.props.cover"
							:widthHeight="parseInt(item.props.coverSize) * 2"
							:iconColor="item.props.iconColor"
							:color="item.props.color"
							:borderRadius="parseInt(item.props.radius) * 2"
							@click="noticeClick"
							@getMore="noticeClick"
						></dz-notice-bar>
					</view>
					<!-- 轮播图 -->
					<view
						v-if="item.component == 'dz-swiper'"
						:style="{
							margin: `${item.props.topBottom}px ${item.props.leftRight}px`
						}"
					>
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
					<!-- 分类 -->
					<view v-if="item.component == 'dz-grid-menu'">
						<dz-grid-menu
							:list="item.props.list"
							name="cover"
							title="cate_title"
							:col="item.props.col"
							:isPage="item.props.isPage == 1 ? true : false"
							:is-name="item.props.isName == 1 ? true : false"
							:width-height="parseInt(item.props.widthHeight) * 2"
							:border-radius="parseInt(item.props.borderRadius) * 2"
							:radius="parseInt(item.props.radius) * 2"
							:bgColor="item.props.bgColor"
							:left-right="parseInt(item.props.leftRight) * 2"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:border="false"
							:dot-color="item.props.dotColor"
							:mode="item.props.mode"
							:colNum="item.props.colNum"
							@click="gridAdvClick(index, $event)"
						></dz-grid-menu>
					</view>
					<!-- 优惠劵 -->
					<view v-if="item.component == 'dz-coupon' && item.data.length">
						<dz-coupon
							:bg-color="item.props.bgColor"
							:price-color="item.props.priceColor"
							:price-size="parseInt(item.props.priceSize) * 2"
							:tip-color="item.props.tipColor"
							:tip-size="parseInt(item.props.tipSize) * 2"
							:mode="item.props.mode"
							:radius="parseInt(item.props.radius) * 2"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:btn-bg-color="item.props.btnBgColor"
							:btn-color="item.props.btnColor"
							:deputy-color="item.props.deputyColor"
							:data-source="item.props.dataSource"
							:list="item.data"
						></dz-coupon>
					</view>
					<!-- 标题导航 -->
					<view
						v-if="item.component == 'dz-section'"
						:style="{
							margin: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
						}"
					>
						<dz-section
							:title="item.props.title"
							:arrow="item.props.right == 1 ? true : false"
							:right="item.props.right == 1 ? true : false"
							:showLine="item.props.showLine == 1 ? true : false"
							:line-color="item.props.lineColor"
							:bg-color="item.props.bgColor"
							:bold="item.props.bold == 1 ? true : false"
							@click="sectionClick(item.props.link)"
						></dz-section>
					</view>
					<!-- 商品列表 -->
					<view v-if="item.component == 'dz-product-list'">
						<block v-if="item.isList == 1 || item.isList == 2">
							<shop-product-list
								:list="item.data"
								:theme="theme"
								:isList="item.isList == 1 ? true : false"
								:radius="parseInt(item.props.radius) * 2"
								:left-right="parseInt(item.props.leftRight) * 2"
								:top-bottom="parseInt(item.props.topBottom) * 2"
								:cart="item.props.cart"
								:market-price-show="item.props.marketPriceShow"
							></shop-product-list>
						</block>
						<block v-if="item.isList == 3">
							<shop-product-max
								:list="item.data"
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

						<block v-if="item.isList == 4">
							<shop-product-three
								:list="item.data"
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
					</view>
					<!-- 广告 -->
					<view
						v-if="item.component == 'dz-banner'"
						class="dz-relative dz-banner"
						:style="{
							overflow: 'hidden',

							height: parseInt(item.props.height) * 2 + 'rpx',
							margin: `${parseInt(item.props.topBottom) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx`
						}"
					>
						<dz-image
							:src="item.props.cover"
							:borderRadius="parseInt(item.props.radius) * 2"
							:height="parseInt(item.props.height) * 2"
							@click="banner(item.props.link)"
						></dz-image>
						<block v-for="(area, areaIndex) in item.area" :key="areaIndex">
							<view
								class="dz-absolute"
								:style="{
									boxSizing: 'border-box',
									width: parseInt(area.width) * 2 + 'rpx',
									height: parseInt(area.height) * 2 + 'rpx',
									top: parseInt(area.top) * 2 + 'rpx',
									left: parseInt(area.left) * 2 + 'rpx'
								}"
								@tap.stop="banner(item.area[areaIndex].link)"
							>
								<dz-image v-if="area.cover" :src="area.cover" :width="parseInt(area.width) * 2" :height="parseInt(area.height) * 2"></dz-image>
							</view>
						</block>
					</view>
					<!-- 魔方 -->
					<view v-if="item.component == 'dz-rubiks-cube'">
						<shop-rubiks-cube
							:radius="parseInt(item.props.radius) * 2"
							:clearance="parseInt(item.props.clearance) * 2"
							:list="item.props.list"
							:mode="item.props.mode"
							:left-right="parseInt(item.props.leftRight) * 2"
							:top-buttom="parseInt(item.props.topButtom) * 2"
							:heightConfig="item.props.heightConfig"
							@click="rubiksCube"
						></shop-rubiks-cube>
					</view>
					<!-- 辅助线 -->
					<view v-if="item.component == 'dz-divider'">
						<dz-divider
							:half-width="parseInt(item.props.halfWidth) * 2"
							:bg-color="item.props.bgColor"
							:font-size="parseInt(item.props.fontSize) * 2"
							:color="item.props.color"
							:border-color="item.props.borderColor"
							:margin-top="parseInt(item.props.marginTop) * 2"
							:margin-bottom="parseInt(item.props.marginBottom) * 2"
						>
							{{ item.props.title }}
						</dz-divider>
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
							:text-align="item.props.textAlign"
							:bold="item.props.bold == 1 ? true : false"
						></dz-title>
					</view>
					<!-- 客服 -->
					<view v-if="item.component == 'dz-customer-service'">
						<dz-customer-service
							v-if="customerService"
							:customerServiceUnread="customerServiceUnread"
							:sessionFrom="sessionFrom"
							:mode="item.props.mode"
							:bottom="parseInt(item.props.bottom) * 2"
							:right="parseInt(item.props.right) * 2"
							icon="customer-service"
							:cover="item.props.cover"
							:coverWidth="parseInt(item.props.coverWidth) * 2"
							:coverHeight="parseInt(item.props.coverHeight) * 2"
							:customStyle="{
								borderRadius: parseInt(item.props.radius) * 2 + 'rpx',
								background: item.props.bgColor,
								boxShadow: item.props.bgColor ? '0 2px 12px 0 rgba(0, 0, 0, 0.1)' : ''
							}"
							:icon-style="{ fontSize: parseInt(item.props.size) * 2 + 'rpx', color: item.props.iconColor }"
							:radius="parseInt(item.props.radius) * 2"
							:zIndex="777"
							@click="serviceTap"
						></dz-customer-service>
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
					<view v-if="item.component == 'dz-article-tabs' && item.data.length">
						<dz-button-tabs
							v-if="item.props.cateConfig.mode == 'button'"
							:list="item.data"
							name="title"
							:height="parseInt(item.props.cateConfig.height) * 2"
							:padding="parseInt(item.props.cateConfig.padding) * 2"
							:radius="parseInt(item.props.cateConfig.radius) * 2"
							:button-radius="parseInt(item.props.cateConfig.buttonRadius) * 2"
							:font-size="parseInt(item.props.cateConfig.fontSize) * 2"
							:bg-color="item.props.cateConfig.bgColor"
							:active-color="item.props.cateConfig.activeColor"
							:inactive-color="item.props.cateConfig.inactiveColor"
							:active-bg-color="item.props.cateConfig.activeBgColor"
							:inactive-bg-color="item.props.cateConfig.inactiveBgColor"
							:bold="item.props.cateConfig.bold == 1 ? true : false"
							:current="item.props.cateConfig.activeCurrent"
							@change="tabsChange($event, index)"
						></dz-button-tabs>
						<dz-tabs
							v-else
							:list="item.data"
							name="title"
							:height="parseInt(item.props.cateConfig.height) * 2"
							:top-bottom="parseInt(item.props.cateConfig.topBottom) * 2"
							:left-right="parseInt(item.props.cateConfig.leftRight) * 2"
							:font-size="parseInt(item.props.cateConfig.fontSize) * 2"
							:active-color="item.props.cateConfig.activeColor"
							:bg-color="item.props.cateConfig.bgColor"
							:inactive-color="item.props.cateConfig.inactiveColor"
							:bold="item.props.cateConfig.bold == 1 ? true : false"
							:show-bar="item.props.cateConfig.showBar == 1 ? true : false"
							:bar-width="parseInt(item.props.cateConfig.barWidth) * 2"
							:bar-height="parseInt(item.props.cateConfig.barHeight) * 2"
							:current="item.props.cateConfig.activeCurrent"
							@change="tabsChange($event, index)"
						></dz-tabs>
						<view
							v-if="isLoading && activeCurrent == index"
							:style="{
								height: (parseInt(item.props.artcleConfig.height) + parseInt(item.props.artcleConfig.cardPadding)) * 2 + 'rpx',
								borderRadius: parseInt(item.props.artcleConfig.radius) * 2 + 'rpx',
								margin: `${parseInt(item.props.artcleConfig.topBottom) * 2}rpx ${parseInt(item.props.artcleConfig.leftRight) * 2}rpx`,
								background: '#fff'
							}"
							class="dz-p-20"
						>
							<dz-loadmore status="loading"></dz-loadmore>
						</view>
						<dz-article
							:list="item.props.artcleData"
							:mode="item.props.artcleConfig.mode"
							:data-source="item.props.artcleConfig.dataSource"
							:top-bottom="parseInt(item.props.artcleConfig.topBottom) * 2"
							:left-right="parseInt(item.props.artcleConfig.leftRight) * 2"
							:card-margin="parseInt(item.props.artcleConfig.cardMargin) * 2"
							:card-padding="parseInt(item.props.artcleConfig.cardPadding) * 2"
							:content-padding="parseInt(item.props.artcleConfig.contentPadding) * 2"
							:radius="parseInt(item.props.artcleConfig.radius) * 2"
							:radius1="parseInt(item.props.artcleConfig.radius1) * 2"
							:radius2="parseInt(item.props.artcleConfig.radius2) * 2"
							:width="parseInt(item.props.artcleConfig.width) * 2"
							:height="parseInt(item.props.artcleConfig.height) * 2"
							:is-description="item.props.artcleConfig.isDescription"
							:is-time="item.props.artcleConfig.isTime"
							:is-view-count="item.props.artcleConfig.isViewCount"
						></dz-article>
					</view>
					<!-- 文章列表 -->
					<view v-if="item.component == 'dz-article' && item.data.length">
						<dz-article
							:list="item.data"
							:mode="item.props.mode"
							:defaultList="item.props.list"
							:data-source="item.props.dataSource"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:card-margin="parseInt(item.props.cardMargin) * 2"
							:card-padding="parseInt(item.props.cardPadding) * 2"
							:content-padding="parseInt(item.props.contentPadding) * 2"
							:radius="parseInt(item.props.radius) * 2"
							:radius1="parseInt(item.props.radius1) * 2"
							:radius2="parseInt(item.props.radius2) * 2"
							:width="parseInt(item.props.width) * 2"
							:height="parseInt(item.props.height) * 2"
							:is-description="item.props.isDescription"
							:is-time="item.props.isTime"
							:is-view-count="item.props.isViewCount"
						></dz-article>
					</view>
					<view
						v-if="item.component == 'dz-position'"
						:style="{
							position: 'absolute',
							zIndex: '999',
							top: parseInt(item.props.top) * 2 + 'rpx',
							left: parseInt(item.props.left) * 2 + 'rpx',
							overflow: 'hidden'
						}"
					>
						<dz-position
							:mode="item.props.mode"
							:bg-color="item.props.bgColor"
							:cover="item.props.cover"
							:width="parseInt(item.props.width) * 2"
							:height="parseInt(item.props.height) * 2"
							:top="parseInt(item.props.top) * 2"
							:left="parseInt(item.props.left) * 2"
						></dz-position>
					</view>
					<!-- 营销模块 -->
					<view v-if="marketingType.includes(item.component) && item.data.length">
						<shop-marketing
							:props-config="item.props"
							:title="item.props.title"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:radius="parseInt(item.props.radius) * 2"
							:cover="item.props.cover"
							:list="item.data"
							:marketingType="item.component"
							:theme="theme"
						></shop-marketing>
					</view>
					<!-- 小程序直播 -->
					<!-- #ifdef MP-WEIXIN -->
					<view v-if="item.component == 'dz-mplive' && item.data.length > 0">
						<shop-mplive
							:list="item.data"
							:top-bottom="parseInt(item.props.topBottom) * 2"
							:left-right="parseInt(item.props.leftRight) * 2"
							:radius="parseInt(item.props.radius) * 2"
							:propsConfig="item.props"
						></shop-mplive>
					</view>
					<!-- #endif -->
				</view>
				<view style="height: 2rpx;"></view>
			</view>
		</view>
		<!-- 返回顶部 -->
		<dz-back-top :scroll-top="scrollTop" :customStyle="{ background: '#fff', boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)' }" :icon-style="{ fontSize: '36rpx' }"></dz-back-top>
		<dz-toast ref="dzToast"></dz-toast>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" zIndex="981" @click="pageLoadingClick"></dz-page-loading>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
let systemInfo = uni.getSystemInfoSync();
export default {
	data() {
		return {
			theme: this.$api.theme,
			shopSetting: this.$api.shopSetting,
			scrollTop: 0,
			opacity: 0,
			componentDiy: {},
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			marketingType: ['dz-group', 'dz-wholesale', 'dz-bargain', 'dz-discount', 'dz-presale'],
			notifyAnnounce: [],
			notifyUnRead: 0,
			customId: '',
			customTitle: '',
			config: {},
			auths: {
				login: {
					tip: '返回',
					icon: 'user_name',
					btnText: '登录',
					size: 160
				},
				auths: {
					tip: '暂无权限访问',
					icon: 'authfill',
					btnText: '返回',
					size: 200
				}
			},
			authsType: '',
			customerService: false,
			sessionFrom: '',
			isLoading: false,
			activeCurrent: '',
			pageType: ''
		};
	},

	onLoad(option) {
		this.customId = option.code;
		if (option.type) {
			this.pageType = option.type;
		}
		if (this.hasLogin) {
			this.getMemberInfo();
		}
		this.getInfoData();
		uni.$on('customPageChange', data => {
			if (this.hasLogin) {
				this.getMemberInfo();
			}
			this.getInfoData();
		});
	},
	computed: {
		...mapState(['userInfo', 'customerServiceUnread']),
		...mapGetters(['hasLogin']),
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	onPullDownRefresh() {
		this.getInfoData();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
			});
		},
		async getInfoData() {
			this.pageLoadingShow = true;

			this.$api.http
				.get(this.$api.apiShop.customPage, {
					params: {
						id: this.customId
					}
				})
				.then(res => {
					this.componentDiy = res.data.decorate.component;
					this.customTitle = res.data.decorate.title;
					this.config = res.data.decorate.params;
					if (this.config && JSON.stringify(this.config) != '{}' && this.config.isHeight == 1) {
						this.config.pictureHeight = systemInfo.windowHeight;
					}
					uni.setNavigationBarTitle({
						title: this.customTitle
					});
					this.initCustomerService();
					if (this.config.auths.length && !this.config.auths.includes('default')) {
						if (!this.hasLogin) {
							this.authsType = 'login';
							this.pageLoadingShow = false;
							return;
						}
						let isPromoter =
							this.userInfo.promoter && (this.userInfo.promoter.promoterRegional || this.userInfo.promoter.promoterStore || this.userInfo.promoter.promoterWarehouse)
								? true
								: false;

						const isStore = this.config.auths.includes('store');

						const isWarehouse = this.config.auths.includes('warehouse');

						if (this.userInfo.promoter.promoterRegional) {
							let regionals = [];
							this.userInfo.promoter.promoterRegional.forEach(item => {
								if (parseInt(item.province_id)) {
									regionals.push('province');
								}
								if (parseInt(item.province_id) && parseInt(item.city_id)) {
									regionals.push('city');
								}
								if (parseInt(item.province_id) && parseInt(item.city_id) && parseInt(item.area_id)) {
									regionals.push('area');
								}
							});
							const regional = this.config.auths.includes('regional');
							// 区域分销验证
							if (regional && this.unique(regionals).length) {
								this.authsType = '';
							} else {
								this.authsType = 'auths';
							}
							if (this.config.auths.some(item => this.unique(regionals).indexOf(item) > -1)) {
								this.authsType = '';
							} else {
								this.authsType = 'auths';
							}
						}

						// 店铺分销验证
						const storeId = this.userInfo.promoter && this.userInfo.promoter.promoterStore ? this.userInfo.promoter.promoterStore.level_id : '';
						if (storeId && (this.config.auths.includes('store-' + storeId) || isStore)) {
							this.authsType = '';
						} else {
							this.authsType = 'auths';
						}

						// 云仓分销验证
						if (isPromoter && (this.config.auths.includes('warehouse-' + this.userInfo.promoter.promoterWarehouse.level_id) || isWarehouse)) {
							this.authsType = '';
						} else {
							this.authsType = 'auths';
						}
					} else {
						this.authsType = '';
					}
					if (this.componentDiy.length) {
						this.componentDiy.forEach((item, idnex) => {
							if (item.component == 'dz-article-tabs' && item.data.length) {
								if (item.props.dataSource == 'manual' && item.props.list.some(item => item.id == '9999999')) {
									let index = item.props.list.findIndex(item => item.id == '9999999');
									item.data.splice(index, 0, {
										id: '',
										title: '全部'
									});
								}
								if (item.props.dataSource == 'default') {
									item.data.unshift({
										id: '',
										title: '全部'
									});
								}
								this.tabsChange(0, idnex);
							}
						});
					}
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});

			this.$api.http.get(this.$api.apiShop.notifyAnnounceIndex).then(res => {
				this.notifyAnnounce = [];
				res.data.forEach(itme => {
					this.notifyAnnounce.push(itme.title);
				});
			});

			if (this.$api.store.getters.hasLogin) {
				this.getNotifyUnRead();
			}
			uni.stopPullDownRefresh();
		},

		tabsChange(e, index) {
			this.isLoading = true;
			let item = this.componentDiy[index];
			item.props.cateConfig.activeCurrent = e;
			this.activeCurrent = index;
			item.props.artcleData = [];
			let params = {};
			if (item.data[e].id) {
				params.cate_id = item.data[e].id;
			}
			if (item.props.pageSize) {
				params.page_size = item.props.pageSize;
			}
			this.$api.http
				.get(this.$api.apiArticle.getArticleIndex, {
					params: {
						...params
					}
				})
				.then(res => {
					item.props.artcleData = res.data;
				})
				.finally(() => {
					this.isLoading = false;
				});
		},
		unique(arr) {
			return [...new Set(arr)];
		},
		searchTap() {
			this.$api.router.push({
				route: this.$api.routesConfig.search
			});
		},
		initCustomerService() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			if (serviceType > 0) {
				if (this.$api.store.getters.hasLogin) {
					this.sessionFrom =
						'{"source":"' +
						this.customTitle +
						'","mobile":"' +
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
						source: this.customTitle,
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
		},
		async scanTap() {
			let _this = this;
			/*  #ifndef H5  */
			uni.scanCode({
				success: res => {
					this.scan(res.result);
				},
				fail: err => {
					//this.$api.helper.toast(this.$api.language.index.scanError + err.errMsg);
				}
			});
			/*  #endif  */
			/*  #ifdef H5  */
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				//注意公众号jweixin方法仅支持异步
				this.$api.jweixin.ready(() => {
					this.$api.jweixin.scanQRCode({
						needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
						success(res) {
							_this.scan(res.resultStr);
						},
						fail(res) {
							_this.$api.helper.toast(_this.$api.language.index.scanError + err.errMsg);
						}
					});
				});
			} else {
				this.$api.helper.toast(this.$api.language.application.needOprationInWechat);
			}
			/*  #endif  */
		},
		async scan(result) {
			if (result.startsWith('http')) {
				let h5LoginUrl = this.$api.shopSetting.h5_url;
				if (h5LoginUrl.endsWith('/')) {
					h5LoginUrl = h5LoginUrl.substr(0, h5LoginUrl.length - 1);
				}
				h5LoginUrl = h5LoginUrl.replace('http://', '');
				h5LoginUrl = h5LoginUrl.replace('https://', '');
				let url = result;
				url = url.replace('http://', '');
				url = url.replace('https://', '');
				//首页
				if (url == h5LoginUrl || url == h5LoginUrl + '/') {
					uni.reLaunch({
						url: this.$api.appConfig.indexPath
					});
					return;
				}

				if (url.startsWith(h5LoginUrl + '/')) {
					let pathFull = url.substr(h5LoginUrl.length);
					let path = pathFull.split('?')[0];
					let params = this.$api.helper.getRequestParameters(pathFull);
					let routesConfig = this.$api.routesConfig;
					for (let item in routesConfig) {
						if (routesConfig[item].path == path) {
							this.$api.router.push({
								route: routesConfig[item],
								query: params
							});
							break;
						}
					}
				} else {
					//跳转到外部网页
					// #ifndef MP
					this.$api.router.push({
						route: this.$api.routesConfig.webview,
						query: {
							url: this.$api.helper.strEncode(result)
						}
					});
					// #endif
					// #ifdef MP
					this.$api.helper.toast(this.$api.language.index.scanMpError);
					// #endif
				}
			} else {
				//核销
				await this.$api.http
					.post(this.$api.apiShop.productVirtualVerificationVerify, {
						code: result
					})
					.then(res => {
						this.$api.helper.toast(this.$api.language.index.virtualVerificationVerifySuccess);
					})
					.catch(err => {});
			}
		},
		async getNotifyUnRead() {
			//通知消息
			await this.$api.http.get(this.$api.apiShop.notifyUnRead).then(res => {
				this.notifyUnRead = res.data.count;
			});
		},
		pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			this.getInfoData();
		},
		fabClick(itemIndex, index) {
			const item = this.componentDiy[index].props.list[itemIndex].link;
			this.$api.shop.linkJump(item);
		},
		// 轮播图
		swiperClick(index, itemIndex) {
			const item = this.componentDiy[index].props.list[itemIndex];
			this.$api.shop.linkJump(item);
		},
		gridAdvClick(index, itemIndex) {
			const item = this.componentDiy[index].props.list[itemIndex];
			this.$api.shop.linkJump(item);
		},
		sectionClick(item) {
			this.$api.shop.linkJump(item);
		},
		// 公告
		noticeClick(index) {
			this.$api.router.push({
				route: this.$api.routesConfig.notice
			});
		},
		// 广告
		banner(val) {
			this.$api.shop.linkJump(val);
		},
		// 魔方
		rubiksCube(val) {
			this.$api.shop.linkJump(val);
		},
		toBack(type) {
			if (type == 'login') {
				this.$api.router.push({
					route: this.$api.routesConfig.login
				});
				return;
			}
			// 获取当前页面栈，如果页面栈为1，则直接跳转到首页
			let pages = getCurrentPages();
			if (pages.length == 1) {
				this.$api.router.redirectTo({
					route: this.$api.routesConfig.index
				});
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>
<!-- #ifdef APP-PLUS || MP-->
<style lang="scss">
page,
.custom-page {
	height: 100%;
}

.custom-page {
	position: relative;

	.custom-bg-img {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;

		image {
			width: 100%;
			display: block;
			float: left;
			vertical-align: bottom;
			font-size: 0;
		}

		img {
			font-size: 0;
			width: 100%;
			display: block;
			float: left;
			vertical-align: bottom;
		}
	}
}
</style>
<!-- #endif -->

<!-- #ifdef H5 -->
<style lang="scss" scoped>
page,
.custom-page {
	height: 100%;
}

.custom-page {
	position: relative;

	.custom-bg-img {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 0;

		image {
			width: 100%;
			display: block;
			float: left;
			vertical-align: bottom;
			font-size: 0;
		}

		img {
			font-size: 0;
			width: 100%;
			display: block;
			float: left;
			vertical-align: bottom;
		}
	}
}
</style>
<!-- #endif -->

<style lang="scss">
.dz-banner {
	image{
		display: inline-block;
	}
}
</style>
