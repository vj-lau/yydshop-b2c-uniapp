<template>
	<view>
		<dz-navbar input-align="center" title="创建提货订单"></dz-navbar>
		<view class="order" v-if="orderDetail.products">
			<!--选择地址-->
			<view class="dz-address-section" @tap="choiceAddress">
				<view class="order-content">
					<view v-if="addressData" class="address">
						<view class="top">
							<text class="name">{{ addressData.realname }}</text>
							<text class="mobile">+{{ addressData.mobile_area + ' ' + $api.helper.maskCode(addressData.mobile, 3, 4) }}</text>
						</view>
						<text class="address dz-inline-1">{{ addressData.address_name }} {{ addressData.address_details }}</text>
					</view>
					<view class="no-default-address" v-else>{{ language.orderCreate.pleaseShippingAddress }}</view>
					<text class="dzicon-iconfont dzicon-right"></text>
				</view>
				<view class="address-bg-img"></view>
			</view>
			<!--商品列表-->
			<view class="dz-goods-section">
				<view class="g-header b-b">
					<text class="name dz-m-r-10">{{ language.orderCreate.shopList }}</text>
					<dz-tag :show="orderType ? true : false" size="mini" :text="orderType"></dz-tag>
				</view>
				<dz-line></dz-line>
				<!-- 商品列表 -->
				<view class="g-item" v-for="(item, index) in orderDetail.products" :key="index" @tap="gotoProduct(item.product_id)">
					<image :src="item.product_picture" mode="aspectFill"></image>
					<view class="right">
						<view class="title dz-inline-2">
							<dz-tag
								:show="parseInt(item.gift_flag) > 0 ? true : false"
								class="dz-m-r-10"
								size="mini"
								:bg-color="theme.dzBaseColor"
								:border-color="theme.dzBaseColor"
								:color="theme.dzBaseFontColor"
								:text="language.orderCreate.giveaways"
							></dz-tag>
							{{ item.product_name }}
						</view>
						<text class="spec">{{ item.sku_name || language.orderCreate.theDefaultParagraph }} x {{ item.num }}</text>
						<view class="price-box" :style="{ color: theme.dzBaseColor }">
							<text class="price base-color">￥ {{ item.product_money }}</text>
							<text class="number" :style="{ color: theme.dzBaseColor }"></text>
						</view>
					</view>
				</view>
				<dz-line></dz-line>
				<dz-field
					v-model="buyerMessage"
					style="color: #606266; margin-left: 10rpx;"
					:borderBottom="false"
					:label="language.orderCreate.remark"
					:placeholder="language.orderCreate.setRemark"
				></dz-field>
			</view>
			<!--预售-->
			<view class="dz-list">
				<dz-cell-item
					v-if="data.type == 'presell_buy'"
					center
					:title="language.orderCreate.presellTitle"
					:arrow="false"
					:border-bottom="false"
					:label="language.orderCreate.presellTip"
				>
					<dz-radio-group v-model="isFullPayment" :active-color="theme.dzBaseColor">
						<dz-radio name="0">{{ language.orderCreate.presellOrderPay }}</dz-radio>
						<dz-radio name="1">{{ language.orderCreate.presellOrderFullPay }}</dz-radio>
					</dz-radio-group>
				</dz-cell-item>
			</view>
			<view class="dz-list">
				<!--配送模式选择，未关闭全部配送方式，同时开启物流方式，自提方式-->
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							parseInt(orderDetail.is_open_logistics) === 1 &&
							orderDetail.pickup_point_config &&
							parseInt(orderDetail.pickup_point_config.buyer_self_lifting) === 1
					"
					@tap="showSinglePicker"
					center
					:title="language.orderCreate.modeOfDistribution"
					:arrow="true"
					:border-bottom="false"
					:value="currentShippingType.label || language.orderCreate.selectDeliveryMode"
				></dz-cell-item>
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							parseInt(orderDetail.is_open_logistics) === 1 &&
							orderDetail.pickup_point_config &&
							parseInt(orderDetail.pickup_point_config.buyer_self_lifting) === 0
					"
					center
					:title="language.orderCreate.modeOfDistribution"
					:arrow="false"
					:border-bottom="false"
					:value="'快递配送'"
				></dz-cell-item>
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							parseInt(orderDetail.is_open_logistics) === 0 &&
							orderDetail.pickup_point_config &&
							parseInt(orderDetail.pickup_point_config.buyer_self_lifting) === 1
					"
					center
					:title="language.orderCreate.modeOfDistribution"
					:arrow="false"
					:border-bottom="false"
					:value="'买家自提'"
				></dz-cell-item>
				<!--物流公司选择，未关闭全部配送方式，同时开启物流方式-->
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							parseInt(orderDetail.is_logistics) === 1 &&
							parseInt(currentShippingType.value) === 1 &&
							shippingCompany.length > 0
					"
					@tap="showCompanyPicker"
					center
					:title="language.orderCreate.courierServicesCompany"
					:arrow="true"
					:border-bottom="false"
					:value="currentCompany.label || language.orderCreate.pleaseCourierServicesCompany"
				></dz-cell-item>
				<!--无可用物流公司，未关闭全部配送方式，同时开启物流方式-->
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							parseInt(orderDetail.is_logistics) === 1 &&
							parseInt(currentShippingType.value) === 1 &&
							shippingCompany.length == 0
					"
					@tap="showShippingInfo"
					center
					:title="language.orderCreate.courierServicesCompany"
					:arrow="true"
					:border-bottom="false"
					:value="'配送地区暂不支持'"
				></dz-cell-item>
				<!--自提点选择，未关闭全部配送方式，同时开启自提方式-->
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							orderDetail.pickup_point_config &&
							parseInt(orderDetail.pickup_point_config.buyer_self_lifting) === 1 &&
							parseInt(currentShippingType.value) === 2 &&
							orderDetail.pickup_point_config.list.length > 0
					"
					@tap="showPickupPointPicker"
					center
					:title="language.orderCreate.storePickUpPoint"
					:arrow="true"
					:border-bottom="false"
					:value="(currentPickupPoint && currentPickupPoint.name) || language.orderCreate.storePickUpPoint"
				></dz-cell-item>
				<!--暂无自提点-->
				<dz-cell-item
					v-if="
						parseInt(orderDetail.close_all_logistics) === 0 &&
							orderDetail.pickup_point_config &&
							parseInt(orderDetail.pickup_point_config.buyer_self_lifting) === 1 &&
							parseInt(currentShippingType.value) === 2 &&
							orderDetail.pickup_point_config.list.length == 0
					"
					center
					:title="language.orderCreate.storePickUpPoint"
					:arrow="false"
					:border-bottom="false"
					:value="'暂无自提点'"
				></dz-cell-item>
				<!--必须积分-->
				<dz-cell-item
					v-if="pointExchangeType[0] == 2 || pointExchangeType[0] == 4"
					center
					:title="language.orderCreate.needIntegrals"
					:arrow="false"
					:border-bottom="false"
					hover-class="none"
					:value="$api.helper.formatString(language.orderCreate.youNeedToUseIntegrals, orderDetail.preview && orderDetail.preview.point)"
				></dz-cell-item>
			</view>
			<!-- 金额明细 -->
			<view class="dz-list">
				<dz-cell-item
					center
					:title="language.orderCreate.amountGoods"
					:value="$api.helper.formatString(language.orderCreate.price, amountGoods)"
					:arrow="false"
					:border-bottom="false"
					:value-style="{ color: theme.dzBaseColor }"
					hover-class="none"
				></dz-cell-item>
				<dz-cell-item
					center
					:title="language.orderCreate.shippingMoney"
					:value="shippingMoney == 0 ? language.orderCreate.freeShippingMoney : $api.helper.formatString(language.orderCreate.price, shippingMoney)"
					:value-style="{ color: theme.dzBaseColor }"
					:arrow="false"
					:border-bottom="false"
					hoverClass="none"
				></dz-cell-item>
			</view>
			<!-- 底部 -->
			<view class="footer">
				<view class="footer-bottom">
					<view class="price-content dz-inline-1">
						<text>{{ language.orderCreate.actualPayment }}</text>
						<text class="price-tip" :style="{ color: theme.dzBaseColor }">￥</text>
						<text class="price text-bold" :style="{ color: theme.dzBaseColor }">{{ `${realAmount}` }}</text>
					</view>
					<dz-button
						:custom-style="{ background: btnLoading || !submitEnabled ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						class="submit"
						@click="submit"
						shape="circle"
						:disabled="btnLoading || !submitEnabled"
						:loading="btnLoading"
						v-if="orderDetail.preview && userInfo.account.user_integral >= orderDetail.preview.point"
					>
						<block v-if="parseInt(orderDetail.close_all_logistics) === 1">配送已关闭</block>
						<block v-else>
							<block v-if="currentShippingType.value == 1">
								<block v-if="!addressData || !addressData.realname">请选择配送地址</block>
								<block v-if="addressData && addressData.realname && shippingIsSupport == 0">{{ shippingIsSupportMsg }}</block>
								<block v-if="addressData && addressData.realname && shippingIsSupport > 0">{{ language.orderCreate.submitOrder }}</block>
							</block>
							<block v-else-if="currentShippingType.value == 2">
								<block v-if="orderDetail.pickup_point_config.list.length == 0">自提点未配置</block>
								<block v-else>{{ language.orderCreate.submitOrder }}</block>
							</block>
							<block v-else>{{ language.orderCreate.submitOrder }}</block>
						</block>
					</dz-button>
					<dz-button type="info" class="submit" @click="submit" shape="circle" :disabled="true" :loading="btnLoading" v-else>
						{{ language.orderCreate.noIntegral }}
					</dz-button>
				</view>
			</view>
		</view>
		<dz-modal v-model="shippingModalShow" :title="'配送说明'" :show-cancel-button="false">
			<view class="dz-font-sm dz-p-30 dz-text-center">您购买的商品不支持所在地区的配送，请查看商品配送区域并更换可配送地址</view>
		</dz-modal>
		<dz-select v-model="shippingShow" mode="single-column" @confirm="onShippingConfirm" :list="pickerShippingType" />
		<dz-select v-model="companyShow" mode="single-column" @confirm="onCompanyConfirm" :list="shippingCompany" />
		<dz-select v-model="pickupPintShow" mode="single-column" @confirm="onPickupPointConfirm" :list="orderDetail.pickup_point_config && orderDetail.pickup_point_config.list" />
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			assets: this.$api.assetsConfig,
			isFullPayment: 0, //是否全款预定
			isShow: false, // 优惠券面板显示状态
			isShowConpon: true, // 是否显示优惠券选择
			orderType: '', //购买类型
			desc: '', // 备注
			orderDetail: {},
			pointExchangeType: [],
			pickerShippingType: [],
			btnLoading: false,
			currentShippingType: {},
			currentCompany: {},
			currentPickupPoint: {},
			invoiceItem: {},
			addressData: {},
			couponItem: {},
			pointConfig: null,
			shippingInfo: [], //可用的物流信息
			shippingCompany: [], //可用的物流公司
			product: null,
			shippingMoney: 0,
			isUsePoint: false,
			isUsePointDisabled: false,
			data: null,
			use_point: 0,
			invoiceContent: null,
			loading: true,
			buyerMessage: '',
			isShowInvoice: false,
			shippingShow: false, //是否显示选择配送方式
			companyShow: false, //选择快递公司
			pickupPintShow: false, // 选择自提
			pageLoadingStatus: 'loading',
			pageLoadingShow: true,
			shippingModalShow: false,
			referenceShow: false,
			shippingIsSupport: null, // 是否支持物流配送
			shippingIsSupportMsg: '' // 物流不支持提示信息
		};
	},
	computed: {
		...mapState(['userInfo', 'promoCode']),
		// 计算商品金额
		amountGoods() {
			if (this.data && this.data.type == 'presell_buy' && parseInt(this.isFullPayment) === 1) {
				return this.orderDetail.full_payment;
			} else {
				return this.orderDetail.preview && this.orderDetail.preview.product_money;
			}
		},
		// 计算实付金额
		realAmount() {
			let realAmount = parseFloat(this.shippingMoney);
			return (this.floor(realAmount) || 0).toFixed(2);
		},
		// 计算最大积分可抵扣金额
		maxUsePointFee() {
			if (this.pointConfig && parseInt(this.pointConfig.is_open) === 1) {
				return this.maxUsePoint * parseFloat(this.pointConfig.convert_rate);
			} else {
				return 0;
			}
		},
		// 计算是否可以下一步
		submitEnabled() {
			//物流配送全部被关闭
			if (parseInt(this.orderDetail.close_all_logistics) === 1) {
				return false;
			}
			let shippingValue = this.currentShippingType.value;
			//物流配送
			if (shippingValue == 1) {
				//没有地址
				if (!this.addressData || !this.addressData.realname) {
					return false;
				}
				//没有可支持的配送公司
				// if (this.shippingCompany.length == 0) {
				// 	return false;
				// }
				if (this.shippingIsSupport == 0) {
					return false;
				}
			}
			//自提
			if (shippingValue == 2) {
				//没有自提地点
				if (this.orderDetail.pickup_point_config.list.length == 0) {
					return false;
				}
			}
			return true;
		}
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: '创建提货订单'
		});

		if (!e.data) {
			this.pageLoadingStatus = 'error';
		}
		this.data = JSON.parse(e.data);
		if (!this.data) {
			this.pageLoadingStatus = 'error';
		}
		await this.$onLaunched;
		let conponType = ['wholesale', 'combination', 'group_buy', 'discount'];
		if (conponType.includes(this.data.type)) {
			this.isShowConpon = false;
		}
		this.orderType = this.$api.dataConfig.orderType[this.data.type];

		uni.$on('getAddressData', data => {
			this.addressData = data;
			if (this.addressData && this.addressData.realname) {
				this.getOrderFreightFee();
			}
		});
		uni.$on('getInvoice', data => {
			this.invoiceItem = data;
		});

		this.initData();
	},
	onUnload() {
		uni.$off(['getAddressData', 'getInvoice']);
	},
	methods: {
		pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			this.initData();
		},
		isInvoice() {
			if (this.invoiceItem.type) {
				return `${this.language.orderCreate.electronicInvoice} - ${
					parseInt(this.invoiceItem.type, 10) === 1 ? this.language.orderCreate.company : this.language.orderCreate.name
				} - ${this.invoiceItem.title}`;
			}
		},
		...mapMutations(['setCartNum']),
		choiceAddress() {
			this.$api.router.push({
				route: this.$api.routesConfig.address,
				query: {
					source: 'orderCreate'
				}
			});
		},
		gotoProduct(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id: id
				}
			});
		},
		gotoInvoice() {
			this.$api.router.push({
				route: this.$api.routesConfig.invoice,
				query: {
					source: 'orderCreate'
				}
			});
		},
		// 向下取整
		floor(val) {
			return Math.floor(val * 100) / 100;
		},
		stopSwitch() {},
		// 是否使用积分抵扣
		handleIsUsePoint(value) {
			if (value) {
				this.isUsePoint = true;
				this.use_point = this.maxUsePoint;
			} else {
				this.isUsePoint = false;
				this.use_point = 0;
			}
		},
		// 选择物流
		showSinglePicker() {
			this.shippingShow = true;
		},
		// 选择快递公司
		showCompanyPicker() {
			this.companyShow = true;
		},
		//物流提示
		showShippingInfo() {
			this.shippingModalShow = true;
		},
		// 选择自提点
		showPickupPointPicker() {
			this.pickupPintShow = true;
		},
		// 确定选择物流配送方式
		onShippingConfirm(e) {
			this.currentShippingType = e[0];
			if (this.currentShippingType.value == 2) {
				//自提
				if (parseFloat(this.realAmount) > parseFloat(this.orderDetail.pickup_point_config.pickup_point_freight)) {
					this.shippingMoney = 0;
				} else {
					this.shippingMoney = parseFloat(this.orderDetail.pickup_point_config.pickup_point_fee) || 0;
				}
			} else {
				//物流配送
				if (this.shippingCompany.length > 0) {
					this.currentCompany = this.shippingCompany[0];
					this.shippingMoney = this.shippingInfo[0].fee;
				}
			}
		},
		// 确定选择快递公司
		async onCompanyConfirm(e) {
			this.currentCompany = e[0];
			if (this.orderDetail.is_full_mail) {
				this.shippingMoney = 0;
				return;
			}
			for (let i = 0; i < this.shippingInfo.length; i++) {
				if (this.shippingInfo[i].company.id == this.currentCompany.value) {
					this.currentCompany = this.shippingInfo[i].company;
					this.shippingMoney = this.shippingInfo[i].fee;
				}
			}
		},
		// 确定选择自提点
		async onPickupPointConfirm(e) {
			this.currentPickupPoint = e[0];
			if (this.currentPickupPoint) {
				this.shippingMoney = parseFloat(this.orderDetail.pickup_point_config.pickup_point_fee) || 0;
			}
		},
		// 计算快递运费
		async getOrderFreightFee() {
			const params = {};
			if (this.addressData) {
				params.address_id = this.addressData.id;
			}

			await this.$api.http
				.get(this.$api.apiDistribution.freightFee, {
					params: {
						...params,
						...this.data
					}
				})
				.then(res => {
					console.log(res, 'f');
					this.shippingInfo.length = 0;
					this.shippingCompany.length = 0;
					this.currentCompany = {};
					this.shippingMoney = res.data.shipping_money;
					// 是否支持物流配送
					this.shippingIsSupport = res.data.shipping_is_support;
					// 是否支持物流配送提示信息
					this.shippingIsSupportMsg = res.data.shipping_not_support_msg;
					//以下2句必须，否则computer不执行
					this.currentShippingType.value = undefined;
					this.currentShippingType.value = 1;

					this.orderDetail.shipping_info = res.data.shipping_info;
					// this.computeShippingFee();
					// this.$forceUpdate();
				})
				.catch(err => {});
		},
		computeShippingFee() {
			//计算可用快递公司
			if (this.orderDetail.shipping_info) {
				this.orderDetail.shipping_info.forEach(item => {
					item.company.label = item.company.title;
					item.company.value = item.company.id;
					if (parseInt(item.allSupport) === 1) {
						this.$set(this.shippingInfo, this.shippingInfo.length, item);
						this.$set(this.shippingCompany, this.shippingCompany.length, item.company);
					}
				});
				if (this.shippingCompany.length > 0) {
					//当前快递公司
					this.currentCompany = this.shippingCompany[0];
					//当前运费
					this.shippingMoney = this.shippingInfo[0].fee;
				}
			}
		},
		// 数据初始化
		initData() {
			this.getOrderDetail();
		},
		// 获取订单详情
		async getOrderDetail() {
			await this.$api.http
				.get(this.$api.apiDistribution.pickUpPorduct, {
					params: {
						...this.data
					}
				})
				.then(res => {
					this.orderDetail = res.data;
					//积分
					this.pointConfig = this.orderDetail.point_config;
					//收货地址
					this.addressData = this.orderDetail.address;
					// 邮费
					this.shippingMoney = res.data.preview.shipping_money || 0;
					// 是否支持物流配送
					this.shippingIsSupport = res.data.shipping_is_support;
					// 是否支持物流配送提示信息
					this.shippingIsSupportMsg = res.data.shipping_not_support_msg;

					//开启了快递配送
					if (parseInt(this.orderDetail.is_open_logistics) === 1) {
						this.pickerShippingType.push({ label: this.language.orderCreate.logisticsDistribution, value: 1 });
						//计算运费
						this.computeShippingFee();
					}
					//开启了自提配送
					// if (this.orderDetail.pickup_point_config && parseInt(this.orderDetail.pickup_point_config.buyer_self_lifting) === 1) {
					// 	this.orderDetail.pickup_point_config.list.forEach(item => {
					// 		item.label = `${item.name || this.language.orderCreate.uncharted} - ${item.address || this.language.orderCreate.uncharted}`;
					// 		item.value = item.id;
					// 	});
					// 	this.currentPickupPoint = this.orderDetail.pickup_point_config.list[0] || {};
					// 	this.pickerShippingType.push({ label: this.language.orderCreate.theBuyerToThe, value: 2 });
					// } else {
					// 	this.orderDetail.pickup_point_config.list = [];
					// }

					//配送方式选择
					if (this.pickerShippingType.length > 0) {
						this.currentShippingType = this.pickerShippingType[0];
					}
					//关闭加载窗口
					this.pageLoadingShow = false;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
		},

		// 提交订单
		async submit() {
			if (parseInt(this.orderDetail.close_all_logistics) === 1) {
				this.$api.helper.toast(this.language.orderCreate.logisticsClose);
				return;
			}

			const params = {};
			params.buyer_message = this.buyerMessage;
			if (this.promoCode) {
				params.promo_code = this.promoCode;
			}
			// if (this.couponItem && this.couponItem.id) {
			// 	params.coupon_id = this.couponItem.id;
			// }
			// if (this.invoiceItem && this.invoiceItem.id) {
			// 	params.invoice_id = this.invoiceItem.id;
			// 	params.invoice_content = this.invoiceContent || this.orderDetail.invoice.list[0];
			// }
			if (this.currentShippingType && this.currentShippingType.value) {
				params.shipping_type = this.currentShippingType.value;
				if (parseInt(this.currentShippingType.value) === 1) {
					if (this.currentCompany && this.currentCompany.value) {
						params.company_id = this.currentCompany.value;
					}
					if (this.addressData && this.addressData.id) {
						params.address_id = this.addressData.id;
					} else {
						this.$api.helper.toast(this.language.orderCreate.pleaseShippingAddress);
						return;
					}
				}
				if (parseInt(this.currentShippingType.value) === 2) {
					if (this.currentPickupPoint && this.currentPickupPoint.value) {
						params.pickup_id = this.currentPickupPoint.value;
					}
				}
			}
			this.btnLoading = true;

			await this.$api.http
				.post(this.$api.apiDistribution.pickUpOrder, {
					...params,
					data: JSON.stringify(this.data.data),
					type: this.data.type,
					id: this.data.id
				})
				.then(async res => {
					if (this.data.type == 'cart') {
						//清空购物车
						await this.clearCartItem();
					}
					if (parseInt(res.data.pay_status) === 1) {
						this.$api.router.redirectTo({
							route: this.$api.routesConfig.paySuccess,
							query: {
								id: res.data.id,
								type: this.data.type
							}
						});
					} else {
						this.$api.router.redirectTo({
							route: this.$api.routesConfig.pay,
							query: {
								id: res.data.id,
								type: this.data.type
							}
						});
					}
					this.btnLoading = false;
				})
				.catch(err => {
					this.btnLoading = false;
				});
		},
		async clearCartItem() {
			if (this.$api.store.state.cartPageListen) {
				uni.$emit('cartNumChange', {});
			} else {
				this.$api.http.get(this.$api.apiShop.cartItemCount).then(res => {
					this.$api.store.commit('setCartNum', res.data);
				});
			}
		},
		selectCoupon(item) {
			if (item) {
				if (parseFloat(this.amountGoods) < parseFloat(item.at_least)) {
					this.$api.helper.toast(this.language.orderCreate.doNotDiscountCoupon);
					return;
				}
				this.couponItem = item;
			} else {
				this.couponItem = {};
			}
			this.isShow = false;
		},
		invoiceDelete() {
			this.invoiceItem = {};
		}
	}
};
</script>

