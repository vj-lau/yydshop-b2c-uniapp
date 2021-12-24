<template>
	<!-- 海报引导 -->
	<view v-if="show">
		<!-- 遮罩层 -->
		<view class="mask" @tap="hideGuide"></view>
		<view class="dz-wechat-guide" :style="{ paddingTop: paddingTop }">
			<!-- #ifdef MP-WEIXIN -->
			<view class="dz-flex dz-row-center dz-row-between dz-m-t-60">
				<view>1.点击顶部右侧按钮</view>
				<view class="dz-relative">
					<dz-image :src="capsule" width="263" height="86"></dz-image>
					<view class="guide guide-1" :style="{ borderColor: theme.dzBaseColor }"></view>
				</view>
			</view>

			<view class="dz-m-t-60">2.点击添加到我的小程序</view>
			<view class="image dz-relative">
				<dz-image :src="smallProgramBoot" width="100%" height="200"></dz-image>
				<view class="guide guide-2 " :style="{ borderColor: theme.dzBaseColor }"></view>
			</view>
			<view class="dz-m-t-60">3.微信首页下拉, 快速进入{{guideConfig.style_attention_mini_program_name}}</view>
			<view class="content dz-p-30">
				<view class="dz-text-center">小程序</view>
				<view class="dz-m-t-30">我的小程序</view>
				<view class="dz-flex dz-m-t-40">
					<view class=" shop ">
						<dz-image
							:src="guideConfig.style_attention_mini_program_logo"
							width="90"
							height="90"
							borderRadius="45"
						></dz-image>
						<text class="dz-m-t-10">{{guideConfig.style_attention_mini_program_name}}</text>
					</view>
				</view>
			</view>
			<view class="dz-flex dz-row-center dz-m-t-30"><view class="button dz-flex dz-row-center" @tap="hideGuide()">我知道啦</view></view>
			<!-- #endif -->
		</view>
		<!-- #ifndef MP-WEIXIN -->
		<view class="dz-wechat-h5">
			<view class="icon"><dz-icon name="triangleupfill" color="#fff" size="50"></dz-icon></view>
			<view class="dz-content dz-p-20">
				<view class="dz-flex dz-col-center">
					<text class=" dz-font-36 dz-m-r-10">①</text>
					<text class="dz-color-6">长按下方二维码关注公众号</text>
				</view>
				<view class="dz-flex dz-row-center dz-p-20">
					<dz-image :src="guideConfig.style_attention_official_account_qrcode" width="220" height="220"></dz-image>
				</view>
				<view class="dz-flex dz-col-center ">
					<text class="dz-font-36 dz-m-r-10">②</text>
					<text class="dz-color-6">下次可在微信搜索公众号 "{{guideConfig.style_attention_official_account_name}}" 快速进入</text>
				</view>
			</view>
			<view class="dz-flex dz-row-center dz-m-t-30"><dz-icon name="roundclosefill" size="60" color="#fff" @click="hideGuide()"></dz-icon></view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		guideConfig: {
			type:Object,
			default() {
			     return {}
			}
		},
		paddingTop: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			theme: this.$api.theme,
			capsule: this.$api.assetsConfig.capsule,
			smallProgramBoot: this.$api.assetsConfig.smallProgramBoot,
		};
	},
	onLoad() {
		
	},
	methods: {
		hideGuide() {
			this.$emit('hideGuide');
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';

.mask {
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 9999998;
	background-color: rgba(0, 0, 0, 0.6);
}
.dz-wechat-guide {
	position: fixed;
	z-index: 9999999;
	width: 100%;
	top: 0;
	left: 0;
	padding: 90rpx 60rpx;
	color: #fff;
	font-size: 32rpx;
	.guide {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.2);
		border: 2rpx solid pink;
		border-radius: 15rpx;
	}
	.guide-1 {
		top: -17rpx;
		left: -17rpx;
		width: 160rpx;
		height: 120rpx;
	}
	.guide-2 {
		top: 10rpx;
		left: 127rpx;
		width: 140rpx;
		height: 200rpx;
	}
	.image {
		margin-top: 20rpx;
		padding: 10rpx 0;
		background: #f7f7f7;
		border-radius: 20rpx;
		overflow: hidden;
	}
	.content {
		margin-top: 20rpx;
		background-color: rgba(51, 51, 51, 1);
		border-radius: 20rpx;
		.shop {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
	.button {
		width: 260rpx;
		height: 86rpx;
		border: 6rpx solid #fff;
		border-radius: 43rpx;
	}
}
.dz-wechat-h5 {
	position: fixed;
	z-index: 9999999;
	top: 20rpx;
	right: 30rpx;
	.icon {
		position: absolute;
		right: 60rpx;
	}
	.dz-content {
		width: 440rpx;
		height: 440rpx;
		margin-top: 30rpx;
		background: #fff;
		border-radius: 20rpx;
	}
}
</style>
