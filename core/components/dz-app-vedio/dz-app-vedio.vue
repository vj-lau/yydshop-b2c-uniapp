<template>
	<view class="dz-video-h5-view-box">
		<!--封面-->
		<view class="video-cover-view" v-show="coverShow">
			<view class="bg-img bg-mask flex align-center text-center video-cover" :style="[{backgroundImage:'url('+ vedioCover +')'}]">
				<view class="video-icon">
					<view class="dzicon-iconfont dzicon-playfill"></view>
				</view>
				
			</view>
			<!--点击事件,此view里不能放任何组件，只能放文字，否则会报错-->
			<view class="video-click" @click="video_view.onClick" :data-index='vedioIndex' :data-src='vedioUrl'></view>
		</view>
		
		<!--视频组件框-->
		<view class="dz-video-h5-box" :id="['video_h5_' + vedioIndex]"></view>
	</view>
</template>

<script>
	//在APP端创建H5的视频播放器组件，用此方案，可调整视频组件的层级问题。
	//如需扩展其它类型的组件，可按照此方案，自行扩展。
	export default {
		name: 'dz-app-video',
		data() {
			return {
				coverShow: true,
				videoContext:null
			}
		},
		props: {
			vedioUrl: {
				type: String,
				default: ''
			},
			vedioIndex: {
				type: Number,
				default: 1
			},
			vedioCover: {
				type: String,
				default: ''
			}
		},
		methods: {
			closeCoverClick() {
				//关闭封面
				this.coverShow = false;
			},
			videoPlayEvent(){
				this.$emit('videoPlaying',this.vedioIndex);
			},
			videoPause(){
				//TODO 解决了APP视频的层级问题，但是无法暂停视频播放
			},
		}
	}
</script>

<script module="video_view" lang="renderjs">
	export default {
		methods: {
			onClick(event,ownerInstance) {
				let data = event.target.dataset;
				// 调用 service 层的方法
				ownerInstance.callMethod('closeCoverClick');
				this.initVideo(data.src,data.index,ownerInstance);
			},
			initVideo(vedioUrl,vedioIndex,ownerInstance) {
				//更多video属性：https://www.w3school.com.cn/jsref/dom_obj_video.asp
				let src = vedioUrl.replace(/\"/g, "");
				const VIDEO = document.createElement("video");
				VIDEO.setAttribute("id",'video-'+vedioIndex);
				VIDEO.setAttribute("width", "100%");
				VIDEO.setAttribute("height", "200");
				VIDEO.setAttribute("autoplay", "autoplay");	//自动播放
				VIDEO.setAttribute("controls", "controls");	//控制条
				VIDEO.setAttribute("src", src);
				const view = document.getElementById("video_h5_" + vedioIndex);
				view.appendChild(VIDEO);
				VIDEO.addEventListener('play', () => {
					ownerInstance.callMethod('videoPlayEvent');
				}, false);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dz-video-h5-view-box {
		position: relative;
		width: 100%;
		.video-cover-view {
			position: absolute;
			width: 100%;
			height: 200px;
			.flex {
				display: flex;
			}
			.video-cover {
				height: 200px;
				text-align: center;
				background-repeat: no-repeat;
				background-size: cover;
			}
			.bg-mask {
			    background-color: #000000;
			}
			.align-center {
				align-items: center;
			}
			.text-center {
				justify-content: center;
				text-align: center;
			}
			.video-play-view {
				width: 100%;
				color: #ffffff;
				.play {
					font-size: 62rpx;
				}
			}
			.video-click {
			    position: absolute;
			    left: 0;
			    bottom: 0;
			    top: 0;
			    right: 0;
				pointer-events: all;
				z-index: 2;
			}
			.video-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				border: 6rpx solid #FFFFFF;
				color: #FFFFFF;
				.dzicon-playfill {
					font-size: 60rpx;
				}
			}
		}
		.dz-video-h5-box {
			position: relative;
			width: 100%;
			height: 200px;
		}
	}
</style>
