<template>
	<view>
		<dz-navbar :title="language.recharge.titleRecharge" :borderBottom="false"></dz-navbar>
		<view class="head">
			<view class="dz-p-20 dz-text-center dz-font-weight dz-font-lg" :style="{ color: theme.dzBaseColor }">账户余额：{{ userInfo.account.user_money }}</view>
			<dz-line></dz-line>
			<view v-if="rechargeQuickList.length > 0">
				<dz-row gutter="16">
					<dz-col span="4" v-for="(item, index) in rechargeQuickList" :key="index" @click="quickClick(index)">
						<!-- <view class="layout" :style="{ background: index == rechargeQuickIndex ? theme.dzBaseColor : theme.dzBaseDisabled, color: theme.dzBaseFontColor }"> -->
						<view
							class="layout"
							:style="{
								background: index == rechargeQuickIndex ? '#fff' : theme.dzBgColor,
								borderColor: index == rechargeQuickIndex ? theme.dzBaseColor : theme.dzBgColor,
								color: index == rechargeQuickIndex ? theme.dzBaseColor : '#333'
							}"
						>
							<view class="dz-font-md dz-text-center">{{ language.application.moneySymbol }}{{ item.price }}</view>
							<view class="dz-font-xs dz-text-center dz-color-9" v-if="parseFloat(item.give_price) > 0">
								赠{{ language.application.moneySymbol }}{{ item.give_price }}
							</view>
							<view class="dz-font-xs dz-text-center" v-else>无优惠</view>
						</view>
					</dz-col>
				</dz-row>
			</view>
			<view><dz-field v-model="inputAmount" label="充值金额" placeholder="请选择或者输入充值金额"></dz-field></view>
			<view class="dz-flex dz-row-center dz-p-30 dz-font-24">
				<dz-checkbox v-model="agreeCheck" shape="circle" size="30" :active-color="theme.dzBaseColor">
					<text class="dz-font-24 dz-color-9">已经阅读并且同意</text>
				</dz-checkbox>
				<text :style="{ marginLeft: '-20rpx', color: theme.dzTypePrimary }" @tap.stop="protocal('充值协议', 'recharge')">《用户充值协议》</text>
			</view>
		</view>
		<view class="pay-type-list">
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_wechatpay`]) > 0"
				:borderBottom="false"
				center
				hoverClass="none"
				:arrow="false"
				:title="language.orderPay.wechatPay"
				icon="wechat"
				iconSize="60"
				:icon-style="{ color: '#42E38D', 'margin-right': '30rpx' }"
				@click="checkboxChange(1)"
			>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 1 ? true : false" shape="circle" @change="checkboxChange(1)"></dz-checkbox>
			</dz-cell-item>
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_alipay`]) > 0"
				:borderBottom="false"
				center
				:arrow="false"
				hoverClass="none"
				:title="language.orderPay.aliPay"
				icon="alip"
				iconSize="60"
				:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
				@click="checkboxChange(2)"
			>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 2 ? true : false" shape="circle" @change="checkboxChange(2)"></dz-checkbox>
			</dz-cell-item>
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_quick`]) > 0"
				:borderBottom="false"
				center
				hoverClass="none"
				:arrow="false"
				:title="language.orderPay.quickPay"
				icon="card_fill"
				iconSize="60"
				:icon-style="{ color: '#2EAFFF', 'margin-right': '30rpx' }"
				@click="checkboxChange(8)"
			>
				<dz-tag slot="label" type="info" mode="plain" size="mini" icon="unfold" @click="choiceBankcardClick">
					{{ allinpayCardList.length > 0 ? allinpayCardList[allinpayBankcardIndex].account_number : language.orderPay.bankcardEmpty }}
				</dz-tag>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 8 ? true : false" shape="circle" @change="checkboxChange(8)"></dz-checkbox>
			</dz-cell-item>
		</view>
		<view class="footer">
			<view class="footer-btn">
				<view style="width: 90%;">
					<dz-button
						:custom-style="{ background: submitting ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						shape="circle"
						:border="false"
						:loading="submitting"
						@click="paySubmit"
					>
						{{ language.recharge.confirmPay }}
					</dz-button>
				</view>
			</view>
		</view>
		<!--通商云开户，通商云微信或支付宝支付-->
		<dz-popup v-model="allinpayUserShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayTip }}</view>
				<view class="dz-p-l-20 dz-p-r-20">
					<dz-field :label="language.orderPay.mobileLabel" v-model="allinpayAuthMobile"></dz-field>
					<dz-field :label="language.orderPay.codeLabel" v-model="allinpayAuthCode">
						<dz-button
							slot="right"
							size="mini"
							type="info"
							hover-class="none"
							:border="false"
							:custom-style="{ border: '1rpx solid rgba(0,0,0,0.12)' }"
							:disabled="waitingCaptcha"
							@click="allinpayAuthCodeSubmit"
						>
							{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
						</dz-button>
					</dz-field>
				</view>
				<dz-button
					:custom-style="{
						background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					hover-class="none"
					:border="false"
					:loading="allinpaySubmitting"
					@click="allinpayAuthSubmit"
				>
					{{ language.orderPay.authSubmitLabel }}
				</dz-button>
			</view>
		</dz-popup>
		<!--通商云开户实名绑卡，通商云快捷支付-->
		<dz-popup v-model="allinpayBindCardShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<dz-steps :active-color="theme.dzBaseColor" :list="allinpayBindCardStep" :current="allinpayBindCardStepCurrent" mode="number" icon="round_record_fill"></dz-steps>
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayTip }}</view>
				<view v-if="allinpayBindCardStepCurrent === 0">
					<view class="dz-p-l-20 dz-p-r-20">
						<dz-field :label="language.orderPay.mobileLabel" v-model="allinpayAuthMobile"></dz-field>
						<dz-field :label="language.orderPay.codeLabel" v-model="allinpayAuthCode">
							<dz-button
								slot="right"
								size="mini"
								type="info"
								hover-class="none"
								:border="false"
								:custom-style="{ border: '1rpx solid rgba(0,0,0,0.12)' }"
								:disabled="waitingCaptcha"
								@click="allinpayAuthCodeSubmit"
							>
								{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
							</dz-button>
						</dz-field>
					</view>
					<dz-button
						:custom-style="{
							background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						:loading="allinpaySubmitting"
						@click="allinpayAuthSubmit"
					>
						{{ language.orderPay.authSubmitLabel }}
					</dz-button>
				</view>
				<view v-if="allinpayBindCardStepCurrent === 1">
					<view class="dz-p-l-20 dz-p-r-20">
						<dz-field :label="language.orderPay.realnameLabel" v-model="allinpayRealname"></dz-field>
						<dz-field :label="language.orderPay.idLabel" v-model="allinpayId"></dz-field>
					</view>
					<dz-button
						:custom-style="{
							background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						:loading="allinpaySubmitting"
						@click="allinpayRealnameSubmit"
					>
						{{ language.orderPay.realnameSubmitLabel }}
					</dz-button>
				</view>
				<view v-if="allinpayBindCardStepCurrent === 2">
					<view class="dz-p-l-20 dz-p-r-20">
						<dz-form-item class="dz-p-l-10 dz-p-r-30" :label="language.orderPay.bankcardTypeLabel" label-width="130" label-align="center">
							<dz-radio-group
								slot="right"
								v-if="parseInt(payConfig.thirdparty_pay_mode) === 1 && parseInt(payConfig.order_quickpay_method) === 2"
								v-model="allinpayBankcardType"
								:active-color="theme.dzBaseColor"
							>
								<dz-radio :name="'1'">{{ language.orderPay.bankcardDepositLabel }}</dz-radio>
								<dz-radio :name="'2'">{{ language.orderPay.bankcardCreditLabel }}</dz-radio>
							</dz-radio-group>
						</dz-form-item>
						<dz-field :label="language.orderPay.realnameLabel" :disabled="true" :value="userInfo.realname"></dz-field>
						<dz-field
							:label="parseInt(allinpayBankcardType) === 1 ? language.orderPay.bankcardLabel : language.orderPay.creditCardLabel"
							:placeholder="language.orderPay.bankcardHolderLabel"
							v-model="allinpayBankcard"
						></dz-field>
						<dz-field :label="language.orderPay.bankMobileLabel" v-model="allinpayBankcardMobile"></dz-field>
						<dz-field
							v-if="parseInt(allinpayBankcardType) === 2"
							:label="language.orderPay.bankcardValidateLabel"
							:placeholder="language.orderPay.bankcardValidateHolder"
							v-model="allinpayBankcardValidate"
						></dz-field>
						<dz-field
							v-if="parseInt(allinpayBankcardType) === 2"
							:label="language.orderPay.bankcardCvvLabel"
							:placeholder="language.orderPay.bankcardCvvHolder"
							v-model="allinpayBankcardCvv"
						></dz-field>
						<dz-field :label="language.orderPay.codeLabel" v-model="allinpayBankcardCode">
							<dz-button
								slot="right"
								size="mini"
								type="info"
								hover-class="none"
								:border="false"
								:custom-style="{ border: '1rpx solid rgba(0,0,0,0.12)' }"
								:disabled="waitingCaptcha"
								@click="allinpayBindcardCodeSubmit"
							>
								{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
							</dz-button>
						</dz-field>
						<dz-form-item class="dz-p-l-10 dz-p-r-30" :label="language.orderPay.bankcardDefaultLabel" label-width="130" label-align="center">
							<dz-switch slot="right" v-model="allinpayBankcardDefault" :active-color="theme.dzBaseColor"></dz-switch>
						</dz-form-item>
					</view>
					<dz-button
						:custom-style="{
							background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						:loading="allinpaySubmitting"
						@click="allinpayBindCardSubmit"
					>
						{{ language.orderPay.bindcardSubmitLabel }}
					</dz-button>
				</view>
			</view>
		</dz-popup>
		<!--增加通商云银行卡-->
		<dz-popup v-model="allinpayAddBankcardShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayTip }}</view>
				<view class="dz-p-l-20 dz-p-r-20">
					<dz-form-item class="dz-p-l-10 dz-p-r-30" :label="language.orderPay.bankcardTypeLabel" label-width="130" label-align="center">
						<dz-radio-group
							slot="right"
							v-if="parseInt(payConfig.thirdparty_pay_mode) === 1 && parseInt(payConfig.order_quickpay_method) === 2"
							v-model="allinpayBankcardType"
							:active-color="theme.dzBaseColor"
						>
							<dz-radio :name="'1'">{{ language.orderPay.bankcardDepositLabel }}</dz-radio>
							<dz-radio :name="'2'">{{ language.orderPay.bankcardCreditLabel }}</dz-radio>
						</dz-radio-group>
					</dz-form-item>
					<dz-field :label="language.orderPay.realnameLabel" :disabled="true" :value="userInfo.realname"></dz-field>
					<dz-field
						:label="parseInt(allinpayBankcardType) === 1 ? language.orderPay.bankcardLabel : language.orderPay.creditCardLabel"
						:placeholder="language.orderPay.bankcardHolderLabel"
						v-model="allinpayBankcard"
					></dz-field>
					<dz-field :label="language.orderPay.bankMobileLabel" v-model="allinpayBankcardMobile"></dz-field>
					<dz-field
						v-if="parseInt(allinpayBankcardType) === 2"
						:label="language.orderPay.bankcardValidateLabel"
						:placeholder="language.orderPay.bankcardValidateHolder"
						v-model="allinpayBankcardValidate"
					></dz-field>
					<dz-field
						v-if="parseInt(allinpayBankcardType) === 2"
						:label="language.orderPay.bankcardCvvLabel"
						:placeholder="language.orderPay.bankcardCvvHolder"
						v-model="allinpayBankcardCvv"
					></dz-field>
					<dz-field :label="language.orderPay.codeLabel" v-model="allinpayBankcardCode">
						<dz-button
							slot="right"
							size="mini"
							type="info"
							hover-class="none"
							:border="false"
							:custom-style="{ border: '1rpx solid rgba(0,0,0,0.12)' }"
							:disabled="waitingCaptcha"
							@click="allinpayBindcardCodeSubmit"
						>
							{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
						</dz-button>
					</dz-field>
					<dz-form-item class="dz-p-l-10 dz-p-r-30" :label="language.orderPay.bankcardDefaultLabel" label-width="130" label-align="center">
						<dz-switch slot="right" v-model="allinpayBankcardDefault" :active-color="theme.dzBaseColor"></dz-switch>
					</dz-form-item>
				</view>
				<dz-button
					:custom-style="{
						background: allinpaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					hover-class="none"
					:border="false"
					:loading="allinpaySubmitting"
					@click="allinpayBindCardSubmit"
				>
					{{ language.orderPay.bindcardSubmitLabel }}
				</dz-button>
			</view>
		</dz-popup>
		<!--通商云银行卡列表-->
		<dz-popup :closeable="true" :safe-area-inset-bottom="true" v-model="allinpayBankcardListShow" mode="center" border-radius="30" width="90%">
			<view class="bankcardList">
				<view class="bankcardTip">{{ language.orderPay.choiceBankcard }}</view>
				<dz-cell-item v-for="(item, index) in allinpayCardList" :key="index" :index="index" @click="allinpayPayCardChange" :border-bottom="true">
					<view slot="title">
						{{ item.bank_name }}
						<dz-tag class="dz-m-l-10" v-if="parseInt(item.is_default_pay) === 1">{{ language.orderPay.bankcardDefaultLabel }}</dz-tag>
					</view>
					<view slot="label">{{ item.account_number }}</view>
				</dz-cell-item>
				<view class="dz-p-40 dz-text-center" v-if="allinpayCardList.length === 0">{{ language.orderPay.bankcardEmpty }}</view>
				<dz-button
					:custom-style="{
						background: allinpayBankcardAddClick ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '30rpx'
					}"
					hover-class="none"
					:border="false"
					@click="allinpayBankcardAddClick"
				>
					{{ language.orderPay.bankcardAdd }}
				</dz-button>
			</view>
		</dz-popup>
		<!--通商云绑卡支付-->
		<dz-popup v-model="allinpayBankcardPayShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.bankcardSendCodeTip }}</view>
				<view class="dz-p-l-20 dz-p-r-20">
					<dz-field :label="language.orderPay.realnameLabel" :disabled="true" :value="userInfo.realname"></dz-field>
					<dz-field :label="language.orderPay.bankcardLabel" :disabled="true" :value="allinpayBankCardItem.account_number"></dz-field>
					<dz-field :label="language.orderPay.bankMobileLabel" :disabled="true" :value="$api.helper.maskCode(allinpayBankCardItem.mobile)"></dz-field>
					<dz-field :label="language.orderPay.codeLabel" v-model="allinpayBankCardPayCode"></dz-field>
				</view>
				<dz-button
					:custom-style="{
						background: allinpayBankCardPaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					hover-class="none"
					:border="false"
					:loading="allinpayBankCardPaySubmitting"
					@click="allinpayBindCardPaySubmit"
				>
					{{ language.orderPay.bankcardPaySubmit }}
				</dz-button>
			</view>
		</dz-popup>
		<!--点击唤起支付宝-->
		<dz-popup v-model="allinpaySchemeShow" mode="center" width="90%" border-radius="30" :closeable="true">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">点击下方按钮打开支付宝</view>
				<a target="_blank" class="link" :href="allinpaySchemeAlipay" @tap="allinpaySchemeAlipayClick">
					<dz-button
						:custom-style="{
							background: theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						@click="allinpaySchemeAlipayClick"
					>
						打开支付宝
					</dz-button>
				</a>
			</view>
		</dz-popup>
		<!--支付宝支付确认-->
		<dz-popup v-model="allinpayAliPayShow" mode="center" width="90%" border-radius="30" :closeable="true">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayAlipayTip }}</view>
				<dz-button
					:custom-style="{
						background: allinpayBankCardPaySubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					:border="false"
					hover-class="none"
					:loading="allinpayBankCardPaySubmitting"
					@click="getPayResult()"
				>
					{{ language.orderPay.allinpayAlipayConfirm }}
				</dz-button>
			</view>
		</dz-popup>
		<!--modal提示-->
		<dz-modal
			v-model="allinpayUserModalShow"
			:title="language.application.modalTitle"
			:content="language.orderPay.allinpayAuthContent"
			:confirm-text="language.orderPay.allinpayAuthConfirmContent"
			:confirm-color="theme.dzBaseColor"
			@confirm="allinpayAuthConfirm"
		></dz-modal>
		<dz-modal
			v-model="allinpayBindCardModalShow"
			:title="language.application.modalTitle"
			:content="language.orderPay.allinpayBindcardContent"
			:confirm-text="language.orderPay.allinpayBindcardConfirmContent"
			:confirm-color="theme.dzBaseColor"
			@confirm="allinpayBindcardConfirm"
		></dz-modal>
		<!--通商云E+开户提示-->
		<dz-modal
			v-model="allinpayEplusUserModalShow"
			:title="language.application.modalTitle"
			:content="language.orderPay.allinpayAuthContent"
			:confirm-text="language.orderPay.allinpayAuthConfirmContent"
			:confirm-color="theme.dzBaseColor"
			@confirm="allinpayEplusAuthConfirm"
		></dz-modal>
		<!--通商云E+开户，通商云微信或支付宝支付-->
		<dz-popup v-model="allinpayEplusUserShow" mode="center" width="90%" border-radius="30">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayTip }}</view>
				<view class="dz-p-l-20 dz-p-r-20">
					<dz-field :label="language.orderPay.mobileLabel" v-model="allinpayEplusAuthMobile"></dz-field>
					<dz-field :label="language.orderPay.codeLabel" v-model="allinpayEplusAuthCode">
						<dz-button
							slot="right"
							size="mini"
							type="info"
							hover-class="none"
							:border="false"
							:custom-style="{ border: '1rpx solid rgba(0,0,0,0.12)' }"
							:disabled="waitingCaptcha"
							@click="allinpayEplusAuthCodeSubmit"
						>
							{{ waitingCaptcha ? $api.helper.formatString(language.orderPay.getCodeLater, waitingSecond) : language.orderPay.getCode }}
						</dz-button>
					</dz-field>
				</view>
				<dz-button
					:custom-style="{
						background: allinpayEplusSubmitting ? theme.dzBaseDisabled : theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					hover-class="none"
					:border="false"
					:loading="allinpayEplusSubmitting"
					@click="allinpayEplusAuthSubmit"
				>
					{{ language.orderPay.authSubmitLabel }}
				</dz-button>
			</view>
		</dz-popup>
		<!--通商云E+唤起支付宝-->
		<dz-popup v-model="allinpayEplusSchemeShow" mode="center" width="90%" border-radius="30" :closeable="true">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">点击下方按钮打开支付宝</view>
				<a target="_blank" class="link" :href="allinpayEplusSchemeAlipay" @tap="allinpayEplusSchemeAlipayClick">
					<dz-button
						:custom-style="{
							background: theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							marginTop: '50rpx',
							marginLeft: '20rpx',
							marginRight: '20rpx'
						}"
						hover-class="none"
						:border="false"
						@click="allinpayEplusSchemeAlipayClick"
					>
						打开支付宝
					</dz-button>
				</a>
			</view>
		</dz-popup>
		<!--支付宝支付确认E+-->
		<dz-popup v-model="allinpayEplusAliPayShow" mode="center" width="90%" border-radius="30" :closeable="true">
			<view class="dz-p-t-40 dz-p-b-40 dz-p-l-20 dz-p-r-20">
				<view class="dz-text-center dz-font-24 dz-p-30 dz-tips-color">{{ language.orderPay.allinpayAlipayTip }}</view>
				<dz-button
					:custom-style="{
						background: theme.dzBaseColor,
						color: theme.dzBaseFontColor,
						marginTop: '50rpx',
						marginLeft: '20rpx',
						marginRight: '20rpx'
					}"
					hover-class="none"
					:border="false"
					@click="getPayResult()"
				>
					{{ language.orderPay.allinpayAlipayConfirm }}
				</dz-button>
			</view>
		</dz-popup>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
/**
 * ***********************************************************************************
 * 所有支付页面必须引入mixin,pay.js
 * ***********************************************************************************
 */
import pay from '@/core/utils/mixin/pay.js';
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
	mixins: [pay],
	data() {
		return {
			rechargeQuickList: [], //快捷充值列表
			rechargeQuickIndex: -1, //快捷充值选择索引
			inputAmount: '',
			inputAmountGive: '',
			rechargeMoney: 0,
			agreeCheck: true
		};
	},
	async onLoad(e) {
		this.orderGroup = 'recharge';
		this.rechargeMoney = e.recharge;
		this.apiUrl = this.$api.apiShop.payCreate;
	},
	onShow() {},
	methods: {
		//协议
		protocal(title, field) {
			this.$api.router.push({
				route: this.$api.routesConfig.aboutProtocol,
				query: {
					title,
					field
				}
			});
		},
		//充值选择
		quickClick(index, item) {
			this.rechargeQuickIndex = index;
			this.inputAmount = this.rechargeQuickList[index].price;
			this.inputAmountGive = this.rechargeQuickList[index].give_price;
		},
		async initOrder() {
			// 获取快捷充值列表
			await this.$api.http
				.get(this.$api.apiShop.rechargeConfigIndex)
				.then(res => {
					this.rechargeQuickList = res.data;
					if (this.rechargeQuickList.length > 0) {
						this.rechargeQuickIndex = 0;
						this.inputAmount = this.rechargeQuickList[0].price;
						this.inputAmountGive = this.rechargeQuickList[0].give_price;
					}
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
					return;
				});
			this.pageLoadingShow = false;
			if (this.auto && this.auto == 'wechat') {
				this.checkType = 1;
				this.paySubmit();
			}
		},
		//支付提交
		paySubmit() {
			if (!this.agreeCheck) {
				this.$refs.dzToast.show({
					title: '请仔细阅读并勾选用户充值协议',
					type: 'warning'
				});
				return;
			}
			if (this.submitting) {
				return;
			}
			if (!this.$api.helper.isNumber(this.inputAmount)) {
				this.$refs.dzToast.show({
					title: '请输入正确充值金额',
					type: 'warning'
				});
				return;
			}
			if (parseFloat(this.inputAmount) <= 0) {
				this.$refs.dzToast.show({
					title: '请输入正确充值金额',
					type: 'warning'
				});
				return;
			}
			if (this.checkType <= 0) {
				this.$refs.dzToast.show({
					title: '请选择支付方式',
					type: 'warning'
				});
				return;
			}
			this.submitting = true;
			this.orderInfo.money = parseFloat(this.inputAmount);
			this.wxAutoParam = { recharge: this.inputAmount };
			this.submitQuery = {
				id: this.id,
				orderGroup: this.orderGroup
			};
			if (this.checkType === 8) {
				//快捷支付
				this.quickPaySubmit();
			} else if (this.checkType === 1) {
				//微信支付
				this.wechatPaySubmit();
			} else if (this.checkType === 2) {
				//支付宝支付
				this.aliPaySubmit();
			}
		},
		//收银台支付返回路径
		returnPath() {
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			url = `${domain}${this.$api.routesConfig.payComplete.path}?type=recharge`;
			return url;
		}
	}
};
</script>

<style lang="scss" scoped>
.head {
	background-color: #ffffff;
	margin: 24rpx;
	padding: 10rpx 20rpx;
	border-radius: 20rpx;
}
.layout {
	margin: 20rpx 0;
	padding: 10rpx;
	border-radius: 20rpx;
	border: 1rpx solid #fff;
}
.pay-type-list {
	background-color: #ffffff;
	margin: 24rpx;
	padding: 10rpx 0;
	border-radius: 20rpx;
	overflow: hidden;
}
.footer {
	width: 100%;
	position: fixed;
	z-index: 99;
	background-color: #fff;
	bottom: 0;
}
.footer-btn {
	width: 100%;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: env(safe-area-inset-bottom);
}
.bankcardList {
	padding: 30rpx;
}
.bankcardTip {
	padding-bottom: 20rpx;
}
.link {
	text-decoration: none;
}
</style>
