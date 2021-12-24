<template>
	<view>
		<dz-navbar :is-fixed="true" :title="language.productEvaluation.title"></dz-navbar>
		<view class="dz-header">{{ $api.helper.formatString(language.productEvaluation.ratioTip, evaluateStat.ratio) }}</view>
		<view class="dz-attr-box">
			<view
				class="dz-attr-item"
				v-for="(item, index) in evaluateItem"
				:style="{
					background: index == activeIndex ? '#fff' : theme.dzBgColor,
					color: index == activeIndex ? theme.dzBaseColor : '#333',
					borderColor: index == activeIndex ? theme.dzBaseColor : theme.dzBgColor
				}"
				@tap="attrClick(index, item.type)"
				:key="index"
			>
				{{ item.name }}
				<text>{{ item.number }}</text>
			</view>
		</view>
		<view class="dz-evaluate__box" v-for="(item, index) in evaluationList" :key="index">
			<view class="dz-flex__center">
				<image :src="item.member_head_portrait || missingFace" class="dz-avatar"></image>
				<view class="dz-nickname">{{ item.member_nickname || language.application.anonymous }}</view>
			</view>
			<view class="dz-content__box">
				<view class="dz-rate__box">
					<dz-rate :value="item.scores" :disabled="true" active-icon="favor_fill_light"></dz-rate>
					<text>{{ item.created_at | timeFormat('yyyy-mm-dd') }}</text>
				</view>
				<view class="dz-desc">{{ item.content }}</view>
				<view class="dz-img__box" v-if="item.covers && item.covers.length > 0">
					<block v-for="(src, subIndex) in item.covers" :key="subIndex"><image @tap.stop="previewImage(index, subIndex)" :src="src" mode="aspectFill"></image></block>
				</view>
				<view class="dz-explain_box" v-if="item.explain_first">
					<view class="arrow_up"></view>
					<view class="explain_box">
						<view class="dz-explain-color dz-color-9">{{ language.productEvaluation.explain }}</view>
						<view class="dz-desc dz-explain-color dz-color-6">{{ item.explain_first }}</view>
					</view>
				</view>
				<view class="dz-append_box" v-if="parseInt(item.has_again) === 1">
					<view class="dz-append-date" :style="{ color: theme.dzBaseColor }">
						{{ $api.helper.formatString(language.productEvaluation.againTip, $api.helper.timeDayDiff(item.created_at, item.again_addtime)) }}
					</view>
					<view class="dz-desc">{{ item.again_content }}</view>
				</view>
				<view class="dz-img__box" v-if="item.again_covers && item.again_covers.length > 0">
					<block v-for="(src, subIndex) in item.again_covers" :key="subIndex">
						<image @tap.stop="previewAgainImage(index, subIndex)" :src="src" mode="aspectFill"></image>
					</block>
				</view>
				<view class="dz-explain_box" v-if="item.again_explain">
					<view class="arrow_up"></view>
					<view class="explain_box">
						<view class="dz-explain-color dz-color-9">{{ language.productEvaluation.explain }}</view>
						<view class="dz-desc dz-explain-color dz-color-6">{{ item.again_explain }}</view>
					</view>
				</view>
				<view class="dz-op__box dz-flex__center">
					<view class="dz-specs">{{ item.sku_name || defaultSku }}</view>
					<view class="dz-flex__center">
						<!--TODO:点赞和评论-->
						<!-- <view class="dz-op-item">
							<text :class="{ 'dz-color-base': item.zan }">12</text>
							<dz-icon :name="item.zan ? 'appreciatefill' : 'appreciate'" :size="40" :color="item.zan ? theme.dzBaseColor : theme.dzMainColor"></dz-icon>
						</view>
						<view class="dz-op-item" @tap="evaluateDetail">
							<text>1</text>
							<dz-icon name="comment" :size="40" :color="theme.dzMainColor"></dz-icon>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="emptyMsg" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'nodata'" class="dz-p-b-20 dz-ios-m-bline"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			missingFace: this.$api.assetsConfig.missingFace,
			defaultSku: this.$api.language.application.defaultSkuName,
			emptyMsg: this.$api.assetsConfig.emptyMsg,
			activeIndex: 0,
			activeType: {},
			page: 1,
			loadingStatus: 'loading',
			evaluateStat: {},
			evaluateItem: [],
			evaluationList: []
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.productEvaluation.title
		});

		this.evaluateStat.id = e.product_id;
		this.evaluateStat.ratio = e.ratio || 100;
		this.evaluateStat.total_num = parseInt(e.total_num) < 0 ? 0 : e.total_num || 0;
		this.evaluateStat.good_num = parseInt(e.good_num) < 0 ? 0 : e.good_num || 0;
		this.evaluateStat.ordinary_num = parseInt(e.ordinary_num) < 0 ? 0 : e.ordinary_num || 0;
		this.evaluateStat.negative_num = parseInt(e.negative_num) < 0 ? 0 : e.negative_num || 0;
		this.evaluateStat.cover_num = parseInt(e.cover_num) < 0 ? 0 : e.cover_num || 0;
		this.evaluateStat.again_num = parseInt(e.again_num) < 0 ? 0 : e.again_num || 0;

		this.evaluateItem = [
			{ name: this.language.productEvaluation.total, number: this.evaluateStat.total_num, type: {} },
			{ name: this.language.productEvaluation.good, number: this.evaluateStat.good_num, type: { explain_type: 3 } },
			{ name: this.language.productEvaluation.ordinary, number: this.evaluateStat.ordinary_num, type: { explain_type: 2 } },
			{ name: this.language.productEvaluation.negative, number: this.evaluateStat.negative_num, type: { explain_type: 1 } },
			{ name: this.language.productEvaluation.cover, number: this.evaluateStat.cover_num, type: { has_cover: 1 } },
			{ name: this.language.productEvaluation.again, number: this.evaluateStat.again_num, type: { has_again: 1 } }
		];
		await this.$onLaunched;
		this.getEvaluationList();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.loadingStatus = 'loading';
		this.evaluationList.length = 0;
		this.getEvaluationList();
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getEvaluationList();
	},
	methods: {
		attrClick(index, type) {
			this.activeIndex = index;
			this.activeType = type;
			this.page = 1;
			this.loadingStatus = 'loading';
			this.evaluationList.length = 0;
			this.getEvaluationList();
		},
		async getEvaluationList() {
			await this.$api.http
				.get(this.$api.apiShop.evaluateList, {
					params: {
						product_id: this.evaluateStat.id,
						page: this.page,
						page_size: this.$api.appConfig.pageSize,
						...this.activeType
					}
				})
				.then(res => {
					this.evaluationList = [...this.evaluationList, ...res.data];
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
					uni.stopPullDownRefresh();
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
					uni.stopPullDownRefresh();
				});
		},
		previewImage(index, current) {
			let imgs = this.evaluationList[index].covers;
			uni.previewImage({
				current: current,
				urls: imgs
			});
		},
		previewAgainImage(index, current) {
			let imgs = this.evaluationList[index].again_covers;
			uni.previewImage({
				current: current,
				urls: imgs
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-header {
	font-size: 24rpx;
	color: $dz-tips-color;
	padding: 16rpx 30rpx;
}

.dz-header text {
	font-weight: bold;
	padding-left: 12rpx;
	color: $dz-main-color;
}

.dz-attr-box {
	width: 100%;
	padding: 24rpx 25rpx 0;
	box-sizing: border-box;
	font-size: 0;
	background-color: #fff;
	border-radius: 24rpx;
}

.dz-attr-item {
	max-width: 100%;
	min-width: 128rpx;
	height: 60rpx;
	display: -webkit-inline-flex;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0 26rpx;
	box-sizing: border-box;
	border-radius: 32rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	font-size: 26rpx;
	border: 2rpx solid #fff;
}

.dz-attr-item text {
	font-weight: bold;
	padding-left: 12rpx;
}

.dz-evaluate__box {
	width: 100%;
	padding: 25rpx;
	box-sizing: border-box;
	background-color: #ffffff;
	box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
	overflow: hidden;
	margin-top: 20rpx;
	border-radius: 24rpx;
}

.dz-flex__center {
	display: flex;
	align-items: center;
}

.dz-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
}

.dz-nickname {
	font-size: 28rpx;
	padding-left: 12rpx;
}

.dz-content__box {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.dz-rate__box {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 24rpx;
	color: $dz-tips-color;
	padding: 24rpx 0;
}

.dz-desc {
	font-size: 28rpx;
	word-break: break-all;
	text-align: justify;
}

.dz-img__box {
	width: 100%;
	font-size: 0;
	padding-top: 4rpx;
}

.dz-img__box image {
	width: 200rpx;
	height: 200rpx;
	margin-right: 12rpx;
	margin-top: 12rpx;
	border-radius: 15rpx;
}

.dz-image {
	width: 400rpx !important;
	height: auto;
}

.dz-append_box {
	width: 100%;
	padding-top: 10rpx;
}

.dz-append-date {
	margin: 12rpx 0;
}

.dz-explain_box {
	width: 100%;
	padding-top: 10rpx;
}

.dz-explain-color {
	color: $dz-type-warning;
}

.dz-op__box {
	width: 100%;
	padding-top: 24rpx;
	font-size: 24rpx;
	font-weight: 500;
	justify-content: space-between;
}

.dz-op-item {
	display: flex;
	align-items: center;
	margin-left: 40rpx;
}

.dz-op-item text {
	padding-right: 6rpx;
}

.dz-specs {
	font-size: 24rpx;
	color: $dz-light-color;
	font-weight: 400;
	word-break: break-all;
}

.arrow_up {
	width: 0;
	height: 0;
	border-bottom: 16rpx solid rgb(246, 246, 246);
	border-right: 20rpx solid transparent;
	border-left: 20rpx solid transparent;
	transform: translateX(16rpx);
}

.explain_box {
	background: rgb(248, 248, 248);
	padding: 20rpx;
	font-size: 26rpx;
	line-height: 48rpx;
	border-radius: 12rpx;
}
</style>
