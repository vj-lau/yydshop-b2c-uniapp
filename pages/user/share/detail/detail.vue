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
		<view v-else>
			<dz-navbar :title="title">
				<view solt="left" class="dz-p-14" @tap="toHome"><dz-icon name="home_light" :size="44"></dz-icon></view>
			</dz-navbar>
			<view>
				<view class="banner" v-if="shareContent.cover">
					<view class="image"><dz-image :src="shareContent.cover[0]" width="100%" height="320" mode="widthFix"></dz-image></view>
				</view>
				<view class="dz-p-20">
					<view class="dz-sub-info">
						<view class="dz-sub-left">{{ shareContent.created_at | timeFrom }}</view>
						<view class="dz-sub-right">
							<button class="dz-transparent-btn" open-type="share" @tap.stop="shareClick"><dz-icon name="share_light" :size="30" label="分享"></dz-icon></button>
						</view>
					</view>
					<view class="title">{{ shareContent.title }}</view>
					<dz-parse :html="shareContent.content" lazy-load></dz-parse>
				</view>
			</view>
			<dz-toast ref="dzToast"></dz-toast>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import appShare, { closeShare } from '@/core/utils/share';
import mpShare from '@/core/utils/mixin/mpShare.js';
export default {
	mixins: [mpShare],
	data() {
		return {
			theme: this.$api.theme,
			title: '',
			shareContent: {},
			shareData: {},
			guide: this.$api.assetsConfig.guide
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
		this.getShareContentView(e);

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
	computed: {
		...mapState(['wechatMpScene'])
	},
	methods: {
		async getShareContentView(e) {
			await this.$api.http
				.get(this.$api.apiShare.shareContentView, {
					params: {
						id: e.id
					}
				})
				.then(res => {
					this.shareContent = res.data;
					this.title = res.data.title;
					uni.setNavigationBarTitle({
						title: res.data.title
					});
					//初始化公众号分享
					// #ifdef H5
					if (this.$api.helper.h5IsWechat()) {
						this.$api.wxHelper.wxShare(window.location.href, this.shareContent.title, this.shareContent.description, this.sharePath(), this.shareContent.cover[0]);
					}
					// #endif
					//初始化小程序分享
					this.mpShare.title = this.shareContent.title;
					this.mpShare.path = this.sharePath();
					this.mpShare.imageUrl = this.shareContent.cover[0];
					//初始化APP分享
					this.shareData = {
						shareUrl: this.sharePath(),
						shareTitle: this.shareContent.title,
						shareContent: this.shareContent.description,
						shareImg: this.shareContent.cover[0]
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
			url = `${this.$api.routesConfig.shareDetail.path}?id=${this.shareContent.id}`;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.shareDetail.path}?id=${this.shareContent.id}`;
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
					console.log(url);
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

<style lang="scss">
page {
	background-color: #fff;
}
.banner {
	width: 100%;
	.image {
		width: 100%;
		height: 320rpx;
		overflow: hidden;
	}
}
.head {
	display: flex;
	align-items: center;
	image {
		flex-shrink: 0;
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
	.right {
		margin-left: 20rpx;
		.name {
			font-size: 32rpx;
			color: $dz-main-color;
		}
		.time {
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
}
.title {
	font-size: 36rpx;
	color: $dz-main-color;
	font-weight: bold;
	padding: 30rpx 0 20rpx;
}

.dz-sub-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 28rpx;
	color: $dz-tips-color;
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
</style>
