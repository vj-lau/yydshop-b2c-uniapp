<template>
	<view>
		<dz-navbar title="评价详情"></dz-navbar>
		<view class="content">
			<view class="product-box dz-m-b-20">
				<view class="product">
					<view class="image"><dz-image :src="evaluateProduct.product_picture" borderRadius="10" width="120" height="120"></dz-image></view>
					<view class="name">{{ evaluateProduct.product_name }}</view>
				</view>
			</view>
			<view class="product-evaluation">
				<view class="evaluation-top">
					<view>商品评价</view>
					<dz-rate
						class="rate-padding"
						:disabled="true"
						gutter="10"
						size="40"
						:value="evaluateProduct.scores"
						inactive-icon="favor_light"
						active-icon="favor_fill_light"
					></dz-rate>
					<view :style="{ color: theme.dzBaseColor }">{{ scoresList[parseInt(evaluateProduct.scores) - 1] }}</view>
				</view>
				<view class="evaluation-text">
					<view class="text">{{ evaluateProduct.content }}</view>
					<view class="covers">
						<dz-row gutter="10">
							<dz-col span="4" v-for="(item, index) in evaluateProduct.covers" :key="index" @tap="previewImgs(item, evaluateProduct.covers)">
								<image :src="item" mode="widthFix" lazy-load></image>
							</dz-col>
						</dz-row>
					</view>
					<view class="tiem">{{ evaluateProduct.created_at | timeFormat }}</view>
				</view>
				<view class="evaluate-again" v-if="evaluateProduct.has_again == 1">
					<view class="title" :style="{ color: theme.dzBaseDark }">商品追评</view>
					<view class="dz-m-b-10">{{ evaluateProduct.again_content }}</view>
					<view class="covers">
						<dz-row gutter="10">
							<dz-col span="4" v-for="(item, index) in evaluateProduct.again_covers" :key="index" @tap="previewImgs(item, evaluateProduct.again_covers)">
								<image :src="item" mode="widthFix" lazy-load></image>
							</dz-col>
						</dz-row>
					</view>
					<view class="again-time">{{ evaluateProduct.created_at | timeFormat }}</view>
				</view>
				<view class="btn" v-if="evaluateProduct.has_again == 0">
					<dz-button
						type="info"
						hoverClass="none"
						:border="false"
						@click="toEvaluation(evaluateProduct, 'add')"
						shape="circle"
						size="medium"
						:customStyle="{ width: '160rpx', height: '60rpx', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
					>
						<view class="dzicon-iconfont dzicon-post" style="font-size: 28rpx;margin-right: 10rpx;"></view>
						<view>写追评</view>
					</dz-button>
				</view>
			</view>
			<!-- TODO -->
			<view v-if="false" class="footer-evaluation">
				<view class="item">
					<view>物流评价</view>
					<dz-rate class="rate-padding" :disabled="true" size="40" :value="5" inactive-icon="favor_light" active-icon="favor_fill_light"></dz-rate>
				</view>
				<view class="item" style="margin-top: 20rpx;">
					<view>服务评价</view>
					<dz-rate class="rate-padding" :disabled="true" size="40" :value="5" inactive-icon="favor_light" active-icon="favor_fill_light"></dz-rate>
				</view>
			</view>
		</view>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStaus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			evaluateProduct: {},
			scoresList: ['失望', '一般', '满意', '喜欢', '超爱'],
			pageLoadingShow: false,
			pageLoadingStaus: 'loading',
			params: null
		};
	},
	async onLoad(option) {
		this.params = option;
		await this.$onLaunched;
		this.getEvaluateProduct(option);
	},
	methods: {
		loadingClick() {
			this.getEvaluateProduct(this.params);
		},
		async getEvaluateProduct(option) {
			this.pageLoadingShow = true;
			await this.$api.http
				.get(this.$api.apiShop.evaluateProduct, {
					params: {
						order_id: option.order_id,
						order_product_id: option.product_id
					}
				})
				.then(res => {
					this.evaluateProduct = res.data;
					this.pageLoadingShow = false;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStaus = 'error';
				});
		},
		// 去评论
		toEvaluation(item, type) {
			this.$api.router.push({
				route: this.$api.routesConfig.evaluation,
				query: {
					data: JSON.stringify(item),
					type: type
				}
			});
		},
		// 预览图片
		previewImgs(img, imgList) {
			uni.previewImage({
				current: img,
				urls: imgList
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 20rpx;
}
.product-box {
	padding: 20rpx;
	background: #ffffff;
	border-radius: 20rpx;
	.product {
		display: flex;
		align-items: center;
		padding: 20rpx 10rpx;
		.image {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
		}
		.name {
			margin-left: 20rpx;
			font-size: 28rpx;
			color: $dz-main-color;
		}
	}
}
.product-evaluation {
	padding: 30rpx 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	.evaluation-top {
		display: flex;
		font-size: 28rpx;
		color: $dz-main-color;
		.rate-padding {
			margin: 0 20rpx;
		}
	}
	.text {
		font-size: 28rpx;
		line-height: 48rpx;
		color: $dz-main-color;
		margin-bottom: 10rpx;
	}
	.evaluation-text {
		margin-top: 20rpx;

		.tiem {
			margin-top: 10rpx;
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
	.covers {
		image {
			width: 100%;
		}
	}
	.again-time {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: $dz-tips-color;
	}
	.evaluate-again {
		margin-top: 30rpx;
		.title {
			margin-bottom: 20rpx;
			font-size: 28rpx;
		}
	}
	.btn {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 30rpx;
	}
}
.footer-evaluation {
	margin-top: 20rpx;
	padding: 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	.item {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		view {
			margin-right: 20rpx;
		}
	}
}
</style>
