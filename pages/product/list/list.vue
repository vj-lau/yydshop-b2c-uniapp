<template>
	<view>
		<!-- 搜索栏 -->
		<dz-navbar :is-fixed="true" :is-back="true" input-align="center">
			<view class="slot-wrap">
				<view class="search-wrap" @tap="searchTap">
					<dz-search placeholder="." :show-action="false" :disabled="true" inputAlign="right" placeholderColor="#f2f2f2"></dz-search>
					<view class="search-tip" :style="[searchStyle]">
						<text class="dz-m-r-10 dz-line-1">{{ searchDefault }}</text>
						<dz-icon name="close" color="#fff"></dz-icon>
					</view>
				</view>
			</view>
		</dz-navbar>
		<!-- 筛选 -->
		<view class="dz-header-screen">
			<view class="dz-screen-top">
				<view
					class="dz-top-item dz-icon-ml"
					:style="{ color: tabIndex == 0 ? theme.dzBaseColor : '' }"
					:class="[tabIndex == 0 ? 'dz-font-weight' : '']"
					data-index="0"
					@tap="dropdownTap"
				>
					<text>{{ selectedName }}</text>
					<text class="dzicon-iconfont" :class="selectHeight > 0 ? 'dzicon-fold' : 'dzicon-unfold'" :style="{ color: tabIndex == 0 ? theme.dzBaseColor : '#444' }"></text>
				</view>
				<view
					class="dz-top-item"
					:style="{ color: tabIndex == 1 ? theme.dzBaseColor : '' }"
					:class="[tabIndex == 1 ? 'dz-font-weight' : '']"
					@tap="dropdownTap"
					data-index="1"
				>
					{{ language.productList.sellNum }}
				</view>
				<view class="dz-top-item" @tap="dropdownTap" data-index="2">
					<text class="dzicon-iconfont dz-font-36" :class="isList > 0 ? 'dzicon-list' : 'dzicon-cascades'"></text>
				</view>
				<view class="dz-top-item dz-icon-ml" @tap="dropdownTap" data-index="3">
					<text>{{ language.productList.filter }}</text>
				</view>
				<view class="dz-dropdownlist" :class="[selectHeight > 0 ? 'dz-dropdownlist-show' : '']" :style="{ height: selectHeight + 'rpx' }">
					<view
						class="dz-dropdownlist-item dz-icon-middle"
						:class="[item.selected ? 'dz-font-weight' : '']"
						v-for="(item, index) in dropdownList"
						:key="index"
						@tap.stop="dropdownItemTap"
						:data-index="index"
					>
						<text class="dz-ml dz-middle">{{ item.name }}</text>
						<text class="dzicon-iconfont dzicon-check" :style="{ color: theme.dzBaseColor }" v-if="item.selected"></text>
					</view>
				</view>
				<view class="dz-dropdownlist-mask" :class="[selectHeight > 0 ? 'dz-mask-show' : '']" @tap.stop="hideDropdownList"></view>
			</view>
			<view class="dz-screen-bottom">
				<block v-for="(item, index) in attrArr" :key="index">
					<view
						class="dz-bottom-item dz-icon-ml"
						:style="{ background: item.isActive ? theme.dzBaseColor : '', color: item.isActive ? theme.dzBaseFontColor : '' }"
						:class="[item.isActive ? 'dz-btmItem-active' : 'dz-btmItem-normal', attrIndex == index ? 'dz-btmItem-tap' : '']"
						:data-index="index"
						@tap="typeChange"
					>
						<view class="dz-bottom-text" :class="[attrIndex == index ? 'dz-active' : '']">{{ item.isActive ? item.selectedName : item.name }}</view>
						<text
							class="dzicon-iconfont"
							:class="attrIndex == index ? 'dzicon-fold' : 'dzicon-unfold'"
							:size="14"
							:style="{ color: attrIndex == index || item.isActive ? theme.dzBaseColor : theme.dzContentColor }"
							dz-icon-class="dz-ml"
							v-if="item.list.length > 0"
						></text>
					</view>
				</block>
			</view>
		</view>
		<!--产品内容-->
		<view class="dz-product">
			<shop-product-list :list="productList" :isList="isList" :toBottom="!isList ? '20' : '0'" :leftRight="!isList ? '20' : '0'" :theme="theme"></shop-product-list>
			<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
			<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		</view>
		<!--筛选抽屉-->
		<dz-popup v-model="drawer" mode="right" :mask="false" :safe-area-inset-bottom="true" :z-index="popZindex">
			<view class="dz-drawer-box" :style="[{ paddingTop: topHeight + 'px' }]">
				<scroll-view scroll-y :style="{ height: drawerHeight + 'px' }">
					<view class="dz-drawer-title">
						<text class="dz-title-bold">{{ language.productList.priceRange }}</text>
						<view class="dz-attr-right" :style="{ color: theme.dzBaseColor }">
							<text>{{ language.productList.priceRangeTip }}</text>
						</view>
					</view>
					<view class="dz-drawer-content">
						<input placeholder-class="dz-phcolor" v-model="minPrice" class="dz-input" :placeholder="language.productList.lowestPrices" maxlength="11" type="number" />
						<text>-</text>
						<input placeholder-class="dz-phcolor" v-model="maxPrice" class="dz-input" :placeholder="language.productList.highestPrice" maxlength="11" type="number" />
					</view>
					<view class="dz-drawer-title">
						<text class="dz-title-bold">{{ language.productList.allCategories }}</text>
						<view class="dz-all-box dz-icon-ml">
							<view class="dz-attr-right" :style="{ color: theme.dzBaseColor }">{{ currentCateStr }}</view>
						</view>
					</view>
					<view class="dz-drawer-content dz-flex-attr">
						<view
							class="dz-attr-item"
							:style="{ background: item.isActive ? theme.dzBaseColor : '', color: item.isActive ? theme.dzBaseFontColor : '' }"
							:class="[item.isActive ? '' : 'dz-btmItem-normal']"
							v-for="(item, index) in productCateList"
							:key="item.id"
							@tap.stop="cateBtnSelected(index)"
						>
							<view class="dz-attr-ellipsis">{{ item.title }}</view>
						</view>
					</view>
					<view class="dz-drawer-title">
						<text class="dz-title-bold">{{ language.productList.brand }}</text>
						<view class="dz-all-box dz-icon-ml">
							<view class="dz-attr-right" :style="{ color: theme.dzBaseColor }">{{ currentBrandStr }}</view>
						</view>
					</view>
					<view class="dz-drawer-content dz-flex-attr">
						<view
							class="dz-attr-item"
							:style="{ background: item.isActive ? theme.dzBaseColor : '', color: item.isActive ? theme.dzBaseFontColor : '' }"
							:class="[item.isActive ? '' : 'dz-btmItem-normal']"
							v-for="(item, index) in brandList"
							:key="item.id"
							@tap.stop="brandBtnSelected(index)"
						>
							<view class="dz-attr-ellipsis">{{ item.title }}</view>
						</view>
					</view>
					<view class="dz-safearea-bottom"></view>
				</scroll-view>
				<view class="dz-attr-btnbox">
					<view class="dz-attr-safearea">
						<view class="dz-drawer-btn dz-drawerbtn-black" :style="{ color: theme.dzBaseColor }" hover-class="dz-white-hover" :hover-stay-time="150" @tap="resetTap">
							{{ language.application.reset }}
						</view>
						<view class="dz-drawer-btn dz-drawerbtn-primary" :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" @tap="closeDrawer">
							{{ language.application.confirm }}
						</view>
					</view>
				</view>
			</view>
		</dz-popup>
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
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			// this.$api.store.state.productSearchDefault ||
			searchDefault: this.$api.language.application.searchHold,
			loading: false,
			loadingStatus: 'loading',
			errorInfo: '',
			keyword: '',
			tabIndex: 0,
			selectedName: this.$api.language.productList.multiple,
			empty: this.$api.assetsConfig.empty,
			selectHeight: 0,
			isList: false,
			attrIndex: -1,
			drawer: false,
			drawerHeight: 0,
			page: 1,
			productList: [],
			productCateList: [],
			brandList: [],
			cateId: '',
			brandId: '',
			loadCateId: '',
			loadBrandId: '',
			minPrice: '',
			maxPrice: '',
			priceSort: '',
			salesSort: '',
			typePrams: {},
			currentCateStr: '',
			currentBrandStr: '',
			topHeight: 45,
			popZindex: this.$api.zIndex.navbar - 1,
			dropdownList: [
				{
					name: this.$api.language.productList.multiple,
					selected: true,
					param: ''
				},
				{
					name: this.$api.language.productList.priceAsc,
					selected: false,
					param: 'asc'
				},
				{
					name: this.$api.language.productList.priceDesc,
					selected: false,
					param: 'desc'
				}
			],
			attrArr: [
				{
					name: this.$api.language.productList.all,
					selectedName: this.$api.language.productList.all,
					isActive: true,
					params: {},
					list: []
				},
				{
					name: this.$api.language.productList.newProduct,
					selectedName: this.$api.language.productList.newProduct,
					isActive: false,
					params: { is_new: 1 },
					list: []
				},
				{
					name: this.$api.language.productList.recommendProduct,
					selectedName: this.$api.language.productList.recommendProduct,
					isActive: false,
					params: { is_recommend: 1 },
					list: []
				},
				{
					name: this.$api.language.productList.hotProduct,
					selectedName: this.$api.language.productList.hotProduct,
					isActive: false,
					params: { is_hot: 1 },
					list: []
				}
			]
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.productList.titleProductList
		});
		if (e.keyword) {
			this.searchDefault = this.keyword = e.keyword;
		}
		if (e.cate_id) {
			this.loadCateId = this.cateId = e.cate_id;
		}
		if (e.brand_id) {
			this.loadbrandId = this.brandId = e.brand_id;
		}
		if (e.is_new || e.is_recommend || e.is_hot) {
			let params = {};
			this.attrArr[0].isActive = false;
			this.attrArr[1].isActive = e.is_new ? true : false;
			this.attrArr[2].isActive = e.is_recommend ? true : false;
			this.attrArr[3].isActive = e.is_hot ? true : false;
			if (e.is_new) {
				params.is_new = e.is_new;
			}
			if (e.is_recommend) {
				params.is_recommend = e.is_recommend;
			}
			if (e.is_hot) {
				params.is_hot = e.is_hot;
			}
			this.typePrams = params;
		}
		if (e.min_price && this.$api.helper.isAmount(e.min_price)) {
			this.minPrice = e.min_price;
		}
		if (e.max_price && this.$api.helper.isAmount(e.max_price)) {
			this.maxPrice = e.max_price;
		}
		if (e.price_sort && ['asc', 'desc'].includes(e.price_sort)) {
			this.priceSort = e.price_sort;
			if (e.price_sort == 'asc') {
				this.dropdownList[0].selected = false;
				this.dropdownList[1].selected = true;
				this.dropdownList[2].selected = false;
			} else {
				this.dropdownList[0].selected = false;
				this.dropdownList[1].selected = false;
				this.dropdownList[2].selected = true;
			}
		} else {
			this.dropdownList[0].selected = true;
			this.dropdownList[1].selected = false;
			this.dropdownList[2].selected = false;
		}
		if (e.sales_sort && ['asc', 'desc'].includes(e.sales_sort)) {
			this.salesSort = e.sales_sort;
			if (e.sales_sort == 'asc') {
				this.tabIndex = 1;
			}
		}
		// #ifndef MP
		if (this.$api.systemInfo.platform == 'android') {
			this.topHeight = this.$api.systemInfo.statusBarHeight + 50;
		} else {
			this.topHeight = this.$api.systemInfo.statusBarHeight + 45;
		}
		// #endif

		// #ifdef MP-WEIXIN
		let custom = wx.getMenuButtonBoundingClientRect();
		this.topHeight = custom.bottom + custom.top - this.$api.systemInfo.statusBarHeight + 10;
		// #endif

		// #ifdef MP-ALIPAY
		this.topHeight = this.$api.systemInfo.statusBarHeight + this.$api.systemInfo.titleBarHeight;
		// #endif

		this.drawerHeight = this.$api.systemInfo.windowHeight - this.topHeight;

		// #ifndef MP-WEIXIN
		this.drawerHeight = this.drawerHeight - uni.upx2px(100);
		// #endif

		await this.$onLaunched;
		this.getProductList();
		if (this.$api.store.getters.hasLogin) {
			this.getMemberInfo();
		}
	},
	computed: {
		// 搜索语的样式
		searchStyle() {
			let style = {};
			// // 如果是各家小程序，导航栏内部的宽度需要减少右边胶囊的宽度
			// #ifdef MP
			let rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
			style.maxWidth = 520 - rightButtonWidth * 2 + 'rpx';
			// #endif
			// #ifndef MP
			style.maxWidth = '520rpx';
			// #endif
			return style;
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.productList.length = 0;
		this.getProductList();
		if (this.$api.store.getters.hasLogin) {
			this.getMemberInfo();
		}
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getProductList();
	},
	methods: {
		getBaseParams() {
			let params = {};
			if (this.keyword) {
				params.keyword = this.keyword;
			}
			if (this.cateId) {
				params.cate_id = this.cateId;
			}
			if (this.brandId) {
				params.brand_id = this.brandId;
			}
			if (this.minPrice) {
				params.min_price = this.minPrice;
			}
			if (this.maxPrice) {
				params.max_price = this.maxPrice;
			}
			if (this.priceSort) {
				params.price = this.priceSort;
			}
			if (this.salesSort) {
				params.total_sales = this.salesSort;
			}
			params = { ...params, ...this.typePrams };
			return params;
		},
		async getProductList() {
			if (this.loading) {
				uni.stopPullDownRefresh();
				return;
			}
			this.loading = true;
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.productList, {
					params: {
						...this.getBaseParams(),
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(async res => {
					this.loading = false;
					uni.stopPullDownRefresh();
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.productList = [...this.productList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					uni.stopPullDownRefresh();
					this.loading = false;
					this.loadingStatus = 'loadmore';
				});
		},
		async getMemberInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.$api.store.commit('setUserInfo', res.data);
			});
		},
		async getBrandList() {
			await this.$api.http.get(this.$api.apiShop.brandIndex).then(res => {
				this.brandList = res.data;
			});
		},
		async getProductCate() {
			await this.$api.http.get(this.$api.apiShop.productCate).then(res => {
				this.productCateList = res.data;
			});
		},
		searchTap() {
			this.$api.router.push({
				route: this.$api.routesConfig.search,
				query: {}
			});
		},
		dropdownItemTap(e) {
			let index = parseInt(e.currentTarget.dataset.index);
			let list = this.dropdownList;
			for (let i = 0; i < list.length; i++) {
				if (i === index) {
					list[i].selected = true;
				} else {
					list[i].selected = false;
				}
			}
			this.dropdownList = list;
			this.selectedName =
				index === 0 ? this.$api.language.productList.multiple : index === 1 ? this.$api.language.productList.priceAsc : this.$api.language.productList.priceDesc;
			this.selectHeight = 0;
			this.page = 1;
			this.productList = [];
			this.priceSort = this.dropdownList[index].param;
			this.getProductList();
		},
		dropdownTap(e) {
			let index = parseInt(e.currentTarget.dataset.index);
			if (index === 0) {
				this.showDropdownList();
			} else if (index === 1) {
				let params = {};
				if (this.tabIndex === 1) {
					this.tabIndex = null;
					this.salesSort = 'asc';
				} else {
					this.tabIndex = 1;
					this.salesSort = 'desc';
				}
				this.page = 1;
				this.productList = [];
				this.getProductList();
			} else if (index === 2) {
				this.isList = !this.isList;
			} else if (index === 3) {
				if (this.productCateList.length === 0) {
					this.getProductCate();
				}
				if (this.brandList.length === 0) {
					this.getBrandList();
				}
				this.drawer = true;
			}
		},
		showDropdownList() {
			this.selectHeight = 246;
			this.tabIndex = 0;
			this.salesSort = '';
		},
		hideDropdownList() {
			this.selectHeight = 0;
		},
		typeChange(e) {
			let index = parseInt(e.currentTarget.dataset.index);
			let arr = JSON.parse(JSON.stringify(this.attrArr[index].list));
			if (arr.length === 0) {
				this.$set(this.attrArr[index], 'isActive', !this.attrArr[index].isActive);
				if (this.attrArr[index].isActive && index === 0) {
					this.attrArr[1].isActive = false;
					this.attrArr[2].isActive = false;
					this.attrArr[3].isActive = false;
				}
				if (this.attrArr[1].isActive || this.attrArr[2].isActive || this.attrArr[3].isActive) {
					this.attrArr[0].isActive = false;
				}
				if (!this.attrArr[1].isActive && !this.attrArr[2].isActive && !this.attrArr[3].isActive) {
					this.attrArr[0].isActive = true;
				}
			} else {
				this.attrData = arr;
				this.attrIndex = index;
				this.dropScreenShow = true;
				this.$set(this.attrArr[index], 'isActive', false);
			}
			let params = {};
			this.attrArr.forEach(item => {
				if (item.isActive) {
					params = { ...params, ...item.params };
				}
			});
			this.typePrams = params;

			this.page = 1;
			this.productList = [];
			this.getProductList();
		},
		cateBtnSelected(index) {
			this.currentCateStr = '';
			this.$set(this.productCateList[index], 'isActive', !this.productCateList[index].isActive);
			const productCateArr = [];
			this.productCateList.forEach(item => {
				if (item.isActive) {
					productCateArr.push(item.title);
				}
			});
			this.currentCateStr = productCateArr.join(',');
		},
		brandBtnSelected(index) {
			this.currentBrandStr = '';
			this.$set(this.brandList[index], 'isActive', !this.brandList[index].isActive);
			const brandArr = [];
			this.brandList.forEach(item => {
				if (item.isActive) {
					brandArr.push(item.title);
				}
			});
			this.currentBrandStr = brandArr.join(',');
		},
		async resetTap() {
			this.currentBrandStr = '';
			this.currentCateStr = '';
			this.minPrice = '';
			this.maxPrice = '';
			await this.getBrandList();
			await this.getProductCate();
		},
		closeDrawer() {
			this.drawer = false;
			const brandArr = [];
			this.brandList.forEach(item => {
				if (item.isActive) {
					brandArr.push(item.id);
				}
			});
			this.brandId = brandArr.join(',');
			const cateArr = [];
			this.productCateList.forEach(item => {
				if (item.isActive) {
					cateArr.push(item.id);
				}
			});
			this.cateId = cateArr.join(',');
			this.page = 1;
			this.productList = [];
			this.getProductList();
		}
	}
};
</script>

