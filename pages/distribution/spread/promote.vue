<template>
	<view class="content" :style="{ background: theme.dzBaseColor }">
		<dz-navbar :title="'推广二维码'"></dz-navbar>
		<view>
			<view class="banner"></view>
			<view class="content-bg">
				<view class="user-info">
					<image :src="userInfo.head_portrait || logo" mode=""></image>
					<view>{{ userInfo.nickname || appName }}</view>
					<view class="dz-m-t-10">
						推广码: {{ code }}
						<dz-button
							:custom-style="{ height: '40rpx', marginLeft: '20rpx', background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
							hover-class="none"
							:border="false"
							size="mini"
							shape="circle"
							@click="clickCode(code)"
						>
							复制
						</dz-button>
					</view>
					<view class="cord_img">
						<image @longpress="long" :src="imgSrc" mode=""></image>
						<view class="code_tip">长按保存二维码</view>
					</view>
				</view>
			</view>
		</view>
		<!--海报-->
		<canvas class="hideCanvas" canvas-id="qrcode" style="width: 250px;height: 250px;" />
		<dz-modal
			v-model="downloadShow"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="false"
			:async-close="true"
			:content="`正在下载（${downloadText}）`"
			@confirm="downloadCancel"
			:confirm-text="'取消'"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import uQRCode from '@/core/utils/uqrcode.js';
import painter from '@/core/utils/mp-painter';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			code: this.$api.store.state.userInfo.promo_code,
			logo: this.$api.shopSetting.store_logo,
			appName: this.$api.shopSetting.store_name,
			imgSrc: '',
			posterShow: false,
			postPath: '',
			userInfo: this.$api.store.state.userInfo,
			thirdPartyQrCodeImg: '',
			wechatQrCodeImg: '',
			downloadText: '',
			downloadPercent: '',
			downloadShow: false,
			downloadTask: null
		};
	},
	async onLoad() {
		await this.$onLaunched;
		this.logo = this.$api.shopSetting.store_logo;
		this.appName = this.$api.shopSetting.store_name;
		this.getCode();
	},
	methods: {
		async getCode() {
			let wxLink = this.$api.appConfig.indexPath;
			if (wxLink.startsWith('/')) {
				wxLink = wxLink.substr(1);
			}
			if (wxLink.endsWith('/')) {
				wxLink = wxLink.substr(0, wxLink.length - 1);
			}
			if (this.$api.store.getters.hasLogin) {
				wxLink = wxLink + '?promo_code=' + this.$api.store.state.userInfo.promo_code;
			}
			wxLink = encodeURIComponent(wxLink);

			if (this.$api.shopSetting.product_poster_qr_type == 'mini_program_qr') {
				if (!this.thirdPartyQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatQrCode, {
							params: {
								link: wxLink
							}
						})
						.then(res => {
							this.thirdPartyQrCodeImg = res.data.url;
						})
						.catch(err => {
							uni.hideLoading();
						});
				}
				this.imgSrc = this.thirdPartyQrCodeImg;
			} else if (this.$api.shopSetting.product_poster_qr_type == 'wechat_qr') {
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = res.data.url;
						})
						.catch(err => {});
				}
				this.imgSrc = this.wechatQrCodeImg;
			} else {
				let domain = this.$api.shopSetting.h5_url;
				if (domain.endsWith('/')) {
					domain = domain.substr(0, domain.length - 1);
				}
				this.imgSrc = await new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: `${domain}?promo_code=${this.code}`,
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
			}
		},
		async getQrcode() {
			if (this.shopSetting.product_poster_qr_type == 'common_qr') {
				let domain = this.$api.shopSetting.h5_url;
				if (domain.endsWith('/')) {
					domain = domain.substr(0, domain.length - 1);
				}
				return new Promise((resolve, reject) => {
					uQRCode.make({
						canvasId: 'qrcode',
						componentInstance: this,
						text: `${domain}?promo_code=${this.code}`,
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
			} else if (this.shopSetting.product_poster_qr_type == 'wechat_qr') {
				if (!this.wechatQrCodeImg) {
					await this.$api.http
						.get(this.$api.apiShop.thirdPartyWechatOfficialQrCode)
						.then(res => {
							this.wechatQrCodeImg = res.data.url;
							return this.wechatQrCodeImg;
						})
						.catch(err => {});
				} else {
					return this.wechatQrCodeImg;
				}
			}
		},
		//隐藏海报
		hidePosterClick() {
			this.posterShow = false;
		},
		// 复制
		clickCode(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '推荐码已复制到剪贴板',
				type: 'success'
			});
		},
		saveImg() {
			// #ifndef H5
			//如果是在线图片，下载并保存
			if (this.$api.helper.isUrl(this.imgSrc)) {
				this.downloadPercent = 0;
				this.downloadText = this.downloadPercent + '%';
				this.downloadShow = true;
				this.downloadTask = uni.downloadFile({
					url: this.imgSrc,
					success: res => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: () => {
									this.$refs.dzToast.show({
										title: '已下载到您的手机相册',
										type: 'success'
									});
									this.downloadShow = false;
								},
								fail: () => {
									this.$refs.dzToast.show({
										title: '保存失败，请重试',
										type: 'warning'
									});
									this.downloadShow = false;
								}
							});
						}
					},
					fail: () => {
						this.$refs.dzToast.show({
							title: '下载失败，请重试',
							type: 'warning'
						});
						this.downloadShow = false;
					}
				});

				this.downloadTask.onProgressUpdate(res => {
					this.downloadPercent = res.progress;
					this.downloadText = res.progress + '%';
				});
			} else {
				const _this = this;
				uni.saveImageToPhotosAlbum({
					filePath: this.imgSrc,
					success() {
						_this.$refs.dzToast.show({
							title: '已保存到您的手机相册',
							type: 'success'
						});
					}
				});
			}
			// #endif
			// #ifdef H5
			this.$api.helper.toast('请长按松开后选择另存为保存到相册');
			// #endif
		},
		long() {
			let _this = this;
			uni.showActionSheet({
				itemList: ['保存到手机'],
				itemColor: '#0081FF',
				success: function(res) {
					if (res.tapIndex == 0) {
						_this.saveImg();
					}
				},
				fail: function(res) {
					console.log(res.errMsg);
				}
			});
		},
		downloadCancel() {
			try {
				this.downloadTask.abort();
			} catch (e) {
			} finally {
				this.downloadShow = false;
			}
		}
	}
};
</script>

<style lang="scss">
page,
.content {
	height: 100%;
}
.banner {
	height: 220rpx;
	image {
		width: 100%;
		height: 320rpx;
		display: block;
	}
}
.content-bg {
	padding: 15rpx;
	.user-info {
		margin: 0 30rpx;
		background-color: #ffffff;
		border-radius: 30rpx;
		text-align: center;
		image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 20rpx solid #ffffff;
			overflow: hidden;
			margin-top: -40rpx;
		}
	}
	.cord_img {
		image {
			border: none;
			border-radius: 0;
			width: 300rpx;
			height: 300rpx;
			margin-top: 0;
			padding: 30rpx 0 20rpx;
		}
	}
	.code_tip {
		padding-bottom: 30rpx;
		color: #909993;
	}
}
.hideCanvas {
	position: fixed;
	top: -999px;
	left: -999px;
	z-index: -99;
}
</style>
