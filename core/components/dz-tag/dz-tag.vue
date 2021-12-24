<template>
	<view v-if="show" :class="[
		disabled ? 'dz-disabled' : '',
		'dz-size-' + size,
		'dz-shape-' + shape,
		'dz-mode-' + mode + '-' + type
	]"
	 class="dz-tag" :style="[customStyle]" @tap="clickTag">
		{{text}}
		<slot />
		<view class="dz-icon-wrap" @tap.stop>
			<dz-icon @click="close" size="22" v-if="closeable" :color="closeIconColor" 
			name="close" class="dz-close-icon" :style="[iconStyle]"></dz-icon>
		</view>
		<view class="dz-icon-wrap" v-if="!closeable && icon">
			<dz-icon :name="icon" class="dz-right-icon" :style="[iconStyle]"></dz-icon>
		</view>
	</view>
</template>

<script>
	/**
	 * tag 提示
	 * @description 该组件一般用于标记和选择
	 * @property {String} type 主题类型（默认primary）
	 * @property {String} size 标签大小（默认default）
	 * @property {String} shape 标签形状（默认square）
	 * @property {String} text 标签的文字内容
	 * @property {String} bg-color 自定义标签的背景颜色
	 * @property {String} border-color 标签的边框颜色
	 * @property {String} close-color 关闭按钮的颜色
	 * @property {String Number} index 点击标签时，会通过click事件返回该值
	 * @property {String} mode 模式选择，见官网说明（默认light）
	 * @property {Boolean} closeable 是否可关闭，设置为true，文字右边会出现一个关闭图标（默认false）
	 * @property {Boolean} show 标签显示与否（默认true）
	 * @property {String} icon 右侧自定义图标，如果显示关闭图标，则不显示
	 * @event {Function} click 点击标签触发
	 * @event {Function} close closeable为true时，点击标签关闭按钮触发
	 * @example <dz-tag text="雪月夜" type="success" />
	 */
	export default {
		name: 'dz-tag',
		// 是否禁用这个标签，禁用的话，会屏蔽点击事件
		props: {
			// 标签类型info、primary、success、warning、error
			type: {
				type: String,
				default: 'primary'
			},
			disabled: {
				type: [Boolean, String],
				default: false
			},
			// 标签的大小，分为default（默认），mini（较小）
			size: {
				type: String,
				default: 'default'
			},
			// tag的形状，circle（两边半圆形）, square（方形，带圆角），circleLeft（左边是半圆），circleRight（右边是半圆）
			shape: {
				type: String,
				default: 'square'
			},
			// 标签文字
			text: {
				type: [String, Number],
				default: ''
			},
			// 背景颜色，默认为空字符串，即不处理
			bgColor: {
				type: String,
				default: ''
			},
			// 标签字体颜色，默认为空字符串，即不处理
			color: {
				type: String,
				default: ''
			},
			// 镂空形式标签的边框颜色
			borderColor: {
				type: String,
				default: ''
			},
			// 关闭按钮图标的颜色
			closeColor: {
				type: String,
				default: ''
			},
			// 点击时返回的索引值，用于区分例遍的数组哪个元素被点击了
			index: {
				type: [Number, String],
				default: ''
			},
			// 模式选择，dark|light|plain
			mode: {
				type: String,
				default: 'light'
			},
			// 是否可关闭
			closeable: {
				type: Boolean,
				default: false
			},
			// 是否显示
			show: {
				type: Boolean,
				default: true
			},
			icon:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				
			}
		},
		computed: {
			customStyle() {
				let style = {};
				// 文字颜色（如果有此值，会覆盖type值的颜色）
				if(this.color) style.color = this.color;
				// tag的背景颜色（如果有此值，会覆盖type值的颜色）
				if(this.bgColor) style.backgroundColor = this.bgColor;
				// 如果是镂空型tag，没有传递边框颜色（borderColor）的话，使用文字的颜色（color属性）
				if(this.mode == 'plain' && this.color && !this.borderColor) style.borderColor = this.color;
				else style.borderColor = this.borderColor;
				return style;
			},
			iconStyle() {
				if(!this.closeable) return ;
				let style = {};
				if(this.size == 'mini') style.fontSize = '20rpx';
				else style.fontSize = '22rpx';
				if(this.mode == 'plain' || this.mode == 'light') style.color = this.type;
				else if(this.mode == 'dark')  style.color = "#ffffff";
				if(this.closeColor) style.color = this.closeColor;
				return style;
			},
			// 关闭图标的颜色
			closeIconColor() {
				// 如果定义了关闭图标的颜色，就用此值，否则用字体颜色的值
				// 如果上面的二者都没有，如果是dark深色模式，图标就为白色
				// 最后如果上面的三者都不合适，就返回type值给图标获取颜色
				let color = '';
				if(this.closeColor) return this.closeColor;
				else if(this.color) return this.color;
				else if(this.mode == 'dark') return '#ffffff';
				else return this.type;
			}
		},
		methods: {
			// 标签被点击
			clickTag() {
				// 如果是disabled状态，不发送点击事件
				if(this.disabled) return ;
				this.$emit('click', this.index);
			},
			// 点击标签关闭按钮
			close() {
				this.$emit('close', this.index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../css/style.components.scss";
	
	.dz-tag {
		@include vue-flex;
		box-sizing: border-box;
		align-items: center;
		border-radius: 6rpx;
		display: inline-block;
		line-height: 1;
	}
	
	.dz-size-default {
		font-size: 22rpx;
		padding: 12rpx 22rpx;
	}
	
	.dz-size-mini {
		font-size: 20rpx;
		padding: 6rpx 12rpx;
	}

	.dz-mode-light-primary {
		background-color: $dz-type-primary-light;
		color: $dz-type-primary;
		border: 1px solid $dz-type-primary-disabled;
	}
	
	.dz-mode-light-success {
		background-color: $dz-type-success-light;
		color: $dz-type-success;
		border: 1px solid $dz-type-success-disabled;
	}
	
	.dz-mode-light-error {
		background-color: $dz-type-error-light;
		color: $dz-type-error;
		border: 1px solid $dz-type-error-disabled;
	}
	
	.dz-mode-light-warning {
		background-color: $dz-type-warning-light;
		color: $dz-type-warning;
		border: 1px solid $dz-type-warning-disabled;
	}
	
	.dz-mode-light-info {
		background-color: $dz-type-info-light;
		color: $dz-type-info;
		border: 1px solid $dz-type-info-disabled;
	}
	
	.dz-mode-dark-primary {
		background-color: $dz-type-primary;
		color: #FFFFFF;
	}
	
	.dz-mode-dark-success {
		background-color: $dz-type-success;
		color: #FFFFFF;
	}
	
	.dz-mode-dark-error {
		background-color: $dz-type-error;
		color: #FFFFFF;
	}
	
	.dz-mode-dark-warning {
		background-color: $dz-type-warning;
		color: #FFFFFF;
	}
	
	.dz-mode-dark-info {
		background-color: $dz-type-info;
		color: #FFFFFF;
	}
	
	.dz-mode-plain-primary {
		background-color: #FFFFFF;
		color: $dz-type-primary;
		border: 1px solid $dz-type-primary;
	}
	
	.dz-mode-plain-success {
		background-color: #FFFFFF;
		color: $dz-type-success;
		border: 1px solid $dz-type-success;
	}
	
	.dz-mode-plain-error {
		background-color: #FFFFFF;
		color: $dz-type-error;
		border: 1px solid $dz-type-error;
	}
	
	.dz-mode-plain-warning {
		background-color: #FFFFFF;
		color: $dz-type-warning;
		border: 1px solid $dz-type-warning;
	}
	
	.dz-mode-plain-info {
		background-color: #FFFFFF;
		color: $dz-type-info;
		border: 1px solid $dz-type-info;
	}
	
	.dz-disabled {
		opacity: 0.55;
	}

	.dz-shape-circle {
		border-radius: 100rpx;
	}
	
	.dz-shape-circleRight {
		border-radius:  0 100rpx 100rpx 0;
	}

	.dz-shape-circleLeft {
		border-radius: 100rpx 0 0 100rpx;
	}
	
	.dz-close-icon {
		margin-left: 14rpx;
		font-size: 22rpx;
		color: $dz-type-success;
	}
	
	.dz-right-icon{
		margin-left: 14rpx;
		font-size: 22rpx;
	}
	
	.dz-icon-wrap {
		display: inline-flex;
		transform: scale(0.86);
	}
</style>
