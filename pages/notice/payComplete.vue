<template>
	<view class="container">
		<view class="dz-bg" :style="{ background: 'linear-gradient(20deg, ' + theme.dzBaseColor + ', ' + theme.dzBaseDark + ')' }"></view>
		<view class="dz-content">
			<view class="dz-form">
				<image :src="img" class="dz-icon" mode="widthFix"></image>
				<view class="dz-title">{{ title }}</view>
				<view class="dz-sub-title">
					<dz-loading class="dz-m-r-10" v-if="loading"></dz-loading>
					<text v-if="orderGroup == 'fortune' || orderGroup == 'fortune_globe'">您可以返回测算或者回到用户中心</text>
					<text v-else-if="orderGroup == 'knowledge' || orderGroup == 'knowledge_globe'">您可以返回知识付费或者回到用户中心</text>
					<text v-else>{{ sub }}</text>
				</view>
				<view class="dz-btn-box">
					<dz-button
						v-if="orderGroup == 'fortune' || orderGroup == 'fortune_globe'"
						hoverClass="none"
						:border="false"
						:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '240rpx', height: '70rpx' }"
						:plain="true"
						shape="circle"
						@click="navTo(3)"
					>
						{{ JSON.stringify(queryForm) == '{}' ? '返回测算' : '查看结果' }}
					</dz-button>
					<dz-button
						v-else-if="orderGroup == 'knowledge' || orderGroup == 'knowledge_globe'"
						hoverClass="none"
						:border="false"
						:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '240rpx', height: '70rpx' }"
						:plain="true"
						shape="circle"
						@click="navTo(4)"
					>
						返回知识付费
					</dz-button>
					<dz-button
						v-if="orderGroup != 'recharge' && orderGroup != 'fortune' && orderGroup != 'fortune_globe' && orderGroup != 'knowledge' && orderGroup != 'knowledge_globe'"
						hoverClass="none"
						:border="false"
						:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '240rpx', height: '70rpx' }"
						:plain="true"
						shape="circle"
						@click="navTo(1)"
					>
						{{ language.notice.viewOrder }}
					</dz-button>
					<dz-button
						v-if="!isShare"
						:border="false"
						:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '240rpx', height: '70rpx' }"
						hover-class="none"
						:disabled="loading"
						shape="circle"
						@click="navTo(2)"
					>
						{{ language.notice.userCenter }}
					</dz-button>
					<dz-button
						v-else
						hoverClass="none"
						:border="false"
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '240rpx', height: '70rpx' }"
						shape="circle"
						open-type="share"
						@click="share(wholesaleView)"
					>
						邀请好友
					</dz-button>
				</view>
			</view>
		</view>
		<view class="dz-tips">
			<view class="dz-grey">{{ language.notice.tip }}</view>
			<view class="dz-light-grey">{{ tip }}</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import appShare, { closeShare } from '@/core/utils/share';
