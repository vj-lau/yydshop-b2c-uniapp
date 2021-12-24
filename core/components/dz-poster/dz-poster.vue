<template>
	<view @touchmove.stop.prevent>
		<view class="mc-modal-box" :class="[fadeIn || show ? 'mc-modal-normal' : 'mc-modal-scale', show ? 'mc-modal-show' : '']">
			<view class="dz-poster">
				<image class="poster-img" mode="widthFix" :src="poster" @longpress="saveImage"></image>
				<text class="tips" @tap="hidePoster">{{ language.application.pressSaveImage }}</text>
				<view class="dz-close" @tap="hidePoster"><text class="dzicon-iconfont dzicon-roundclosefill dz-icon"></text></view>
			</view>
		</view>
		<view class="mc-modal-mask" :class="[show ? 'mc-mask-show' : '']" @tap="hidePoster"></view>
	</view>
</template>

<script>
export default {
	props: {
		poster: {
			type: String,
			default: ''
		},
		//是否显示
		show: {
			type: Boolean,
			default: false
		},

		//淡入效果
		fadeIn: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			language: this.$api.language
		};
	},
	methods: {
		hidePoster() {
			this.$emit('hidePoster');
		},
		saveImage() {
			const _this = this;
			// #ifndef H5
			uni.saveImageToPhotosAlbum({
				filePath: this.poster,
				success() {
					_this.$api.helper.toast('保存海报成功');
				}
			});
			// #endif
			// #ifdef H5
			_this.$api.helper.toast('请长按松开后选择另存为保存到相册');
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';
.mc-modal-box {
	position: fixed;
	left: 50%;
	top: 50%;
	margin: auto;
	z-index: 9999997;
	transition: all 0.3s linear 0s;
	opacity: 0;
	box-sizing: border-box;
	visibility: hidden;
}

.mc-modal-scale {
	transform: translate(-50%, -50%) scale(0);
}

.mc-modal-normal {
	transform: translate(-50%, -50%) scale(1);
}

.mc-modal-show {
	opacity: 1;
	visibility: visible;
}

.mc-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 9999996;
	transition: all 0.25s linear;
	opacity: 0;
	visibility: hidden;
}

.mc-mask-show {
	visibility: visible;
	opacity: 1;
}

.dz-poster {
	width: 100%;
	position: relative;
	margin-top: 20rpx;
	.poster-img {
		z-index: 9999998;
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		width: 600rpx;
		border-radius: 40rpx;
		height: 1000rpx;
		overflow: hidden;
	}
	.tips {
		color: #ffffff;
		@include vue-flex;
		margin-top: 30rpx;
		justify-content: center;
	}
}
.dz-close {
	width: 100%;
	@include vue-flex;
	margin-top: 20rpx;
	justify-content: center;
}
.dz-icon {
	font-size: 70rpx;
	color: #fff;
}
</style>