<style lang="scss" scoped>
//搜索
.slot-wrap {
	display: flex;
	align-items: center;
	flex: 1;

	.search-wrap {
		margin: 0 20rpx;
		flex: 1;
		position: relative;
	}
	.search-tip {
		position: absolute;
		height: 50rpx;
		max-width: 100%;
		top: 50%;
		transform: translateY(-50%);
		left: 60rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 20rpx;
		border-radius: 25rpx;
		background-color: rgba(17, 17, 17, 0.6);
		color: #fff;
		font-size: 24rpx;
	}
}

.dz-header-screen {
	width: 100%;
	background: #fff;
	position: fixed;
	z-index: 99;
	.dz-screen-top,
	.dz-screen-bottom {
		border: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: $dz-main-color;
	}
	.dz-screen-top {
		height: 88rpx;
		line-height: 88rpx;
		position: relative;
		background: #fff;
	}
	.dz-top-item {
		height: 28rpx;
		line-height: 28rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		.iconfont {
			font-size: 36rpx;
			font-weight: 500;
		}
	}
	.dz-screen-bottom {
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		align-items: center;
		overflow: hidden;
	}
	.dz-bottom-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.dz-bottom-item {
		flex: 1;
		width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 12rpx;
		box-sizing: border-box;
		margin-right: 20rpx;
		white-space: nowrap;
		height: 60rpx;
		border-radius: 40rpx;
	}
	.dz-bottom-item:last-child {
		margin-right: 0;
	}
	.dz-icon-ml .dz-icon-class {
		margin-left: 6rpx;
	}
	.dz-ml {
		margin-left: 6rpx;
	}
	.dz-icon-middle .dz-icon-class {
		vertical-align: middle;
	}
	.dz-middle {
		vertical-align: middle;
	}
}

