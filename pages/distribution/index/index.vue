<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<!-- 推广中心 -->
			<dz-navbar :title="language.profile.promotionCenter"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="language.profile.promotionCenter"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
			:border-bottom="false"
			:background="{ background: 'linear-gradient(90deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' }"
		></dz-navbar>
		<view class="pure_top" :style="{ background: 'linear-gradient(90deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' }"></view>
		<view class="content">
			<view class="user-info" :style="{ background: theme.dzPromotColor }">
				<view class="user">
					<view class="img">
						<dz-avatar :src="memberInfo.head_portrait || missingFace" size="large" :isBorder="true" :borderColor="'rgba(255,255,255,0.6)'"></dz-avatar>
					</view>
					<view class="dz-flex-8">
						<view class="name dz-line-1" style="max-width: 500rpx;">{{ memberInfo.nickname || memberInfo.realname || language.distribution.noName }}</view>
						<view v-if="memberInfo && memberInfo.promoterStore && memberInfo.promoterStore.storeLevel && memberInfo.promoterStore.storeLevel.name" class="dz-flex">
							<view class="tag dz-m-t-20" :style="{ background: theme.dzPromotDisabled, borderColor: theme.dzPromotFontColor }">
								<text class="dz-m-r-20 dz-m-l-10 dz-line-1" style="max-width: 300rpx;">{{ memberInfo.promoterStore.storeLevel.name }}</text>
								<view class="icon"><dz-icon :name="promoterLevel" size="65"></dz-icon></view>
							</view>
						</view>
						<view v-else class="dz-font-24 dz-m-l-30 dz-flex dz-flex-ac dz-m-t-20">
							<text class="dz-m-r-20">用户ID: {{ memberInfo.id }}</text>
							<view>
								<dz-button
									size="mini"
									type="info"
									shape="circle"
									throttleTime="200"
									hoverClass="none"
									:border="false"
									:customStyle="{ height: '40rpx', background: '#FFF', lineHeight: '40rpx' }"
									@click="copy(memberInfo.id)"
								>
									复制
								</dz-button>
							</view>
						</view>
					</view>
				</view>
				<view v-if="isPromoterStore" class="dz-font-24 dz-m-l-40 dz-flex dz-flex-ac">
					<text class="dz-m-r-20">用户ID: {{ memberInfo.id }}</text>
					<view>
						<dz-button
							size="mini"
							type="info"
							shape="circle"
							throttleTime="200"
							hoverClass="none"
							:border="false"
							:customStyle="{ height: '40rpx', background: '#FFF', lineHeight: '40rpx' }"
							@click="copy(memberInfo.id)"
						>
							复制
						</dz-button>
					</view>
				</view>
				<view class="card">
					<view class="card-item">
						<view>{{ memberInfo.promoter ? memberInfo.promoter.accumulate_brokerage : '0.00' }}</view>
						<!-- 累计佣金 -->
						<view class="dz-m-t-10">{{ language.profile.totalCommission }}</view>
					</view>
					<view class="card-item">
						<!-- 可用佣金 -->
						<view>{{ memberInfo.promoter ? memberInfo.promoter.user_brokerage : '0.00' }}</view>
						<view class="dz-m-t-10">{{ language.profile.leftCommission }}</view>
					</view>
					<view class="card-item">
						<view>{{ memberInfo.promoter ? memberInfo.promoter.frozen_brokerage : '0.00' }}</view>
						<!-- 冻结佣金 -->
						<view @tap.stop="frozenCommissionClick" class="dz-m-t-10">
							{{ language.profile.frozenCommission }}
							<dz-icon style="margin-left:10rpx" name="questionfill" size="28"></dz-icon>
						</view>
					</view>
					<view class="card-item">
						<view>{{ memberInfo.promoter ? memberInfo.promoter.sell_num : '0.00' }}</view>
						<!-- 销售笔数 -->
						<view class="dz-m-t-10">{{ language.distribution.salesNumber }}</view>
					</view>
					<view class="card-item">
						<view>{{ memberInfo.promoter ? memberInfo.promoter.sell_money : '0.00' }}</view>
						<!-- 销售金额 -->
						<view class="dz-m-t-10">{{ language.distribution.theSalesAmount }}</view>
					</view>
				</view>
			</view>
			<view class="order">
				<dz-cell-item
					:title="language.distribution.toPromote"
					:arrow="false"
					:border-bottom="false"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
				></dz-cell-item>
				<dz-grid col="4" :border="false" style="margin-top: -30rpx; ">
					<!-- 我的团队 -->
					<dz-grid-item @tap="toPage('distributionAgent')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="friend" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.myTeam }}</text>
					</dz-grid-item>
					<!-- 直推订单 -->
					<dz-grid-item @tap="toPage('distributionOrder')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="iconfonttuijianren" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.straightPushOrders }}</text>
					</dz-grid-item>
					<!-- 团队订单 -->
					<dz-grid-item @tap="toPage('distributionOrder', 'group')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="baby" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.teamOrders }}</text>
					</dz-grid-item>
					<!-- 升级条件 TODO -->

					<dz-grid-item v-if="false" @tap="toPage('distributionSpread')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="upstage" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.upgradeConditions }}</text>
					</dz-grid-item>
					<!-- 推广二维码 -->
					<dz-grid-item @tap="toPage('distributionPromote')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="qrcode" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm  dz-m-t-10 dz-color-6">{{ language.distribution.toPromoteQrCode }}</text>
					</dz-grid-item>
					<!-- 推广海报 -->
					<dz-grid-item @tap="toPage('distributionPoster')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="pic" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm  dz-m-t-10 dz-color-6">{{ language.distribution.toPromotePosters }}</text>
					</dz-grid-item>
				</dz-grid>
			</view>

			<view class="order">
				<dz-cell-item
					:title="'佣金'"
					:arrow="false"
					:border-bottom="false"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
				></dz-cell-item>
				<dz-grid col="4" :border="false" style="margin-top: -30rpx;">
					<!-- 我的佣金 -->
					<dz-grid-item @tap="toBrokerage">
						<view class="icon-bg">
							<view><dz-icon name="moneybag" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.myCommission }}</text>
					</dz-grid-item>
					<!-- 佣金明细 -->
					<dz-grid-item @tap="toPage('brokerageCapital')">
						<view class="icon-bg">
							<view><dz-icon name="edit" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.theCommissionSubsidiary }}</text>
					</dz-grid-item>
					<!-- 我要提现 -->
					<dz-grid-item @tap="toWithdraw">
						<view class="icon-bg">
							<view><dz-icon name="sponsor" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.iWantToWithdraw }}</text>
					</dz-grid-item>
					<!-- 提现账号 -->
					<dz-grid-item @tap="withdrawAccountClick">
						<view class="icon-bg">
							<view><dz-icon name="vipcard" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm  dz-m-t-10 dz-color-6">{{ language.distribution.cashAccount }}</text>
					</dz-grid-item>
					<!-- 提现记录 -->
					<dz-grid-item @tap="toPage('distributionCashList')">
						<view class="icon-bg">
							<view><dz-icon name="tixianjilu" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm  dz-m-t-10 dz-color-6">{{ language.distribution.withdrawalRecord }}</text>
					</dz-grid-item>
					<dz-grid-item v-if="shopSetting.commission_transfer_is_open == 1" @tap="toPage('giving')">
						<view class="icon-bg">
							<view><dz-icon name="round_transfer" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">佣金转赠</text>
					</dz-grid-item>
					<dz-grid-item v-if="shopSetting.commission_transfer_is_open == 1" @tap="toPage('givingRecord')">
						<view class="icon-bg">
							<view><dz-icon name="time" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm  dz-m-t-10 dz-color-6">转赠记录</text>
					</dz-grid-item>
				</dz-grid>
			</view>
			<view class="order" v-if="areaAgentShow">
				<!-- 代理商 -->
				<dz-cell-item
					:title="language.distribution.theAgent"
					:arrow="false"
					:border-bottom="false"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
				></dz-cell-item>
				<dz-grid col="4" :border="false" style="margin-top: -30rpx;">
					<dz-grid-item @tap="toPage('distributionApply')">
						<dz-icon name="diqiu" size="55"></dz-icon>
						<!-- 区域代理商 -->
						<text class="dz-font-sm dz-m-t-10 dz-color-6">{{ language.distribution.regionalAgent }}</text>
					</dz-grid-item>
				</dz-grid>
			</view>
		</view>
		<shop-product-recommend :list="guessYouLikeList" :theme="theme"></shop-product-recommend>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-modal
			v-model="frozenCommissionModalShow"
			:title="language.application.modalTitle"
			:content="language.profile.frozenCommissionTip"
			:show-cancel-button="false"
			:confirm-color="theme.dzBaseColor"
			@confirm="frozenCommissionModalShow = false"
		></dz-modal>
		<dz-page-loading :show="loadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import uQRCode from '@/core/utils/uqrcode.js';
