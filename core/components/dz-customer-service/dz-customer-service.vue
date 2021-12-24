<template>
	<view
		class="dz-customer-service"
		:style="[
			{
				width: width + 'rpx',
				height: height + 'rpx',
				bottom: bottom + 'rpx',
				right: right + 'rpx',
				zIndex: zIndex
			},
			customStyle
		]"
	>
		<dz-button
			open-type="contact"
			:sessionFrom="sessionFrom"
			@click="click"
			:border="false"
			hover-class="none"
			:custom-style="{
				display: 'block',
				background: 'transparent',
				margin: '0rpx',
				padding: '0rpx',
				borderRadius: '0rpx',
				borderWidth: '0rpx',
				lineHeight: '1',
				width: width + 'rpx',
				height: height + 'rpx'
			}"
		>
			<view class="dz-customer-service__content">
				<block v-if="mode == 'icon'">
					<dz-icon @click="click" :name="icon" :custom-style="iconStyle"></dz-icon>
					<view class="dz-customer-service__content__tips">{{ tips }}</view>
				</block>
				<block v-if="mode == 'img'"><dz-image :src="cover" :width="coverWidth" :height="coverHeight" :borderRadius="radius" @click="click"></dz-image></block>
				<dz-badge type="error" size="mini" :count="customerServiceUnread" :offset="[8, 0]"></dz-badge>
			</view>
		</dz-button>
	</view>
</template>

<script>
export default {
	name: 'dz-back-top',
	props: {
		//icon-图标，img-图片
		mode: {
			type: String,
			default: 'icon'
		},
		// 自定义图标
		icon: {
			type: String,
			default: 'service'
		},
		// 提示文字
		tips: {
			type: String,
			default: ''
		},
		// 到底部的距离，单位rpx
		bottom: {
			type: [Number, String],
			default: 300
		},
		// 到右边的距离，单位rpx
		right: {
			type: [Number, String],
			default: 40
		},
		// 层级
		zIndex: {
			type: [Number, String],
			default: '9'
		},
		// 图标的样式，对象形式
		iconStyle: {
			type: Object,
			default() {
				return {
					color: '#909399',
					fontSize: '38rpx'
				};
			}
		},
		// 整个组件的样式
		customStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		//小程序客服用户信息
		sessionFrom: {
			type: String,
			default: ''
		},
		// 宽度
		width: {
			type: [Number, String],
			default: 80
		},
		// 高度
		height: {
			type: [Number, String],
			default: 80
		},
		// 图片
		cover: {
			type: String,
			default: ''
		},
		//未读数量
		customerServiceUnread: {
			type: [Number, String],
			default: '0'
		},
		// 图片宽度
		coverWidth: {
			type: [Number, String],
			default: 60
		},
		// 图片高度
		coverHeight: {
			type: [Number, String],
			default: 60
		},
		radius: {
			type: [Number, String],
			default: 7
		}
	},
	data() {
		return {};
	},
	methods: {
		click() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';

.dz-customer-service {
	width: 80rpx;
	height: 80rpx;
	position: fixed;
	z-index: 9;
	@include vue-flex;
	flex-direction: column;
	justify-content: center;
	color: $dz-content-color;
	align-items: center;

	&__content {
		@include vue-flex;
		width: 80rpx;
		height: 80rpx;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&__tips {
			font-size: 24rpx;
			transform: scale(0.8);
			line-height: 1;
		}
	}
}
</style>
