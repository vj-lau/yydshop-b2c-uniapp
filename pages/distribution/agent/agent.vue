<template>
	<view>
		<dz-navbar :title="navbarTitle" :borderBottom="false"></dz-navbar>
		<view style="position: fixed;width: 100%;z-index: 2;">
			<dz-tabs :list="tabList" :current="current" :is-scroll="false" bar-height="8" :active-color="theme.dzBaseColor" @change="tabChange"></dz-tabs>
			<view class="search-box" v-show="shopSetting.member_show_parent == 0 || current != 0">
				<view class="dz-top-item" @tap="dropdownTap">
					<text>等级</text>
					<text class="dzicon-iconfont" :class="selectHeight > 0 ? 'dzicon-fold' : 'dzicon-unfold'"></text>
				</view>
				<view class="dz-dropdownlist" :class="[selectHeight > 0 ? 'dz-dropdownlist-show' : '']" :style="{ height: selectHeight + 'rpx' }">
					<scroll-view :scroll-y="true" :style="{ height: selectHeight + 'rpx' }" :scroll-top="scrollTop" @scroll="scroll">
						<view
							class="dz-dropdownlist-item dz-icon-middle"
							:class="[item.selected ? 'dz-font-weight' : '']"
							v-for="(item, index) in dropdownList"
							:key="index"
							@tap.stop="dropdownItemTap"
							:data-index="index"
						>
							<text class="dz-ml dz-middle" :style="{ color: item.selected ? theme.dzBaseColor : '' }">{{ item.name }}</text>
							<text class="dzicon-iconfont dzicon-checkbox dz-font-36" :style="{ color: theme.dzBaseColor }" v-if="item.selected"></text>
						</view>
					</scroll-view>
				</view>
				<view class="dz-dropdownlist-mask" :class="[selectHeight > 0 ? 'dz-mask-show' : '']" @tap.stop="hideDropdownList"></view>
				<view class="search">
					<dz-search
						v-model="keyword"
						:placeholder="`输入${type ? '经' : '分'}销商的用户ID,昵称,电话号码`"
						@input="changeInput"
						@custom="search"
						@focus="inputFocus"
						@search="search"
						:show-action="true"
					></dz-search>
				</view>
			</view>
		</view>
		<view v-if="agentList.length > 0" class="card-box" :style="{ marginTop: tabList.length == 3 && current == 0 ? '80rpx' : '184rpx' }">
			<view v-if="state != 1" class="team-count dz-m-b-20">
				<view class="icon" :style="{ background: theme.dzBaseColor }"><dz-icon name="friendfill" size="50" color="#fff"></dz-icon></view>
				<view class="dz-flex-1">
					<view class="dz-font-32 dz-m-b-6">
						{{ type ? '经' : '分' }}销商共
						<text class="dz-font-weight" :style="{ color: theme.dzBaseColor, fontSize: '36rpx', margin: '0 8rpx' }">{{ teamCount }}</text>
						人
					</view>
				</view>
			</view>
			<view class="card-item" v-for="(item, index) in agentList" :key="index">
				<view class="img"><dz-image width="120rpx" height="120rpx" border-radius="60rpx" :src="item.head_portrait || missingFace"></dz-image></view>
				<view class="right">
					<view class="cell">
						<text>ID:</text>
						{{ item.id || '无' }}
					</view>
					<view class="name">
						昵称:
						<text>{{ item.realname || item.nickname || language.distribution.noName }}</text>
					</view>
					<view class="cell">
						<text>电话:</text>
						{{ item.mobile || '无' }}
					</view>
					<view v-if="state == 3" class="cell">
						<text>{{ language.distribution.theSuperiorId }}</text>
						{{ (item.baseParent && item.baseParent.id) || language.distribution.thereIsNo }}
					</view>
					<view v-if="state == 3" class="cell">
						<text>{{ language.distribution.theSuperiorNickname }}</text>
						{{ (item.baseParent && item.baseParent.nickname) || language.distribution.thereIsNo }}
					</view>
					<view v-if="item.level_name && item.promoter_state == 1" class="cell">
						<text>{{ type ? '经' : '分' }}销商等级:</text>
						{{ item.level_name }}
					</view>
					<view class="cell">
						<text>注册时间:</text>
						{{ item.created_at | timeFormat('yyyy-mm-dd') }}
					</view>
				</view>
			</view>
		</view>
		<dz-empty
			v-if="loadingStatus == 'noData'"
			margin-top="180"
			:text="state == 1 ? language.distribution.noReferences : language.distribution.noDistributorMemberAtThisLevel"
			:src="emptyUser"
			iconSize="360"
		></dz-empty>
		<dz-loadmore
			v-if="loadingStatus != 'noData'"
			:status="loadingStatus"
			:margin-top="agentList.length == 0 ? (tabList.length == 3 && current == 0 ? '90' : '200') : '20'"
			margin-bottom="20"
		></dz-loadmore>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			shopSetting: this.$api.shopSetting,
			navbarTitle: '',
			type: '',
			tabList: [
				{
					state: 1,
					name: this.$api.language.distribution.myReferences
				},
				{
					state: 2,
					name: this.$api.language.distribution.primaryDistributor
				},
				{
					state: 3,
					name: this.$api.language.distribution.secondaryDistributor
				}
			],
			current: 0,
			agentList: [],
			missingFace: this.$api.assetsConfig.missingFace,
			emptyUser: this.$api.assetsConfig.emptyUser,
			childType: 1,
			loadingStatus: 'loading',
			state: 1,
			teamCount: 0,
			keyword: '',
			isKeyword: false,
			selectHeight: 0,
			selectName: '全部',
			levelId: '',
			dropdownList: [],
			scrollTop: 0,
			isLoading: false
		};
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type ? '商家人脉' : this.$api.language.distribution.myTeam
		});
		this.navbarTitle = option.type ? '商家人脉' : this.$api.language.distribution.myTeam;
		if (option.type) {
			this.type = option.type;
			this.tabList = [
				{
					state: 1,
					name: '供货商'
				},
				{
					state: 2,
					name: '下级经销商'
				},
				{
					state: 3,
					name: '下下级经销商'
				}
			];
		}
		await this.$onLaunched;
		if (parseInt(this.shopSetting.member_show_parent) == 1) {
			this.tabChange(0);
		} else {
			this.tabList.splice(0, 1);
			this.tabChange(0);
		}
		this.getLevel();
	},
	filters: {
		mobileMask(val) {
			let reg = /^(\d{3})\d{4}(\d{4})$/;
			return val.replace(reg, '$1****$2');
		}
	},
	onPullDownRefresh() {
		this.page = 1;
		this.agentList.length = 0;
		this.teamCount = 0;
		this.inData(this.current);
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getDistributionMemberChild();
	},
	methods: {
		getDistributionMemberParent() {
			this.loadingStatus = 'loading';
			this.agentList.length = 0;
			this.isLoading = true;
			this.$api.http
				.get(this.$api.apiDistribution.distributionMemberParent)
				.then(res => {
					if (res.data != 0) {
						this.agentList.push(res.data);
					}
					this.loadingStatus = this.agentList.length == 0 ? 'noData' : 'nomore';
				})
				.finally(() => {
					this.isLoading = false;
				});
			uni.stopPullDownRefresh();
		},
		async getLevel() {
			let apiKey = 'promoterStoreLevelIndex';
			if (this.type) {
				apiKey = 'promoterWarehouseLevelIndex';
			}
			this.dropdownList = [
				{
					name: '全部',
					selected: true,
					value: ''
				}
			];
			await this.$api.http.get(this.$api.apiDistribution[apiKey]).then(res => {
				if (res.data.length) {
					res.data.forEach(item => {
						this.dropdownList.push({
							name: item.name,
							selected: false,
							value: item.id
						});
					});
				}
			});
		},
		tabChange(e) {
			if (this.isLoading) return;
			this.keyword = '';
			this.isKeyword = false;
			this.current = e;
			this.state = this.tabList[e].state;
			this.page = 1;
			this.agentList.length = 0;
			this.teamCount = 0;
			this.levelId = 0;
			this.scrollTop = 0;
			let list = this.dropdownList;
			for (let i = 0; i < list.length; i++) {
				if (i === 0) {
					list[i].selected = true;
				} else {
					list[i].selected = false;
				}
			}
			this.hideDropdownList();
			this.inData(e);
		},
		scroll(e) {
			this.scrollTop = e.target.scrollTop;
		},
		inData(e) {
			if (parseInt(this.shopSetting.member_show_parent) == 0) {
				e = e + 1;
			}
			this.agentList.length = 0;
			switch (e) {
				case 0:
					this.getDistributionMemberParent();
					break;
				case 1:
					this.childType = 1;
					this.getDistributionMemberChild();
					break;
				case 2:
					this.childType = 2;
					this.getDistributionMemberChild();
					break;
				default:
					this.getDistributionMemberParent();
					break;
			}
		},
		dropdownItemTap(e) {
			let index = parseInt(e.currentTarget.dataset.index);
			let list = this.dropdownList;
			for (let i = 0; i < list.length; i++) {
				if (i === index) {
					list[i].selected = true;
				} else {
					list[i].selected = false;
				}
			}
			this.dropdownList = list;
			this.selectHeight = 0;
			this.page = 1;
			this.agentList.length = 0;
			this.selectName = list[index].name;
			this.levelId = list[index].value;
			this.getDistributionMemberChild();
		},
		dropdownTap() {
			this.selectHeight = 370;
			if (this.dropdownList.length < 5) {
				this.selectHeight = this.dropdownList.length * 75;
			}
			this.tabIndex = 0;
			this.salesSort = '';
		},
		hideDropdownList() {
			this.selectHeight = 0;
		},
		getDistributionMemberChild() {
			this.loadingStatus = 'loading';
			let apiKey = 'distributionMemberStoreChild';
			if (this.type) {
				apiKey = 'distributionMemberWarehouseChild';
			}
			let query = {
				page: this.page,
				type: this.childType,
				page_size: this.$api.appConfig.pageSize
			};
			let params = {};
			if (this.levelId) {
				params.level_id = this.levelId;
			}
			if (this.keyword) {
				params.keyword = this.keyword;
			}
			this.isLoading = true;
			this.$api.http
				.post(this.$api.apiDistribution[apiKey] + `?page=${query.page}&page_size=${query.page_size}&type=${query.type}`, {
					...params
				})
				.then(res => {
					this.loadingStatus = res.data.list.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.agentList = [...this.agentList, ...res.data.list];
					this.teamCount = res.data.total_count;
					if (this.page == 1 && res.data.list.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					console.log(err);
					this.loadingStatus = 'loadmore';
				})
				.finally(() => {
					this.isLoading = false;
				});
			uni.stopPullDownRefresh();
		},
		// 控制清除搜索
		inputFocus() {
			this.isKeyword = true;
		},
		// 清除搜索
		changeInput() {
			if (!this.keyword && this.isKeyword) {
				this.search();
			}
		},
		// 确定搜索
		search() {
			this.agentList.length = 0;
			this.getDistributionMemberChild();
		}
	}
};
</script>

