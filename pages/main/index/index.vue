<template>
	<view>
		<view v-if="wechatMpScene != '' && wechatMpScene == 1154">
			<dz-mask :show="true" :zIndex="1"></dz-mask>
			<view class="mp-scene">
				<view class="mp-weixin dz-flex dz-row-center"><dz-icon name="round_link_fill" color="#7A80FC" :size="70"></dz-icon></view>
				<view class="mp-tip dz-text-center">点击右下角</view>
				<img :src="guide" />
			</view>
		</view>
		<view
			v-else
			class="custom-page"
			:style="{
				background: config.pageColorMode == 'default' ? config.pageColor : config.pageLinearColor && config.pageLinearColor.color ? config.pageLinearColor.color : '#f3f4f6'
			}"
		>
			<view v-if="config.backgroundPicture" class="custom-bg-img">
				<image
					:src="config.backgroundPicture"
					:style="{ width: '100%', height: config.isHeight == 0 ? parseInt(config.pictureHeight) * 2 + 'rpx' : parseInt(config.pictureHeight) + 'px' }"
				></image>
			</view>
			<view
				:style="{
					background:
						config.pageColorMode == 'default' ? config.pageColor : config.pageLinearColor && config.pageLinearColor.color ? config.pageLinearColor.color : '#f3f4f6'
				}"
			>
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
									<view
										v-if="item.props.leftType == 1"
										:style="{
											fontSize: `${item.props.leftStyle.fontSize}px`,
											color: item.props.leftStyle.color,
											fontWeight: item.props.leftStyle.isBold == 1 ? 'bold' : '500'
										}"
									>
										{{ item.props.leftText }}
									</view>
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
											name="notification-line"
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
					<!-- 瀑布流商品 -->
					<view v-if="item.component == 'dz-falls-flow-product' && productList.length">
						<block v-if="item.isList == 1 || item.isList == 2">
							<shop-product-list
								:list="productList"
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
								:list="productList"
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
								:list="productList"
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
						<block v-if="index == componentDiy.length - 1">
							<dz-empty v-if="loadingStatus == 'nodata'" margin-top="60" :src="empty" text="暂无数据" iconSize="360"></dz-empty>
							<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
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
							:top-bottom="parseInt(item.props.cateConfig.topBottom) * 2"
							:left-right="parseInt(item.props.cateConfig.leftRight) * 2"
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
							:height="parseInt(item.props.cateConfig.height) * 2"
							name="title"
							:font-size="parseInt(item.props.cateConfig.fontSize) * 2"
							:active-color="item.props.cateConfig.activeColor"
							:bg-color="item.props.cateConfig.bgColor"
							:inactive-color="item.props.cateConfig.inactiveColor"
							:top-bottom="parseInt(item.props.cateConfig.topBottom) * 2"
							:left-right="parseInt(item.props.cateConfig.leftRight) * 2"
							:radius="parseInt(item.props.cateConfig.radius) * 2"
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
					<view v-if="item.component == 'dz-article'">
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
			<!--ICP备案-->
			<!--#ifdef H5-->
			<view class="copyright" v-if="parseInt(shopSetting.copyright_show) == 1 && showPageCopyright">
				<dz-icon v-if="shopSetting.copyright_logo" :name="shopSetting.copyright_logo" width="28" height="28" :custom-style="{ marginRight: '6rpx' }"></dz-icon>
				{{ shopSetting.copyright_desc || shopSetting.copyright_companyname }}
				<dz-link style="margin-left: 10rpx;font-size: 26rpx;" :href="shopSetting.copyright_url || 'https://beian.miit.gov.cn/'">{{ shopSetting.copyright_icp }}</dz-link>
			</view>
			<!-- #endif -->
			<!-- 协议 -->
			<dz-popup v-model="protocolShow" mode="center" width="90%" border-radius="40" :mask-close-able="false" z-index="9999999">
				<view class="protocol-content">
					<view class="title">温馨提示</view>
					<view class="name">欢迎来到{{ appName }}</view>
					<view class="text">
						请您务必审慎阅读、充分理解“服务协议”和“隐私政策”的各条款、 包括但不限于为了向您提供即时通讯、内容分享、用户消息推送等服务，
						我们需要收集您的设备信息，操作日志等个人信息。 您可以在“设置”中查看、变更、删除个人信息并管理你的授权。 你可阅读
						<text class="text-blue" @tap="protocol('用户协议', 'register')">用户协议</text>
						、
						<text class="text-blue" @tap="protocol('隐私政策', 'privacy')">隐私政策</text>
						了解详细信息。 如你同意，请点击“同意”开始接受我们的服务。
					</view>
					<view class="dz-flex popup-btn dz-m-t-40">
						<dz-button
							shape="circle"
							:border="false"
							hoverClass="none"
							:customStyle="{ width: '240rpx', height: '80rpx', background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
							@click="unAgreeProtocol"
						>
							不同意
						</dz-button>
						<dz-button
							shape="circle"
							:border="false"
							hoverClass="none"
							:customStyle="{ width: '240rpx', height: '80rpx', background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
							@click="agreeProtocol"
						>
							同意
						</dz-button>
					</view>
				</view>
			</dz-popup>
			<dz-toast ref="dzToast"></dz-toast>
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
			<!-- 返回顶部 -->
			<dz-back-top
				:scroll-top="scrollTop"
				:customStyle="{ background: '#fff', boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)' }"
				:icon-style="{ fontSize: '36rpx' }"
			></dz-back-top>
			<!-- 页面加载 -->
			<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" zIndex="981" @click="pageLoadingClick"></dz-page-loading>
			<dz-wechat-guide :show="guideShow" :guideConfig="shopSetting" :paddingTop="paddingTop" @hideGuide="hideGuideTap()"></dz-wechat-guide>
			<shop-popup-adv :list="popAdvList" :show="popupAdvShow" @cancel="popupAdvCancel" @davClick="davClick"></shop-popup-adv>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import mpShare from '@/core/utils/mixin/mpShare.js';
