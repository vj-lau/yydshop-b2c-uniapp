<template>
	<view
		class="diy-page"
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
		<view :style="[pageStyle]">
			<view v-for="(item, index) in formData" :key="index" class="dz-relative" style="z-index: 1">
				<dz-title
					:title="item.group"
					:mode="config.titleStyle.mode"
					:bar-color="config.titleStyle.barColor"
					:bar-bokeh-color="config.titleStyle.barBokehColor"
					:cover-left="config.titleStyle.coverLeft"
					:cover-right="config.titleStyle.coverRight"
					:font-size="parseInt(config.titleStyle.fontSize) * 2"
					:title-color="config.titleStyle.titleColor"
					:bar-width="parseInt(config.titleStyle.barWidth) * 2"
					:bar-height="parseInt(config.titleStyle.barHeight) * 2"
					:tip-config="config.titleStyle.tipConfig"
					:icon-width="parseInt(config.titleStyle.iconWidth) * 2"
					:icon-height="parseInt(config.titleStyle.iconHeight) * 2"
				></dz-title>
				<view :style="[formStyle]">
					<dz-form :label-width="parseInt(config.labelWidth) * 2">
						<block v-for="(form, i) in item.forms" :key="i">
							<dz-form-item
								v-if="form.textType == 'input'"
								:label="form.textField"
								:label-position="config.labelPosition"
								:label-align="config.labelAlign"
								:border-bottom="config.formIsBorder == 1 ? true : false"
								:customStyle="formItemStyle"
							>
								<view :style="[inputStyle]">
									<dz-input v-model="form.value" :placeholder="`请输入${form.textField}`" :border="config.isBorder == 0 ? false : true"></dz-input>
								</view>
							</dz-form-item>
							<dz-form-item
								v-if="form.textType == 'date'"
								:label="form.textField"
								:label-position="config.labelPosition"
								:label-align="config.labelAlign"
								:border-bottom="config.formIsBorder == 1 ? true : false"
								:customStyle="formItemStyle"
							>
								<view :style="[inputStyle]">
									<dz-input
										type="select"
										:value="form.value"
										placeholder="请选择出生日期"
										:border="config.isBorder == 0 ? false : true"
										:selectOpen="form.isOpen"
										@click="openClick(index, i)"
									></dz-input>
								</view>
							</dz-form-item>
							<!--   <dz-form-item
		                          v-if="form.textType == 'textarea'"
		                          :label="form.textField"
		                          :label-position="config.labelPosition"
		                          :label-width="config.labelWidth"
		                          :label-align="config.labelAlign"
		                          :border-bottom="
		                            config.formIsBorder == 1 ? true : false
		                          "
		                          :style="[formItemStyle]"
		                        >
		                          <view :style="[textareaStyle]">
		                            <dz-input
		                              type="textarea"
		                              :height="config.textareaHeight"
		                              :fixed="true"
		                            ></dz-input>
		                            <view
		                              v-if="config.showWordLimit == 1"
		                              class="dz-text-right dz-font-12"
		                            >
		                              0/{{ config.textareaMaxlength }}
		                            </view>
		                          </view>
		                        </dz-form-item> -->

							<!-- <dz-form-item
		                          v-if="form.textType == 'checked'"
		                          :label="form.textField"
		                          :label-position="config.labelPosition"
		                          :label-width="config.labelWidth"
		                          :label-align="config.labelAlign"
		                          :border-bottom="
		                            config.formIsBorder == 1 ? true : false
		                          "
		                          :style="[formItemStyle]"
		                        >
		                          <dz-checkbox-group
		                            :shape="config.checkedShape"
		                            :size="config.checkedSize"
		                            :width="config.checkedWidth == 0 ? 'auto' : '50%'"
		                            :wrap="config.checkedWrap == 0 ? false : true"
		                          >
		                            <dz-checkbox
		                              v-for="(check, checkIndex) in checkboxList"
		                              :key="checkIndex"
		                              v-model="check.checked"
		                              :name="check.name"
		                            >
		                              {{ check.name }}
		                            </dz-checkbox>
		                          </dz-checkbox-group>
		                        </dz-form-item> -->
							<dz-form-item
								v-if="form.textType == 'radio'"
								:label="form.textField"
								:label-position="config.labelPosition"
								:label-align="config.labelAlign"
								:border-bottom="config.formIsBorder == 1 ? true : false"
								:customStyle="formItemStyle"
							>
								<dz-radio-group
									:v-model="form.value"
									:shape="config.radioShape"
									:activeColor="config.radioActiveColor"
									:size="parseInt(config.radioSize) * 2"
									:width="config.radioWidth == 0 ? 'auto' : '50%'"
									:wrap="config.radioWrap == 0 ? false : true"
								>
									<dz-radio v-for="(radio, radioIndex) in form.textValue" :key="radioIndex" :name="radio" @change="radioChange(index, i, $event)">
										{{ radio }}
									</dz-radio>
								</dz-radio-group>
							</dz-form-item>
						</block>
					</dz-form>
				</view>
			</view>
			<view v-if="JSON.stringify(config) != '{}'" class="dz-p-t-60" :style="[buttonStyle]">
				<dz-button
					:shape="config.buttonStyle.shape"
					hoverClass="none"
					:border="false"
					:customStyle="{
						background: config.buttonStyle.colorMode == 'default' ? config.buttonStyle.btnColor : config.buttonStyle.linearColor,
						color: config.buttonStyle.color ? config.buttonStyle.color : '#fff'
					}"
					@click="submit"
				>
					提交
				</dz-button>
			</view>
		</view>
		<!-- 出生年月 -->
		<dz-picker
			v-model="dateShow"
			borderRadius="30"
			start-year="1900"
			mode="time"
			:defaultTime="defaultDateTime"
			:confirmColor="theme.dzBaseColor"
			@input="dateChenge"
			@cancel="dateCancel"
			@confirm="dateConfirm"
		></dz-picker>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
