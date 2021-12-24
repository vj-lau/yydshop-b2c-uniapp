<template>
	<view>
		<dz-navbar :title="'客服'"></dz-navbar>
		<view class="chat margin-top">
			<view class="service">
				<view class="wrapper" :class="popupLayerClass" :style="{ bottom: bottomHeight }">
					<view class="margin-top-sm" @tap="hideDrawer()">
						<view class="cu-chat" v-for="(item, index) in imHistory" :key="index">
							<view class="cu-info round" v-if="item.tip">{{ item.content }}</view>
							<view class="cu-item self" v-if="item.user_type == 'member'">
								<view class="main">
									<view class="content bg-green shadow dz-inline-100"><rich-text :nodes="item.content"></rich-text></view>
								</view>
								<view class="cu-avatar radius" :style="item.avatar || `background-image:url(${item.member.head_portrait})`"></view>
								<view class="date">{{ item.created_at | timeFormat }}</view>
							</view>
							<view class="cu-item" v-if="item.user_type == 'service'">
								<view class="cu-avatar radius" :style="item.avatar || `background-image:url(${item.member.head_portrait})`"></view>
								<view class="name dz-inline-1">{{ item.serviceNickname || item.member.nickname }}</view>
								<view class="main service">
									<view class="content shadow"><rich-text :nodes="item.content"></rich-text></view>
								</view>
								<view class="date ">{{ item.created_at | timeFormat }}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 底部输入栏 -->
				<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
					<view class="more">
						<text v-if="isStuffService" class="dzicon-iconfont dzicon-roundaddfill text-grey" @tap="showMore"></text>
						<view class="service" v-else @tap.stop="swiftStuffService">
							<text class="dzicon-iconfont dzicon-servicefill iconfont"></text>
							<text>转人工</text>
						</view>
					</view>
					<view class="textbox">
						<view class="voice-mode" :class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']">{{ voiceTis }}</view>
						<view class="text-mode" :class="isVoice ? 'hidden' : ''">
							<view class="box">
								<input
									type="text"
									maxlength="500"
									class="uni-input"
									cursor-spacing="15"
									v-model="textMsg"
									@focus="textareaFocus"
									confirm-type="send"
									@confirm="sendText"
								/>
							</view>
							<view class="em" @tap="chooseEmoji"><text class="dzicon-iconfont dzicon-emojifill text-grey"></text></view>
						</view>
					</view>
					<view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText"><view class="btn">发送</view></view>
				</view>
				<!-- 抽屉栏 -->
				<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
					<shop-emoji style="height: 100%;" @emotion="addEmoji" :class="{ hidden: hideEmoji }"></shop-emoji>
					<!-- 更多功能 相册-拍照 -->
					<view class="more-layer" :class="{ hidden: hideMore }">
						<view class="list">
							<view class="box" @tap="chooseImage"><text class="dzicon-iconfont dzicon-pic icon"></text></view>
							<view class="box" @tap="camera"><text class="cuIcon-cameraaddfill icon"></text></view>
							<!-- 						<view class="box" @tap="getAddress">
								<text class="cuIcon-locationfill icon"></text>
							</view> -->
							<view class="box" @tap="clearChatList"><text class="cuIcon-deletefill icon"></text></view>
							<view class="box" @tap="endSession"><text class="cuIcon-exit icon"></text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