import tabbarConfig from '@/core/config/tabbarConfig';
let systemInfo = uni.getSystemInfoSync();
export default {
	mixins: [mpShare],
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			shopSetting: this.$api.shopSetting,
			appName: '',
			componentDiy: {},
			updating: false,
			loading: false,
			pageLoadingShow: true,
			pageLoadingStatus: 'loading',
			notifyAnnounce: [],
			notifyUnRead: 0,
			defaultTabbarList: tabbarConfig.tabbarList,
			guideShow: false,
			paddingTop: '',
			popupAdvShow: false,
			scrollTop: 0,
			marketingType: ['dz-group', 'dz-wholesale', 'dz-bargain', 'dz-discount', 'dz-presale'],
			protocolShow: null,
			popAdvList: [],
			config: {},
			customerService: false,
			sessionFrom: '',
			isLoading: false,
			activeCurrent: '',
			showPageCopyright: false,
			guide: this.$api.assetsConfig.guide,
			isLoadingProduct: false,
			productConfig: {},
			page: 1,
			productList: [],
			loadingStatus: 'loading',
			empty: this.$api.assetsConfig.empty,
		};
	},
	computed: {
		...mapState(['tabbarList', 'wechatTip', 'popupAdvTime', 'isGuide', 'isAgree', 'isPopAdv', 'customerServiceUnread', 'wechatMpScene'])
	},
	async onLoad(e) {
		await this.$onLaunched;
		uni.setNavigationBarTitle({ title: this.$api.shopSetting.store_name });
		// #ifdef APP-PLUS
		this.protocolShow = this.isAgree;
		// #endif
		this.theme = this.$api.theme;
		this.appName = this.$api.shopSetting.store_name;

		uni.$on('themeChange', () => {
			this.theme = this.$api.theme;
		});

		//保存推荐人
		if (e.promo_code) {
			this.$api.store.commit('setPromoCode', e.promo_code);
		}
		//登录处理
		if (!this.$api.store.getters.hasLogin && parseInt(this.$api.shopSetting.wechat_share_page_auto_login) == 1) {
			//公众号自动登录
			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				if (e.code) {
					this.$api.wxAutoLoginHelper.wechatCodeLogin(e.code);
				} else {
					this.$api.wxAutoLoginHelper.login();
				}
			}
			// #endif
		}
		//分享
		//初始化公众号分享
		// #ifdef H5
		if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
			this.$api.wxHelper.wxShare(
				window.location.href,
				this.$api.shopSetting.store_name,
				this.$api.shopSetting.product_share_title,
				this.sharePath(),
				this.$api.shopSetting.store_logo
			);
		}
		// #endif
		//初始化小程序分享
		this.mpShare.title = this.$api.shopSetting.product_share_title;
		this.mpShare.path = this.sharePath();
		this.mpShare.imageUrl = this.$api.shopSetting.store_logo;

		// #ifdef MP-WEIXIN
		this.paddingTop = this.$api.systemInfo.statusBarHeight + 44 + 'px';
		// #endif
		if (
			this.$api.helper.h5IsWechat() &&
			this.$api.shopSetting.wechat_appid != '' &&
			this.shopSetting.style_attention_official_account_qrcode != '' &&
			this.shopSetting.style_attention_official_account_name != ''
		) {
			this.guideShow = this.wechatTip == 1;
		}
		// #ifdef MP-WEIXIN
		if (
			this.shopSetting.style_attention_mini_program_name != '' &&
			this.shopSetting.style_attention_mini_program_logo != '' &&
			this.shopSetting.style_attention_mini_program_name != ''
		) {
			this.guideShow = this.wechatTip == 1;
		}
		// #endif

		this.getIndex();
	},
	onShow() {
		// #ifdef APP-PLUS
		this.checkUpdate();
		// #endif
		if ((this.pageLoadingStatus == 'error' || this.pageLoadingStatus == 'loading') && this.pageLoadingShow) {
			this.getIndex();
		}
	},
	onUnload() {
		this.$off(['themeChange']);
		this.$api.store.commit('setMpWeixinScene', '');	
	},
	onPullDownRefresh() {
		this.page = 1;
		this.productList.length = 0;
		this.getIndex();	
	},
	onReachBottom() {
		if (!this.isLoadingProduct || this.loadingStatus == 'nodata' || this.loadingStatus == 'nomore' || JSON.stringify(this.productConfig) == '{}') return;
		this.page++;
		if(this.productConfig.productType != 'like') {
			this.getProductList(); 
		}else {
			this.getGuessYouLikeList()
		}	
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		unAgreeProtocol() {
			plus.runtime.quit();
		},
		agreeProtocol() {
			this.protocolShow = false;
			this.$api.store.commit('setIsAgree', this.protocolShow);
		},
		protocol(title, field) {
			this.$api.router.push({
				route: this.$api.routesConfig.aboutProtocol,
				query: {
					title: title,
					field: field
				}
			});
		},
		hideGuideTap() {
			this.guideShow = false;
			this.$api.store.commit('setWechatTip', 0);
		},
		async checkUpdate() {
			if (!this.$api.appConfig.appCheckUpdate) {
				return;
			}
			if (this.updating) {
				return;
			}
			this.updating = true;
			let type = plus.os.name == 'iOS' ? 2 : 1;
			try {
				const wgtInfo = await this.$api.helper.getWgtInfoAsync();
				const res = await this.$api.http.get(this.$api.apiVersions.appVersion, {
					params: {
						type: type,
						version: wgtInfo.version
					}
				});
				if (res.data) {
					//验证跳过版本
					let jumpVersion = uni.getStorageSync('jumpUpdateVersion') || '1.0.0';
					let isUpdate = this.$api.helper.compareVersion(res.data.version, jumpVersion);
					if (isUpdate) {
						let updateData = {
							content: res.data.content,
							version: res.data.version,
							is_enforce: parseInt(res.data.is_enforce),
							download_url: res.data.download_url,
							progress: true,
							mask_click: false,
							buttonNum: 0
						};
						this.$api.appUpdate(updateData);
					}
				}
			} catch (e) {
				this.updating = false;
			}
		},
		async getIndex() {
			if (this.isGuide) {
				// #ifdef APP-PLUS
				setTimeout(() => {
					console.log('关闭启动页');
					plus.navigator.closeSplashscreen();
				}, 1000);
				if (this.shopSetting.style_attention_app_guide.length > 0) {
					uni.navigateTo({
						url: '/pages/guide/guideList'
					});
				}
				// #endif
			}
			try {
				if (this.loading) {
					return;
				}
				this.loading = true;
				await this.getInfoData();

				await this.initCustomerService();

				await setTimeout(() => {
					this.getPopAdv();
				}, 1000);

				setTimeout(() => {
					this.showPageCopyright = true;
				}, 1500);
			} catch (e) {
				this.pageLoadingStatus = 'loading';
			} finally {
				this.loading = false;
				uni.stopPullDownRefresh();
			}
		},
		async getInfoData() {
			this.pageLoadingShow = true;
			if (this.$api.store.getters.hasLogin) {
				await this.getMemberInfo();
				await this.getNotifyUnRead();
			}
			this.$api.http
				.get(this.$api.apiShop.indexDiy)
				.then(res => {
					this.componentDiy = res.data.component;
					this.config = JSON.parse(res.data.params);
					if (this.config && JSON.stringify(this.config) != '{}' && this.config.isHeight == 1) {
						this.config.pictureHeight = systemInfo.windowHeight;
					}
					if (this.componentDiy.length > 0) {
						if (this.componentDiy[this.componentDiy.length - 1].component == 'dz-falls-flow-product') {
							this.productConfig = this.componentDiy[this.componentDiy.length - 1].props
							this.productList = this.componentDiy[this.componentDiy.length - 1].data
							this.isLoadingProduct = this.productList.length ? true : false	
						}
						const search = this.componentDiy.filter(v => v.component == 'dz-search');
						if (search && search.length) {
							this.$api.store.commit('setProductSearchDefault', search[0].data.hot_search_default);
							this.$api.store.commit('setProductSearchHot', search[0].data.hot_search_list);
						}
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
					if (err) return;
					this.$refs.dzToast.show({
						title: '网络请求错误,请检查网络是否正常!',
						type: 'error'
					});
				});
			this.$api.http.get(this.$api.apiShop.notifyAnnounceIndex).then(res => {
				this.notifyAnnounce = [];
				res.data.forEach(itme => {
					this.notifyAnnounce.push(itme.title);
				});
				this.pageLoadingShow = false;
			});

			uni.stopPullDownRefresh();
		},
		async getProductList() {
			this.loadingStatus = 'loading';
			const params = {};
			if(this.productConfig.cate.cate_id) {
				params.cate_id = this.productConfig.cate.cate_id;
			}
			switch(this.productConfig.productType) {
				case 'is_new':
				params.is_new = this.productConfig.is_new;
				break
				case 'is_recommend':
				params.is_recommend = this.productConfig.is_recommend;
				break
				case 'is_hot':
				params.is_hot = this.productConfig.is_hot;
				break
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
		// 猜你喜欢
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
		// 客服
		initCustomerService() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			if (serviceType > 0) {
				if (this.$api.store.getters.hasLogin) {
					this.sessionFrom =
						'{"source":"首页","mobile":"' +
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
		// 文章分类切换
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
		// 获取用户信息
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
			});
		},
		// 获取弹窗广告
		getPopAdv() {
			let tiem = new Date().getTime() / 1000;
			let tiemDay = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000;
			this.$api.http.get(this.$api.apiShop.popAdv).then(res => {
				if (res.data.length > 0) {
					if (this.isPopAdv == 1) {
						this.popAdvList = res.data.filter(item => item.popup_mode == 2);
					} else {
						this.popAdvList = res.data;
					}
					if (this.popupAdvTime && tiem < this.popupAdvTime && this.popAdvList.length > 0) {
						this.popupAdvShow = false;
					} else {
						if (this.popAdvList.length > 0) {
							this.popupAdvShow = true;
						} else {
							this.popupAdvShow = false;
						}
						this.$api.store.commit('setPopupAdvTime', tiemDay);
					}
					return;
				}
				this.popupAdvShow = false;
			});
		},
		popupAdvCancel() {
			this.popupAdvShow = false;
			this.$api.store.commit('setIsPopAdv', 1);
		},
		davClick(index) {
			const item = this.popAdvList[index];
			this.$api.shop.advNavigate(item.jump_type, item.jump_link, item.id, 'pop');
		},
		searchTap(key) {
			this.$api.router.push({
				route: this.$api.routesConfig.search,
				query: {
					key
				}
			});
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
				let codeType = new RegExp(/pickup-/);

				if (codeType.test(result)) {
					console.log(result.split('-')[1], 'okkk');
					// 提货
					this.$api.http
						.post(this.$api.apiShop.roductPickupCheck, {
							code: result.split('-')[1]
						})
						.then(res => {
							if (res && res.code == 200) {
								this.$api.router.push({
									route: this.$api.routesConfig.orderPickup,
									query: {
										code: result.split('-')[1]
									}
								});
							}
						});
				} else {
					//核销
					await this.$api.http
						.post(this.$api.apiShop.productVirtualVerificationVerify, { code: result })
						.then(res => {
							this.$api.helper.toast(this.$api.language.index.virtualVerificationVerifySuccess);
						})
						.catch(err => {});
				}
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
		// 轮播图
		swiperClick(index, itemIndex) {
			const item = this.componentDiy[index].props.list[itemIndex];
			this.$api.shop.linkJump(item);
		},
		fabClick(itemIndex, index) {
			const item = this.componentDiy[index].props.list[itemIndex].link;
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
						source: '首页',
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
		sharePath() {
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			// #ifdef MP
			url = this.$api.routesConfig.index.path;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.index.path}`;
			// #endif
			if (this.$api.store.getters.hasLogin) {
				url = url + '?promo_code=' + this.$api.store.state.userInfo.promo_code;
			}
			return url;
		},
		toPage(url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {}
			});
		}
	}
};
</script>

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
	}
}
.protocol-content {
	padding: 60rpx;
	.title {
		font-size: 46rpx;
		font-weight: 700;
		color: #333;
		text-align: center;
	}
	.name {
		padding: 30rpx 0 20rpx;
		font-size: 30rpx;
		font-weight: 700;
	}
	.text {
		font-size: 28rpx;
		line-height: 47rpx;
		.text-blue {
			color: rgb(0, 130, 255);
		}
	}
}

//拼团
.marketing {
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	margin: 20rpx 20rpx 0;

	.h-list {
		padding: 0 10rpx;
		margin-top: -20rpx;
		background-color: #ffffff;
		white-space: nowrap;
		.h-item {
			margin: 10rpx 10rpx 10rpx 10rpx;
			padding: 10rpx 0 5rpx;
			display: inline-block;
			background-color: #fff;
			font-size: 22rpx;
			width: 192rpx;
			border-radius: 6rpx;

			.h-item-img {
				display: inline-block;
				width: 192rpx;
				height: 192rpx;
				border-radius: 15rpx;
				overflow: hidden;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
			}
			.title {
				width: 192rpx;
				white-space: normal;
				height: 56rpx;
				line-height: 28rpx;
				font-size: 22rpx;
				padding: 0 10rpx;
				margin: 10rpx 0;
			}
			.last-line {
				padding: 0 10rpx 0rpx;
				margin-bottom: 5rpx;
				.red {
					font-size: 22rpx;
					margin-right: 4rpx;
				}
			}
		}
	}
}

.dz-banner {
	image{
		display: inline-block;
	}
}

//备案
.copyright {
	vertical-align: middle;
	margin: 30rpx 0;
	width: 100%;
	text-align: center;
	font-size: 26rpx;
	color: #666;
}
</style>