export default {
	data() {
		return {
			theme: this.$api.theme,
			scrollTop: 0,
			opacity: 0,
			navBarTitle: '',
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			id: null,
			formData: [],
			form: {},
			config: {
				formMargin: 12,
				formPadding: 10,
				formRadius: 10,
				formIsBorder: 1,
				labelPosition: 'left',
				labelAlign: 'left',
				labelWidth: 80,
				isCard: 0,
				formItemMargin: 10,
				formItemPtb: 6,
				formItemPlr: 17,
				formItemRadius: 10,
				formItemBgColor: '#fff',
				isBorder: 0,
				inputStyleType: 'border',
				inputBgColor: '#f5f5f5',
				textareaHeight: 35,
				textareaStyleType: 'border',
				isTextareaBorder: 0,
				textareaBgColor: '#f5f5f5',
				showWordLimit: 0,
				textareaMaxlength: 60,
				radioShape: 'circle',
				radioActiveColor: '#2979ff',
				radioSize: 17,
				radioWrap: 0,
				radioWidth: 0,
				checkedShape: 'square',
				checkedActiveColor: '#2979ff',
				checkedSize: 17,
				checkedWrap: 0,
				checkedWidth: 0,
				titleStyle: {
					title: '我是标题',
					mode: 'line',
					barColor: '#2979ff',
					barBokehColor: '#f3f4f6',
					coverLeft: this.defaultPicture,
					coverRight: this.defaultPicture,
					coverSize: 30,
					fontSize: 18,
					titleColor: '#333',
					barWidth: 95,
					barHeight: 8
				},
				buttonStyle: {
					shape: 'circle',
					color: '#fff',
					colorMode: 'default',
					btnColor: '#2979ff',
					deg: 0,
					primaryColor: '#3D4FD2',
					deputyColor: '#AC8AEB',
					linearColor: 'linear-gradient(0deg,#3D4FD2 0%,#AC8AEB 100%)'
				},
				pageStyle: {}
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
				pictureHeight: 667,
				pageStyle: {
					top: 10,
					leftRight: 12,
					bottom: 10
				}
			},
			activeDate: {},
			dateShow: false,
			defaultDateTime: '',
			isSubmit: false
		};
	},
	async onLoad(option) {
		await this.$onLaunched;
		if (option.code) {
			this.id = option.code;
		}
		this.getData();
	},
	onShow() {
		this.isSubmit = false;
		this.pageLoadingStatus = 'loading';
	},
	computed: {
		pageStyle() {
			let style = {};
			style.padding = `${parseInt(this.pageConfig.pageStyle.top) * 2}rpx ${parseInt(this.pageConfig.pageStyle.leftRight) * 2}rpx ${parseInt(
				this.pageConfig.pageStyle.bottom
			) * 2}rpx `;
			return style;
		},
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		},
		formStyle() {
			let style = {};
			style.backgroundColor = this.config.isCard == 1 ? '' : '#fff';
			style.margin = `${parseInt(this.config.formMargin) * 2}rpx 0`;
			style.padding = this.config.isCard == 1 ? '' : parseInt(this.config.formPadding) * 2 + 'rpx';
			style.borderRadius = this.config.isCard == 1 ? '' : parseInt(this.config.formRadius) * 2 + 'rpx';
			return style;
		},
		formItemStyle() {
			let style = {};
			if (this.config.isCard == 1) {
				style.backgroundColor = this.config.formItemBgColor;
				style.margin = parseInt(this.config.formItemMargin) * 2 + 'rpx';
				style.padding = `${parseInt(this.config.formItemPtb)}px ${parseInt(this.config.formItemPlr)}px !important`;
				style.borderRadius = parseInt(this.config.formItemRadius) * 2 + 'rpx';
			}
			return style;
		},
		// 输入框
		inputStyle() {
			let style = {};
			style.width = '100%';
			style.backgroundColor = this.config.inputStyleType == 'color' ? this.config.inputBgColor : '';
			style.borderRadius = '10rpx';
			style.padding = this.config.inputStyleType == 'color' ? '0 20rpx' : '';
			return style;
		},
		// 文本域
		textareaStyle() {
			let style = {};
			style.width = '100%';
			style.border = this.config.textareaStyleType == 'border' && this.config.isTextareaBorder == 1 ? '1px solid #dcdfe6' : '';
			style.backgroundColor = this.config.textareaStyleType == 'color' ? this.config.textareaBgColor : '';
			style.borderRadius = '5px';
			style.padding = this.config.isTextareaBorder == 1 || this.config.textareaStyleType == 'color' ? '0 10px' : '';
			return style;
		},
		// 按钮
		buttonStyle() {
			let style = {};
			style.margin = `0 ${this.config.isCard == 1 ? parseInt(this.config.formItemMargin) * 2 : 0}rpx`;
			style.zIndex = 1;
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
				.get(this.$api.apiShop.calculateIndex, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					this.navBarTitle = res.data.title;
					if (this.$api.helper.isObject(res.data.form)) {
						this.formData.push(res.data.form);
					} else {
						this.formData = res.data.form;
					}

					this.formData.forEach(item => {
						item.forms.forEach(v => {
							v.value = null;
							if (v.textType == 'date') {
								v.isOpen = false;
							}
						});
					});
					if (res.data.layout) {
						this.config = JSON.parse(res.data.layout);
						this.pageConfig = this.config.pageStyle;
						if (this.pageConfig && JSON.stringify(this.pageConfig) != '{}' && this.pageConfig.isHeight == 1) {
							this.pageConfig.pictureHeight = systemInfo.windowHeight;
						}
					}
					uni.setNavigationBarTitle({
						title: this.navBarTitle
					});
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});
		},
		// 打开日期
		openClick(index, itemIndex) {
			this.activeDate = { index, itemIndex };
			if (this.formData[index].forms[itemIndex].value) {
				this.defaultDateTime = this.formData[index].forms[itemIndex].value;
			}
			this.dateShow = this.formData[index].forms[itemIndex].isOpen = true;
		},
		dateConfirm(e) {
			this.defaultDateTime = this.formData[this.activeDate.index].forms[this.activeDate.itemIndex].value = `${e.year}-${e.month}-${e.day}`;
		},
		dateChenge() {
			this.dateCancel();
		},
		dateCancel() {
			this.dateShow = this.formData[this.activeDate.index].forms[this.activeDate.itemIndex].isOpen = false;
		},
		radioChange(index, itemIndex, e) {
			this.formData[index].forms[itemIndex].value = e;
		},
		async getIsPay() {
			let isPay = null;
			await this.$api.http
				.post(this.$api.apiShop.calculateIsPay, {
					id: this.id
				})
				.then(res => {
					isPay = res.data == 0 ? false : true;
				})
				.catch(err => {
					isPay = false;
					this.pageLoadingStatus = 'error';
				});
			return isPay;
		},
		async submit() {
			if (this.isSubmit) return;
			this.isSubmit = true;

			const params = {
				form: {},
				error: {}
			};
			this.formData.forEach(item => {
				item.forms.forEach(v => {
					params.form[v.textName] = v.value;
					params.error[v.textName] = v.textField;
				});
			});
			for (let key in params.form) {
				if (!params.form[key]) {
					this.$refs.dzToast.show({
						title: `${params.error[key]}不能为空`,
						type: 'warning'
					});
					this.isSubmit = false;
					return;
				}
			}
			let isPay = await this.getIsPay();
			if (this.pageLoadingStatus == 'error') {
				this.isSubmit = false;
				return;
			}
			if (!isPay) {
				this.isSubmit = false;
				this.$api.router.push({
					route: this.$api.routesConfig.calculatePay,
					query: {
						id: this.id,
						params: this.$api.helper.strEncode(JSON.stringify(params.form))
					}
				});
				return;
			}

			this.$api.http
				.post(this.$api.apiShop.calculateSubmit, {
					id: this.id,
					...params.form
				})
				.then(res => {
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.calculateResult
						// query: {
						// 	data: JSON.stringify(res.data)
						// }
					});
					uni.setStorageSync('calculateResult', res.data);
				})
				.finally(() => {
					this.isSubmit = false;
				});
		}
	}
};
</script>

<style lang="scss">
page,
.diy-page {
	height: 100%;
}
.diy-page {
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
</style>
