<template>
	<view>
		<dz-navbar-immersive splitLine scrollRatio="0.3" :isCustom="true" @change="opacityChange" :scrollTop="scrollTop" backgroundColor="#fff" :style="[navbarStyle]">
			<dz-navbar :title="title"></dz-navbar>
		</dz-navbar-immersive>
		<dz-navbar
			:title="title"
			:is-fixed="false"
			:borderBottom="false"
			:background="{ background: theme.dzBaseColor }"
			:title-color="theme.dzBaseFontColor"
			:back-icon-color="theme.dzBaseFontColor"
		></dz-navbar>
		<view class="price-box" :style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" v-if="statInfo.all">
			<view class="price-item" v-if="statInfo.all">
				<view class="flex">
					<view class="dzicon-iconfont dzicon-round_rank_fill"></view>
					<view class="title">全部佣金笔数: {{ statInfo.all.count }}</view>
				</view>
				<view class="price-tip">
					<view class="item">佣金总额￥{{ (parseFloat(statInfo.all.fission) + parseFloat(statInfo.all.store) + parseFloat(statInfo.all.regional)).toFixed(2) }}</view>
					<view v-if="userInfo.promoter_fission_is_open == 1 && userInfo.promoter && userInfo.promoter.promoterFission" class="item">
						裂变分销:￥{{ statInfo.all.fission }}
					</view>
					<view v-if="userInfo.promoter_store_is_open == 1 && userInfo.promoter && userInfo.promoter.promoterStore" class="item">
						店铺分销:￥{{ statInfo.all.store }}
					</view>
					<view v-if="userInfo.promoter_regional_is_open == 1 && userInfo.promoter && userInfo.promoter.promoterRegional" class="item">
						区域分销:￥{{ statInfo.all.regional }}
					</view>
				</view>
			</view>
			<view class="price-item" v-if="statInfo.today">
				<view class="flex">
					<view class="dzicon-iconfont dzicon-timefill"></view>
					<view class="title">今日佣金笔数: {{ statInfo.today.count }}</view>
				</view>
				<view class="price-tip">
					<block>
						<view class="item">
							佣金总额￥{{ (parseFloat(statInfo.today.fission) + parseFloat(statInfo.today.store) + parseFloat(statInfo.today.regional)).toFixed(2) }}
						</view>
					</block>
					<block>
						<view v-if="userInfo.promoter_fission_is_open == 1 && userInfo.promoter && userInfo.promoter.promoterFission" class="item">
							裂变分销:￥{{ statInfo.today.fission }}
						</view>
						<view v-if="userInfo.promoter_store_is_open == 1 && userInfo.promoter && userInfo.promoter.promoterStore" class="item">
							店铺分销:￥{{ statInfo.today.store }}
						</view>
						<view v-if="userInfo.promoter_regional_is_open == 1 && userInfo.promoter && userInfo.promoter.promoterRegional" class="item">
							区域分销:￥{{ statInfo.today.regional }}
						</view>
					</block>
				</view>
			</view>
		</view>
		<view class="order-list">
			<block v-for="(item, index) in promoterRecordTeamList" :key="index">
				<view class="item" v-if="parseFloat(item.commission_money) != 0">
					<view class="order-num">
						<view class="tip">订单号:{{ item.map_sn }}</view>
						<dz-tag v-if="item.state == 1" mode="dark" bgColor="#ECFBF4" color="#41CC8B">{{ item.state | filterStateText }}</dz-tag>
						<dz-tag v-if="item.state == 0" mode="dark" bgColor="#FFF7EC" color="#E7A458">{{ item.state | filterStateText }}</dz-tag>
						<dz-tag v-if="item.state == -1" mode="dark" bgColor="#FCF6F6" color="#FD5548">{{ item.state | filterStateText }}</dz-tag>
					</view>
					<view class="user-info">
						<image :src="item.member && (item.member.head_portrait || missingFace)"></image>
						<view class="right">
							<view>{{ item.remark }}</view>
							<view class="dz-m-t-8">{{ (item.member && (item.member.nickname || item.member.realname || item.member.mobile)) || '匿名' }}</view>
							<view class="parent-info">
								<view v-if="statType">上级ID: {{ (item.member && item.member.parent && item.member.parent.id) || '无' }}</view>
								<view v-if="statType">上级昵称: {{ (item.member && item.member.parent && item.member.parent.nickname) || '无' }}</view>
								<view v-if="item.record_type">类型:{{ item.record_type | filterRecordType }}</view>
								<view>时间: {{ item.created_at | timeFormat }}</view>
							</view>
						</view>
					</view>
					<view class="price-tip">
						<text>产品金额:{{ item.map_money }}</text>
						<text class="dz-m-l-20">佣金金额:{{ item.commission_money }}</text>
					</view>
					<dz-line margin="30rpx 30rpx 0 30rpx"></dz-line>
				</view>
			</block>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="80" :src="emptyOrder" iconSize="360" text="暂无分销订单"></dz-empty>
		<view v-if="loadingStatus != 'noData'" class="dz-ios-m-bline dz-p-b-20"><dz-loadmore :status="loadingStatus" margin-top="20"></dz-loadmore></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			title: '',
			missingFace: this.$api.assetsConfig.missingFace,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			page: 1,
			promoterRecordTeamList: [],
			statInfo: {},
			loadingStatus: 'loading',
			statDetailShow: parseInt(this.$api.shopSetting.show_distribution_stat_detail) == 1,
			statType: '',
			scrollTop: 0,
			opacity: 0,
			api: '',
			statApi: '',
			memberInfo: {},
			stateTag: {}
		};
	},
	async onLoad(e) {
		this.statType = e.type;
		await this.$onLaunched;
		this.statDetailShow = parseInt(this.$api.shopSetting.show_distribution_stat_detail) == 1;
		this.initData();
	},
	computed: {
		...mapState(['userInfo']),
		navbarStyle() {
			let style = {};
			style.opacity = this.opacity;
			return style;
		}
	},

	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	filters: {
		filterStateText(val) {
			switch (parseInt(val)) {
				case 1:
					return '已完成';
				case 0:
					return '待完成';
				case -1:
					return '已关闭';
			}
		},
		filterRecordType(val) {
			switch (val) {
				case 'fission':
					return '裂变分销';
				case 'regional':
					return '区域分销';
				case 'store':
					return '店铺分销';
				case 'warehouse':
					return '云仓分销';
			}
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.promoterRecordTeamList.length = 0;
		this.initData();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getPromoterRecordTeam();
	},
	methods: {
		filterStateTag(val) {
			switch (parseInt(val)) {
				case 1:
					return (this.stateTag = {
						bgColor: '#ECFBF4',
						color: '#51C996'
					});
				case 0:
					return (this.stateTag = {
						bgColor: '#ECFBF4',
						color: '#51C996'
					});
				case -1:
					return (this.stateTag = {
						bgColor: '#ECFBF4',
						color: '#51C996'
					});
			}
		},
		opacityChange(e) {
			this.opacity = e.opacity;
		},
		async initData() {
			if (this.statType) {
				this.title = '团队订单';
				this.api = this.$api.apiDistribution.promoterRecordTeam;
				this.statApi = this.$api.apiDistribution.promoterRecordTeamStat;
			} else {
				this.title = '直推订单';
				this.api = this.$api.apiDistribution.promoterRecordSelf;
				this.statApi = this.$api.apiDistribution.promoterRecordSelfStat;
			}
			uni.setNavigationBarTitle({
				title: this.title
			});
			await this.getPromoterRecordTeamStat();
			await this.getPromoterRecordTeam();
		},
		async getPromoterRecordTeam() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.api, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.promoterRecordTeamList = [...this.promoterRecordTeamList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				});
			uni.stopPullDownRefresh();
		},
		async getPromoterRecordTeamStat() {
			await this.$api.http.get(this.statApi).then(res => {
				this.statInfo = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
.price-box {
	padding: 20rpx 50rpx;
	font-size: 32rpx;
	.price-item {
		display: flex;
		padding: 20rpx 0;
	}
	.flex {
		flex: 3;
		display: flex;
		align-items: center;
		line-height: 50rpx;
		.dzicon-iconfont {
			margin-right: 10rpx;
			font-size: 50rpx;
		}
	}
	.price-tip {
		flex: 2;
		margin-left: 20rpx;
		font-size: 28rpx;
		.item {
			line-height: 50rpx;
		}
	}
}
.order-list {
	.item {
		padding: 30rpx 30rpx 0 30rpx;
		background-color: #ffffff;
		.order-num {
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;
			color: $dz-tips-color;
			.tip {
				color: $dz-main-color;
			}
		}
		.user-info {
			display: flex;
			// align-items: center;
			padding: 20rpx 0;
			image {
				flex-shrink: 0;
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}
			.right {
				margin-left: 20rpx;
				.parent-info {
					margin-top: 10rpx;
					font-size: 24rpx;
					color: $dz-tips-color;
				}
			}
		}
		.price-tip {
			text-align: right;
		}
	}
}
</style>