export default {
	data() {
		return {
			bottomHeight: 0,
			textMsg: '',
			// 消息列表
			scrollTop: 0,
			isVoice: false,
			voiceTis: '按住 说话',
			recording: false,
			// 播放语音相关参数
			// 抽屉参数
			popupLayerClass: '',
			// more参数
			hideMore: true,
			// 表情定义
			hideEmoji: true,
			chatList: []
		};
	},
	computed: {
		...mapState(['accessToken', 'userInfo', 'imHistory', 'isImPanel', 'imNoRead', 'isStuffService']),
		...mapGetters(['hasLogin'])
	},
	watch: {
		'$store.state.imHistory': function() {
			this.$nextTick(() => {
				this.scrollToBottom();
			});
		},
		'$store.state.isStuffService': function(val) {
			if (val) {
				uni.setNavigationBarTitle({
					title: '人工客服'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '机器人客服'
				});
			}
		}
	},
	mounted() {
		this.scrollToBottom();
	},
	onLoad() {
		this.setIsImPanel(true);
		if (!this.$api.websocket.conncted) {
			// let params = {
			// 	tip: true,
			// 	content: '连接客服服务失败，正在重新连接...'
			// };
			// this.addImHistory(params)
		} else {
			if (!this.isStuffService) {
				let params = {
					tip: true,
					content: '当前由机器人精灵为您服务'
				};
				this.addImHistory(params);
			}
		}
		if (this.isStuffService) {
			uni.setNavigationBarTitle({
				title: '人工客服'
			});
		} else {
			uni.setNavigationBarTitle({
				title: '机器人客服'
			});
		}
	},
	onUnload() {
		this.setIsImPanel(false);
	},
	methods: {
		...mapMutations(['addImHistory', 'addImNoRead', 'setIsImPanel', 'setIsStuffService', 'clearImHistory']),
		// 选择图片发送
		chooseImage() {
			this.getImage('album');
		},
		// 拍照发送
		camera() {
			this.getImage('camera');
		},
		// 选照片 or 拍照
		getImage(type) {
			const _this = this;
			this.hideDrawer();
			uni.chooseImage({
				sourceType: [type],
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				success: res => {
					_this.handleUploadFile(res.tempFilePaths);
				}
			});
		},
		// 图片上传
		handleUploadFile(data) {
			data.forEach(item => {
				this.$api.http.upload(this.$api.apiService.tinyServiceUploadFile, { filePath: item, name: 'file' }).then(async res => {
					if (res.code == this.$api.responseCode.successCode) {
						this.sendMessage(res.data.url, 'image');
					}
				});
			});
		},
		// 更多功能(点击+弹出)
		showMore() {
			this.isVoice = false;
			this.hideEmoji = true;
			if (this.hideMore) {
				this.bottomHeight = '500rpx';
				this.hideMore = false;
				this.openDrawer();
			} else {
				this.bottomHeight = 0;
				this.hideDrawer();
			}
		},
		swiftStuffService() {
			let params = {
				tip: true,
				content: '正在为您转接人工服务，请稍候...'
			};
			this.addImHistory(params);
			this.$api.websocket.send(JSON.stringify({ route: this.$api.websocketConfig.queueUpMatching }));
		},
		// 发送文字消息
		sendText() {
			this.hideDrawer(); // 隐藏抽屉
			if (!this.textMsg) {
				return;
			}
			if (!this.$api.websocket.conncted || !this.$api.websocket.login) {
				this.$api.helper.toast('正在等待连接，请稍候...');
				return;
			}
			this.sendMessage(this.textMsg, 'text');
			this.textMsg = ''; // 清空输入框
		},
		// 获取焦点，如果不是选表情ing,则关闭抽屉
		textareaFocus() {
			// if (this.popupLayerClass === 'showLayer' && this.hideMore === false) {
			// 	this.hideDrawer();
			// }
		},
		// 添加表情
		addEmoji(em) {
			this.textMsg += `${this.emojiToText(em)}`;
		},
		// 表情转文字
		emojiToText(em) {
			for (let i = 0; i < this.$api.websocket.emojiList.length; i++) {
				if (this.$api.websocket.emojiList[i].url === em.toString()) {
					return this.$api.websocket.emojiList[i].alt;
				}
				// console.log(this.emojiList[i].alt)
				if (this.$api.websocket.emojiList[i].alt === em.toString().trim()) {
					return this.$api.websocket.emojiList[i].url;
				}
			}
		},
		// 选择表情
		chooseEmoji() {
			this.hideMore = true;
			if (this.hideEmoji) {
				this.bottomHeight = '500rpx';
				this.hideEmoji = false;
				this.openDrawer();
			} else {
				this.bottomHeight = 0;
				this.hideDrawer();
			}
		},
		// 打开抽屉
		openDrawer() {
			this.popupLayerClass = 'showLayer';
		},
		discard() {},
		// 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 清除会话记录
		clearChatList() {
			uni.showModal({
				content: '是否清空聊天记录？',
				success: confirmRes => {
					if (confirmRes.confirm) {
						this.clearImHistory();
						this.$refs.dzToast.show({
							title: '聊天记录已清空',
							type: 'success'
						});
						this.bottomHeight = 0;
						this.hideDrawer();
					}
				}
			});
		},
		// 结束会话
		endSession() {
			this.setIsStuffService(false);
			this.$api.websocket.send(JSON.stringify({ route: this.$api.websocketConfig.memberClose }));
			this.bottomHeight = 0;
			this.hideDrawer();
			let params = {
				tip: true,
				content: '人工客服服务已结束，现在由机器人精灵为您服务'
			};
			this.addImHistory(params);
		},
		getAddress() {
			uni.getLocation({
				type: 'gcj02', // 返回可以用于uni.openLocation的经纬度
				success: function(res) {
					const latitude = res.latitude;
					const longitude = res.longitude;
					uni.openLocation({
						latitude: latitude,
						longitude: longitude,
						success: function() {
							console.log('success');
						}
					});
				}
			});
		},
		// 滑到底部
		scrollToBottom() {
			setTimeout(() => {
				uni.pageScrollTo({
					scrollTop: 99999999999
				});
			}, 100);
		},
		// 发送消息
		sendMessage(str, type) {
			let msg = str;
			const params = {};
			params.token = this.accessToken;
			params.route = this.isStuffService ? this.$api.websocketConfig.serviceMessage : this.$api.websocketConfig.ruleMessage;
			params.params = {};
			params.params.content = msg;
			params.params.type = type || 'text';
			if (this.isStuffService) {
				params.params.member_id = this.$api.websocket.serviceList[0] && this.$api.websocket.serviceList[0].member_id;
			}
			this.$api.websocket.send(JSON.stringify(params));
			this.bottomHeight = 0;
			//this.scrollToBottom();
		}
	}
};
</script>

