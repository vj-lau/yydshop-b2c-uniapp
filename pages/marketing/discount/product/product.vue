<template>
	<view>
		<shop-product-detail
			:product="productDetail"
			:customerService="customerService"
			:sessionFrom="sessionFrom"
			:shareData="shareData"
			:isBuyMode="false"
			:scrollTop="scrollTop"
		></shop-product-detail>
		<!-- 返回顶部 -->
		<dz-back-top :scrollTop="scrollTop" :customStyle="{ background: '#fff', boxShadow: '0 2px 12px 0 rgba(0, 0, 0, 0.1)' }" :icon-style="{ fontSize: '36rpx' }"></dz-back-top>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :showBack="true" :status="pageLoadingStatus" @click="pageLoadingClick" @back="pageBackClick"></dz-page-loading>
	</view>
</template>

<script>
import mpShare from '@/core/utils/mixin/mpShare.js';
export default {
	mixins: [mpShare],
	data() {
		return {
			productId: null,
			productDetail: {},
			shareData: {},
			scrollTop: 0,
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			customerService: false,
			sessionFrom: ''
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	async onLoad(e) {
		this.productId = e.id;
		this.pageLoadingStatus = 'loading';
		this.pageLoadingShow = true;
		await this.$onLaunched;
		this.getProductDetail();
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
	},
	onShow() {
		//获取最新未读客服消息
		this.$api.shop.getCustomerServiceUnread();
	},
	methods: {
		pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			this.getProductDetail();
		},
		//初始化客服
		initCustomerService() {
			let serviceType = parseInt(this.$api.shopSetting.app_service_type);
			if (serviceType > 0) {
				if (this.$api.store.getters.hasLogin) {
					this.sessionFrom =
						'{"source":"' +
						this.productDetail.name +
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
		async getProductDetail() {
			await this.$api.http
				.get(this.$api.apiShop.productDetail, {
					params: {
						id: this.productId,
						marketing_type: 'discount'
					}
				})
				.then(res => {
					this.productDetail = res.data;
					uni.setNavigationBarTitle({ title: res.data.name });
					this.pageLoadingShow = false;
					//初始化客服
					this.initCustomerService();
					//初始化公众号分享
					// #ifdef H5
					if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
						this.$api.wxHelper.wxShare(
							window.location.href,
							this.$api.shopSetting.discount_share_title,
							this.productDetail.name,
							this.sharePath(),
							this.productDetail.covers[0]
						);
					}
					// #endif
					//初始化小程序分享
					this.mpShare.title = this.$api.shopSetting.discount_share_title;
					this.mpShare.path = this.sharePath();
					this.mpShare.imageUrl = this.productDetail.covers[0];
					//初始化APP分享
					this.shareData = {
						shareUrl: this.sharePath(),
						shareTitle: this.$api.shopSetting.discount_share_title,
						shareContent: this.productDetail.name,
						shareImg: this.productDetail.covers[0]
					};
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					console.log(err);
				});
		},
		//分享路径
		sharePath() {
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			// #ifdef MP
			url = `${this.$api.routesConfig.discountProduct.path}?id=${this.productId}`;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.discountProduct.path}?id=${this.productId}`;
			// #endif
			if (this.$api.store.getters.hasLogin) {
				url = url + '&promo_code=' + this.$api.store.state.userInfo.promo_code;
			}
			return url;
		},
		pageBackClick() {
			let pages = getCurrentPages();
			if (pages.length == 1) {
				let indexPath = this.$api.appConfig.indexPath;
				uni.reLaunch({
					url: indexPath
				});
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>

<style scoped lang="scss"></style>
