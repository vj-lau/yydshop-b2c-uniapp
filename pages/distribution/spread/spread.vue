<template>
	<view>
		<dz-navbar title="分销商信息" :borderBottom="false"></dz-navbar>
		<view class="content">
			<view class="user-info">
				<image :src="memberInfo.head_portrait || missingFace" lazy-load></image>
				<view class="name">{{ memberInfo.nickname || memberInfo.realname || '暂无名称' }}</view>
			</view>
			<view v-if="memberInfo.promoter">
				<view v-if="memberInfo.promoterLevel" v-show="false">
					<dz-cell-item
						:title="'裂变分销下一级别升级条件'"
						:arrow="false"
						:border-bottom="false"
						:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
						hover-class="none"
					></dz-cell-item>
					<view v-if="!promoterUpgradeMax">
						<view v-if="promoterUpgrade.promoter_level">
							<dz-cell-item title="下一级别" :value="promoterUpgrade.promoter_level.name" :border-bottom="false" hoverClass="none" :arrow="false"></dz-cell-item>
							<view class="dz-m-l-20 dz-m-r-20 dz-m-b-20">
								<dz-table>
									<dz-tr><dz-th>升级条件</dz-th></dz-tr>
									<dz-tr v-for="(item, index) in promoterUpgrade.promoter_level.upgrade_condition" :key="index">
										<dz-td>{{ item }}</dz-td>
									</dz-tr>
								</dz-table>
							</view>
						</view>
					</view>
					<view v-else class="dz-text-center dz-p-20">当前已是最高级别</view>
					<dz-line></dz-line>
				</view>
				<view v-if="memberInfo.storeLevel">
					<dz-cell-item
						:title="'店铺分销下一级别升级条件'"
						:arrow="false"
						:border-bottom="false"
						:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
						hover-class="none"
					></dz-cell-item>
					<view v-if="!storeUpgradeMax">
						<view v-if="storeUpgrade.store_level">
							<dz-cell-item title="下一级别" :value="storeUpgrade.store_level.name" :border-bottom="false" hoverClass="none" :arrow="false"></dz-cell-item>
							<view class="dz-m-l-20 dz-m-r-20 dz-m-b-20">
								<dz-table>
									<dz-tr><dz-th>升级条件</dz-th></dz-tr>
									<dz-tr v-for="(item, index) in storeUpgrade.store_level.upgrade_condition" :key="index">
										<dz-td>{{ item }}</dz-td>
									</dz-tr>
								</dz-table>
							</view>
						</view>
					</view>
					<view v-else class="dz-text-center dz-p-20">当前已是最高级别</view>
					<dz-line></dz-line>
				</view>
				<dz-cell-item
					:title="'我的分销商数据'"
					:arrow="false"
					:border-bottom="true"
					:title-style="{ 'font-size': '32rpx', color: theme.dzMainColor, 'font-weight': '700' }"
					hover-class="none"
				></dz-cell-item>
				<dz-cell-item
					@tap="toPage('brokerage')"
					title="累计佣金"
					:value="memberInfo.promoter.accumulate_brokerage || '0'"
					:border-bottom="true"
					hoverClass="none"
				></dz-cell-item>
				<dz-cell-item @tap="toPage('brokerage')" title="可用佣金" :value="memberInfo.promoter.user_brokerage || '0'" :border-bottom="true" hoverClass="none"></dz-cell-item>
				<dz-cell-item @tap="toPage('brokerage')" title="冻结佣金" :value="memberInfo.promoter.user_brokerage || '0'" :border-bottom="true" hoverClass="none"></dz-cell-item>
				<dz-cell-item
					@tap="toPage('brokerage')"
					title="已提现佣金"
					:value="memberInfo.promoter.amount_drawn_brokerage || '0'"
					:border-bottom="true"
					hoverClass="none"
				></dz-cell-item>
				<dz-cell-item
					:arrow="false"
					title="裂变分销级别"
					:value="memberInfo.promoterLevel ? memberInfo.promoterLevel.name : '暂无级别'"
					:border-bottom="true"
					hoverClass="none"
				></dz-cell-item>
				<dz-cell-item
					:arrow="false"
					title="店铺分销级别"
					:value="memberInfo.storeLevel && memberInfo.promoter.store_level_id > 0 ? memberInfo.storeLevel.name : '暂无级别'"
					:border-bottom="true"
					hoverClass="none"
				></dz-cell-item>
				<dz-cell-item title="销售金额" :arrow="false" :value="memberInfo.promoter.sell_money || '0'" :border-bottom="true" hoverClass="none"></dz-cell-item>
				<dz-cell-item title="销售单数" :arrow="false" :value="memberInfo.promoter.sell_num || '0'" :border-bottom="true" hoverClass="none"></dz-cell-item>
				<dz-cell-item title="推广用户" :arrow="false" :value="memberInfo.promoter.child_num || '0'" :border-bottom="true" hoverClass="none"></dz-cell-item>
				<view v-if="dataConfig.distribution.statDetailShow">
					<dz-cell-item
						@tap="toPage('brokerage')"
						title="裂变分销佣金"
						:value="memberInfo.promoter.promoter_brokerage || '0'"
						:border-bottom="true"
						hoverClass="none"
					></dz-cell-item>
					<dz-cell-item
						@tap="toPage('brokerage')"
						title="店铺分销佣金"
						:value="memberInfo.promoter.store_brokerage || '0'"
						:border-bottom="true"
						hoverClass="none"
					></dz-cell-item>
					<dz-cell-item
						@tap="toPage('brokerage')"
						title="区域代理佣金"
						:value="memberInfo.promoter.regional_agent_brokerage || '0'"
						:border-bottom="true"
						hoverClass="none"
					></dz-cell-item>
				</view>
				<view v-if="dataConfig.distribution.areaAgentShow">
					<dz-cell-item
						:arrow="false"
						title="是否区域代理"
						:value="memberInfo.promoter.is_regional_agent == 1 ? '是' : '否'"
						:border-bottom="true"
						hoverClass="none"
					></dz-cell-item>
					<dz-cell-item
						:arrow="false"
						title="区域代理级别"
						v-if="memberInfo.promoter.is_regional_agent == 1"
						:value="memberInfo.promoter.regional_agent_level | regionalAgentLevelFilters"
						:border-bottom="true"
						hoverClass="none"
					></dz-cell-item>
					<dz-cell-item
						:arrow="false"
						title="区域代理地区"
						v-if="memberInfo.promoter.is_regional_agent == 1"
						:value="memberInfo.promoter.regional_agent_address_name"
						:border-bottom="true"
						hoverClass="none"
					></dz-cell-item>
				</view>
			</view>
			<view v-else class="dz-text-center dz-p-20">您还不是分销商</view>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			dataConfig: this.$api.dataConfig,
			missingFace: this.$api.assetsConfig.missingFace,
			memberInfo: {},
			loadingShow: true,
			loadingStatus: 'loading',
			storeUpgrade: {},
			storeUpgradeMax: false,
			promoterUpgrade: {},
			promoterUpgradeMax: false
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '分销商信息'
		});
		await this.$onLaunched;
		this.getMemberIndex();
	},
	filters: {
		regionalAgentLevelFilters(val) {
			switch (parseInt(val, 10)) {
				case 1:
					return '省代';
				case 2:
					return '市代';
				case 3:
					return '区代';
			}
		},
		stateFilters(val) {
			switch (parseInt(val)) {
				case 0:
					return '待审核';
				case -1:
					return '拒绝';
				case 1:
					return '已通过';
			}
		}
	},
	methods: {
		loadingClick() {
			this.getMemberIndex();
		},
		async getMemberIndex() {
			await this.$api.http
				.get(this.$api.apiDistribution.memberIndex)
				.then(res => {
					this.memberInfo = res.data;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
			await this.$api.http
				.get(this.$api.apiDistribution.storeNextLevel)
				.then(res => {
					if (res.data && JSON.stringify(res.data) != '[]') {
						this.storeUpgrade = res.data;
					} else {
						this.storeUpgradeMax = true;
					}
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
			// await this.$api.http.get(this.$api.apiDistribution.promoterNextLevel).then(res => {
			// 	if(res.data && JSON.stringify(res.data)!='[]'){
			// 		this.promoterUpgrade = res.data
			// 	}else{
			// 		this.promoterUpgradeMax=true;
			// 	}
			// }).catch(err=>{
			// 	this.loadingStatus = 'error';
			// });
			this.loadingShow = false;
		},
		toPage(url) {
			this.$api.router.push({
				route: this.$api.routesConfig[url]
			});
		}
	}
};
</script>

<style lang="scss">
page,
.content {
	background-color: #ffffff;
}
.user-info {
	padding: 60rpx 0;
	text-align: center;
	image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.name {
		margin-top: 20rpx;
		font-size: 36rpx;
		color: $dz-main-color;
	}
}

.flex-box {
	display: flex;
	flex-wrap: wrap;
}

.flex-box > .item-2 {
	flex: 0 0 50%;
}

.flex-box > .item-3 {
	flex: 0 0 33.3333%;
}

.flex-box > .item-4 {
	flex: 0 0 25%;
}

.title {
	margin: 30rpx 0;
	font-size: 32rpx;
	font-weight: 600;
	color: $dz-main-color;
}

//普通表格
.genaral-area {
	.item-2 {
		font-size: 26rpx;
		border: 1rpx solid $dz-border-color;
		border-width: 1rpx 1rpx 0 0;
		padding: 16rpx 0;
		box-sizing: border-box;
		text-align: center;

		&:first-child {
			border-left-width: 1rpx;
		}

		&:last-child {
			border-right-width: 1rpx;
		}
	}

	.thead {
		.item-2 {
			font-weight: bold;

			box-sizing: border-box;
		}
	}

	.table {
		&:last-child {
			border-bottom: 1rpx solid $dz-border-color;
		}

		.item-2 {
			display: flex;
			justify-content: center;
			align-items: center;
			box-sizing: border-box;
		}
	}
}

.item:last-child {
	border-bottom: none;
}
</style>
