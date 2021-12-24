<template>
	<view
		:style="{
			padding: `${parseInt(config.props.paddingTop) * 2}rpx ${parseInt(config.props.leftRight) * 2}rpx ${parseInt(config.props.paddingBottom) * 2}rpx`
		}"
	>
		<view
			class="dz-distribution"
			:style="{
				backgroundColor: config.props.bgColor,
				borderRadius: parseInt(config.props.borderRadius) * 2 + 'rpx'
			}"
		>
			<dz-cell-item
				v-if="config.props.isCellItem == 1"
				:title="config.props.title"
				:value="config.props.value"
				:arrow="config.props.arrow == 1 ? true : false"
				:title-style="{
					'font-size': parseInt(config.props.fontSize) * 2 + 'rpx',
					color: '#333',
					'font-weight': config.props.isBold == 1 ? '700' : '500'
				}"
				hover-class="none"
				:border-bottom="false"
				@tap="click"
			></dz-cell-item>

			<dz-grid :col="config.props.cell" :border="false" style="margin-top: -20rpx;" v-if="userPromoter">
				<block v-if="config.props.mode == 'warehouse'">
					<dz-grid-item v-if="config.props.warehouse[0].checked">
						<view class="dz-font-price">{{ estimateStat[0] ? estimateStat[0].warehouse.toFixed(2) : '0.00' }}</view>
						<view class="dz-font-sm">今日货款收益</view>
					</dz-grid-item>
					<dz-grid-item v-if="config.props.warehouse[1].checked">
						<view class="dz-font-price">{{ estimateStat[1] ? estimateStat[1].warehouse.toFixed(2) : '0.00' }}</view>
						<view class="dz-font-sm">本月货款收益</view>
					</dz-grid-item>
					<dz-grid-item v-if="config.props.warehouse[2].checked">
						<view>{{ userInfo && userInfo.sale_stock ? userInfo.sale_stock : 0 }}</view>
						<view class="dz-font-sm">销货笔数</view>
					</dz-grid-item>
					<dz-grid-item v-if="config.props.warehouse[3].checked">
						<view class="dz-font-price">{{ userInfo && userInfo.promoter ? userInfo.promoter.accumulate_brokerage : '0.00' }}</view>
						<view class="dz-font-sm">累计货款收益</view>
					</dz-grid-item>
				</block>
				<block v-if="config.props.mode == 'store'">
					<dz-grid-item v-if="config.props.store[0].checked">
						<view class="dz-font-price">{{ userPromoter.accumulate_brokerage || '0.00' }}</view>
						<view class="dz-font-sm dz-color-6">{{ language.profile.totalCommission }}</view>
					</dz-grid-item>
					<dz-grid-item v-if="config.props.store[1].checked">
						<view class="dz-font-price">{{ userPromoter.user_brokerage || '0.00' }}</view>
						<view class="dz-font-sm dz-color-6">{{ language.profile.leftCommission }}</view>
					</dz-grid-item>
					<dz-grid-item v-if="config.props.store[2].checked" @click="frozenCommissionClick">
						<view class="dz-font-price">{{ userPromoter.frozen_brokerage || '0.00' }}</view>
						<view class="dz-font-sm dz-color-6">
							{{ language.profile.frozenCommission }}
							<dz-icon style="margin-left:10rpx" name="questionfill" size="28"></dz-icon>
						</view>
					</dz-grid-item>
					<dz-grid-item v-if="config.props.store[3].checked">
						<view class="dz-font-price">{{ userPromoter.amount_drawn_brokerage || '0.00' }}</view>
						<view class="dz-font-sm dz-color-6">{{ language.profile.outCommission }}</view>
					</dz-grid-item>
				</block>
			</dz-grid>
			<dz-modal
				v-model="frozenCommissionModalShow"
				:title="language.application.modalTitle"
				:content="language.profile.frozenCommissionTip"
				:confirm-color="theme.dzBaseColor"
				:show-cancel-button="false"
				@confirm="frozenCommissionModalShow = false"
			></dz-modal>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		config: {
			type: Object,
			default() {
				return {};
			}
		},
		userInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		userPromoter: {
			type: Object,
			default() {
				return {};
			}
		},
		estimateStat: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			frozenCommissionModalShow: false
		};
	},
	methods: {
		click() {
			let value = this.config.props.mode == 'warehouse' ? 'cloudWarehouse' : 'distribution';
			this.$emit('click', value);
		},
		frozenCommissionClick() {
			this.frozenCommissionModalShow = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-distribution {
	overflow: hidden;
}
</style>
