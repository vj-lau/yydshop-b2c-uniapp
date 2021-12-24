<template>
	<view>
		<dz-navbar :title="language.user.privacyPolicy"></dz-navbar>
		<dz-cell-group>
			<dz-cell-item center title="注册协议" @tap="cellTap('register')"></dz-cell-item>
			<dz-cell-item center title="隐私政策" @tap="cellTap('privacy')"></dz-cell-item>
			<dz-cell-item center title="充值协议" @tap="cellTap('recharge')"></dz-cell-item>
			<dz-cell-item center title="分销商协议" @tap="cellTap('promoter')"></dz-cell-item>
		</dz-cell-group>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.user.theAgreement
		});
		await this.$onLaunched;
	},
	methods: {
		cellTap(val) {
			let title;
			switch (val) {
				case 'register':
					title = '注册协议';
					break;
				case 'privacy':
					title = this.language.user.privacyPolicy;
					break;
				case 'recharge':
					title = '充值协议';
					break;
				case 'promoter':
					title = '分销商协议';
					break;
			}
			this.$api.router.push({
				route: this.$api.routesConfig.aboutProtocol,
				query: {
					field: val,
					title
				}
			});
		}
	}
};
</script>
