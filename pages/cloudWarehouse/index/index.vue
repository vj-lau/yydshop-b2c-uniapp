<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar title="经销商中心"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			title="经销商中心"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
			:border-bottom="false"
			:background="{ background: theme.dzBaseColor }"
		></dz-navbar>
		<view class="header" :style="{ background: theme.dzBaseColor }">
			<view class="left">
				<view class="img"><dz-avatar :src="memberInfo.head_portrait || missingFace" size="large" :isBorder="true" :borderColor="'rgba(255,255,255,0.6)'"></dz-avatar></view>
				<view class="user-info">
					<view class="dz-font-36 dz-font-weight dz-line-1" style="max-width: 480rpx;">
						{{ memberInfo.nickname || memberInfo.realname || language.distribution.noName }}
					</view>
					<view>
						ID: {{ memberInfo.id }}
						<dz-icon class="dz-m-l-6" name="copy-line" @click="copy(memberInfo.id)"></dz-icon>
					</view>
					<view>
						经销商等级:
						{{
							(memberInfo.promoter &&
								memberInfo.promoter.promoterWarehouse &&
								memberInfo.promoter.promoterWarehouse.warehouseLevelSingle &&
								memberInfo.promoter.promoterWarehouse.warehouseLevelSingle.name) ||
								'--'
						}}
					</view>
				</view>
			</view>
			<view class="dz-m-r-30" @tap="toPage('distributionPromote')"><dz-icon name="qrcode" size="60"></dz-icon></view>
		</view>
		<view class="data">
			<view class="item">
				<view class="sum">{{ memberInfo.promoter ? memberInfo.promoter.accumulate_brokerage : '0.00' }}</view>
				<view class="text">累计收益</view>
			</view>
			<view class="item">
				<view class="sum">{{ memberInfo.promoter ? memberInfo.promoter.user_brokerage : '0.00' }}</view>
				<view class="text">当前收益</view>
			</view>
			<view class="item">
				<view class="sum">{{ memberInfo.promoter ? memberInfo.promoter.frozen_brokerage : '0.00' }}</view>
				<view class="text">待结算货款</view>
			</view>
			<view class="item">
				<view class="sum">{{ memberInfo.sale_stock || 0 }}</view>
				<view class="text">销货笔数</view>
			</view>
		</view>
		<view class="card-box">
			<view class="card-item">
				<dz-cell-item
					title="经销管理"
					:arrow="false"
					:border-bottom="false"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
				></dz-cell-item>
				<dz-grid col="4" :border="false" style="margin-top: -30rpx; ">
					<dz-grid-item @tap="toPage('inventoryRecords')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="order-record" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">库存记录</text>
					</dz-grid-item>
					<dz-grid-item @tap="toPage('distributionAgent', 'cloud')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="share" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">商家人脉</text>
					</dz-grid-item>
					<dz-grid-item @tap="toPage('inventoryManagement')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="baby" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">库存管理</text>
					</dz-grid-item>
					<dz-grid-item @tap="toPage('distributionPoster', 'cloud')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="pic" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">经销海报</text>
					</dz-grid-item>
					<dz-grid-item @tap="toPage('rankingList')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="upstage" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm  dz-m-t-10 dz-color-6">排行榜</text>
					</dz-grid-item>
					<dz-grid-item @tap="toPage('storeLevelLog')">
						<view class="icon-bg" :style="{ background: $api.helper.colorToRgba(theme.dzBaseDisabled) }">
							<view><dz-icon name="time" size="55" :color="theme.dzBaseColor"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">升级日志</text>
					</dz-grid-item>
				</dz-grid>
			</view>
			<!-- 财务管理 -->
			<view class="card-item">
				<dz-cell-item
					title="财务管理"
					:arrow="false"
					:border-bottom="false"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
				></dz-cell-item>
				<dz-grid col="4" :border="false" style="margin-top: -30rpx; ">
					<dz-grid-item @tap="toIncome">
						<view class="icon-bg">
							<view><dz-icon name="moneybag" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">货款收益</text>
					</dz-grid-item>

					<dz-grid-item @tap="toPage('brokerageCapital', 'cloud')">
						<view class="icon-bg">
							<view><dz-icon name="edit" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">收益日志</text>
					</dz-grid-item>
					<dz-grid-item @tap="withdrawAccountClick">
						<view class="icon-bg">
							<view><dz-icon name="vipcard" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">提现账号</text>
					</dz-grid-item>
					<dz-grid-item @tap="toWithdraw">
						<view class="icon-bg">
							<view><dz-icon name="sponsor" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">我要提现</text>
					</dz-grid-item>
					<dz-grid-item v-if="shopSetting.commission_transfer_is_open == 1" @tap="toPage('giving', 'cloud')">
						<view class="icon-bg">
							<view><dz-icon name="round_transfer" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">货款转赠</text>
					</dz-grid-item>
					<dz-grid-item @tap="toPage('distributionCashList')">
						<view class="icon-bg">
							<view><dz-icon name="tixianjilu" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">提现记录</text>
					</dz-grid-item>
					<dz-grid-item v-if="shopSetting.commission_transfer_is_open == 1" @tap="toPage('givingRecord', 'cloud')">
						<view class="icon-bg">
							<view><dz-icon name="newshot" size="55" color="#999"></dz-icon></view>
						</view>
						<text class="dz-font-sm dz-m-t-10 dz-color-6">转赠记录</text>
					</dz-grid-item>
				</dz-grid>
			</view>
		</view>
		<dz-page-loading :show="loadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
		<!--个人海报-->
		<view class="flex_row_c_c modalView" :class="postShow ? 'show' : ''" @tap="hidePost()">
			<view class="flex_column">
				<view class="backgroundColor-white padding1vh border_radius_10px">
					<!-- #ifdef H5 -->
					<img :src="postPath || ''" class="posterImage" />
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<dz-image :src="postPath || ''" width="520" height="926"></dz-image>
					<!-- #endif -->
				</view>
				<view class="flex_row marginTop2vh">
					<dz-button
						size="mini"
						:border="false"
						hoverClass="none"
						:customStyle="{ width: '180rpx', height: '60rpx', background: theme.dzBaseColor, color: theme.dzBaseFontColor, marginRight: '20rpx' }"
						@tap.prevent.stop="saveImage()"
					>
						保存图片
					</dz-button>
					<dz-button
						size="mini"
						:border="false"
						hoverClass="none"
						:customStyle="{ width: '180rpx', height: '60rpx', background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						@tap.prevent.stop="share()"
					>
						分享图片
					</dz-button>
				</view>
			</view>
		</view>
		<canvas class="hideCanvas" canvas-id="qrcodes" style="width: 250px;height: 250px;" />
		<canvas class="hideCanvas" canvas-id="my_PosterCanvasId" id="my_PosterCanvasId" style="width:1125rpx;height:2001rpx"></canvas>
		<shop-product-recommend :list="guessYouLikeList" :theme="theme"></shop-product-recommend>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import uQRCode from '@/core/utils/uqrcode.js';
