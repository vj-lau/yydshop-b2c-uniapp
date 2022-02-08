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
		<view v-else class="bargain-details">
			<!-- 砍一砍 -->
			<dz-navbar :title="language.bargain.bargaiDetailTitle"></dz-navbar>
			<view class="content">
				<view class="product-card" @tap="productClick">
					<view class="title">
						<image class="img" :src="(brgainLaunchView.baseMember && brgainLaunchView.baseMember.head_portrait) || missingFace"></image>
						<view class="right">
							<view class="name">{{ brgainLaunchView.baseMember && brgainLaunchView.baseMember.nickname }}</view>
							<!-- 我发现了好货,快来帮我砍价 -->
							<text>{{ language.bargain.bargaiDetailTip }}</text>
						</view>
					</view>
					<view class="product-box" v-if="brgainLaunchView.sku">
						<image :src="brgainLaunchView.sku.baseProduct.picture"></image>
						<view class="product-right">
							<view class="name">{{ brgainLaunchView.sku.baseProduct.name }}</view>
							<view class="price" :style="{ color: theme.dzBaseColor }">
								<!-- 可砍至￥ -->
								<view>{{ language.bargain.bargaiDetail }}{{ language.application.moneySymbol }}{{ brgainLaunchView.min_money }}</view>
								<text>{{ language.application.moneySymbol }}{{ brgainLaunchView.sku.price }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 正在砍价中 -->
				<view class="status" v-if="brgainLaunchView.state == 1">{{ language.bargain.bargaiDeingNegotiated }}</view>
				<!-- 砍价失败 -->
				<view class="status" v-if="brgainLaunchView.state == 3">{{ language.bargain.bargainerror }}</view>
				<!-- 砍价成功 -->
				<view class="status" v-if="brgainLaunchView.state == 2">{{ language.bargain.bargainStatusSuccess }}</view>
				<!-- 已砍99元,还可以9砍元 -->
				<view class="tip">
					{{ language.bargain.bargaiDown }}
					<text style="font-size: 32rpx;margin-left:10rpx;margin-right: 10rpx;">{{ bargain_money }}</text>
					{{ language.bargain.baragiCanAlsoCut }}
					<text style="font-size: 36rpx;margin-left:10rpx;margin-right: 10rpx;">{{ brgainLaunchView.surplus_money }}</text>
					{{ language.bargain.baragiDollar }}
				</view>
				<view class="assist-list dz-m-b-60">
					<!-- 已砍价 -->
					<view class="title dz-font-32">{{ language.bargain.cutPriceList }}</view>
					<scroll-view scroll-y style="max-height: 600rpx;">
						<view class="item" v-for="(item, index) in brgainLaunchView.partake" :key="index">
							<view class="item-left">
								<image :src="item.partake.member_head_portrait || missingFace"></image>
								<view>
									<view class="name">{{ item.partake.member_nickname }}</view>
									<text>{{ bargainTip[$api.helper.random(0, 6)].val }}</text>
								</view>
							</view>
							<view class="item-right">
								<text class="dzicon-iconfont dzicon-flashbuyfill-copy" style="color: #fedcbd;margin-right: 10rpx;"></text>
								<!-- 砍掉9元 -->
								<text>{{ language.bargain.bargaiCutOff }}{{ item.bargain_money }}{{ language.bargain.baragiDollar }}</text>
							</view>
						</view>
						<view v-if="brgainLaunchView.partake && !brgainLaunchView.partake.length" class="dz-m-t-20 dz-text-center" style="color: #fff">
							暂无好友帮砍，去分享吧~
						</view>
					</scroll-view>
				</view>
				<view class="time" v-if="parseInt(brgainLaunchView.state) === 0 || parseInt(brgainLaunchView.state) === 1">
					<!-- 还有 -->
					<text class="dz-m-r-10">{{ language.bargain.thereAre }}</text>
					<dz-count-down
						v-if="parseInt(brgainLaunchView.state) === 0"
						:timestamp="brgainLaunchView.start_time"
						:show-days="false"
						separator="zh"
						:bg-color="theme.dzTypeError"
						color="#fff"
						separator-color="#fff"
					></dz-count-down>
					<dz-count-down
						v-if="parseInt(brgainLaunchView.state) === 1"
						:timestamp="brgainLaunchView.end_time_left"
						:bg-color="theme.dzTypeError"
						color="#fff"
						separator="zh"
						separator-color="#fff"
					></dz-count-down>
					<text class="dz-m-l-10">{{ language.bargain.bargaiDetailfinished }}</text>
				</view>
				<dz-button
					@click="share"
					v-if="brgainLaunchView.member_id == userInfo.id"
					open-type="share"
					:disabled="brgainLaunchView.end_time_left < 0 || brgainLaunchView.state == 2"
					type="warning"
					shape="circle"
					:custom-style="{ marginBottom: '30rpx' }"
				>
					{{ language.bargain.bargaiCallFriends }}
				</dz-button>
				<dz-button
					v-if="brgainLaunchView.member_id != userInfo.id"
					type="warning"
					:disabled="brgainLaunchView.end_time_left < 0 || brgainLaunchView.state == 2"
					@click="bargainTap"
					shape="circle"
				>
					{{ language.bargain.bargaiHelpCallFriends }}
				</dz-button>
				<dz-button
					v-if="brgainLaunchView.member_id == userInfo.id && brgainLaunchView.state == 2"
					type="warning"
					:disabled="brgainLaunchView.order && brgainLaunchView.order.close_left_time < 0"
					@click="toPay"
					shape="circle"
				>
					<view v-if="brgainLaunchView.order && parseInt(brgainLaunchView.order.order_status) == 0">
						<dz-count-down
							:timestamp="brgainLaunchView.order.close_left_time"
							:show-days="false"
							:color="theme.dzBaseFontColor"
							fontSize="28"
							:separator-color="theme.dzBaseFontColor"
							bg-color="#FFC43F"
							@end="timeOut"
						></dz-count-down>
						分钟将关闭支付
					</view>
					<bolck v-if="!brgainLaunchView.order">付款领取</bolck>
					<bolck v-if="brgainLaunchView.order && brgainLaunchView.order.close_left_time < 0">已关闭</bolck>
					<bolck v-if="brgainLaunchView.order && brgainLaunchView.order.pay_status == 1">订单详情</bolck>
				</dz-button>
			</view>
			<dz-page-loading :show="pageLoadingShow" :satus="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
			<!-- 砍价提示 -->
			<dz-modal
				v-model="barginShow"
				:mask-close-able="false"
				title="恭喜"
				:content="barginText"
				:confirm-color="theme.dzBaseColor"
				:async-close="true"
				@confirm="barginConfirm"
			></dz-modal>
			<dz-toast ref="dzToast"></dz-toast>
		</view>
	</view>
</template>

<script>
import appShare, { closeShare } from '@/core/utils/share';
import mpShare from '@/core/utils/mixin/mpShare.js';
import { mapState, mapGetters } from 'vuex';
export default {
	mixins: [mpShare],
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			missingFace: this.$api.assetsConfig.missingFace,
			source: 0,
			barginShow: false,
			barginText: '',
			brgainLaunchView: {},
			id: null,
			pageLoadingShow: true,
			pageLoadingStatus: 'loading',
			bargainTip: [
				// 看见砍价,随手一砍
				{ val: this.$api.language.bargain.bargainDetailTip1 },
				{ val: this.$api.language.bargain.bargainDetailTip2 },
				{ val: this.$api.language.bargain.bargainDetailTip3 },
				{ val: this.$api.language.bargain.bargainDetailTip4 },
				{ val: this.$api.language.bargain.bargainDetailTip5 },
				{ val: this.$api.language.bargain.bargainDetailTip6 },
				{ val: this.$api.language.bargain.bargainDetailTip7 }
			],
			myShow: true,
			isSwitchShow: false, // 控制砍价提示框
			guide: this.$api.assetsConfig.guide
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.language.bargain.bargaiDetailTitle
		});
		await this.$onLaunched;

		uni.$on('bargainCreate', data => {
			this.getBrgainLaunchView();
		});
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
		this.source = e.source;
		this.id = e.id;
		this.getBrgainLaunchView();
	},
	onUnload() {
		uni.$off('bargainCreate');
	},
	computed: {
		...mapState(['userInfo', 'wechatMpScene']),
		...mapGetters(['hasLogin']),
		bargain_money() {
			let money = 0;
			this.brgainLaunchView.partake &&
				this.brgainLaunchView.partake.forEach(item => {
					money += parseFloat(item.bargain_money);
				});
			return money.toFixed(2);
		}
	},
	onPullDownRefresh() {
		this.pageLoadingShow = true;
		(this.brgainLaunchView = {}), this.getBrgainLaunchView();
	},
	methods: {
		pageLoadingClick() {
			this.getBrgainLaunchView();
		},
		barginConfirm() {
			this.barginShow = false;
		},
		async getBrgainLaunchView() {
			await this.$api.http
				.get(this.$api.apiShop.bargainLaunchView, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					this.brgainLaunchView = res.data;
					this.pageLoadingShow = false;
					// TODO
					if (res.data.partake.length > 1 && this.isSwitchShow) {
						let index = res.data.partake.findIndex(item => item.member_id == this.userInfo.id);
						this.barginText = `成功砍掉${res.data.partake[index].bargain_money}元`;
						this.barginShow = true;
					}
					let myindex = res.data.member_id;
					//初始化公众号分享
					// #ifdef H5
					if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
						this.$api.wxHelper.wxShare(
							window.location.href,
							this.$api.shopSetting.bargain_detail_share_title,
							this.brgainLaunchView.sku.baseProduct.name,
							this.sharePath(),
							this.brgainLaunchView.sku.baseProduct.picture
						);
					}
					// #endif
					//初始化小程序分享
					this.mpShare.title = this.$api.shopSetting.bargain_detail_share_title;
					this.mpShare.path = this.sharePath();
					this.mpShare.imageUrl = this.brgainLaunchView.sku.baseProduct.picture;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
			uni.stopPullDownRefresh();
		},
		//分享路径
		sharePath() {
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			// #ifdef MP
			url = `${this.$api.routesConfig.bargainDetails.path}?id=${this.id}&source=${this.source}`;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.bargainDetails.path}?id=${this.id}&source=${this.source}`;
			// #endif
			if (this.$api.store.getters.hasLogin) {
				url = url + '&promo_code=' + this.userInfo.promo_code;
			}
			return url;
		},
		//营销活动开始
		marketingStart() {
			this.$set(this.brgainLaunchView, 'state', 1);
		},
		//营销活动结束
		marketingEnd() {
			this.$set(this.brgainLaunchView, 'state', 2);
		},
		async share() {
			let url = '';
			// #ifdef MP
			if (
				this.$api.store.state.wechatMpLogin &&
				this.$api.shopSetting.notify_miniprogram_sub &&
				(this.$api.shopSetting.notify_miniprogram_sub.order_bargain_success || this.$api.shopSetting.notify_miniprogram_sub.order_bargain_fail)
			) {
				const _this = this;
				let tmplIds = [];
				// 砍价成功
				this.$api.shopSetting.notify_miniprogram_sub.order_bargain_success && tmplIds.push(this.$api.shopSetting.notify_miniprogram_sub.order_bargain_success);
				// 砍价失败
				this.$api.shopSetting.notify_miniprogram_sub.order_bargain_fail && tmplIds.push(this.$api.shopSetting.notify_miniprogram_sub.order_bargain_fail);
				wx.requestSubscribeMessage({
					tmplIds: tmplIds,
					success: res => {
						url = _this.sharePath();
					},
					fail(err) {
						url = _this.sharePath();
						console.log(err, 2);
					}
				});
			} else {
				url = this.sharePath();
			}
			// #endif

			// #ifndef MP
			url = this.sharePath();
			// #endif

			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				this.$refs.dzToast.show({
					title: this.$api.language.application.wxshareTip,
					type: 'warning'
				});
			} else {
				if (this.$api.helper.copy(url)) {
					this.$refs.dzToast.show({
						title: this.$api.language.bargain.bargainShare,
						type: 'success'
					});
				}
			}
			// #endif
			// #ifdef APP-PLUS
			let shareData = {
				shareUrl: url,
				shareTitle: this.$api.shopSetting.bargain_detail_share_title,
				shareContent: this.brgainLaunchView.sku.baseProduct.name,
				shareImg: this.brgainLaunchView.sku.baseProduct.picture
			};
			appShare(shareData, res => {
				closeShare();
			});
			// #endif
		},
		// 帮好友砍一刀
		async bargainTap() {
			await this.$api.http
				.post(this.$api.apiShop.bargainPartakeCreate, {
					launch_id: this.brgainLaunchView.id
				})
				.then(res => {
					this.isSwitchShow = true;
					uni.$emit('bargainCreate', {});
				})
				.catch(err => {});
		},
		// 去支付
		async toPay() {
			let orderId = this.brgainLaunchView.order_id;
			if (this.brgainLaunchView.order_id == 0 && this.brgainLaunchView.state == 2) {
				uni.showLoading({
					title: '正在生成订单...'
				});
				await this.$api.http
					.get(this.$api.apiShop.bargainLaunchBuildOrder, {
						params: { id: this.brgainLaunchView.id }
					})
					.then(res => {
						orderId = res.data.order_id;
						this.getBrgainLaunchView();
					})
					.finally(() => {
						uni.hideLoading();
					});
			}

			if (orderId > 0) {
				this.$api.router.push({
					route: this.$api.routesConfig.orderDetail,
					query: {
						id: orderId
					}
				});
			}
		},

		timeOut() {
			this.brgainLaunchView.order.close_left_time = -1;
			this.$set(this.brgainLaunchView.order, 'close_left_time', this.brgainLaunchView.order.close_left_time);
		},
		productClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.bargainProduct,
				query: {
					id: this.brgainLaunchView.product_id
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $dz-type-error;
}
.content {
	padding: 30rpx;
}
.product-card {
	background-color: #ffffff;
	border-radius: 15rpx;
	padding: 20rpx;
	.title {
		display: flex;
		align-items: center;
		width: 100%;
		image {
			flex-shrink: 0;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}
		.right {
			margin-left: 20rpx;
			font-size: 28rpx;
			.name {
				color: $dz-tips-color;
			}
			text {
				font-size: 32rpx;

				color: $dz-main-color;
				font-weight: 700;
			}
		}
	}
	.product-box {
		display: flex;
		margin-top: 30rpx;
		image {
			flex-shrink: 0;
			width: 160rpx;
			height: 160rpx;
			border-radius: 10rpx;
		}
		.product-right {
			flex: 1;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.name {
				font-size: 28rpx;
				color: $dz-main-color;
			}
			.price {
				display: flex;
				width: 100%;
				font-size: 32rpx;
				font-weight: 700;
				text {
					margin-left: 20rpx;
					color: $dz-tips-color;
					text-decoration: line-through;
					font-weight: 400;
				}
			}
		}
	}
}
.status {
	text-align: center;
	margin-top: 30rpx;
	font-size: 36rpx;
	color: #ffffff;
}
.tip {
	text-align: center;
	margin: 20rpx 0;
	color: #ffffff;
	text {
		color: $dz-type-warning;
		font-weight: 700;
	}
}
.assist-list {
	padding: 20rpx;
	background-color: rgba(255, 255, 255, 0.4);
	border-radius: 15rpx;
	.title {
		padding-bottom: 20rpx;
		text-align: center;
		color: #ffffff;
		border-bottom: 1rpx solid #ffffff;
	}
	.item {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 10rpx;
		.item-left {
			display: flex;
			align-items: center;
			color: #ffffff;
			image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
			.name {
				font-size: 28rpx;
			}
			text {
				font-size: 24rpx;
			}
		}
		.item-right {
			display: flex;
			align-items: center;
			color: $dz-type-warning;
		}
	}
}
.time {
	padding: 30rpx 0 20rpx;
	color: #ffffff;
	text-align: center;
}
</style>
