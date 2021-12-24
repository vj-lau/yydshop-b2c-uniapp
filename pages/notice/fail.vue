<template>
	<view class="container">
		<view class="dz-bg" :style="{ background: 'linear-gradient(20deg, ' + theme.dzBaseColor + ', ' + theme.dzBaseDark + ')' }"></view>
		<view class="dz-content">
			<view class="dz-form">
				<image :src="imgFailure" class="dz-icon" mode="widthFix"></image>
				<view class="dz-title">{{ title }}</view>
				<view class="dz-sub-title">{{ sub }}</view>
				<view class="dz-btn-box">
					<dz-button
						hoverClass="none"
						:border="false"
						:custom-style="{ background: theme.dzBgColor, borderColor: theme.dzBgColor, width: '240rpx', height: '70rpx' }"
						:plain="true"
						shape="circle"
						@click="navTo(1)"
					>
						{{ language.notice.back }}
					</dz-button>
					<dz-button
						:border="false"
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '240rpx', height: '70rpx' }"
						hover-class="none"
						shape="circle"
						@click="navTo(2)"
					>
						{{ language.notice.userCenter }}
					</dz-button>
				</view>
			</view>
		</view>
		<view class="dz-tips">
			<view class="dz-grey">{{ language.notice.tip }}</view>
			<view class="dz-light-grey">{{ tip }}</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			assets: this.$api.assetsConfig,
			language: this.$api.language,
			title: this.$api.language.notice.failTitle,
			sub: this.$api.language.notice.failSub,
			tip: this.$api.language.notice.failTip,
			imgFailure: this.$api.assetsConfig.failure,
			btnType: 0,
			loading: false
		};
	},
	computed: {
		...mapState(['userInfo']),
		...mapGetters(['hasLogin'])
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({ title: this.$api.language.notice.failTitle });
		if (e.title) {
			this.title = decodeURIComponent(e.title);
		}
		if (e.sub) {
			this.sub = decodeURIComponent(e.sub);
		}
		await this.$onLaunched;
		//通商云返回页面，需要更新用户信息
		if (this.hasLogin) {
			this.getMemberInfo();
		}
	},
	methods: {
		...mapMutations(['setUserInfo']),
		navTo(page) {
			if (page == 1) {
				let pages = getCurrentPages();
				if (pages.length == 1) {
					uni.reLaunch({
						url: this.$api.appConfig.indexPath
					});
				} else {
					uni.navigateBack();
				}
			} else if (page == 2) {
				this.$api.router.reLaunch({
					route: this.$api.routesConfig.profile,
					query: {}
				});
			}
		},
		getMemberInfo() {
			this.$api.http
				.get(this.$api.apiShop.memberInfo)
				.then(res => {
					this.setUserInfo(res.data);
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.dz-bg {
	width: 100%;
	height: 260rpx;
	border-bottom-right-radius: 42rpx;
}

.dz-content {
	padding: 0 35rpx;
	box-sizing: border-box;
}

.dz-form {
	background: #fff;
	box-shadow: 0 10rpx 14rpx 0 rgba(0, 0, 0, 0.08);
	border-radius: 20rpx;
	margin-top: -100rpx;
	position: relative;
	z-index: 10;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.dz-icon {
	width: 260rpx;
	display: block;
	margin-top: 60rpx;
}

.dz-title {
	font-size: 42rpx;
	line-height: 42rpx;
	padding-top: 28rpx;
}

.dz-sub-title {
	color: #666666;
	font-size: 28rpx;
	line-height: 28rpx;
	padding-top: 20rpx;
}

.dz-btn-box {
	width: 580rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 80rpx;
	padding-bottom: 40rpx;
}

.dz-btn {
	width: 240rpx;
	height: 70rpx;
}

.dz-tips {
	font-size: 26rpx;
	padding: 48rpx 90rpx;
	box-sizing: border-box;
	text-align: justify;
	line-height: 48rpx;
}

.dz-grey {
	color: #666;
}

.dz-light-grey {
	color: #888;
}
</style>
