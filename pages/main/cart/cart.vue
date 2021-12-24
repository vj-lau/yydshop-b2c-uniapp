<template>
	<view>
		<!-- navbar -->
		<dz-navbar :is-fixed="true" :is-back="false" input-align="center" :title="barTitle">
			<view class="navbar-right" slot="right" v-if="slotRight">
				<view class="right-item">
					<dz-icon name="settings_light" size="38" :label="cartSetting ? language.cart.complete : language.cart.manage" color="#000" @click="cartSettingClick"></dz-icon>
				</view>
			</view>
		</dz-navbar>
		<!-- 未登录 -->
		<view v-if="!hasLogin"><dz-empty :src="missingFace" margin-top="200" text="登录查看" @click="loginClick"></dz-empty></view>
		<!-- 购物车为空 -->
		<view v-if="hasLogin && cartList.length == 0 && !loading">
			<dz-empty margin-top="80" :text="language.cart.cartEmpty" @click="emptyClick" :src="emptyCart" iconSize="360"></dz-empty>
		</view>
		<!-- 购物车列表 -->
		<view v-if="hasLogin && cartList.length > 0">
			<!-- #ifdef MP -->
			<view class="dz-edit-goods">
				<view>{{ $api.helper.formatString(language.cart.cartTotal, cartList.length) }}</view>
				<view>
					<dz-button
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						:plain="true"
						:border="false"
						size="mini"
						shape="circle"
						throttleTime="200"
						@click="cartSettingClick"
					>
						{{ cartSetting ? language.cart.complete : language.cart.manage }}
					</dz-button>
				</view>
			</view>
			<!-- #endif -->
			<view class="dz-cart">
				<dz-checkbox-group>
					<view class="dz-cart-cell  dz-m-t-20" v-for="(item, index) in cartList" :key="index">
						<!-- 优惠提醒 -->
						<!-- <view class="dz-activity">
						<view class="dz-bold">满X件享受优惠</view>
						<view class="dz-buy">去凑单<dz-icon name="right" :size="18" :color="theme.dzMainColor"></dz-icon>
						</view>
					</view> -->
						<!-- 可销售商品 -->
						<view v-if="parseInt(item.status) != 0">
							<!-- 赠品或其它信息 -->
							<shop-swipe-action :index="index" :actions="actionOptions" @click="actionClick">
								<view slot="content" class="dz-goods-item">
									<label class="dz-checkbox">
										<dz-checkbox
											shape="circle"
											:active-color="theme.dzBaseColor"
											:value="item.selected == 0 ? false : true"
											:name="index"
											@change="checkboxChange"
										></dz-checkbox>
									</label>
									<view class="dz-goods-img" @tap.stop="productTap(item.product_id)">
										<dz-image :src="item.product_img" borderRadius="12" width="220" height="220"></dz-image>
									</view>

									<view class="dz-goods-info">
										<view class="dz-goods-title" @tap.stop="productTap(item.product_id)">
											<dz-icon
												v-if="item.memberDiscount && item.memberDiscount.discount && item.memberDiscount.discount > 0"
												class="dz-m-r-10"
												size="26"
												:color="theme.dzBaseColor"
												name="memberDiscount"
											></dz-icon>
											{{ item.product_name }}
										</view>
										<view class="dz-goods-model" @tap.stop="toggleSpec(item)">
											<view class="dz-model-text">{{ item.sku_name || singleSkuText }}</view>
											<dz-icon name="unfold" :size="24" :color="theme.dzMainColor"></dz-icon>
										</view>
										<view class="dz-price-box">
											<view class="dz-goods-price dz-font-price" :style="{ color: theme.dzBaseColor }">{{ currentPrice(item) }}</view>
											<dz-number-box
												:value="item.number"
												:min="1"
												:input-width="64"
												:input-height="36"
												:index="index"
												@blur="numberBlur"
												@change="numberChange"
												@minus="numberMinus"
												@plus="numberPlus"
											></dz-number-box>
										</view>
									</view>
								</view>
							</shop-swipe-action>
							<!-- <view class="dz-sub-info">{{language.cart.gift}}：</view> -->
						</view>
						<!-- 过期商品 -->
						<view v-if="parseInt(item.status) == 0">
							<shop-swipe-action :index="index" :actions="actionDeleteOptions" @click="actionDeleteClick">
								<view slot="content" class="dz-goods-item">
									<view class="dz-checkbox">
										<view class="dz-invalid-text">{{ language.cart.invalid }}</view>
									</view>
									<view class="dz-goods-img"><dz-image :src="item.product_img" borderRadius="12" width="220" height="220"></dz-image></view>
									<view class="dz-goods-info">
										<view class="dz-goods-title dz-gray">{{ item.product_name }}</view>
										<view class="dz-price-box dz-flex-center">
											<view class="dz-goods-invalid">{{ item.remark || language.cart.invalidProduct }}</view>
										</view>
									</view>
								</view>
							</shop-swipe-action>
						</view>
					</view>
				</dz-checkbox-group>
			</view>
		</view>
		<!-- 底部操作bar -->
		<view
			class="footer"
			v-if="hasLogin && cartList.length > 0"
			:style="{
				height: `calc(100rpx + ${parseInt(shopSetting.app_tabbar_midbutton) === 1 && tabbarList.length % 2 === 1 ? 48 : 0}rpx)`,
				paddingBottom: parseInt(shopSetting.app_tabbar_midbutton) === 1 && tabbarList.length % 2 === 1 ? '48rpx' : 0
			}"
		>
			<dz-line></dz-line>
			<view class="content">
				<dz-checkbox-group>
					<dz-checkbox shape="circle" :active-color="theme.dzBaseColor" v-model="isAllselected" @change="allSelectedChange">
						{{ language.application.selectAll }}
					</dz-checkbox>
				</dz-checkbox-group>
				<view class="right" v-if="cartSetting">
					<view class="del-btn" :style="{ color: theme.dzBaseColor }" @tap="clearLose">{{ language.cart.invalidClear }}</view>
					<view class="del-btn" :style="{ color: theme.dzBaseColor }" @tap="clearCart">{{ language.application.deleteAll }}</view>
					<view class="del-btn" :style="{ color: theme.dzBaseColor }" @tap="deleteCartItem">{{ language.application.deleteSelected }}</view>
				</view>
				<view class="right" v-if="!cartSetting">
					<view class="sum dz-line-1">
						{{ language.cart.total }}
						<text class="money dz-font-price">{{ sumPrice }}</text>
					</view>
					<view class="btn" :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" @tap="createOrder">
						{{ language.cart.buy }}({{ selectedList.length }})
					</view>
				</view>
			</view>
		</view>
		<!-- 规格弹窗 -->
		<dz-popup v-model="specShow" mode="bottom" border-radius="40" closeIcon="roundclose" closeIconSize="40" :closeable="true">
			<shop-attr-content :product="productDetail" :buyNumber="currentNumber" buttonName="确定" @confirm="attrConfirmClick"></shop-attr-content>
		</dz-popup>
		<!-- 删除提醒 -->
		<dz-modal
			ref="mModal"
			v-model="modalShow"
			:mask-close-able="false"
			:content="modalContent"
			:confirm-value="modalValue"
			:show-cancel-button="!modalLoading"
			:confirm-color="theme.dzBaseColor"
			:async-close="true"
			@cancel="modalCancel"
			@confirm="modalConfirm"
		></dz-modal>

		<view v-if="!hasLogin || (hasLogin && cartList.length == 0)">
			<shop-product-recommend :list="guessYouLikeList" :title="language.application.guessYouLike" :theme="theme"></shop-product-recommend>
			<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360" text="暂无推荐商品"></dz-empty>
			<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="160"></dz-loadmore>
		</view>
		<!-- 应用维护 -->
		<dz-modal v-model="closeSite" width="80%" :show-confirm-button="false" :show-cancel-button="false" :title="language.application.siteCloseTitle">
			<view class="dz-p-30 dz-font-sm">{{ closeSiteExplain }}</view>
		</dz-modal>
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
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import tabbarConfig from '@/core/config/tabbarConfig';
export default {
	data() {
		return {
			barTitle: '',
			theme: this.$api.theme,
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			missingFace: this.$api.assetsConfig.missingFace,
			emptyCart: this.$api.assetsConfig.emptyCart,
			empty: this.$api.assetsConfig.empty,
			closeSite: false,
			closeSiteExplain: '',
			loading: false,
			// #ifdef MP
			slotRight: false,
			// #endif
			// #ifndef MP
			slotRight: true,
			// #endif
			cartSetting: false,
			cartList: [],
			selectedList: [],
			isAllselected: false,
			specShow: false,
			modalShow: false,
			modalContent: this.$api.language.cart.clearCartConfirm,
			modalValue: '',
			modalLoading: false,
			currentSkuId: '',
			currentNumber: 1,
			productDetail: {},
			sumPrice: '0.00',
			singleSkuText: this.$api.language.cart.defaultSkuName,
			delActionIndex: 0,
			actionOptions: [
				{
					name: this.$api.language.application.collection,
					color: '#fff',
					fontsize: 30, //单位rpx
					width: 80, //单位px
					background: this.$api.theme.dzTypeWarning
				},
				{
					name: this.$api.language.application.delete,
					color: '#fff',
					fontsize: 30, //单位rpx
					width: 80, //单位px
					background: this.$api.theme.dzTypeError
				}
			],
			actionDeleteOptions: [
				{
					name: this.$api.language.application.delete,
					color: '#fff',
					fontsize: 30, //单位rpx
					width: 80, //单位px
					background: this.$api.theme.dzTypeError
				}
			],
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: [],
			defaultTabbarList: tabbarConfig.tabbarList
		};
	},
	computed: {
		...mapState(['tabbarList', 'userInfo']),
		...mapGetters(['hasLogin'])
	},
	async onLoad() {
		await this.$onLaunched;
		let pages = getCurrentPages();
		this.barTitle = this.$api.language.cart.titleCart;
		if (this.tabbarList.props && this.tabbarList.props.dataSource != 'default') {
			const list = this.tabbarList.props.list;
			const route = list.filter(item => item.pagePath == `/${pages[pages.length - 1].route}`);
			this.barTitle = route[0].text;
		}
		uni.setNavigationBarTitle({ title: this.barTitle });
		this.theme = this.$api.theme;
		this.closeSite = parseInt(this.$api.shopSetting.is_open_site) !== 1;
		this.closeSiteExplain = this.$api.shopSetting.close_site_explain;
		await this.initData();
		uni.$on('cartNumChange', data => {
			this.initData();
			if (this.hasLogin || this.cartList.length == 0) {
				this.getGuessYouLikeList();
			}
		});
		uni.$on('themeChange', () => {
			this.theme = this.$api.theme;
		});
		this.setCartPageListen(true);
		if (!this.hasLogin || this.cartList.length == 0) {
			this.getGuessYouLikeList();
		}
	},
	onUnload() {
		uni.$off(['cartNumChange', 'themeChange']);
		this.setCartPageListen(false);
	},
	onPullDownRefresh() {
		this.initData();
		if (!this.hasLogin || (this.hasLogin && this.cartList.length == 0)) {
			this.page = 1;
			this.guessYouLikeList.length = 0;
			this.getGuessYouLikeList();
		}
	},
	onReachBottom() {
		if (this.hasLogin && this.cartList > 0) return;
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getGuessYouLikeList();
	},
	methods: {
		...mapMutations(['setCartNum', 'setCartPageListen']),
		cartSettingClick() {
			if (!this.hasLogin) {
				this.loginClick();
				return;
			}
			this.cartSetting = !this.cartSetting;
		},
		async initData() {
			if (this.hasLogin) {
				await this.getMemberInfo();
				await this.getCartItemList();
			} else {
				this.cartList.length = 0;
				this.setCartNum(0);
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 500);
			}
		},
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
			});
		},
		//获取购物车
		async getCartItemList() {
			if (this.loading) {
				return;
			}
			this.loading = true;
			this.cartSetting = false;
			this.selectedList.length = 0;
			this.isAllselected = false;

			this.sumPrice = '0.00';
			await this.$api.http
				.get(this.$api.apiShop.cartItemList)
				.then(res => {
					this.loading = false;
					let cartNum = 0;
					// 云仓分销进货价格

					let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
					res.data.forEach(item => {
						item.number = parseInt(item.number);

						if (parseInt(item.status) == 1) {
							cartNum += 1;
						}
						if (item.warehouseCommissionRate && item.warehouseCommissionRate.is_distribution == 1 && level_id) {
							let commission_rate = item.warehouseCommissionRate.commission_rate;
							for (let key in commission_rate) {
								if (item.sku_id == key) {
									item.price = item.sku.price =
										commission_rate[item.sku_id][level_id] && commission_rate[item.sku_id][level_id].brokerage > 0
											? commission_rate[item.sku_id][level_id].brokerage
											: item.sku.price;
								}
							}
						}
						if (item.memberDiscount && parseFloat(item.memberDiscount.discount) > 0) {
							//会员折扣
							item.price = parseFloat(parseFloat(item.price) * (1 - parseFloat(item.memberDiscount.discount) / 100)).toFixed(2);
						}
					});

					let list = res.data;

					for (let i = 0; i < list.length; i++) {
						list[i].selected = 0;
					}
					this.cartList = list;
					this.setCartNum(cartNum);
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
					this.cartList = [];
					uni.stopPullDownRefresh();
				});
			uni.stopPullDownRefresh();
		},
		// 计算价格
		currentPrice(item) {
			let price = item.sku && item.sku.price;
			// 云仓分销进货价格
			let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
			if (item.warehouseCommissionRate && item.warehouseCommissionRate.is_distribution == 1 && level_id) {
				let commission_rate = item.warehouseCommissionRate.commission_rate;
				for (let key in commission_rate) {
					if (item.sku_id == key) {
						price =
							commission_rate[item.sku_id][level_id] && commission_rate[item.sku_id][level_id].brokerage > 0
								? commission_rate[item.sku_id][level_id].brokerage
								: item.sku.price;
					}
				}
			}
			if (item.memberDiscount && parseFloat(item.memberDiscount.discount) > 0) {
				//会员折扣
				price = parseFloat(parseFloat(price) * (1 - parseFloat(item.memberDiscount.discount) / 100)).toFixed(2);
			}

			return parseFloat(price).toFixed(2);
		},
		//登录点击
		loginClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.login
			});
		},
		//空购物车点击
		emptyClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.index
			});
		},
		//跳转到商品
		productTap(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id
				}
			});
		},
		//删除已勾选商品
		deleteCartItem() {
			this.modalContent = this.$api.language.cart.deleteCartConfirm;
			this.modalValue = 1;
			this.modalShow = true;
		},
		//清除购物车
		clearCart() {
			this.modalContent = this.$api.language.cart.clearCartConfirm;
			this.modalValue = 3;
			this.modalShow = true;
		},
		//清除无效商品
		clearLose() {
			this.modalContent = this.$api.language.cart.clearinvalidConfirm;
			this.modalValue = 2;
			this.modalShow = true;
		},
		//创建订单
		createOrder() {
			if (this.selectedList.length == 0) {
				return;
			}
			const data = {};
			const ids = [];
			let len = this.cartList.length;
			for (let i = 0; i < len; i++) {
				if (this.cartList[i].selected == 1) {
					ids.push(parseInt(this.cartList[i].id));
				}
			}
			data.type = 'cart';
			data.data = ids.join(',');
			this.cartSetting = false;
			this.selectedList.length = 0;
			this.isAllselected = false;
			for (let i = 0; i < this.cartList.length; i++) {
				if (parseInt(this.cartList[i].status) != 0) {
					this.cartList[i].selected = 0;
				}
			}
			this.sumPrice = '0.00';
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(data)
				}
			});
		},
		async actionClick(index, action) {
			if (action == 0) {
				//收藏
				this.$api.throttle(async () => {
					await this.$api.http
						.post(this.$api.apiShop.collectCreate, {
							topic_id: this.cartList[index].product_id,
							topic_type: 'product'
						})
						.then(res => {
							this.$refs.dzToast.show({
								title: this.$api.language.product.collectSuccess,
								type: 'success'
							});
						});
				}, 500);
			} else {
				//删除
				this.delActionIndex = index;
				this.modalContent = this.$api.language.cart.deleteCurrentCartConfirm;
				this.modalValue = 4;
				this.modalShow = true;
			}
		},
		async actionDeleteClick(index, action) {
			//删除过期商品
			this.delActionIndex = index;
			this.modalContent = this.$api.language.cart.deleteCurrentCartConfirm;
			this.modalValue = 4;
			this.modalShow = true;
		},
		//选择变动
		checkboxChange(e) {
			if (parseInt(this.cartList[e.name].status) === 0) {
				return;
			}
			this.$set(this.cartList[e.name], 'selected', e.value ? 1 : 0);
			let i = this.selectedList.indexOf(this.cartList[e.name].id);
			if (e.value) {
				if (i === -1) {
					this.selectedList.push(this.cartList[e.name].id);
				}
			} else {
				if (i > -1) {
					this.selectedList.splice(i, 1);
				}
			}
			let enabledlength = 0;
			for (let i = 0; i < this.cartList.length; i++) {
				if (parseInt(this.cartList[i].status) !== 0) {
					enabledlength++;
				}
			}
			this.isAllselected = this.selectedList.length === enabledlength;
			this.sum();
		},
		//全选
		allSelectedChange(e) {
			let len = this.cartList.length;
			let arr = [];
			this.selectedList.length = 0;
			for (let i = 0; i < len; i++) {
				if (parseInt(this.cartList[i].status) != 0) {
					this.$set(this.cartList[i], 'selected', e.value ? 1 : 0);
					arr.push(this.cartList[i].id);
				}
			}
			this.selectedList = e.value ? arr : [];
			if (arr.length > 0) {
				this.sum();
			}
		},
		//更新商品数量
		async updateNumber(index, value) {
			this.cartList[index].number = value;
			await this.$api.http
				.post(this.$api.apiShop.cartItemUpdateNum, {
					sku_id: this.cartList[index].sku_id,
					num: this.cartList[index].number
				})
				.then(res => {
					this.sum();
				});
		},
		numberBlur(e) {
			this.updateNumber(e.index, e.value);
		},
		numberChange(e) {
			this.updateNumber(e.index, e.value);
		},
		numberMinus(e) {
			this.updateNumber(e.index, e.value);
		},
		numberPlus(e) {
			this.updateNumber(e.index, e.value);
		},
		//计算商品总价
		sum() {
			this.sumPrice = 0;
			let len = this.cartList.length;
			const arr = [];
			for (let i = 0; i < len; i++) {
				if (this.cartList[i].selected == 1) {
					arr.push(this.cartList[i]);
					this.sumPrice = this.arrSort(arr);
				}
			}
			if (isNaN(this.sumPrice)) {
				this.sumPrice = 0.0;
			} else {
				this.sumPrice = parseFloat(this.sumPrice).toFixed(2);
			}
		},
		// 计算相同商品不同规格价格
		arrSort(arr) {
			const map = {},
				dest = [];
			for (let i = 0; i < arr.length; i++) {
				const ai = arr[i];
				if (!map[ai.product.id]) {
					dest.push({
						id: ai.product.id,
						num: 0,
						price: 0,
						data: [ai]
					});
					map[ai.product.id] = ai;
				} else {
					for (let j = 0; j < dest.length; j++) {
						const dj = dest[j];
						if (dj.data[0].product.id === ai.product.id) {
							dj.data.push(ai);
							break;
						}
					}
				}
			}
			const discountArr = [];
			dest.forEach(item => {
				item.data.forEach(item2 => {
					item.num += parseInt(item2.number);
					item.price += parseInt(item2.number) * item2.price;
				});
				const ladderPreferential = item.data[0].ladderPreferential;
				for (let i = 0; i < ladderPreferential.length; i++) {
					if (item.num >= parseInt(ladderPreferential[i].quantity)) {
						ladderPreferential[i].num = item.num;
						ladderPreferential[i].itemPrice = item.data[0].price;
						ladderPreferential[i].totalPrice = item.price;
						discountArr.push(ladderPreferential[i]);
						break;
					}
				}
			});
			let amount = 0;
			let discount = 0;
			discountArr.forEach(item2 => {
				if (parseInt(item2.type) == 1) {
					discount += item2.price * item2.num;
				} else {
					discount += item2.totalPrice - this.floor((item2.itemPrice * item2.price) / 100) * item2.num;
				}
			});
			dest.forEach(item => {
				amount += item.price;
			});
			return amount - discount;
		},
		//打开属性选择
		toggleSpec(row) {
			if (parseInt(row.status) === 0) {
				this.$refs.dzToast.show({
					title: this.$api.language.cart.notSale,
					type: 'warning'
				});
				return;
			}
			if (!this.hasLogin) {
				this.loginClick();
				return;
			}
			this.$api.throttle(() => {
				this.getProductDetail(row);
			}, 500);
		},
		//属性选择确认
		attrConfirmClick(data) {
			this.handleCartItemUpdateSku(this.currentSkuId, data.skuId, data.skuNumber);
		},
		//获取商品详情
		async getProductDetail(row) {
			this.currentSkuId = row.sku_id;
			this.currentNumber = row.number;
			await this.$api.http
				.get(this.$api.apiShop.productDetail, {
					params: {
						id: row.product_id
					}
				})
				.then(res => {
					let data = res.data;
					data.sku_data = row.sku.data;
					this.productDetail = data;
					this.specShow = true;
				});
		},
		//更新产品属性
		async handleCartItemUpdateSku(skuId, newSkuId, newSkuNum) {
			await this.$api.http
				.post(this.$api.apiShop.cartItemUpdateSku, {
					sku_id: skuId,
					new_sku_id: newSkuId,
					new_sku_num: newSkuNum
				})
				.then(res => {
					let skuId = this.currentSkuId;
					// 云仓分销进货价格
					let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
					this.specShow = false;
					//属性刷新
					this.cartList.some((item, index) => {
						if (parseInt(item.sku_id) === parseInt(skuId)) {
							let data = { ...item, ...res.data };
							if (data.warehouseCommissionRate && data.warehouseCommissionRate.is_distribution == 1 && level_id) {
								let commission_rate = data.warehouseCommissionRate.commission_rate;
								for (let key in commission_rate) {
									if (data.sku_id == key) {
										data.sku.price = data.price =
											commission_rate[data.sku_id][level_id] && commission_rate[data.sku_id][level_id].brokerage > 0
												? commission_rate[data.sku_id][level_id].brokerage
												: data.sku.price;
									}
								}
							}
							this.$set(this.cartList, index, data);
							return true;
						}
					});
				});
		},
		//关闭删除确认款
		modalCancel() {
			if (!this.modalLoading) {
				this.modalShow = false;
			}
		},
		//删除确认框
		async modalConfirm(e) {
			this.modalLoading = true;
			if (e == 1) {
				//删除选择商品
				const skuIds = [];
				for (let i = 0; i < this.cartList.length; i++) {
					if (this.cartList[i].selected == 1) {
						skuIds.push(parseInt(this.cartList[i].sku_id));
					}
				}
				if (skuIds.length == 0) {
					this.modalShow = false;
					this.$refs.dzToast.show({
						title: this.$api.language.cart.cartEmptyTip,
						type: 'warning'
					});
					return;
				}
				try {
					await this.$api.http.post(this.$api.apiShop.cartItemDel, {
						sku_ids: JSON.stringify(skuIds)
					});
					uni.$emit('cartNumChange', {});
					this.modalShow = false;
				} catch (e) {
					console.log(e);
					this.modalShow = false;
				}
			} else if (e == 2) {
				//清空失效商品
				try {
					await this.$api.http.post(this.$api.apiShop.cartItemClear, { lose_status: 1 });
					uni.$emit('cartNumChange', {});
					this.modalShow = false;
				} catch (e) {
					console.log(e);
					this.modalShow = false;
				}
			} else if (e == 3) {
				//清空购物车
				try {
					await this.$api.http.post(this.$api.apiShop.cartItemClear);
					uni.$emit('cartNumChange', {});
					this.modalShow = false;
				} catch (e) {
					console.log(e);
					this.modalShow = false;
				}
			} else if (e == 4) {
				//删除左滑的商品
				if (!this.delActionIndex && this.delActionIndex != 0) {
					return;
				}
				try {
					await this.$api.http.post(this.$api.apiShop.cartItemDel, {
						sku_ids: JSON.stringify([this.cartList[this.delActionIndex].sku_id])
					});

					uni.$emit('cartNumChange', {});
					this.modalShow = false;
				} catch (e) {
					console.log(e);
					this.modalShow = false;
				}
			}
			this.modalLoading = false;
		},
		// 猜我喜欢
		async getGuessYouLikeList() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.guessYouLikeList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.guessYouLikeList = [...this.guessYouLikeList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
					console.log(err);
				});
			uni.stopPullDownRefresh();
		}
	}
};
</script>

