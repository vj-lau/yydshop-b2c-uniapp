<template>
	<view class="dz-m-b-20">
		<dz-navbar :title="language.virtual.virtualDetailTitle"></dz-navbar>
		<view class="detail">
			<view class="row">
				<view class="carrier" @tap="productClick">
					<view class="left"><image class="image" :src="orderProductVirtualDetail.orderProduct.product_picture" mode="aspectFill"></image></view>
					<view class="mid">
						<view class="title dz-line-2">{{ orderProductVirtualDetail.orderProduct.product_name }}</view>
						<view class="data">{{ orderProductVirtualDetail.orderProduct.sku_name || language.application.defaultSkuName }} * 1</view>
						<view class="bottom">
							<text class="price" :style="{ color: theme.dzBaseColor }">
								{{ language.application.moneySymbol }}{{ orderProductVirtualDetail.orderProduct.price }}
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="detail-desc" v-if="orderProductVirtualDetail.code">
				<view class="d-header"><text>核销二维码</text></view>
				<view class="qrcode"><image :src="qrcode" mode=""></image></view>
			</view>
			<view class="list-cell m-t" v-if="orderProductVirtualDetail.code" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">核销码</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.code }}</text>
				<text class="copy" :style="{ color: theme.dzBaseColor }" @click="saveClipboard(orderProductVirtualDetail.code)">复制</text>
			</view>
			<view class="list-cell m-t" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">虚拟商品组别</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.product_group === 'download' ? '下载商品' : '核销商品' }}</text>
			</view>
			<view class="list-cell m-t" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">使用期限</text>
				<text class="cell-tip" v-if="parseInt(orderProductVirtualDetail.start_time) > 0 && parseInt(orderProductVirtualDetail.end_time) > 0">
					{{ orderProductVirtualDetail.start_time | timeFormat }} - {{ orderProductVirtualDetail.end_time | timeFormat }}
				</text>
				<text v-else>不限期使用</text>
			</view>
			<view class="list-cell m-t" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">已使用次数</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.use_number }}</text>
			</view>
			<view class="list-cell m-t" hover-class="cell-hover" :hover-stay-time="50">
				<text class="cell-tit">限制使用次数</text>
				<text class="cell-tip">{{ orderProductVirtualDetail.confine_use_number === '0' ? '不限' : orderProductVirtualDetail.confine_use_number }}</text>
			</view>
			<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" v-if="!!orderProductVirtualDetail.remark">
				<text class="cell-tit">备注</text>
				<view class="cell-tip">
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_address">
						网盘地址：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_address }}
					</view>
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_password">
						网盘密码：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').cloud_password }}
					</view>
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').text_download_resources">
						下载地址：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').text_download_resources }}
					</view>
					<view v-if="JSON.parse(orderProductVirtualDetail.remark || '{}').unzip_password">
						解压密码：{{ JSON.parse(orderProductVirtualDetail.remark || '{}').unzip_password }}
					</view>
				</view>
				<text class="copy" :style="{ color: theme.dzBaseColor }" @click="saveClipboard(orderProductVirtualDetail.remark)">复制</text>
			</view>
		</view>
		<canvas class="hideCanvas" canvas-id="qrcode" style="width: 200px;height: 200px;" />
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import uQRCode from '@/core/utils/uqrcode.js';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			id: '',
			orderProductVirtualDetail: {
				orderProduct: {}
			},
			qrcode: ''
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.virtual.virtualDetailTitle
		});
		this.id = e.id || '';
		await this.$onLaunched;
		this.getOrderProductVirtualDetail();
	},
	methods: {
		async getOrderProductVirtualDetail() {
			await this.$api.http
				.get(this.$api.apiShop.orderProductVirtualView, {
					params: {
						id: this.id
					}
				})
				.then(async res => {
					this.orderProductVirtualDetail = res.data;
					if (this.orderProductVirtualDetail.code) {
						this.qrcode = await this.getQrcode(this.orderProductVirtualDetail.code);
					}
				})
				.catch(err => {});
		},
		async getQrcode(code) {
			return new Promise((resolve, reject) => {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: code,
					size: 200,
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
		saveClipboard(data) {
			let text = '';
			if (this.$api.helper.isObject(data)) {
				let textObj = JSON.parse(data);
				if (textObj.cloud_address) {
					text = `网盘地址：${textObj.cloud_address} 网盘密码：${textObj.cloud_password}`;
				} else if (textObj.text_download_resources) {
					text = `下载地址：${textObj.text_download_resources} 解压密码：${textObj.unzip_password}`;
				}
			} else {
				text = data;
			}
			if (this.$api.helper.copy(data)) {
				this.$refs.dzToast.show({
					title: '复制成功',
					type: 'success'
				});
			} else {
				this.$refs.dzToast.show({
					title: '复制失败，请重新尝试',
					type: 'warning'
				});
			}
		},
		productClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.product,
				query: {
					id: this.orderProductVirtualDetail.orderProduct.product_id
				}
			});
		}
	}
};
</script>

