<template>
	<view>
		<dz-navbar :title="language.wholesaleDetail.wholesaleDetailTitle"></dz-navbar>
		<view class="marketing-list">
			<view class="item" @tap="gotoProduct(wholesaleView.product_id)">
				<image class="img" :src="wholesaleView.product_picture" lazy-load></image>
				<view class="right">
					<view>
						<view class="title">{{ wholesaleView.product_name }}</view>
						<view class="text">{{ wholesaleView.sku_name || language.application.defaultSkuName }}</view>
					</view>
					<view class="price-box">
						<view class="price">
							<text>{{ language.application.moneySymbol }}</text>
							<text>{{ wholesaleView.product_money }}</text>
							<view class="price-tip">x 1</view>
						</view>
						<dz-tag size="mini" :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" mode="dark" style="font-size: 24rpx;">
							{{ $api.helper.formatString(language.wholesaleDetail.wholesaleNum, wholesaleView.total_number) }}
						</dz-tag>
					</view>
				</view>
			</view>
		</view>
		<view class="group-box">
			<view
				class="group-title"
				v-if="wholesaleView.order && wholesaleView.order[0].pay_status == 0 && (wholesaleView.end_time_left && parseInt(wholesaleView.end_time_left) > 0)"
			>
				待付款
			</view>
			<view class="group-title" v-if="parseInt(wholesaleView.state) == 1 && wholesaleView.end_time_left && parseInt(wholesaleView.end_time_left) > 0">
				拼单中,还差{{ unWholesaleMemberNumber }}人,剩余
				<dz-count-down
					class="dz-m-l-10"
					:timestamp="wholesaleView.end_time_left"
					:show-days="false"
					:color="theme.dzBaseColor"
					:separator-color="theme.dzBaseColor"
					:bg-color="'transparent'"
					@end="wholesaleEnd"
				></dz-count-down>
			</view>
			<view v-if="wholesaleView.end_time_left && wholesaleView.end_time_left < 0">{{ wholesaleView.member_nickname }} - 开团失败</view>
			<view v-else>{{ wholesaleView.member_nickname }} - {{ wholesaleView.state | stateFilters }}</view>
			<!-- 团员信息 -->
			<view class="group-name">
				<view class="img" v-for="(item, index) in wholesaleMemberList" :key="index">
					<image :style="{ borderColor: theme.dzBaseColor }" :src="item.member.head_portrait || missingFace" mode=""></image>
					<view :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" v-if="index === 0">团长</view>
					<view
						:style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						v-if="parseInt(item.pay_status) === 1 && index !== 0 && parseInt(item.order_status) !== -4"
					>
						成员
					</view>
					<view :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" v-if="parseInt(item.pay_status) === 0 && parseInt(item.order_status) !== -4">
						待付
					</view>
				</view>
				<view class="img" v-for="indexes in unWholesaleMemberNumber" :key="indexes" v-if="parseInt(wholesaleView.state) != 3">
					<image :style="{ borderColor: theme.dzBaseColor }" :src="missingFace" mode=""></image>
				</view>
			</view>
			<!-- 支付 -->
			<view class="btn" v-if="wholesalePayShow">
				<dz-button
					:border="false"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
					hover-class="none"
					shape="circle"
					@click="pay"
				>
					去支付
				</dz-button>
			</view>
			<!--邀请好友-->
			<view class="btn scale-1" v-if="wholesaleShareShow">
				<dz-button
					:border="false"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
					hover-class="none"
					shape="circle"
					open-type="share"
					@click="share(wholesaleView)"
				>
					邀请好友
				</dz-button>
			</view>
			<!--加入拼团-->
			<view class="btn scale-1 dz-m-t-20" v-if="wholesaleJoinShow">
				<dz-button
					:border="false"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
					hover-class="none"
					shape="circle"
					@click="submit(wholesaleView)"
				>
					加入拼团
				</dz-button>
			</view>
			<view class="btn" v-if="parseInt(wholesaleView.state) === 2">
				<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }" hover-class="none" shape="circle">
					开团成功
				</dz-button>
			</view>
			<view class="btn dz-m-t-20">
				<dz-button
					:border="false"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
					hover-class="none"
					shape="circle"
					@click="toProfile"
				>
					返回用户中心
				</dz-button>
			</view>
		</view>
		<!-- 订单信息 -->
		<view class="cell-box" v-if="orderDetail.shipping_type && wholesaleView.member_id == userInfo.id">
			<dz-cell-item center title="下单时间" :arrow="false" :value="wholesaleView.created_at | timeFormat" :border-bottom="false" hover-class="none"></dz-cell-item>
			<dz-cell-item
				center
				title="订单编号"
				:arrow="false"
				:value="wholesaleView.order && wholesaleView.order[0].order_sn"
				:border-bottom="false"
				hover-class="none"
			></dz-cell-item>
			<dz-cell-item center title="配送方式" :arrow="false" :value="orderDetail.shipping_type | filterShippingType" :border-bottom="false" hover-class="none"></dz-cell-item>
			<dz-cell-item center title="快递公司" :arrow="false" :value="orderDetail.company_name || '等待配送'" :border-bottom="false" hover-class="none"></dz-cell-item>
			<dz-cell-item
				center
				title="运费"
				:arrow="false"
				:value="$api.helper.formatString(language.orderCreate.price, orderDetail.shipping_money)"
				:border-bottom="false"
				hover-class="none"
			></dz-cell-item>
			<dz-cell-item
				center
				title="发票税费"
				:arrow="false"
				:value="$api.helper.formatString(language.orderCreate.price, orderDetail.tax_money)"
				:border-bottom="false"
				hover-class="none"
			></dz-cell-item>
			<dz-cell-item center title="商品金额" :arrow="false" :value="`￥${wholesaleView.price}`" :border-bottom="false" hover-class="none"></dz-cell-item>
			<dz-cell-item
				center
				title="实付款"
				:arrow="false"
				:value="$api.helper.formatString(language.orderCreate.price, orderDetail.pay_money)"
				:border-bottom="false"
				:value-style="{ color: theme.dzBaseColor }"
				hover-class="none"
			></dz-cell-item>
		</view>
		<!-- 爆款推荐 -->
		<view class="product-box">
			<dz-title v-if="wholesaleList.length > 0" title="猜你喜欢" mode="line" :barColor="theme.dzBaseDisabled"></dz-title>
			<view class="product-list">
				<view class="product-item" v-for="(item, listIndex) in wholesaleList" :key="listIndex" @tap="gotoProduct(item.product.id)">
					<image :src="item.product.picture"></image>
					<view class="price-text">{{ item.product.name }}</view>
					<dz-tag size="mini" mode="dark" :bg-color="theme.dzBaseColor" :color="theme.dzBaseFontColor" style="margin:0 0 10rpx 10rpx;">
						{{ item.num }}{{ language.wholesale.yesGroup }}
					</dz-tag>
					<view style="display: flex; align-items: flex-end; padding-left: 10rpx;">
						<view class="price-box" :style="{ color: theme.dzBaseColor }">
							<text class="price-l">{{ language.application.moneySymbol }}</text>
							<text class="price-r">{{ item.product.wholesale_price }}</text>
						</view>
						<view class="price-tip">{{ language.application.moneySymbol }}{{ item.product.market_price || item.product.price }}</view>
					</view>
				</view>
			</view>
			<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :text="noDataText" :src="empty" iconSize="360"></dz-empty>
			<dz-loadmore v-if="loadingStatus != 'nodata'" :status="loadingStatus" :bg-color="theme.dzBgColor" margin-top="20" margin-bottom="20"></dz-loadmore>
		</view>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import appShare, { closeShare } from '@/core/utils/share';
