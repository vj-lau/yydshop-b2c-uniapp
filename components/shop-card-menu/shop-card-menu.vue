<template>
	<view
		:style="{
			padding: `${parseInt(config.props.paddingTop) * 2}rpx ${parseInt(config.props.leftRight) * 2}rpx ${parseInt(config.props.paddingBottom) * 2}rpx`
		}"
	>
		<view
			class="dz-card"
			:style="{
				backgroundColor: config.props.bgColor,
				borderRadius: config.props.borderRadius + 'px'
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
				:border-bottom="false"
				hover-class="none"
				@click="cellClick"
			></dz-cell-item>
			<view :style="{ marginTop: `-${parseInt(config.props.menuPushTop) * 2}rpx` }">
				<dz-grid-menu
					:list="config.props.list"
					name="cover"
					title="cate_title"
					page="my"
					:col="config.props.col"
					:isPage="config.props.isPage == 1 ? true : false"
					:is-name="config.props.isName == 1 ? true : false"
					:width-height="parseInt(config.props.widthHeight) * 2"
					:border-radius="parseInt(config.props.menuRadius) * 2"
					:radius="parseInt(config.props.radius) * 2"
					:bgColor="config.props.bgColor"
					:border="false"
					:dot-color="config.props.dotColor"
					:mode="config.props.mode"
					:colNum="config.props.colNum"
					:customerServiceUnread="customerServiceUnread"
					:customerService="customerService"
					:sessionFrom="sessionFrom"
					@click="gridClick"
				></dz-grid-menu>
			</view>
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
		// 是否显示小程序客服
		customerService: {
			type: Boolean,
			default: false
		},
		// 小程序客服用户信息
		sessionFrom: {
			type: String,
			default: ''
		},
		// 小程序客服未读数量
		customerServiceUnread: {
			type: [Number, String],
			default: 0
		}
	},
	methods: {
		gridClick(index) {
			this.$emit('click', index);
		},
		cellClick() {
			this.$emit('cellClick', this.config.props.titleLink);
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-card {
	position: relative;
	overflow: hidden;
}
</style>