<style lang="scss" scoped>
.navbar-right {
	margin-right: 24rpx;
	display: flex;
	.right-item {
		margin: 0 12rpx;
		position: relative;
		color: #ffffff;
		display: flex;
	}
}

.dz-edit-goods {
	width: 100%;
	border-radius: 12rpx;
	overflow: hidden;
	padding: 24rpx 30rpx 0 30rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: $dz-main-color;
	font-size: 24rpx;
}

.dz-goods-num {
	margin: 0 10rpx;
	font-weight: bold;
}

.dz-cart {
	margin-bottom: 120rpx;
}

.dz-cart-cell {
	width: 750rpx;
	border-radius: 12rpx;
	background: #ffffff;
	padding: 40rpx 0;
}

.dz-activity {
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx 20rpx 100rpx;
	box-sizing: border-box;
}

.dz-goods-item {
	display: flex;
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.dz-buy {
	display: flex;
	align-items: center;
}

.dz-bold {
	font-weight: bold;
}

.dz-checkbox {
	min-width: 70rpx;
	display: flex;
	align-items: center;
}

.dz-goods-img {
	width: 220rpx;
	height: 220rpx !important;
	border-radius: 12rpx;
	flex-shrink: 0;
	display: block;
	background: $dz-bg-color;
}

.dz-pro-img {
	width: 100%;

	display: block;
}

.dz-goods-info {
	width: 100%;
	padding-left: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
	box-sizing: border-box;
	overflow: hidden;
}

.dz-goods-title {
	white-space: normal;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	font-size: 24rpx;
	color: $dz-main-color;
}

.dz-goods-model {
	max-width: 100%;
	color: $dz-main-color;
	background: $dz-bg-color;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 16rpx;
	box-sizing: border-box;
}

.dz-model-text {
	max-width: 100%;
	transform: scale(0.9);
	transform-origin: 0 center;
	font-size: 24rpx;
	line-height: 32rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.dz-price-box {
	width: 100%;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}

.dz-goods-price {
	font-size: 34rpx;
	font-weight: 500;
}

.dz-sub-info {
	max-width: 532rpx;
	font-size: 24rpx;
	line-height: 24rpx;
	padding: 20rpx 30rpx 10rpx 30rpx;
	box-sizing: border-box;
	color: $dz-main-color;
	transform: scale(0.8);
	transform-origin: 100% center;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-left: auto;
}

.dz-invalid-text {
	width: 66rpx;
	margin-right: 4rpx;
	text-align: center;
	font-size: 24rpx;
	color: #fff;
	background: rgba(0, 0, 0, 0.3);
	transform: scale(0.8);
	transform-origin: center center;
	border-radius: 4rpx;
	flex-shrink: 0;
}

.dz-gray {
	color: $dz-light-color !important;
}

.dz-flex-center {
	align-items: center !important;
}

.dz-goods-invalid {
	color: $dz-content-color;
	font-size: 24rpx;
}

.footer {
	width: 100%;
	background-color: #fff;
	height: 100rpx;
	position: fixed;
	bottom: 50px;
	margin-bottom: env(safe-area-inset-bottom);
	z-index: 5;

	.content {
		width: 100%;
		height: 99rpx;
		padding: 0 2%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;

		.right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.sum {
				font-size: 32rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.money {
					font-weight: 600;
				}
			}
			.btn {
				padding: 0 18rpx;
				margin-left: 20rpx;
				height: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 30rpx;
			}
			.del-btn {
				border: solid 1rpx;
				padding: 10rpx 24rpx;
				margin-left: 20rpx;
				height: 50rpx;
				border-radius: 30rpx;
				font-size: 24rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
}
</style>