<style lang="scss">
.detail {
	padding-top: 20rpx;
	.row {
		margin: 0 auto 30rpx;
		width: calc(94%);
		height: calc(22vw + 40rpx);
		border-radius: 15rpx;
		box-shadow: 0rpx 5rpx 20rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		position: relative;
		overflow: hidden;
		z-index: 4;
		border: 0;
		.carrier {
			@keyframes showMenu {
				0% {
					transform: translateX(0);
				}
				100% {
					transform: translateX(-30%);
				}
			}
			@keyframes closeMenu {
				0% {
					transform: translateX(-30%);
				}
				100% {
					transform: translateX(0);
				}
			}
			&.open {
				animation: showMenu 0.25s linear both;
			}
			&.close {
				animation: closeMenu 0.15s linear both;
			}
			background-color: #fff;
			position: absolute;
			width: 100%;
			padding: 0 0;
			height: 100%;
			z-index: 3;
			display: flex;
			align-items: center;
			.left {
				width: 22vw;
				height: 22vw;
				margin-left: 20rpx;
				margin-right: 10rpx;
				.image {
					border-radius: 10rpx;
					width: 22vw;
					height: 22vw;
				}
			}
			.mid {
				text-align: left;
				width: 100%;
				margin: 10rpx 10rpx 0;
				.title {
					color: $dz-main-color;
					height: 60rpx;
					line-height: 1.2;
					font-size: 30rpx;
				}
				.data {
					width: 100%;
					display: flex;
					align-items: center;
					margin: 10rpx 0 5rpx;
					font-size: 24rpx;
					color: $dz-light-color;
					.item {
						flex: 1;
					}
					.iconfont {
						color: $dz-light-color;
						margin-right: 10rpx;
					}
					.status {
						padding: 6rpx 20rpx;
						opacity: 0.8;
						font-size: 24rpx;
						border-radius: 6rpx;
					}
				}
				.bottom {
					line-height: 1.2;
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					color: $dz-light-color;
					.price {
						font-size: 28rpx;
					}
				}
			}
			.data {
				color: $dz-light-color;
			}
		}
	}
	.qrcode {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: 20rpx;
	}
	.copy {
		margin-left: 20rpx;
	}
}

.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20rpx 20rpx;
	margin: 0 20rpx;
	line-height: 60rpx;
	position: relative;
	background: #fff;
	justify-content: center;

	&.log-out-btn {
		margin: 40rpx 0;
		.cell-tit {
			text-align: center;
			margin-right: 0;
		}
	}

	&.cell-hover {
		background: #fafafa;
	}

	&.b-b:after {
		left: 30rpx;
	}

	&.m-t {
		margin-top: 16rpx;
	}

	.cell-more {
		align-self: baseline;
		font-size: 32rpx;
		color: $dz-light-color;
		margin-left: 10rpx;
	}

	.cell-tit {
		flex: 1;
		font-size: 30rpx;
		margin-right: 10rpx;
	}

	.cell-tip {
		font-size: 28rpx;
		color: $dz-light-color;
	}
}

.detail-desc {
	background: #fff;
	margin: 20rpx 20rpx;
	padding: 0 0 40rpx;
	.d-header {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		font-size: 30rpx;
		color: $dz-main-color;
		position: relative;
		text {
			padding: 0 20rpx;
			background: #fff;
			position: relative;
			z-index: 1;
		}
		&:after {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translateX(-50%);
			width: 300rpx;
			height: 0;
			content: '';
			border-bottom: 1px solid $dz-border-color;
		}
	}
	.qrcode {
		image {
			border: none;
			border-radius: 0;
			width: 500rpx;
			height: 500rpx;
			margin-top: 0;
			padding: 30rpx 0;
		}
	}
}

.hideCanvas {
	position: fixed;
	top: -999px;
	left: -999px;
	z-index: -99;
}
</style>