import painter from '@/core/utils/mp-painter';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			promoterLevel: this.$api.assetsConfig.promoterLevel,
			scrollTop: 0,
			opacity: 0,
			memberInfo: {
				promoter: {
					is_regional_agent: 0,
					regional_agent_level: 0
				}
			},
			missingFace: this.$api.assetsConfig.missingFace,
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: [],
			loadingShow: true,
			pageLoadingStatus: 'loading',
			postPath: '',
			posterShow: false,
			withdrawConfig: null,
			frozenCommissionModalShow: false,
			areaAgentShow: false
		};
	},
	computed: {
		...mapState(['userInfo', 'shopSetting']),
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		},
		// 是否店铺分销
		isPromoterStore() {
			return (
				this.userInfo &&
				this.userInfo.promoter &&
				this.userInfo.promoter_store_is_open == 1 &&
				this.userInfo.promoter.promoterStore &&
				this.userInfo.promoter.promoterStore.storeLevel &&
				this.userInfo.promoter.promoterStore.state == 1 &&
				this.userInfo.promoter.promoterStore.level_id > 0
			);
		}
	},
	filters: {
		regionalAgentLevel(val) {
			let level = parseInt(val);
			if (level === 1) {
				return '省代';
			} else if (level === 2) {
				return '市代';
			} else if (level === 3) {
				return '区代';
			} else {
				return '';
			}
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.promotionCenter
		});
		uni.$on('memberChange', data => {
			this.getMemberIndex();
		});
		await this.$onLaunched;
		this.areaAgentShow = parseInt(this.$api.shopSetting.show_distribution_agent_area) == 1;
		this.getMemberIndex();
	},
	onUnload() {
		uni.$off('memberChange');
	},
	async onShow() {
		await this.$onLaunched;
		this.getWithdrawConfig();
	},
	onPullDownRefresh() {
		this.guessYouLikeList.length = 0;
		this.page = 1;
		this.getMemberIndex();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getGuessYouLikeList();
	},
	methods: {
		getMemberIndex() {
			this.$api.http
				.get(this.$api.apiDistribution.memberIndex)
				.then(res => {
					this.loadingShow = false;
					this.memberInfo = res.data;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					return;
				});
			this.getGuessYouLikeList();
		},
		loadingClick() {
			this.getMemberIndex();
		},
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		toBrokerage() {
			// #ifdef MP
			if (this.$api.store.state.wechatMpLogin && this.$api.shopSetting.notify_miniprogram_sub && this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_change) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_change //   账户余额变动通知
					],
					success: res => {
						_this.$api.router.push({
							route: _this.$api.routesConfig.brokerage
						});
					},
					fail(err) {
						console.log(err, 2);
					}
				});
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig.brokerage
				});
			}
			// #endif
			// #ifndef MP
			this.$api.router.push({
				route: this.$api.routesConfig.brokerage
			});
			// #endif
		},
		toPage(url, type) {
			if (url == 'giving' && !this.memberInfo.pay_password_hash) {
				url = 'setPayPswHash';
				type = 'add';
			}
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					type
				}
			});
		},
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
				});
			uni.stopPullDownRefresh();
		},
		toWithdraw() {
			// #ifdef MP
			if (this.$api.store.state.wechatMpLogin && this.$api.shopSetting.notify_miniprogram_sub && this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_withdraw) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_withdraw //   佣金提现审核通知
					],
					success: res => {
						_this.withdrawClick();
					},
					fail(err) {
						console.log(err, 2);
					}
				});
			} else {
				this.withdrawClick();
			}
			// #endif
			// #ifndef MP
			this.withdrawClick();
			// #endif
		},
		//提现申请
		async withdrawClick() {
			if (!this.withdrawConfig) {
				uni.showLoading({
					mask: true
				});
				let loaded = await this.getWithdrawConfig();
				uni.hideLoading();
				// 加载配置失败
				if (!this.withdrawConfig) {
					this.$refs.dzToast.show({
						title: this.$api.language.profile.failedToLoadConfiguration,
						type: 'error'
					});
					return;
				}
			}
			if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 1) {
				//通商云提现账号
				this.toPage('allinpayWithdraw');
			} else if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 2) {
				//通商云提现账号
				this.toPage('allinpayWithdrawE');
			} else {
				//普通提现账号
				this.toPage('distributionCash');
			}
		},
		//提现账号
		async withdrawAccountClick() {
			if (!this.withdrawConfig) {
				uni.showLoading({
					mask: true
				});
				let loaded = await this.getWithdrawConfig();
				uni.hideLoading();
				if (!this.withdrawConfig) {
					this.$refs.dzToast.show({
						title: this.$api.language.profile.failedToLoadConfiguration,
						type: 'error'
					});
					return;
				}
			}
			if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 1) {
				//通商云提现账号
				this.toPage('allinpayCard');
			} else if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 2) {
				//通商云e+提现账号
				this.toPage('allinpayCardE');
			} else {
				//普通提现账号
				this.toPage('distributionWithdraw');
			}
		},
		//获取提现配置
		async getWithdrawConfig() {
			await this.$api.http
				.get(this.$api.apiDistribution.withdrawConfig)
				.then(res => {
					this.withdrawConfig = res.data;
					if (this.withdrawConfig && this.withdrawConfig.commission_withdraw_mode) {
						this.$api.store.commit('setAllinpayMode', this.withdrawConfig.commission_withdraw_mode);
					}
					return true;
				})
				.catch(err => {
					return false;
				});
		},
		frozenCommissionClick() {
			this.frozenCommissionModalShow = true;
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '已复制到剪贴板',
				type: 'success'
			});
		}
	}
};
</script>

