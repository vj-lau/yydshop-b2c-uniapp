<template>
	<view>
		<dz-navbar :title="language.order.myOrder" :borderBottom="false"></dz-navbar>
		<!--滑动栏-->
		<view class="dz-tab"><dz-tabs :list="list" :current="current" :is-scroll="false" :activeColor="theme.dzBaseColor" bar-height="8" @change="tabsChange"></dz-tabs></view>
		<!--内容-->
		<view class="dz-content">
			<view class="dz-item" v-for="(item, index) in orderList" :key="index">
				<view class="top">
					<view class="sn" @tap.stop="copy(item.order_sn)">
						<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseDisabled" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="item.marketing_type == 'wholesale'">
							拼团
						</dz-tag>
						<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseDisabled" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="item.marketing_type == 'group_buy'">
							团购
						</dz-tag>
						<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseDisabled" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="item.marketing_type == 'bargain'">
							砍价
						</dz-tag>
						<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseDisabled" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="item.marketing_type == 'discount'">
							限时折扣
						</dz-tag>
						<dz-tag class="dz-m-r-10" :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" mode="dark" size="mini" v-if="isPickupOrder(item, 1)">
							提货订单
						</dz-tag>
						{{ item.order_sn }}
					</view>
					<!-- <view class="on-color" :style="{color:theme.dzBaseColor}" v-if="refundStatus(item)">售后商品 x{{refundStatus(item)}}</view> -->
					<view class="on-color" :style="{ color: theme.dzBaseColor }">{{ orderStatusFilter(item.order_status, item) }}</view>
					<view class="on-color" :style="{ color: theme.dzBaseColor }" v-if="item.order_status == 101 && (item.close_left_time && item.close_left_time > 0)">
						正在开团中
					</view>
					<view class="on-color" :style="{ color: theme.dzBaseColor }" v-if="item.order_status == 101 && (item.close_left_time && item.close_left_time < 0)">
						开团超时
					</view>
				</view>
				<view class="order-content" @tap="toOrderDetail(item)">
					<block v-for="(orderItem, orderIndex) in item.product" :key="orderIndex">
						<view v-if="orderIndex < item.moreNum" class="order-item">
							<view class="left">
								<view class="image"><dz-image :src="orderItem.product_picture" borderRadius="10" width="170" height="170"></dz-image></view>
								<view class="title">
									<view class="name">
										<dz-tag
											class="dz-m-r-10"
											:bg-color="theme.dzBaseColor"
											:border-color="theme.dzBaseColor"
											:color="theme.dzBaseFontColor"
											mode="dark"
											size="mini"
											:show="parseInt(orderItem.gift_flag) > 0 ? true : false"
											:text="language.orderCreate.giveaways"
										></dz-tag>
										{{ orderItem.product_name }}
									</view>

									<view class="sku">{{ orderItem.sku_name || '默认款' }}</view>
								</view>
							</view>
							<view class="right">
								<view class="price-box">
									<view v-if="!isPickupOrder(item, 1)">￥{{ orderItem.price }}</view>
									<view>x{{ orderItem.num }}</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view v-if="item.product.length > item.moreNum" class="dz-font-24 dz-color-9" @tap="moreTap(index)">
					显示剩余{{ item.product.length - 2 }}种商品
					<dz-icon class="dz-m-l-6" name="unfold"></dz-icon>
				</view>
				<view class="tip" v-if="!isPickupOrder(item, 1)">
					<text>￥{{ item.pay_money }}</text>
					共{{ item.product_count }}件商品,总金额
				</view>
				<view class="tip" v-else>共{{ item.product_count }}件商品</view>
				<view class="bottom" :class="{ 'dz-m-t-40': item.order_status != 1 || item.marketing_type != '' }">
					<!-- 拼团倒计时 -->
					<view v-if="item.order_status == 101 && (item.close_left_time && item.close_left_time > 0)">
						<text class="del">{{ language.wholesaleGroup.wholesaleLeftTime }}</text>
						<dz-count-down
							class="dz-m-l-10"
							:timestamp="item.close_left_time"
							:show-days="false"
							:color="theme.dzBaseColor"
							:separator-color="theme.dzBaseColor"
							:bg-color="'transparent'"
							@end="wholesaleTimeout(item.id)"
						></dz-count-down>
					</view>
					<!-- 后订单将关闭 -->
					<view
						v-if="parseInt(item.order_status) === 0 && (item.close_left_time && item.close_left_time > 0)"
						:class="[parseInt(item.order_status) === 0 ? 'on-color' : '']"
						:style="{ color: parseInt(item.order_status) === 0 ? theme.dzBaseColor : '' }"
					>
						<dz-count-down
							:timestamp="item.close_left_time"
							:show-days="false"
							:show-hours="true"
							:color="theme.dzBaseColor"
							:separator-color="theme.dzBaseColor"
							@end="timeout(index)"
						></dz-count-down>
						后订单将关闭
					</view>
					<view
						v-if="orderState(item, -3) || orderState(item, -4) || (item.order_status == 101 && (item.close_left_time && item.close_left_time < 0))"
						class="del"
						@tap="OrderClose(item, index)"
					>
						删除订单
					</view>
					<view v-else></view>
					<view class="btn">
						<dz-button
							v-if="parseInt(item.order_status) === 4 || parseInt(item.order_status) === -4"
							type="info"
							size="mini"
							shape="circle"
							:border="false"
							hoverClass="none"
							:custom-style="{ width: '120rpx', background: '#FFF', marginLeft: '20rpx', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
							@click="puy(item)"
						>
							再次购买
						</dz-button>
						<dz-button
							v-if="(orderState(item, 3) || orderState(item, 4)) && isEvaluate(item, 0) && refundStaus(item, [0, 8])"
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
							hover-class="none"
							size="mini"
							shape="circle"
							:border="false"
							@click="toEvaluation(item)"
						>
							去评论
						</dz-button>
						<dz-button
							v-if="item.order_status == 0 || item.order_status == 202"
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
							hover-class="none"
							:border="false"
							size="mini"
							shape="circle"
							@click="pay(item)"
						>
							去支付
						</dz-button>
						<dz-button
							v-if="
								(item.order_status == 4 || item.order_status == 3 || item.order_status == 2 || item.order_status == 12) &&
									item.is_virtual &&
									item.is_virtual != 1 &&
									item.shipping_type == 1
							"
							type="info"
							size="mini"
							shape="circle"
							:border="false"
							hoverClass="none"
							:custom-style="{ width: '120rpx', background: '#FFF', marginLeft: '20rpx', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
							@click="toShipping(item.id, 'shipping')"
						>
							查看物流
						</dz-button>
						<dz-button
							v-if="orderState(item, 2) && refundStaus(item, [0, 8])"
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
							hover-class="none"
							:border="false"
							size="mini"
							shape="circle"
							@click="orderTakeDelivery(item, index)"
						>
							确定收货
						</dz-button>
						<dz-button
							v-if="item.marketing_type == 'wholesale'"
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
							hover-class="none"
							:border="false"
							size="mini"
							shape="circle"
							@click="toShipping(item.wholesale_id, 'wholesaleDetail')"
						>
							拼团详情
						</dz-button>
						<dz-button
							v-if="item.marketing_type == 'bargain'"
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', marginLeft: '20rpx' }"
							hover-class="none"
							size="mini"
							shape="circle"
							:border="false"
							@click="toShipping(item.marketing_id, 'bargainDetails')"
						>
							砍价详情
						</dz-button>
					</view>
				</view>
			</view>
			<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" text="暂无订单,去逛逛~" :src="emptyOrder" iconSize="360"></dz-empty>
			<view v-if="loadingStatus != 'noData'" class="dz-ios-m-bline"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
		</view>
		<!-- 确定收货提醒 -->
		<dz-modal
			v-model="isShow"
			:mask-close-able="false"
			title="确认收货"
			content="请确定在收到商品后操作哦"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			:async-close="true"
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
			:async-close="true"
			@cancel="orderCloseCancel"
			@confirm="orderCloseConfirm"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			current: 0,
			list: [
				{
					status: undefined,
					name: '全部'
				},
				{
					status: 0,
					name: '待付款'
				},
				{
					status: 1,
					name: '待发货'
				},
				{
					status: 2,
					name: '待收货'
				},
				{
					status: 3,
					name: '评论'
				}
			],
			page: 1,
			orderList: [],
			loadingStatus: 'loading',
			orderStatus: this.$api.dataConfig.orderStatus,
			tabScrollTop: -1,
			takeDelivery: {}, // 确定参数
			isShow: false,
			closeShow: false
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.order.myOrder
		});
		if (e.status) {
			this.current = parseInt(e.status) - 1;
		}
		await this.$onLaunched;
		uni.$on('orderChange', data => {
			this.deleteOrder(data.id);
		});
		this.initOrderList();
	},
	onUnload() {
		uni.$off('orderChange');
	},
	onPullDownRefresh() {
		this.initOrderList();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getOrderList();
	},
	methods: {
		//删除指定订单
		deleteOrder(id) {
			if (!id) {
				return;
			}
			let orderId = parseInt(id);
			for (let i = 0; i < this.orderList.length; i++) {
				if (orderId == parseInt(this.orderList[i].id)) {
					this.orderList.splice(i, 1);
				}
			}
		},
		//初始化订单
		initOrderList() {
			this.page = 1;
			this.orderList.length = 0;
			this.getOrderList();
		},
		//tabs滑动事件
		tabsChange(index) {
			if (this.current == index) return;
			this.current = index;
			this.initOrderList();
		},
		//获取订单
		async getOrderList() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.orderList, {
					params: {
						page: this.page,
						synthesize_status: this.list[this.current].status,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					res.data.forEach(item => {
						item.moreNum = 2;
					});
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.orderList = [...this.orderList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		// 提货订单状态
		isPickupOrder(val, state) {
			if (val.product) {
				return val.product.every(item => parseInt(item.warehouse_is_pickup) == state);
			}
		},
		// 订单状态
		orderState(val, state) {
			if (val.product) {
				return val.product.every(item => parseInt(item.order_status) == state);
			}
		},
		// 售后状态
		refundStaus(item, val) {
			if (item.product) {
				return item.product.every(res => val.indexOf(parseInt(res.refund_status)) != -1);
			}
		},
		moreTap(index) {
			this.orderList[index].moreNum = this.orderList[index].product.length;
		},

		// 是否可评论
		isEvaluate(val, state) {
			if (val.product) {
				return val.product.every(item => item.is_evaluate == state);
			}
		},
		orderStatusFilter(status, item) {
			let state;
			this.orderStatus.forEach(orderItem => {
				if (orderItem.key === parseInt(status)) {
					state = orderItem.value;
					if (item.shipping_type == 2) {
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
		// refundStatus(val) {
		// 	let status = 0;
		// 	val.product.forEach(item=>{
		// 		if(parseInt(item.refund_status) != 0) {
		// 			status = status+1
		// 		}
		// 	})
		// 	return status
		// },
		// 卡片改变事件
		swiperChange(e) {
			this.current = e.detail.current;
			this.initOrderList();
		},
		// 订单详情
		toOrderDetail(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.orderDetail,
				query: {
					id: item.id
				}
			});
		},
		// 去评论
		toEvaluation(item, type) {
			if (item.product.length > 1) {
				this.$api.router.push({
					route: this.$api.routesConfig.evaluationIndex,
					query: {
						id: item.id,
						type: type
					}
				});
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig.evaluation,
					query: {
						data: JSON.stringify(item),
						type: type
					}
				});
			}
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
		// 删除订单
		async OrderClose(item, index) {
			await this.$api.http
				.delete(
					this.$api.apiShop.orderDelete,
					{},
					{
						params: {
							id: item.id
						}
					}
				)
				.then(res => {
					this.orderList.splice(index, 1);
					this.$refs.dzToast.show({
						title: '订单删除成功',
						type: 'success'
					});
				});
		},
		// 确定收货
		async orderTakeDelivery(item, index) {
			this.isShow = true;
			this.takeDelivery.id = item.id;
			this.takeDelivery.index = index;
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
						id: this.takeDelivery.id
					}
				})
				.then(res => {
					if (parseInt(this.current) == 3) {
						this.orderList.splice(this.takeDelivery.index);
						if (this.orderList.length == 0) {
							this.loadingStatus = 'noData';
						}
					} else {
						this.orderList[this.takeDelivery.index].product.forEach(item => {
							item.order_status = 3;
						});
						this.$set(this.orderList, this.takeDelivery.index, this.orderList[this.takeDelivery.index]);
					}
					this.isShow = false;
					this.initOrderList();
				});
		},
		// 查看物流id
		toShipping(id, url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id
				}
			});
		},
		// 取消订单
		orderClose(item, index) {
			this.closeShow = true;
			this.takeDelivery.id = item.id;
			this.takeDelivery.index = index;
		},
		orderCloseCancel() {
			this.closeShow = false;
		},
		async orderCloseConfirm() {
			await this.$api.http
				.get(this.$api.apiShop.orderClose, {
					params: {
						id: this.takeDelivery.id
					}
				})
				.then(() => {
					this.orderList.splice(this.takeDelivery.index, 1);
					if (this.orderList.length == 0) {
						this.loadingStatus = 'noData';
					}
					this.closeShow = false;
				});
		},
		// 去支付
		pay(val) {
			this.$api.router.push({
				route: this.$api.routesConfig.pay,
				query: {
					id: val.id
				}
			});
		},
		//复制
		copy(text) {
			this.$api.helper.copy(text);
			this.$refs.dzToast.show({
				title: this.$api.language.application.copySuccess,
				type: 'success'
			});
		},
		//拼团超时
		wholesaleTimeout(id) {
			for (let i = 0; i < this.orderList.length; i++) {
				if (this.orderList[i].id === id) {
					this.$set(this.orderList[i], 'close_left_time', -1);
					break;
				}
			}
		},
		timeout(index) {
			this.$set(this.orderList[index], 'close_left_time', -1);
			this.$set(this.orderList[index], 'order_status', -4);
		}
	}
};
</script>

<style lang="scss">
.dz-tab {
	position: fixed;
	width: 100%; //这里必须设置100%，否则在fixed情况下不能左右滑动
	z-index: 992;
}

.dz-content {
	margin-top: 86rpx;
	padding: 20rpx;
}

.dz-item {
	padding: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 20rpx;

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.sn {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: $dz-main-color;
			font-weight: bold;
		}
	}

	.marketing {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}

.order-content {
	margin-top: 30rpx;
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
}

.tip {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	width: 100;
	padding-top: 20rpx;
	font-size: 24rpx;
	color: $dz-tips-color;
	text {
		margin-left: 10rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
}
.bottom {
	display: flex;
	justify-content: space-between;

	.del {
		color: $dz-content-color;
	}
}

.color {
	color: $dz-main-color;
}

.on-color {
}
</style>