.dz-dropdownlist {
	width: 100%;
	position: absolute;
	background: #fff;
	border-bottom-left-radius: 24rpx;
	border-bottom-right-radius: 24rpx;
	overflow: hidden;
	box-sizing: border-box;
	padding-top: 10rpx;
	padding-bottom: 26rpx;
	left: 0;
	top: 88rpx;
	visibility: hidden;
	transition: all 0.2s ease-in-out;
	z-index: 99;
	.iconcheck {
		font-size: 32rpx;
		line-height: 88rpx;
	}
}
.dz-dropdownlist-show {
	visibility: visible;
}
.dz-dropdownlist-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: -1;
	transition: all 0.2s ease-in-out;
	opacity: 0;
	visibility: hidden;
}
.dz-mask-show {
	opacity: 1;
	visibility: visible;
}
.dz-dropdownlist-item {
	color: $dz-main-color;
	height: 70rpx;
	font-size: 28rpx;
	padding: 0 40rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.dz-btmItem-active {
	border-radius: 32rpx;
	font-weight: bold;
	position: relative;
}
.dz-btmItem-normal {
	border: 1rpx solid rgba(0, 0, 0, 0.12);
	position: relative;
}
.dz-btmItem-active::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 40rpx;
	left: 0;
	top: 0;
}
.dz-btmItem-tap {
	position: relative;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}
