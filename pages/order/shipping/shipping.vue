<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar :title="'物流信息'"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="'物流信息'"
			:isFixed="true"
			:background="{ background: theme.dzBaseColor }"
			:border-bottom="false"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
		></dz-navbar>
		<view>
			<view class="banner-bg" :style="{ background: theme.dzBaseColor }"></view>
			<view class="product-boxs" v-if="shippingDetail">
				<view class="product" v-if="shippingDetail.length == 1">
					<view class="image"><dz-image :src="shippingDetail[0].order_product.product_picture" borderRadius="10" width="120" height="120"></dz-image></view>
					<view class="right">
						<view>{{ shippingDetail[0].order_product.product_name }}</view>
					</view>
				</view>
				<view class="products" v-else>
					<view class="dzicon-iconfont dzicon-right icon" v-if="shippingDetail.length > 2"></view>
					<scroll-view scroll-x class="scroll-box">
						<view class="item" v-for="(item, index) in shippingDetail" :key="index" @tap="tabExpress(index)">
							<view class="card product">
								<view class="image"><dz-image :src="item.order_product.product_picture" borderRadius="10" width="120" height="120"></dz-image></view>
								<view class="name">
									<view>{{ item.order_product.product_name }}</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<block v-for="(item, index) in shippingDetail" :key="index">
					<view class="shipping" v-if="item.shipping_type == 1">
						<view class="left" @tap="tabExpress(index)">
							<view class="title">
								<view v-if="checked == index" class="dzicon-iconfont dzicon-activityfill" :style="{ color: checked == index ? theme.dzBaseColor : '' }"></view>
								<view>{{ item.express_name || '' }}</view>
							</view>
							<view class="tip">{{ item.express_no || '' }}</view>
						</view>
						<view class="btn">
							<dz-button
								:plain="true"
								type="info"
								size="mini"
								shape="circle"
								hoverClass="none"
								:border="false"
								:custom-style="{ height: '40rpx', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
								@click="copy(item.express_no)"
							>
								复制
							</dz-button>
						</view>
					</view>
				</block>
			</view>
			<view class="trace">
				<dz-time-line v-if="trace">
					<block v-for="(item, index) in trace" :key="index">
						<dz-time-line-item nodeTop="2" v-if="index == 0">
							<!-- 此处自定义了左边内容，用一个图标替代 -->
							<template v-slot:node>
								<view class="dz-node" :style="{ background: theme.dzBaseColor }"><dz-icon name="deliver_fill" color="#fff" :size="46"></dz-icon></view>
							</template>
							<template v-slot:content>
								<view>
									<!-- <view class="dz-order-title">待取件</view> -->
									<view class="dz-order-desc">{{ item.remark }}</view>
									<view class="dz-order-time">{{ item.datetime }}</view>
								</view>
							</template>
						</dz-time-line-item>
						<dz-time-line-item v-else>
							<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
							<template v-slot:content>
								<view>
									<view class="dz-order-desc">{{ item.remark }}</view>
									<view class="dz-order-time">{{ item.datetime }}</view>
								</view>
							</template>
						</dz-time-line-item>
					</block>
				</dz-time-line>
				<dz-empty v-if="trace && trace.length == 0" margin-top="80" text="暂无物流信息" :src="emptyOrder" iconSize="360"></dz-empty>
			</view>
		</view>
		<!-- 猜你喜欢 -->
		<shop-product-recommend :list="guessYouLikeList" :title="'猜你喜欢'" style="margin-top: 20rpx;" :theme="theme"></shop-product-recommend>
		<!-- 页面加载 -->
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" margin-top="20" margin-bottom="20"></dz-loadmore>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			shippingDetail: [],
			language: this.$api.language,
			empty: this.$api.assetsConfig.empty,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			loadingStatus: 'loading',
			page: 1,
			guessYouLikeList: [],
			scrollTop: 0,
			opacity: 0,
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			id: '',
			trace: [],
			checked: 0 // 物流选中
		};
	},
	async onLoad(option) {
		this.id = option.id;
		await this.$onLaunched;
		this.getOrderDetail();
		this.getGuessYouLikeList();
	},
	computed: {
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getGuessYouLikeList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		pageLoadingClick() {
			this.getOrderDetail(option.id);
			this.getGuessYouLikeList();
		},
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		async getOrderDetail() {
			this.pageLoadingShow = true;
			await this.$api.http
				.get(this.$api.apiShop.orderProductExpressDetails, {
					params: {
						order_id: this.id
					}
				})
				.then(res => {
					this.pageLoadingShow = false;
					res.data.data.forEach(item => {
						if (item.shipping_type == 1) {
							this.shippingDetail.push(item);
						}
					});
					this.trace = this.shippingDetail[this.checked].trace;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
		},
		// 复制
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '订单号已复制到剪贴板',
				type: 'success'
			});
		},
		// 切换物流
		tabExpress(index) {
			if (this.shippingDetail[index].shipping_type == 0) return;
			if (this.checked == index) return;
			this.checked = index;
			this.trace = this.shippingDetail[index].trace;
			this.$refs.dzToast.show({
				title: `已切换到${this.shippingDetail[index].express_name}`,
				type: 'success'
			});
		},
		async getGuessYouLikeList() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.guessYouLikeList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.guessYouLikeList = [...this.guessYouLikeList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
					console.log(err);
				});
		}
	}
};
</script>

<style lang="scss">
.banner-bg {
	height: 200rpx;
	border-radius: 0 0 5% 5%;
}
.product-boxs {
	position: relative;
	margin: -160rpx 24rpx 24rpx;
	padding: 30rpx;
	border-radius: 20rpx;
	background-color: #ffffff;
	.icon {
		position: absolute;
		right: 10rpx;
		top: 70rpx;
	}
	.product {
		display: flex;
		.image {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 10rpx;
		}
		.right {
			margin-left: 20rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: $dz-main-color;
		}
	}
	.scroll-box {
		white-space: nowrap;
		.item {
			display: inline-block;
			margin-right: 20rpx;
			.product {
				width: 310rpx;
				align-items: center;
				.name {
					margin-left: 20rpx;
					white-space: normal;
					font-size: 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
		}
		.item:last-child {
			margin-right: 0;
		}
	}
	.shipping {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		.title {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: $dz-main-color;
		}
		.tip {
			font-size: 24rpx;
			color: $dz-tips-color;
		}
	}
}
.trace {
	margin: 0 24rpx;
	background-color: #fff;
	border-radius: 20rpx;
	height: auto;
	padding: 30rpx 30rpx 30rpx 60rpx;
}
.dz-node {
	width: 68rpx;
	height: 68rpx;
	border-radius: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #d0d0d0;
}

.dz-order-title {
	color: $dz-main-color;
	font-weight: bold;
	font-size: 32rpx;
}

.dz-order-desc {
	margin-left: 20rpx;
	color: rgb(150, 150, 150);
	font-size: 28rpx;
	margin-bottom: 6rpx;
}

.dz-order-time {
	color: rgb(200, 200, 200);
	font-size: 26rpx;
}
</style>
