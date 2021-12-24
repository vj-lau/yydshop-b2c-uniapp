<template>
	<view>
		<dz-navbar :title="title">
			<view solt="left" class="dz-p-14" @tap="toHome"><dz-icon name="home_light" :size="44"></dz-icon></view>
		</dz-navbar>
		<view class="container">
			<view v-if="!this.loading">
				<view class="dz-news-title">{{ article.title }}</view>
				<view class="dz-sub-info">
					<view class="dz-sub-left">
						<text class="dz-author">{{ article.author || shopSetting.store_name }}</text>
						<text>{{ article.created_at | timeFrom }}</text>
					</view>
					<view class="dz-sub-right">{{ article.view_count }}浏览</view>
					<button class="dz-transparent-btn" open-type="share" @tap.stop="shareClick"><dz-icon name="share_light" :size="30" label="分享"></dz-icon></button>
				</view>
				<view class="dz-news-content"><dz-parse :html="article.content" :lazy-load="true" ref="article"></dz-parse></view>
			</view>
			<view class="dz-safearea-bottom"></view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import appShare, { closeShare } from '@/core/utils/share';
import mpShare from '@/core/utils/mixin/mpShare.js';
export default {
	mixins: [mpShare],
	data() {
		return {
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			id: '',
			article: {},
			loading: true,
			shareContent: {},
			shareData: {},
			title: '文章详情'
		};
	},
	async onLoad(e) {
		if (e.title) {
			this.title = e.title;
			uni.setNavigationBarTitle({
				title: e.title
			});
		}
		await this.$onLaunched;
		if (e.id) {
			this.id = e.id;
			this.loadArticle(e.id);
		}
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
	methods: {
		async loadArticle(id) {
			await this.$api.http
				.get(this.$api.apiArticle.getArticleView, {
					params: {
						id: id
					}
				})
				.then(res => {
					this.article = res.data;
					uni.setNavigationBarTitle({
						title: this.article.title
					});
					this.loading = false;
					//初始化公众号分享
					// #ifdef H5
					if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
						this.$api.wxHelper.wxShare(
							window.location.href,
							this.article.title,
							this.article.description,
							this.sharePath(),
							this.article.cover || this.$api.shopSetting.store_logo
						);
					}
					// #endif
					//初始化小程序分享
					this.mpShare.title = this.article.title;
					this.mpShare.path = this.sharePath();
					this.mpShare.imageUrl = this.article.cover || this.$api.shopSetting.store_logo;
					//初始化APP分享
					this.shareData = {
						shareUrl: this.sharePath(),
						shareTitle: this.article.title,
						shareContent: this.article.description,
						shareImg: this.article.cover || this.$api.shopSetting.store_logo
					};
				});
		},
		toHome() {
			uni.reLaunch({
				url: this.$api.appConfig.indexPath
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
			url = `${this.$api.routesConfig.articleDetail.path}?id=${this.article.id}`;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.articleDetail.path}?id=${this.article.id}`;
			// #endif
			if (this.$api.store.getters.hasLogin) {
				url = url + '&promo_code=' + this.$api.store.state.userInfo.promo_code;
			}
			return url;
		},
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
		}
	}
};
</script>

<style>
page {
	background: #fff;
	color: $dz-main-color;
}

.container {
	padding: 40rpx 30rpx 110rpx 30rpx;
	box-sizing: border-box;
}

.dz-news-title {
	font-size: 48rpx;
	font-weight: 500;
	text-align: justify;
}

.dz-sub-info {
	padding-top: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: $dz-tips-color;
}

.dz-author {
	color: $dz-tips-color;
	padding-right: 20rpx;
}

.dz-news-content {
	padding-top: 20rpx;
}

.dz-safearea-bottom {
	width: 100%;
	height: env(safe-area-inset-bottom);
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
</style>
