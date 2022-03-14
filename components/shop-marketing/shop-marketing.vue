<template>
	<view
		class="marketing"
		:style="{
			margin: `${topBottom}rpx ${leftRight}rpx`,
			backgroundColor: bgColor,
			borderRadius: `${radius}rpx`
		}"
	>
		<dz-cell-item
			v-if="propsConfig.titleShow == 1"
			:title="title"
			:icon="propsConfig.coverShow == 1 ? cover : ''"
			:iconSize="propsConfig.coverSize * 2"
			:borderBottom="false"
			hover-class="none"
			:value="propsConfig.titleRight"
			:title-style="{ fontSize: `${propsConfig.titleSize * 2}rpx`, fontWeight: propsConfig.isBold == 1 ? 'bold' : '500', color: propsConfig.titleColor }"
			:value-style="{ fontSize: `${propsConfig.titleRightSize * 2}rpx`, color: propsConfig.titleRightColor }"
			:rightColor="propsConfig.titleRightColor"
			:rightSize="propsConfig.titleRightSize * 2"
			@click="recommendTap()"
		></dz-cell-item>
		<scroll-view
			v-if="propsConfig.styleGroup == 'slide'"
			scroll-x
			class="h-list"
			:class="[list.length === 0 ? 'dz-box-shadow' : '', propsConfig.titleShow == 0 ? 'dz-m-t-10' : '']"
		>
			<view class="h-item" v-for="(item, index) in list" :key="index" @tap.stop="productTab(item)">
				<view class="img-box">
					<view class="h-item-img"><dz-image :src="item.picture" width="192" height="192" borderRadius="15"></dz-image></view>
					<!-- 即将开始 -->
					<!-- <view class="status" v-if="item.start_time_left && item.start_time_left > 0">{{ language.user.upcoming }}</view> -->
					<!-- 正在进行中 -->
					<!-- <view class="status" :style="{ background: 'linear-gradient(30deg, ' + theme.dzBaseDark + ', ' + theme.dzBaseColor + ')' }" v-else>
						{{ language.user.underWay }}
					</view> -->
				</view>
				<view class="title dz-line-2">{{ item.name }}</view>
				<view class="last-line">
					<view class=" dz-line-1 dz-text-center dz-font-28 dz-font-weight" :style="{ color: theme.dzBaseColor }">
						<text class="dz-font-24 dz-font-weight-light " :style="{ color: theme.dzBaseColor }">￥</text>
						{{ price(item) }}
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 一行一个/一行两个 -->
		<view
			v-if="propsConfig.styleGroup == 'oneLine' || propsConfig.styleGroup == 'twoLine'"
			class="dz-product-list"
			:class="[propsConfig.styleGroup == 'oneLine' ? 'dz-product-bg-list' : 'dz-m-t-10']"
			:style="{
				overflow: 'hidden'
			}"
		>
			<view class="dz-product-list-container">
				<block v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view
						v-if="(index + 1) % 2 !== 0 || propsConfig.styleGroup == 'oneLine'"
						class="dz-product-item"
						@tap.stop="productTab(item)"
						:class="[propsConfig.styleGroup == 'oneLine' ? 'dz-product-flex-list' : '', propsConfig.titleShow == 1 ? '' : 'dz-m-t-10']"
						hover-class="hover"
						:hover-start-time="150"
					>
						<view class="dz-product-image-wrapper">
							<image
								:src="item.picture"
								:mode="propsConfig.styleGroup == 'oneLine' ? 'aspectFill' : 'widthFix'"
								:preview="false"
								:class="[propsConfig.styleGroup == 'oneLine' ? 'dz-product-list-img' : 'dz-product-img']"
							></image>
						</view>
						<view class="dz-pro-content" v-if="item" :class="[propsConfig.styleGroup == 'oneLine' ? 'dz-m-l-20' : '']">
							<view class="dz-pro-tit">{{ item.name }}</view>
							<view>
								<dz-tag v-if="propsConfig.tagShow == 1" size="mini" bgColor="#fff" :borderColor="theme.dzBaseColor" :color="theme.dzBaseColor">
									<text v-if="marketingType == 'dz-bargain'" class="dz-font-10">低价</text>
									<text v-if="marketingType == 'dz-group'" class="dz-font-10">团购价</text>
									<text v-if="marketingType == 'dz-discount'" class="dz-font-10">折扣价</text>
									<text v-if="marketingType == 'dz-wholesale'" class="dz-font-10">拼团价</text>
									<text v-if="marketingType == 'dz-presale'" class="dz-font-10">定金</text>
								</dz-tag>
								<view class="dz-flex dz-row-between">
									<view class="dz-pro-price">
										<text class="dz-sale-price dz-font-price" :style="{ color: theme.dzBaseColor }">
											{{ price(item) }}</text>
										<text
											v-if="propsConfig.marketPriceShow && item.market_price"
											class="dz-m-l-10  dz-factory-price dz-font-price dz-color-9"
											style="text-decoration: line-through"
										>
											{{ marketingType == 'dz-discount' ? $api.helper.toFloat(item.price).toFixed(2) : $api.helper.toFloat(item.market_price).toFixed(2) }}
										</text>
									</view>
									<view v-if="propsConfig.buttonShow == 1">
										<dz-button
											:plain="true"
											:border="false"
											:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90rpx', height: '48rpx' }"
											hover-class="none"
											shape="circle"
											@click="productTab(item)"
										>
											<text v-if="marketingType == 'dz-bargain'" class="dz-font-10">去砍价</text>
											<text v-if="marketingType == 'dz-group'" class="dz-font-10">去团购</text>
											<text v-if="marketingType == 'dz-discount'" class="dz-font-10">去抢购</text>
											<text v-if="marketingType == 'dz-wholesale'" class="dz-font-10">去拼团</text>
											<text v-if="marketingType == 'dz-presale'" class="dz-font-10">付定金</text>
										</dz-button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
			<view class="dz-product-list-container" v-if="propsConfig.styleGroup == 'twoLine'" style="margin-right: 0;">
				<block v-for="(item, index) in list" :key="index">
					<!--商品列表-->
					<view
						v-if="(index + 1) % 2 === 0"
						class="dz-product-item"
						@tap.stop="productTab(item)"
						:class="[propsConfig.styleGroup == 'oneLine' ? 'dz-product-flex-list' : '', propsConfig.titleShow == 1 ? '' : 'dz-m-t-10']"
						hover-class="hover"
						:hover-start-time="150"
					>
						<view class="dz-product-image-wrapper">
							<image
								:src="item.picture"
								:mode="propsConfig.styleGroup == 'oneLine' ? 'aspectFill' : 'widthFix'"
								:preview="false"
								:class="[propsConfig.styleGroup == 'oneLine' ? 'dz-product-list-img' : 'dz-product-img']"
							></image>
							<view class="triangle-wrapper" v-if="item.shipping_type === '1' || item.is_virtual === '1' || item.commissionRate || item.is_open_presell === '1'">
								<!-- <image class="triangle-tag" :src="item | filterTagName"></image> -->
							</view>
						</view>
						<view class="dz-pro-content" v-if="item">
							<view class="dz-pro-tit">{{ item.name }}</view>
							<view>
								<dz-tag v-if="propsConfig.tagShow == 1" size="mini" bgColor="#fff" :borderColor="theme.dzBaseColor" :color="theme.dzBaseColor">
									<text v-if="marketingType == 'dz-bargain'" class="dz-font-10">低价</text>
									<text v-if="marketingType == 'dz-group'" class="dz-font-10">团购价</text>
									<text v-if="marketingType == 'dz-discount'" class="dz-font-10">折扣价</text>
									<text v-if="marketingType == 'dz-wholesale'" class="dz-font-10">拼团价</text>
									<text v-if="marketingType == 'dz-presale'" class="dz-font-10">定金</text>
								</dz-tag>
								<view class="dz-flex dz-row-between">
									<view class="dz-pro-price">
										<text class="dz-sale-price dz-font-price" :style="{ color: theme.dzBaseColor }">
											{{ price(item) }}
										</text>
										<text
											v-if="propsConfig.marketPriceShow && item.market_price"
											class="dz-m-l-10 dz-factory-price dz-font-price dz-color-9"
											style="text-decoration: line-through"
										>
											{{ marketingType == 'dz-discount' ? $api.helper.toFloat(item.price).toFixed(2) : $api.helper.toFloat(item.market_price).toFixed(2) }}
										</text>
									</view>
									<view>
										<dz-button
											:plain="true"
											:border="false"
											:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90rpx', height: '48rpx' }"
											hover-class="none"
											shape="circle"
											@click="productTab(item)"
										>
											<text v-if="marketingType == 'dz-bargain'" class="dz-font-10">去砍价</text>
											<text v-if="marketingType == 'dz-group'" class="dz-font-10">去团购</text>
											<text v-if="marketingType == 'dz-discount'" class="dz-font-10">去抢购</text>
											<text v-if="marketingType == 'dz-wholesale'" class="dz-font-10">去拼团</text>
											<text v-if="marketingType == 'dz-presale'" class="dz-font-10">付定金</text>
										</dz-button>
									</view>
								</view>
							</view>
						</view>
					</view>
					<!--商品列表-->
				</block>
			</view>
		</view>
		<view v-if="propsConfig.styleGroup == 'onePic'" class="product-max" :class="[propsConfig.titleShow == 1 ? '' : 'dz-m-t-20']">
			<view v-for="(item, index) in list" :key="index" class="product-item" @tap.stop="productTab(item)">
				<view class="image"><dz-image :src="item.picture" width="100%" height="320" borderRadius="20"></dz-image></view>
				<view class="dz-p-10">
					<view v-if="propsConfig.productNameShow == 1" class="dz-font-30 dz-color">{{ item.name }}</view>
					<view class="tip">{{ item.sketch }}</view>
					<view class="dz-flex dz-row-between dz-col-bottom dz-m-t-10">
						<view class="dz-flex dz-col-bottom">
							<dz-tag v-if="propsConfig.tagShow == 1" size="mini" bgColor="#fff" :borderColor="theme.dzBaseColor" :color="theme.dzBaseColor">
								<text v-if="marketingType == 'dz-bargain'" class="dz-font-10">低价</text>
								<text v-if="marketingType == 'dz-group'" class="dz-font-10">团购价</text>
								<text v-if="marketingType == 'dz-discount'" class="dz-font-10">折扣价</text>
								<text v-if="marketingType == 'dz-wholesale'" class="dz-font-10">拼团价</text>
								<text v-if="marketingType == 'dz-presale'" class="dz-font-10">定金</text>
							</dz-tag>
							<text class="dz-font-36 dz-m-l-12 dz-font-weight" :style="{ color: theme.dzBaseColor }">
								<text class="dz-font-24 dz-font-weight-light">￥</text>
								{{ price(item) }}
							</text>
							<text v-if="propsConfig.marketPriceShow && item.market_price" class="dz-m-l-6 dz-font-28 dz-color-9" style="text-decoration: line-through">
								￥ {{ marketingType == 'dz-discount' ? $api.helper.toFloat(item.price).toFixed(2) : $api.helper.toFloat(item.market_price).toFixed(2) }}
							</text>
						</view>
						<view v-if="propsConfig.buttonShow == 1">
							<dz-button
								:plain="true"
								:border="false"
								:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '120rpx', height: '50rpx' }"
								hover-class="none"
								shape="circle"
								@click="productTab(item)"
							>
								<text v-if="marketingType == 'dz-bargain'" class="dz-font-10">去砍价</text>
								<text v-if="marketingType == 'dz-group'" class="dz-font-10">去团购</text>
								<text v-if="marketingType == 'dz-discount'" class="dz-font-10">去抢购</text>
								<text v-if="marketingType == 'dz-wholesale'" class="dz-font-10">去拼团</text>
								<text v-if="marketingType == 'dz-presale'" class="dz-font-10">付定金</text>
							</dz-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 一行三个 -->
		<view v-if="propsConfig.styleGroup == 'threeLine'" class="product-threeLine" :class="[propsConfig.titleShow == 1 ? '' : 'dz-m-t-10']">
			<dz-row gutter="12">
				<dz-col v-for="(item, index) in list" :key="index" :span="4">
					<view class="item dz-m-t-10" @tap.stop="productTab(item)">
						<dz-image :src="item.picture" width="100%" :height="(750 - propsConfig.leftRight * 4 - 64) / 3" borderRadius="15"></dz-image>
						<view v-if="propsConfig.productNameShow == 1" class="name dz-line-2 dz-m-t-5" :style="{ width: `${(750 - propsConfig.leftRight * 4 - 64) / 3}rpx` }">
							{{ item.name }}
						</view>
						<view class="dz-text-center dz-line-1 dz-m-t-5">
							<text class="dz-font-24" :style="{ color: theme.dzBaseColor }">￥</text>
							<text class="dz-font-28 dz-font-weight" :style="{ color: theme.dzBaseColor }">{{ price(item) }}</text>
							<text v-if="propsConfig.marketPriceShow && item.market_price" style="text-decoration: line-through; transform: scale(0.8);color: #999">
								<text class="dz-font-24">￥</text>
								<text class="dz-font-24 ">{{ marketingType == 'dz-discount' ? $api.helper.toFloat(item.price).toFixed(2) : $api.helper.toFloat(item.market_price).toFixed(2) }}</text>
							</text>
						</view>
					</view>
				</dz-col>
			</dz-row>
		</view>
	</view>