<style lang="scss" scoped>
.order {
	padding: 10rpx 0 120rpx;
}
.dz-address-section {
	padding: 30rpx;
	background: #fff;
	position: relative;
	border-radius: 10rpx;

	.order-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.no-default-address {
		color: $dz-main-color;
		font-size: 32rpx;
	}

	.dzicon-right {
		color: $dz-tips-color;
	}

	.address {
		display: flex;
		flex-direction: column;
		flex: 1;
		font-size: 28rpx;
		color: $dz-main-color;
	}

	.name {
		font-size: 34rpx;
		margin-right: 24rpx;
	}

	.mobile {
		font-size: 34rpx;
	}

	.address {
		font-size: 24rpx;
		margin-top: 16rpx;
		margin-right: 20rpx;
		color: $dz-main-color;
	}

	.address-bg-img {
		position: absolute;
		width: 100%;
		height: 8rpx;
		left: 0;
		bottom: 0;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAECAMAAADszM6/AAAAOVBMVEUAAAAVqfH/fp//vWH/vWEVqfH/fp8VqfH/fp//vWEVqfH/fp8VqfH/fp//vWH/vWEVqfH/fp//vWHpE7b6AAAAEHRSTlMA6urqqlVVFRUVq6upqVZUDT4vVAAAAEZJREFUKM/t0CcOACAQRFF6r3v/w6IQJGwyDsPT882IQzQE0E3chToByjG5LwMgLZN3TQATmdypCciBya0cgOT3/h//9PgF49kd+6lTSIIAAAAASUVORK5CYII=')
			repeat;
	}
}

