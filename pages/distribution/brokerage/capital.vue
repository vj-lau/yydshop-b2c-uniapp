<template>
	<view>
		<!-- 佣金明细 -->
		<dz-navbar :title="type ? '收益日志' : language.distribution.theCommissionSubsidiary"></dz-navbar>
		<view class="content">
			<view class="item" v-for="(item,index) in promoterRecordList" :key="index">
				<view class="order-num">{{ language.distribution.type }} {{ recodeType(item.group) }}</view>
				<view class="name">{{ item.remark }}</view>
				<view class="price">
					<text class="time">{{ language.distribution.time }} {{item.created_at | timeFormat}}</text>
					<text :class="[`${parseFloat(item.num)>0?'checked':''}`]">{{ language.distribution.money }} {{ `${parseFloat(item.num)>0?'+':''}${item.num}` }} </text>
				</view>
			</view>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :text="language.distribution.noBillRecordYet" :src="emptyOrder" iconSize="360"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-ios-m-bline dz-p-b-20">
			<dz-loadmore  :status="loadingStatus" :margin-top="promoterRecordList.length>0 ? 20 : 100"></dz-loadmore>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return{
			theme: this.$api.theme,
			language: this.$api.language,
			type: '',
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			page:1,
			promoterRecordList: [],
			loadingStatus: 'loading'
		}
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type ? '收益日志' : this.$api.language.distribution.theCommissionSubsidiary
		});
		if(option.type) {
			this.type = option.type
		}
		await this.$onLaunched;
		this.getPromoterRecordIndex();
	},
	onPullDownRefresh() {
		this.page = 1;
		this.promoterRecordList.length = 0;
		this.getPromoterRecordIndex();
	},
	onReachBottom() {
		if(this.loadingStatus == 'nomore') return;
		this.page++;
		this.getPromoterRecordIndex();
	},
	methods: {
		recodeType(val){
			if(val=='manual_update'){
				return '管理员手动调整';
			}else if(val=='close_withdraw'){
				return  '提现失败返回';
			}else if(val=='withdraw'){
				return '佣金提现';
			}else if(val=='shop_order_pay'){
				return '订单佣金支付';
			}else if (val == 'shop_order_refund'){
				return '订单退款';
			}else if (val == 'fission_brokerage'){
				return '裂变分销';
			}else if (val == 'store_brokerage') {
				return '店铺分销佣金'
			}else if (val == 'regional_brokerage') {
				return '区域代理佣金'
			}else if (val == 'transfer_brokerage') {
				return '佣金转赠'
			}else {
				return '无'
			}
		},
		async getPromoterRecordIndex() {
			this.loadingStatus = 'loading';
			await this.$api.http.get(this.$api.apiDistribution.promoterCapitalIndex,{
				params: {
					page: this.page,
					page_size: this.$api.appConfig.pageSize
				}
			}).then(res=> {
				this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
				this.promoterRecordList = [...this.promoterRecordList, ...res.data];
				if(this.page == 1 && res.data.length == 0) {
					this.loadingStatus = 'noData';
				}
			})
			uni.stopPullDownRefresh();
		}
	}
}
</script>

<style lang="scss">
.content {
	.item {
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
		border-bottom: 1rpx solid $dz-bg-color;
		.order-num {
			font-size: 28rpx;
			color: $dz-main-color;
		}
		.name {
			padding: 10rpx 0 5rpx;
			font-size: 34rpx;
			color: $dz-main-color;
		}
		.price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color:$dz-main-color;
			.time {
				font-size: 28rpx;
				color: $dz-tips-color;
			}
			.checked {
				color: $dz-type-error;
			}
		}
	}
}
</style>