<style lang="scss">
page {
	padding-bottom: 100rpx;
}
.margin-top {
	padding-top: (88rpx + var(--status-bar-height));
}
.wrapper {
	position: relative;
}

.icon {
	width: 48rpx;
	height: 48rpx;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;

	::after {
		width: 48rpx;
		height: 48rpx;
	}
}

.hidden {
	display: none !important;
}

.popup-layer {
	&.showLayer {
		transform: translate3d(0, -64vw, 0);
	}
	transition: all 0.15s linear;
	width: 100%;
	height: 64vw;
	background-color: #f3f3f3;
	border-top: solid 1rpx #ddd;
	position: fixed;
	z-index: 9999;
	top: 100%;
	.more-layer {
		width: 100%;
		height: 64vw;

		.iconfont {
			font-size: 60rpx;
		}

		.list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.box {
				width: 18vw;
				height: 18vw;
				border-radius: 20rpx;
				background-color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				// margin: 0 3vw 2vw 3vw;
				margin: 5vw 3vw 5vw 4vw;

				.icon {
					font-size: 50rpx;
				}
			}
		}
	}
}

.input-box {
	width: 100%;
	min-height: 100rpx;
	padding: 0 1%;
	background-color: #f2f2f2;
	display: flex;
	position: fixed;
	z-index: 9999;
	bottom: -2rpx;

	&.showLayer {
		transform: translate3d(0, -64vw, 0);
	}

	transition: all 0.15s linear;
	border-bottom: solid 1rpx #ddd;

	.voice,
	.more {
		flex-shrink: 0;
		width: 120rpx;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 48rpx;

		.service {
			text-align: center;
			line-height: 1.2;
			font-size: 24rpx;

			.iconfont {
				display: block;
				font-size: 32rpx;
			}
		}
	}

	.send {
		margin-left: 10rpx;
		flex-shrink: 0;
		width: 120rpx;
		height: 100rpx;
		display: flex;
		align-items: center;

		.btn {
			width: 100rpx;
			height: 63rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: linear-gradient(to right, #f09b37, #eb632c);
			color: #fff;
			border-radius: 6rpx;
			font-size: 24rpx;
		}
	}

	.textbox {
		width: 100%;
		min-height: 70rpx;
		margin-top: 15rpx;
		margin-bottom: 15rpx;

		.voice-mode {
			width: calc(100% - 2rpx);
			height: 68rpx;
			border-radius: 70rpx;
			border: solid 1rpx #cdcdcd;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			background-color: #fff;
			color: #555;

			&.recording {
				background-color: #e5e5e5;
			}
		}

		.text-mode {
			width: 100%;
			min-height: 70rpx;
			display: flex;
			background-color: #fff;
			border-radius: 40rpx;

			.box {
				width: 100%;
				padding-left: 30rpx;
				padding-right: 30rpx;
				min-height: 70rpx;
				display: flex;
				align-items: center;

				textarea {
					width: 100%;
				}
			}

			.em {
				flex-shrink: 0;
				width: 80rpx;
				padding-left: 10rpx;
				height: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 40rpx;
			}
		}
	}
}

.content {
	width: 100%;

	.msg-list {
		width: 96%;
		padding: 0 2%;
		position: absolute;
		top: 0;
		bottom: 100rpx;

		.loading {
			//loading动画
			display: flex;
			justify-content: center;
			@keyframes stretchdelay {
				0%,
				40%,
				100% {
					transform: scaleY(0.6);
				}
				20% {
					transform: scaleY(1);
				}
			}

			.spinner {
				margin: 20rpx 0;
				width: 60rpx;
				height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				view {
					background-color: #f06c7a;
					height: 50rpx;
					width: 6rpx;
					border-radius: 6rpx;
					animation: stretchdelay 1.2s infinite ease-in-out;
				}

				.rect2 {
					animation-delay: -1.1s;
				}

				.rect3 {
					animation-delay: -1s;
				}

				.rect4 {
					animation-delay: -0.9s;
				}

				.rect5 {
					animation-delay: -0.8s;
				}
			}
		}

		.row {
			.system {
				display: flex;
				justify-content: center;

				view {
					padding: 0 30rpx;
					height: 50rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #c9c9c9;
					color: #fff;
					font-size: 24rpx;
					border-radius: 40rpx;
				}

				.red-envelope {
					image {
						margin-right: 5rpx;
						width: 30rpx;
						height: 30rpx;
					}
				}
			}

			&:first-child {
				margin-top: 20rpx;
			}

			padding: 20rpx 0;

			.my .left,
			.other .right {
				width: 100%;
				display: flex;

				.bubble {
					max-width: 70%;
					min-height: 50rpx;
					border-radius: 10rpx;
					padding: 15rpx 20rpx;
					display: flex;
					align-items: center;
					font-size: 32rpx;
					word-break: break-word;

					&.img {
						background-color: transparent;
						padding: 0;
						overflow: hidden;

						image {
							flex: 1;
							max-width: 350rpx;
							max-height: 350rpx;
						}
					}

					&.red-envelope {
						background-color: transparent;
						padding: 0;
						overflow: hidden;
						position: relative;
						justify-content: center;
						align-items: flex-start;

						image {
							width: 250rpx;
							height: 313rpx;
						}

						.tis {
							position: absolute;
							top: 6%;
							font-size: 26rpx;
							color: #9c1712;
						}

						.blessing {
							position: absolute;
							bottom: 14%;
							color: #e9b874;
							width: 80%;
							text-align: center;
							overflow: hidden;
							// 最多两行
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}
					}

					&.voice {
						.icon {
							font-size: 40rpx;
							display: flex;
							align-items: center;
						}

						.icon:after {
							content: ' ';
							width: 53rpx;
							height: 53rpx;
							border-radius: 100%;
							position: absolute;
							box-sizing: border-box;
						}

						.length {
							font-size: 28rpx;
						}
					}
				}
			}

			.my .right,
			.other .left {
				flex-shrink: 0;
				width: 80rpx;
				height: 80rpx;

				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 10rpx;
				}
			}

			.my {
				width: 100%;
				display: flex;
				justify-content: flex-end;

				.left {
					min-height: 80rpx;

					align-items: center;
					justify-content: flex-end;

					.bubble {
						background-color: #f06c7a;
						color: #fff;

						&.voice {
							.icon {
								color: #fff;
							}

							.length {
								margin-right: 20rpx;
							}
						}

						&.play {
							@keyframes my-play {
								0% {
									transform: translateX(80%);
								}
								100% {
									transform: translateX(0%);
								}
							}

							.icon:after {
								border-left: solid 10rpx rgba(240, 108, 122, 0.5);
								animation: my-play 1s linear infinite;
							}
						}
					}
				}

				.right {
					margin-left: 15rpx;
				}
			}

			.other {
				width: 100%;
				display: flex;

				.left {
					margin-right: 15rpx;
				}

				.right {
					flex-wrap: wrap;

					.username {
						width: 100%;
						height: 45rpx;
						font-size: 24rpx;
						color: #999;
						display: flex;

						.name {
							margin-right: 50rpx;
						}
					}

					.bubble {
						background-color: #fff;
						color: #333;

						&.voice {
							.icon {
								color: #333;
							}

							.length {
								margin-left: 20rpx;
							}
						}

						&.play {
							@keyframes other-play {
								0% {
									transform: translateX(-80%);
								}
								100% {
									transform: translateX(0%);
								}
							}

							.icon:after {
								border-right: solid 10rpx rgba(255, 255, 255, 0.8);

								animation: other-play 1s linear infinite;
							}
						}
					}
				}
			}
		}
	}
}

.cu-item {
	.service {
		margin-top: 20rpx;
	}

	.name {
		position: absolute;
		left: 160rpx;
		top: -2rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
		color: #909399;
	}
}
</style>