.dz-goods-section {
	margin-top: 16rpx;
	background: #fff;
	padding-bottom: 1px;
	border-radius: 10rpx;
	.g-header {
		display: flex;
		align-items: center;
		height: 84rpx;
		padding: 0 30rpx;
		position: relative;
	}

	.logo {
		display: block;
		width: 50rpx;
		height: 50rpx;
		border-radius: 100px;
	}

	.name {
		font-size: 30rpx;
		color: $dz-main-color;
		margin-left: 24rpx;
	}

	.g-item {
		display: flex;
		margin: 20rpx 30rpx;
		image {
			flex-shrink: 0;
			display: block;
			width: 172rpx;
			height: 172rpx;
			border-radius: 10rpx;
		}
		.right {
			flex: 1;
			padding-left: 16rpx;
			overflow: hidden;
		}
		.title {
			font-size: 28rpx;
			color: $dz-main-color;
			line-height: 40rpx;
			height: 80rpx;
			display: block;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.spec {
			font-size: 22rpx;
			color: $dz-tips-color;
		}

		.price-box {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			.price {
				margin-bottom: 4rpx;
			}
			.number {
				font-size: 26rpx;
				margin-left: 20rpx;
			}
		}
	}
}

// 优惠券样式
.dz-coupon__box {
	width: 100%;
}

.dz-coupon__title {
	width: 100%;
	padding: 40rpx 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.dz-icon-close {
	position: absolute;
	right: 30rpx;
	top: 50%;
	transform: translateY(-50%);
}

.dz-coupon__list {
	width: 100%;
	max-height: 640rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	background-color: $dz-bg-color;
}
.dz-not-used {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: $dz-main-color;
	background-color: #fff;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
	border-radius: 6rpx;
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
	background: #ffebeb;
	color: #e41f19;
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

.dz-list {
	margin-top: 16rpx;
	background: #fff;
	border-radius: 10rpx;
}

.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 98;

	width: 100%;
	font-size: 30rpx;
	background-color: #fff;
	color: $dz-main-color;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	.footer-bottom {
		display: flex;
		align-items: center;
		width: 100%;
		height: 110rpx;
		justify-content: space-between;
		margin-bottom: env(safe-area-inset-bottom);
	}
	.price-content {
		padding-left: 30rpx;
	}
	.price-tip {
		margin-left: 8rpx;
		font-size: 28rpx;
	}
	.price {
		font-size: 28rpx;
		font-weight: bold;
	}
	.disabled {
		background-color: #dcdfe6;
	}
}

.submit {
	width: 260rpx;
	height: 80rpx;
	margin-right: 20rpx;
}
</style>
