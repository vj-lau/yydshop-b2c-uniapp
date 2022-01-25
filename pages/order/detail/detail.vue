<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="订单详情"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'订单详情'"
			:is-fixed="false"
			:background="{ background: theme.dzBaseColor }"
			:border-bottom="false"
			:back-icon-color="theme.dzBaseFontColor"
			:title-color="theme.dzBaseFontColor"
		></dz-navbar>
		<view class="content">
			<view class="status" :style="{ background: theme.dzBaseColor }">
				<view class="status-box">
					<view class="left">
						<!-- 已付款 -->
						<view
							v-if="[1].indexOf(parseInt(orderDetail.order_status)) != -1"
							class="dzicon-iconfont dzicon-presentfill icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 待支付 -->
						<view
							v-if="[0].indexOf(parseInt(orderDetail.order_status)) != -1"
							class="dzicon-iconfont dzicon-babyfill icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 已收货 -->
						<view
							v-if="[3, 4].indexOf(parseInt(orderDetail.order_status)) != -1"
							class="dzicon-iconfont dzicon-baoguo_shouhuo icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 发货中 -->
						<view
							v-if="[2, 12].indexOf(parseInt(orderDetail.order_status)) != -1"
							class="dzicon-iconfont dzicon-deliver_fill icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 待成团-->
						<view
							v-if="[101].indexOf(parseInt(orderDetail.order_status)) != -1"
							class="dzicon-iconfont dzicon-friendfill icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<!-- 已关闭-->
						<view
							v-if="[-4].indexOf(parseInt(orderDetail.order_status)) != -1"
							class="dzicon-iconfont dzicon-weichengjiaodingdan icon-size"
							:style="{ color: theme.dzBaseDisabled }"
						></view>
						<view class="tip" :style="{ color: theme.dzBaseFontColor }">
							<!-- <view class="pay" v-if="orderDetail.product[0].refund_status != 0">售后处理</view> -->
							<view class="pay">{{ orderStatusFilter(orderDetail.order_status) }}</view>
							<view
								class="pay"
								v-if="parseInt(orderDetail.order_status) === 101 && orderDetail.pay_status == 1 && (orderDetail.close_left_time && orderDetail.close_left_time > 0)"
							>
								正在开团中
							</view>
							<view
								class="pay"
								v-if="parseInt(orderDetail.order_status) === 101 && orderDetail.pay_status == 1 && (orderDetail.close_left_time && orderDetail.close_left_time < 0)"
							>
								开团超时
							</view>
							<view class="msg" v-if="refundIndex >= 1">{{ refundIndex }}件商品在售后中</view>
							<view class="msg" v-if="parseInt(orderDetail.order_status) == 0">
								<dz-count-down
									:timestamp="orderDetail.close_left_time"
									:show-days="false"
									:color="theme.dzBaseFontColor"
									fontSize="24"
									:separator-color="theme.dzBaseFontColor"
									:bg-color="theme.dzBaseColor"
								></dz-count-down>
								分钟后订单将自动关闭
							</view>
							<!-- 拼团倒计时 -->
							<view class="msg" v-if="parseInt(orderDetail.order_status) === 101 && (orderDetail.close_left_time && orderDetail.close_left_time > 0)">
								{{ language.wholesaleGroup.wholesaleLeftTime }}
								<dz-count-down
									:timestamp="orderDetail.close_left_time"
									:show-days="false"
									:color="theme.dzBaseFontColor"
									fontSize="24"
									:separator-color="theme.dzBaseFontColor"
									:bg-color="theme.dzBaseColor"
									@end="timeout()"
								></dz-count-down>
							</view>
						</view>
					</view>
					<view class="right">
						<dz-button
							v-if="parseInt(orderDetail.order_status) == 0"
							:plain="true"
							size="medium"
							shape="circle"
							:custom-style="{ background: theme.dzBaseLight, borderColor: theme.dzBaseDisabled, color: theme.dzBaseColor, width: '160rpx' }"
							hover-class="none"
							:border="false"
							@click="pay"
						>
							去支付
						</dz-button>
						<dz-button
							v-if="parseInt(orderDetail.order_status) == 2 && refundStaus([0, 5, -1, -2, -3])"
							:plain="true"
							size="medium"
							shape="circle"
							:custom-style="{ background: theme.dzBaseLight, borderColor: theme.dzBaseDisabled, color: theme.dzBaseColor, width: '160rpx' }"
							hover-class="none"
							:border="false"
							@click="orderTakeDelivery"
						>
							确定收货
						</dz-button>
						<dz-button
							@click="puy(orderDetail)"
							v-if="orderDetail.order_status == 3 || orderDetail.order_status == 4 || orderDetail.order_status == -4"
							:plain="true"
							size="medium"
							shape="circle"
							:border="false"
							:custom-style="{ background: theme.dzBaseLight, borderColor: theme.dzBaseDisabled, color: theme.dzBaseColor, width: '160rpx' }"
							hover-class="none"
						>
							再次购买
						</dz-button>
					</view>
				</view>
			</view>
			<view class="order-detail">
				<!-- 自提 -->
				<view class="address" v-if="orderDetail.pickup && orderDetail.shipping_type == 2">
					<view class="dzicon-iconfont dzicon-round_location_fill"></view>
					<view class="address-info">
						<view class="title">{{ orderDetail.pickup.name }} {{ orderDetail.pickup.mobile }}</view>
						<view class="address-tip">{{ orderDetail.pickup.address }}</view>
						<view class="icon">自提</view>
					</view>
				</view>
				<!-- 物流配送 -->
				<view class="address" v-else>
					<view class="dzicon-iconfont dzicon-round_location_fill"></view>
					<view>
						<view class="title">{{ orderDetail.receiver_name }} {{ orderDetail.receiver_mobile }}</view>
						<view class="address-tip">{{ orderDetail.receiver_region_name }}{{ orderDetail.receiver_address }}</view>
					</view>
				</view>
				<view class="product">
					<view
						class="logistics"
						v-if="[2, 3, 4, 12].indexOf(parseInt(orderDetail.order_status)) != -1 && orderDetail.is_virtual != -1 && orderDetail.shipping_type == 1"
					>
						<view class="logistics-l" @tap="toPage('shipping', orderDetail.id)">
							<view class="logistics-tetle">物流信息</view>
							<view class="courier"></view>
						</view>
						<view class="dzicon-iconfont dzicon-right"></view>
					</view>
					<view class="cell-item">
						<view class="order">
							<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="isPickupOrder(orderDetail, 1)">
								提货订单
							</dz-tag>
							<view class="order-tetle">订单编号</view>
							<view class="order-num">{{ orderDetail.order_sn }}</view>
						</view>
						<view class="order-btn">
							<dz-button
								:plain="true"
								type="info"
								size="mini"
								shape="circle"
								hoverClass="none"
								:border="false"
								:custom-style="{ height: '40rpx', background: '#FFF', lineHeight: '40rpx', border: '1rpx solid rgba(0,0,0,0.12)' }"
								@click="copy(orderDetail.order_sn)"
							>
								复制
							</dz-button>
						</view>
					</view>
					<block v-for="(item, index) in orderDetail.product" :key="index">
						<view class="order-item" @tap="toProductDetail(item)">
							<view class="left">
								<view class="image"><dz-image :src="item.product_picture" borderRadius="10" width="170" height="170"></dz-image></view>
								<view class="title">
									<view class="name">
										<dz-tag
											class="dz-m-r-10"
											:bg-color="theme.dzBaseColor"
											:border-color="theme.dzBaseColor"
											:color="theme.dzBaseFontColor"
											mode="dark"
											size="mini"
											:show="parseInt(item.gift_flag) > 0 ? true : false"
											:text="language.orderCreate.giveaways"
										></dz-tag>
										{{ item.product_name }}
									</view>
									<view class="sku">{{ item.sku_name || '默认款' }}</view>
									<view class="dz-m-t-10" :style="{ color: theme.dzBaseColor }">
										<text v-if="!isPickupOrder(orderDetail, 1)" class="dz-m-r-4">￥{{ item.price }}</text>
										x {{ item.num }}
									</view>
								</view>
							</view>
						</view>
						<view class="btn">
							<view v-if="customerService">
								<dz-button
									:plain="true"
									open-type="contact"
									:sessionFrom="sessionFrom"
									type="info"
									shape="circle"
									size="medium"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@tap="serviceTap"
								>
									联系客服
								</dz-button>
							</view>
							<view>
								<!-- 订单已支付且没有发货，且没有申请售后，可以直接退款 -->
								<dz-button
									v-if="[1, 12].indexOf(parseInt(item.order_status)) != -1 && item.shipping_status == 0 && [0, -3].indexOf(parseInt(item.refund_status)) != -1"
									:plain="true"
									type="info"
									size="medium"
									shape="circle"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="orderRefund(item)"
								>
									申请退款
								</dz-button>
							</view>
							<view>
								<!-- 订单已经发货，且没有完成，可以申请退款退货 -->
								<dz-button
									v-if="
										(([2, 3, 12].indexOf(parseInt(item.order_status)) != -1 || (item.order_status == 4 && customerRefundTime())) &&
											item.shipping_status != 0 &&
											[0, -3].indexOf(parseInt(item.refund_status)) != -1) ||
											(item.refund_status == -2 && $api.shopSetting.order_refund_cancel_reapply == 1)
									"
									:plain="true"
									type="info"
									size="medium"
									shape="circle"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="toRefund(item)"
								>
									售后服务
								</dz-button>
							</view>
							<view>
								<dz-button
									v-if="item.refund_status != 0 || item.customer_refund_status != 0"
									type="info"
									shape="circle"
									size="medium"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="refundDetail('refundDetail', item, index)"
								>
									售后详情
								</dz-button>
							</view>
							<view>
								<dz-button
									v-if="item.refund_status == 1 || item.refund_status == 2 || item.refund_status == 3 || item.refund_status == 4"
									:plain="true"
									type="info"
									shape="circle"
									size="medium"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: item.refund_type == 2 ? '202rpx' : '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="cancelRefund(item.order_status, item.id)"
								>
									{{ parseInt(item.refund_type) == 1 ? '取消退款' : parseInt(item.refund_type) == 2 ? '取消退款退货' : '取消换货' }}
								</dz-button>
							</view>
							<view>
								<dz-button
									v-if="(item.order_status == 2 || item.order_status == 3 || item.order_status == 4) && item.refund_status == 7"
									type="info"
									shape="circle"
									size="medium"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="salesDelivery(item.id)"
								>
									确认收货
								</dz-button>
							</view>
							<view>
								<dz-button
									v-if="(item.order_status == 2 || item.order_status == 3 || item.order_status == 4) && item.refund_status == 2"
									:plain="true"
									type="info"
									shape="circle"
									size="medium"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="refundDetail('refundShipping', item)"
								>
									填写物流
								</dz-button>
							</view>
							<view>
								<dz-button
									v-if="
										(item.order_status == 3 || item.order_status == 4) &&
											item.is_evaluate == 0 &&
											(item.refund_status == 0 || item.refund_status == -2 || item.refund_status == -3)
									"
									type="info"
									shape="circle"
									size="medium"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="toEvaluation(item)"
								>
									去评论
								</dz-button>
							</view>
							<view>
								<dz-button
									v-if="
										(item.order_status == 3 || item.order_status == 4) &&
											(item.is_evaluate == 1 || item.is_evaluate == 2) &&
											(item.refund_status == 0 || item.refund_status == -2 || item.refund_status == -3)
									"
									type="info"
									size="medium"
									shape="circle"
									hoverClass="none"
									:border="false"
									:custom-style="{
										width: '152rpx',
										height: '56rpx',
										marginLeft: '20rpx',
										marginTop: '20rpx',
										background: '#FFF',
										padding: '0 76rpx',
										lineHeight: '56rpx',
										border: '1rpx solid rgba(0,0,0,0.12)'
									}"
									@click="toEvaluationDetail(item)"
								>
									查看评论
								</dz-button>
							</view>
						</view>
					</block>
				</view>
				<view class="cell-box">
					<dz-cell-item
						center
						title="优惠劵"
						:arrow="false"
						:value="(orderDetail.coupon && orderDetail.coupon.title) || '未使用优惠券'"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
					<dz-cell-item
						center
						title="配送方式"
						:arrow="false"
						:value="orderDetail.shipping_type | filterShippingType"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
					<dz-cell-item center title="快递公司" :arrow="false" :value="orderDetail.company_name || '等待配送'" :border-bottom="false" hover-class="none"></dz-cell-item>
					<dz-cell-item
						v-if="orderDetail.point && parseInt(orderDetail.point) > 0"
						center
						title="积分抵扣"
						:arrow="false"
						:value="$api.helper.formatString(language.order.integralToUse, orderDetail.point || 0, orderDetail.point_money || 0)"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
				</view>
				<view class="cell-box">
					<dz-cell-item center title="下单时间" :arrow="false" :value="orderDetail.created_at | timeFormat" :border-bottom="false" hover-class="none"></dz-cell-item>
					<dz-cell-item
						center
						title="商品金额"
						:arrow="false"
						:value="$api.helper.formatString(language.orderCreate.price, orderDetail.pay_money)"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
					<dz-cell-item
						center
						title="运费"
						:arrow="false"
						:value="$api.helper.formatString(language.orderCreate.price, orderDetail.shipping_money)"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
					<dz-cell-item
						center
						title="发票税费"
						:arrow="false"
						:value="$api.helper.formatString(language.orderCreate.price, orderDetail.tax_money)"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
					<dz-cell-item
						v-if="orderDetail.give_point && parseInt(orderDetail.give_point) > 0"
						center
						title="赠送积分"
						:arrow="false"
						:value="$api.helper.formatString(language.orderCreate.integral, orderDetail.give_point)"
						:border-bottom="false"
						hover-class="none"
					></dz-cell-item>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-bottom">
				<view class="footer-btn" v-if="parseInt(orderDetail.order_status) == -4">
					<view>
						<dz-button
							:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							mode="info"
							size="medium"
							:border="false"
							shape="circle"
							@click="OrderClose"
						>
							删除订单
						</dz-button>
					</view>
				</view>
				<view class="footer-btn" v-if="parseInt(orderDetail.order_status) == 0">
					<view>
						<dz-button
							:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							size="medium"
							:border="false"
							shape="circle"
							@click="orderClose"
						>
							取消订单
						</dz-button>
					</view>
					<view>
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx' }"
							hover-class="none"
							shape="circle"
							size="medium"
							:border="false"
							@click="pay()"
						>
							去支付
						</dz-button>
					</view>
				</view>
				<view
					v-if="
						parseInt(orderDetail.order_status) == -4 &&
							parseInt(orderDetail.pay_status) != 1 &&
							(orderDetail.marketing_type == 'wholesale' || orderDetail.marketing_type == 'bargain')
					"
					class="dz-flex dz-row-right"
				>
					<view v-if="orderDetail.marketing_type == 'wholesale'">
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							:border="false"
							size="medium"
							shape="circle"
							@click="toPage('wholesaleDetail', orderDetail.wholesale_id)"
						>
							拼团详情
						</dz-button>
					</view>
					<!-- 砍价详情 -->
					<view v-if="orderDetail.marketing_type == 'bargain'">
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							size="medium"
							shape="circle"
							:border="false"
							@click="toPage('bargainDetails', orderDetail.marketing_id)"
						>
							砍价详情
						</dz-button>
					</view>
				</view>
				<view v-if="parseInt(orderDetail.pay_status) == 1" class="dz-flex dz-row-right">
					<!-- <view class="payMoney">
					<view>实付款</view>
					<view class="price" :style="{ color: theme.dzBaseColor }">{{ $api.helper.formatString(language.orderCreate.price, orderDetail.pay_money) }}</view>
				</view> -->
					<view v-if="parseInt(orderDetail.order_status) == 2 && (refundStaus(0) || refundStaus(-3))">
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							size="medium"
							shape="circle"
							:border="false"
							@click="orderTakeDelivery"
						>
							确认收货
						</dz-button>
					</view>
					<!-- <view v-if="( orderStatus(3) || orderStatus(4)) && isEvaluate && (refundStaus(0) || refundStaus(-2) || refundStaus(-3))">
								<dz-button :custom-style="{background:theme.dzBaseColor,color:theme.dzBaseFontColor,width:'160rpx',marginRight:'20rpx'}" hover-class="none" size="medium" shape="circle" @click="toEvaluation(orderDetail)">去评论</dz-button>
							</view>
							<view v-if="(orderDetail.order_status == 3 || orderDetail.order_status == 4) && orderDetail.is_evaluate == 1">
								<dz-button type="info" size="medium" shape="circle" :custom-style="{ width: '160rpx', marginLeft: '20rpx',backgroundColor:'#FFF'}" @click="toEvaluationDetail()">查看评论</dz-button>
							</view> -->
					<!-- 拼团详情 -->
					<view v-if="orderDetail.marketing_type == 'wholesale'">
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							size="medium"
							shape="circle"
							:border="false"
							@click="toPage('wholesaleDetail', orderDetail.wholesale_id)"
						>
							拼团详情
						</dz-button>
					</view>
					<!-- 砍价详情 -->
					<view v-if="orderDetail.marketing_type == 'bargain'">
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '160rpx', marginRight: '20rpx' }"
							hover-class="none"
							size="medium"
							shape="circle"
							:border="false"
							@click="toPage('bargainDetails', orderDetail.marketing_id)"
						>
							砍价详情
						</dz-button>
					</view>
					<view v-if="orderDetail.pickup && orderDetail.shipping_type == 2">
						<dz-button
							:custom-style="{ width: '160rpx', marginRight: '20rpx', background: '#FFF', border: '1rpx solid rgba(0,0,0,0.12)' }"
							hover-class="none"
							size="medium"
							shape="circle"
							type="info"
							:border="false"
							@click="getCode()"
						>
							<dz-icon name="qrcode" size="36"></dz-icon>
							<text class="dz-m-l-6">提货码</text>
						</dz-button>
					</view>
					<view>
						<dz-button
							:border="false"
							:custom-style="{ width: '160rpx', marginRight: '20rpx', background: '#FFF', border: '1rpx solid rgba(0,0,0,0.12)' }"
							hover-class="none"
							size="medium"
							shape="circle"
							type="info"
							@click="backClick"
						>
							返回
						</dz-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<!-- 确定收货提醒 -->
		<dz-modal
			v-model="isShow"
			:mask-close-able="false"
			title="确认收货"
			content="请确定在收到商品后操作哦"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="takeDeliveryCancel"
			@confirm="takeDeliveryConfirm"
		></dz-modal>
		<!-- 取消订单提醒 -->
		<dz-modal
			v-model="closeShow"
			:mask-close-able="false"
			content="确定要取消该订单"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="orderCloseCancel"
			@confirm="orderCloseConfirm"
		></dz-modal>
		<!-- 取消退款提醒 -->
		<dz-modal
			v-model="cancelRefundShow"
			:mask-close-able="false"
			content="取消退款后将无法再次提交申请，是否继续取消退款?"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="idShowCancel"
			@cancel="cancelRefundCancel"
			@confirm="cancelRefundConfirm"
		></dz-modal>
		<dz-modal
			v-model="salesDeliveryModalShow"
			:mask-close-able="false"
			content="是否确认已经收到货？"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="salesDeliveryCancel"
			@confirm="salesDeliveryConfirm"
		></dz-modal>
		<!-- 提货码 -->
		<dz-popup v-model="pickupShow" mode="center" border-radius="30" :closeable="true" width="80%" :custom-style="{ overflow: 'visible' }">
			<view class="popup-box">
				<image @longpress="long" :src="imgSrc" mode=""></image>
				<view class="tip dz-m-t-20">提货码 {{ orderDetail.pickup_code }}</view>
			</view>
		</dz-popup>
		<canvas class="hideCanvas" canvas-id="qrcode" style="width: 250px;height: 250px;" />
		<dz-modal
			v-model="downloadShow"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="false"
			:async-close="true"
			:content="`正在下载（${downloadText}）`"
			@confirm="downloadCancel"
			:confirm-text="'取消'"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import uQRCode from '@/core/utils/uqrcode.js';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			orderId: '',
			orderDetail: {},
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			isShow: false,
			scrollTop: 0,
			opacity: 0,
			refundIndex: 0,
			closeShow: false,
			cancelRefundShow: false,
			cancelRefundData: {},
			idShowCancel: true,
			customerService: false, //是否使用客服
			sessionFrom: '',
			salesDeliveryModalShow: false,
			salesDeliveryData: {},

			pickupShow: false,
			imgSrc: '',
			downloadText: '',
			downloadPercent: '',
			downloadShow: false,
			downloadTask: null
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '订单详情'
		});
		this.orderId = option.id;
		await this.$onLaunched;
		let serviceType = parseInt(this.$api.shopSetting.app_service_type);
		if (serviceType > 0) {
			if (this.$api.store.getters.hasLogin) {
				this.sessionFrom =
					'{"source":"' +
					'订单编号：' +
					this.orderDetail.order_sn +
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
		this.getOrderDetail();
		uni.$on('refundChange', data => {
			this.refundIndex = 0;
			this.getOrderDetail();
		});
		uni.$on('evaluationStatus', data => {
			this.refundIndex = 0;
			this.getOrderDetail();
		});
	},
	onUnload() {
		uni.$off(['refundChange', 'evaluationStatus']);
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		},

		// 是否评论
		isEvaluate() {
			if (this.orderDetail.product) {
				return this.orderDetail.product.every(item => item.is_evaluate == 0);
			}
		}
	},
	filters: {
		filterShippingType(value) {
			const data = ['物流配送', '买家自提', '货到付款', '本地配送', '虚拟商品'];
			return data[parseInt(value) - 1];
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		// 订单状态
		orderStatus(val) {
			if (this.orderDetail.product) {
				return this.orderDetail.product.every(item => parseInt(item.order_status) == val);
			}
		},
		// 售后状态
		refundStaus(val) {
			if (this.orderDetail.product && val.length > 1) {
				return this.orderDetail.product.every(item => val.indexOf(parseInt(item.refund_status)) != -1);
			}
		},
		// 提货订单状态
		isPickupOrder(val, state) {
			if (val.product) {
				return val.product.every(item => parseInt(item.warehouse_is_pickup) == state);
			}
		},
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		pageLoadingClick() {
			this.getOrderDetail();
		},
		orderStatusFilter(status) {
			let state;
			this.$api.dataConfig.orderStatus.forEach(orderItem => {
				if (orderItem.key === parseInt(status)) {
					state = orderItem.value;
					if (this.orderDetail.shipping_type == 2) {
						switch (parseInt(status)) {
							case 1:
								state = '待提货';
								break;
							case 2:
								state = '已提货';
								break;
							case 3:
								state = '已提货';
								break;
						}
					}
				}
			});
			return state;
		},
		async getOrderDetail() {
			this.pageLoadingShow = true;
			await this.$api.http
				.get(this.$api.apiShop.orderDetail, {
					params: {
						id: this.orderId
					}
				})
				.then(res => {
					this.orderDetail = res.data;
					if (this.orderDetail.product) {
						this.refundIndex = this.orderDetail.product.filter(
							item =>
								parseInt(item.refund_status) &&
								parseInt(item.refund_status) != -1 &&
								parseInt(item.refund_status) != -2 &&
								parseInt(item.refund_status) != -3 &&
								parseInt(item.refund_status) != 5
						).length;
					}

					// this.orderDetail.product.forEach(item => {
					// 	if (parseInt(item.refund_status) != 0) {
					// 		this.refundIndex = this.refundIndex + 1;
					// 	}
					// });
					setTimeout(() => {
						this.pageLoadingShow = false;
					}, 100);
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
		},
		saveImg() {
			// #ifndef H5
			//如果是在线图片，下载并保存
			if (this.$api.helper.isUrl(this.imgSrc)) {
				this.downloadPercent = 0;
				this.downloadText = this.downloadPercent + '%';
				this.downloadShow = true;
				this.downloadTask = uni.downloadFile({
					url: this.imgSrc,
					success: res => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									this.$refs.dzToast.show({
										title: '已下载到您的手机相册',
										type: 'success'
									});
									this.downloadShow = false;
								},
								fail: () => {
									this.$refs.dzToast.show({
										title: '保存失败，请重试',
										type: 'warning'
									});
									this.downloadShow = false;
								}
							});
						}
					},
					fail: () => {
						this.$refs.dzToast.show({
							title: '下载失败，请重试',
							type: 'warning'
						});
						this.downloadShow = false;
					}
				});

				this.downloadTask.onProgressUpdate(res => {
					this.downloadPercent = res.progress;
					this.downloadText = res.progress + '%';
				});
			} else {
				const _this = this;
				uni.saveImageToPhotosAlbum({
					filePath: this.imgSrc,
					success() {
						_this.$refs.dzToast.show({
							title: '已保存到您的手机相册',
							type: 'success'
						});
					}
				});
			}
			// #endif
			// #ifdef H5
			this.$api.helper.toast('请长按松开后选择另存为保存到相册');
			// #endif
		},
		long() {
			let _this = this;
			uni.showActionSheet({
				itemList: ['保存到手机'],
				itemColor: '#0081FF',
				success: function(res) {
					if (res.tapIndex == 0) {
						_this.saveImg();
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		downloadCancel() {
			try {
				this.downloadTask.abort();
			} catch (e) {
			} finally {
				this.downloadShow = false;
			}
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '订单号已复制到剪贴板',
				type: 'success'
			});
		},
		// 查看物流/拼团/砍价
		toPage(url, id) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id
				}
			});
		},
		// 确定收货
		async orderTakeDelivery(item, index) {
			this.isShow = true;
		},
		// 取消收货
		takeDeliveryCancel() {
			this.isShow = false;
		},
		// 确认收货
		async takeDeliveryConfirm() {
			await this.$api.http
				.get(this.$api.apiShop.orderTakeDelivery, {
					params: {
						id: this.orderId
					}
				})
				.then(res => {
					this.isShow = false;
					uni.$emit('orderChange', {});
					this.getOrderDetail();
				});
		},
		// 删除订单
		async OrderClose() {
			await this.$api.http
				.delete(
					this.$api.apiShop.orderDelete,
					{},
					{
						params: {
							id: this.orderId
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: '订单删除成功',
						type: 'success'
					});
					uni.$emit('orderChange', { id: this.orderId });
					setTimeout(() => {
						this.$api.router.back();
					}, 500);
				});
		},
		async getCode() {
			this.imgSrc = await this.getQrcode();
			if (!this.imgSrc)
				return this.$refs.dzToast.show({
					title: '生成二维码失败',
					type: 'warning'
				});
			this.pickupShow = true;
		},
		async getQrcode() {
			return new Promise((resolve, reject) => {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: `pickup-${this.orderDetail.pickup_code}`,
					size: 250,
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
		},
		// 商品详情
		toProductDetail(item) {
			if (parseInt(item.product_status) == 0)
				return this.$refs.dzToast.show({
					title: this.$api.language.user.productTheShelves,
					type: 'warning'
				});

			let url;
			if (item.marketing_type && item.marketing_type != 0) {
				if (item.marketing_type == 'group_buy') {
					url = 'groupProduct';
				} else {
					url = `${item.marketing_type}Product`;
				}
			} else {
				url = 'product';
			}
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: item.product_id
				}
			});
		},
		// 去评论
		toEvaluation(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluation,
				query: {
					data: JSON.stringify(item)
				}
			});
		},
		// 查看评论
		toEvaluationDetail(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluationDetail,
				query: {
					order_id: item.order_id,
					product_id: item.id
				}
			});
		},
		// 售后服务(未完成订单)
		toRefund(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.refundIndex,
				query: {
					id: item.id,
					order_id: item.order_id
				}
			});
		},
		orderRefund(item) {
			const params = {
				id: item.id,
				warehouse_is_pickup: item.warehouse_is_pickup ? item.warehouse_is_pickup : null,
				num: item.num,
				order_id: item.order_id,
				product_money: item.product_money
			};
			// #ifdef MP
			if (this.$api.store.state.wechatMpLogin && this.$api.shopSetting.notify_miniprogram_sub && this.$api.shopSetting.notify_miniprogram_sub.order_refund_audit) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.order_refund_audit //   退款审核结果通知
					],
					success: res => {
						_this.$api.router.push({
							route: this.$api.routesConfig.refundOrder,
							query: {
								data: JSON.stringify(params),
								shipping_money: _this.orderDetail.shipping_money
							}
						});
						return;
					},
					fail(err) {
						_this.$api.router.push({
							route: this.$api.routesConfig.refundOrder,
							query: {
								data: JSON.stringify(params),
								shipping_money: _this.orderDetail.shipping_money
							}
						});
						console.log(err, 2);
						return;
					}
				});
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig.refundOrder,
					query: {
						data: JSON.stringify(params),
						shipping_money: this.orderDetail.shipping_money
					}
				});
			}
			// #endif
			// #ifndef MP
			this.$api.router.push({
				route: this.$api.routesConfig.refundOrder,
				query: {
					data: JSON.stringify(params),
					shipping_money: this.orderDetail.shipping_money
				}
			});
			// #endif
		},
		// 再次去购买
		puy(item) {
			let data = {};
			data.type = 'buy_again';
			data.buy_again_id = item.id;
			data.data = 'buy_again';
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(data)
				}
			});
		},
		// 退款详情
		refundDetail(url, item) {
			const params = {
				id: item.id,
				order_id: item.order_id,
				order_status: item.order_status
			};
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					...params,
					shipping_money: this.orderDetail.shipping_money
				}
			});
		},
		// 取消退款
		cancelRefund(status, id) {
			this.cancelRefundData = { status, id };
			this.cancelRefundShow = true;
		},
		cancelRefundCancel() {
			this.cancelRefundShow = false;
		},
		async cancelRefundConfirm() {
			this.idShowCancel = false;
			let api = this.$api.apiShop.closeOrderRefundApply;
			if (parseInt(this.cancelRefundData.status) == 4) {
				api = this.$api.apiShop.orderCustomerRefundClose;
			}
			await this.$api.http
				.post(api, {
					id: this.cancelRefundData.id
				})
				.then(res => {
					this.getOrderDetail();
					this.cancelRefundShow = false;
					uni.$emit('orderChange', {});
				})
				.catch(err => {
					console.log(err);
					this.cancelRefundShow = false;
				});
		},
		// 取消订单
		orderClose() {
			this.closeShow = true;
		},
		// 取消订单
		orderCloseCancel() {
			this.closeShow = false;
		},
		// 取消订单确认
		async orderCloseConfirm() {
			await this.$api.http
				.get(this.$api.apiShop.orderClose, {
					params: {
						id: this.orderId
					}
				})
				.then(() => {
					this.getOrderDetail();
					this.closeShow = false;
					uni.$emit('orderChange', {});
				});
		},
		// 去支付
		pay() {
			this.$api.router.push({
				route: this.$api.routesConfig.pay,
				query: {
					id: this.orderId
				}
			});
		},
		// 超时
		timeout(index) {
			this.$set(this.orderDetail, 'close_left_time', -1);
			this.$set(this.orderDetail, 'order_status', -4);
		},
		backClick() {
			this.$api.router.back();
		},
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
						source: encodeURIComponent('订单编号：' + this.orderDetail.order_sn),
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
		salesDelivery(id) {
			this.salesDeliveryData = { id: id };
			this.salesDeliveryModalShow = true;
		},
		salesDeliveryCancel() {
			this.salesDeliveryModalShow = false;
		},
		salesDeliveryConfirm() {
			this.salesDeliverySubmit();
		},
		async salesDeliverySubmit() {
			await this.$api.http
				.post(this.$api.apiShop.orderProductSalesDelivery, {
					id: this.salesDeliveryData.id
				})
				.then(res => {
					this.salesDeliveryModalShow = false;
					this.$refs.dzToast.show({
						title: '提交成功',
						type: 'success'
					});
					this.getOrderDetail();
				});
		},
		customerRefundTime() {
			if (!this.orderDetail.after_sale_date || this.orderDetail.after_sale_date == '') {
				return true;
			}
			return (Date.now() / 1000).toFixed(0) < parseInt(this.orderDetail.after_sale_date) + parseInt(this.orderDetail.finish_time);
		}
	}
};
</script>

