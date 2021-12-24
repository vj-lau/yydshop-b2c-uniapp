<template>
	<view class="dz-article" :style="{ margin: `${topBottom}rpx ${leftRight}rpx` }">
		<template v-if="mode == 'default'">
			<view
				v-for="(item, index) in list"
				:key="index"
				class="item"
				:style="{
					marginBottom: `${cardMargin}rpx`,
					padding: `${cardPadding}rpx`,
					borderRadius: radius + 'rpx',
					display: 'flex'
				}"
				@tap="detailTap(item.id, item.title)"
			>
				<view>
					<dz-image
						:src="dataSource == 'manual' ? diyCover(index) : item.cover"
						:width="dataSource == 'manual' ? width : 224"
						:height="dataSource == 'manual' ? height : 150"
						:customStyle="{ borderRadius: `${radius1}rpx ${radius2}rpx ${radius2}rpx ${radius1}rpx`, overflow: 'hidden' }"
					></dz-image>
				</view>
				<view
					class="dz-flex-column dz-row-between dz-m-l-20 dz-flex-s"
					:style="{
						display: 'flex',
						width: '100%',
						margin: `${contentPadding}rpx`
					}"
				>
					<view class="dz-flex-1">
						<view class="dz-font-32 dz-line-1" :style="{width: titleWidth + 'px'}">{{ item.title }}</view>
						<view v-if="isDescription == 1" class="dz-m-t-6 dz-tip dz-font-24 dz-color-9">{{ item.description }}</view>
					</view>
					<view class="dz-text-right dz-m-t-6 dz-color-9 dz-font-12">
						<text v-if="isTime == 1">{{ item.created_at | timeFrom }}</text>
						<text v-if="isViewCount == 1" class="dz-m-l-6">{{ item.view_count }} 浏览</text>
					</view>
				</view>
			</view>
		</template>
		<template v-if="mode == 'max'">
			<view
				v-for="(item, index) in list"
				:key="index"
				:style="{
					marginBottom: `${cardMargin}rpx`,
					padding: `${cardPadding}rpx`,
					borderRadius: radius + 'rpx'
				}"
				class="item"
				@tap="detailTap(item.id, item.title)"
			>
				<view>
					<dz-image
						:src="dataSource == 'manual' ? diyCover(index) : item.cover"
						:height="dataSource == 'manual' ? height : 502"
						:customStyle="{ borderRadius: `${radius1}rpx ${radius1}rpx ${radius2}rpx ${radius2}rpx`, overflow: 'hidden' }"
					></dz-image>
				</view>
				<view
					class="dz-p-t-10"
					:style="{
						padding: `${contentPadding}rpx`
					}"
				>
					<view class="dz-font-32 dz-line-1">{{ item.title }}</view>
					<view v-if="isDescription == 1" class="dz-m-t-6 dz-line-2 dz-font-24 dz-color-9">{{ item.description }}</view>
					<view class="dz-text-right dz-m-t-6 dz-color-9 dz-font-24">
						<text v-if="isTime == 1">{{ item.created_at | timeFrom }}</text>
						<text v-if="isViewCount == 1" class="dz-m-l-12">{{ item.view_count }} 浏览</text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
// 获取系统状态栏的高度
let systemInfo = uni.getSystemInfoSync();
export default {
	props: {
		// 列表
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 自定义数据
		defaultList: {
			type: Array,
			default() {
				return [];
			}
		},
		// 模式  default max
		mode: {
			type: String,
			default: 'default'
		},

		dataSource: {
			type: String,
			default: 'default'
		},
		// 左右边距
		leftRight: {
			type: [String, Number],
			default: 0
		},
		// 上下边距
		topBottom: {
			type: [String, Number],
			default: 0
		},
		// 盒子外边距边距
		cardMargin: {
			type: [String, Number],
			default: 20
		},
		// 盒子内边距
		cardPadding: {
			type: [String, Number],
			default: 20
		},
		// 内容内边距
		contentPadding: {
			type: [String, Number],
			default: 0
		},
		// 卡片圆角
		radius: {
			type: [String, Number],
			default: 0
		},
		// 底部边框bar的宽度，单位px
		width: {
			type: [String, Number],
			default: 224
		},
		// bar的高度
		height: {
			type: [String, Number],
			default: 150
		},
		// 圆角1
		radius1: {
			type: [String, Number],
			default: 20
		},
		// 圆角2
		radius2: {
			type: [String, Number],
			default: 20
		},
		// 是否显示描述
		isDescription: {
			type: [String, Number],
			default: 1
		},
		// 是否显示时间
		isTime: {
			type: [String, Number],
			default: 1
		},
		// 是否显示浏览
		isViewCount: {
			type: [String, Number],
			default: 1
		}
	},
	data() {
		return {
			titleWidth: 0
		};
	},
	mounted() {
		this.titleWidth = (systemInfo.windowWidth * 2 - this.width  - (this.contentPadding + this.cardPadding + this.leftRight) * 2 - 20 ) / 2
	},
	methods: {
		diyCover(index) {
			let cover = this.list[index].cover;
			if (this.defaultList.length && this.defaultList[index].cover) {
				cover = this.defaultList[index].diyCover ? this.defaultList[index].diyCover : this.list[index].cover;
			}
			return cover;
		},

		detailTap(id, title) {
			this.$api.router.push({
				route: this.$api.routesConfig.articleDetail,
				query: {
					id: id,
					title: title
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	overflow: hidden;
	background: #fff;
	
}
.item:last-child {
	margin-bottom: 0;
}
.dz-tip {
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
</style>
