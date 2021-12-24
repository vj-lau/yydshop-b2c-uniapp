<template>
	<view>
		<dz-navbar title="Loading加载动画" :background="{ background: theme.dzBgColor }" :border-bottom="false"></dz-navbar>
		<view class="warp">
			<view class="content">
				<view v-if="style_loading_type == 'flower' || style_loading_type == 'circle'" class="dz-flex dz-row-center">
					<view :class="{ 'dz-flower': style_loading_type == 'flower' }">
						<dz-loading :mode="style_loading_type" :color="theme.dzBaseColor" size="70" borderSize="8"></dz-loading>
					</view>
				</view>
				<shop-loading v-else :mode="style_loading_type" :color="theme.dzBaseColor" size="70"></shop-loading>
				<view v-if="style_loading_type != 'flower' && style_loading_type != 'loading-3'" class="tip dz-m-t-20">{{ loadingText }}</view>
			</view>
		</view>
		<view class="loading-content">
			<view class="dz-m-l-30 dz-m-t-30 dz-font-32 dz-font-weight">动画选择</view>
			<dz-row gutter="16" class="dz-m-10">
				<dz-grid col="3" :border="false" style="margin-top: -16rpx;">
					<dz-grid-item v-for="(item, index) in loadingConfig" :key="index" @click="loadingChange(index, item.type)">
						<view class="layout" :style="{ borderColor: active == index ? theme.dzBaseColor : '#fff' }">
							<view class="layout-item" :style="{ background: active == index ? '#fff' : theme.dzBgColor, color: active == index ? theme.dzBaseColor : '' }">
								{{ item.title }}
							</view>
						</view>
					</dz-grid-item>
				</dz-grid>
			</dz-row>
			<view class="dz-flex dz-row-between dz-p-b-40 dz-m-t-20">
				<view class="dz-flex-1">
					<dz-button
						:border="false"
						hoverClass="none"
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%', height: '90rpx' }"
						shape="circle"
						@click="loadingApply()"
					>
						应用
					</dz-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			loadingText: '正在加载中...',
			loadingShow: true,
			active: 0,
			style_loading_type: '',
			loadingConfig: [
				{
					title: '魔法圈',
					type: 'circle'
				},
				{
					title: '一朵花',
					type: 'flower'
				},
				{
					title: '浪漫的枕头',
					type: 'loading-1'
				},
				{
					title: '等等我就来',
					type: 'loading-2'
				},
				{
					title: 'battle',
					type: 'loading-3'
				},
				{
					title: '音浪',
					type: 'loading-4'
				},
				{
					title: '辣椒',
					type: 'loading-5'
				},
				{
					title: '球球大作战',
					type: 'loading-6'
				},
				{
					title: '月牙湾',
					type: 'loading-8'
				}
			]
		};
	},
	onLoad() {
		uni.setNavigationBarTitle({ title: 'Loading加载动画' });
		this.style_loading_type = this.styleLoadingType;
		let index = this.loadingConfig.findIndex(item => item.type == this.style_loading_type);
		if (index != -1) {
			this.active = index;
		}
	},
	computed: {
		...mapState(['styleLoadingType'])
	},
	methods: {
		loadingChange(index, type) {
			this.active = index;
			this.style_loading_type = type;
		},
		loadingApply() {
			this.$api.store.commit('setLoadingType', this.style_loading_type);
			this.$api.router.back();
		}
	}
};
</script>

<style lang="scss" scoped>
.warp {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	margin-top: 30%;
	.content {
		text-align: center;
	}
	.dz-flower {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 120rpx;
		height: 120rpx;
		background: rgba(17, 17, 17, 0.7);
		border-radius: 20rpx;
	}
	.tip {
		padding: 10rpx 20rpx;
		font-size: 22rpx;
		text-align: center;
		color: #999;
	}
}

.loading-content {
	position: fixed;
	width: 100%;
	bottom: 0;
	background: #fff;
	border-radius: 40rpx 40rpx 0 0;
	padding-bottom: env(safe-area-inset-bottom);
	.layout {
		border: 4rpx solid $dz-bg-color;
		border-radius: 20rpx;
		.layout-item {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180rpx;
			height: 90rpx;
			border-radius: 20rpx;
			background: $dz-bg-color;
		}
	}
}
</style>
