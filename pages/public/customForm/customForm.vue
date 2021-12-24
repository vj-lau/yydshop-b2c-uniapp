<template>
	<view
		class="custom-form"
		:style="{
			background:
				pageConfig.pageColorMode == 'default'
					? pageConfig.pageColor
					: pageConfig.pageLinearColor && pageConfig.pageLinearColor.color
					? pageConfig.pageLinearColor.color
					: ''
		}"
	>
		<dz-navbar-immersive
			v-if="pageConfig.isNavColor == 1"
			splitLine
			scrollRatio="0.3"
			:isCustom="true"
			@change="opacityChange"
			:scrollTop="scrollTop"
			backgroundColor="#fff"
			:style="[navbarStyle]"
		>
			<dz-navbar :title="navBarTitle"></dz-navbar>
		</dz-navbar-immersive>
		<view class="dz-relative" style="z-index: 991;">
			<dz-navbar
				:title="navBarTitle"
				:is-fixed="pageConfig.isNavColor == 0"
				:background="{ background: pageConfig.isNavColor == 0 ? '#fff' : pageConfig.navBgColor }"
				:border-bottom="false"
				:back-icon-color="pageConfig.isNavColor == 0 ? '#303133' : pageConfig.navColor"
				:title-color="pageConfig.isNavColor == 0 ? '#303133' : pageConfig.navColor"
			></dz-navbar>
		</view>
		<view v-if="pageConfig.backgroundPicture" class="custom-bg-img">
			<image
				:src="pageConfig.backgroundPicture"
				:style="{ width: '100%', height: pageConfig.isHeight == 0 ? parseInt(pageConfig.pictureHeight) * 2 + 'rpx' : parseInt(pageConfig.pictureHeight) + 'px' }"
			></image>
		</view>
		<view>
			<view
				class="dz-relative"
				style="z-index: 1"
				:style="{
					background:
						pageConfig.pageColorMode == 'default'
							? pageConfig.pageColor
							: pageConfig.pageLinearColor && pageConfig.pageLinearColor.color
							? pageConfig.pageLinearColor.color
							: ''
				}"
			>
				<view>
					<dz-form ref="mForm" :model="model" :rules="rules" :error-type="config.errorType" :label-width="config.input ? parseInt(config.input.labelWidth) * 2 : 160">
						<view v-for="(item, index) in components" :key="index">
							<!-- 标题 -->
							<view v-if="item.component == 'dz-title'" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
								<view
									:style="{
										padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx`
									}"
								>
									<dz-title
										:title="item.props.title"
										:mode="item.props.mode"
										:bar-color="item.props.barColor"
										:bar-bokeh-color="item.props.barBokehColor"
										:nameLeft="item.props.coverLeft"
										:nameRight="item.props.coverRight"
										:font-size="parseInt(item.props.fontSize) * 2"
										:barWidth="parseInt(item.props.barWidth) * 2"
										:barHeight="parseInt(item.props.barHeight) * 2"
										:bg-color="item.props.bgColor"
										:title-color="item.props.titleColor"
										:tip-config="item.props.tipConfig"
										:icon-width="parseInt(item.props.iconWidth) * 2"
										:icon-height="parseInt(item.props.iconHeight) * 2"
										:text-align="item.props.textAlign"
										:bold="item.props.bold == 1 ? true : false"
									></dz-title>
								</view>
							</view>
							<!-- 轮播图 -->
							<view v-if="item.component == 'dz-swiper'" :style="{ marginTop: `-${parseInt(item.props.pushTop) * 2}rpx` }">
								<view
									:style="{
										padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx`
									}"
								>
									<dz-swiper
										name="cover"
										:list="item.props.list"
										:border-radius="parseInt(item.props.borderRadius) * 2"
										:mode="item.props.mode"
										:height="parseInt(item.props.height) * 2"
										:indicator-pos="item.props.indicatorPos"
										:effect3d="item.props.effect3d == 1 ? true : false"
										:title="item.props.title == 1 ? true : false"
										:bgColor="item.props.bgColor"
										@click="swiperClick(index, $event)"
									></dz-swiper>
								</view>
							</view>
							<!-- 广告 -->
							<view
								v-if="item.component == 'dz-banner'"
								class="dz-relative"
								:style="{
									marginTop: `-${parseInt(item.props.pushTop) * 2}rpx`,
									padding: `${parseInt(item.props.paddingTop) * 2}rpx ${parseInt(item.props.leftRight) * 2}rpx ${parseInt(item.props.paddingBottom) * 2}rpx`
								}"
							>
								<view
									:style="{
										overflow: 'hidden',
										height: parseInt(item.props.height) * 2 + 'rpx'
									}"
								>
									<dz-image
										:src="item.props.cover"
										:borderRadius="parseInt(item.props.radius) * 2"
										:height="parseInt(item.props.height) * 2"
										@click="banner(item.props.link)"
									></dz-image>
									<block v-for="(area, areaIndex) in item.props.area" :key="areaIndex">
										<view
											class="dz-absolute"
											:style="{
												boxSizing: 'border-box',
												width: parseInt(area.width) * 2 + 'rpx',
												height: parseInt(area.height) * 2 + 'rpx',
												top: parseInt(area.top) * 2 + 'rpx',
												left: parseInt(area.left) * 2 + 'rpx'
											}"
											@tap.stop="banner(item.props.area[areaIndex].link)"
										>
											<dz-image v-if="area.cover" :src="area.cover" :width="parseInt(area.width) * 2" :height="parseInt(area.height) * 2"></dz-image>
										</view>
									</block>
								</view>
							</view>
							<view v-if="item.component == 'dz-input'" :style="[formItemStyle(item)]">
								<dz-form-item
									:label="item.label"
									:label-position="config.input.labelPosition"
									:label-align="config.input.labelAlign"
									:border-bottom="config.input.bottomBorder == 1 ? true : false"
									:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
									:prop="item.label"
								>
									<view class="dz-flex" style="width: 100%;">
										<view v-if="item.type == 'mobile'" class="dz-m-r-10" @click="openClick(index, item)">{{ mobilePattern[item.mobile_area].label }}</view>
										<dz-input
											class="dz-flex-1"
											v-model="model[item.label]"
											:type="item.type"
											:placeholder="item.placeholder"
											:border="config.input.border == 1 ? true : false"
											:disabled="item.required == 3"
											:bg-color="config.input.bgColor"
											:border-color="config.input.borderColor"
											:border-error-color="config.input.borderErrorColor"
											:rightIconColor="config.input.rightIconColor"
											:custom-style="{
												color: config.input.color
											}"
											:placeholder-style="`color: ${config.input.placeholderStyle};`"
										></dz-input>
									</view>
								</dz-form-item>
							</view>
							<view v-if="item.component == 'dz-textarea'" :style="[formItemStyle(item)]">
								<dz-form-item
									:label="item.label"
									:prop="item.label"
									:label-position="config.input.labelPosition"
									:label-align="config.input.labelAlign"
									:border-bottom="config.input.bottomBorder == 1 ? true : false"
									:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
								>
									<dz-input
										type="textarea"
										:height="parseInt(item.styleConfig.textareaHeight) * 2"
										:fixed="true"
										:disabled="item.required == 3"
										:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
										v-model="model[item.label]"
										:placeholder="item.placeholder"
										:show-word-limit="item.showWordLimit == 1 ? true : false"
										:maxlength="item.maxLength ? item.maxLength : item.minLength ? item.minLength : 140"
										:border="config.input.border == 1 ? true : false"
										:bg-color="config.input.bgColor"
										:border-color="config.input.borderColor"
										:border-error-color="config.input.borderErrorColor"
										:rightIconColor="config.input.rightIconColor"
										:custom-style="{
											color: config.input.color
										}"
										:placeholder-style="`color: ${config.input.placeholderStyle};`"
									></dz-input>
								</dz-form-item>
							</view>
							<view v-if="item.component == 'dz-radio'" :style="[formItemStyle(item)]">
								<dz-form-item
									:label="item.label"
									:label-position="config.input.labelPosition"
									:label-align="config.input.labelAlign"
									:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
									:border-bottom="config.input.bottomBorder == 1 ? true : false"
									:prop="item.label"
								>
									<dz-radio-group
										v-model="model[item.label]"
										:shape="item.styleConfig.shape"
										:size="parseInt(item.styleConfig.size) * 2"
										:width="item.styleConfig.width == 1 ? '50%' : 'auto'"
										:wrap="item.styleConfig.wrap == 1 ? true : false"
										:active-color="item.styleConfig.activeColor"
										:disabled="item.required == 3"
										@change="radioCheckboxChange(item.label, $event)"
									>
										<dz-radio v-for="(val, radioIndex) in item.list" :key="radioIndex" :name="val.name" :disabled="val.disabled">{{ val.name }}</dz-radio>
									</dz-radio-group>
								</dz-form-item>
							</view>
							<view v-if="item.component == 'dz-checkbox'" :style="[formItemStyle(item)]">
								<dz-form-item
									:label="item.label"
									:label-position="config.input.labelPosition"
									:label-align="config.input.labelAlign"
									:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
									:border-bottom="config.input.bottomBorder == 1 ? true : false"
									:prop="item.label"
								>
									<dz-checkbox-group
										:shape="item.styleConfig.shape"
										:size="parseInt(item.styleConfig.size) * 2"
										:width="item.styleConfig.width == 1 ? '50%' : 'auto'"
										:wrap="item.styleConfig.wrap == 1 ? true : false"
										:active-color="item.styleConfig.activeColor"
										:disabled="item.required == 3"
										@change="radioCheckboxChange(item.label, $event)"
									>
										<dz-checkbox
											v-for="(check, checkIndex) in item.list"
											:key="checkIndex"
											v-model="check.checked"
											:name="check.name"
											:disabled="check.disabled"
										>
											{{ check.name }}
										</dz-checkbox>
									</dz-checkbox-group>
								</dz-form-item>
							</view>
							<view v-if="item.component == 'dz-select'" :style="[formItemStyle(item)]">
								<dz-form-item
									:label="item.label"
									:label-position="config.input.labelPosition"
									:label-align="config.input.labelAlign"
									:border-bottom="config.input.bottomBorder == 1 ? true : false"
									:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
									:prop="item.label"
								>
									<dz-input
										:value="model[item.label]"
										type="select"
										:placeholder="item.placeholder"
										:border="config.input.border == 1 ? true : false"
										:bg-color="config.input.bgColor"
										:select-color="item.styleConfig.selectColor"
										:border-color="config.input.borderColor"
										:border-error-color="config.input.borderErrorColor"
										:rightIconColor="config.input.rightIconColor"
										:placeholder-style="`color: ${config.input.placeholderStyle};`"
										:selectOpen="item.isOpen"
										:custom-style="{
											color: config.input.color
										}"
										@click="openClick(index, item)"
									></dz-input>
								</dz-form-item>
							</view>
							<view v-if="item.component == 'dz-cover'" :style="[formItemStyle(item)]">
								<dz-form-item
									:label="item.label"
									:label-position="config.input.labelPosition"
									:label-align="config.input.labelAlign"
									:border-bottom="config.input.bottomBorder == 1 ? true : false"
									:required="item.required == 2 && config.input.isRequired == 1 ? true : false"
									:prop="item.label"
								>
									<view class="dz-uploader">
										<dz-upload
											:custom-btn="true"
											:action="action"
											:border-radius="parseInt(item.styleConfig.borderRadius) * 2"
											:header="header"
											:deletable="item.required != 3"
											:width="parseInt(uploadWidth(item)) * 2"
											:height="parseInt(uploadWidth(item)) * 2"
											:show-progress="false"
											:fileList="item.fileList ? item.fileList : []"
											:delBgColor="item.styleConfig.closeBgColor"
											:delColor="item.styleConfig.closeColor"
											:max-count="item.maxLength"
											@on-success="imgUploaded($event, item)"
											@on-remove="imgRemove($event, item)"
										>
											<view slot="addBtn" class="uploaderBtn" :style="[uploadStyle(item)]">
												<view
													class="dzicon-iconfont"
													:class="item.styleConfig.iconType == 1 ? 'dzicon-add' : 'dzicon-roundaddfill'"
													:style="{
														fontSize: `${parseInt(item.styleConfig.iconSize) * 2}rpx`,
														color: item.styleConfig.iconColor
													}"
												></view>
											</view>
										</dz-upload>
									</view>
								</dz-form-item>
							</view>
							<view v-if="item.component == 'dz-agreement'" :style="[formItemStyle(item)]">
								<dz-form-item :border-bottom="config.input.bottomBorder == 1 ? true : false" :prop="item.label">
									<view class="dz-flex">
										<dz-checkbox
											:value="item.value"
											:shape="item.styleConfig.shape"
											:size="parseInt(item.styleConfig.size) * 2"
											:disabled="item.required == 3"
											:active-color="item.styleConfig.activeColor"
											@change="checkboxChange(item, index, $event)"
										></dz-checkbox>
										<view
											class="dz-line-h-26"
											:class="item.styleConfig.borderBottom == 1 ? 'dz-text-underline' : ''"
											:style="{ color: item.color }"
											@tap="cellTap(item.link)"
										>
											{{ item.label ? item.label : '请填写协议' }}
										</view>
									</view>
								</dz-form-item>
							</view>
						</view>
					</dz-form>
				</view>
				<view v-if="JSON.stringify(config) != '{}' && config.buttonStyle" :style="[buttonStyle]">
					<dz-button
						hoverClass="none"
						:border="false"
						:customStyle="{
							background: config.buttonStyle.colorMode == 'default' ? config.buttonStyle.btnColor : config.buttonStyle.linearColor,
							color: config.buttonStyle.color ? config.buttonStyle.color : '#fff',
							borderRadius: `${parseInt(config.buttonStyle.borderRadius) * 2}rpx`
						}"
						@click="submit"
					>
						提交
					</dz-button>
				</view>
			</view>
		</view>
		<!-- 出生年月 -->
		<dz-picker
			v-model="dateShow"
			borderRadius="40"
			start-year="1900"
			mode="time"
			:defaultTime="defaultDateTime"
			@input="dateChenge"
			@cancel="dateCancel"
			@confirm="dateConfirm"
		></dz-picker>
		<!-- 地址选择 -->
		<dz-picker mode="region" v-model="areaShow" borderRadius="40" :areaCode="regionCode" @input="areaCancel" @cancel="areaCancel" @confirm="areaConfirm"></dz-picker>
		<!-- 自定义下拉选择 -->
		<dz-select
			mode="single-column"
			v-model="customDataShow"
			borderRadius="40"
			:list="customData"
			:default-value="[defaultIndex]"
			valueName="value"
			labelName="value"
			@input="customCancel"
			@cancel="customCancel"
			@confirm="customDataConfirm"
		></dz-select>
		<!--手机号码地区选择-->
		<dz-select
			mode="single-column"
			v-model="mobileAreaShow"
			borderRadius="40"
			:default-value="[defaultIndex]"
			:safe-area-inset-bottom="true"
			:list="mobileAreaInfo"
			@confirm="mobileAreaConfirm"
		></dz-select>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			mobilePattern: this.$api.dataConfig.mobilePattern,
			mobileAreaInfo: [],
			mobileAreaShow: false,
			scrollTop: 0,
			opacity: 0,
			navBarTitle: '',
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			id: null,
			model: {},
			rules: {},
			components: [],
			config: {
				input: {
					borderRadius: 0,
					labelPosition: 'left',
					labelAlign: 'left',
					labelWidth: 80,
					border: 0,
					bottomBorder: 1,
					isRequired: 1,
					isCard: 0,
					bgColor: '#fff',
					borderColor: '',
					bgErrorColor: '',
					borderErrorColor: '',
					rightIconColor: '#c0c4cc'
				},
				buttonStyle: {
					marginTop: 10,
					marginBottom: 10,
					marginLeftRight: 10,
					borderRadius: 20,
					color: '#fff',
					colorMode: 'default',
					btnColor: '#2979ff',
					deg: 0,
					primaryColor: '#3D4FD2',
					deputyColor: '#AC8AEB',
					linearColor: 'linear-gradient(0deg,#3D4FD2 0%,#AC8AEB 100%)'
				},
				errorType: ['message', 'border', 'toast']
			},
			pageConfig: {
				pageColorMode: 'default',
				pageColor: '#f3f4f6',
				pageLinearColor: {
					deg: 0,
					primaryColor: '#3D4FD2',
					deputyColor: '#AC8AEB'
				},
				isNavColor: 0,
				navBgColor: '#fff',
				backgroundPicture: '',
				pictureHeight: 667
			},
			activeDate: {},
			dateShow: false,
			defaultDateTime: '',
			regionCode: [],
			areaShow: false,
			customDataShow: false,
			customData: [],
			defaultIndex: 0,
			isSubmit: false,
			action: `${this.$api.appConfig.apiDomain}${this.$api.apiShop.uploadImage}`,
			header: { 'x-api-key': this.$api.store.state.accessToken },
			validate: {
				isChinese: '只能输入中文',
				isChineseTextarea: '只能输入中文',
				isEmail: '请输入正确的电子邮箱',
				isIdCard: '请输入正确的身份证号(第二代)',
				isLetter: '只能输入字母',
				isLetterTextarea: '只能输入字母',
				isEnOrNum: '只能输入字母或数字',
				isEnOrNumTextarea: '只能输入字母或数字',
				isLandline: '请输入正确的固定电话'
			}
		};
	},
	async onLoad(option) {
		await this.$onLaunched;
		if (option.code) {
			this.id = option.code;
		}
		for (let area in this.mobilePattern) {
			this.mobileAreaInfo.push({ value: area, label: this.mobilePattern[area].label });
		}
		this.getData();
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		},
		formItemStyle(val) {
			return val => {
				let style = {};
				style.backgroundColor = this.config.input.bgColor;
				style.margin = `${val.styleConfig.marginTop}px ${val.styleConfig.marginLeftRight}px ${val.styleConfig.marginBottom}px`;
				style.padding = `${val.styleConfig.paddingTopBottom}px ${val.styleConfig.paddingLeftRight}px!important`;
				style.borderRadius = this.config.input.borderRadius + 'px';
				return style;
			};
		},
		uploadStyle(val) {
			return val => {
				let style = {};
				style.width = `${parseInt(this.uploadWidth(val)) * 2}rpx`;
				style.height = `${parseInt(this.uploadWidth(val)) * 2}rpx`;
				style.border = `1px solid ${val.styleConfig.borderColor}`;
				style.backgroundColor = val.styleConfig.bgColor;
				style.borderRadius = `${val.styleConfig.borderRadius}px`;
				return style;
			};
		},
		// 按钮
		buttonStyle() {
			let style = {};
			style.padding = `${this.config.buttonStyle ? this.config.buttonStyle.marginTop : 0}px ${this.config.buttonStyle ? this.config.buttonStyle.marginLeftRight : 0}px ${
				this.config.buttonStyle ? this.config.buttonStyle.marginBottom : 0
			}px`;
			return style;
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		pageLoadingClick() {
			this.getData();
		},
		getData() {
			this.pageLoadingShow = true;
			this.$api.http
				.get(this.$api.apiShop.customForm, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					this.components = JSON.parse(res.data.component);
					this.config = res.data.params.formConfig;
					this.pageConfig = res.data.params.pageConfig;
					this.infoForm();
					this.$refs.mForm.setRules(this.rules);
					this.navBarTitle = res.data.title;
					uni.setNavigationBarTitle({
						title: this.navBarTitle
					});
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});
		},
		uploadWidth(val) {
			return (
				(systemInfo.windowWidth -
					(this.config.input.labelPosition == 'top' ? 0 : this.config.input.labelWidth) -
					42 -
					(val.styleConfig.marginLeftRight + val.styleConfig.paddingLeftRight) * 2) /
				3
			);
		},
		triggerType(type) {
			let val;
			switch (type) {
				case 'blur':
					val = 'blur';
					break;
				case 'change':
					val = 'change';
					break;
				case 'all':
					val = ['change', 'blur'];
					break;
			}
			return val;
		},
		infoForm() {
			this.model = {};
			this.rules = {};
			this.components.forEach(item => {
				if (item.label) {
					this.model[item.label] = this.model[item.label] ? this.model[item.label] : item.value;
				}

				if (item.required == 2 && item.label && !['dz-cover', 'dz-agreement'].includes(item.component)) {
					let trigger = this.triggerType(item.triggerType);
					this.rules[item.label] = [];
					let obj = {
						required: true,
						message: item.validText ? item.validText : `${item.label}不能为空`,
						trigger
					};
					if (item.component == 'dz-checkbox') {
						obj.type = 'array';
					}
					this.rules[item.label].push(obj);
					if (item.type == 'mobile' && item.mobileRegular == 'isMobile') {
						this.rules[item.label].push({
							validator: (rule, value, callback) => {
								if (value.indexOf(' ') != -1) {
									let arr = [];
									arr = value.split(' ');
									value = arr[arr.length - 1];
								}

								return this.$api.helper.isMobile(value, item.mobile_area);
							},
							message: '请输入正确的手机号',
							trigger: ['change', 'blur']
						});
					}
					if (item.minLength && !item.maxLength) {
						this.rules[item.label].push({
							min: parseInt(item.minLength),
							message: `${item.label}不能少${item.minLength}于个字`,
							trigger
						});
					}
					if (item.minLength && item.maxLength) {
						this.rules[item.label].push({
							min: parseInt(item.minLength),
							max: parseInt(item.maxLength),
							message: `${item.label}长度在${item.minLength}到${item.maxLength}个字符`,
							trigger
						});
					}
					if (item.regularType != 'default' && ['dz-input', 'dz-textarea'].includes(item.component) && ['text', 'password', 'textarea'].includes(item.type)) {
						this.rules[item.label].push({
							validator: (rule, value, callback) => {
								return this.$api.helper[item.regularType](value);
							},
							message: this.validate[item.regularType],
							trigger
						});
					}
				}
			});
		},
		// 打开日期
		openClick(index, item) {
			this.activeDate = { index, ...item };
			if (item.label) {
				switch (item.selectType) {
					case 'date':
						if (this.model[item.label]) {
							this.defaultDateTime = this.model[item.label];
						}

						this.dateShow = this.components[index].isOpen = true;
						break;
					case 'area':
						if (item.address && item.address.area_id) {
							this.regionCode = [item.address.province_id, item.address.city_id, item.address.area_id];
						}
						this.areaShow = this.components[index].isOpen = true;
						break;
					case 'customData':
						this.customData = item.list;
						this.defaultIndex = 0;
						let findIndex = this.customData.findIndex(v => v.value == this.model[item.label]);
						if (findIndex != -1) {
							this.defaultIndex = findIndex;
						}
						this.customDataShow = this.components[index].isOpen = true;
						break;
				}
				if (item.type == 'mobile') {
					this.defaultIndex = 0;
					let mobileFindIndex = this.mobileAreaInfo.findIndex(v => v.value == item.mobile_area);
					if (mobileFindIndex != -1) {
						this.defaultIndex = mobileFindIndex;
					}
					this.mobileAreaShow = true;
				}
			}
		},
		dateConfirm(e) {
			this.defaultDateTime = this.model[this.activeDate.label] = `${e.year}-${e.month}-${e.day}`;
			this.dateCancel();
		},
		dateChenge() {
			this.dateCancel();
		},
		dateCancel() {
			this.dateShow = this.components[this.activeDate.index].isOpen = false;
		},
		areaConfirm(e) {
			this.model[this.activeDate.label] = e.province.title + ' ' + e.city.title + ' ' + e.area.title;
			this.areaCancel();
		},
		areaCancel() {
			this.areaShow = this.components[this.activeDate.index].isOpen = false;
		},
		// 协议选择
		checkboxChange(val, index, e) {
			this.model[val.label] = e.value;
			this.components[index].value = e.value;
		},
		customDataConfirm(e) {
			this.model[this.activeDate.label] = e[0].value;
			this.customCancel();
		},
		customCancel() {
			this.customDataShow = this.components[this.activeDate.index].isOpen = false;
		},
		radioCheckboxChange(key, e) {
			this.model[key] = e;
		},
		mobileAreaConfirm(e) {
			this.components[this.activeDate.index].mobile_area = e[0].value;
			this.mobileAreaShow = false;
		},
		// 图片上传成功
		imgUploaded(list, item) {
			if (!this.model[item.label]) {
				this.model[item.label] = [];
			}
			this.model[item.label].push(list.data.url);
		},
		// 删除图片
		imgRemove(index, item) {
			this.model[item.label].splice(index, 1);
		},
		// 轮播图
		swiperClick(index, itemIndex) {
			const item = this.components[index].props.list[itemIndex];
			this.$api.shop.linkJump(item);
		},
		// 广告
		banner(val) {
			this.$api.shop.linkJump(val);
		},
		cellTap(val) {
			if (!val.type) return;
			let title;
			switch (val.type) {
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
					field: val.type,
					title
				}
			});
		},
		async submit() {
			if (this.isSubmit) return;
			this.isSubmit = true;
			this.$refs.mForm.validate(valid => {
				if (valid) {
					for (let i = 0; i < this.components.length; i++) {
						if (
							this.components[i].required == 1 &&
							this.components[i].label &&
							this.model[this.components[i].label] &&
							!['dz-cover', 'dz-agreement'].includes(this.components[i].component)
						) {
							if (this.components[i].type == 'mobile' && this.components[i].mobileRegular == 'isMobile') {
								if (!this.$api.helper.isMobile(this.model[this.components[i].label], this.components[i].mobile_area)) {
									this.$refs.dzToast.show({
										title: '请输入正确的手机号',
										type: 'warning'
									});
									this.isSubmit = false;
									return;
									break;
								}
							}
							if (this.components[i].minLength && !this.components[i].maxLength) {
								if (this.model[this.components[i].label].length < this.components[i].minLength) {
									this.$refs.dzToast.show({
										title: `${this.components[i].label}不能少${this.components[i].minLength}于个字`,
										type: 'warning'
									});
									this.isSubmit = false;
									return;
									break;
								}
							}
							if (this.components[i].minLength && this.components[i].maxLength) {
								if (
									this.model[this.components[i].label].length < this.components[i].minLength &&
									this.model[this.components[i].label].length < this.components[i].maxLength
								) {
									this.$refs.dzToast.show({
										title: `${this.components[i].label}长度在${this.components[i].minLength}到${this.components[i].maxLength}个字符`,
										type: 'warning'
									});
									this.isSubmit = false;
									return;
									break;
								}
							}
							if (
								this.components[i].regularType != 'default' &&
								['dz-input', 'dz-textarea'].includes(this.components[i].component) &&
								['text', 'password', 'textarea'].includes(this.components[i].type)
							) {
								if (!this.$api.helper[this.components[i].regularType](this.model[this.components[i].label])) {
									this.$refs.dzToast.show({
										title: this.validate[this.components[i].regularType],
										type: 'warning'
									});
									this.isSubmit = false;
									return;
									break;
								}
							}
						}

						if (this.components[i].component == 'dz-cover' && this.components[i].required == 2) {
							let msg = '';
							if (!this.model[this.components[i].label] || this.model[this.components[i].label].length == 0) {
								msg = this.components[i].validText ? this.components[i].validText : `${this.components[i].label}不能为空`;
							}
							// if (
							// 	(this.model[this.components[i].label] || this.model[this.components[i].label].length) &&
							// 	this.model[this.components[i].label].length
							// ) {
							// 	msg = `至少上传${this.components[i].maxLength}张图片`;
							// }
							if (msg) {
								this.$refs.dzToast.show({
									title: msg,
									type: 'warning'
								});
								this.isSubmit = false;
								return;
								break;
							}
						}

						if (this.components[i].component == 'dz-agreement' && this.components[i].required == 2 && !this.model[this.components[i].label]) {
							this.$refs.dzToast.show({
								title: this.components[i].validText ? this.components[i].validText : `请勾选${this.components[i].label}`,
								type: 'warning'
							});
							this.isSubmit = false;
							return;
							break;
						}
					}
					let keys = [];

					this.components.forEach(item => {
						if (item.type == 'mobile' && this.model[item.label]) {
							if (this.model[item.label].indexOf(' ') != -1) {
								let arr = [];
								arr = this.model[item.label].split(' ');
								this.model[item.label] = arr[arr.length - 1];
							}
							this.model[item.label] = `${this.mobilePattern[item.mobile_area].label} ${this.model[item.label]}`;
						}
						if (item.label) {
							keys.push(item.label);
						}
					});
					this.model.keys = keys;

					this.$api.http
						.post(this.$api.apiShop.customFormCreate, {
							page_id: this.id,
							content: this.model
						})
						.then(res => {
							if (this.$refs.mForm) {
								this.$refs.mForm.resetFields();
							}
							this.$refs.dzToast.show({
								title: '提交成功',
								type: 'success'
							});
							setTimeout(() => {
								let pages = getCurrentPages();
								if (pages.length == 1) {
									uni.reLaunch({
										url: this.$api.appConfig.indexPath
									});
								} else {
									uni.navigateBack();
								}
							}, 1000);
						})
						.finally(() => {
							this.isSubmit = false;
						});
				} else {
					this.isSubmit = false;
				}
			});
		}
	}
};
</script>

<style lang="scss">
page,
.custom-form {
	height: 100%;
}
.custom-form {
	position: relative;
	.custom-bg-img {
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		image {
			width: 100%;
			display: block;
			float: left;
			vertical-align: bottom;
			font-size: 0;
		}
		img {
			font-size: 0;
			width: 100%;
			display: block;
			float: left;
			vertical-align: bottom;
		}
	}
}

.dz-uploader {
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}
	.uni-uploader-body {
		margin-top: 16rpx;
	}
}

.uploaderBtn {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 10rpx;
	overflow: hidden;
	margin: 10rpx;
}
</style>
