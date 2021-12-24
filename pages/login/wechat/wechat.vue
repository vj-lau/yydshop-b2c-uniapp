<template>
	<view class="screen">
		<view class="warp">
			<view @tap="errorBack">
				<view class="dz-text-center"><dz-icon name="wechat" size="100" color="rgb(83,194,64)"></dz-icon></view>
				<view class="dz-text-center dz-p-t-20 tip">{{ tip }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tip: this.$api.language.wechatLogin.login,
			loading: true
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.wechatLogin.titleLogin
		});
		await this.$onLaunched;
		if (!e.code) {
			this.$api.router.redirectTo({
				route: this.$api.routesConfig.fail,
				query: {}
			});
			return;
		}
		this.wechatLogin(e.code);
	},
	methods: {
		async wechatLogin(code) {
			await this.$api.http
				.get(this.$api.apiShop.wechatH5Login, {
					params: {
						code: code,
						promo_code: this.$api.store.state.promoCode
					}
				})
				.then(res => {
					uni.$emit('customPageChange', {});
					uni.$emit('sgninChange');
					this.$api.store.commit('setWechatMpLogin', true);
					if (!res.data.login) {
						this.$api.store.commit('setThirdPartyUserInfo', { type: 'wechat', userInfo: res.data.user_info.original });
						this.$api.router.redirectTo({
							route: this.$api.routesConfig.thirdPartyLogin
						});
					} else {
						this.$api.store.commit('login', res.data.user_info);
						if (parseInt(this.$api.shopSetting.app_service_type) > 0) {
						}
						let pages = getCurrentPages();
						if (pages.length < 3) {
							uni.reLaunch({
								url: this.$api.appConfig.indexPath
							});
						} else {
							this.$api.router.back(2);
						}
					}
				})
				.catch(err => {
					this.loading = false;
					this.tip = this.$api.language.wechatLogin.error;
				});
		},
		errorBack() {
			if (this.loading) {
				return;
			}
			this.$api.router.push({
				route: this.$api.routesConfig.login
			});
		}
	}
};
</script>

<style lang="scss">
.screen {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	opacity: 1;
	background-color: #fff;
	transition: transform 0.3s;
}

.warp {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.tip {
	font-size: 26rpx;
	color: $dz-tips-color;
}
</style>
