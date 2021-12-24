<template>
	<view>
		<dz-navbar input-align="center" :title="title"></dz-navbar>
		<view class="content">
			<dz-field
				class="row"
				label-width="140"
				label-align="left"
				v-model="addressData.realname"
				:borderBottom="false"
				:label="language.address.recipients"
				:placeholder="language.address.recipientsName"
				maxlength="15"
				:fieldStyle="{ width: '500rpx' }"
			></dz-field>
			<view class="row">
				<view class="nominal" style="width: 140rpx;height: 120rpx;font-size: 28rpx;">{{ language.address.phoneNumber }}</view>
				<view class="dz-flex" style="height: 120rpx;">
					<view class="dz-flex-3" @click="areaClick"><input :disabled="true" v-model="areaCodeLabel" style="font-size: 28rpx;" /></view>
					<view class="dz-flex-9">
						<dz-input type="text" v-model="addressData.mobile" :placeholder="language.address.addPhoneNumber" style="font-size: 28rpx;width: 100%;" />
					</view>
				</view>
			</view>
			<view class="row" @click="showPicker = !showPicker">
				<view class="nominal" @click="show = !show" style="width: 140rpx;font-size: 28rpx;">{{ language.address.region }}</view>
				<view class="regions">
					<text :class="{ on: address != language.address.pleaseChoose }">{{ address }}</text>
					<text class="dzicon-iconfont dzicon-right" :style="{ color: theme.dzTipsColor }"></text>
				</view>
			</view>
			<dz-field
				class="row"
				v-model="addressData.address_details"
				:borderBottom="false"
				label-width="140"
				label-align="left"
				:label="language.address.detailedAddress"
				:placeholder="language.address.addDetailedAddress"
				:fieldStyle="{ width: '500rpx' }"
			></dz-field>
			<view class="row" style="margin-top: 20rpx;">
				<view class="nominal" style="width: 140rpx;font-size: 28rpx;">{{ language.address.setDefaultAddress }}</view>
				<view class="input switch">
					<dz-switch v-model="addressData.is_default == 1 ? true : false" :active-color="theme.dzBaseColor" @change="isDefaultChange(addressData.is_default)"></dz-switch>
				</view>
			</view>
			<view class="row-flex">
				<view class="nominal nominal-flex" style="font-size: 28rpx;">
					{{ language.address.intelligentIdentification }}
					<view>
						<dz-button
							type="info"
							size="mini"
							hoverClass="none"
							:border="false"
							:customStyle="{ background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
							@click="bindArea()"
						>
							{{ language.address.letMeToIdentify }}
						</dz-button>
					</view>
				</view>
				<view class="input text-input"><textarea v-model="recognition" :placeholder="language.address.autofillContent" /></view>
			</view>
		</view>
		<view class="save">
			<dz-button
				v-if="editType == 'edit'"
				type="info"
				hoverClass="none"
				:border="false"
				:customStyle="{ background: '#fff', marginBottom: '30rpx', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
				:loading="loading"
				@click="del"
			>
				{{ language.address.delAddress }}
			</dz-button>
			<dz-button
				:border="false"
				:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '100%' }"
				hover-class="none"
				:loading="loading"
				@click="save"
			>
				{{ language.address.saveAddress }}
			</dz-button>
		</view>
		<dz-select mode="single-column" v-model="areaSelect" :safe-area-inset-bottom="true" :list="mobileAreaInfo" @confirm="areaConfirm"></dz-select>
		<dz-picker mode="region" @cancel="cancelPicker" v-model="showPicker" @confirm="pickerConfirm" :areaCode="regionCode"></dz-picker>
		<dz-modal v-model="isModal" :showCancelButton="true" @confirm="confirm" @cancel="cancel" :content="language.address.delShippingAddress"></dz-modal>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import AddressParse from '@/core/utils/zh-address-parse/address-parse.js';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			mobilePattern: this.$api.dataConfig.mobilePattern,
			mobileAreaInfo: [],
			areaSelect: false,
			areaCodeLabel: '',
			showPicker: false,
			title: '',
			id: '',
			loading: false,
			show: false,
			addressData: {
				realname: '',
				mobile_area: this.$api.store.state.lastSelectMobileArea || this.$api.appConfig.mobileArea,
				mobile: '',
				address_details: '',
				address_name: this.$api.language.address.pleaseChooseAddress,
				address: '',
				is_default: false,
				province_id: '',
				city_id: '',
				area_id: ''
			},
			editType: '',
			regionCode: [],
			address: this.$api.language.address.pleaseChoose,
			recognition: '',
			isModal: false,
			source: '',
			pageLoadingShow: false,
			pageLoadingStatus: 'loading'
		};
	},
	async onLoad(e) {
		this.editType = e.type;
		this.source = e.source;
		this.id = e.id;

		this.areaCodeLabel = this.mobilePattern[this.addressData.mobile_area].label;
		for (let area in this.mobilePattern) {
			this.mobileAreaInfo.push({ value: area, label: this.mobilePattern[area].label });
		}

		await this.$onLaunched;

		if (this.editType == 'edit') {
			this.pageLoadingShow = true;
			this.title = this.language.address.editAddress;
			this.getAddressDetail();
		} else {
			this.title = this.language.address.newReceivingAddress;
		}

		uni.setNavigationBarTitle({
			title: this.title
		});
	},
	methods: {
		pageLoadingClick() {
			this.getAddressDetail();
		},
		pickerConfirm(e) {
			this.address = e.province.title + ' ' + e.city.title + ' ' + e.area.title;
			this.addressData.province_id = e.province.id;
			this.addressData.city_id = e.city.id;
			this.addressData.area_id = e.area.id;
			this.showPicker = false;
		},
		cancelPicker() {
			this.showPicker = false;
		},
		areaClick() {
			this.areaSelect = true;
		},
		areaConfirm(e) {
			this.addressData.mobile_area = e[0].value;
			this.areaCodeLabel = e[0].label;
		},
		async getAddressDetail() {
			await this.$api.http
				.get(this.$api.apiShop.addressDetail, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					let data = res.data;
					this.address = data.address_name;
					this.addressData = data;
					this.regionCode = [data.province_id, data.city_id, data.area_id];
					this.areaCodeLabel = this.mobilePattern[this.addressData.mobile_area].label;
					setTimeout(() => {
						this.pageLoadingShow = false;
					}, 100);
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					console.log(err);
				});
		},
		// 设置默认地址
		isDefaultChange(e) {
			if (e == 1) {
				this.addressData.is_default = 0;
			} else {
				this.addressData.is_default = 1;
			}
		},
		del() {
			this.isModal = true;
		},
		confirm() {
			this.handleAddressDelete(this.id);
		},
		cancel() {
			this.isModal = false;
		},
		async handleAddressDelete(id) {
			try {
				const res = await this.$api.http.delete(
					this.$api.apiShop.addressDelete,
					{},
					{
						params: {
							id: id
						}
					}
				);
				if (res.code == this.$api.responseCode.successCode) {
					this.$refs.dzToast.show({
						title: this.$api.language.address.successfullyDelete,
						type: 'success'
					});
					uni.$emit('addressChange', {});
					setTimeout(() => {
						this.$api.router.back();
					}, 600);
				}
			} catch (e) {
				this.isModal = false;
			}
		},
		save() {
			if (this.loading) return;
			let data = this.addressData;
			if (!data.realname) {
				this.$refs.dzToast.show({
					title: this.$api.language.address.correctRealname,
					type: 'warning'
				});
				return;
			}
			if (!this.$api.helper.isMobile(data.mobile_area + data.mobile, data.mobile_area)) {
				this.$refs.dzToast.show({
					title: this.$api.language.address.correctPhoneNumber,
					type: 'warning'
				});
				return;
			}
			if (!data.address_details) {
				this.$refs.dzToast.show({
					title: this.$api.language.address.correctAddressDetails,
					type: 'warning'
				});
				return;
			}
			this.loading = true;
			if (this.editType == 'edit') {
				this.handleAddressUpdate(data);
			} else {
				this.handleAddressCreate(data);
			}
		},
		async handleAddressUpdate(data) {
			await this.$api.http
				.put(
					this.$api.apiShop.addressUpdate,
					{
						realname: data.realname,
						mobile_area: data.mobile_area,
						mobile: data.mobile,
						address_details: data.address_details,
						is_default: data.is_default,
						province_id: data.province_id,
						city_id: data.city_id,
						area_id: data.area_id
					},
					{
						params: {
							id: data.id
						}
					}
				)
				.then(res => {
					if (res.code == this.$api.responseCode.successCode) {
						this.$refs.dzToast.show({
							title: this.$api.language.address.modifySuccessfully,
							type: 'success'
						});
						setTimeout(() => {
							if (this.source) {
								uni.$emit('getAddressData', res.data);
								this.$api.router.back(2);
							} else {
								uni.$emit('addressChange', {});
								this.$api.router.back();
							}
						}, 600);
					}
				})
				.catch(() => {});
			this.loading = false;
		},
		async handleAddressCreate(data) {
			await this.$api.http
				.post(this.$api.apiShop.addressCreate, {
					realname: data.realname,
					mobile_area: data.mobile_area,
					mobile: data.mobile,
					address_details: data.address_details,
					is_default: data.is_default ? 1 : 0,
					province_id: data.province_id,
					city_id: data.city_id,
					area_id: data.area_id
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: this.$api.language.address.addressAddedSuccessfully,
						type: 'success'
					});
					setTimeout(() => {
						if (this.source) {
							uni.$emit('getAddressData', res.data);
							this.$api.router.back(2);
						} else {
							uni.$emit('addressChange', {});
							this.$api.router.back();
						}
					}, 600);
				})
				.catch(() => {});
			this.loading = false;
		},
		bindArea() {
			this.bindAreaChange();
		},
		bindAreaChange() {
			if (!this.recognition)
				return this.$refs.dzToast.show({
					title: this.$api.language.address.noContent,
					type: 'warning'
				});

			let options = {
				type: 1, // 哪种方式解析，0：正则，1：树查找
				textFilter: [], // 预清洗的字段
				nameMaxLength: 4 // 查找最大的中文名字长度
			};
			let parseResult = AddressParse(this.recognition, options);
			this.addressData.realname = parseResult.name || '';
			this.addressData.mobile = parseResult.phone || '';
			this.addressData.address_details = parseResult.detail || '';
			//获取区域
			if (parseResult.area) {
				this.regionCode[0] = parseResult.province.id;
				this.regionCode[1] = parseResult.city.id;
				this.regionCode[2] = parseResult.area.id;
				this.address = parseResult.province.title + ' ' + parseResult.city.title + ' ' + parseResult.area.title;
				this.addressData.province_id = parseResult.province.id;
				this.addressData.city_id = parseResult.city.id;
				this.addressData.area_id = parseResult.area.id;
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.save {
	margin-top: 20rpx;
	margin-bottom: 30rpx;
	width: 100%;
	padding: 0rpx 30rpx;
}

.dz-item {
	flex-direction: column;
	justify-content: center;
}

.content {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	view {
		display: flex;
	}
	margin-bottom: 80rpx;
	.row {
		width: 100%;
		background-color: #ffffff;
		height: 120rpx;
		padding: 0 3%;
		border-top: solid 1rpx $dz-border-color;
		.nominal {
			width: 130rpx;
			height: 120rpx;
			font-size: 30rpx;
			align-items: center;
			color: $dz-main-color;
		}
		.regions {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: $dz-tips-color;
			.on {
				color: $dz-main-color;
			}
		}

		.input {
			width: 620rpx;
			padding: 20rpx 0;
			align-items: center;
			.input-placeholder {
				font-size: 30rpx;
				color: $dz-tips-color;
			}
			&.switch {
				justify-content: flex-end;
			}
			.textarea {
				margin: 20rpx 0;
				min-height: 120rpx;
			}
		}
	}
	.row-flex {
		flex-direction: column;
		width: 100%;
		background-color: #ffffff;
		color: $dz-main-color;
		padding: 30rpx 3% 0;
		border-top: solid 1rpx $dz-border-color;
		.text-input {
			padding: 20rpx 0;
			height: auto;
			textarea {
				width: 100%;
				height: 160rpx;
				padding: 20rpx;
				background-color: $dz-bg-color;
				border-radius: 10rpx;
				font-size: 28rpx;
				color: $dz-tips-color;
			}
		}
		.nominal-flex {
			width: 100%;

			display: flxe;
			justify-content: space-between;
		}
	}
}
</style>