import Painter from '@/core/utils/mp-painter';
import _app from '@/core/utils/app.js';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			logo: this.$api.shopSetting.app_logo,
			scrollTop: 0,
			opacity: 0,
			memberInfo: {
				promoter: {
					is_regional_agent: 0,
					regional_agent_level: 0
				}
			},
			missingFace: this.$api.assetsConfig.missingFace,
			loadingShow: true,
			pageLoadingStatus: 'loading',
			withdrawConfig: null,
			postPath: '',
			postShow: false,
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: []
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title: '经销商中心'
		});
		uni.$on('memberChange', data => {
			this.getMemberIndex();
		});
		this.logo = this.$api.shopSetting.app_logo;
		this.getMemberIndex();
	},
	computed: {
		...mapState(['userInfo', 'shopSetting']),
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onPullDownRefresh() {
		this.loadingShow = true;
		this.memberInfo = {};
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
		loadingClick() {
			this.getMemberIndex();
		},
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		getMemberIndex() {
			this.$api.http
				.get(this.$api.apiDistribution.warehouseIndex)
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
						this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_withdraw //   账户余额变动通知
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
					this.$api.helper.toast(this.$api.language.profile.failedToLoadConfiguration);
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
					this.$api.helper.toast(this.$api.language.profile.failedToLoadConfiguration);
					return;
				}
			}
			if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 1) {
				//通商云提现账号
				this.toPage('allinpayCard');
			} else if (parseInt(this.withdrawConfig.commission_withdraw_mode) === 2) {
				//通商云提现账号
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
		toIncome() {
			// #ifdef MP
			if (this.$api.store.state.wechatMpLogin && this.$api.shopSetting.notify_miniprogram_sub && this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_change) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.promoter_brokerage_change //   账户余额变动通知
					],
					success: res => {
						_this.$api.router.push({
							route: _this.$api.routesConfig.income
						});
					},
					fail(err) {
						console.log(err, 2);
					}
				});
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig.income
				});
			}
			// #endif
			// #ifndef MP
			this.$api.router.push({
				route: this.$api.routesConfig.income
			});
			// #endif
		},
		toPage(url, type) {
			if (url == 'giving' && !this.memberInfo.pay_password_hash) {
				url = 'setPayPswHash';
			}

			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					type
				}
			});
		},
		async getQrcode() {
			let domain = this.$api.shopSetting.h5_url;
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			return new Promise((resolve, reject) => {
				uQRCode.make({
					canvasId: 'qrcodes',
					componentInstance: this,
					text: `${domain}?promo_code=${this.$api.store.state.userInfo.promo_code}`,
					size: 250,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						resolve(res);
					},
					fail: res => {
						reject(res);
					}
				});
			});
		},
		async sharePost() {
			if (this.postPath) {
				this.postShow = true;
				return;
			}
			uni.showLoading({
				mask: true,
				title: '正在生成海报'
			});
			try {
				let nickname = this.userInfo.nickname || this.userInfo.realname;
				let avatar = (this.userInfo && this.userInfo.head_portrait) || this.logo;
				let qrcode = await this.getQrcode();
				await new Painter(uni.createCanvasContext('my_PosterCanvasId')).draw({
					type: 'container',
					top: 0,
					left: 0,
					children: [
						{ type: 'image', top: 0, width: 1125, height: 2001, src: 'https://files.guyijiankang.cn/images/2021/06/24/image_1624509954_GM0m5uG5.jpg' },
						{
							type: 'clip',
							position: 'absolute',
							top: 1035,
							left: 280,
							path: {
								type: 'rounded-rect',
								width: 120,
								height: 120,
								borderRadius: 60
							},
							content: {
								type: 'image',
								width: 120,
								height: 120,
								src: avatar
							}
						},
						{ type: 'text', position: 'absolute', top: 1080, left: 434, fontSize: 40, fontWeight: 'bold', content: '我是 ' + nickname },
						{ type: 'text', position: 'absolute', top: 1180, left: 356, fontSize: 70, fontWeight: 'bold', content: '我为壮面代言' },
						{ type: 'image', position: 'absolute', top: 1297, left: 451, width: 230, height: 230, src: qrcode }
					]
				});
				setTimeout(() => {
					console.log('开始转图片');
					uni.canvasToTempFilePath({
						canvasId: 'my_PosterCanvasId',
						fileType: 'jpg',
						success: res => {
							this.postPath = res.tempFilePath;
							this.postShow = true;
							uni.hideLoading();
						},
						fail: e => {
							this.$api.helper.toast('生成图片失败');
							uni.hideLoading();
						}
					});
				}, 1000);
			} catch (e) {
				console.log(e);
				this.$api.helper.toast('生成海报失败');
				uni.hideLoading();
				return;
			}
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '已复制到剪贴板',
				type: 'success'
			});
		},
		hidePost() {
			this.postShow = false;
		},
		saveImage() {
			// #ifndef H5
			uni.saveImageToPhotosAlbum({
				filePath: this.postPath,
				success: res => {
					this.$api.helper.toast('保存成功');
				}
			});
			// #endif
			// #ifdef H5
			this.$api.helper.toast('请长按上方图片保存');
			// #endif
		},
		share() {
			// #ifdef APP-PLUS
			_app.getShare(false, false, 2, '', '', '', this.postPath, false, false);
			// #endif

			// #ifndef APP-PLUS
			this.$api.helper.toast('请长按图片保存后自行分享');
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	justify-content: space-between;
	height: 260rpx;
	padding: 30rpx 20rpx;
	color: #fff;
	.left {
		display: flex;
		.img {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			margin-right: 20rpx;
			overflow: hidden;
		}
	}
}
.data {
	display: flex;
	background: #fff;
	margin: 24rpx;
	border-radius: 20rpx;
	margin-top: -60rpx;
	.item {
		flex: 1;
		text-align: center;
		padding: 28rpx 0;
		font-size: 26rpx;
		view {
			line-height: 40rpx;
		}
	}
}

.card-box {
	margin: 24rpx;
	.card-item {
		background-color: #ffffff;
		margin-top: 24rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
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
	top: -99999rpx;
	left: -99999rpx;
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
	perspective: 2500rpx;
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
	justify-content: center;
}

.marginTop2vh {
	margin-top: 2vh;
}
</style>
