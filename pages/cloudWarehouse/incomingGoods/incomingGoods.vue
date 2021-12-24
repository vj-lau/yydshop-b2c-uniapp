<template>
	<view>
		<dz-navbar title="进货"></dz-navbar>
		<view class="card-box" v-if="order.product">
			<view class="card-item">
				<image :src="order.product.picture"></image>
				<view class="right">
					<view class="porduct-name">{{ order.product.name }}</view>
					<view>
						<dz-tag type="info" size="mini" :bgColor="theme.dzBgColor" :borderColor="theme.dzBgColor">
							款式：
							<text class="dz-font-24 dz-m-r-10" style="line-height: 32rpx;">{{ config.skuName }}</text>
						</dz-tag>
					</view>
					<view class="dz-color-9">库存量: {{ config.skuStock }}</view>
				</view>
			</view>
			<view class="sum">
				<view class="price">进货价：￥{{ config.skuPrice }}</view>
				<dz-number-box v-model="config.skuNumber" :min="parseInt(config.minNum)" @change="change"></dz-number-box>
			</view>
			<view class="dz-m-t-30">
				<dz-row gutter="16">
					<dz-col span="4" v-for="(item, index) in shortcutList" :key="index" @click="quickClick(index)">
						<view
							class="layout"
							:style="{ background: index == shortcutIndex ? theme.dzBaseColor : theme.dzBgColor, color: index == shortcutIndex ? theme.dzBaseFontColor : '#333' }"
						>
							<view class="dz-font-md dz-text-center">x {{ item }}</view>
						</view>
					</dz-col>
				</dz-row>
			</view>
		</view>
		<view class="footer">
			<view class="footer-bottom">
				<view>
					<view>合计：{{ config.skuNumber }}</view>
					<view>进货总价：￥{{ price }}</view>
				</view>
				<view>
					<dz-button
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						:border="false"
						size="medium"
						shape="circle"
						@click="submit"
					>
						进货
					</dz-button>
				</view>
			</view>
		</view>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			order: {},
			price: 0,
			pageLoadingShow: true,
			pageLoadingStatus: 'loading',
			shortcutList: [2, 5, 7, 10, 30],
			shortcutIndex: -1,
			config: {}
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: '进货'
		});
		this.config = option;
		if (this.config.minNum >= 1) {
			this.shortcutList = [];
			for (let i = 0; i < 6; i++) {
				this.shortcutList.push(parseInt(this.config.minNum) + i * 5);
			}
		}

		this.change({ value: parseInt(option.skuNumber) });
		this.orderPreview();
	},
	computed: {
		currentPrice() {}
	},
	methods: {
		pageLoadingClick() {
			this.orderPreview();
		},
		quickClick(index) {
			this.shortcutIndex = index;
			this.config.skuNumber = this.shortcutList[index];
		},
		async orderPreview() {
			await this.$api.http
				.post(this.$api.apiDistribution.orderPreview, {
					product_id: this.config.id,
					sku_id: this.config.skuId
				})
				.then(res => {
					this.order = res.data;
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});
		},
		change(e) {
			this.config.skuNumber = e.value;
			this.config.skuPrice ? (this.price = (parseFloat(this.config.skuPrice) * parseInt(this.config.skuNumber)).toFixed(2)) : (this.price = 0);
		},
		async submit() {
			if (!this.config.skuNumber) return this.$api.helper.toast('请选择箱数');
			await this.$api.http
				.post(this.$api.apiDistribution.orderCreate, {
					product_id: this.config.id,
					sku_id: this.config.skuId,
					num: this.config.skuNumber
				})
				.then(res => {
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.pay,
						query: {
							id: res.data.id,
							orderGroup: 'warehouse_purchase_order'
						}
					});
				});
		},
		toPage(url, type) {
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					type
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.card-box {
	padding: 20rpx;
	background-color: #fff;
}
.card-item {
	display: flex;
	image {
		width: 180rpx;
		height: 180rpx;
		margin-right: 20rpx;
		border-radius: 15rpx;
	}
	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.porduct-name {
			height: 80rpx;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
	}
}
.layout {
	margin: 10rpx 0;
	padding: 20rpx;
	border-radius: 12rpx;
}
.sum {
	display: flex;
	justify-content: space-between;
	margin: 60rpx 0 10rpx;
}
.footer {
	position: fixed;
	bottom: 0;
	width: 100%;
	background: #ffffff;
	.footer-bottom {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		margin-bottom: env(safe-area-inset-bottom);
	}
}
</style>