<style lang="scss">
.content {
	padding-bottom: 115rpx;
}
.status {
	width: 100%;
	height: 220rpx;
}
.status-box {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 50rpx 20rpx 20rpx;
	.left {
		.icon-size {
			font-size: 72rpx;
		}
		display: flex;
		align-items: center;
		.tip {
			margin-left: 20rpx;
			.pay {
				font-size: 36rpx;
				font-weight: bold;
			}
			.msg {
				font-size: 24rpx;
			}
		}
	}
}
.order-detail {
	padding: 0 20rpx;
}
.address {
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	padding: 20rpx;
	margin-top: -50rpx;
	background-color: #fff;
	border-radius: 20rpx;
	.dzicon-round_location_fill {
		font-size: 72rpx;
		margin-right: 20rpx;
	}
	.title {
		font-size: 32rpx;
		color: $dz-main-color;
		line-height: 54rpx;
	}
	.address-tip {
		margin: 6rpx 0;
		font-size: 28rpx;
		color: $dz-tips-color;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 0;
		right: 0;
		height: 35rpx;
		width: 70rpx;
		font-size: 24rpx;
		color: #ffffff;
		background-color: $dz-type-warning;
		border-radius: 0 0 0 15rpx;
	}
}
.product {
	margin: 20rpx 0;
	padding: 20rpx;
	border-radius: 20rpx;
	background-color: #ffffff;
	.logistics {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		.logistics-l {
			flex: 1;
			display: flex;

			align-items: center;
			.logistics-tetle {
				font-size: 28rpx;
				color: $dz-content-color;
				margin-right: 20rpx;
			}
			.courier {
				width: 500rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-right: 10rpx;
				color: #dea32c;
			}
		}
		.dzicon-right {
			flex-shrink: 0;
		}
	}
	.cell-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.order {
			flex: 1;
			display: flex;
			align-items: center;
			.order-tetle {
				font-size: 28rpx;
				color: $dz-content-color;
				margin-right: 20rpx;
			}
			.order-num {
				width: 300rpx;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: $dz-tips-color;
			}
		}
		.order-btn {
			flex-shrink: 0;
		}
	}
	.order-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.left {
			display: flex;
			.image {
				flex-shrink: 0;
				width: 170rpx;
				height: 170rpx;
				border-radius: 10rpx;
				background-color: $dz-bg-color;
			}
			.title {
				margin-left: 20rpx;
				.name {
					line-height: 40rpx;
					color: $dz-main-color;
					font-size: 28rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.sku {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: $dz-content-color;
				}
			}
		}

		.right {
			.price-box {
				margin-left: 10rpx;
				text-align: right;
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
	}
	.btn {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		margin-bottom: 40rpx;
	}
	.btn:last-child {
		margin-bottom: 0;
	}
}
.cell-box {
	margin-bottom: 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
}
.footer {
	position: fixed;
	bottom: 0;
	z-index: 2;
	width: 100%;
	background-color: #fff;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	.footer-bottom {
		width: 100%;
		height: 110rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: env(safe-area-inset-bottom);
	}
	.text {
		font-size: 28rpx;
		color: $dz-content-color;
	}
	.payMoney {
		display: flex;
		font-size: 32rpx;
		.price {
			margin: 0 20rpx;
			font-size: 34rpx;
			font-weight: bold;
		}
	}
	.footer-btn {
		display: flex;
		justify-content: flex-end;
	}
}
.popup-box {
	text-align: center;
	image {
		border: none;
		border-radius: 0;
		width: 300rpx;
		height: 300rpx;
		margin-top: 90rpx;
	}

	.tip {
		padding-bottom: 90rpx;
		color: #909993;
	}
}
.hideCanvas {
	position: fixed;
	top: -999px;
	left: -999px;
	z-index: -99;
}
</style>