.dz-btmItem-tap::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 22rpx;
	background: #f7f7f7;
	left: 0;
	top: 58rpx;
}

.dz-drawer-box {
	width: 580rpx;
	font-size: 24rpx;
	overflow: hidden;
	position: relative;
	padding-bottom: 100rpx;
}
.dz-drawer-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	box-sizing: border-box;
	height: 80rpx;
}
.dz-title-bold {
	font-size: 26rpx;
	font-weight: bold;
	flex-shrink: 0;
}
.dz-attr-right {
	width: 70%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: right;
}
.dz-all-box {
	width: 90%;
	white-space: nowrap;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.dz-drawer-content {
	padding: 16rpx 30rpx 30rpx 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;
}
.dz-input {
	border: 0;
	height: 64rpx;
	border-radius: 32rpx;
	width: 45%;
	background: #f7f7f7;
	text-align: center;
	font-size: 28rpx;
	color: $dz-main-color;
}
.dz-phcolor {
	text-align: center;
	color: $dz-light-color;
	font-size: 24rpx;
}
.dz-flex-attr {
	flex-wrap: wrap;
	justify-content: flex-start;
}
.dz-attr-item {
	width: 30%;
	height: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 4rpx;
	box-sizing: border-box;
	border-radius: 32rpx;
	margin-right: 5%;
	margin-bottom: 5%;
}
.dz-attr-ellipsis {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	width: 96%;
	text-align: center;
}
.dz-attr-item:nth-of-type(3n) {
	margin-right: 0%;
}
.dz-attr-btnbox {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
	box-sizing: border-box;
	padding: 0 30rpx;
	background: #fff;
}
.dz-attr-safearea {
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	/*padding-bottom: env(safe-area-inset-bottom);*/
}
.dz-safearea-bottom {
	width: 100%;
	height: env(safe-area-inset-bottom);
}
.dz-attr-btnbox::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1rpx solid $dz-border-color;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}
.dz-drawer-btn {
	width: 47%;
	text-align: center;
	height: 60rpx;
	border-radius: 30rpx;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
}
.dz-drawerbtn-black {
	border: 1rpx solid;
}

.dz-product {
	margin-top: 208rpx;
}
</style>