</template>

<script>
export default {
	name: 'shop-marketing',
	props: {
		marketingType: {
			type: String,
			default: ''
		},
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		propsConfig: {
			type: Object,
			default() {
				return {
					titleShow: 1,
					coverShow: 1,
					coverSize: 52,
					title: '标题',
					titleRight: '更多',
					titleSize: 32,
					titleRightSize: 28,
					isBold: 1,
					titleColor: '#333',
					titleRightColor: '#333',
					styleGroup: 'slide',
					productNameShow: 1,
					marketPriceShow: 1,
					topBottom: 24,
					leftRight: 24,
					radius: 20,
					cover: '',
					dataSource: 'default',
					productLimit: ''
				};
			}
		},
		theme: {
			type: Object,
			default() {
				return {};
			}
		},
		cover: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: '标题'
		},
		// 背景颜色
		bgColor: {
			type: String,
			default: '#fff'
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
		// 圆角
		radius: {
			type: [Number, String],
			default: 12
		}
	},
	data() {
		return {
			language: this.$api.language
		};
	},
	computed:{
	
	},
	methods: {
		toPage() {
			this.$api.router.push({
				route: this.$api.routesConfig.couponList
			});
		},
		recommendTap() {
			if (!this.marketingType) return;
			let path;
			switch (this.marketingType) {
				case 'dz-bargain':
					path = 'bargainIndex';
					break;
				case 'dz-discount':
					path = 'discountIndex';
					break;
				case 'dz-wholesale':
					path = 'wholesaleIndex';
					break;
				case 'dz-group':
					path = 'groupIndex';
					break;
				case 'dz-presale':
					path = 'presaleIndex';
					break;
			}
			this.$api.router.push({
				route: this.$api.routesConfig[path]
			});
		},
		marketingPrice(val) {
			//限时折扣
			const decimal = val.discount && val.discount.decimal_reservation_number;
			const discount = val.discount && val.discount.discount;
			let price = val.price;
			//限时折扣价格保留方式
			switch (parseInt(decimal)) {
				case -1:
					//保留角和分
					price = this.$api.helper.toFixed(((price * discount) / 100),2);
					break;
				case 0:
					//抹去角和分
					price = (Math.floor((price * discount) / 100))  * 10
					price  = (Math.round(price  * 10) / 100).toFixed(0);
					break;
				case 1:
					//抹去分
					price = this.$api.helper.toFixed(((price * discount) / 100),1);
					break;
				default:
					price = this.$api.helper.toFixed(((price * discount) / 100),2);
			}
			return price;
		},
		price(item) {
			if (!this.marketingType) return;
			let price = item.price;
			switch(this.marketingType) {
				case 'dz-bargain':
					price =	this.$api.helper.toFixed(item.price - (1 - this.$api.helper.toFloat(item.bargain.min_rate / 100)) * item.price, 2)
					break;
				case 'dz-discount':
					price = this.marketingPrice(item);
					break;
				case 'dz-wholesale':
					price = item.wholesale_price
					break;
				case 'dz-group':
					price = item.group_buy.ladder.price
					break;
			}
			return parseFloat(price || '0').toFixed(2);
				
		},
		productTab(item) {
			if (!this.marketingType) return;
			let url;
			switch (this.marketingType) {
				case 'dz-bargain':
					url = 'bargainProduct';
					break;
				case 'dz-discount':
					url = 'discountProduct';
					break;
				case 'dz-wholesale':
					url = 'wholesaleProduct';
					break;
				case 'dz-group':
					url = 'groupProduct';
					break;
			}
			this.$api.router.push({
				route: this.$api.routesConfig[url],
				query: {
					id: item.id
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.marketing {
	background-color: #ffffff;
	border-radius: 20rpx;
	overflow: hidden;
	margin: 20rpx 20rpx 0;
	.h-list {
		padding: 0 10rpx;
		margin-top: -20rpx;
		background-color: #ffffff;
		white-space: nowrap;
		.h-item {
			margin: 10rpx 10rpx 10rpx 10rpx;
			padding: 10rpx 0 5rpx;
			display: inline-block;
			background-color: #fff;
			font-size: 22rpx;
			width: 192rpx;
			border-radius: 6rpx;
			.h-item-img {
				display: inline-block;
				width: 192rpx;
				height: 192rpx;
				border-radius: 15rpx;
				overflow: hidden;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.01);
			}
			.img-box {
				width: 100%;
				position: relative;
				width: 192rpx;
				height: 192rpx;
				border-radius: 15rpx;
				overflow: hidden;
				.status {
					position: absolute;
					bottom: 0;
					width: 100%;
					padding: 10rpx 0;
					text-align: center;
					background-color: rgba(0, 0, 0, 0.4);
					z-index: 2;
					font-size: 24rpx;
					color: #fff;
				}
			}
			.title {
				width: 192rpx;
				white-space: normal;
				height: 56rpx;
				line-height: 28rpx;
				font-size: 22rpx;
				padding: 0 10rpx;
				margin: 10rpx 0;
			}
			.last-line {
				padding: 0 10rpx 0rpx;
				margin-bottom: 5rpx;
				.red {
					font-size: 22rpx;
					margin-right: 4rpx;
				}
			}
		}
	}
}

.dz-product-list {
	box-sizing: border-box;
	padding: 0 20rpx;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	.dz-product-list-container {
		flex: 1;
		margin-right: 20rpx;
	}
	.dz-product-list-container:last-child {
		margin-right: 0 !important;
	}
	.dz-product-item {
		box-sizing: border-box;
		width: 100%;
		margin-bottom: 20rpx;
		overflow: hidden;
		background: #fff;
		border-radius: 15rpx;
		transition: all 0.15s ease-in-out;
	}
	.dz-product-list-item {
		box-sizing: border-box;
		width: 100%;
	}
	.dz-product-flex-list {
		display: flex;
		width: 100%;
		padding: 20rpx 0 2rpx !important;
	}
	.dz-product-image-wrapper {
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		.dz-product-img {
			display: block;
			width: 100%;
			height: 300rpx !important;
			background: #f3f4f6;
		}
		.dz-product-list-img {
			display: block;
			flex-shrink: 0;
			width: 252rpx;
			height: 252rpx !important;
			background: $dz-bg-color;
			border-radius: 15rpx;
		}
		.sketch {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 100%;
			padding: 0 8rpx;
			font-size: 24rpx;
			color: #fff;
			background-color: rgba(0, 0, 0, 0.4);
			border-bottom-left-radius: 6rpx;
		}
		.triangle-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			overflow: hidden;
			border-top-left-radius: 6rpx;
			.triangle-tag {
				width: 64rpx;
				height: 64rpx;
			}
		}
	}
	.dz-pro-content {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		padding: 20rpx 0;
		.dz-pro-tit {
			display: -webkit-box;
			height: 64rpx; //这里的高度必须为line-height*显示行数
			overflow: hidden;
			font-size: 26rpx;
			line-height: 32rpx;
			color: $dz-main-color;
			word-break: break-all;
			span-overflow: ellipsis;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
		}
		.dz-pro-price {
			padding-top: 18rpx;
		}
		.dz-sale-price {
			font-size: 34rpx;
			font-weight: 500;
			color: red;
		}
	}
}

.dz-product-bg-list {
	background: #ffffff;
}

.product-max {
	padding: 0 20rpx;
	.product-item {
		margin-bottom: 20rpx;
		background: #fff;
		.image {
			width: 100%;
			height: 320rpx;
		}
		.flex {
			display: flex;
			justify-content: space-between;

			.sum {
				font-size: 26rpx;
				color: #666;
			}
		}
		.tip {
			padding: 10rpx 0;
			font-size: 26rpx;
			color: #999;
		}
	}
}

.product-threeLine {
	padding: 0 20rpx;
	.item {
		margin-bottom: 20rpx;
		.name {
			height: 68rpx;
			padding: 6rpx 10rpx;
			font-size: 22rpx;
			line-height: 34rpx;
			white-space: normal;
			overflow: hidden;
		}
	}
}
</style>
