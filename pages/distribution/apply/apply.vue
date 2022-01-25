<template>
	<view>
		<dz-navbar title="区域代理"></dz-navbar>
		<view v-if="regionalConfig.promoter_regional_banner" class="banner">
			<view class="image"><dz-image :src="regionalConfig.promoter_regional_banner" width="100%" height="320"></dz-image></view>
			<view class="regional-info"></view>
		</view>
		<view class="head">
			<view style="font-size: 35rpx;font-weight: 700;">负责区域</view>
			<view @click="history">申请历史</view>
		</view>
		<dz-picker mode="region" :params="addressParams" @cancel="cancelPicker" v-model="showPicker" @confirm="pickerConfirm"></dz-picker>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
		<view v-if="current == 1">
			<dz-empty v-if="territory.length == 0 && !isShow" text="暂无负责区域" :src="empty" iconSize="360"></dz-empty>
			<view class="card" v-for="(item, i) in territory" :key="i">
				<view v-if="item.level == 1" class="dz-flex">
					<text>等级：</text>
					<dz-tag :text="item.level | regionalAgentLevelFilter" bg-color=" #fdc561" mode="dark" size="mini" />
				</view>
				<view v-if="item.level == 2">
					<text>等级：</text>
					<dz-tag :text="item.level | regionalAgentLevelFilter" bg-color=" #42e38d" mode="dark" size="mini" />
				</view>
				<view v-if="item.level == 3">
					<text>等级：</text>
					<dz-tag :text="item.level | regionalAgentLevelFilter" bg-color=" #2eafff" mode="dark" size="mini" />
				</view>
				<view style="margin-top: 4rpx;">区域：{{ item.address_name }}</view>
			</view>
			<view style="height: 120rpx;"></view>
			<view class="fixed">
				<view class="fonter-bottom">
					<view style="width: 90%;">
						<dz-button
							:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
							:disabled="btnDisabled"
							hover-class="none"
							shape="circle"
							:border="false"
							@click="application"
						>
							申请代理
						</dz-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			showPicker: false,
			regional_level: 3,
			mobile: '',
			address_details: '',
			address: this.$api.language.address.pleaseChoose,
			addressData: {
				province_id: 0,
				city_id: 0,
				area_id: 0
			},
			addressParams: {
				province: true,
				city: true,
				area: true
			},
			isShow: false,
			applyInfo: [],
			promoterInfo: {},
			regionalConfig: {},
			btnDisabled: false,
			loadingShow: true,
			loadingStatus: 'loading',
			current: 1,
			// 负责的区域
			territory: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '区域代理'
		});
		await this.$onLaunched;
		this.getPromoterInfo();
	},
	filters: {
		regionalAgentLevelFilter(val) {
			switch (parseInt(val)) {
				case 1:
					return '省代';
				case 2:
					return '市代';
				case 3:
					return '区代';
			}
		},
		stateFilters(val) {
			switch (parseInt(val)) {
				case 0:
					return '待审核';
				case -1:
					return '拒绝';
				case 1:
					return '已通过';
			}
		}
	},
	methods: {
		async getPromoterInfo() {
			await this.$api.http
				.get(this.$api.apiDistribution.memberIndex)
				.then(async res => {
					this.promoterInfo = res.data.promoter || {};
					await this.getRegionalLevelConfig();
					await this.getRegionalAgentApplySchedule();
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
		},
		async getRegionalLevelConfig() {
			await this.$api.http.get(this.$api.apiDistribution.regionalLevelConfig).then(res => {
				this.regionalConfig = res.data;
			});
		},
		async getRegionalAgentApplySchedule() {
			await this.$api.http.get(this.$api.apiDistribution.regionalAgentApplySchedule).then(res => {
				this.applyInfo = res.data;
				this.territory = [];
				res.data.forEach(item => {
					if (item.state == 1) {
						this.territory.push(item);
					}
				});
				if (!this.applyInfo) {
					this.isShow = true;
				}
			});
		},
		toApply() {
			this.isShow = !this.isShow;
		},
		loadingClick() {
			this.getPromoterInfo();
		},
		// 监听反馈类型事件
		groupChange(e) {
			this.regional_level = e.value;
			let level = parseInt(this.regional_level);
			if (level === 3) {
				this.addressParams.province = true;
				this.addressParams.city = true;
				this.addressParams.area = true;
			} else if (level === 2) {
				this.addressParams.province = true;
				this.addressParams.city = true;
				this.addressParams.area = false;
			} else if (level === 1) {
				this.addressParams.province = true;
				this.addressParams.city = false;
				this.addressParams.area = false;
			}
			this.address = this.$api.language.address.pleaseChoose;
			this.addressData.province_id = 0;
			this.addressData.city_id = 0;
			this.addressData.area_id = 0;
		},
		// 确定选择地址
		pickerConfirm(e) {
			let level = parseInt(this.regional_level);
			if (level === 3) {
				this.address = e.province.title + ' ' + e.city.title + ' ' + e.area.title;
				this.addressData.province_id = e.province.id;
				this.addressData.city_id = e.city.id;
				this.addressData.area_id = e.area.id;
			} else if (level === 2) {
				this.address = e.province.title + ' ' + e.city.title;
				this.addressData.province_id = e.province.id;
				this.addressData.city_id = e.city.id;
				this.addressData.area_id = 0;
			} else if (level === 1) {
				this.address = e.province.title;
				this.addressData.province_id = e.province.id;
				this.addressData.city_id = 0;
				this.addressData.area_id = 0;
			}
			this.showPicker = false;
		},
		// 取消
		cancelPicker() {
			this.showPicker = false;
		},
		async applyViewClick() {
			this.isShow = false;
			await this.$api.http
				.get(this.$api.apiDistribution.regionalAgentApplySchedule)
				.then(res => {
					this.applyInfo = res.data;
				})
				.catch(err => {});
		},
		// 提交申请
		submit() {
			if (!this.addressData.province_id)
				return this.$refs.dzToast.show({
					title: '请选择代理区域',
					type: 'warning'
				});

			if (!this.$api.helper.isMobile(this.mobile))
				return this.$refs.dzToast.show({
					title: '请输入正确的联系电话',
					type: 'warning'
				});

			if (!this.address_details)
				return this.$refs.dzToast.show({
					title: '请输入联系地址',
					type: 'warning'
				});
			this.$api.http
				.post(this.$api.apiDistribution.regionalApplyCreate, {
					level: this.regional_level,
					...this.addressData,
					mobile: this.mobile,
					address_details: this.address_details
				})
				.then(res => {
					this.getRegionalAgentApplySchedule();
					this.$refs.dzToast.show({
						title: '提交成功，请等待审核',
						type: 'success'
					});
					this.isShow = false;
				});
		},
		sectionChange(index) {
			this.current = index;
			this.getRegionalAgentApplySchedule();
		},
		// 申请代理
		application() {
			// #ifdef MP
			if (
				this.$api.store.state.wechatMpLogin &&
				this.$api.shopSetting.notify_miniprogram_sub &&
				(this.$api.shopSetting.notify_miniprogram_sub.promoter_audit ||
					this.$api.shopSetting.notify_miniprogram_sub.promoter_done ||
					this.$api.shopSetting.notify_miniprogram_sub.promoter_level_change)
			) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.promoter_audit, //   分销商审核通知
						this.$api.shopSetting.notify_miniprogram_sub.promoter_done, //   成为分销商通知
						this.$api.shopSetting.notify_miniprogram_sub.promoter_level_change //   分销商等级变更通知
					],
					success: res => {
						_this.$api.router.push({
							route: _this.$api.routesConfig.distributionApplyAgncy
						});
					},
					fail(err) {
						_this.$api.router.push({
							route: _this.$api.routesConfig.distributionApplyAgncy
						});
						console.log(err, 2);
					}
				});
			} else {
				this.$api.router.push({
					route: this.$api.routesConfig.distributionApplyAgncy
				});
			}
			// #endif
			// #ifndef MP
			this.$api.router.push({
				route: this.$api.routesConfig.distributionApplyAgncy
			});
			// #endif
		},
		// 申请历史
		history() {
			this.$api.router.push({
				route: this.$api.routesConfig.distributionApplyHistory
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	background-color: #fff;
	padding: 0 30rpx;
}

.banner {
	position: relative;
	height: 320rpx;

	.image {
		position: absolute;
		top: 0;
		width: 100%;
		height: 320rpx;
	}

	.regional-info {
		position: absolute;
		top: 0;
		width: 100%;
		height: 320rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}

.tip {
	margin-top: 60rpx;
	font-size: 36rpx;
	color: #ffffff;
}

.apply {
	padding: 0 30rpx;
	background-color: #fff;
}

.card {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 20rpx;
	padding: 20rpx;
}

.head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 20rpx 0 20rpx;
}

.fixed {
	margin-top: 20rpx;
	position: fixed;
	z-index: 99;
	width: 100%;
	background-color: #fff;
	bottom: -4rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);

	.fonter-bottom {
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: env(safe-area-inset-bottom);
	}
}
</style>