<style lang="scss">
.pure_top {
	width: 100%;
	height: 160rpx;
	position: relative;
	z-index: 0;
	overflow: hidden;
}

.pure_top::after {
	content: '';
	width: 120%;
	height: 160rpx;
	position: absolute;
	left: -10%;
	top: 0;
	border-radius: 0 0 50% 50%;
}
.content {
	padding: 24rpx;
	margin-top: -160rpx;
	position: relative;
}
.user-info {
	border-radius: 20rpx;

	color: #ffffff;
	.user {
		display: flex;
		font-size: 36rpx;
		padding: 30rpx;
		.img {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
		}
		.name {
			margin-left: 20rpx;
		}
		.tag {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 36rpx;
			padding: 6rpx 20rpx;
			border-radius: 0 0 36rpx 0;
			font-size: 24rpx;
			box-shadow: 0 2rpx 0.5rpx 0 rgba(0, 0, 0, 0.02), 0 1rpx 1rpx 0 rgba(0, 0, 0, 0.1), 0 2rpx 2rpx 0 rgba(0, 0, 0, 0.02);
			margin-left: 50rpx;
			position: relative;
			.icon {
				position: absolute;
				top: -16rpx;
				left: -36rpx;
				font-size: 60rpx;
			}
		}
	}
	.card {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		padding: 24rpx 24rpx;
		.card-item {
			display: flex;
			flex-direction: column;
			text-align: center;
			font-size: 24rpx;
		}
	}
}
.order {
	background-color: #ffffff;
	margin-top: 24rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.icon-bg {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;

	background: #f7f7f7;
}

/*海报*/
.hideCanvasView {
	position: relative;
}

.hideCanvas {
	position: fixed;
	top: -99999upx;
	left: -99999upx;
	z-index: -99999;
}

.flex_row_c_c {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}

.modalView {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 0;
	outline: 0;
	transform: scale(1.2);
	perspective: 2500upx;
	background: rgba(0, 0, 0, 0.6);
	transition: all 0.3s ease-in-out;
	pointer-events: none;
	backface-visibility: hidden;
	z-index: 999;
}

.modalView.show {
	opacity: 1;
	transform: scale(1);
	pointer-events: auto;
}

.flex_column {
	display: flex;
	flex-direction: column;
}

.backgroundColor-white {
	background-color: white;
}

.border_radius_10px {
	border-radius: 10px;
}

.padding1vh {
	padding: 1vh;
}

.posterImage {
	width: 70vw;
}

.flex_row {
	display: flex;
	flex-direction: row;
}

.marginTop2vh {
	margin-top: 2vh;
}
</style>
