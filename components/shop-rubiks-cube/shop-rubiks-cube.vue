<template>
	<view class="shop-rubiks-cube">
		<!-- 单行 -->
		<view v-if="mode == 'single-file'" class="dz-flex" :style="{ margin: `0 ${leftRight}rpx`, padding: `${topButtom}rpx 0` }">
			<block v-if="list.length == 2">
				<view v-for="(item, index) in list" :key="index" :style="[customStyle]" class="dz-flex-1 maring-r card">
					<dz-image :src="item.cover" :borderRadius="radius" width="100%" height="100%" @click="listClick(item)"></dz-image>
				</view>
			</block>
			<block v-if="list.length == 3">
				<view v-for="(item, index) in list" :key="index" :style="[customStyle]" class="dz-flex-1 maring-3 card">
					<dz-image :src="item.cover" :borderRadius="radius" width="100%" height="100%" @click="listClick(item)"></dz-image>
				</view>
			</block>
			<block v-if="list.length == 4">
				<view v-for="(item, index) in list" :key="index" :style="[customStyle]" class="dz-flex-1 maring-4 card">
					<dz-image :src="item.cover" :borderRadius="radius" width="100%" height="100%" @click="listClick(item)"></dz-image>
				</view>
			</block>
		</view>
		<!-- 两行两列 -->
		<view v-if="mode == 'row2Col2'" :style="{ margin: `0 ${leftRight}rpx`, padding: `${topButtom}rpx 0` }">
			<view class="dz-flex">
				<view class="dz-flex-1 card" :style="[customStyle]">
					<dz-image :src="list[0].cover" :borderRadius="radius" width="100%" height="100%" @click="listClick(list[0])"></dz-image>
				</view>
				<view class="dz-flex-1 card" :style="[customStyle]">
					<dz-image :src="list[1].cover" :borderRadius="radius" width="100%" height="100%" @click="listClick(list[1])"></dz-image>
				</view>
			</view>
			<view class="dz-flex" :style="{ marginTop: `${clearance}rpx` }">
				<view class="dz-flex-1 card" :style="[customStyle]">
					<dz-image :src="list[2].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[2])"></dz-image>
				</view>
				<view class="dz-flex-1 card" :style="[customStyle]">
					<dz-image :src="list[3].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[3])"></dz-image>
				</view>
			</view>
		</view>
		<!-- 1左2右 -->
		<view v-if="mode == 'leftRight2'" class="dz-flex" :style="{ margin: `0 ${leftRight}rpx`, padding: `${topButtom}rpx 0` }">
			<view class="dz-flex-1 card" :style="[customStyle]">
				<dz-image :src="list[0].cover" width="100%" :height="heightConfig[mode].height * 4 + parseInt(clearance)" :borderRadius="radius" @click="listClick(list[0])"></dz-image>
			</view>
			<view class="dz-flex-1 dz-flex leftRight-item dz-flex-column">
				<view class="card" :style="{ height: heightConfig[mode].height * 2 + 'rpx', 'border-radius': `${radius}rpx` }">
					<dz-image :src="list[1].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[1])"></dz-image>
				</view>
				<view
					class="card"
					:style="{
						height: heightConfig[mode].height * 2 + 'rpx',
						'border-radius': `${radius}rpx`,
						marginTop: `${clearance}rpx`
					}"
				>
					<dz-image :src="list[2].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[2])"></dz-image>
				</view>
			</view>
		</view>
		<!-- 1上2下 -->
		<view v-if="mode == 'topBottom2'" :style="{ margin: `0 ${leftRight}rpx`, padding: `${topButtom}rpx 0` }">
			<view
				class="card"
				:style="{
					borderRadius: `${radius}rpx`,
					marginBottom: `${clearance}rpx`,
					height: heightConfig[mode].topHeight * 2 + 'rpx'
				}"
			>
				<dz-image :src="list[0].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[0])"></dz-image>
			</view>
			<view>
				<view class="dz-flex">
					<view class="dz-flex-1 card template4" :style="[customStyle]">
						<dz-image :src="list[1].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[1])"></dz-image>
					</view>
					<view class="dz-flex-1 card template4" :style="[customStyle]">
						<dz-image :src="list[2].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[2])"></dz-image>
					</view>
				</view>
			</view>
		</view>
		<view v-if="mode == 'leftRight3'" class="dz-flex" :style="{ margin: `0 ${leftRight}rpx`, padding: `${topButtom}rpx 0` }">
			<view class="dz-flex-1 card " :style="[customStyle]">
				<dz-image :src="list[0].cover" width="100%" :height="(heightConfig[mode].topHeight + heightConfig[mode].bottomHeight) * 2 + clearance" :borderRadius="radius" @click="listClick(list[0])"></dz-image>
			</view>
			<view class="dz-flex-1 dz-flex dz-flex-column">
				<view
					class="card"
					:style="{
						'border-radius': `${radius}rpx`,
						marginBottom: `${clearance}rpx`,
						height: heightConfig[mode].topHeight * 2 + 'rpx'
					}"
				>
					<dz-image :src="list[1].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[1])"></dz-image>
				</view>
				<view class="dz-flex" style="height: 100%;width: 100%;">
					<view
						class="card dz-flex-1"
						:style="{
							height: heightConfig[mode].bottomHeight * 2 + 'rpx',
							marginRight: `${clearance}rpx`
						}"
					>
						<dz-image :src="list[2].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[2])"></dz-image>
					</view>
					<view
						class="card dz-flex-1"
						:style="{
							height: heightConfig[mode].bottomHeight * 2 + 'rpx'
						}"
					>
						<dz-image :src="list[3].cover" width="100%" height="100%" :borderRadius="radius" @click="listClick(list[3])"></dz-image>
					</view>
				</view>
			</view>
		</view>
		<!-- </view> -->
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		mode: {
			type: String,
			default: 'single-file'
		},
		radius: {
			type: [String, Number],
			default: 0
		},
		// 上下边距
		topButtom: {
			type: [String, Number],
			default: 0
		},
		// 左右边距
		leftRight: {
			type: [String, Number],
			default: 0
		},
		// 图片间距
		clearance: {
			type: [String, Number],
			default: 0
		},
		// 图片高度配置
		heightConfig: {
			type: Object,
			default() {
				return {};
			}
		}
	},

	computed: {
		// 自定义样式
		customStyle() {
			let style = {
				'border-radius': `${this.radius}rpx`,
				marginRight: this.clearance + 'rpx',
			
			};
			if (['single-file', 'row2Col2'].includes(this.mode)) {
				style.height = this.heightConfig[this.mode].height * 2 + 'rpx';
			}
			
		
			if (this.mode == 'leftRight2') {
				style.height = this.heightConfig[this.mode].height * 4 + this.clearance + 'rpx';
				
			}
			// 模板6
			if (['topBottom2'].includes(this.mode)) {
				style.height = this.heightConfig[this.mode].bottomHeight * 2 + 'rpx';
			}
			// 模板7
			if (this.mode == 'leftRight3') {
				style.height = (this.heightConfig[this.mode].topHeight + this.heightConfig[this.mode].bottomHeight) * 2 + this.clearance + 'rpx';
			}
			return style;
		}
	},
	methods: {
		listClick(item) {
			this.$emit('click', item);
		}
	}
};
</script>

<style lang="scss">
.shop-rubiks-cube {
	// background: #fff;
}
.single-file {
	.maring-r {
		height: 360rpx;
	}
	.maring-3 {
		height: 270rpx;
	}
	.maring-4 {
		height: 240rpx;
	}
}
.card {
	width: 100%;
	height: 100%;
}
.card:last-child {
	margin-right: 0rpx !important;
}
.dz-height {
	height: 452rpx;
	box-sizing: border-box;
}
.leftRight-item {
	height: 100%;
}
.template4 {
	width: 100%;
	height: 214rpx;
	overflow: hidden;
}
.topBottom-h {
	width: 100%;
	height: 304rpx;
	overflow: hidden;
}
.template7 {
	height: 380rpx;
	box-sizing: border-box;
}
</style>