import mpShare from '@/core/utils/mixin/mpShare.js';
import { mapState, mapGetters } from 'vuex';
export default {
	mixins: [mpShare],
	data() {
		return {
			language: this.$api.language,
			missingFace: this.$api.assetsConfig.missingFace,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			id: '',
			wholesaleView: {},
			page: 1,
			loading: false,
			loadingStatus: 'loading',
			wholesaleList: [],
			pageLoadingShow: false,
			pageLoadingStatus: 'loading',
			orderDetail: {}
		};
	},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.$api.language.wholesaleDetail.wholesaleDetailTitle
		});
		this.id = e.id;
		await this.$onLaunched;
		this.getWholesaleList();

		//保存推荐人
		if (e.promo_code) {
			this.$api.store.commit('setPromoCode', e.promo_code);
		}
		//登录处理
		if (!this.$api.store.getters.hasLogin && parseInt(this.$api.shopSetting.wechat_share_page_auto_login) == 1) {
			//公众号自动登录
			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				if (e.code) {
					this.$api.wxAutoLoginHelper.wechatCodeLogin(e.code);
				} else {
					this.$api.wxAutoLoginHelper.login();
				}
			}
			// #endif
		}
	},
	onShow() {
		this.getWholesaleView();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.wholesaleList.length = 0;
		this.getWholesaleView();
		this.getWholesaleList();
	},
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getWholesaleList();
	},
	filters: {
		stateFilters(val) {
			let state;
			switch (parseInt(val)) {
				case 0:
					return (state = '待付款');
				case 1:
					return (state = '正发起拼团');
				case 2:
					return (state = '拼团成功');
				case 3:
					return (state = '开团失败');
			}
		},
		filterShippingType(value) {
			const data = ['物流配送', '买家自提', '货到付款', '本地配送', '虚拟商品'];
			return data[parseInt(value) - 1];
		}
	},
	computed: {
		...mapState(['userInfo']),
		...mapGetters(['hasLogin']),
		//拼团订单
		wholesaleMemberList() {
			return this.wholesaleView.order;
		},
		//还差付款的拼团人数
		unWholesaleMemberNumber() {
			if (!this.wholesaleView.order) {
				return 0;
			}
			let order = this.wholesaleView.order;
			let paid = 0;
			for (let i = 0; i < order.length; i++) {
				if (parseInt(order[i].pay_status) === 1) {
					paid++;
				}
			}
			if (parseInt(order[0].pay_status) === 0) {
				return parseInt(this.wholesaleView.total_number) - paid - 1;
			} else {
				return parseInt(this.wholesaleView.total_number) - paid;
			}
		},
		//是否需要付款
		wholesalePayShow() {
			if (!this.hasLogin) {
				return false;
			}
			if (!this.wholesaleView.order) {
				return false;
			}
			if (parseInt(this.wholesaleView.state) > 1) {
				return false;
			}
			let order = this.wholesaleView.order;
			for (let i = 0; i < order.length; i++) {
				if (parseInt(order[i].pay_status) === 0 && parseInt(this.userInfo.id) === parseInt(order[i].buyer_id)) {
					return true;
				}
			}
			return false;
		},
		//是否可以邀请好友
		wholesaleShareShow() {
			if (!this.hasLogin) {
				return false;
			}
			if (!this.wholesaleView.order) {
				return false;
			}
			if (parseInt(this.wholesaleView.state) > 1) {
				return false;
			}
			let order = this.wholesaleView.order;
			for (let i = 0; i < order.length; i++) {
				if (parseInt(order[i].pay_status) === 1 && parseInt(this.userInfo.id) === parseInt(order[i].buyer_id)) {
					return true;
				}
			}
			return false;
		},
		//是否可以加入拼团
		wholesaleJoinShow() {
			if (!this.wholesaleView.order) {
				return false;
			}
			if (parseInt(this.wholesaleView.state) !== 1) {
				return false;
			}
			let order = this.wholesaleView.order;
			for (let i = 0; i < order.length; i++) {
				if (parseInt(this.userInfo.id) === parseInt(order[i].buyer_id)) {
					return false;
				}
			}
			return true;
		}
	},
	methods: {
		pageLoadingClick() {
			this.pageLoadingStatus = 'loading';
			this.getWholesaleView();
		},
		//获取拼团详情
		async getWholesaleView() {
			this.pageLoadingShow = true;
			await this.$api.http
				.get(this.$api.apiShop.wholesaleMemberView, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					this.wholesaleView = res.data;
					this.pageLoadingShow = false;
					if (this.wholesaleView.order) {
						const item = this.wholesaleView.order.find(item => item.member.id == this.userInfo.id);
						if (item.id) {
							this.getOrderDetail(item.id);
						}
					}
					//初始化公众号分享
					// #ifdef H5
					if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
						this.$api.wxHelper.wxShare(
							window.location.href,
							this.$api.shopSetting.wholesale_detail_share_title,
							this.wholesaleView.product_name,
							this.sharePath(),
							this.wholesaleView.product_picture
						);
					}
					// #endif
					//初始化小程序分享
					this.mpShare.title = this.$api.shopSetting.wholesale_detail_share_title;
					this.mpShare.path = this.sharePath();
					this.mpShare.imageUrl = this.wholesaleView.product_picture;
				})
				.catch(err => {
					console.log(err);
					this.pageLoadingStatus = 'error';
				});
		},
		// 获取订单运费信息
		async getOrderDetail(id) {
			await this.$api.http
				.get(this.$api.apiShop.orderDetail, {
					params: {
						id
					}
				})
				.then(res => {
					this.orderDetail = res.data;
				});
		},
		//分享路径
		sharePath() {
			let domain = this.$api.shopSetting.h5_url;
			let url = '';
			if (domain.endsWith('/')) {
				domain = domain.substr(0, domain.length - 1);
			}
			// #ifdef MP
			url = `${this.$api.routesConfig.wholesaleDetail.path}?id=${this.id}`;
			// #endif
			// #ifndef MP
			url = `${domain}${this.$api.routesConfig.wholesaleDetail.path}?id=${this.id}`;
			// #endif
			if (this.$api.store.getters.hasLogin) {
				url = url + '&promo_code=' + this.userInfo.promo_code;
			}
			return url;
		},
		// 去支付
		pay() {
			if (!this.hasLogin) {
				return false;
			}
			if (!this.wholesaleView.order) {
				return false;
			}
			if (this.wholesaleView.state > 1) {
				return false;
			}
			let order = this.wholesaleView.order;
			for (let i = 0; i < order.length; i++) {
				if (parseInt(order[i].pay_status) === 0 && parseInt(this.userInfo.id) === parseInt(order[i].buyer_id)) {
					this.$api.router.redirectTo({
						route: this.$api.routesConfig.pay,
						query: {
							id: order[i].id
						}
					});
				}
			}
		},
		//获取拼团产品列表
		async getWholesaleList() {
			if (this.loading) {
				return;
			}
			this.loading = true;
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.wholesaleProductIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(async res => {
					this.loading = false;
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.wholesaleList = [...this.wholesaleList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'nodata';
					}
				})
				.catch(err => {
					this.loading = false;
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		// 跳转拼团商品
		gotoProduct(id) {
			this.$api.router.push({
				route: this.$api.routesConfig.wholesaleProduct,
				query: {
					id: id
				}
			});
		},
		// 回到用户中心
		toProfile() {
			this.$api.router.switchTab({
				route: this.$api.routesConfig.profile
			});
		},
		//拼团倒计时结束
		wholesaleEnd(e) {
			this.getWholesaleView();
		},
		//拼团分享
		async share(val) {
			let url = '';
			// #ifdef MP
			if (
				this.$api.store.state.wechatMpLogin &&
				this.$api.shopSetting.notify_miniprogram_sub &&
				(this.$api.shopSetting.notify_miniprogram_sub.order_wholesale_success || this.$api.shopSetting.notify_miniprogram_sub.order_wholesale_fail)
			) {
				const _this = this;
				wx.requestSubscribeMessage({
					tmplIds: [
						this.$api.shopSetting.notify_miniprogram_sub.order_wholesale_success, //   拼团成功
						this.$api.shopSetting.notify_miniprogram_sub.order_wholesale_fail //  拼团失败
					],
					success: res => {
						url = _this.sharePath();
					},
					fail(err) {
						console.log(err, 2);
					}
				});
			} else {
				url = this.sharePath();
			}
			// #endif
			// #ifndef MP
			url = this.sharePath();
			// #endif

			// #ifdef H5
			if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
				this.$refs.dzToast.show({
					title: this.$api.language.application.wxshareTip,
					type: 'warning'
				});
			} else {
				if (this.$api.helper.copy(url)) {
					this.$refs.dzToast.show({
						title: this.$api.language.application.shareUrlCopySuccess,
						type: 'success'
					});
				}
			}
			// #endif
			// #ifdef APP-PLUS
			let shareData = {
				shareUrl: url,
				shareTitle: this.$api.shopSetting.wholesale_detail_share_title,
				shareContent: this.wholesaleView.product_name,
				shareImg: this.wholesaleView.product_picture
			};
			appShare(shareData, res => {
				closeShare();
			});
			// #endif
		},
		// 加入拼团
		submit(val) {
			const params = {};
			const data = {};
			data.sku_id = val.sku_id;
			data.num = 1;
			params.type = 'wholesale';
			params.wholesale_product_id = this.wholesaleView.wholesaleProduct.id;
			params.data = JSON.stringify(data);
			params.wholesale_id = this.wholesaleView.id;
			this.$api.router.push({
				route: this.$api.routesConfig.orderCreate,
				query: {
					data: JSON.stringify(params)
				}
			});
		}
	}
};
</script>

