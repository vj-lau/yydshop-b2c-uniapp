<template>
	<view class="container">
		<!--header-->
		<view class="dz-header-box" :class="{ 'dz-bar-line': opcity > 0.85 }" :style="{ height: height + 'px', background: 'rgba(255,255,255,' + opcity + ')' }">
			<view class="dz-header" :style="{ paddingTop: top + 'px', opacity: opcity }">
				<view class="dz-title dz-line-1">{{ title }}</view>
			</view>
			<view class="dz-header-icon" :style="{ paddingTop: top + 'px' }">
				<view class="dz-icon-box" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }" @tap="backClick(1)">
					<dz-icon name="back_light" :size="30" color="#fff"></dz-icon>
				</view>
				<view class="dz-icon-box dz-m-l-20" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }" @tap="backClick(2)">
					<dz-icon name="home_light" :size="32" color="#fff"></dz-icon>
				</view>

				<button v-if="showShare" class="dz-transparent-btn" open-type="share" @tap.stop="shareClick">
					<view class="dz-icon-box dz-icon-ml" :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }" @tap.stop="shareClick">
						<dz-icon name="share_light" :size="30" color="#fff"></dz-icon>
					</view>
				</button>
			</view>
		</view>
		<!--header-->

		<!--banner-->
		<view class="dz-banner-swiper">
			<swiper :autoplay="false" :interval="5000" :duration="150" :circular="true" :style="{ height: scrollH + 'px' }" @change="bannerChange">
				<!--H5和小程序直接播放视频-->
				<!-- #ifndef APP-PLUS -->
				<block v-if="product.video_url">
					<swiper-item>
						<video
							id="productVedio"
							:style="{ width: '100%', height: scrollH + 'px' }"
							:src="product.video_url"
							object-fit="cover"
							vslide-gesture
							page-gesture
							enable-play-gesture
							controls
							autoplay
							:enable-progress-gesture="false"
						></video>
					</swiper-item>
				</block>
				<!-- #endif -->
				<block v-for="(item, index) in product.covers" :key="index">
					<swiper-item :data-index="index" @tap.stop="previewBanner">
						<image :src="item" mode="aspectFit" class="dz-slide-image" :style="{ height: scrollH + 'px' }" />
					</swiper-item>
				</block>
			</swiper>
			<!--APP做视频跳转-->
			<!-- #ifdef APP-PLUS -->
			<view v-if="product.video_url" class="dz-video__box" @tap.stop="vedioPlay">
				<image :src="assets.videoPlayer" mode="widthFix"></image>
				<view>{{ language.product.productVedio }}</view>
			</view>
			<!-- #endif -->
			<!--指示器-->
			<view class="dz-banner-tag" v-if="bannerLength > 1 && (product.video_url ? bannerIndex > 0 : true)">
				<dz-tag type="info" shape="circle" mode="dark" bg-color="rgba(0, 0, 0, 0.5)" border-color="rgba(0, 0, 0, 0.5)" :color="theme.dzBaseFontColor">
					{{ bannerIndex + 1 }}/{{ bannerLength }}
				</dz-tag>
			</view>
		</view>
		<!--banner-->

		<!--属性-->
		<view class="dz-pro-detail">
			<view class="dz-product-title dz-border-radius">
				<!--直接购买-->
				<block v-if="isBuyMode || product.marketing_type == ''">
					<!--预售商品-->
					<block v-if="parseInt(product.is_open_presell) === 1">
						<view class="dz-marketing-price">
							<view
								class="dz-marketing-pricebox dz-marketing-presale dz-padding"
								:style="{ background: 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')', color: theme.dzBaseFontColor }"
							>
								<view class="dz-marketing-pro-price">
									<view>
										<text>{{ language.application.moneySymbol }}</text>
										<text class="dz-price">{{ currentProductPrice }}</text>
									</view>
									<view class="dz-marketing-original-price" v-if="product.market_price > product.price">
										{{ language.application.moneySymbol }}{{ product.market_price }}
									</view>
								</view>
								<view class="dz-marketing-sold">
									<text>
										{{
											parseInt(product.presell_delivery_type) === 1
												? $api.helper.formatString(language.product.preSaleDeliverTime, $api.helper.timeFormat(product.presell_time, 'yyyy-mm-dd'))
												: $api.helper.formatString(language.product.preSaleDeliverDay, product.presell_day)
										}}
									</text>
									<view class="dz-marketing-tag">
										<dz-tag
											class="dz-m-l-10"
											size="mini"
											mode="plain"
											bg-color="transparent"
											:border-color="theme.dzBaseFontColor"
											:color="theme.dzBaseFontColor"
										>
											{{ language.product.preSaleProduct }}
										</dz-tag>
									</view>
								</view>
							</view>
						</view>
					</block>
					<!--非预售产品-->
					<block v-else>
						<view class="dz-pro-pricebox dz-padding" :style="{ color: theme.dzBaseColor }">
							<view class="dz-pro-price">
								<view v-if="parseInt(product.point_exchange_type) === 1">
									<text>{{ language.application.moneySymbol }}</text>
									<text class="dz-price">{{ currentProductPrice }}</text>
								</view>
								<view v-else-if="parseInt(product.point_exchange_type) === 2">
									<text>{{ language.application.moneySymbol }}</text>
									<text class="dz-price">{{ currentProductPrice }}</text>
									<text class="dz-m-l-10 dz-m-r-10">{{ language.application.and }}</text>
									<text class="dz-price">{{ product.point_exchange }}</text>
									<text>{{ language.product.point }}</text>
								</view>
								<view v-else-if="parseInt(product.point_exchange_type) === 3">
									<text>{{ language.application.moneySymbol }}</text>
									<text class="dz-price">{{ currentProductPrice }}</text>
									<text class="dz-m-l-10 dz-m-r-10">{{ language.application.or }}</text>
									<text class="dz-price">{{ product.point_exchange }}</text>
									<text>{{ language.product.point }}</text>
								</view>
								<view v-if="parseInt(product.point_exchange_type) === 4">
									<text class="dz-price">{{ product.point_exchange }}</text>
									<text>{{ language.product.point }}</text>
								</view>
								<dz-tag
									v-if="parseInt(product.is_open_presell) === 1"
									class="dz-m-l-10"
									size="mini"
									mode="plain"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseColor"
								>
									{{ language.product.preSale }}
								</dz-tag>
								<dz-tag
									v-if="parseInt(product.is_hot) === 1"
									class="dz-m-l-10"
									size="mini"
									mode="plain"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseColor"
								>
									{{ language.product.hot }}
								</dz-tag>
								<dz-tag
									v-if="parseInt(product.is_recommend) === 1"
									class="dz-m-l-10"
									size="mini"
									mode="plain"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseColor"
								>
									{{ language.product.recommend }}
								</dz-tag>
								<dz-tag
									v-if="parseInt(product.is_new) === 1"
									class="dz-m-l-10"
									size="mini"
									mode="plain"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseColor"
								>
									{{ language.product.new }}
								</dz-tag>
								<dz-tag
									v-if="product.min_buy > 1"
									class="dz-m-l-10"
									size="mini"
									mode="plain"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseColor"
									:text="`${product.min_buy}件起售`"
								></dz-tag>
							</view>
							<view class="dz-collection dz-size" @tap="collectClick">
								<dz-icon :name="collected ? 'likefill' : 'like'" :color="collected ? theme.dzBaseColor : theme.dzMainColor" :size="40"></dz-icon>
								<view class="dz-scale-collection" :style="{ color: collected ? theme.dzBaseColor : '' }" :class="{ 'dz-icon-dark': collected }">
									{{ language.product.collect }}
								</view>
							</view>
						</view>
						<view class="dz-original-price dz-gray" v-if="product.market_price > product.price">
							<text class="dz-line-through">{{ language.product.marketPriceInfo }} {{ language.application.moneySymbol }}{{ product.market_price }}</text>
						</view>
					</block>
				</block>
				<!--营销模式-->
				<block v-else>
					<!--砍价-->
					<block v-if="product.marketing_type == 'bargain'">
						<view class="dz-marketing-price">
							<view
								class="dz-marketing-pricebox dz-marketing-left dz-padding"
								:style="{ background: 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')', color: theme.dzBaseFontColor }"
							>
								<view class="dz-marketing-pro-price">
									<view>
										<text>{{ language.application.moneySymbol }}</text>
										<text class="dz-price">{{ marketingPrice }}</text>
									</view>
									<view class="dz-marketing-original-price" v-if="marketingMarketPrice > marketingPrice">
										{{ language.application.moneySymbol }}{{ marketingMarketPrice }}
									</view>
								</view>
								<view class="dz-marketing-sold">
									<text>
										{{ language.product.inviteBargain }} {{ language.application.moneySymbol
										}}{{ $api.helper.toFixed(marketingPrice - (1 - $api.helper.toFloat(product.marketing.min_rate / 100)) * marketingPrice, 2) }}
									</text>
									<view class="dz-marketing-tag">
										<dz-tag
											class="dz-m-l-10"
											size="mini"
											mode="plain"
											bg-color="transparent"
											:border-color="theme.dzBaseFontColor"
											:color="theme.dzBaseFontColor"
										>
											{{ language.product.marketingBargain }}
										</dz-tag>
									</view>
								</view>
							</view>
							<view class="dz-marketing-right" :style="{ background: theme.dzBaseLight }">
								<dz-button
									v-if="parseInt(product.marketing.state) === 2"
									:disabled="true"
									:border="false"
									:customStyle="{ background: theme.dzBaseLight, color: theme.dzBaseFontColor }"
								>
									{{ language.product.marketingFinished }}
								</dz-button>
								<text class="dz-base-color" v-if="parseInt(product.marketing.state) === 0">{{ language.product.marketingStart }}</text>
								<dz-count-down
									v-if="parseInt(product.marketing.state) === 0"
									:timestamp="product.marketing.start_time_left"
									:show-border="true"
									:color="theme.dzBaseFontColor"
									:separator-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:bg-color="theme.dzBaseColor"
									font-size="20"
									@end="marketingStart"
								></dz-count-down>
								<text class="dz-base-color" v-if="parseInt(product.marketing.state) === 1">{{ language.product.marketingFinish }}</text>
								<dz-count-down
									v-if="parseInt(product.marketing.state) === 1"
									:timestamp="product.marketing.end_time_left"
									:show-border="true"
									:color="theme.dzBaseFontColor"
									:separator-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:bg-color="theme.dzBaseColor"
									font-size="20"
									@end="marketingEnd"
								></dz-count-down>
							</view>
						</view>
					</block>
					<!--限时折扣-->
					<block v-else-if="product.marketing_type == 'discount'">
						<view class="dz-marketing-price">
							<view
								class="dz-marketing-pricebox dz-marketing-left dz-padding"
								:style="{ background: 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')', color: theme.dzBaseFontColor }"
							>
								<view class="dz-marketing-pro-price">
									<view>
										<text>{{ language.application.moneySymbol }}</text>
										<text class="dz-price">{{ currentProductPrice }}</text>
									</view>
									<view class="dz-marketing-original-price" v-if="product.price">{{ language.application.moneySymbol }}{{ product.price }}</view>
								</view>
								<view class="dz-marketing-sold">
									<text>
										{{ language.product.marketingDiscountTip
										}}{{ $api.helper.formatString(language.product.marketingDiscountInfo, product.marketing.discount) }}
									</text>
									<view class="dz-marketing-tag">
										<dz-tag
											class="dz-m-l-10"
											size="mini"
											mode="plain"
											bg-color="transparent"
											:border-color="theme.dzBaseFontColor"
											:color="theme.dzBaseFontColor"
										>
											{{ language.product.marketingDiscount }}
										</dz-tag>
									</view>
								</view>
							</view>
							<view class="dz-marketing-right" :style="{ background: theme.dzBaseLight }">
								<dz-button v-if="parseInt(product.marketing.state) === 2" type="info" size="medium" :disabled="true">
									{{ language.product.marketingFinished }}
								</dz-button>
								<text class="dz-base-color" v-if="parseInt(product.marketing.state) === 0">{{ language.product.marketingStart }}</text>
								<dz-count-down
									v-if="parseInt(product.marketing.state) === 0"
									:timestamp="product.marketing.start_time_left"
									:show-border="true"
									:color="theme.dzBaseFontColor"
									:separator-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:bg-color="theme.dzBaseColor"
									font-size="20"
									@end="marketingStart"
								></dz-count-down>
								<text class="dz-base-color" v-if="parseInt(product.marketing.state) === 1">{{ language.product.marketingFinish }}</text>
								<dz-count-down
									v-if="parseInt(product.marketing.state) === 1"
									:timestamp="product.marketing.end_time_left"
									:show-border="true"
									:color="theme.dzBaseFontColor"
									:separator-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:bg-color="theme.dzBaseColor"
									font-size="20"
									@end="marketingEnd"
								></dz-count-down>
							</view>
						</view>
					</block>
					<!--团购-->
					<block v-else-if="product.marketing_type == 'group_buy'">
						<view class="dz-marketing-price">
							<view
								class="dz-marketing-pricebox dz-marketing-left dz-padding"
								:style="{ background: 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')', color: theme.dzBaseFontColor }"
							>
								<view class="dz-marketing-pro-price">
									<view>
										<text>{{ language.application.moneySymbol }}</text>
										<text class="dz-price">{{ currentProductPrice }}</text>
									</view>
									<view class="dz-marketing-original-price" v-if="product.market_price > product.price">
										{{ language.application.moneySymbol }}{{ product.market_price }}
									</view>
								</view>
								<view class="dz-marketing-sold">
									<text>
										{{
											product.marketing.remark
												? product.marketing.remark
												: $api.helper.formatString(language.product.marketingGroupBuyInfo, product.marketing.min_num, product.marketing.max_num)
										}}
									</text>
									<view class="dz-marketing-tag">
										<dz-tag
											class="dz-m-l-10"
											size="mini"
											mode="plain"
											bg-color="transparent"
											:border-color="theme.dzBaseFontColor"
											:color="theme.dzBaseFontColor"
										>
											{{ language.product.marketingGroupBuy }}
										</dz-tag>
									</view>
								</view>
							</view>
							<view class="dz-marketing-right" :style="{ background: theme.dzBaseLight }">
								<dz-button
									v-if="parseInt(product.marketing.state) === 2"
									:border="false"
									:customStyle="{ background: theme.dzBaseLight, color: theme.dzBaseFontColor }"
									:disabled="true"
								>
									{{ language.product.marketingFinished }}
								</dz-button>
								<text class="dz-base-color" v-if="parseInt(product.marketing.state) === 0">{{ language.product.marketingStart }}</text>
								<dz-count-down
									v-if="parseInt(product.marketing.state) === 0"
									:timestamp="product.marketing.start_time_left"
									:show-border="true"
									:color="theme.dzBaseFontColor"
									:separator-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:bg-color="theme.dzBaseColor"
									font-size="20"
									@end="marketingStart"
								></dz-count-down>
								<text class="dz-base-color" v-if="parseInt(product.marketing.state) === 1">{{ language.product.marketingFinish }}</text>
								<dz-count-down
									v-if="parseInt(product.marketing.state) === 1"
									:timestamp="product.marketing.end_time_left"
									:show-border="true"
									:color="theme.dzBaseFontColor"
									:separator-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:bg-color="theme.dzBaseColor"
									font-size="20"
									@end="marketingEnd"
								></dz-count-down>
							</view>
						</view>
					</block>
					<!--拼团-->
					<block v-else-if="product.marketing_type == 'wholesale'">
						<view class="dz-marketing-price">
							<view
								class="dz-marketing-pricebox dz-marketing-presale dz-padding"
								:style="{ background: 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')', color: theme.dzBaseFontColor }"
							>
								<view class="dz-marketing-pro-price">
									<view>
										<text>{{ language.application.moneySymbol }}</text>
										<text class="dz-price">{{ currentProductPrice }}</text>
									</view>
									<view class="dz-marketing-original-price" v-if="product.market_price > product.price">
										{{ language.application.moneySymbol }}{{ product.market_price }}
									</view>
								</view>
								<view class="dz-marketing-sold">
									<view style="width: 90%;">
										<dz-tag
											class="dz-m-r-10"
											size="mini"
											mode="plain"
											bg-color="transparent"
											:border-color="theme.dzBaseFontColor"
											:color="theme.dzBaseFontColor"
										>
											{{ $api.helper.formatString(language.product.marketingWholesaleNum, product.marketing.num) }}
										</dz-tag>
										{{
											wholesaleInfo.length > 0 && wholesaleInfo[1].total != '0'
												? $api.helper.formatString(language.product.marketingWholesaleSuccess, wholesaleInfo[1].total)
												: $api.helper.formatString(language.product.marketingWholesaleValidTime, product.marketing.valid_time)
										}}
									</view>
								</view>
								<view class="dz-m-t-10" v-if="product.marketing.remark">{{ product.marketing.remark }}</view>
							</view>
						</view>
					</block>
					<!--TODO 预约购买-->
					<block v-else-if="product.marketing_type == 'subscribe_buy'"></block>
				</block>
				<!--公共属性-->
				<view class="dz-pro-titbox">
					<view
						class="dz-font-sm dz-m-t-10"
						v-if="
							(isBuyMode || product.marketing_type == '') &&
								parseInt(product.is_open_presell) !== 1 &&
								parseInt(product.point_exchange_type) === 1 &&
								product.pointConfig &&
								product.pointConfig.is_open &&
								product.pointConfig.is_open == 1 &&
								parseInt(product.max_use_point) > 0
						"
					>
						每件商品最多可用{{ product.max_use_point }}{{ language.product.point }}抵扣{{
							parseInt(product.max_use_point) * parseFloat(product.pointConfig.convert_rate)
						}}元
					</view>
					<view class="dz-pro-title">
						<!--会员折扣标记-->
						<dz-icon
							v-if="product.memberDiscount && product.memberDiscount.discount && product.memberDiscount.discount > 0"
							class="dz-m-r-10"
							size="40"
							:color="theme.dzBaseColor"
							name="memberDiscount"
						></dz-icon>
						<!--虚拟产品标记-->
						<dz-icon v-if="parseInt(product.is_virtual) === 1" class="dz-m-r-10" size="40" :color="theme.dzBaseColor" name="virtualProduct"></dz-icon>
						{{ product.name }}
					</view>
					<button v-if="shopSetting.product_poster_is_open == 1" class="dz-transparent-btn dz-poster-position" @tap="posterClick">
						<dz-tag class="dz-poster-box" type="info" size="mini" shape="circleLeft" :bgColor="theme.dzBgColor" :borderColor="theme.dzBgColor" color="#999">
							<dz-icon name="piclight" color="#999" :size="28"></dz-icon>
							<text class="dz-poster-text dz-gray dz-size">{{ language.product.poster }}</text>
						</dz-tag>
					</button>
				</view>
				<view class="dz-padding dz-p-b-30">
					<view class="dz-sub-title dz-size dz-gray" v-if="product.sketch">{{ product.sketch }}</view>
					<view class="dz-sale-info dz-size dz-gray">
						<view>{{ language.product.shipping }}:{{ parseInt(product.shipping_type) === 1 ? language.product.shippingFree : ((product.shippingTemplate && product.shippingTemplate.short_description)?product.shippingTemplate.short_description:language.product.shippingPay) }}</view>
						<view>{{ language.product.monthSale }}{{ product.total_sales || '-' }}</view>
						<view class="dz-line-1">{{ product.address_name || '' }}</view>
					</view>
				</view>
				<!--公共属性-->
			</view>

			<!--预售玩法-->
			<block v-if="isBuyMode && parseInt(product.is_open_presell) === 1">
				<view class="dz-group-rule dz-mtop dz-radius-all">
					<dz-cell-item
						bg-color="#FFF"
						hover-class=""
						:title-style="{ fontWeight: 'bold' }"
						:title="language.product.presellRuleTitle"
						:value="language.product.presellRuleInfo"
						@click="presellRuleClick"
					></dz-cell-item>
					<view class="dz-step__box">
						<view class="dz-step-item">
							<image :src="assets.presellStep1"></image>
							<view class="dz-step-text">{{ language.product.presellRuleStep1 }}</view>
						</view>
						<view class="dz-step-arrow"><image :src="assets.stepArrow"></image></view>
						<view class="dz-step-item">
							<image :src="assets.presellStep2"></image>
							<view class="dz-step-text">{{ language.product.presellRuleStep2 }}</view>
						</view>
						<view class="dz-step-arrow"><image :src="assets.stepArrow"></image></view>
						<view class="dz-step-item">
							<image :src="assets.presellStep3"></image>
							<view class="dz-step-text">{{ language.product.presellRuleStep3 }}</view>
						</view>
						<view class="dz-step-arrow"><image :src="assets.stepArrow"></image></view>
						<view class="dz-step-item">
							<image :src="assets.presellStep4"></image>
							<view class="dz-step-text">{{ language.product.presellRuleStep4 }}</view>
						</view>
					</view>
				</view>
				<dz-popup v-model="presellRuleShow" mode="center" border-radius="40" length="84%">
					<view style="padding: 30rpx 40rpx;">
						<view class="dz-modal__title">{{ language.product.presellRuleModelTitle }}</view>
						<view class="dz-modal__p" v-for="(item, index) in language.product.presellRuleModelInfo" :key="index">{{ item }}</view>
						<view class="dz-modal__btn">
							<dz-button
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
								hover-class="none"
								size="medium"
								shape="circle"
								@click="hidePresellRule"
							>
								{{ language.application.gotIt }}
							</dz-button>
						</view>
					</view>
				</dz-popup>
			</block>

			<!--拼团内容-->
			<block v-if="!isBuyMode && wholesaleInfo.length > 0 && wholesaleInfo[0].total != '0' && product.marketing_type == 'wholesale'">
				<view class="dz-radius-all dz-mtop">
					<dz-cell-item
						bg-color="#FFF"
						hover-class=""
						:title-style="{ fontWeight: 'bold' }"
						:title="$api.helper.formatString(language.product.wholesaleJoinTitle, wholesaleInfo[0].total)"
						:arrow="false"
					></dz-cell-item>
					<swiper
						v-if="wholesaleInfo[0].list.length > 0"
						:indicator-dots="false"
						:autoplay="true"
						:interval="5000"
						:duration="500"
						:circular="true"
						:display-multiple-items="wholesaleInfo[0].list.length > 1 ? 2 : 1"
						:vertical="true"
						:class="[wholesaleInfo[0].list.length > 1 ? 'dz-group-swiper-multi' : 'dz-group-swiper-sigle', 'dz-group-swiper']"
					>
						<block v-for="(item, index) in wholesaleInfo[0].list" :key="index">
							<swiper-item>
								<view class="dz-group-user">
									<view class="dz-user-left">
										<image :src="item.member_head_portrait || assets.missingFace" :lazy-load="true"></image>
										<view class="dz-user-anme">{{ item.member_nickname || language.application.anonymous }}</view>
									</view>
									<view class="dz-user-right">
										<view class="dz-user-countdown">
											<view class="dz-group-num">{{ $api.helper.formatString(language.product.wholesaleLack, item.total_number - item.number) }}</view>
											<view class="dz-group-countdown">
												<view class="dz-countdown-right">{{ language.application.left }}</view>
												<dz-count-down
													:timestamp="item.end_time_left"
													:show-border="true"
													:color="theme.dzBaseFontColor"
													:separator-color="theme.dzBaseColor"
													:border-color="theme.dzBaseColor"
													:bg-color="theme.dzBaseColor"
													font-size="20"
												></dz-count-down>
												<view class="dz-countdown-left">{{ language.application.finished }}</view>
											</view>
										</view>
										<dz-button
											:border="false"
											:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
											hover-class="none"
											size="mini"
											shape="circle"
											@click="wholesaleJoinClick(item.id)"
										>
											{{ language.product.wholesaleJoin }}
										</dz-button>
									</view>
								</view>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</block>
			<block v-if="!isBuyMode && product.marketing_type == 'wholesale'">
				<!--拼团规则玩法介绍-->
				<view class="dz-group-rule dz-mtop dz-radius-all">
					<dz-cell-item
						bg-color="#FFF"
						hover-class=""
						:title-style="{ fontWeight: 'bold' }"
						:title="language.product.wholesaleRuleTitle"
						:value="language.product.wholesaleRuleInfo"
						@click="wholesaleRuleClick"
					></dz-cell-item>
					<view class="dz-step__box">
						<view class="dz-step-item">
							<image :src="assets.wholesaleStep1"></image>
							<view class="dz-step-text">{{ language.product.wholesaleRuleStep1 }}</view>
						</view>
						<view class="dz-step-arrow"><image :src="assets.stepArrow"></image></view>
						<view class="dz-step-item">
							<image :src="assets.wholesaleStep2"></image>
							<view class="dz-step-text">{{ language.product.wholesaleRuleStep2 }}</view>
						</view>
						<view class="dz-step-arrow"><image :src="assets.stepArrow"></image></view>
						<view class="dz-step-item">
							<image :src="assets.wholesaleStep3"></image>
							<view class="dz-step-text">{{ language.product.wholesaleRuleStep3 }}</view>
						</view>
						<view class="dz-step-arrow"><image :src="assets.stepArrow"></image></view>
						<view class="dz-step-item">
							<image :src="assets.wholesaleStep4"></image>
							<view class="dz-step-text">{{ language.product.wholesaleRuleStep4 }}</view>
						</view>
					</view>
				</view>
				<dz-popup v-model="wholesaleRuleShow" mode="center" border-radius="40" length="84%">
					<view style="padding: 30rpx 40rpx;">
						<view class="dz-modal__title">{{ language.product.wholesaleRuleModelTitle }}</view>
						<view class="dz-modal__p" v-for="(item, index) in language.product.wholesaleRuleModelInfo" :key="index">{{ item }}</view>
						<view class="dz-modal__btn">
							<dz-button
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
								hover-class="none"
								size="medium"
								shape="circle"
								@click="hideWholesaleRule"
							>
								{{ language.application.gotIt }}
							</dz-button>
						</view>
					</view>
				</dz-popup>
			</block>
			<!--拼团内容-->

			<!--商品说明-->
			<view class="dz-discount-box dz-radius-all dz-mtop">
				<!--优惠券-->
				<view class="dz-list-cell" v-if="product.canReceiveCoupon && product.canReceiveCoupon.length > 0" @tap="coupon">
					<view class="dz-bold dz-cell-title">{{ language.product.coupon }}</view>
					<view class="dz-flex-center">
						<view style="line-height: 48rpx;">
							<block v-for="(item, index) in product.canReceiveCoupon" :key="index">
								<dz-tag
									v-if="parseInt(item.is_show) == 1"
									class="dz-m-r-10"
									size="mini"
									:bg-color="theme.dzBaseColor"
									:border-color="theme.dzBaseColor"
									:color="theme.dzBaseFontColor"
								>
									{{
										$api.helper.toFloat(item.at_least) > 0 && item.type != 2
											? $api.helper.formatString(language.product.overMoney, $api.helper.toFloat(item.at_least))
											: ''
									}}{{
										item.type == 1
											? $api.helper.formatString(language.product.discountMoney, $api.helper.toFloat(item.money))
											: $api.helper.formatString(language.product.discountPercent, $api.helper.toFloat(item.discount / 10))
									}}
								</dz-tag>
							</block>
						</view>
					</view>
					<view class="dz-ml-auto"><dz-icon name="more" :size="40" color="#666"></dz-icon></view>
				</view>
				<!--库存-->
				<view class="dz-list-cell" v-if="parseInt(product.is_stock_visible) == 1">
					<view class="dz-bold dz-cell-title">{{ language.product.store }}</view>
					<view class="dz-flex-center">
						<text class="dz-base-color dz-bold" v-if="parseInt(product.stock) === 0">{{ language.product.outOfStockTip }}</text>
						<text v-else>{{ `${language.product.left} ${product.stock} ${product.unit || language.application.unit}` }}</text>
					</view>
				</view>
				<!--会员折扣-->
				<view class="dz-list-cell" v-if="product.memberDiscount && product.memberDiscount.discount && product.memberDiscount.discount > 0">
					<view class="dz-bold dz-cell-title">{{ language.product.member }}</view>
					<view class="dz-flex-center">
						<text>{{ $api.helper.formatString(language.product.memberDiscountPercent, product.memberDiscount.discount) }}</text>
					</view>
				</view>
				<!--限购-->
				<view class="dz-list-cell" v-if="isBuyMode && parseInt(product.max_buy) > 0">
					<view class="dz-bold dz-cell-title">{{ language.product.maxBuy }}</view>
					<view class="dz-flex-center">
						<text>{{ `${$api.helper.formatString(language.product.maxBuyPertime, product.max_buy)} ${product.unit || language.application.unit}` }}</text>
					</view>
				</view>
				<!--包邮-->
				<view class="dz-list-cell" v-if="product.fullMail && product.fullMail.is_open == '1' && parseInt(product.shipping_type) !== 1">
					<view class="dz-bold dz-cell-title">{{ language.product.shippingFree }}</view>
					<view class="dz-flex-center">
						<text>{{ $api.helper.formatString(language.product.overMoneyShippingFree, language.application.moneySymbol + product.fullMail.full_mail_money) }}</text>
					</view>
				</view>
				<!--邮费说明-->
				<view class="dz-list-cell" v-if="product.shippingTemplate && product.fullMail && product.fullMail.is_open == '0' && parseInt(product.shipping_type) !== 1">
					<view class="dz-bold dz-cell-title">{{ language.product.shippingInfo }}</view>
					<view class="dz-flex-center">
						<text>{{ product.shippingTemplate.description }}</text>
					</view>
				</view>
				<!--满减送-->
				<view class="dz-list-cell" v-if="product.fullGiveRule && product.fullGiveRule.length > 0">
					<view class="dz-bold dz-cell-title">{{ language.product.overReduce }}</view>
					<view>
						<view class="dz-promotion-box" style="width: 100%;" v-for="(item, index) in product.fullGiveRule" :key="index">
							<text>{{ item }}</text>
						</view>
					</view>
				</view>
				<!--赠送积分-->
				<view class="dz-list-cell" v-if="parseInt(product.give_point) > 0">
					<view class="dz-bold dz-cell-title">{{ language.product.point }}</view>
					<view class="dz-flex-center">
						<text>
							{{
								$api.helper.formatString(
									language.product.overPointShipping,
									parseInt(product.integral_give_type) === 1
										? Math.round((parseInt(product.give_point) / 100) * parseInt(product.minSkuPrice))
										: parseInt(product.give_point)
								)
							}}
						</text>
					</view>
				</view>
				<!--积分抵扣-->
				<view
					class="dz-list-cell"
					v-if="parseInt(product.point_exchange_type) === 1 && product.pointConfig && product.pointConfig.is_open == 1 && parseInt(product.max_use_point) > 0"
				>
					<view class="dz-bold dz-cell-title">{{ language.product.deduct }}</view>
					<view>
						<view class="dz-promotion-box" style="width: 100%;">
							<text>
								{{
									$api.helper.formatString(
										language.product.deductByPoints,
										product.max_use_point,
										parseInt(product.max_use_point) * parseFloat(product.pointConfig.convert_rate)
									)
								}}
							</text>
						</view>
						<view class="dz-promotion-box" style="width: 100%;" v-if="product.pointConfig.desc">
							<text>{{ product.pointConfig.desc }}</text>
						</view>
					</view>
				</view>
				<!--必须加上积分购买-->
				<view class="dz-list-cell" v-if="parseInt(product.point_exchange_type) === 2">
					<view class="dz-bold dz-cell-title">{{ language.product.needPoint }}</view>
					<view class="dz-flex-center">
						<text>{{ $api.helper.formatString(language.product.needPointInfo, product.point_exchange) }}</text>
					</view>
				</view>
				<!--积分换购或者直接现金购买-->
				<view class="dz-list-cell" v-if="parseInt(product.point_exchange_type) === 3 || parseInt(product.point_exchange_type) === 4">
					<view class="dz-bold dz-cell-title">{{ language.product.exchange }}</view>
					<view class="dz-flex-center">
						<text>{{ $api.helper.formatString(language.product.exchangeByPointsTip, product.point_exchange) }}</text>
					</view>
				</view>
				<!--阶梯优惠-->
				<view class="dz-list-cell" v-if="product.ladderPreferential && product.ladderPreferential.length > 0">
					<view class="dz-bold dz-cell-title">{{ language.product.preferential }}</view>
					<view>
						<view class="dz-promotion-box" style="width: 100%;" v-for="(item, index) in product.ladderPreferential" :key="index">
							<text>
								{{
									parseInt(item.type) === 1
										? $api.helper.formatString(
												language.product.overQuantityMoney,
												item.quantity + (product.unit || language.application.unit),
												product.unit || language.application.unit,
												item.price
										  )
										: $api.helper.formatString(
												language.product.overQuantityDiscount,
												item.quantity + (product.unit || language.application.unit),
												product.unit || language.application.unit,
												item.price
										  )
								}}
							</text>
						</view>
					</view>
				</view>
				<!--服务-->
				<view class="dz-guarantee" v-if="product.tags && product.tags.length > 0">
					<view class="dz-guarantee-item" v-for="(item, index) in product.tags" :key="index">
						<dz-icon name="roundcheck" :size="28" color="#999"></dz-icon>
						<text class="dz-pl">{{ item }}</text>
					</view>
				</view>
			</view>
			<!--商品说明-->

			<!--组合套餐-->
			<view class="dz-basic-info dz-mtop dz-radius-all" v-if="product.combination && product.combination.length > 0">
				<dz-cell-item
					bg-color="#FFF"
					hover-class=""
					:title-style="{ fontWeight: 'bold' }"
					:title="$api.helper.formatString(language.product.combination, product.combination.length)"
					:value="language.product.combinationTip"
					:arrow="false"
				></dz-cell-item>
				<scroll-view scroll-x class="combination-list">
					<view class="combination-item dz-border-right" v-for="item in product.combination" :key="item.id" @tap.stop="combinationClick(item.id)">
						<view class="combination-product-item" v-for="subItem in item.combinationProduct" :key="subItem.id">
							<image class="combination-product-img" :src="subItem.product.picture" mode="aspectFill"></image>
							<text class="combination-product-price">{{ language.application.moneySymbol }}{{ subItem.product.price }}</text>
						</view>
						<view class="combination-product-title">{{ item.name }}</view>
					</view>
				</scroll-view>
			</view>
			<!--组合套餐-->

			<!--评价-->
			<view class="dz-cmt-box dz-mtop dz-radius-all">
				<dz-cell-item
					bg-color="#FFF"
					hover-class=""
					:title-style="{ fontWeight: 'bold' }"
					:title="$api.helper.formatString(language.product.evaluate, (product.evaluateStat && product.evaluateStat.total_num) || 0)"
					:value="$api.helper.formatString(language.product.evaluateGoodRate, product.match_ratio)"
					@click="evaluationClick"
				></dz-cell-item>
				<view v-if="product.evaluate && product.evaluate.length > 0">
					<view class="dz-evaluate-box" v-for="(item, index) in product.evaluate" :key="index" v-if="index < 3">
						<image class="portrait" :src="item.member_head_portrait || assets.missingFace" mode="aspectFill"></image>
						<view class="right">
							<view class="name">
								<text>{{ item.member_nickname || language.application.anonymous }}</text>
								<dz-rate :value="item.scores" :disabled="true" active-icon="favor_fill_light"></dz-rate>
							</view>
							<text class="con dz-line-2">{{ item.content || language.product.evaluateDefault }}</text>
							<view class="bot">
								<text class="attr">{{ item.sku_name || language.application.defaultSkuName }}</text>
								<text class="time">{{ item.created_at | timeFormat }}</text>
							</view>
						</view>
					</view>
					<view class="dz-cmt-btn">
						<dz-button
							type="info"
							shape="circle"
							size="medium"
							hoverClass="none"
							:border="false"
							:custom-style="{ width: '240rpx', height: '64rpx', lineHeight: '64rpx', background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
							@click="evaluationClick"
						>
							{{ language.product.evaluateView }}
						</dz-button>
					</view>
				</view>
				<view v-else>
					<view style="width: 100%;text-align: center;padding: 40rpx 20rpx;">{{ language.product.evaluateEmpty }}</view>
				</view>
			</view>
			<!--评价-->

			<!--商品详情-->
			<view class="dz-product-detail">
				<dz-divider margin-top="20" margin-bottom="20">{{ language.product.productDetail }}</dz-divider>
				<dz-parse class="dz-product-img" :html="product.intro" lazy-load></dz-parse>
				<dz-divider margin-top="20" margin-bottom="20">{{ language.product.reachBottom }}</dz-divider>
				<view class="dz-safearea-bottom"></view>
			</view>
		</view>
		<!--属性-->

		<!--底部操作栏-->
		<view class="dz-operation">
			<view class="dz-operation-left" :class="[customerService ? 'dz-col-3' : 'dz-col-1-5']">
				<view v-if="customerService" class="dz-operation-item" hover-class="dz-opcity" :hover-stay-time="150">
					<dz-button
						open-type="contact"
						:sessionFrom="sessionFrom"
						@click="serviceTap"
						:border="false"
						hover-class="none"
						:custom-style="{
							display: 'block',
							background: 'transparent',
							margin: '0rpx',
							padding: '0rpx',
							borderRadius: '0rpx',
							borderWidth: '0rpx',
							lineHeight: '1',
							width: '100%',
							height: '100rpx'
						}"
					>
						<view class="dz-operation-item" hover-class="dz-opcity" style="height: 100rpx;">
							<dz-icon name="service" :size="46" :color="theme.dzMainColor"></dz-icon>
							<view class="dz-operation-text dz-scale-small">{{ language.product.onlineService }}</view>
							<dz-badge type="error" size="mini" :count="customerServiceUnread" :offset="[2, 0]"></dz-badge>
						</view>
					</dz-button>
				</view>
				<view class="dz-operation-item" hover-class="dz-opcity" :hover-stay-time="150" @tap.stop="cartTap">
					<dz-icon name="cart" :size="46" :color="theme.dzMainColor"></dz-icon>
					<view class="dz-operation-text dz-scale-small">{{ language.product.cart }}</view>
					<dz-badge type="error" size="mini" :count="cartNum" :offset="[-4, 20]"></dz-badge>
				</view>
			</view>
			<view class="dz-operation-right dz-right-flex dz-btnbox-4" :class="[customerService ? 'dz-col-7' : 'dz-col-8-5']">
				<block v-if="isBuyMode || product.marketing_type == ''">
					<block v-if="parseInt(product.is_open_presell) === 1">
						<!--预售-->
						<view class="dz-flex-1">
							<dz-button
								:custom-style="{ background: buyBtnDisabled ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, height: '100rpx' }"
								hover-class="none"
								:disabled="buyBtnDisabled"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								<view class="dz-btn__box">
									<view>
										{{
											buyBtnDisabled
												? language.product.outOfStock
												: `${language.product.depositPay}(${
														parseInt(product.presell_delivery_type) === 1
															? $api.helper.formatString(
																	language.product.preSaleDeliverTime,
																	$api.helper.timeFormat(product.presell_time, 'yyyy-mm-dd')
															  )
															: $api.helper.formatString(language.product.preSaleDeliverDay, product.presell_day)
												  })`
										}}
									</view>
									<view class="dz-flex-end">
										<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
										<view class="dz-size-32">{{ product.presell_price }}</view>
									</view>
								</view>
							</dz-button>
						</view>
					</block>
					<block v-else>
						<!--正常购买-->
						<!--购物车-->
						<view class="dz-flex-1" v-if="!cartBtnHide">
							<dz-button
								:custom-style="{
									background: buyBtnDisabled ? theme.dzSubDisabled : theme.dzSubColor,
									color: theme.dzBaseFontColor,
									width: '100%',
									height: '100rpx'
								}"
								hover-class="none"
								:disabled="buyBtnDisabled"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								{{ language.product.addToCart }}
							</dz-button>
						</view>
						<!--积分换购-->
						<view class="dz-flex-1" v-if="parseInt(product.point_exchange_type) === 3 || parseInt(product.point_exchange_type) === 4">
							<dz-button
								:custom-style="{
									background: buyBtnDisabled ? theme.dzSubDisabled : theme.dzSubColor,
									color: theme.dzBaseFontColor,
									width: '100%',
									height: '100rpx'
								}"
								hover-class="none"
								:disabled="buyBtnDisabled"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								<view class="dz-btn__box">
									<view>{{ buyBtnDisabled ? language.product.outOfStock : language.product.exchangeByPoints }}</view>
									<view class="dz-flex-end">
										<view class="dz-size-32">{{ product.point_exchange }}</view>
										<view class="dz-size-26 dz-m-l-5">{{ language.product.point }}</view>
									</view>
								</view>
							</dz-button>
						</view>
						<!--积分加钱-->
						<view class="dz-flex-1" v-if="parseInt(product.point_exchange_type) === 2">
							<dz-button
								:custom-style="{
									background: parseInt(currentSkuStock) === 0 ? theme.dzBaseDisabled : theme.dzBaseColor,
									color: theme.dzBaseFontColor,
									width: '100%',
									height: '100rpx'
								}"
								hover-class="none"
								:disabled="parseInt(currentSkuStock) === 0"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								<view class="dz-btn__box">
									<view>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : language.product.directBuy }}</view>
									<view class="dz-flex-end">
										<view class="dz-size-26">{{ $api.helper.formatString(language.product.needPointTip, product.point_exchange) }}</view>
									</view>
								</view>
							</dz-button>
						</view>
						<!--购买-->
						<view
							class="dz-flex-1"
							v-if="
								(parseInt(product.point_exchange_type) === 1 || !product.marketing_type) && (product.point_exchange_type != 2 && product.point_exchange_type != 4)
							"
						>
							<dz-button
								:custom-style="{
									background: buyBtnDisabled ? theme.dzBaseDisabled : theme.dzBaseColor,
									color: theme.dzBaseFontColor,
									width: '100%',
									height: '100rpx'
								}"
								hover-class="none"
								:disabled="buyBtnDisabled"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								<!--有会员折扣-->
								<block v-if="product.memberDiscount && product.memberDiscount.discount && product.memberDiscount.discount > 0">
									<view class="dz-btn__box">
										<view>{{ buyBtnDisabled ? language.product.outOfStock : language.product.directBuy }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.product.memberDiscount }} {{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ currentPrice }}</view>
										</view>
									</view>
								</block>
								<!--无会员折扣-->
								<block v-else>{{ buyBtnDisabled ? language.product.outOfStock : language.product.directBuy }}</block>
							</dz-button>
						</view>
					</block>
				</block>
				<block v-else>
					<!--拼团-->
					<block v-if="product.marketing_type === 'wholesale'">
						<block v-if="buyBtnDisabled">
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{ background: theme.dzBaseDisabled, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
									hover-class="none"
									:disabled="true"
									:border="false"
									shape="rightAngle"
								>
									{{ language.product.outOfStock }}
								</dz-button>
							</view>
						</block>
						<block v-else>
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{ background: theme.dzSubColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
									hover-class="none"
									:border="false"
									shape="rightAngle"
									@click="showPopup"
								>
									<view class="dz-btn__box">
										<view>{{ language.product.directBuy }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ marketingProductPrice }}</view>
										</view>
									</view>
								</dz-button>
							</view>
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
									hover-class="none"
									:border="false"
									shape="rightAngle"
									@click="wholesaleShowPopup"
								>
									<view class="dz-btn__box">
										<view>{{ language.product.wholesaleBuy }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ currentPrice }}</view>
										</view>
									</view>
								</dz-button>
							</view>
						</block>
					</block>
					<!--砍价-->
					<block v-else-if="product.marketing_type === 'bargain'">
						<block v-if="buyBtnDisabled || parseInt(product.marketing.state) !== 1">
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{ background: theme.dzBaseDisabled, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
									hover-class="none"
									:disabled="true"
									:border="false"
									shape="rightAngle"
								>
									{{ buyBtnDisabled ? language.product.outOfStock : parseInt(product.marketing.state) === 0 ? '活动即将开始' : '活动已结束' }}
								</dz-button>
							</view>
						</block>
						<block v-else>
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{ background: theme.dzSubColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
									hover-class="none"
									:border="false"
									shape="rightAngle"
									@click="showPopup"
								>
									<view class="dz-btn__box">
										<view>{{ language.product.directBuy }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ currentPrice }}</view>
										</view>
									</view>
								</dz-button>
							</view>
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
									hover-class="none"
									:border="false"
									shape="rightAngle"
									@click="showPopup"
								>
									<view class="dz-btn__box">
										<view>{{ language.product.bargainBudy }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.product.inviteBargain }} {{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">
												{{ $api.helper.toFixed(marketingPrice - (1 - $api.helper.toFloat(product.marketing.min_rate / 100)) * marketingPrice, 2) }}
											</view>
										</view>
									</view>
								</dz-button>
							</view>
						</block>
					</block>
					<!--团购-->
					<block v-else-if="product.marketing_type === 'group_buy'">
						<view class="dz-flex-1">
							<dz-button
								:custom-style="{
									background: buyBtnDisabled || parseInt(product.marketing.state) !== 1 ? theme.dzBaseDisabled : theme.dzBaseColor,
									color: theme.dzBaseFontColor,
									width: '100%',
									height: '100rpx'
								}"
								hover-class="none"
								:disabled="buyBtnDisabled || parseInt(product.marketing.state) !== 1"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								<view class="dz-btn__box">
									<view>
										{{
											buyBtnDisabled
												? language.product.outOfStock
												: parseInt(product.marketing.state) === 0
												? language.product.startSoon
												: parseInt(product.marketing.state) === 2
												? language.product.alreadyOver
												: language.product.groupBuy
										}}
									</view>
									<view class="dz-flex-end">
										<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
										<view class="dz-size-32">{{ currentPrice }}</view>
									</view>
								</view>
							</dz-button>
						</view>
					</block>
					<!--限时折扣-->
					<block v-else-if="product.marketing_type === 'discount'">
						<view class="dz-flex-1">
							<dz-button
								:custom-style="{
									background: buyBtnDisabled || parseInt(product.marketing.state) !== 1 ? theme.dzBaseDisabled : theme.dzBaseColor,
									color: theme.dzBaseFontColor,
									width: '100%',
									height: '100rpx'
								}"
								hover-class="none"
								:disabled="buyBtnDisabled || parseInt(product.marketing.state) !== 1"
								:border="false"
								shape="rightAngle"
								@click="showPopup"
							>
								<view class="dz-btn__box">
									<view>
										{{
											buyBtnDisabled
												? language.product.outOfStock
												: parseInt(product.marketing.state) === 0
												? language.product.startSoon
												: parseInt(product.marketing.state) === 2
												? language.product.alreadyOver
												: language.product.discountBuy
										}}
									</view>
									<view class="dz-flex-end">
										<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
										<view class="dz-size-32">{{ currentPrice }}</view>
									</view>
								</view>
							</dz-button>
						</view>
					</block>
				</block>
			</view>
		</view>
		<!--底部操作栏-->
		<!--底部弹出选择层-->
		<dz-popup v-model="popupShow" mode="bottom" border-radius="40" closeIcon="roundclose" closeIconSize="40" :closeable="true">
			<view class="dz-popup-box">
				<view class="dz-product-box dz-padding">
					<view class="dz-popup-img" @tap.stop="previewImgs(currentSkuPicture || product.picture, [currentSkuPicture || product.picture])">
						<dz-image :src="currentSkuPicture || product.picture" width="200" height="200" borderRadius="20"></dz-image>
					</view>
					<view class="dz-popup-price">
						<view class="dz-popup-title dz-line-2">{{ product.name }}</view>
						<view class="dz-amount dz-bold" :style="{ color: theme.dzBaseColor }">
							<!--会员折扣标记-->
							<dz-icon
								v-if="product.memberDiscount && product.memberDiscount.discount && product.memberDiscount.discount > 0"
								class="dz-m-r-10"
								size="40"
								:color="theme.dzBaseColor"
								name="memberDiscount"
							></dz-icon>
							{{ language.application.moneySymbol }}{{ currentPrice }}
						</view>
						<view v-if="selectArr.some(item => item != '')" class="dz-number">
							<dz-tag type="info" size="mini" :bgColor="theme.dzBgColor" :borderColor="theme.dzBgColor">
								{{ language.product.sku }}：
								<text class="selected-text dz-m-r-10" style="line-height: 32rpx;" v-for="(item, index) in selectArr" :key="index">{{ item }}</text>
							</dz-tag>
						</view>
						<view class="dz-number" v-if="currentSkuStock !== null && parseInt(product.is_stock_visible) == 1">
							<text class="selected-text">{{ language.product.store }}：{{ currentSkuStock }} {{ product.unit || language.application.unit }}</text>
						</view>
					</view>
				</view>
				<scroll-view scroll-y class="dz-popup-scroll">
					<view class="dz-scrollview-box">
						<block v-for="(item, index) in specList" :key="index">
							<view class="dz-bold dz-attr-title">{{ item.title }}</view>
							<view class="dz-attr-box">
								<block v-if="parseInt(item.show_type) === 3">
									<dz-row gutter="0">
										<block v-for="(childItem, childIndex) in specChildList" :key="childIndex">
											<dz-col v-if="childItem.base_spec_id === item.base_spec_id" :span="4">
												<view
													class="dz-sku"
													:style="{
														color: subIndex[index] == childIndex ? theme.dzBaseColor : '',
														borderColor: subIndex[index] == childIndex ? theme.dzBaseColor : '#f7f7f7',
														fontWeight: subIndex[index] == childIndex ? 'bold' : 500
													}"
													:class="[childItem.ishow ? '' : 'dz-pic-disabled', item.value.length > 3 ? 'dz-m-b-20' : '']"
													@tap="skuClick(childItem, index, childIndex, item.show_type)"
												>
													<dz-image :src="childItem.data || product.picture" borderRadius="20" width="190" height="190"></dz-image>

													<view class="sku-name dz-line-1">{{ childItem.title }}</view>
													<view class="icon" @tap.stop="previewImgs(childItem.data || product.picture, [childItem.data || product.picture])">
														<dz-icon name="change" size="28" color="#fff"></dz-icon>
													</view>
												</view>
											</dz-col>
										</block>
									</dz-row>
								</block>
								<block v-else-if="parseInt(item.show_type) === 2">
									<!--颜色属性-->
									<view
										class="dz-attr-item"
										v-if="childItem.base_spec_id === item.base_spec_id"
										:style="{
											color: subIndex[index] == childIndex ? theme.dzBaseColor : '#333'
										}"
										:class="[childItem.ishow ? '' : 'dz-pic-disabled', subIndex[index] == childIndex ? 'dz-attr-active' : '']"
										v-for="(childItem, childIndex) in specChildList"
										:key="childIndex"
										@tap="skuClick(childItem, index, childIndex, item.show_type)"
									>
										<view
											v-if="childItem.data"
											class="attr-color"
											:style="{
												backgroundColor: childItem.data
											}"
										></view>
										{{ childItem.title }}
									</view>
								</block>
								<block v-else>
									<!--文字属性-->
									<view
										class="dz-attr-item"
										v-if="childItem.base_spec_id === item.base_spec_id"
										:style="{
											color: subIndex[index] == childIndex ? theme.dzBaseColor : '#333',
											borderColor: subIndex[index] == childIndex ? theme.dzBaseColor : ''
										}"
										:class="[childItem.ishow ? '' : 'dz-disabled', subIndex[index] == childIndex ? 'dz-attr-active' : '']"
										v-for="(childItem, childIndex) in specChildList"
										:key="childIndex"
										@tap="skuClick(childItem, index, childIndex, item.show_type)"
									>
										{{ childItem.title }}
									</view>
								</block>
							</view>
						</block>
					</view>
				</scroll-view>
				<dz-line></dz-line>
				<view class="dz-number-box dz-bold dz-attr-title">
					<view class="dz-attr-title">{{ language.product.number }}</view>
					<dz-number-box
						:max="maxNum === 0 ? parseInt(currentSkuStock) : maxNum > parseInt(currentSkuStock) ? parseInt(currentSkuStock) : maxNum"
						:min="minNum"
						:disabled="parseInt(currentSkuStock) === 0"
						size="34"
						input-width="100"
						v-model="currentSkuNumber"
					></dz-number-box>
				</view>
				<view class="dz-operation dz-operation-right dz-right-flex dz-popup-btn">
					<block v-if="isBuyMode || product.marketing_type == ''">
						<block v-if="parseInt(product.is_open_presell) === 1">
							<!--预售-->
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 ? theme.dzBaseDisabled : theme.dzBaseColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0"
									:border="false"
									shape="rightAngle"
									@click="preSell"
								>
									<view class="dz-btn__box">
										<view>
											{{
												parseInt(currentSkuStock) === 0
													? language.product.outOfStock
													: language.helper.formatString(
															language.product.preBuy,
															parseInt(product.presell_delivery_type) === 1
																? $api.helper.formatString(
																		language.product.preSaleDeliverTime,
																		$api.helper.timeFormat(product.presell_time, 'yyyy-mm-dd')
																  )
																: $api.helper.formatString(language.product.preSaleDeliverDay, product.presell_day)
													  )
											}}
										</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ product.presell_price }}</view>
										</view>
									</view>
								</dz-button>
							</view>
						</block>
						<block v-else>
							<!--正常购买-->
							<!--购物车-->
							<view class="dz-flex-1" v-if="!cartBtnHide">
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 ? theme.dzSubDisabled : theme.dzSubColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0"
									:border="false"
									shape="rightAngle"
									@click="addToCart"
								>
									{{ language.product.addToCart }}
								</dz-button>
							</view>
							<!--纯积分换购-->
							<view class="dz-flex-1" v-if="parseInt(product.point_exchange_type) === 3 || parseInt(product.point_exchange_type) === 4">
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 ? theme.dzSubDisabled : theme.dzSubColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0"
									:border="false"
									shape="rightAngle"
									@click="pointExchange"
								>
									<view class="dz-btn__box">
										<view>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : language.product.exchangeByPoints }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-32">{{ product.point_exchange }}</view>
											<view class="dz-size-26 dz-m-l-5">{{ language.product.point }}</view>
										</view>
									</view>
								</dz-button>
							</view>
							<!--积分加钱-->
							<view class="dz-flex-1" v-if="parseInt(product.point_exchange_type) === 2">
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 ? theme.dzBaseDisabled : theme.dzBaseColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0"
									:border="false"
									shape="rightAngle"
									@click="pointExchange"
								>
									<view class="dz-btn__box">
										<view>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : language.product.directBuy }}</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ $api.helper.formatString(language.product.needPointTip, product.point_exchange) }}</view>
										</view>
									</view>
								</dz-button>
							</view>
							<!--直接购买-->
							<view
								class="dz-flex-1"
								v-if="
									(parseInt(product.point_exchange_type) === 1 || !product.marketing_type) &&
										(product.point_exchange_type != 2 && product.point_exchange_type != 4)
								"
							>
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 ? theme.dzBaseDisabled : theme.dzBaseColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0"
									:border="false"
									shape="rightAngle"
									@click="buy"
								>
									<!--有会员折扣-->
									<block v-if="product.memberDiscount && product.memberDiscount.discount && product.memberDiscount.discount > 0">
										<view class="dz-btn__box">
											<view>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : language.product.directBuy }}</view>
											<view class="dz-flex-end">
												<view class="dz-size-26">{{ language.product.memberDiscount }} {{ language.application.moneySymbol }}</view>
												<view class="dz-size-32">{{ currentPrice }}</view>
											</view>
										</view>
									</block>
									<!--无会员折扣-->
									<block v-else>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : language.product.directBuy }}</block>
								</dz-button>
							</view>
						</block>
					</block>
					<block v-else>
						<!--拼团-->
						<block v-if="product.marketing_type === 'wholesale'">
							<block v-if="parseInt(currentSkuStock) === 0">
								<view class="dz-flex-1">
									<dz-button
										:custom-style="{ background: theme.dzBaseDisabled, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
										hover-class="none"
										:disabled="true"
										:border="false"
										shape="rightAngle"
									>
										{{ language.product.outOfStock }}
									</dz-button>
								</view>
							</block>
							<block v-else>
								<view class="dz-flex-1">
									<dz-button
										:custom-style="{ background: theme.dzSubColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
										hover-class="none"
										:border="false"
										shape="rightAngle"
										@click="buy"
									>
										<view class="dz-btn__box">
											<view>{{ language.product.directBuy }}</view>
											<view class="dz-flex-end">
												<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
												<view class="dz-size-32">{{ marketingProductPrice }}</view>
											</view>
										</view>
									</dz-button>
								</view>
								<view class="dz-flex-1">
									<dz-button
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
										hover-class="none"
										:border="false"
										shape="rightAngle"
										@click="wholesaleBuy"
									>
										<view class="dz-btn__box">
											<view>{{ this.wholesaleJoinId ? language.product.wholesaleJoinBuy : language.product.wholesaleBuy }}</view>
											<view class="dz-flex-end">
												<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
												<view class="dz-size-32">{{ currentPrice }}</view>
											</view>
										</view>
									</dz-button>
								</view>
							</block>
						</block>
						<!--砍价-->
						<block v-else-if="product.marketing_type === 'bargain'">
							<block v-if="parseInt(currentSkuStock) === 0 || parseInt(product.marketing.state) !== 1">
								<view class="dz-flex-1">
									<dz-button
										:custom-style="{ background: theme.dzBaseDisabled, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
										hover-class="none"
										:disabled="true"
										:border="false"
										shape="rightAngle"
									>
										{{
											parseInt(currentSkuStock) === 0
												? language.product.outOfStock
												: parseInt(product.marketing.state) === 0
												? language.product.startSoon
												: language.product.alreadyOver
										}}
									</dz-button>
								</view>
							</block>
							<block v-else>
								<view class="dz-flex-1">
									<dz-button
										:custom-style="{ background: theme.dzSubColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
										hover-class="none"
										:border="false"
										shape="rightAngle"
										@click="buy"
									>
										<view class="dz-btn__box">
											<view>{{ language.product.directBuy }}</view>
											<view class="dz-flex-end">
												<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
												<view class="dz-size-32">{{ currentPrice }}</view>
											</view>
										</view>
									</dz-button>
								</view>
								<view class="dz-flex-1">
									<dz-button
										:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '100%', height: '100rpx' }"
										hover-class="none"
										:border="false"
										shape="rightAngle"
										@click="bargainBuy"
									>
										<view class="dz-btn__box">
											<view>{{ language.product.bargainBudy }}</view>
											<view class="dz-flex-end">
												<view class="dz-size-26">{{ language.product.inviteBargain }} {{ language.application.moneySymbol }}</view>
												<view class="dz-size-32">
													{{ $api.helper.toFixed(marketingPrice - (1 - $api.helper.toFloat(product.marketing.min_rate / 100)) * marketingPrice, 2) }}
												</view>
											</view>
										</view>
									</dz-button>
								</view>
							</block>
						</block>
						<!--团购-->
						<block v-else-if="product.marketing_type === 'group_buy'">
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 || parseInt(product.marketing.state) !== 1 ? theme.dzBaseDisabled : theme.dzBaseColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0 || parseInt(product.marketing.state) !== 1"
									:border="false"
									shape="rightAngle"
									@click="groupBuy"
								>
									<view class="dz-btn__box">
										<view>
											{{
												parseInt(currentSkuStock) === 0
													? language.product.outOfStock
													: parseInt(product.marketing.state) === 0
													? language.product.startSoon
													: parseInt(product.marketing.state) === 2
													? language.product.alreadyOver
													: language.product.groupBuy
											}}
										</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ currentPrice }}</view>
										</view>
									</view>
								</dz-button>
							</view>
						</block>
						<!--限时折扣-->
						<block v-else-if="product.marketing_type === 'discount'">
							<view class="dz-flex-1">
								<dz-button
									:custom-style="{
										background: parseInt(currentSkuStock) === 0 || parseInt(product.marketing.state) !== 1 ? theme.dzBaseDisabled : theme.dzBaseColor,
										color: theme.dzBaseFontColor,
										width: '100%',
										height: '100rpx'
									}"
									hover-class="none"
									:disabled="parseInt(currentSkuStock) === 0 || parseInt(product.marketing.state) !== 1"
									:border="false"
									shape="rightAngle"
									@click="discountBuy"
								>
									<view class="dz-btn__box">
										<view>
											{{
												parseInt(currentSkuStock) === 0
													? language.product.outOfStock
													: parseInt(product.marketing.state) === 0
													? language.product.startSoon
													: parseInt(product.marketing.state) === 2
													? language.product.alreadyOver
													: language.product.discountBuy
											}}
										</view>
										<view class="dz-flex-end">
											<view class="dz-size-26">{{ language.application.moneySymbol }}</view>
											<view class="dz-size-32">{{ currentPrice }}</view>
										</view>
									</view>
								</dz-button>
							</view>
						</block>
					</block>
				</view>
			</view>
		</dz-popup>
		<!--底部弹出选择层-->

		<!--优惠券列表-->
		<dz-popup v-model="couponShow" mode="bottom" border-radius="40">
			<scroll-view scroll-y style="max-height: 800rpx;" class="dz-coupon-list">
				<block v-for="(item, index) in product.canReceiveCoupon" :key="index">
					<view class="dz-coupon-item dz-m-t-20" v-if="parseInt(item.is_show) == 1">
						<image :src="assets.couponBg" class="dz-coupon-bg" mode="widthFix"></image>
						<view class="dz-coupon-item-left">
							<view class="dz-coupon-price-box" :style="{ color: theme.dzBaseColor }">
								<view class="dz-coupon-price-sign" v-if="parseInt(item.type) === 1">{{ language.application.moneySymbol }}</view>
								<!--dz-price-small 面值>4位数的时候为true-->
								<view class="dz-coupon-price" :class="{ 'dz-price-small': item.money.length > 4 }" v-if="parseInt(item.type) === 1">{{ item.money }}</view>
								<view class="dz-coupon-price" v-if="parseInt(item.type) === 2">{{ item.discount / 10 }}</view>
								<view class="dz-coupon-price-sign" v-if="parseInt(item.type) === 2">{{ language.product.couponDiscount }}券</view>
							</view>
							<view class="dz-coupon-intro" v-if="parseInt(item.at_least) > 0">{{ $api.helper.formatString(language.product.couponCondition, item.at_least) }}</view>
						</view>
						<view class="dz-coupon-item-right">
							<view class="dz-coupon-content">
								<view class="dz-coupon-title-box">
									<view class="dz-coupon-title">{{ item.title }}</view>
								</view>
								<view class="dz-coupon-rule">
									<view class="dz-rule-box dz-padding-btm">
										<view class="dz-coupon-circle"></view>

										<view class="dz-coupon-text dz-color-9">{{ parseInt(item.range_type) === 1 ? '全场商品可用' : '部分商品可用' }}</view>
									</view>
									<view class="dz-rule-box">
										<view class="dz-coupon-circle dz-flex-s"></view>
										<view class="dz-coupon-text dz-color-9">
											<text v-if="parseInt(item.term_of_validity_type) === 1">
												{{ $api.helper.formatString(language.product.couponValidity, item.fixed_term) }}
											</text>
											<text v-else>
												{{
													$api.helper.formatString(
														language.product.couponUseRange,
														$api.helper.timeFormat(item.start_time, 'yyyy-mm-dd'),
														$api.helper.timeFormat(item.end_time, 'yyyy-mm-dd')
													)
												}}
											</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="dz-btn-box">
							<dz-button
								:custom-style="{
									width: '136rpx',
									background: item.myGet && parseInt(item.max_fetch) == item.myGet.count ? '#f3f4f6' : theme.dzBaseColor,
									color: theme.dzBaseFontColor
								}"
								:disabled="item.myGet && parseInt(item.max_fetch) == item.myGet.count"
								hover-class="none"
								size="mini"
								@click="getCoupon(item, index)"
							>
								{{ item.myGet && parseInt(item.max_fetch) == item.myGet.count ? '已领取' : language.product.couponGet }}
							</dz-button>
						</view>
					</view>
				</block>
			</scroll-view>
		</dz-popup>
		<!--优惠券列表-->

		<!--海报-->
		<canvas class="hideCanvas" canvas-id="qrcode" style="width: 250px;height: 250px;" />
		<canvas class="hideCanvas" canvas-id="default_PosterCanvasId_product" id="default_PosterCanvasId_product" style="width:750rpx;height:1260rpx"></canvas>
		<dz-poster :show="posterShow" :poster="postPath" @hidePoster="hidePosterClick"></dz-poster>
		<!--海报-->
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import painter from '@/core/utils/mp-painter';
import uQRCode from '@/core/utils/uqrcode.js';
import appShare, { closeShare } from '@/core/utils/share';
import { mapState } from 'vuex';
export default {
	name: 'shop-product-detail',
	props: {
		//产品详情
		product: {
			type: Object,
			default() {
				return {
					memberDiscount: { discount: 0 }
				};
			}
		},
		//是否直接购买模式，如为true则不显示商品营销信息
		isBuyMode: {
			type: Boolean,
			default: true
		},
		//拼团信息
		wholesaleInfo: {
			type: Array,
			default() {
				return [];
			}
		},
		//是否显示客服
		customerService: {
			type: Boolean,
			default: false
		},
		//小程序客服用户信息
		sessionFrom: {
			type: String,
			default: ''
		},
		//是否显示分享按钮
		showShare: {
			type: Boolean,
			default: true
		},
		//分享数据
		shareData: {
			type: Object,
			default() {
				return {
					shareUrl: '',
					shareTitle: '',
					shareContent: '',
					shareImg: ''
				};
			}
		},
		// H5或者小程序打开指定页面后页面栈为1，这时候无法跳转到上一页，当页面栈为1的时候点击后退按钮跳转到的页面地址
		backRelaunchUrl: {
			type: String,
			default: '/pages/main/index/index'
		},
		//距离顶部的高度
		scrollTop: {
			type: [String, Number],
			default: 0
		}
	},
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			assets: this.$api.assetsConfig,
			height: 64, //header高度
			top: 26, //标题图标距离顶部距离
			scrollH: 0, //滚动总高度
			opcity: 0, //透明度
			iconOpcity: 0.5,
			title: this.$api.language.product.titleProduct,
			bannerIndex: 0,
			bannerLength: 1,
			bannerTagColor: 'rgba(0, 0, 0, 0.5)',
			currentProductPrice: '', //当前显示价格
			thirdPartyQrCodeImg: '', //小程序码
			wechatQrCodeImg: '', //关注公众号码
			posterShow: false, //是否显示海报弹窗
			wholesaleRuleShow: false, //是否显示拼团规则弹窗
			presellRuleShow: false, //是否显示预售规则弹窗
			couponShow: false, //是否显示优惠券弹窗
			minNum: 1, //当前最小购买数量
			maxNum: 0, //当前最大购买数量
			currentSkuStock: null, //当前选中规格库存
			currentSkuId: null, //当前选中规格ID
			currentSkuPrice: null, //当前选中规格产品价格
			currentSkuName: null, //当前选中规格名称
			currentSkuPicture: null, //当前选中的规格图片
			currentSkuNumber: 1, //当前选中规格的数量
			currentWholesaleOn: {
				//当前拼团信息
				order: []
			},
			wholesaleJoinId: '', //加入拼团ID
			popupShow: false, //规格弹窗
			specList: [], //属性列表
			specChildList: [], //属性内容
			specSelected: [], //已选规格

			postPath: '',
			value: 1,
			collected: false,

			difference: '', //sku列表
			shopItemInfo: {}, //存放要和选中的值进行匹配的数据
			selectArr: [], //存放被选中的值
			subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
			selectshop: {}, //存放最后选中的商品
			marketingPrice: null, // 营销多规格价格
			marketingMarketPrice: null, // 营销划线价格
			marketingProductPrice: null, // 营销多规格价格
			warehouseDistribution: false // 是否是云仓分销
		};
	},
	computed: {
		...mapState(['cartNum', 'customerServiceUnread', 'shopSetting', 'userInfo']),
		//计算购买按钮是否不可用
		buyBtnDisabled() {
			if (Object.keys(this.product).length === 0) {
				return true;
			}
			return parseInt(this.currentSkuStock || this.product.stock) === 0;
		},
		//计算购物车按钮是否不显示
		cartBtnHide() {
			if (Object.keys(this.product).length === 0) {
				return true;
			}
			return (this.isBuyMode || this.product.marketing_type == '') && (parseInt(this.product.point_exchange_type) > 1 || parseInt(this.product.is_virtual) === 1);
		},
		//计算拼团按钮是否不可用
		wholesaleBtnDisabled() {
			if (Object.keys(this.product).length === 0) {
				return true;
			}
			let hasLogin = this.$api.store.getters.hasLogin;
			let userInfo = this.$api.store.state.userInfo;
			if (!hasLogin) return true;
			let flag = false;
			this.currentWholesaleOn.order.forEach(item => {
				if (parseInt(item.buyer_id) === parseInt(userInfo && userInfo.account.id)) {
					flag = true;
				}
			});
			return flag;
		},
		//计算当前规格购买价格
		currentPrice() {
			if (Object.keys(this.product).length === 0) {
				return 0.0;
			}
			if (this.isBuyMode || !this.product.marketing_type) {
				let price = this.currentSkuPrice || this.product.minSkuPrice;
				//直接购买模式
				if (this.product.memberDiscount && parseFloat(this.product.memberDiscount.discount) > 0) {
					//会员折扣
					return parseFloat(price * (1 - parseFloat(this.product.memberDiscount.discount) / 100)).toFixed(2);
				} else {
					return parseFloat(price).toFixed(2);
				}
			} else {
				//营销模式
				let price;
				if (this.product.marketing_type === 'bargain') {
					//砍价
					price = this.marketingPrice ? this.marketingPrice : this.product.price;
				}
				if (this.product.marketing_type === 'discount') {
					//限时折扣
					const decimal = this.product.marketing && this.product.marketing.decimal_reservation_number;
					const discount = this.product.marketing && this.product.marketing.discount;
					price = this.currentSkuPrice || this.product.minSkuPrice;

					//限时折扣价格保留方式
					switch (parseInt(decimal)) {
						case -1:
							//保留角和分
							price = this.$api.helper.toFixed((price * discount) / 100, 2);
							break;
						case 0:
							//抹去角和分
							price = Math.floor((price * discount) / 100) * 10;
							price = (Math.round(price * 10) / 100).toFixed(0);
							break;
						case 1:
							//抹去分
							price = this.$api.helper.toFixed((price * discount) / 100, 1);
							break;
						default:
							price = this.$api.helper.toFixed((price * discount) / 100, 2);
					}
				}

				if (this.product.marketing_type === 'group_buy') {
					//团购
					price = this.marketingPrice ? this.marketingPrice : this.product.marketing.ladder.price;
				}
				if (this.product.marketing_type === 'wholesale') {
					//拼团
					price = this.marketingPrice ? this.marketingPrice : this.product.wholesale_price;
				}
				if (this.product.memberDiscount && parseFloat(this.product.memberDiscount.discount) > 0) {
					price = price * (1 - parseFloat(this.product.memberDiscount.discount) / 100);
				}
				return parseFloat(price || '0').toFixed(2);
			}
		}
	},
	watch: {
		scrollTop(val) {
			let scroll = val <= 0 ? 0 : val;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity);
		},
		product: {
			handler(val) {
				if (Object.keys(val).length === 0) {
					return;
				}

				//计算轮播图的数量
				this.bannerLength = val.covers.length;
				if (val.video_url) {
					this.bannerLength += 1;
				}

				//更换标题
				this.title = val.name;

				//判断是否收藏
				this.collected = !!val.myCollect;

				//判断最小购买数量
				if (!this.isBuyMode && val.marketing_type === 'group_buy') {
					this.currentSkuNumber = this.minNum = val.marketing ? parseInt(val.marketing.min_num) : 1;
				} else {
					this.currentSkuNumber = this.minNum = parseInt(val.min_buy) || 1;
				}

				//判断最大购买数量
				if (!this.isBuyMode) {
					if (val.marketing_type === 'group_buy') {
						this.maxNum = val.marketing ? parseInt(val.marketing.max_num) : 0;
					} else if (val.marketing_type === 'bargain') {
						this.maxNum = 1;
					} else if (val.marketing_type === 'wholesale') {
						//TODO 这里应该根据配置来判断最多可以购买多少件
						this.maxNum = 1;
					} else {
						this.maxNum = parseInt(val.max_buy);
					}
				} else {
					this.maxNum = parseInt(val.max_buy);
				}
				this.numberChange({ value: this.currentSkuNumber });

				//计算当前产品显示金额
				if (this.isBuyMode || !val.marketing_type) {
					//直接购买模式
					let minSkuPrice, maxSkuPrice;
					if (val.memberDiscount && parseFloat(val.memberDiscount.discount) > 0) {
						//会员折扣
						minSkuPrice = parseFloat(parseFloat(val.minSkuPrice) * (1 - parseFloat(val.memberDiscount.discount) / 100)).toFixed(2);
						maxSkuPrice = val.maxSkuPrice ? parseFloat(parseFloat(val.maxSkuPrice) * (1 - parseFloat(val.memberDiscount.discount / 100))).toFixed(2) : 0;
					} else {
						minSkuPrice = parseFloat(val.minSkuPrice).toFixed(2);
						maxSkuPrice = val.maxSkuPrice ? parseFloat(val.maxSkuPrice).toFixed(2) : 0;
					}
					this.currentProductPrice = maxSkuPrice && minSkuPrice !== maxSkuPrice ? minSkuPrice + ' ~ ' + maxSkuPrice : minSkuPrice;
				} else {
					//营销模式
					let price;
					if (val.marketing_type === 'bargain') {
						//砍价
						this.marketingPrice = val.price;
						price = this.marketingPrice ? this.marketingPrice : val.price;
					}
					if (val.marketing_type === 'discount') {
						//限时折扣
						const decimal = val.marketing && val.marketing.decimal_reservation_number;
						const discount = val.marketing && val.marketing.discount;
						price = val.minSkuPrice;
						//限时折扣价格保留方式
						switch (parseInt(decimal)) {
							case -1:
								//保留角和分
								price = this.$api.helper.toFixed((price * discount) / 100, 2);
								break;
							case 0:
								//抹去角和分
								price = Math.floor((price * discount) / 100) * 10;
								price = (Math.round(price * 10) / 100).toFixed(0);
								break;
							case 1:
								//抹去分
								price = this.$api.helper.toFixed((price * discount) / 100, 1);
								break;
							default:
								price = this.$api.helper.toFixed((price * discount) / 100, 2);
						}
					}
					if (val.marketing_type === 'group_buy') {
						//团购
						price = val.marketing.ladder.price;
					}
					if (val.marketing_type === 'wholesale') {
						//拼团
						price = val.wholesale_price;
						this.marketingProductPrice = val.minSkuPrice;
					}
					if (val.memberDiscount && val.memberDiscount.discount > 0) {
						price = price * (1 - val.memberDiscount.discount / 100);
					}
					this.marketingMarketPrice = val.market_price;

					this.currentProductPrice = parseFloat(price || '0').toFixed(2);
				}

				//初始化商品属性
				//这里要做deepclone，否则会触发多次watch
				this.specList = this.$api.helper.deepClone(val.base_attribute_format);
				this.specChildList = [];
				this.specList.forEach(item => {
					this.specChildList = [...this.specChildList, ...item.value];
				});
				this.specList.map(item => {
					this.selectArr.push('');
					this.subIndex.push(-1);
				});
				this.currentSkuStock = val.stock;
				const skus = this.$api.helper.deepClone(val.sku);
				this.warehouseDistribution = val.warehouseCommissionRate && val.warehouseCommissionRate.is_distribution == 1 && !val.marketing_type;
				let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';

				// 云仓进货价格
				if (this.warehouseDistribution && level_id) {
					const commissionRate = val.warehouseCommissionRate.commission_rate;
					skus.forEach(item => {
						for (let key in commissionRate) {
							if (item.id == key && commissionRate[key][level_id]) {
								item.price = commissionRate[key][level_id].brokerage > 0 ? commissionRate[key][level_id].brokerage : item.price;
							}
						}
					});
					this.currentSkuPrice = this.get_min(skus).toFixed(2);
					let minWarehouse = this.get_min(skus).toFixed(2);
					let maxWarehouse = this.get_max(skus).toFixed(2);

					if (val.memberDiscount && parseFloat(val.memberDiscount.discount) > 0) {
						//会员折扣
						minWarehouse = parseFloat(parseFloat(minWarehouse) * (1 - parseFloat(val.memberDiscount.discount) / 100)).toFixed(2);
						maxWarehouse = parseFloat(parseFloat(maxWarehouse) * (1 - parseFloat(val.memberDiscount.discount) / 100)).toFixed(2);
					}

					if (skus.length == 1) {
						this.currentProductPrice = minWarehouse;
					} else {
						this.currentProductPrice = minWarehouse + ' ~ ' + maxWarehouse;
					}
				}
				this.difference = skus;
				if (this.difference.length == 1) {
					this.currentSkuPicture = this.difference[0].picture;
					this.currentSkuPrice = this.difference[0].price;
					this.currentSkuId = this.difference[0].id;
					this.currentSkuName = this.difference[0].name;
					this.currentSkuStock = parseInt(this.difference[0].stock);
				}

				this.difference.forEach(item => {
					item.difference = [];
					item.difference = this.specIdsFormat(item.data, this.specChildList);
				});
				this.init();
				val.sku_data = val.sku.length ? val.sku[0].data : '';
				if (val.sku_data) {
					this.selectSku(this.specIdsFormat(val.sku_data, this.specChildList));
				}
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		let obj = {};
		// #ifdef MP-WEIXIN
		obj = wx.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-BAIDU
		obj = swan.getMenuButtonBoundingClientRect();
		// #endif
		// #ifdef MP-ALIPAY
		my.hideAddToDesktopMenu();
		// #endif
		let systemInfo = uni.getSystemInfoSync();
		this.width = obj.left || systemInfo.windowWidth;
		this.height = obj.top ? obj.top + obj.height + 8 : systemInfo.statusBarHeight + 44;
		this.top = obj.top ? obj.top + (obj.height - 32) / 2 : systemInfo.statusBarHeight + 6;
		this.scrollH = systemInfo.windowWidth;
		if (this.$api.store.getters.hasLogin) {
			this.getMemberInfo();
		}
	},
	methods: {
		// 初始化
		init() {
			let that = this;
			// 清空之前的数据
			that.selectArr = [];
			that.subIndex = [];
			that.selectShop = {};
			that.shopItemInfo = {};

			this.specList.map(item => {
				this.selectArr.push('');
				this.subIndex.push(-1);
			});

			this.checkItem(); //计算sku里面规格形成路径
			this.checkInpath(-1); //传-1是为了不跳过循环
		},
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
			});
		},
		get_min(list) {
			return Math.min.apply(
				Math,
				list.map(item => {
					return parseFloat(item.price);
				})
			);
		},
		get_max(list) {
			return Math.max.apply(
				Math,
				list.map(item => {
					return parseFloat(item.price);
				})
			);
		},
		specIdsFormat(sku, list) {
			let arr = [];
			let sotr = [];
			let skuIds = sku.split('-');
			sotr = list.filter(item => skuIds.indexOf(item.base_spec_value_id) > -1);
			if (sotr.length > 0) {
				sotr.forEach(item => {
					arr.push(item.title);
				});
			}
			return arr;
		},
		//新窗口播放产品视频
		vedioPlay() {
			this.$api.router.push({
				route: this.$api.routesConfig.vedio,
				query: {
					url: encodeURIComponent(this.product.video_url)
				}
			});
		},
		//产品图片轮播事件
		bannerChange(e) {
			this.bannerIndex = e.detail.current;
		},
		//预览产品图片
		previewBanner(e) {
			let index = e.currentTarget.dataset.index;
			uni.previewImage({
				current: this.product.covers[index],
				urls: this.product.covers
			});
		},
		//后退按钮点击事件
		backClick(type) {
			let pages = getCurrentPages();
			if (pages.length == 1 || type == 2) {
				let indexPath = this.backRelaunchUrl ? this.backRelaunchUrl : this.$api.appConfig.indexPath;
				uni.reLaunch({
					url: indexPath
				});
			} else {
				uni.navigateBack();
			}
		},
		//分享按钮点击事件
		shareClick() {
			let url = this.shareData.shareUrl;
			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				this.$refs.dzToast.show({
					title: this.$api.language.application.wxshareTip,
					type: 'warning'
				});
			} else {
				if (this.$api.helper.copy(url)) {
					this.$refs.dzToast.show({
						title: this.$api.language.application.shareUrlCopySuccess,
						type: 'success'
					});
				}
			}
			// #endif
			// #ifdef APP-PLUS
			appShare(this.shareData, res => {
				closeShare();
			});
			// #endif
		},
		wholesaleShowPopup() {
			this.wholesaleJoinId = '';
			this.showPopup();
		},
		showPopup() {
			if (parseInt(this.product.stock) === 0) {
				return;
			}
			this.popupShow = true;
		},
		numberChange(v) {
			this.currentSkuNumber = v.value;
		},
		hidePopup() {
			this.popupShow = false;
		},
		//需要登录
		login() {
			uni.navigateTo({
				url: this.$api.routesConfig.login.path,
				animationType: 'slide-in-bottom'
			});
		},
		//收藏
		collectClick() {
			if (!this.product.id) return;
			if (!this.$api.store.getters.hasLogin) {
				this.login();
			} else {
				//节流防抖
				this.$api.throttle(() => {
					this.collected ? this.handleCollectDel() : this.handleCollectCreate();
				}, 500);
			}
		},
		// 收藏商品
		async handleCollectCreate() {
			await this.$api.http
				.post(this.$api.apiShop.collectCreate, {
					topic_id: this.product.id,
					topic_type: 'product'
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: this.$api.language.product.collectSuccess,
						type: 'success'
					});

					this.product.myCollect = res.data;
					this.collected = true;
				});
		},
		// 取消收藏商品
		async handleCollectDel() {
			await this.$api.http
				.delete(
					this.$api.apiShop.collectDel,
					{},
					{
						params: {
							id: this.product.myCollect.id
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: this.$api.language.product.collectCancel,
						type: 'success'
					});

					this.collected = false;
				});
		},
		//弹出购买框
		submit() {
			this.popupShow = false;
		},
		//弹出优惠券
		coupon() {
			this.couponShow = true;
		},
		//点击生成海报
		async posterClick() {
			if (this.postPath) {
				this.posterShow = true;
				return;
			}
			if (Object.keys(this.product).length === 0) {
				return;
			}
			uni.showLoading({
				mask: true,
				title: this.$api.language.product.posterCreating
			});

			let userInfo = this.$api.store.state.userInfo;
			let qrcode;

			if (this.$api.shopSetting.product_poster_qr_type == 'mini_program_qr') {
				if (!this.thirdPartyQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyQrCode, {
							params: {
								id: this.product.id,
								marketing_type: this.isBuyMode ? '' : this.product.marketing_type
							}
						})
						.then(res => {
							this.thirdPartyQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				qrcode = this.thirdPartyQrCodeImg;
			} else if (this.$api.shopSetting.product_poster_qr_type == 'wechat_qr') {
				//公众号二维码
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				qrcode = this.wechatQrCodeImg;
			} else {
				//H5二维码
				qrcode = await new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: this.shareData.shareUrl,
						size: 230,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						correctLevel: uQRCode.defaults.correctLevel,
						success: res => {
							resolve(res);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			}
			try {
				let nickname = userInfo.nickname || this.$api.shopSetting.store_name;
				let avatar = userInfo.head_portrait || this.$api.shopSetting.store_logo;
				let shareTitle = this.shareData.shareTitle;
				let cover = this.product.picture;
				let price = `${this.$api.language.application.moneySymbol}${this.product.minSkuPrice}`;
				let productname = this.product.name;
				if (this.isBuyMode || !this.product.marketing_type) {
					//直接购买模式
					let minSkuPrice, maxSkuPrice;
					if (this.product.memberDiscount && parseFloat(this.product.memberDiscount.discount) > 0) {
						//会员折扣
						minSkuPrice = parseFloat(parseFloat(this.product.minSkuPrice) * (1 - parseFloat(this.product.memberDiscount.discount) / 100)).toFixed(2);
						maxSkuPrice = this.product.maxSkuPrice
							? parseFloat(parseFloat(this.product.maxSkuPrice) * (1 - parseFloat(this.product.memberDiscount.discount / 100))).toFixed(2)
							: 0;
					} else {
						minSkuPrice = parseFloat(this.product.minSkuPrice).toFixed(2);
						maxSkuPrice = this.product.maxSkuPrice ? parseFloat(this.product.maxSkuPrice).toFixed(2) : 0;
					}
					price = maxSkuPrice && minSkuPrice !== maxSkuPrice ? minSkuPrice + ' ~ ' + maxSkuPrice : minSkuPrice;
				} else {
					if (this.product.maxSkuPrice && this.product.maxSkuPrice != this.product.minSkuPrice) {
						price = `${this.$api.language.application.moneySymbol}${this.product.minSkuPrice} ~ ${this.product.maxSkuPrice}`;
					}
				}

				let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
				// 云仓进货价格
				if (this.warehouseDistribution && level_id) {
					price = this.currentProductPrice;
				}
				if (!this.isBuyMode && this.product.marketing_type) {
					price = this.currentPrice;
					if (this.product.marketing_type === 'bargain') {
						price = this.$api.helper.toFixed(this.marketingPrice - (1 - this.$api.helper.toFloat(this.product.marketing.min_rate / 100)) * this.marketingPrice, 2);
					}
				}
				// 积分商品
				if (this.product.point_exchange_type == 4) {
					price = this.product.point_exchange + '积分';
				}

				await new painter(uni.createCanvasContext('default_PosterCanvasId_product', this)).draw({
					type: 'container',
					top: 0,
					left: 0,
					children: [
						{ type: 'rect', top: 0, left: 0, width: 750, height: 1260, background: '#ffffff' },
						{
							type: 'clip',
							position: 'absolute',
							top: 38,
							left: 38,
							path: {
								type: 'rounded-rect',
								width: 136,
								height: 136,
								borderRadius: 68
							},
							content: {
								type: 'image',
								width: 136,
								height: 136,
								src: avatar
							}
						},
						{ type: 'text', position: 'absolute', top: shareTitle.length > 16 ? 50 : 75, left: 210, fontSize: 38, color: '#000', content: nickname },
						{
							type: 'text-block',
							position: 'absolute',
							top: shareTitle.length > 16 ? 103 : 128,
							left: 210,
							color: '#666',
							align: 'left',
							fontSize: 30,
							content: shareTitle,
							width: 500,
							height: 'auto',
							lineHeight: 43,
							lineClamp: 2
						},
						{
							type: 'clip',
							position: 'absolute',
							top: 197,
							left: 38,
							path: {
								type: 'rounded-rect',
								width: 690,
								height: 690,
								borderRadius: 75
							},
							content: {
								type: 'image',
								width: 690,
								height: 690,
								src: cover
							}
						},
						{ type: 'text', position: 'absolute', top: 932, left: 30, color: '#ff0000', align: 'left', fontSize: 46, content: price },
						{
							type: 'text-block',
							position: 'absolute',
							top: 1073,
							left: 38,
							color: '#000',
							align: 'left',
							fontSize: 32,
							content: productname,
							width: 450,
							height: 'auto',
							lineHeight: 45,
							lineClamp: 2
						},
						{ type: 'image', position: 'absolute', top: 983, left: 488, width: 225, height: 225, src: qrcode }
					]
				});
				uni.canvasToTempFilePath(
					{
						canvasId: 'default_PosterCanvasId_product',
						success: res => {
							this.postPath = res.tempFilePath;
							setTimeout(() => {
								this.posterShow = true;
							}, 100);
							uni.hideLoading();
						},
						fail: e => {
							console.log(e);
							this.$refs.dzToast.show({
								title: this.$api.language.product.posterCreateImageError,
								type: 'error'
							});

							uni.hideLoading();
						}
					},
					this
				);
			} catch (e) {
				console.log(e);
				this.$refs.dzToast.show({
					title: this.$api.language.product.posterCreateError,
					type: 'error'
				});

				uni.hideLoading();
			}
		},
		//生成海报二维码
		async getQr() {
			if (this.$api.shopSetting.product_poster_qr_type == 'common_qr') {
				//H5二维码
				return new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: this.shareData.shareUrl,
						size: 230,
						margin: 10,
						backgroundColor: '#ffffff',
						foregroundColor: '#000000',
						fileType: 'jpg',
						correctLevel: uQRCode.defaults.correctLevel,
						success: res => {
							resolve(res);
						},
						fail: res => {
							reject(res);
						}
					});
				});
			} else if (this.$api.shopSetting.product_poster_qr_type == 'wechat_qr') {
				//公众号二维码
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.data.ticket;
							return this.wechatQrCodeImg;
						})
						.catch(err => {});
				} else {
					return this.wechatQrCodeImg;
				}
			}
		},
		//隐藏海报
		hidePosterClick() {
			this.posterShow = false;
		},
		//营销活动开始
		marketingStart() {
			this.$set(this.product.marketing, 'state', 1);
		},
		//营销活动结束
		marketingEnd() {
			this.$set(this.product.marketing, 'state', 2);
		},
		//预售规则说明
		presellRuleClick() {
			this.presellRuleShow = true;
		},
		hidePresellRule() {
			this.presellRuleShow = false;
		},
		//拼团规则说明
		wholesaleRuleClick() {
			this.wholesaleRuleShow = true;
		},
		hideWholesaleRule() {
			this.wholesaleRuleShow = false;
		},
		//组合商品
		combinationClick(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.combinationList,
				query: {
					id
				}
			});
		},
		//评价
		evaluationClick(e) {
			if (!this.product.evaluateStat || (this.product.comment_num && parseInt(this.product.comment_num) === 0)) {
				return;
			}
			this.$api.router.push({
				route: this.$api.routesConfig.evaluationList,
				query: {
					ratio: this.product.match_ratio,
					...this.product.evaluateStat
				}
			});
		},
		skuClick(value, index1, index2, type) {
			let list = this.specChildList;
			// 图片
			if (parseInt(type) === 3) {
				this.currentPicture = list[index1].data;
			}
			this.selectshop = {};
			this.currentSkuId = '';
			this.currentSkuName = '';
			if (value.ishow) {
				if (this.selectArr[index1] != value.title) {
					this.$set(this.selectArr, index1, value.title);
					this.$set(this.subIndex, index1, index2);
				} else {
					this.$set(this.selectArr, index1, '');
					this.$set(this.subIndex, index1, -1);
				}
				this.checkInpath(index1);
				//如果全部选完
				if (this.selectArr.every(item => item != '')) {
					this.selectshop = this.shopItemInfo[this.selectArr];
					this.currentSkuPicture = this.selectshop.picture;
					this.currentSkuStock = parseInt(this.selectshop.stock);
					this.currentSkuPrice = this.selectshop.wholesale_price;

					if (!this.isBuyMode && this.product.marketing_type === 'wholesale') {
						//拼团
						this.marketingPrice = this.product.commission_price ? this.product.commission_price : this.selectshop.wholesale_price;
						this.marketingProductPrice = this.selectshop.price;
					} else if (!this.isBuyMode && this.product.marketing_type === 'bargain') {
						this.marketingPrice = this.selectshop.price;
						this.marketingMarketPrice = this.selectshop.market_price;
					} else if (!this.isBuyMode && this.product.marketing_type === 'group_buy') {
						this.marketingPrice = this.selectshop.group_buy_price;
						this.marketingMarketPrice = this.selectshop.group_buy_price;
					} else {
						this.currentSkuPrice = this.product.commission_price ? this.product.commission_price : this.selectshop.price;
					}
					this.currentSkuId = this.selectshop.id;
					this.currentSkuName = this.selectshop.name;
				} else {
					if (!this.isBuyMode && this.product.marketing_type === 'wholesale') {
						this.marketingPrice = this.product.commission_price;
						this.marketingProductPrice = this.product.minSkuPrice;
						this.currentSkuStock = this.product.stock;
					} else if (!this.isBuyMode && this.product.marketing_type === 'bargain') {
						this.marketingPrice = this.product.commission_price ? this.product.commission_price : this.product.price;
						this.marketingMarketPrice = this.product.market_price;
						this.currentSkuStock = this.product.stock;
					} else if (!this.isBuyMode && this.product.marketing_type === 'group_buy') {
						this.marketingPrice = this.product.commission_price ? this.product.commission_price : this.product.price;
						this.marketingMarketPrice = this.product.group_buy_price;
						this.currentSkuStock = this.product.stock;
					} else {
						this.currentSkuPrice = this.warehouseDistribution ? this.get_min(this.difference) : this.product.commission_price;
						this.currentSkuStock = this.product.stock;
					}
				}
			}
		},
		checkInpath(clickIndex) {
			//循环所有属性判断哪些属性可选
			//当前选中的兄弟节点和已选中属性不需要循环
			for (let i = 0, len = this.specList.length; i < len; i++) {
				if (i == clickIndex) {
					continue;
				}
				let len2 = this.specList[i].value.length;
				for (let j = 0; j < len2; j++) {
					if (this.subIndex[i] != -1 && j == this.subIndex[i]) {
						continue;
					}
					let choosed_copy = [...this.selectArr];
					this.$set(choosed_copy, i, this.specList[i].value[j].title);
					let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
					if (this.shopItemInfo.hasOwnProperty(choosed_copy2)) {
						this.$set(this.specList[i].value[j], 'ishow', true);
					} else {
						this.$set(this.specList[i].value[j], 'ishow', false);
					}
				}
			}
		},

		checkItem() {
			//计算有多小种可选路径
			let result = this.difference.reduce(
				(arrs, items) => {
					return arrs.concat(
						items.difference.reduce(
							(arr, item) => {
								return arr.concat(
									arr.map(item2 => {
										//利用对象属性的唯一性实现二维数组去重
										if (!this.shopItemInfo.hasOwnProperty([...item2, item])) {
											this.shopItemInfo[[...item2, item]] = items;
										}
										return [...item2, item];
									})
								);
							},
							[[]]
						)
					);
				},
				[[]]
			);
		},
		/* 主动方法 - 设置sku */

		selectSku(arr = []) {
			let that = this;
			let skuArr = arr;
			let specListArr = this.specList;

			if (skuArr && specListArr.length === skuArr.length) {
				// 先清空
				let skuClickArr = [];
				let clickKey = true;

				for (let index = 0; index < skuArr.length; index++) {
					let skuName = skuArr[index];
					let specList = that.specChildList;

					let index1 = index;
					let index2 = that.getListIndex(specList, 'title', skuName);

					if (index2 == -1) {
						clickKey = false;
						break;
					}
					skuClickArr.push({
						spec: specList[index2],
						index1: index1,
						index2: index2
					});
				}
				if (clickKey) {
					that.init();
					skuClickArr.map(item => {
						that.skuClick(item.spec, item.index1, item.index2);
					});
				}
			}
		},
		getListIndex(list, key, value) {
			let that = this;
			let index = -1;

			for (let i = 0; i < list.length; i++) {
				if (list[i][key] === value) {
					index = i;
					break;
				}
			}
			return index;
		},
		previewImgs(img, imgList) {
			// 预览图片
			uni.previewImage({
				current: img,
				urls: imgList
			});
		},
		//获取优惠券
		async getCoupon(item, index) {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}

			await this.$api.http
				.post(this.$api.apiShop.couponReceive, {
					id: item.id
				})
				.then(res => {
					if (this.product.canReceiveCoupon[index]) {
						if (!item.myGet) {
							this.product.canReceiveCoupon[index].myGet = {
								count: 1
							};
						} else {
							this.product.canReceiveCoupon[index].myGet.count = parseInt(item.myGet.count) + 1;
							this.$set(this.product, index, this.product.canReceiveCoupon[index].myGet);
						}
					}
					this.$refs.dzToast.show({
						title: this.$api.language.product.couponGetSuccess,
						type: 'success'
					});
				});
		},
		//加入购物车
		async addToCart() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});
				return;
			}
			await this.$api.http
				.post(this.$api.apiShop.cartItemCreate, {
					sku_id: this.currentSkuId,
					num: this.currentSkuNumber
				})
				.then(() => {
					this.$refs.dzToast.show({
						title: this.$api.language.product.addToCartSuccess,
						type: 'success'
					});
					this.popupShow = false;
					//购物车页面打开的情况下发送事件
					if (this.$api.store.state.cartPageListen) {
						uni.$emit('cartNumChange', {});
					} else {
						this.getCartCount();
					}
				});
		},
		//获取购物车数量
		async getCartCount() {
			this.$api.http.get(this.$api.apiShop.cartItemCount).then(res => {
				this.$api.store.commit('setCartNum', res.data);
			});
		},
		//预售
		async preSell() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			let params = {};
			params.type = 'presell_buy';
			params.data = JSON.stringify({ sku_id: this.currentSkuId, num: this.currentSkuNumber });
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
			this.popupShow = false;
		},
		//积分换购
		async pointExchange() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});

				return;
			}
			let params = {};

			params.type = 'point_exchange';
			params.data = JSON.stringify({ sku_id: this.currentSkuId, num: this.currentSkuNumber });
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
			this.popupShow = false;
		},
		//直接购买
		async buy() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});

				return;
			}
			let params = {};
			params.type = 'buy_now';
			params.data = JSON.stringify({ sku_id: this.currentSkuId, num: this.currentSkuNumber });
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
			this.popupShow = false;
		},
		//开团/入团购买
		async wholesaleBuy() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});

				return;
			}
			let params = {};
			params.type = 'wholesale';
			params.wholesale_product_id = this.product.marketing.id;
			params.wholesale_id = this.wholesaleJoinId; //入团ID
			params.data = JSON.stringify({ sku_id: this.currentSkuId, num: this.currentSkuNumber });
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
			this.popupShow = false;
		},
		//加入拼团
		async wholesaleJoinClick(id) {
			this.wholesaleJoinId = id;
			this.showPopup();
		},
		//发起砍价
		async bargainBuy() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});
				return;
			}
			let params = {};
			params.type = 'bargain';
			params.data = JSON.stringify({ sku_id: this.currentSkuId });
			//选择物流方式和物流地址
			this.$api.router.push({
				route: this.$api.routesConfig.bargainAddress,
				query: {
					data: JSON.stringify(params),
					shipping_type: this.product.shipping_type,
					product: JSON.stringify(this.product.marketing)
				}
			});
			this.popupShow = false;
		},
		//团购
		async groupBuy() {
			console.log(this.currentSkuNumber, 'okt');
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});
				return;
			}
			let params = {};
			params.type = 'group_buy';
			params.group_buy_id = this.product.marketing.id;

			params.data = JSON.stringify({ sku_id: this.currentSkuId, num: this.currentSkuNumber });
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
			this.popupShow = false;
		},
		//限时折扣/秒杀购买
		async discountBuy() {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
				return;
			}
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.product.choiceProductAttribute,
					type: 'warning'
				});
				return;
			}
			let params = {};
			params.type = 'discount';
			params.data = JSON.stringify({ sku_id: this.currentSkuId, num: this.currentSkuNumber });
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
			this.popupShow = false;
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
						source: encodeURIComponent(this.product.name),
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
		//购物车
		cartTap() {
			this.$api.router.push({
				route: this.$api.routesConfig.cart
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $dz-bg-color;
}

.container {
	padding-bottom: 110rpx;
}

.dz-header-box {
	width: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 977;
}

.dz-bar-line::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid $dz-border-color;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 0;
}

.dz-header {
	width: 100%;
	/* #ifdef H5 */
	height: 44px;
	/* #endif */
	/* #ifndef H5 */
	height: 64px;
	/* #endif */
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-title {
	width: 39%;
	margin-left: 20rpx;
	font-size: 32rpx;
	/* #ifdef H5 */
	line-height: 44px;
	/* #endif */
	/* #ifndef H5 */
	line-height: 64px;
	/* #endif */
	text-align: center;
	font-weight: 500;
	align-items: center;
	justify-content: center;
}

.dz-header-icon {
	position: fixed;
	top: 0;
	left: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	/* #ifdef H5 */
	height: 44px;
	/* #endif */
	/* #ifndef H5 */
	height: 64px;
	/* #endif */
	transform: translateZ(0);
	z-index: 978;
}

.dz-header-icon .dz-badge {
	background: $dz-type-error !important;
	position: absolute;
	right: -4px;
}

.dz-icon-ml {
	margin-left: 20rpx;
}

.dz-icon-box {
	position: relative;
	height: 28px !important;
	width: 28px !important;
	padding: 8px !important;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-banner-swiper {
	position: relative;
}

.dz-banner-tag {
	position: absolute;
	color: #fff;
	bottom: 30rpx;
	right: 20rpx;
}

.dz-video__box {
	width: 180rpx;
	height: 60rpx;
	position: absolute;
	left: 50%;
	bottom: 50rpx;
	transform: translateX(-50%);
	z-index: 2;
}

.dz-video__box image {
	width: 180rpx;
	height: 60rpx;
}
.dz-video__box view {
	width: 100%;
	height: 100%;
	font-size: 22rpx;
	position: absolute;
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	padding-left: 66rpx;
	box-sizing: border-box;
}

.dz-slide-image {
	width: 100%;
	display: block;
}

/*顶部菜单*/

.dz-menu-box {
	box-sizing: border-box;
}

.dz-menu-header {
	font-size: 34rpx;
	color: #fff;
	height: 32px;
	display: flex;
	align-items: center;
}

.dz-menu-itembox {
	color: #fff;
	padding: 40rpx 10rpx 0 10rpx;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	font-size: 26rpx;
}

.dz-menu-item {
	width: 22%;
	height: 160rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	background: rgba(0, 0, 0, 0.4);
	margin-right: 4%;
	margin-bottom: 4%;
}

.dz-menu-item:nth-of-type(4n) {
	margin-right: 0;
}

.dz-badge-box {
	position: relative;
}

.dz-badge-box .dz-badge-class {
	position: absolute;
	top: -8px;
	right: -8px;
}

.dz-msg-badge {
	top: -10px;
}

.dz-icon-up_box {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-menu-text {
	padding-top: 12rpx;
}

.dz-opcity .dz-menu-text,
.dz-opcity .dz-badge-box {
	opacity: 0.5;
	transition: opacity 0.2s ease-in-out;
}

/*顶部菜单*/

/*内容 部分*/

.dz-padding {
	padding: 0 30rpx;
	box-sizing: border-box;
}

.dz-ml-auto {
	margin-left: auto;
}

/* #ifdef H5 */
.dz-ptop {
	padding-top: 44px;
}

/* #endif */

.dz-size {
	font-size: 24rpx;
	line-height: 24rpx;
}

.dz-gray {
	color: $dz-tips-color;
}

.dz-icon-dark {
}

.dz-border-radius {
	border-bottom-left-radius: 24rpx;
	border-bottom-right-radius: 24rpx;
	overflow: hidden;
}

.dz-radius-all {
	border-radius: 24rpx;
	overflow: hidden;
}

.dz-mtop {
	margin-top: 26rpx;
}

.dz-pro-detail {
	box-sizing: border-box;
	color: $dz-main-color;
}

.dz-product-title {
	background: #fff;
}

.dz-product-detail {
	margin: 10rpx 0 0 0;
	padding: 10rpx 0 20rpx 0;
	background: #fff;
}

.dz-marketing-title {
	padding: 0;
}

.dz-marketing-price {
	width: 100%;
	display: flex;
}

.dz-marketing-pricebox {
	padding: 30rpx 20rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 26rpx;
	line-height: 26rpx;
	flex-shrink: 0;
}

.dz-marketing-presale {
	width: 100%;
}

.dz-marketing-left {
	width: 540rpx;
}

.dz-marketing-right {
	flex: 1;
	font-size: 24rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.dz-marketing-right text {
	text-align: center;
	padding-bottom: 12rpx;
}

.dz-marketing-pro-price {
	display: flex;
	align-items: flex-end;
}

.dz-marketing-original-price {
	font-size: 26rpx;
	line-height: 26rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	text-decoration: line-through;
}

.dz-marketing-sold {
	margin-top: 10rpx;
	width: 100%;
	padding-left: 4rpx;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}

.dz-marketing-sold text {
	width: 70%;
}

.dz-marketing-tag {
	display: flex;
}

.dz-pro-pricebox {
	padding-top: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 36rpx;
	font-weight: bold;
	line-height: 44rpx;
}

.dz-pro-price {
	display: flex;
	align-items: center;
}

.dz-price {
	font-size: 42rpx;
}

.dz-original-price {
	font-size: 26rpx;
	line-height: 26rpx;
	padding: 10rpx 30rpx;
	box-sizing: border-box;
}

.dz-line-through {
	text-decoration: line-through;
}

.dz-collection {
	color: $dz-main-color;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	height: 44rpx;
}

.dz-scale-collection {
	transform: scale(0.7);
	transform-origin: center 90%;
	line-height: 24rpx;
	font-weight: normal;
	margin-top: 4rpx;
}

.dz-pro-titbox {
	font-size: 32rpx;
	font-weight: 500;
	position: relative;
	padding: 0 150rpx 0 30rpx;
	box-sizing: border-box;
}

.dz-pro-title {
	padding-top: 20rpx;
}

.dz-transparent-btn {
	display: block;
	background: transparent;
	margin: 0;
	padding: 0;
	border-radius: 0;
	border: 0;
}

.dz-transparent-btn::after {
	border: 0;
}

.dz-poster-box {
	padding: 15rpx;
}

.dz-poster-position {
	position: absolute;
	right: 0;
	top: 0rpx;
}

.dz-poster-text {
	padding-left: 8rpx;
}

.dz-sub-title {
	padding: 20rpx 0;
	line-height: 32rpx;
}

.dz-sale-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 30rpx;
}

.dz-discount-box {
	background: #fff;
}

.dz-list-cell {
	width: 100%;
	position: relative;
	display: flex;
	align-items: center;
	font-size: 26rpx;
	line-height: 26rpx;
	padding: 36rpx 30rpx;
	box-sizing: border-box;
}

.dz-right {
	position: absolute;
	right: 30rpx;
	top: 30rpx;
}

.dz-top40 {
	top: 40rpx !important;
}

.dz-bold {
	font-weight: bold;
}

.dz-list-cell::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid $dz-border-color;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 126rpx;
}

.dz-list-cell:last-child::after {
	border-bottom: 0 !important;
}

.dz-flex-center {
	display: flex;
	align-items: center;
}

.dz-cell-title {
	width: 90rpx;
	padding-right: 30rpx;
	flex-shrink: 0;
}

.dz-promotion-box {
	display: flex;
	align-items: center;
	padding: 10rpx 0;
	width: 90%;
}

.dz-promotion-box text {
	line-height: 30rpx;
}

.dz-basic-info {
	background: #fff;
}

.dz-addr-box {
	width: 76%;
}

.dz-addr-item {
	padding: 10rpx;
	line-height: 34rpx;
}

.dz-guarantee {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 30rpx 30rpx 30rpx;
	font-size: 24rpx;
}

.dz-guarantee-item {
	color: $dz-tips-color;
	padding-right: 30rpx;
	padding-top: 10rpx;
}

.dz-pl {
	padding-left: 4rpx;
}

.dz-cmt-box {
	background: #fff;
}

.dz-between {
	justify-content: space-between !important;
}

.dz-cmt-all {
	padding-right: 8rpx;
}

.dz-evaluate-box {
	display: flex;
	padding: 20rpx 30rpx;
	.portrait {
		flex-shrink: 0;
		width: 80rpx;
		height: 80rpx;
		border-radius: 80rpx;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		font-size: 28rpx;
		color: $dz-content-color;
		padding-left: 26rpx;
		.con {
			font-size: 28rpx;
			color: $dz-main-color;
		}
		.bot {
			display: flex;
			justify-content: space-between;
			font-size: 24rpx;
			color: $dz-light-color;
		}
		.name {
			align-items: center;
			display: flex;
			justify-content: space-between;
		}
	}
}

.dz-cmt-content {
	padding: 20rpx 20rpx;
	font-size: 26rpx;
}

.dz-cmt-user {
	display: flex;
	align-items: center;
}

.dz-acatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 30rpx;
	display: block;
	margin-right: 16rpx;
}

.dz-cmt {
	padding: 14rpx 0;
}

.dz-attr {
	font-size: 24rpx;
	color: $dz-tips-color;
	padding: 6rpx 0;
}

.dz-cmt-btn {
	padding: 30rpx 0 30rpx 0;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-nomore-box {
	padding-top: 10rpx;
}

.dz-product-img {
	display: flex;
	flex-direction: column;
	transform: translateZ(0);
	/* #ifdef APP-PLUS || MP  */
	font-size: 0;
	/* #endif */
}

.dz-product-img image {
	width: 100%;
	display: block;
	float: left;
	vertical-align: bottom;
	font-size: 0;
	overflow: hidden;
	display: flex;
}

.dz-product-img img {
	font-size: 0;
	width: 100%;
	display: block;
	float: left;
	vertical-align: bottom;
	overflow: hidden;
	display: flex;
}

/*底部操作栏*/

.dz-col-7 {
	width: 70%;
}

.dz-col-3 {
	width: 30%;
}

.dz-col-1-5 {
	width: 15%;
}

.dz-col-8-5 {
	width: 85%;
}

.dz-operation {
	width: 100%;
	height: 100rpx;
	background: rgba(255, 255, 255, 0.98);
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 10;
	bottom: 0;
	left: 0;
	padding-bottom: env(safe-area-inset-bottom);
}

.dz-safearea-bottom {
	width: 100%;
	height: env(safe-area-inset-bottom);
}

.dz-operation::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1rpx solid $dz-border-color;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.dz-operation-left {
	display: flex;
	align-items: center;
}

.dz-operation-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: relative;
}

.dz-operation-text {
	font-size: 22rpx;
	color: $dz-main-color;
}

.dz-opacity {
	opacity: 0.5;
}

.dz-scale-small {
	transform: scale(0.9);
	transform-origin: center center;
}

.dz-operation-right {
	height: 100rpx;
	padding-top: 0;
}

.dz-right-flex {
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-flex-1 {
	flex: 1;
}

.dz-btn__box {
	height: 98rpx;
	font-size: 26rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	line-height: 28rpx;
	padding: 18rpx 0 14rpx 0;
	box-sizing: border-box;
}

.dz-size-26 {
	font-size: 26rpx;
	line-height: 26rpx;
	padding-top: 4rpx;
}

.dz-size-32 {
	font-size: 32rpx;
	line-height: 28rpx;
	font-weight: 300;
}

.dz-size-36 {
	font-size: 36rpx;
	line-height: 34rpx;
	font-weight: 500;
}

.dz-flex-end {
	display: flex;
	align-items: flex-end;
}

/*底部操作栏*/

/*底部选择弹层*/

.dz-popup-class {
	border-top-left-radius: 24rpx;
	border-top-right-radius: 24rpx;
	padding-bottom: env(safe-area-inset-bottom);
}

.dz-popup-box {
	position: relative;
	padding: 30rpx 0 100rpx 0;
}

.dz-popup-btn {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
}

/* .dz-popup-btn .dz-btn-class {
		width: 90% !important;
		display: block !important;
		font-size: 28rpx !important;
	} */

/* .dz-icon-close {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
	} */

.dz-product-box {
	display: flex;
	align-items: flex-start;
	font-size: 24rpx;
	padding-bottom: 30rpx;
}

.dz-popup-img {
	height: 200rpx;
	width: 200rpx;
	flex-shrink: 0;
	border-radius: 20rpx;
	display: block;
	background-color: $dz-bg-color;
}

.dz-popup-price {
	padding-left: 20rpx;
	padding-bottom: 8rpx;
}

.dz-popup-title {
	line-height: 1.4;
	font-size: 28rpx;
	width: 430rpx;
	color: $dz-main-color;
}

.dz-amount {
	font-size: 36rpx;
}

.dz-number {
	font-size: 24rpx;
	line-height: 24rpx;
	padding-top: 16rpx;
	color: $dz-tips-color;
}

.dz-popup-scroll {
	max-height: calc(60vh - 220rpx);
	font-size: 26rpx;
}

.dz-scrollview-box {
	padding: 0 30rpx 60rpx 30rpx;
	box-sizing: border-box;
}

.dz-attr-title {
	padding: 10rpx 0;
	color: $dz-main-color;
}

.dz-attr-box {
	font-size: 0;
	padding: 20rpx 0;
}

.dz-attr-item {
	max-width: 100%;
	min-width: 64rpx;
	height: 64rpx;
	display: -webkit-inline-flex;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: #f7f7f7;
	padding: 0 26rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	font-size: 26rpx;
}
.attr-color {
	width: 35rpx;
	height: 35rpx;
	margin-right: 10rpx;
	border-radius: 6rpx;
}

.dz-attr-active {
	background: #fff !important;
	font-weight: bold;
	position: relative;
}

.dz-attr-active::after {
	content: '';
	position: absolute;
	border-width: 1rpx;
	border-style: solid;
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
	left: 0;
	top: 0;
}

.dz-disabled {
	color: #d1d1d1 !important;
	background: #f8f8f8 !important;
}

.dz-sku {
	position: relative;
	width: 194rpx;
	background: #f7f7f7;
	border-radius: 20rpx;
	border: 1px solid #f7f7f7;
	.sku-name {
		text-align: center;
		margin: 15rpx 10rpx;
		font-size: 24rpx;
	}
	.icon {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 16rpx;
		right: 16rpx;
		width: 46rpx;
		height: 46rpx;
		border-radius: 23rpx;
		background: rgba(17, 17, 17, 0.7);
	}
}

.dz-pic-disabled {
	position: relative;
}
.dz-pic-disabled::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
	background: rgba(243, 244, 246, 0.6);
	left: 0;
	top: 0;
}

.dz-attr-image-item {
	width: 90rpx;
	height: 90rpx;
	display: -webkit-inline-flex;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: $dz-bg-color;
	padding: 0 26rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;

	.image {
		width: 90rpx;
		height: 90rpx;
	}
}

.dz-number-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx 30rpx 30rpx;
	box-sizing: border-box;
}
/*底部选择弹层*/

/*拼团*/
.dz-group-swiper {
	width: 100%;
	background-color: #fff;
}

.dz-group-swiper-sigle {
	height: 156rpx;
}

.dz-group-swiper-multi {
	height: 312rpx;
}

.dz-group-user {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 35rpx 40rpx;
	box-sizing: border-box;
}

.dz-user-left {
	font-size: 30rpx;
	display: flex;
	align-items: center;
}

.dz-user-left image {
	height: 80rpx;
	width: 80rpx;
	flex-shrink: 0;
	border-radius: 50%;
	margin-right: 16rpx;
}

.dz-user-right {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.dz-user-anme {
	max-width: 160rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.dz-group-num {
	font-size: 26rpx;
	line-height: 26rpx;
	padding-bottom: 12rpx;
}

.dz-user-countdown {
	padding-right: 18rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.dz-sub-title {
	font-size: 28rpx;
	padding-right: 30rpx;
}
.dz-group-countdown {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: $dz-content-color;
	white-space: nowrap;
}

.dz-countdown-right {
	padding-right: 6rpx;
}

.dz-countdown-left {
	padding-left: 6rpx;
}

.dz-step__box {
	width: 100%;
	height: 210rpx;
	background: #fff;
	padding: 0 60rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}

.dz-step-item {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	font-size: 26rpx;
	color: $dz-content-color;
}

.dz-step-item image {
	width: 64rpx;
	height: 55rpx;
	flex-shrink: 0;
}

.dz-step-item image:first-child {
	width: 60rpx !important;
}

.dz-step-arrow {
	height: 90rpx;
}

.dz-step-arrow image {
	width: 11rpx;
	height: 20rpx;
	flex-shrink: 0;
}

.dz-step-text {
	line-height: 26rpx;
	padding-top: 24rpx;
}

.dz-modal__title {
	text-align: center;
	font-weight: bold;
	padding-bottom: 8rpx;
}
.dz-modal__p {
	font-size: 26rpx;
	color: $dz-tips-color;
	padding-top: 20rpx;
}
.dz-modal__btn {
	width: 100%;
	padding: 60rpx 0 20rpx;
	display: flex;
	justify-content: center;
}
/*拼团*/

/*组合套餐*/
.combination-list {
	white-space: nowrap;
	margin: 20rpx;
	.combination-item {
		display: inline-block;
		font-size: 24rpx;
		margin-right: 20rpx;
		// border-right: 1rpx solid rgba(0, 0, 0, 0.1);
		.combination-product-item {
			display: inline-block;
			margin-right: 20rpx;
			position: relative;
			border-radius: 15rpx;
			overflow: hidden;
			.combination-product-img {
				width: 180rpx;
				height: 180rpx;
				border-radius: 15rpx;
				overflow: hidden;
			}
			.combination-product-price {
				width: 100%;
				text-align: center;
				background-color: rgba(0, 0, 0, 0.4);
				position: absolute;
				border-bottom-left-radius: 6rpx;
				bottom: 0;
				padding: 3rpx 8rpx;
				right: 0;
				color: #fff;
				font-size: 24rpx;
			}
		}
		.combination-product-title {
			margin-top: 10rpx;
			text-align: center;
		}
	}
}
/*组合套餐*/

/*优惠券列表*/
.dz-coupon-list {
	background-color: #f9f9f9;
	width: 100%;
	padding: 0 25rpx 25rpx;
	box-sizing: border-box;
}

.dz-coupon-item {
	width: 100%;
	height: 210rpx;
	position: relative;
	display: flex;
	align-items: center;
	padding-right: 30rpx;
	box-sizing: border-box;
	overflow: hidden;
}

.dz-coupon-bg {
	width: 100%;
	height: 210rpx;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
}

.dz-coupon-item-left {
	width: 218rpx;
	height: 210rpx;
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	flex-shrink: 0;
}

.dz-coupon-price-box {
	display: flex;
	align-items: flex-end;
}

.dz-coupon-price-sign {
	font-size: 30rpx;
}

.dz-coupon-price {
	font-size: 70rpx;
	line-height: 68rpx;
	font-weight: bold;
}

.dz-price-small {
	font-size: 58rpx !important;
	line-height: 56rpx !important;
}

.dz-coupon-intro {
	background: $dz-bg-color;
	padding: 8rpx 10rpx;
	font-size: 26rpx;
	line-height: 26rpx;
	font-weight: 400;
	color: $dz-content-color;
	margin-top: 18rpx;
	border-radius: 6rpx;
}

.dz-coupon-item-right {
	flex: 1;
	height: 210rpx;
	position: relative;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-left: 24rpx;
	box-sizing: border-box;
	overflow: hidden;
}

.dz-coupon-content {
	width: 82%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.dz-coupon-title-box {
	display: flex;
	align-items: center;
}

.dz-coupon-btn {
	padding: 6rpx;
	font-size: 25rpx;
	line-height: 25rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transform: scale(0.9);
	transform-origin: 0 center;
	border-radius: 4rpx;
	flex-shrink: 0;
}

.dz-coupon-title {
	width: 100%;
	font-size: 26rpx;
	color: $dz-main-color;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.dz-coupon-rule {
	padding-top: 52rpx;
}

.dz-rule-box {
	display: flex;
	align-items: center;
	transform: scale(0.8);
	transform-origin: 0 100%;
}

.dz-padding-btm {
	padding-bottom: 6rpx;
}

.dz-coupon-circle {
	width: 8rpx;
	height: 8rpx;
	background: rgb(160, 160, 160);
	border-radius: 50%;
}

.dz-coupon-text {
	min-width: 320rpx;
	font-size: 28rpx;
	line-height: 28rpx;
	font-weight: 400;
	color: $dz-content-color;
	padding-left: 8rpx;
	white-space: nowrap;
}

.dz-coupon-title {
	font-size: 28rpx;
	line-height: 28rpx;
}

.dz-btn-box {
	position: absolute;
	width: 146rpx;
	height: 52rpx;
	right: 10rpx;
	bottom: 100rpx;
	z-index: 10;
}
/*优惠券列表*/

.hideCanvas {
	position: fixed;
	top: -99999rpx;
	left: -99999rpx;
	z-index: -99999;
}
</style>
