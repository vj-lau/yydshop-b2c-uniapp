<template>
	<view class="dz-empty" v-if="show" :style="{
		marginTop: marginTop + 'rpx'
	}" @tap.stop="emptyTab">
		<dz-icon
			:name="src ? src : name"
			:custom-style="iconStyle"
			:label="text"
			label-pos="bottom"
			:label-color="color"
			:label-size="fontSize"
			:size="iconSize"
			:color="iconColor"
			margin-top="14"
		></dz-icon>
		<view class="dz-slot-wrap">
			<slot name="bottom"></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * empty 内容为空
	 * @description 该组件用于需要加载内容，但是加载的第一页数据就为空，提示一个"没有内容"的场景。
	 * @property {String} color 文字颜色（默认#c0c4cc）
	 * @property {String} text 文字提示（默认“无内容”）
	 * @property {String} src 自定义图标路径，如定义，name参数会失效
	 * @property {String Number} font-size 提示文字的大小，单位rpx（默认28）
	 * @property {String} mode 内置的图标（默认data）
	 * @property {String Number} img-width 图标的宽度，单位rpx（默认240）
	 * @property {String} img-height 图标的高度，单位rpx（默认auto）
	 * @property {String Number} margin-top 组件距离上一个元素之间的距离（默认0）
	 * @property {Boolean} show 是否显示组件（默认true）
	 * @event {Function} click 点击组件时触发
	 * @example <dz-empty text="所谓伊人，在水一方" mode="list"></dz-empty>
	 */
	export default {
		name: "dz-empty",
		props: {
			// 图标路径
			src: {
				type: String,
				default: ''
			},
			// 提示文字
			text: {
				type: String,
				default: '还没有内容呢~'
			},
			// 文字颜色
			color: {
				type: String,
				default: '#c0c4cc'
			},
			// 图标的颜色
			iconColor: {
				type: String,
				default: '#c0c4cc'
			},
			// 图标的大小
			iconSize: {
				type: [String, Number],
				default: 120
			},
			// 文字大小，单位rpx
			fontSize: {
				type: [String, Number],
				default: 26
			},
			// 选择预置的图标类型
			name: {
				type: String,
				default: 'empty'
			},
			//  图标宽度，单位rpx
			imgWidth: {
				type: [String, Number],
				default: 120
			},
			// 图标高度，单位rpx
			imgHeight: {
				type: [String, Number],
				default: 'auto'
			},
			// 是否显示组件
			show: {
				type: Boolean,
				default: true
			},
			// 组件距离上一个元素之间的距离
			marginTop: {
				type: [String, Number],
				default: 0
			},
			iconStyle: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods:{
			emptyTab(){
				this.$emit('click');
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../css/style.components.scss";

	.dz-empty {
		@include vue-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.dz-image {
		margin-bottom: 20rpx;
	}

	.dz-slot-wrap {
		@include vue-flex;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
	}
</style>
