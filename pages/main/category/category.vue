<template>
	<view class="dz-wrap">
		<!-- 搜索栏 -->
		<dz-navbar :is-fixed="true" :is-back="false" input-align="center">
			<view class="slot-wrap">
				<view class="search-wrap" @tap="searchTap"><dz-search :placeholder="searchDefault" :show-action="false" :disabled="true" input-align="center"></dz-search></view>
			</view>
		</dz-navbar>
		<!-- 一级分类样式1 -->
		<view class="dz-mendz-wrap" v-if="categoryLevel == '1-1'">
			<view class="page-view" style="width: 100%;">
				<view class="class-item">
					<view class="item-container">
						<view class="thumb-box-one" v-for="(item, index) in categoryList" :key="index" @tap.stop="categoryTab(item)">
							<view class="item-mendz-image"><dz-image :src="item.cover || iconCategoryDefault" width="132" height="132" borderRadius="15"></dz-image></view>
							<view class="item-mendz-name dz-line-1 dz-m-t-10">{{ item.title }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 一级分类样式2 -->
		<view class="dz-mendz-wrap" v-if="categoryLevel == '1-2'">
			<scroll-view scroll-y :scroll-with-animation="isTap" scroll-anchoring class="dz-tab-view" style="background: #f4f4f4;" :scroll-into-view="scrollView_leftId">
				<view
					:id="`left_${index}`"
					v-for="(item, index) in categoryList"
					:key="index"
					class="dz-tab-item"
					style="background: #f4f4f4;"
					:data-current="index"
					@tap.stop="tapChange(index, item.id)"
				>
					<text
						class="dz-line-1 dz-tab-item-active"
						:style="{
							background: currentTab == index ? 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' : '',
							color: currentTab == index ? theme.dzBaseFontColor : ''
						}"
					>
						{{ item.title }}
					</text>
				</view>
			</scroll-view>
			<scroll-view
				@scroll="scroll"
				scroll-anchoring
				scroll-y
				scroll-with-animation
				class="right-box"
				style="background: #fff;"
				:scroll-into-view="scrollView_rightId"
				@scrolltolower="scrolltolower"
			>
				<view
					class="dz-flex dz-col-center dz-row-between dz-p-20"
					:style="{ top: statusBarHeight + 44 + 'px' }"
					style="width: 550rpx; position: fixed; z-index: 999;background: #fff;"
				>
					<view>推荐</view>
					<view class="dz-flex">
						<view class="dz-flex dz-color-9" @tap="salesChange()">
							<view class="dz-m-r-10 " :style="{ color: total_sales ? theme.dzBaseColor : '' }">销量</view>
							<view v-if="!total_sales" class="dz-flex dz-flex-column">
								<dz-icon name="triangleupfill" size="20"></dz-icon>
								<dz-icon name="triangledownfill" size="20" style="margin-top: -6rpx;"></dz-icon>
							</view>
							<view v-else class="dz-flex dz-flex-column">
								<dz-icon v-if="total_sales == 'asc'" name="triangleupfill" size="20" :color="theme.dzBaseColor"></dz-icon>
								<dz-icon v-else name="triangledownfill" size="20" :color="theme.dzBaseColor" style="margin-top: -6rpx;"></dz-icon>
							</view>
						</view>
						<view class="dz-flex dz-m-l-20 dz-color-9" @tap="priceChange()">
							<view class="dz-m-r-10" :style="{ color: price ? theme.dzBaseColor : '' }">价格</view>
							<view v-if="!price" class="dz-flex dz-flex-column">
								<dz-icon name="triangleupfill" size="20"></dz-icon>
								<dz-icon name="triangledownfill" size="20" style="margin-top: -6rpx;"></dz-icon>
							</view>
							<view v-else class="dz-flex dz-flex-column">
								<dz-icon v-if="price == 'asc'" name="triangleupfill" size="20" :color="theme.dzBaseColor"></dz-icon>
								<dz-icon v-else name="triangledownfill" size="20" :color="theme.dzBaseColor" style="margin-top: -6rpx;"></dz-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="dz-p-t-80">
					<block v-for="(item, index) in productList" :key="index">
						<view class="product-item" @tap="productTab(item.id)">
							<view class="image"><dz-image :src="item.picture" borderRadius="12" width="180" height="180"></dz-image></view>
							<view class="product-right dz-m-l-20">
								<view class="name">
									<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>
									{{ item.name }}
								</view>
								<view class="dz-flex dz-row-between">
									<view class="dz-m-r-10">
										<text class="dz-font-32 dz-m-r-10" :style="{ color: theme.dzBaseColor }">￥{{ currentPrice(item) }}</text>
										<text v-if="item.market_price > 0" class="market_price">￥{{ item.market_price }}</text>
									</view>
									<view @tap.stop="toggleSpec(item)"><dz-icon name="cart" size="40" :color="theme.dzBaseColor"></dz-icon></view>
								</view>
							</view>
						</view>
					</block>
					<dz-empty v-if="loadingStatus == 'noData'" text="暂无商品数据哦~" margin-top="80" :src="empty" iconSize="360"></dz-empty>
					<view v-if="loadingStatus != 'noData'" class="dz-p-b-20"><dz-loadmore :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore></view>
				</view>
			</scroll-view>
		</view>
		<!-- 二级分类样式1 -->
		<view class="dz-mendz-wrap" v-if="categoryLevel == '2-1'">
			<scroll-view scroll-y :scroll-with-animation="isTap" scroll-anchoring class="dz-tab-view" :scroll-into-view="scrollView_leftId">
				<view :id="`left_${index}`" v-for="(item, index) in categoryList" :key="index" class="dz-tab-item" :data-current="index" @tap.stop="swichNav">
					<text
						class="dz-line-1 dz-tab-item-active"
						:style="{
							background: currentTab == index ? 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' : '',
							color: currentTab == index ? theme.dzBaseFontColor : ''
						}"
					>
						{{ item.title }}
					</text>
				</view>
			</scroll-view>
			<scroll-view @scroll="scroll" scroll-anchoring scroll-y scroll-with-animation class="right-box" :scroll-into-view="scrollView_rightId">
				<block v-for="(item, index) in categoryList" :key="index">
					<dz-linkage :recalc="1" :scrollTop="scrollTop" :index="index" @linkage="linkage">
						<view class="page-view" :id="`right_${index}`">
							<view class="class-item">
								<view class="item-title">
									<text>{{ item.title }}</text>
								</view>
								<view class="item-container">
									<view class="thumb-box" v-for="(item1, index1) in item.child" :key="index1" @tap.stop="categoryTab(item1)">
										<view class="item-mendz-image">
											<dz-image
												:src="item1.cover ? item1.cover : item.cover ? item.cover : iconCategoryDefault"
												width="132"
												height="132"
												borderRadius="15"
											></dz-image>
										</view>
										<view class="item-mendz-name dz-m-t-10 dz-line-1 dz-color-6">{{ item1.title }}</view>
									</view>
								</view>
							</view>
						</view>
					</dz-linkage>
				</block>
			</scroll-view>
		</view>
		<!-- 二级分样式2 -->
		<view class="dz-mendz-wrap" v-if="categoryLevel == '2-2'">
			<scroll-view scroll-y :scroll-with-animation="isTap" scroll-anchoring class="dz-tab-view" style="background: #f4f4f4;" :scroll-into-view="scrollView_leftId">
				<view
					:id="`left_${index}`"
					v-for="(item, index) in categoryList"
					:key="index"
					class="dz-tab-item"
					style="background: #f4f4f4;"
					:data-current="index"
					@tap.stop="tapChange(index, item.id)"
				>
					<text
						class="dz-line-1 dz-tab-item-active"
						:style="{
							background: currentTab == index ? 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' : '',
							color: currentTab == index ? theme.dzBaseFontColor : ''
						}"
					>
						{{ item.title }}
					</text>
				</view>
			</scroll-view>
			<scroll-view
				@scroll="scroll"
				scroll-anchoring
				scroll-y
				scroll-with-animation
				class="right-box"
				style="background: #fff;"
				:scroll-into-view="scrollView_rightId"
				@scrolltolower="scrolltolower"
			>
				<view :style="{ top: statusBarHeight + 44 + 'px' }" style="width: 550rpx; position: fixed; z-index: 999;background: #fff;">
					<view class="dz-m-l-20 dz-m-t-20">
						<shop-cate-tab
							:list="categoryTowList"
							:pCover="categoryList.length > 0 ? categoryList[currentTab].cover : ''"
							:activeColor="theme.dzBaseColor"
							:bgColor="theme.dzBgColor"
							:activeIndex="currentCateIndex"
							@tabClick="tabsChange"
						></shop-cate-tab>
					</view>
					<view v-if="productList.length > 0" class="dz-flex dz-col-center dz-row-between dz-p-20">
						<view>推荐</view>
						<view class="dz-flex">
							<view class="dz-flex dz-color-9" @tap="salesChange()">
								<view class="dz-m-r-10 " :style="{ color: total_sales ? theme.dzBaseColor : '' }">销量</view>
								<view v-if="!total_sales" class="dz-flex dz-flex-column">
									<dz-icon name="triangleupfill" size="20"></dz-icon>
									<dz-icon name="triangledownfill" size="20" style="margin-top: -6rpx;"></dz-icon>
								</view>
								<view v-else class="dz-flex dz-flex-column">
									<dz-icon v-if="total_sales == 'asc'" name="triangleupfill" size="20" :color="theme.dzBaseColor"></dz-icon>
									<dz-icon v-else name="triangledownfill" size="20" :color="theme.dzBaseColor" style="margin-top: -6rpx;"></dz-icon>
								</view>
							</view>
							<view class="dz-flex dz-m-l-20 dz-color-9" @tap="priceChange()">
								<view class="dz-m-r-10" :style="{ color: price ? theme.dzBaseColor : '' }">价格</view>
								<view v-if="!price" class="dz-flex dz-flex-column">
									<dz-icon name="triangleupfill" size="20"></dz-icon>
									<dz-icon name="triangledownfill" size="20" style="margin-top: -6rpx;"></dz-icon>
								</view>
								<view v-else class="dz-flex dz-flex-column">
									<dz-icon v-if="price == 'asc'" name="triangleupfill" size="20" :color="theme.dzBaseColor"></dz-icon>
									<dz-icon v-else name="triangledownfill" size="20" :color="theme.dzBaseColor" style="margin-top: -6rpx;"></dz-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view :style="[towTowStyle]">
					<block v-for="(item, index) in productList" :key="index">
						<view class="product-item" @tap="productTab(item.id)">
							<view class="image"><dz-image :src="item.picture" borderRadius="12" width="180" height="180"></dz-image></view>
							<view class="product-right dz-m-l-20">
								<dz-icon class="dz-m-r-10" :color="theme.dzBaseColor" name="memberDiscount" v-if="parseInt(item.is_open_member_discount) === 1"></dz-icon>
								<view class="name dz-line-2">{{ item.name }}</view>
								<view class="dz-flex dz-row-between">
									<view class="dz-m-r-10">
										<text class="dz-font-32 dz-m-r-10" :style="{ color: theme.dzBaseColor }">￥{{ currentPrice(item) }}</text>
										<text v-if="item.market_price > 0" class="market_price">￥{{ item.market_price }}</text>
									</view>
									<view @tap.stop="toggleSpec(item)"><dz-icon name="cart" size="50" :color="theme.dzBaseColor"></dz-icon></view>
								</view>
							</view>
						</view>
					</block>
					<dz-empty v-if="loadingStatus == 'noData'" text="暂无商品数据哦~" margin-top="80" :src="empty" iconSize="360"></dz-empty>
					<view v-if="loadingStatus != 'noData'" class="dz-p-b-20"><dz-loadmore :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore></view>
				</view>
			</scroll-view>
		</view>
		<!-- 分类样式3 -->
		<view class="dz-mendz-wrap" v-if="categoryLevel == '3-1'">
			<scroll-view scroll-y :scroll-with-animation="isTap" scroll-anchoring class="dz-tab-view" :scroll-into-view="scrollView_leftId">
				<view :id="`left_${index}`" v-for="(item, index) in categoryList" :key="index" class="dz-tab-item" :data-current="index" @tap.stop="swichNav">
					<text
						class="dz-line-1 dz-tab-item-active"
						:style="{
							background: currentTab == index ? 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' : '',
							color: currentTab == index ? theme.dzBaseFontColor : ''
						}"
					>
						{{ item.title }}
					</text>
				</view>
			</scroll-view>
			<scroll-view @scroll="scroll" scroll-anchoring scroll-y scroll-with-animation class="right-box" :scroll-into-view="scrollView_rightId">
				<block v-for="(item, index) in categoryList" :key="index">
					<dz-linkage :recalc="1" :scrollTop="scrollTop" :index="index" @linkage="linkage">
						<view class="page-view" :id="`right_${index}`">
							<view class="class-item">
								<view class="item-title">
									<text>{{ item.title }}</text>
								</view>
								<block v-for="(item1, index1) in item.child" :key="index1">
									<view class="item-sub-title">
										<text>{{ item1.title }}</text>
									</view>
									<view class="item-container">
										<view class="thumb-box" v-for="(item2, index2) in item1.child" :key="index2" @tap.stop="categoryTab(item2)">
											<view class="item-mendz-image">
												<dz-image
													:src="item1.cover ? item1.cover : item.cover ? item.cover : iconCategoryDefault"
													width="132"
													height="132"
													borderRadius="15"
												></dz-image>
											</view>
											<view class="item-mendz-name dz-m-t-10 dz-line-1">{{ item2.title }}</view>
										</view>
									</view>
								</block>
							</view>
						</view>
					</dz-linkage>
				</block>
			</scroll-view>
		</view>
		<!-- 规格弹窗 -->
		<dz-popup v-model="specShow" mode="bottom" border-radius="40" closeIcon="roundclose" closeIconSize="40" :closeable="true">
			<shop-attr-content :product="productDetail" :buyNumber="currentNumber" buttonName="加入购物车" @confirm="attrConfirmClick"></shop-attr-content>
		</dz-popup>
		<!-- 应用维护 -->
		<dz-modal v-model="closeSite" width="80%" :show-confirm-button="false" :show-cancel-button="false" :title="language.application.siteCloseTitle">
			<view class="dz-p-30 dz-font-sm">{{ closeSiteExplain }}</view>
		</dz-modal>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
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
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
import { mapState, mapGetters } from 'vuex';
import tabbarConfig from '@/core/config/tabbarConfig';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			pageLoadingStatus: 'loading',
			pageLoadingShow: false,
			closeSite: false,
			closeSiteExplain: '',
			categoryLevel: '',
			categoryList: [],
			iconCategoryDefault: this.$api.assetsConfig.iconCategoryDefault,
			searchDefault: this.$api.store.state.productSearchDefault || this.$api.language.searchHold,
			isTap: true,
			isScroll: true,
			scrollView_leftId: 'left_0',
			scrollView_rightId: 'right_0',
			currentTab: 0,
			scrollTop: 0, //tab标题的滚动条位置
			statusBarHeight: systemInfo.statusBarHeight,
			page: 1,
			loadingStatus: 'loading',
			empty: this.$api.assetsConfig.empty,
			productList: [],
			categoryTowList: [],
			currentCateIndex: 0,
			cateId: '',
			total_sales: '',
			price: '',
			specShow: false,
			currentNumber: 1,
			currentSkuId: '',
			currentSkuNumber: '',
			productDetail: {},
			defaultTabbarList: tabbarConfig.tabbarList
		};
	},
	computed: {
		...mapState(['tabbarList', 'userInfo']),
		...mapGetters(['hasLogin']),
		towTowStyle() {
			let style = {
				paddingTop: this.categoryTowList.length == 0 ? '84rpx' : '258rpx'
			};
			return style;
		}
	},
	async onLoad() {
		let pages = getCurrentPages();
		let barTitle = this.$api.language.category.titleCategory;
		if (this.tabbarList.props && this.tabbarList.props.dataSource != 'default') {
			const list = this.tabbarList.props.list;
			const route = list.filter(item => item.pagePath == `/${pages[pages.length - 1].route}`);
			barTitle = route[0].text;
		}
		uni.setNavigationBarTitle({ title: barTitle });
		this.pageLoadingStatus = 'loading';
		this.pageLoadingShow = true;
		await this.$onLaunched;
		this.theme = this.$api.theme;
		this.closeSite = parseInt(this.$api.shopSetting.is_open_site) !== 1;
		this.closeSiteExplain = this.$api.shopSetting.close_site_explain;
		uni.$on('themeChange', () => {
			this.theme = this.$api.theme;
		});
		this.getInfo();
	},
	onUnload() {
		this.$off(['themeChange']);
	},
	onPullDownRefresh() {
		this.pageLoadingStatus = 'loading';
		this.pageLoadingShow = true;
		this.categoryTowList = [];
		this.productList.length = 0;
		this.currentTab = '';
		this.cateId = '';
		this.page = 1;
		this.price = '';
		this.total_sales = '';
		this.getInfo();
	},
	methods: {
		async getInfo() {
			if (this.hasLogin) {
				await this.getMemberInfo();
			}
			await this.getCustomCate();
			await this.getCategoryList();
		},
		pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			if (this.hasLogin) {
				this.getMemberInfo();
			}
			this.getCustomCate();
			this.getCategoryList();
		},
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
			});
		},
		async getCustomCate() {
			await this.$api.http
				.get(this.$api.apiShop.customCate)
				.then(res => {
					if (!res.data.style_cate_type) return;
					this.categoryLevel = res.data.style_cate_type;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					if (err) return;
					this.$refs.dzToast.show({
						title: '网络请求错误,请检查网络是否正常!',
						type: 'error'
					});
				});
		},
		async getCategoryList() {
			await this.$api.http
				.get(this.$api.apiShop.productCate)
				.then(res => {
					this.categoryList = res.data;
					if (this.categoryLevel != '' && this.categoryLevel == '2-2') {
						this.categoryList.forEach(item => {
							if (item.child.length > 0) {
								item.child.unshift({
									title: '全部',
									id: item.id
								});
							}
						});
						this.categoryTowList = res.data[0].child;
						this.cateId = res.data[0].id;
						this.getProductList();
					}

					if (this.categoryLevel && this.categoryLevel == '1-2') {
						this.cateId = res.data[0].id;
						this.getProductList();
					}
					uni.stopPullDownRefresh();
					setTimeout(() => {
						this.pageLoadingShow = false;
					}, 100);
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					uni.stopPullDownRefresh();
				});
		},
		// 计算价格
		currentPrice(item) {
			let price = item.price;
			// 云仓分销进货价格
			let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
			if (item.warehouseCommissionRate && item.warehouseCommissionRate.is_distribution == 1 && level_id) {
				let commission_rate = item.warehouseCommissionRate.commission_rate;
				let skus = [];
				for (let key in commission_rate) {
					if (commission_rate[key][level_id] && parseFloat(commission_rate[key][level_id].brokerage) > 0) {
						skus.push(commission_rate[key][level_id].brokerage);
					}
				}
				price = skus.length ? this.get_min(skus) : item.price;
			}
			if (item.memberDiscount && parseFloat(item.memberDiscount.discount) > 0) {
				//会员折扣
				price = parseFloat(price * (1 - parseFloat(item.memberDiscount.discount) / 100)).toFixed(2);
			}
			return price;
		},
		get_min(list) {
			return Math.min.apply(
				Math,
				list.map(item => {
					return parseFloat(item);
				})
			);
		},
		swichNav: function(e) {
			let cur = e.currentTarget.dataset.current;
			if (this.currentTab == cur) {
				return false;
			} else {
				this.currentTab = cur;
				this.checkCor();
			}
		},
		checkCor: function(isScroll) {
			if (!isScroll) {
				this.isScroll = false;
				this.isTap = true;
				if (this.currentTab > 6) {
					this.scrollView_leftId = `left_${this.currentTab - 2}`;
				} else {
					this.scrollView_leftId = `left_0`;
				}
				this.scrollView_rightId = `right_${this.currentTab}`;
			} else {
				this.scrollView_leftId = `left_${this.currentTab}`;
			}
		},
		scroll(e) {
			//动画时长固定300ms
			if (!this.isScroll) {
				setTimeout(() => {
					this.isScroll = true;
				}, 300);
			} else {
				this.scrollTop = e.detail.scrollTop;
			}
		},
		linkage(e) {
			if (e.isLinkage && e.index != this.currentTab) {
				this.isTap = false;
				this.currentTab = e.index;
				this.checkCor(true);
			}
		},
		categoryTab(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.productList,
				query: {
					cate_id: item.id
				}
			});
		},
		searchTap() {
			this.$api.router.push({
				route: this.$api.routesConfig.search,
				query: {}
			});
		},
		tapChange(index, id) {
			this.categoryTowList = [];
			let cur = index;
			this.productList.length = 0;
			if (this.currentTab == cur) {
				return false;
			} else {
				this.currentTab = cur;
				this.cateId = id;
				this.page = 1;
				this.price = '';
				this.total_sales = '';
				if (this.categoryLevel == '2-2') {
					this.$nextTick(() => {
						this.categoryTowList = this.categoryList[this.currentTab].child;
						this.currentCateIndex = 0;
					});
				}
				this.getProductList();
			}
		},
		tabsChange(index) {
			if (index === this.currentCateIndex) {
				return;
			}
			this.currentCateIndex = index;
			this.cateId = this.categoryTowList[index].id;
			this.page = 1;
			this.price = '';
			this.total_sales = '';
			this.loadingStatus = 'loading';
			this.productList = [];
			this.getProductList();
		},
		productTab(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id: id
				}
			});
		},
		salesChange() {
			if (this.productList.length == 0) return;
			this.total_sales = this.total_sales === 'asc' ? 'desc' : 'asc';
			this.price = '';
			this.page = 1;
			this.productList = [];
			this.getProductList();
		},
		priceChange() {
			if (this.productList.length == 0) return;
			this.price = this.price === 'asc' ? 'desc' : 'asc';
			this.total_sales = '';
			this.page = 1;
			this.productList = [];
			this.getProductList();
		},
		scrolltolower() {
			if (this.loadingStatus == 'nomore') return;
			this.page++;
			this.getProductList();
		},
		async getProductList() {
			let params = {};
			this.loadingStatus = 'loading';
			if (this.cateId) {
				params.cate_id = this.cateId;
			}
			if (this.total_sales) {
				params.total_sales = this.total_sales;
			}
			if (this.price) {
				params.price = this.price;
			}
			await this.$api.http
				.get(this.$api.apiShop.productList, {
					params: {
						...params,
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(async res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.productList = [...this.productList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					uni.stopPullDownRefresh();
					this.loadingStatus = 'loadmore';
					this.pageLoadingStatus = 'error';
				});
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
			this.currentSkuId = data.skuId;
			this.currentSkuNumber = data.skuNumber;
			this.addToCart();
		},
		//获取商品详情
		async getProductDetail(row) {
			this.currentSkuId = row.sku_id;
			this.currentNumber = row.number;
			await this.$api.http
				.get(this.$api.apiShop.productDetail, {
					params: {
						id: row.product_id || row.id
					}
				})
				.then(res => {
					let data = res.data;
					data.sku_name = row.sku_name;
					data.sku_data = res.data.sku.length ? res.data.sku[0].data : '';
					this.productDetail = data;
					this.specShow = true;
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
					this.specShow = false;
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
		//登录点击
		loginClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.login
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}

//搜索
.slot-wrap {
	display: flex;
	align-items: center;
	flex: 1;

	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
	}
}

.dz-wrap {
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
}

.dz-mendz-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.dz-tab-view {
	flex-shrink: 0;
	width: 186rpx;
	height: 100%;
	background: #ffffff;
}

.dz-tab-item {
	height: 110rpx;
	background: #ffffff;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.dz-tab-item-active {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 148rpx;
	height: 50rpx;
	border-radius: 25rpx;
}

.right-box {
	background-color: $dz-bg-color;
}

.page-view {
	padding: 16rpx;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 16rpx;
}

.item-title {
	font-size: 26rpx;
	color: $dz-main-color;
	font-weight: bold;
}

.item-sub-title {
	font-size: 24rpx;
	padding: 20rpx 15rpx 15rpx 15rpx;
	color: $dz-content-color;
	font-weight: bold;
}

.item-mendz-name {
	font-weight: normal;
	font-size: 24rpx;
	color: $dz-main-color;
}

.item-container {
	display: flex;
	flex-wrap: wrap;
}

.thumb-box {
	width: 33.333333%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.thumb-box-one {
	width: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.item-mendz-image {
	width: 132rpx;
	height: 132rpx;
	background: #f8f8f8;
	border-radius: 15rpx;
}
.product-item {
	display: flex;
	width: 564rpx;
	padding: 20rpx;
	background: #ffffff;
	.image {
		flex-shrink: 0;
		width: 180rpx;
		height: 180rpx;
		border-radius: 12rpx;
		background: $dz-bg-color;
	}
	.product-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.name {
			width: 314rpx;
			height: 64rpx;
			color: $dz-main-color;
			font-size: 26rpx;
			line-height: 32rpx;
			word-break: break-all;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.market_price {
			text-decoration: line-through;
			color: #999;
			font-size: 24rpx;
		}
	}
}
</style>
