<template>
	<view>
		<dz-navbar :title="language.orderPay.titleOrderPay" :borderBottom="false"></dz-navbar>
		<view class="price-box" :style="{ color: theme.dzBaseColor }">
			<view class="price">{{ language.application.moneySymbol }}{{ money }}</view>
			<view class="time" v-if="parseInt(orderDetail.order_status) !== 1 && parseInt(orderDetail.close_left_time) > 0">
				{{ language.orderPay.payLeftTime }}
				<dz-count-down
					class="dz-m-l-10"
					:timestamp="orderDetail.close_left_time"
					:show-days="false"
					:color="theme.dzBaseColor"
					:separator-color="theme.dzBaseColor"
					:bg-color="'transparent'"
					@end="orderEnd"
				></dz-count-down>
			</view>
		</view>
		<view class="pay-type-list">
			<!--微信支付-->
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
			<!--支付宝支付-->
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
			<!--快捷支付-->
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
			<!-- 余额支付 -->
			<dz-cell-item
				v-if="parseInt(payConfig[`pay_${payGroup}_balance`]) === 1"
				:borderBottom="false"
				center
				hoverClass="none"
				:title="language.orderPay.balancePay"
				:arrow="false"
				icon="commission"
				iconSize="60"
				:icon-style="{ color: '#FDC561', 'margin-right': '30rpx' }"
				@click="checkboxChange(5)"
			>
				<view slot="label">
					<text>{{ $api.helper.formatString(language.orderPay.userBalance, userInfo.account.user_money) }}</text>
					<text @tap="rechargeClick" class="dz-m-l-10" style="color: #2979ff;" v-if="parseInt(shopSetting.is_open_recharge) === 1">{{ language.orderPay.recharge }}</text>
				</view>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 5 ? true : false" shape="circle" @change="checkboxChange(5)"></dz-checkbox>
			</dz-cell-item>
			<!--佣金支付-->
			<dz-cell-item
				v-if="
					parseInt(payConfig[`pay_${payGroup}_brokerage`]) === 1 &&
						userInfo.promoter &&
						(userInfo.promoter.promoterFission || userInfo.promoter.promoterRegional || userInfo.promoter.promoterStore || userInfo.promoter.promoterWarehouse)
				"
				center
				:title="userInfo.promoter.promoterWarehouse ? '货款支付' : language.orderPay.brokeragePay"
				:label="
					userInfo.promoter && userInfo.promoter.user_brokerage
						? $api.helper.formatString(
								userInfo.promoter.promoterWarehouse ? language.orderPay.userWarehouseBrokerage : language.orderPay.userBrokerage,
								userInfo.promoter.user_brokerage
						  )
						: $api.helper.formatString(userInfo.promoter.promoterWarehouse ? language.orderPay.userWarehouseBrokerage : language.orderPay.userBrokerage, '0.00')
				"
				icon="balance"
				hoverClass="none"
				iconSize="60"
				:icon-style="{ color: '#FFC43F', 'margin-right': '30rpx' }"
				:border-bottom="false"
				:arrow="false"
				@click="checkboxChange(7)"
			>
				<dz-checkbox :active-color="theme.dzBaseColor" :value="checkType === 7 ? true : false" shape="circle" @change="checkboxChange(7)"></dz-checkbox>
			</dz-cell-item>
		</view>
		<view class="footer">
			<view class="footer-btn">
				<view style="width: 90%;">
					<dz-button
						:custom-style="{
							background: parseInt(orderDetail.order_status) !== 0 || parseInt(orderDetail.close_left_time || submitting) <= 0 ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor
						}"
						hover-class="none"
						shape="circle"
						:border="false"
						:loading="submitting"
						@click="paySubmit"
						:disabled="parseInt(orderDetail.order_status) !== 0 || parseInt(orderDetail.close_left_time) <= 0"
					>
						{{ language.orderPay.confirmPay + language.application.moneySymbol + money }}
					</dz-button>
				</view>
			</view>
		</view>
		<!--通商云认证提示-->
		<dz-modal
			v-model="allinpayUserModalShow"
			:title="language.application.modalTitle"
			:content="language.orderPay.allinpayAuthContent"
			:confirm-text="language.orderPay.allinpayAuthConfirmContent"
			:confirm-color="theme.dzBaseColor"
			@confirm="allinpayAuthConfirm"
		></dz-modal>
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
		<!--通商云绑卡提示-->
		<dz-modal
			v-model="allinpayBindCardModalShow"
			:title="language.application.modalTitle"
			:content="language.orderPay.allinpayBindcardContent"
			:confirm-text="language.orderPay.allinpayBindcardConfirmContent"
			:confirm-color="theme.dzBaseColor"
			@confirm="allinpayBindcardConfirm"
		></dz-modal>
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
						border="false"
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
								v-if="parseInt(payConfig[`pay_${this.payGroup}_quick`]) === 1 && parseInt(payConfig.order_quickpay_method) === 2"
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
							v-if="parseInt(payConfig[`pay_${this.payGroup}_quick`]) === 1 && parseInt(payConfig.order_quickpay_method) === 2"
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
						background: theme.dzBaseColor,
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
		<!--通商云唤起支付宝-->
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
		<!--通商云支付宝支付确认-->
		<dz-popup v-model="allinpayAliPayShow" mode="center" width="90%" border-radius="30" :closeable="true">
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
			orderDetail: {},
		};
	},
	async onLoad(e) {
		this.orderGroup = e.orderGroup || 'order';
		this.apiUrl = this.$api.apiShop.payCreate;
		console.log('page loaded');
	},
	onShow() {
		
	},
	methods: {
		//获取订单信息
		async initOrder() {
			if (this.orderGroup == 'order') {
				await this.$api.http
					.get(this.$api.apiShop.orderDetail, {
						params: {
							id: this.id,
							simplify: 1
						}
					})
					.then(res => {
						this.orderDetail = res.data;
						this.money = res.data.pay_money;
					})
					.catch(err => {
						this.pageLoadingStatus = 'error';
						return;
					});
			} else {
				await this.$api.http
					.get(this.$api.apiDistribution.orderView, {
						params: {
							id: this.id
						}
					})
					.then(res => {
						this.orderDetail = res.data;
						this.money = res.data.pay_money;
					})
					.catch(err => {
						this.pageLoadingStatus = 'error';
						return;
					});
			}
			this.pageLoadingShow = false;
			if (this.auto && this.auto == 'wechat') {
				this.checkType = 1;
				this.paySubmit();
			}
		},
		//倒计时结束
		async orderEnd(e) {
			this.initData();
		},
		//支付提交
		paySubmit() {
			console.log('paysubmit');
			if (this.submitting) {
				console.log('paysubmit return');
				return;
			}
			if (parseInt(this.orderDetail.order_status) !== 0 || parseInt(this.orderDetail.close_left_time) <= 0) {
				console.log('order closed and paysubmit return');
				return;
			}
			if (this.checkType <= 0) {
				this.$refs.dzToast.show({
					title: this.$api.language.orderPay.payTypeError,
					type: 'warning'
				});
				return;
			}
			this.submitting = true;
			this.orderInfo.order_id = this.id;
			this.orderInfo.member_id = this.userInfo.id;
			this.submitQuery = {
				id: this.id,
				type: this.type,
				wholesale_id: this.orderDetail.wholesale_id,
				orderGroup: this.orderGroup == 'order' ? '' : this.orderGroup
			};
			this.wxAutoParam = {
				id: this.id, 
				type: this.type
			};
			if (this.checkType === 5) {
				//余额支付
				this.balancePaySubmit();
			} else if (this.checkType === 7) {
				//佣金支付
				this.brokeragePaySubmit();
			} else if (this.checkType === 8) {
				//快捷支付
				this.quickPaySubmit();
			} else if (this.checkType === 1) {
				//微信支付
				console.log('wechatPaySubmit');
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
			url = `${domain}${this.$api.routesConfig.payComplete.path}?id=${this.id}&type=${this.type}&wholesale_id=${this.orderDetail.wholesale_id}&orderGroup=${this.orderGroup}`;
			return url;
		}
	}
};
</script>

<style lang="scss" scoped>
.price-box {
	margin: 80rpx 0 60rpx;
	text-align: center;
	.price {
		font-size: 60rpx;
		font-weight: 700;
	}
	.tip {
		font-size: 24rpx;
	}
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
