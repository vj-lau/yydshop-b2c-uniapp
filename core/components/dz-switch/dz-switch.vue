<template>
	<view class="dz-switch" :class="[value == true ? 'dz-switch--on' : '', disabled ? 'dz-switch--disabled' : '']" @tap="onClick"
	 :style="[switchStyle]">
		<view class="dz-switch__node node-class" :style="{
			width: $api.components.addUnit(this.size),
			height: $api.components.addUnit(this.size)
		}">
			<dz-loading :show="loading" class="dz-switch__loading" :size="size * 0.6" :color="loadingColor" />
		</view>
	</view>
</template>

<script>
	/**
	 * switch 开关选择器
	 * @description 选择开关一般用于只有两个选择，且只能选其一的场景。
	 * @property {Boolean} loading 是否处于加载中（默认false）
	 * @property {Boolean} disabled 是否禁用（默认false）
	 * @property {String Number} size 开关尺寸，单位rpx（默认50）
	 * @property {String} active-color 打开时的背景色（默认#2979ff）
	 * @property {Boolean} inactive-color 关闭时的背景色（默认#ffffff）
	 * @property {Boolean | Number | String} active-value 打开选择器时通过change事件发出的值（默认true）
	 * @property {Boolean | Number | String} inactive-value 关闭选择器时通过change事件发出的值（默认false）
	 * @event {Function} change 在switch打开或关闭时触发
	 * @example <dz-switch v-model="checked" active-color="red" inactive-color="#eee"></dz-switch>
	 */
	export default {
		name: "dz-switch",
		props: {
			// 是否为加载中状态
			loading: {
				type: Boolean,
				default: false
			},
			// 是否为禁用装填
			disabled: {
				type: Boolean,
				default: false
			},
			// 开关尺寸，单位rpx
			size: {
				type: [Number, String],
				default: 30
			},
			// 打开时的背景颜色
			activeColor: {
				type: String,
				default: '#2979ff'
			},
			// 关闭时的背景颜色
			inactiveColor: {
				type: String,
				default: '#F2F2F2'
			},
			// 通过v-model双向绑定的值
			value: {
				type: Boolean,
				default: false
			},
			// 是否使手机发生短促震动，目前只在iOS的微信小程序有效(2020-05-06)
			vibrateShort: {
				type: Boolean,
				default: false
			},
			// 打开选择器时的值
			activeValue: {
				type: [Number, String, Boolean],
				default: true
			},
			// 关闭选择器时的值
			inactiveValue: {
				type: [Number, String, Boolean],
				default: false
			},
		},
		data() {
			return {

			}
		},
		computed: {
			switchStyle() {
				let style = {};
				style.fontSize = this.size + 'rpx';
				style.padding = '15rpx';
				style.backgroundColor = this.value ? this.activeColor : this.inactiveColor;
				return style;
			},
			loadingColor() {
				return this.value ? this.activeColor : null;
			}
		},
		methods: {
			onClick() {
				if (!this.disabled && !this.loading) {
					// 使手机产生短促震动，微信小程序有效，APP(HX 2.6.8)和H5无效
					if(this.vibrateShort) uni.vibrateShort();
					this.$emit('input', !this.value);
					// 放到下一个生命周期，因为双向绑定的value修改父组件状态需要时间，且是异步的
					this.$nextTick(() => {
						this.$emit('change', this.value ? this.activeValue : this.inactiveValue);
					})
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../css/style.components.scss";
	
	.dz-switch {
		position: relative;
		/* #ifndef APP-NVUE */
		display: inline-block;
		/* #endif */
		box-sizing: initial;
		width: 2.5em;
		height: 1em;
		background-color: #fff;
		// border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 1em;
		transition: background-color 0.3s;
		font-size: 50rpx;
		// box-sizing: border-box;
	}

	.dz-switch__node {
		@include vue-flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		margin: 15rpx;
		top: 0;
		left: 0;
		border-radius: 100%;
		z-index: 1;
		background-color: #fff;
		box-shadow: 0 2rpx 0.5rpx 0 rgba(0, 0, 0, 0.02), 0 1rpx 1rpx 0 rgba(0, 0, 0, 0.1), 0 2rpx 2rpx 0 rgba(0, 0, 0, 0.02);
		transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
		transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05), -webkit-transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05);
		transition: transform cubic-bezier(0.3, 1.05, 0.4, 1.05);
		transition: transform 0.3s cubic-bezier(0.3, 1.05, 0.4, 1.05)
	}

	.dz-switch__loading {
		@include vue-flex;
		align-items: center;
		justify-content: center;
	}

	.dz-switch--on {
		background-color: #1989fa;
	}

	.dz-switch--on .dz-switch__node {
		transform: translateX(150%);
	}

	.dz-switch--disabled {
		opacity: 0.4;
	}
</style>
