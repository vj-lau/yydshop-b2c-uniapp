<template>
	<view>
		<dz-navbar :title="language.profile.setting"></dz-navbar>
		<view>
			<dz-cell-group :border="false">
				<dz-cell-item @tap="submit" :borderBottom="false">
					<view class="head-portrait" solt="icon">
						<image :src="userInfo.head_portrait || missingFace" mode=""></image>
						<view class="user-name">{{ userInfo.nickname || userInfo.realname || userInfo.mobile }}</view>
					</view>
				</dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.personalData"
					icon="login"
					iconSize="45"
					:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
					@tap="cellTap('userinfo')"
				></dz-cell-item>
				<dz-cell-item
					v-if="!userInfo.mobile || userInfo.mobile == ''"
					:borderBottom="false"
					center
					:title="language.user.bindMobile"
					icon="mobilefill"
					iconSize="45"
					:icon-style="{ color: '#fd1c9c', 'margin-right': '30rpx' }"
					@tap="cellTap('bindMobile')"
				></dz-cell-item>
				<dz-cell-item
					v-if="userInfo.mobile && userInfo.mobile != ''"
					:borderBottom="false"
					center
					:title="language.user.modifyMobile"
					icon="mobilefill"
					iconSize="45"
					:icon-style="{ color: '#fd1c9c', 'margin-right': '30rpx' }"
					@tap="cellTap('modifyMobileStep1')"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.changePassword"
					icon="icon_password_yes"
					iconSize="45"
					:icon-style="{ color: '#FD7B65', 'margin-right': '30rpx' }"
					@tap="cellTap('modifyPassword')"
				></dz-cell-item>
				<dz-cell-item
					center
					:title="language.user.protocolRule"
					icon="newshotfill"
					iconSize="45"
					:icon-style="{ color: '#FDC561', 'margin-right': '30rpx' }"
					:border-bottom="false"
					@tap="cellTap('about')"
				></dz-cell-item>
			</dz-cell-group>
			<dz-cell-group class="dz-m-t-20" :border="false">
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.invoice.invoiceManagement"
					icon="fapiao"
					iconSize="45"
					:icon-style="{ color: '#FFC43F', 'margin-right': '30rpx' }"
					@tap="cellTap('invoice')"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.invoice.invoiceHistory"
					icon="news_fill_light"
					iconSize="45"
					:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
					@tap="cellTap('invoiceList')"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.wipeCache"
					icon="lucenehuancun"
					iconSize="45"
					:icon-style="{ color: '#42E38D', 'margin-right': '30rpx' }"
					:value="`${cacheSize}KB`"
					@tap="removeCache"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.currentVersion"
					icon="mall_fill_light"
					iconSize="45"
					:icon-style="{ color: '#FF6F8E', 'margin-right': '30rpx' }"
					:value="version"
					@tap="tapUpdate"
				></dz-cell-item>
				<dz-cell-item
					:borderBottom="false"
					center
					:title="language.user.feedback"
					icon="writefill"
					iconSize="45"
					:icon-style="{ color: '#807DFC', 'margin-right': '30rpx' }"
					@tap="cellTap('feedback')"
				></dz-cell-item>
				<dz-cell-item
					v-if="parseInt(shopSetting.style_user_is_open) === 1"
					:borderBottom="false"
					center
					:title="language.user.theme"
					icon="skinfill"
					iconSize="45"
					:icon-style="{ color: '#fc0e7a', 'margin-right': '30rpx' }"
					@tap="themeClick"
				></dz-cell-item>
				<dz-cell-item
					v-if="parseInt(shopSetting.style_loading_is_open) === 1"
					:borderBottom="false"
					center
					title="Loading加载动画"
					icon="loading1"
					iconSize="45"
					:icon-style="{ color: '#fc0e7a', 'margin-right': '30rpx' }"
					@tap="cellTap('loading')"
				></dz-cell-item>
				<dz-cell-item
					center
					:title="language.user.notification"
					icon="messagefill"
					iconSize="45"
					:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
					:border-bottom="false"
					:arrow="false"
				>
					<dz-switch slot="right-icon" v-model="checked" @change="switchChange(checked)" :active-color="theme.dzBaseColor"></dz-switch>
				</dz-cell-item>
			</dz-cell-group>
			<view class="dz-m-t-80 dz-p-b-50 dz-flex dz-row-center">
				<view class="btn" style="width: 90%;">
					<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" shape="circle" @click="logoutTap">
						{{ language.user.logOut }}
					</dz-button>
				</view>
			</view>
		</view>
		<!-- 退出提醒 -->
		<dz-modal
			v-model="modalShow"
			:mask-close-able="false"
			:content="modalContent"
			:show-cancel-button="!modalLoading"
			:confirm-color="theme.dzBaseColor"
			:async-close="true"
			@cancel="modalCancel"
			@confirm="modalConfirm"
		></dz-modal>
		<!-- 缓存提醒 -->
		<dz-modal
			v-model="cacheShow"
			:mask-close-able="false"
			:content="cacheContent"
			:show-cancel-button="!cacheLoading"
			:confirm-color="theme.dzBaseColor"
			:async-close="true"
			@cancel="cacheCancel"
			@confirm="cacheConfirm"
		></dz-modal>
		<dz-popup v-model="themeShow" mode="bottom" :closeable="false" length="60%" border-radius="40">
			<view class="dz-m-l-30 dz-m-t-30 dz-font-32 dz-font-weight">色系选择</view>
			<dz-row gutter="16" class="dz-m-10">
				<dz-grid col="5" :border="false" style="margin-top: -20rpx;">
					<dz-grid-item v-for="(item, index) in themeConfig" :key="index" @click="active = index">
						<view
							class="layout"
							:style="{ borderColor: active == index ? item.colors.dzBaseColor : '#fff' }"
							:class="[active == index ? 'animation-scale-up animation-duration-03' : '']"
						>
							<view class="layout-item" :style="{ background: item.colors.dzBaseColor, color: item.colors.dzBaseFontColor }"></view>
						</view>
						<text class="dz-font-sm dz-color-6 dz-m-t-10">{{ item.title }}</text>
					</dz-grid-item>
				</dz-grid>
			</dz-row>
			<view class="dz-flex dz-row-between dz-p-b-20 dz-m-r-40 dz-m-l-40 btn">
				<dz-button
					hoverClass="none"
					:border="false"
					:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '320rpx', height: '90rpx' }"
					:plain="true"
					shape="circle"
					@click="themeShow = false"
				>
					取消
				</dz-button>
				<dz-button
					:border="false"
					hoverClass="none"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '320rpx', height: '90rpx' }"
					shape="circle"
					@click="themeApply()"
				>
					应用
				</dz-button>
			</view>
		</dz-popup>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import $mThemeConfig from '@/core/config/themeConfig.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			missingFace: this.$api.assetsConfig.missingFace,
			theme: this.$api.theme,
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			themeConfig: $mThemeConfig,
			checked: false,
			modalShow: false,
			modalContent: this.$api.language.user.confirmLogOut,
			modalLoading: false,
			cacheShow: false,
			themeShow: false,
			cacheContent: this.$api.language.user.confirmWipeCache,
			cacheLoading: false,
			cacheSize: 0,
			version: '',
			active: ''
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.profile.setting
		});
		this.cacheSize = uni.getStorageInfoSync().currentSize;
		await this.$onLaunched;
		// #ifdef APP-PLUS
		let wgtInfo = await this.$api.helper.getWgtInfoAsync();
		this.version = wgtInfo.version;
		// #endif
		// #ifndef APP-PLUS
		this.version = this.$api.appConfig.version;
		// #endif
		this.getNotifySubscriptionConfigIndex();
	},
	computed: {
		...mapState(['userInfo'])
	},
	created() {
		uni.$on('uAvatarCropper', path => {
			this.headUploadFile(path);
		});
	},
	methods: {
		...mapMutations(['logout', 'setUserHeadPortrait']),
		submit() {
			// #ifdef H5
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: res => {
					this.headUploadFile(res.tempFilePaths[0]);
				}
			});
			// #endif
			// #ifndef H5
			this.$api.router.push({
				route: this.$api.routesConfig.avatarCropper,
				query: {
					destWidth: 300,
					rectWidth: 200,
					fileType: 'jpg'
				}
			});
			// #endif
		},
		async headUploadFile(data) {
			let filePath = data;
			this.$api.http
				.upload(this.$api.apiShop.uploadImage, {
					filePath,
					name: 'file'
				})
				.then(res => {
					this.setUserHeadPortrait(res.data.url);
					this.updateUserInfo({ head_portrait: res.data.url });
				});
		},
		async updateUserInfo(data) {
			await this.$api.http
				.put(
					this.$api.apiShop.memberUpdate,
					{
						...data
					},
					{
						params: {
							id: this.userInfo.id
						}
					}
				)
				.then(res => {});
		},
		cellTap(url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {}
			});
		},
		// 缓存
		removeCache() {
			if (this.cacheSize == 0) {
				return this.$refs.dzToast.show({
					title: this.language.user.noWipeCache,
					type: 'warning'
				});
			}
			this.cacheShow = true;
		},
		cacheCancel() {
			if (!this.cacheLoading) {
				this.cacheShow = false;
			}
		},
		cacheConfirm() {
			this.cacheLoading = true;

			uni.clearStorageSync();
			this.cacheSize = 0;
			setTimeout(() => {
				this.cacheShow = false;
				this.cacheLoading = false;
			}, 500);
		},
		async getNotifySubscriptionConfigIndex() {
			await this.$api.http.get(this.$api.apiShop.notifySubscriptionConfigIndex).then(res => {
				this.checked = res.data.all == 1 ? true : false;
			});
		},
		// 推送
		async switchChange(e) {
			await this.$api.http
				.post(this.$api.apiShop.notifySubscriptionConfigUpConfig, {
					all: e ? 1 : 0
				})
				.then(res => {
					this.checked = res.data.all == 1 ? true : false;
					this.$refs.dzToast.show({
						title: `${this.checked ? '开启' : '关闭'}消息推送`,
						type: 'success'
					});
				});
		},
		// 退出
		logoutTap() {
			this.modalShow = true;
		},
		//关闭
		modalCancel() {
			if (!this.modalLoading) {
				this.modalShow = false;
			}
		},
		// 确认
		modalConfirm() {
			this.modalLoading = true;
			this.$api.http
				.post(this.$api.apiShop.logout)
				.then(res => {
					this.logout();
					uni.$emit('sgninChange', {
						type: 'logout'
					});
					setTimeout(() => {
						this.modalShow = false;
						this.$api.router.back();
					}, 500);
				})
				.catch(err => {
					this.modalShow = false;
				});
		},
		//检查更新
		async tapUpdate() {
			let _this = this;
			// #ifdef APP-PLUS
			if (!this.$api.appConfig.checkUpdate) {
				return;
			}
			let type = plus.os.name == 'iOS' ? 2 : 1;
			try {
				const wgtInfo = await _this.$api.helper.getWgtInfoAsync();
				const res = await _this.$api.http.get(this.$api.apiVersions.appVersion, {
					params: {
						type: type,
						version: wgtInfo.version
					}
				});
				if (res.data) {
					//验证跳过版本
					let jumpVersion = uni.getStorageSync('jumpUpdateVersion');
					let isUpdate = _this.$api.helper.compareVersion(res.data.version, jumpVersion);
					if (isUpdate) {
						let updateData = {
							content: res.data.content,
							version: res.data.version,
							is_enforce: parseInt(res.data.is_enforce),
							download_url: res.data.download_url,
							progress: true,
							mask_click: false,
							buttonNum: 0
						};
						this.$api.appUpdate(updateData);
					}
				} else {
					_this.$refs.dzToast.show({
						title: '当前已是最新版本',
						type: 'warning'
					});
				}
			} catch (e) {
				console.log(e);
			}
			// #endif
			// #ifdef MP-WEIXIN
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res) {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success(res) {
									if (res.confirm) {
										updateManager.applyUpdate();
									}
								}
							});
						});
						updateManager.onUpdateFailed(function(res) {
							wx.showModal({
								title: '发现新版本',
								content: '新版本已经上线啦，请您删除当前小程序，重新搜索打开'
							});
						});
					} else {
						_this.$refs.dzToast.show({
							title: '当前已是最新版本',
							type: 'warning'
						});
					}
				});
			} else {
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法更好体验程序，请升级到最新微信版本后重试。',
					showCancel: false
				});
			}
			// #endif
			// #ifndef APP-PLUS || MP-WEIXIN
			this.$refs.dzToast.show({
				title: '当前已是最新版本',
				type: 'warning'
			});

			// #endif
		},
		themeClick() {
			for (let key in this.themeConfig) {
				if (this.themeConfig[key].colors.dzBaseColor == this.theme.dzBaseColor) {
					this.active = key;
				}
			}
			this.themeShow = true;
		},

		themeApply() {
			this.$api.theme = { ...this.$api.theme, ...this.themeConfig[this.active].colors };
			this.$api.store.commit('setCustomerTheme', this.active);
			this.theme = this.$api.theme;
			uni.$emit('themeChange');
			this.themeShow = false;
		}
	}
};
</script>

<style lang="scss">
.head-portrait {
	display: flex;
	align-items: center;
	image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.upload {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		overflow: hidden;
		background-color: $dz-content-color;
	}
	.user-name {
		margin-left: 20rpx;
		font-size: 32rpx;
		color: $dz-main-color;
	}
}
.btn {
	margin-bottom: env(safe-area-inset-bottom);
}
.layout {
	padding: 6rpx 6rpx;
	border: 2rpx solid #fff;
	border-radius: 16rpx;
	.layout-item {
		width: 70rpx;
		height: 70rpx;
		border-radius: 16rpx;
	}
}
</style>
