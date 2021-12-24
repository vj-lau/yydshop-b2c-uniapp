<template>
	<view class="">
		<view
			class="dz-steps"
			:style="{
				flexDirection: direction
			}"
		>
			<view class="dz-steps__item" 
				:class="['dz-steps__item--' + direction]" 
				v-for="(item, index) in list" :key="index"
			>
				<view
					class="dz-steps__item__num"
					v-if="mode == 'number'"
					:style="{
						backgroundColor: current < index ? 'transparent' : activeColor,
						borderColor: current < index ? unActiveColor : activeColor
					}"
				>
					<text v-if="current < index" :style="{
						color: current < index ? unActiveColor : activeColor,
					}">
						{{ index + 1 }}
					</text>
					<dz-icon v-else size="22" color="#ffffff" :name="icon"></dz-icon>
				</view>
				<view class="dz-steps__item__dot" v-if="mode == 'dot'" :style="{ 
					backgroundColor: index <= current ? activeColor : unActiveColor 
				}"></view>
				<text class="dz-line-1" :style="{ 
					color: index <= current ? activeColor : unActiveColor,
				}" :class="['dz-steps__item__text--' + direction]">
					{{ item.name }}
				</text>
				<view class="dz-steps__item__line" :class="['dz-steps__item__line--' + mode]" v-if="index < list.length - 1">
					<dz-line :direction="direction" length="100%" :hair-line="false" :color="unActiveColor"></dz-line>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * steps 步骤条
 * @description 该组件一般用于完成一个任务要分几个步骤，标识目前处于第几步的场景。
 * @property {String} mode 设置模式（默认dot）
 * @property {Array} list 数轴条数据，数组。
 * @property {String} type type主题（默认primary）
 * @property {String} direction row-横向，column-竖向（默认row）
 * @property {Number String} current 设置当前处于第几步
 * @property {String} active-color 已完成步骤的激活颜色，如设置，type值会失效
 * @property {String} un-active-color 未激活的颜色，用于表示未完成步骤的颜色（默认#606266）
 * @example <dz-steps :list="numList" active-color="#fa3534"></dz-steps>
 */
export default {
	name: 'dz-steps',
	props: {
		// 步骤条的类型，dot|number
		mode: {
			type: String,
			default: 'dot'
		},
		// 步骤条的数据
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 主题类型, primary|success|info|warning|error
		type: {
			type: String,
			default: 'primary'
		},
		// 当前哪一步是激活的
		current: {
			type: [Number, String],
			default: 0
		},
		// 激活步骤的颜色
		activeColor: {
			type: String,
			default: '#2979ff'
		},
		// 未激活的颜色
		unActiveColor: {
			type: String,
			default: '#909399'
		},
		// 自定义图标
		icon: {
			type: String,
			default: 'check'
		},
		// step的排列方向，row-横向，column-竖向
		direction: {
			type: String,
			default: 'row'
		}
	},
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';

$dz-steps-item-number-width: 44rpx;
$dz-steps-item-dot-width: 20rpx;

.dz-steps {
	@include vue-flex;
	
	.dz-steps__item {
		flex: 1;
		text-align: center;
		position: relative;
		min-width: 100rpx;
		font-size: 26rpx;
		color: #8799a3;
		@include vue-flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		
		&--row {
			@include vue-flex;
			flex-direction: column;
			
			.dz-steps__item__line {
				position: absolute;
				z-index: 0;
				left: 75%;
				width: 50%;
				
				&--dot {
					top: calc(#{$dz-steps-item-dot-width} / 2);
				}
				
				&--number {
					top: calc(#{$dz-steps-item-number-width} / 2);
				}
			}
		}
		
		&--column {
			@include vue-flex;
			flex-direction: row;
			justify-content: flex-start;
			min-height: 120rpx;
			
			.dz-steps__item__line {
				position: absolute;
				z-index: 0;
				height: 50%;
				top: 75%;
				
				&--dot {
					left: calc(#{$dz-steps-item-dot-width} / 2);
				}
				
				&--number {
					left: calc(#{$dz-steps-item-number-width} / 2);
				}
			}
		}
		
		&__num {
			@include vue-flex;
			align-items: center;
			justify-content: center;
			width: $dz-steps-item-number-width;
			height: $dz-steps-item-number-width;
			border: 1px solid #8799a3;
			border-radius: 50%;
			overflow: hidden;
		}
		
		&__dot {
			width: $dz-steps-item-dot-width;
			height: $dz-steps-item-dot-width;
			@include vue-flex;
			border-radius: 50%;
		}
		
		&__text--row {
			margin-top: 14rpx;
		}
		
		&__text--column {
			margin-left: 14rpx;
		}
	}
}
</style>
