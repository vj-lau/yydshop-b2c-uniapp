<template>
	<!--头部-->
	<view
		v-if="config.props"
		class="dz-my-head"
		:style="{
			height: `${parseInt(config.props.height + mpHeight) * 2}rpx`,
			background:
				config.props.isBottomRadius == 1
					? ''
					: config.props.colorType == 1
					? config.props.bgColor
					: config.props.linearColor
					? config.props.linearColor.color
					: config.props.bgColor,

			color: config.props.color
		}"
	>
		<view
			v-if="config.props.isBottomRadius == 1 && !config.props.cover"
			class="pure_top_view"
			:style="{
				height: `${parseInt(config.props.height + mpHeight) * 2}rpx`,

				background: config.props.colorType == 1 ? config.props.bgColor : config.props.linearColor ? config.props.linearColor.color : config.props.bgColor
			}"
		></view>
		<view v-if="config.props.cover" class="custom-bg-img">
			<img
				:src="config.props.cover"
				:style="{
					width: '100%',
					height: parseInt(config.props.height + mpHeight) * 2 + 'rpx'
				}"
			/>
		</view>
		<view class="dz-head-box">
			<view class="dz-user-info-box">
				<!-- 未登陆 -->
				<view v-if="!hasLogin" class="login-user-view">
					<view class="login-user-avatar-view"><dz-avatar :src="missingFace" size="large"></dz-avatar></view>
					<dz-button
						size="mini"
						type="info"
						shape="circle"
						throttleTime="200"
						@click="loginClick"
						hoverClass="none"
						:border="false"
						:customStyle="{
							width: `${parseInt(config.props.loginBtnWidth) * 2}rpx`,
							height: `${parseInt(config.props.loginBtnHeight) * 2}rpx`,
							fontSize: `${parseInt(config.props.loginBtnFontSize) * 2}rpx`,
							borderRadius: `${config.props.loginBtnHeight}rpx`,
							color: config.props.loginBtnColor,
							background: config.props.loginBtnBgColor
						}"
					>
						{{ language.application.loginOrRegist }}
					</dz-button>
				</view>
				<!-- 已登录 -->
				<view v-else>
					<view class="dz-flex">
						<view class="dz-flex-3 dz-text-center dz-m-t-10">
							<dz-avatar
								:src="userInfo.head_portrait || missingFace"
								:size="parseInt(config.props.avatarSize) * 2"
								:is-border="config.props.isAvatarBorder == 1 ? true : false"
								:border-size="parseInt(config.props.avatarBorderSize) * 2"
								:border-color="config.props.avatarBorderColor"
								@click="click('set')"
							></dz-avatar>
						</view>
						<view class="dz-flex-7 dz-font-weight dz-font-xl dz-relative">
							<view class="dz-line-1 dz-m-b-6" :class="config.props.nicknameIsBold == 1 ? 'dz-font-weight' : ''" style="width: 400rpx;">
								{{ userInfo.nickname || userInfo.realname || userInfo.mobile }}
							</view>
							<view v-if="isPromoterStore || isPromoterWarehouse || userInfo.memberLevel" class="dz-flex">
								<view
									class="tag-level dz-m-t-10"
									:style="{
										color: config.props.levelColor,
										background: config.props.levelBgColor,
										borderColor: config.props.levelBgColor
									}"
									@tap="click('level')"
								>
									<block v-if="config.props.memberLevelType == 1">{{ userInfo.memberLevel ? userInfo.memberLevel.name : language.user.memberLevel }}</block>
									<block v-if="config.props.memberLevelType == 2">{{ userInfo.promoter.promoterStore.storeLevel.name }}</block>
									<block v-if="config.props.memberLevelType == 3">{{ userInfo.promoter.promoterWarehouse.warehouseLevel.name }}</block>
									<view class="icon"><dz-icon :name="config.props.levelCaver" size="65"></dz-icon></view>
								</view>
							</view>
							<!-- #ifndef MP -->
							<view
								v-if="config.props.isSignin == 1 && config.props.signinMode.includes('button')"
								class="signin-btn btn-absolute"
								:style="{ width: '130rpx', marginRight: '20rpx', background: config.props.sgninBgColor, color: config.props.sgninColor }"
								@tap="click('signIn')"
							>
								<view class="dz-relative">
									<view v-if="signinToday" class="dz-absolute" :animation="animationData">
										<dz-icon name="singin-writefill" size="32" :color="config.props.sgninColor"></dz-icon>
									</view>
									<view v-else class="singin-icon" :style="{ marginTop: signinStatus ? '40rpx' : '' }">
										<dz-icon name="singin-writefill" size="32" :color="config.props.sgninColor"></dz-icon>
									</view>
								</view>
								<view v-if="signinToday" class="dz-font-24 dz-font-weight dz-m-l-40" :animation="animationTextData">签到</view>
								<view v-else class="dz-font-24 dz-font-weight dz-m-l-6">签到</view>
							</view>
							<!-- #endif -->
						</view>
						<!-- 小程序 -->
						<!-- #ifdef MP -->
						<view class="dz-flex-2 dz-text-right dz-p-r-20">
							<view class="dz-navbar-right">
								<view class="message-box right-item" @tap="click('notifyIndex')">
									<dz-icon name="message" size="48" :color="config.props.notifyColor"></dz-icon>
									<dz-badge :count="notifyUnRead" :color="config.props.badegColor" :bgColor="config.props.badegBgColor" :offset="[-10, -10]"></dz-badge>
								</view>
								<view
									v-if="hasLogin && config.props.isSignin == 1 && config.props.signinMode.includes('button')"
									class="signin-btn dz-m-t-16"
									:style="{ width: '130rpx', marginRight: '20rpx', background: config.props.sgninBgColor, color: config.props.sgninColor }"
									@tap="click('signIn')"
								>
									<view class="dz-relative">
										<view v-if="signinToday" class="dz-absolute" :animation="animationData">
											<dz-icon name="singin-writefill" size="32" :color="config.props.sgninColor"></dz-icon>
										</view>
										<view v-else class="singin-icon"><dz-icon name="singin-writefill" size="32" :color="config.props.sgninColor"></dz-icon></view>
									</view>
									<view v-if="signinToday" class="dz-font-24 dz-font-weight dz-m-l-40" :animation="animationTextData">签到</view>
									<view v-else class="dz-font-24 dz-font-weight dz-m-l-6">签到</view>
								</view>
							</view>
						</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
	props: {
		config: {
			type: Object,
			default() {
				return {};
			}
		},
		userInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		hasLogin: {
			type: Boolean,
			default: false
		},
		isPromoterStore: {
			type: Boolean,
			default: false
		},
		isPromoterWarehouse: {
			type: Boolean,
			default: false
		},
		notifyUnRead: {
			type: [String, Number],
			default: 0
		},
		signinToday: {
			type: Boolean,
			default: false
		},
		signinStatus: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			missingFace: this.$api.assetsConfig.missingFace,
			mpHeight: 0,
			animation: '',
			animationData: {},
			animationText: '',
			animationTextData: {}
		};
	},
	mounted() {
		// #ifdef MP
		this.mpHeight = systemInfo.platform == 'ios' ? 44 : 48;
		// #endif
		if (this.signinToday && this.hasLogin) {
			this.initAnimation();
		}
	},
	watch: {
		signinToday: {
			handler(val) {
				if (!val) {
					this.animation = '';
					this.animationData = {};
					this.animationText = '';
					this.animationTextData = {};
				}
			}
		}
	},
	methods: {
		initAnimation() {
			this.animation = '';
			this.animationData = {};
			this.animationText = '';
			this.animationTextData = {};
			// 初始化一个动画
			var animation = uni.createAnimation({
				duration: 300, //动画持续1秒
				timingFunction: 'linear', //linear 全程匀速运动
				delay: 60 //延迟两秒执行动画
			});
			this.animation = animation;
			// 使用动画
			setTimeout(() => {
				if (this.signinToday) {
					this.scaleAndScale();
				}
			}, 40);
		},
		// 定义动画内容
		scaleAndScale() {
			// 定义动画内容
			this.animation.translateY(-10).step();
			this.animation.translateY(-20).step();
			this.animation.translateY(-10).step();
			this.animation.translateY(-20).step();
			this.animation.translateY(-40).step();
			this.animation.rotate(520).step();
			this.animation.translateY(-10).step();
			// 导出动画数据传递给data层
			this.animationData = this.animation.export(); //每次执行导出动画时 会覆盖之前的动画
			setTimeout(() => {
				var animationText = uni.createAnimation({
					duration: 300, //动画持续1秒
					timingFunction: 'linear', //linear 全程匀速运动
					delay: 60 //延迟两秒执行动画
				});
				this.animationText = animationText;
				this.rightLeftScale();
			}, 2500);
		},
		rightLeftScale() {
			this.animationText.translateX(4).step();
			this.animationText.translateX(0).step();
			this.animationTextData = this.animationText.export();
		},
		click(value) {
			this.$emit('click', value);
		},
		loginClick() {
			this.$api.router.push({
				route: this.$api.routesConfig.login,
				query: {}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-my-head {
	position: relative;
}
.pure_top_view {
	position: absolute;
	top: 0;
	left: -30%;
	width: 160%;
	content: '';
	border-radius: 0 0 50% 50%;
}
.dz-head-box {
	position: relative;
	padding-top: 80rpx;
	padding-bottom: 90rpx;
	.dz-user-info-box {
		/* #ifdef MP */
		padding-top: calc(var(--status-bar-height) + 50rpx);
		/* #endif */
		.login-user-view {
			position: relative;
			text-align: center;
			.login-user-avatar-view {
				position: relative;
				margin-bottom: 20rpx;
			}
		}
	}
}
.tag-level {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 36rpx;
	padding: 6rpx 20rpx 6rpx 50rpx;
	margin-left: 10rpx;
	border-radius: 15rpx 0 30rpx 15rpx;
	font-size: 24rpx;
	color: #ffffff;
	border-width: 1rpx;
	border-style: solid;
	position: relative;
	.icon {
		position: absolute;
		top: -16rpx;
		left: -20rpx;
		font-size: 60rpx;
	}
}
.dz-navbar-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}
.right-item {
	margin: 0 32rpx;
	position: relative;
	color: $dz-main-color;
	display: flex;
}
.custom-bg-img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.signin-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 52rpx;
	border-radius: 26rpx;
	color: #333;
}
.btn-absolute {
	position: absolute;
	right: 0;
	top: 52rpx;
}
.singin-icon {
	transform: rotate(520deg);
}
</style>
