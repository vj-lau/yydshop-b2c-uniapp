<template>
	<view class="dz-col" :class="[
		'dz-col-' + span
	]" :style="{
		padding: `0 ${Number(gutter)/2 + 'rpx'}`,
		marginLeft: 100 / 12 * offset + '%',
		flex: `0 0 ${100 / 12 * span}%`,
		alignItems: mAlignItem,
		justifyContent: mJustify,
		textAlign: textAlign
	}"
	  @tap="click">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * col 布局单元格
	 * @description 通过基础的 12 分栏，迅速简便地创建布局（搭配<dz-row>使用）
	 * @property {String Number} span 栅格占据的列数，总12等分（默认0）
	 * @property {String} text-align 文字水平对齐方式（默认left）
	 * @property {String Number} offset 分栏左边偏移，计算方式与span相同（默认0）
	 * @example <dz-col span="3"><view class="demo-layout bg-purple"></view></dz-col>
	 */
	export default {
		name: "dz-col",
		props: {
			// 占父容器宽度的多少等分，总分为12份
			span: {
				type: [Number, String],
				default: 12
			},
			// 指定栅格左侧的间隔数(总12栏)
			offset: {
				type: [Number, String],
				default: 0
			},
			// 水平排列方式，可选值为`start`(或`flex-start`)、`end`(或`flex-end`)、`center`、`around`(或`space-around`)、`between`(或`space-between`)
			justify: {
				type: String,
				default: 'start'
			},
			// 垂直对齐方式，可选值为top、center、bottom
			align: {
				type: String,
				default: 'center'
			},
			// 文字对齐方式
			textAlign: {
				type: String,
				default: 'left'
			},
			// 是否阻止事件传播
			stop: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				gutter: 20, // 给col添加间距，左右边距各占一半，从父组件dz-row获取
			}
		},
		created() {
			this.parent = false;
		},
		mounted() {
			// 获取父组件实例，并赋值给对应的参数
			this.parent = this.$api.components.$parent.call(this, 'dz-row');
			if (this.parent) {
				this.gutter = this.parent.gutter;
			}
		},
		computed: {
			mJustify() {
				if (this.justify == 'end' || this.justify == 'start') return 'flex-' + this.justify;
				else if (this.justify == 'around' || this.justify == 'between') return 'space-' + this.justify;
				else return this.justify;
			},
			mAlignItem() {
				if (this.align == 'top') return 'flex-start';
				if (this.align == 'bottom') return 'flex-end';
				else return this.align;
			}
		},
		methods: {
			click(e) {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss">
	@import "../../css/style.components.scss";

	.dz-col {
		/* #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO */
		float: left;
		/* #endif */
	}

	.dz-col-0 {
		width: 0;
	}

	.dz-col-1 {
		width: calc(100%/12);
	}

	.dz-col-2 {
		width: calc(100%/12 * 2);
	}

	.dz-col-3 {
		width: calc(100%/12 * 3);
	}

	.dz-col-4 {
		width: calc(100%/12 * 4);
	}

	.dz-col-5 {
		width: calc(100%/12 * 5);
	}

	.dz-col-6 {
		width: calc(100%/12 * 6);
	}

	.dz-col-7 {
		width: calc(100%/12 * 7);
	}

	.dz-col-8 {
		width: calc(100%/12 * 8);
	}

	.dz-col-9 {
		width: calc(100%/12 * 9);
	}

	.dz-col-10 {
		width: calc(100%/12 * 10);
	}

	.dz-col-11 {
		width: calc(100%/12 * 11);
	}

	.dz-col-12 {
		width: calc(100%/12 * 12);
	}
</style>
