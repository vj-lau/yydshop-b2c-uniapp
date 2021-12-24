<template>
	<view>
		<dz-navbar title="申请区域代理"></dz-navbar>
		<view class="content">
			<dz-form label-width="190">
				<dz-form-item label="申请代理级别">
					<dz-radio-group v-model="regional_level" style="padding: 20rpx;">
						<dz-radio :active-color="theme.dzBaseColor" v-for="(item, index) in manageType" :key="index" :name="item.value" @change="groupChange(item)">
							<text style="font-size: 28rpx;">{{ item.name }}</text>
						</dz-radio>
					</dz-radio-group>
				</dz-form-item>
				<dz-form-item label="申请代理区域"><dz-input @click="pickerTap" placeholder="请选择地址" v-model="address" disabled></dz-input></dz-form-item>
				<dz-form-item label="联系电话"><dz-input placeholder="请输入联系电话" maxlength="20" v-model="mobile"></dz-input></dz-form-item>
				<dz-form-item label="联系地址" :border-bottom="false"><dz-input placeholder="请输入联系地址" maxlength="140" v-model="address_details"></dz-input></dz-form-item>
			</dz-form>
		</view>
		<view class="dz-m-t-80">
			<dz-button
				:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
				:disabled="btnDisabled"
				hover-class="none"
				shape="circle"
				:border="false"
				@click="submit"
			>
				提交申请
			</dz-button>
		</view>
		<dz-picker mode="region" :params="addressParams" @cancel="cancelPicker" v-model="showPicker" @confirm="pickerConfirm"></dz-picker>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			manageType: [
				{
					value: '3',
					name: '区代'
				},
				{
					value: '2',
					name: '市代'
				},
				{
					value: '1',
					name: '省代'
				}
			],
			checked: false,
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
			list: [
				{
					name: '立即申请'
				},
				{
					name: '负责区域'
				},
				{
					name: '申请历史'
				}
			],
			current: 1,
			// 负责的区域
			territory: []
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '申请区域代理'
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
		getPromoterInfo() {
			this.loadingShow = false;
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
		pickerTap() {
			this.showPicker = !this.showPicker;
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
					if (res.code == 200) {
						this.$refs.dzToast.show({
							title: '提交成功，请等待审核',
							type: 'success'
						});
						setTimeout(() => {
							this.$api.router.push({
								route: this.$api.routesConfig.distributionApply
							});
						}, 1000);
					}
					this.isShow = false;
				});
		},
		application() {
			this.$api.router.push({
				route: this.$api.routesConfig.distributionApplyAgncy
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
</style>