<style lang="scss" scoped>
.search-box {
	display: flex;
	align-items: center;
	padding: 20rpx 15rpx 20rpx 20rpx;
	background: #fff;
	.dz-top-item {
		height: 28rpx;
		line-height: 28rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		.iconfont {
			font-size: 36rpx;
			font-weight: 500;
		}
	}
	.dz-dropdownlist {
		width: 100%;
		position: absolute;
		background: #fff;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 10rpx;
		padding-bottom: 26rpx;
		left: 0;
		top: 168rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 99;
		.iconcheck {
			font-size: 32rpx;
			line-height: 88rpx;
		}
	}
	.dz-dropdownlist-show {
		visibility: visible;
	}
	.dz-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}
	.dz-mask-show {
		opacity: 1;
		visibility: visible;
	}
	.dz-dropdownlist-item {
		color: $dz-main-color;
		height: 70rpx;
		font-size: 28rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.search {
		flex: 1;
	}
}
.team-count {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background: #fff;
	border-radius: 20rpx;
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		border-radius: 15rpx;
	}
}

.card-box {
	margin-top: 184rpx;
	padding: 20rpx;
	.card-item {
		display: flex;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		background: #fff;
		color: #333;
		.img {
			flex-shrink: 0;
			width: 120rpx;
			height: 120rpx;
			border-radius: 60rpx;
			margin-right: 20rpx;
		}
		.name {
			color: #999;
			text {
				margin-left: 6rpx;
				font-size: 32rpx;
				color: #333;
			}
		}
		.cell {
			line-height: 46rpx;
			text {
				margin-right: 6rpx;
				color: #999;
			}
		}
		.time {
			color: #999;
		}
	}
	.card-item:last-child {
		margin-bottom: 0;
	}
}
</style>
