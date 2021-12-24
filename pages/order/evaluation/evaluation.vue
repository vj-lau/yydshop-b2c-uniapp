<template>
	<view>
		<dz-navbar :title="title"></dz-navbar>
		<view class="content">
			<view class="product">
				<image :src="product.product_picture || (product.product && product.product[0].product_picture)"></image>
				<view class="name">{{ product.product_name || (product.product && product.product[0].product_name) }}</view>
			</view>
			<view v-if="evaluationType != 'add'" class="product-evaluation">
				<view>商品评价</view>
				<dz-rate
					class="rate-padding"
					gutter="10"
					size="40"
					:value="product.scores || 0"
					@change="rateChange"
					inactive-icon="favor_light"
					active-icon="favor_fill_light"
				></dz-rate>
				<view :style="{ color: theme.dzBaseColor }">{{ scoresText }}</view>
			</view>
			<view class="uploader-box">
				<dz-field
					type="textarea"
					:border-bottom="false"
					v-model="product.content"
					maxlength="140"
					label="评价内容"
					placeholder="商品很棒,好评!"
					:style="{ color: theme.dzMainColor }"
					:placeholder-style="theme.dzTipsColor"
				></dz-field>
				<view class="dz-uploader">
					<view class="uni-uploader-body">
						<dz-upload :custom-btn="true" :action="action" :header="header" :show-progress="false" @on-success="imgUploaded" max-count="9" @on-remove="imgRemove">
							<view slot="addBtn" class="uploaderBtn">
								<view class="dzicon-iconfont dzicon-cameraadd"></view>
								<view>{{ language.user.addImage }}</view>
							</view>
						</dz-upload>
					</view>
				</view>
			</view>
		</view>
		<view class="evaluation-box">
			<view v-if="evaluationType == 'add'" class="item dz-m-b-50">
				<view>商品评价</view>
				<dz-rate
					class="rate-padding"
					gutter="10"
					size="40"
					:disabled="evaluationType == 'add'"
					:value="product.scores || 0"
					@change="rateChange"
					inactive-icon="favor_light"
					active-icon="favor_fill_light"
				></dz-rate>
				<view :style="{ color: theme.dzBaseColor }">{{ scoresText }}</view>
			</view>
			<!-- TODO -->
			<view v-if="false" class="item">
				<view>物流评价</view>
				<dz-rate
					class="rate-padding"
					gutter="10"
					size="40"
					:disabled="evaluationType == 'add'"
					:value="5"
					@change="shippingChange"
					inactive-icon="favor_light"
					active-icon="favor_fill_light"
				></dz-rate>
			</view>
			<view v-if="false" class="item" style="margin-top: 50rpx;">
				<view>服务评价</view>
				<dz-rate
					class="rate-padding"
					gutter="10"
					size="40"
					:disabled="evaluationType == 'add'"
					:value="5"
					@change="serviceChange"
					inactive-icon="favor_light"
					active-icon="favor_fill_light"
				></dz-rate>
			</view>
			<view class="checked"><dz-checkbox :active-color="theme.dzBaseColor" v-model="check" shape="circle" @change="checkboxChange">匿名</dz-checkbox></view>
		</view>
		<view class="footer-btn">
			<view style="width: 100%;">
				<dz-button
					:border="false"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
					hover-class="none"
					@click="evaluateClick()"
				>
					提交
				</dz-button>
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			product: {},
			imageList: [],
			title: '',
			action: `${this.$api.appConfig.apiDomain}${this.$api.apiShop.uploadImage}`,
			header: { 'x-api-key': this.$api.store.state.accessToken },
			check: true,
			is_anonymous: 1,
			evaluationType: '',
			scoresList: ['失望', '一般', '满意', '喜欢', '超爱'],
			scoresText: ''
		};
	},
	async onLoad(e) {
		await this.$onLaunched;
		this.getProduct(e);
		this.scoresText = this.scoresList[4];
	},
	methods: {
		getProduct(option) {
			this.product = {};
			this.evaluationType = option.type;
			if (option.data) {
				this.product = JSON.parse(option.data);
				this.product.content = '';
				this.product.scores = 5;
				this.product.shipping_scores = 5;
				this.product.service_scores = 5;
			} else if (option.order_id) {
				this.orderId = option.order_id;
			}
			this.title = '评价晒单';
			if (option.type === 'add') {
				this.title = '追加评价';
			}
			uni.setNavigationBarTitle({
				title: this.title
			});
		},
		rateChange(e) {
			this.product.scores = e;
			this.scoresText = this.scoresList[parseInt(e) - 1];
		},
		shippingChange(e) {
			this.product.shipping_scores = e;
		},
		serviceChange(e) {
			this.product.service_scores = e;
		},
		checkboxChange(e) {
			this.check = e.value;
			if (e.value) {
				this.is_anonymous = 1;
			} else {
				this.is_anonymous = 0;
			}
		},
		// 图片上传成功
		imgUploaded(list) {
			this.imageList.push(list.data.url);
		},
		// 删除图片
		imgRemove(index, list, name) {
			this.imageList.splice(index, 1);
		},
		// 提交评价
		async evaluateClick() {
			const params = {};

			if (!this.product.content) {
				return this.$refs.dzToast.show({
					title: this.evaluationType == 'add' ? '请填写追加内容' : '请填写内容',
					type: 'warning'
				});
			}
			if (this.evaluationType !== 'add') {
				if (!this.product.scores) {
					return this.$refs.dzToast.show({
						title: '请对您购买的商品进行评分',
						type: 'warning'
					});
				}
				let data = [];
				data.push({
					order_product_id: this.product.product ? this.product.product[0].id : this.product.id,
					is_anonymous: this.is_anonymous,
					covers: this.imageList,
					scores: this.product.scores,
					shipping_scores: this.product.shipping_scores,
					service_scores: this.product.service_scores,
					content: this.product.content
				});
				params.evaluate = JSON.stringify(data);
				this.evaluateCreate(params);
			} else {
				params.order_product_id = this.product.order_product_id ? this.product.order_product_id : this.product.id;
				params.again_content = this.product.content;
				params.again_covers = JSON.stringify(this.imageList);
				this.evaluateAgain(params);
			}
		},
		// 发表评价
		async evaluateCreate(params) {
			await this.$api.http.post(this.$api.apiShop.evaluateCreate, params).then(res => {
				uni.$emit('evaluationStatus', {});
				this.$api.router.redirectTo({
					route: this.$api.routesConfig.evaluationStatus,
					query: {
						order_id: this.product.product ? this.product.product[0].order_id : this.product.order_id,
						product_id: this.product.product ? this.product.product[0].id : this.product.id
					}
				});
			});
		},
		// 追加评价
		async evaluateAgain(params) {
			await this.$api.http
				.post(this.$api.apiShop.evaluateAgain, params, {
					params: {
						order_product_id: params.order_product_id
					}
				})
				.then(res => {
					uni.$emit('evaluationStatus', {});
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.evaluationStatus,
						query: {
							order_id: this.product.order_id,
							product_id: this.product.product ? this.product.product[0].id : this.product.order_product_id
						}
					});
				});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 20rpx;
	background-color: #ffffff;
}
.product-evaluation {
	display: flex;
	font-size: 28rpx;
	color: $dz-main-color;
	margin-top: 30rpx;
	.rate-padding {
		margin: 0 20rpx;
	}
}
.product {
	display: flex;
	align-items: center;
	image {
		flex-shrink: 0;
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
	}
	.name {
		margin-left: 20rpx;
		font-size: 24rpx;
		color: $dz-main-color;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
.uploader-box {
	margin-top: 30rpx;
	background-color: $dz-bg-color;
	border-radius: 20rpx;
	.uni-textarea-placeholder,
	.uni-textarea-textarea {
		color: $dz-tips-color;
	}
	.dz-uploader {
		padding: 20rpx;
		.close-view {
			text-align: center;
			line-height: 28rpx;
			height: 32rpx;
			width: 32rpx;
			border-radius: 50%;
			position: absolute;
			top: -12rpx;
			right: -8rpx;
			font-size: 24rpx;
		}
		/* 上传 */
		.uni-uploader {
			flex: 1;
			flex-direction: column;
		}
		.uni-uploader-body {
			margin-top: 16rpx;
		}
	}
}
.uploaderBtn {
	width: 200rpx;
	height: 200rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 1rpx dashed $dz-tips-color;
	border-radius: 10rpx;
	overflow: hidden;
	margin: 10rpx;
	color: $dz-tips-color;
	.dzicon-cameraadd {
		font-size: 48rpx;
	}
}
.evaluation-box {
	margin-top: 20rpx;
	padding: 40rpx 20rpx;
	background-color: #ffffff;
	.item {
		display: flex;
		align-items: center;

		font-size: 28rpx;
		view {
			margin-right: 20rpx;
		}
	}
}
.checked {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin-top: 20rpx;
}
.footer-btn {
	margin-top: 60rpx;
	display: flex;
	justify-content: center;
}
</style>