<style lang="scss">
.marketing-list {
	padding: 20rpx 20rpx 0;
	.item {
		display: flex;
		padding: 30rpx 20rpx;
		background-color: #ffffff;
		overflow: hidden;
		margin-bottom: 20rpx;
		border-radius: 15rpx;
		.img {
			width: 160rpx;
			height: 160rpx;
			flex-shrink: 0;
			border-radius: 10rpx;
		}
		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 20rpx;
			.title {
				font-size: 28rpx;
				color: $dz-main-color;
			}
			.text {
				font-size: 24rpx;
				color: $dz-tips-color;
			}
			.price-box {
				display: flex;
				align-items: flex-end;
				justify-content: space-between;
				.price {
					display: flex;
					align-items: flex-end;
					text:first-child {
						font-size: 22rpx;
					}
					text:last-child {
						font-size: 32rpx;
					}
					.price-tip {
						margin-left: 10rpx;
						font-size: 24rpx;
						color: $dz-tips-color;
					}
				}
				.group {
					padding: 10rpx 20rpx;
				}
			}
		}
	}
}
.group-box {
	margin: 20rpx;
	background-color: #ffffff;
	text-align: center;
	padding: 30rpx 0 40rpx;
	border-radius: 15rpx;
	.group-title {
		font-size: 36rpx;
		color: $dz-tips-color;
	}
	.group-name {
		display: flex;
		justify-content: center;
		padding: 80rpx 0;
		.img {
			width: 90rpx;
			height: 90rpx;
			margin-right: 20rpx;
			position: relative;
			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				overflow: hidden;
				border-width: 1rpx;
				border-style: solid;
			}
			view {
				position: absolute;
				left: 45rpx;
				bottom: 10rpx;
				transform: translate(-28rpx, 30rpx);
				width: 60rpx;
				height: 36rpx;
				font-size: 22rpx;
				border-radius: 20rpx;
			}
		}
	}
	.scale-1 {
		animation: scaleBtn 0.9s infinite;
	}
	@keyframes scaleBtn {
		0% {
			transform: scale(1);
		}

		50% {
			transform: scale(0.93);
		}

		100% {
			transform: scale(1);
		}
	}
}
.address {
	display: flex;
	align-items: center;
	padding: 20rpx;
	margin: 20rpx;
	border-radius: 15rpx;
	background-color: #fff;
	.dzicon-round_location_fill {
		font-size: 72rpx;
		margin-right: 20rpx;
	}
	.title {
		font-size: 32rpx;
		color: $dz-main-color;
		line-height: 54rpx;
	}
	.address-tip {
		margin: 6rpx 0;
		font-size: 28rpx;
		color: $dz-tips-color;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
}
.cell-box {
	margin: 20rpx;
	background-color: #ffffff;
	border-radius: 15rpx;
}
.product-list {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin: 0 24rpx;
	.product-item {
		width: 342rpx;
		height: 520rpx;
		background-color: #fff;
		box-sizing: border-box;
		margin: 9rpx 0;
		border-radius: 12rpx;
		overflow: hidden;
		image {
			width: 342rpx;
			height: 342rpx;
		}
		.price-box {
			.price-l {
				font-size: 24rpx;
			}
			.price-r {
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.price-text {
			margin: 10rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.price-price {
			font-size: 24rpx;
			color: $dz-main-color;
		}
		.price-tip {
			font-size: 24rpx;
			color: $dz-tips-color;
			text-decoration: line-through;
			margin-left: 10rpx;
		}
	}
}
</style>
