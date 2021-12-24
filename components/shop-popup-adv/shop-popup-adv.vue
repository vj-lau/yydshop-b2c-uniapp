<template>
	<view @touchmove.stop.prevent>
		<view class="mc-modal-box" :style="{ width: list.length == 1 ? width : '700rpx', borderRadius: radius }" :class="[fadeIn || show ? 'mc-modal-normal' : 'mc-modal-scale', show ? 'mc-modal-show' : '']" >
			<view v-if="list.length == 1" class="mode-center-box" :style="{borderRadius:radius,overflow: 'hidden'}">
				<image :src="list[0].cover" :style="{borderRadius:radius,overflow: 'hidden'}" @tap="swiperClick(0)"></image>
			</view>
			<view v-else class="swiper-box">
				<dz-swiper name="cover" :list="list" :effect3d="true" :autoplay="false"  border-radius="30"  height="750" bgColor="" @click="swiperClick" ></dz-swiper>
			</view>
			
			<view class="dz-flex dz-row-center dz-m-t-30" @tap.stop="handleClickCancel"><dz-icon name="roundclosefill" size="70" color="#f3f4f6"></dz-icon></view>
		</view>
		<view class="mc-modal-mask" :class="[show ? 'mc-mask-show' : '']" @tap="handleClick"></view>
	</view>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'shop-popup-adv',
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		//是否显示
		show: {
			type: Boolean,
			default: false
		},
		width: {
			type: String,
			default: '600rpx'
		},

		radius: {
			type: String,
			default: '30rpx'
		},
		//标题
		title: {
			type: String,
			default: ''
		},
		//点击遮罩 是否可关闭
		maskClosable: {
			type: Boolean,
			default: false
		},
		//淡入效果
		fadeIn: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		swiperClick(index) {
			this.$emit('davClick',index);
		},
		
		handleClick() {
			if (!this.show) return;
			this.$emit('click');
		},
		handleClickCancel() {
	
			this.$emit('cancel');
		}
	}
};
</script>

<style lang="scss" scoped>
.mc-modal-box {
	position: fixed;
	left: 50%;
	top: 50%;
	margin: auto;
	z-index: 9999997;
	transition: all 0.6s ease-in-out;
	opacity: 0;
	box-sizing: border-box;
	visibility: hidden;
}

.mc-modal-scale {
	transform: translate(-50%, -50%) scale(0);
}

.mc-modal-normal {
	transform: translate(-50%, -50%) scale(1);
}

.mc-modal-show {
	opacity: 1;
	visibility: visible;
}

.mc-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 9999996;
	transition: all 0.6s ease;
	opacity: 0;
	visibility: hidden;
	
}

.mc-mask-show {
	visibility: visible;
	opacity: 1;
}

.mode-center-box {
	width: 100%;
	position: relative;
	image {
		width: 100%;
		height: 750rpx;
	}
}
.swiper-box {
	width: 100%;
}
</style>