import mpShare from '@/core/utils/mixin/mpShare.js';
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			assets: this.$api.assetsConfig,
			language: this.$api.language,
			img: this.$api.assetsConfig.waitting,
			title: this.$api.language.notice.payCompleteTitle,
			sub: this.$api.language.notice.payCompleteSub,
			tip: this.$api.language.notice.payCompleteTip,
			orderId: '',
			orderType: '',
			wholesaleId: '',
			payTradeno: '',
			loading: true,
			payResultTimeout: 3000, //支付结果查询间隔
			payResultMaxCount: 5, //最大查询次数
			payResultCount: 0, //当前查询次数
			isShare: null,
			wholesaleView: {},
			orderGroup: '',
			queryForm: {}
		};
	},
	computed: {
		...mapState(['userInfo']),
		...mapGetters(['hasLogin'])
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({ title: this.$api.language.notice.payCompleteTitle });
		this.orderId = e.id || '';
		this.orderType = e.type || '';
		this.wholesaleId = e.wholesale_id || '';
		this.payTradeno = e.out_trade_no || '';
		this.orderGroup = e.orderGroup || '';
		if (e.params) {
			this.queryForm = JSON.parse(this.$api.helper.strDecode(e.params));
		}
		await this.$onLaunched;
		if (!this.payTradeno) {
			this.loading = false;
			this.title = this.$api.language.notice.payCompleteTardeNoEmptyTitle;
			this.sub = this.$api.language.notice.payCompleteTardeNoEmptySub;
			this.img = this.$api.assetsConfig.failure;
		} else {
			this.getPayResult();
		}
		// 获取拼团信息
		if (e.wholesale_id && parseInt(e.wholesale_id) != 0) {
			this.getWholesaleView();
		}
		if (this.orderGroup == 'warehouse_purchase_order') {
			uni.$emit('orderGroupChange', {});
		}
	},
	methods: {
		...mapMutations(['setUserInfo']),
		async getPayResult() {
			this.payResultCount++;
			if (this.payResultCount > this.payResultMaxCount) {
				//超时
				this.loading = false;
				this.title = this.$api.language.notice.payCompleteTimeoutTitle;
				this.sub = this.$api.language.notice.payCompleteTimeoutSub;
				this.img = this.$api.assetsConfig.timeout;
				return;
			}
			await this.$api.http
				.get(this.$api.apiShop.payLog, {
					params: {
						out_trade_no: this.payTradeno
					}
				})
				.then(async res => {
					let payStatus = parseInt(res.data.pay_status);
					if (payStatus === 0 || payStatus === 2) {
						//等待支付结果
						setTimeout(() => {
							this.getPayResult();
						}, this.payResultTimeout);
					} else if (payStatus === 1) {
						//支付成功，刷新用户信息
						await this.$api.http
							.get(this.$api.apiShop.memberInfo)
							.then(res => {
								this.setUserInfo(res.data);
							})
							.catch(err => {});
						this.loading = false;
						this.title = this.$api.language.notice.payCompleteSuccessTitle;
						this.sub = this.$api.language.notice.payCompleteSuccessSub;
						this.img = this.$api.assetsConfig.success;
					} else if (payStatus === -1) {
						//支付失败
						this.loading = false;
						this.title = this.$api.language.notice.payCompleteFailTitle;
						this.sub = this.$api.language.notice.payCompleteFailSub + ' \n ' + res.data.error_msg;
						this.img = this.$api.assetsConfig.failure;
					}
				})
				.catch(err => {
					//查询错误
					this.loading = false;
					this.title = this.$api.language.notice.payCompleteErrorTitle;
					this.sub = this.$api.language.notice.payCompleteErrorSub;
					this.img = this.$api.assetsConfig.failure;
				});
		},
		//获取拼团详情
		async getWholesaleView() {
			await this.$api.http
				.get(this.$api.apiShop.wholesaleMemberView, {
					params: {
						id: this.wholesaleId
					}
				})
				.then(res => {
					this.wholesaleView = res.data;
					this.isShare = this.wholesaleView.member_id == this.userInfo.id;
					//初始化公众号分享
					// #ifdef H5
					if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
						this.$api.wxHelper.wxShare(
							window.location.href,
							this.$api.shopSetting.wholesale_detail_share_title,
							this.wholesaleView.product_name,
							this.sharePath(),
							this.wholesaleView.product_picture
						);
					}
					// #endif
					//初始化小程序分享
					this.mpShare.title = this.$api.shopSetting.wholesale_detail_share_title;
					this.mpShare.path = this.sharePath();
					this.mpShare.imageUrl = this.wholesaleView.product_picture;
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
			url = `${this.$api.routesConfig.wholesaleDetail.path}?id=${this.wholesaleId}`;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.wholesaleDetail.path}?id=${this.wholesaleId}`;
			// #endif
			if (this.$api.store.getters.hasLogin) {
				url = url + '&promo_code=' + this.userInfo.promo_code;
			}
			return url;
		},
		//拼团分享
		share(val) {
			let url = this.sharePath();
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
			let shareData = {
				shareUrl: url,
				shareTitle: this.$api.shopSetting.wholesale_detail_share_title,
				shareContent: this.wholesaleView.product_name,
				shareImg: this.wholesaleView.product_picture
			};
			appShare(shareData, res => {
				closeShare();
			});
			// #endif
		},
		navTo(page) {
			if (page == 1) {
				// #ifdef MP
				if (
					this.$api.store.state.wechatMpLogin &&
					this.$api.shopSetting.notify_miniprogram_sub &&
					(this.$api.shopSetting.notify_miniprogram_sub.order_consign || this.$api.shopSetting.notify_miniprogram_sub.order_signin)
				) {
					const _this = this;
					let tmplIds = [];
					// 订单发货
					this.$api.shopSetting.notify_miniprogram_sub.order_consign && tmplIds.push(this.$api.shopSetting.notify_miniprogram_sub.order_consign);
					// 订单签收
					this.$api.shopSetting.notify_miniprogram_sub.order_signin && tmplIds.push(this.$api.shopSetting.notify_miniprogram_sub.order_signin);
					wx.requestSubscribeMessage({
						tmplIds: tmplIds,
						success: res => {
							_this.toOrder();
						},
						fail(err) {
							_this.toOrder();
							console.log(err, 2);
						}
					});
				} else {
					this.toOrder();
				}
				// #endif
				// #ifndef MP
				this.toOrder();
				// #endif
			} else if (page == 2) {
				this.$api.router.reLaunch({
					route: this.$api.routesConfig.profile,
					query: {}
				});
			} else if (page == 3) {
				if (JSON.stringify(this.queryForm) == '{}') {
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.calculateIndex,
						query: {
							id: this.orderId
						}
					});
					return;
				}
				this.$api.http
					.post(this.$api.apiShop.calculateSubmit, {
						id: this.orderId,
						...this.queryForm
					})
					.then(res => {
						this.$api.router.redirectTo({
							route: this.$api.routesConfig.calculateResult
						});
						uni.setStorageSync('calculateResult', res.data);
					});
			} else if (page == 4) {
				this.$api.router.redirectTo({
					route: this.$api.routesConfig.knowledgeParticulars,
					query: {
						id: this.orderId
					}
				});
			}
		},
		toOrder() {
			//拼团订单
			if (this.wholesaleId && parseInt(this.wholesaleId) !== 0) {
				this.$api.router.redirectTo({
					route: this.$api.routesConfig.wholesaleDetail,
					query: {
						id: this.wholesaleId
					}
				});
				return;
			}

			// 进货订单
			if (this.orderGroup == 'warehouse_purchase_order') {
				this.$api.router.redirectTo({
					route: this.$api.routesConfig.inventoryManagement
				});
				return;
			}
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.orderIndex,
				query: {
					status: 1
				}
			});
		}
	}
};
</script>

<style lang="scss">
.dz-bg {
	width: 100%;
	height: 260rpx;
	border-bottom-left-radius: 42rpx;
}

.dz-content {
	padding: 0 35rpx;
	box-sizing: border-box;
}

.dz-form {
	background: #fff;
	box-shadow: 0 10rpx 14rpx 0 rgba(0, 0, 0, 0.08);
	border-radius: 20rpx;
	margin-top: -100rpx;
	position: relative;
	z-index: 10;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.dz-icon {
	width: 260rpx;
	display: block;
	margin-top: 60rpx;
}

.dz-title {
	font-size: 42rpx;
	line-height: 42rpx;
	padding-top: 28rpx;
}

.dz-sub-title {
	color: #666666;
	font-size: 28rpx;
	line-height: 36rpx;
	padding: 20rpx 36rpx;
}

.dz-btn-box {
	width: 580rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 80rpx;
	padding-bottom: 40rpx;
}

.dz-btn {
	width: 240rpx;
	height: 70rpx;
}

.dz-tips {
	font-size: 26rpx;
	padding: 48rpx 90rpx;
	box-sizing: border-box;
	text-align: justify;
	line-height: 48rpx;
}

.dz-grey {
	color: #666;
}

.dz-light-grey {
	color: #888;
}
</style>
