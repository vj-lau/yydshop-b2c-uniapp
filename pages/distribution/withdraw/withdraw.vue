<template>
	<view class="withdraw">
		<dz-navbar :title="'提现账号'"></dz-navbar>
		<view class="dz-list" v-if="bankAccountList.length > 0">
			<view v-for="(item, index) in bankAccountList" :key="index">
				<dz-swipe-action class="swipe-action" :index="index" :show="item.show" :key="item.id" :options="actionOptions" @click="actionClick(item.id)" @open="open">
					<view class="dz-list-item" @tap="checkBankAccount(item)">
						<view class="mid">
							<view class="t-box">
								<text v-if="parseInt(item.is_default) === 1" class="tag" :style="{ color: theme.dzBaseColor, borderColor: theme.dzBaseColor }">
									{{ language.invoice.tolerant }}
								</text>
								<view class="dzicon-iconfont dzicon-card_fill" v-if="item.account_type == 1"></view>
								<view class="dzicon-iconfont dzicon-wechat" v-if="item.account_type == 2"></view>
								<view class="dzicon-iconfont dzicon-alip" v-if="item.account_type == 3"></view>
								<text>{{ item.account_type_name }} {{ item.account_number || item.ali_number || '' }}</text>
							</view>
							<view class="u-box">
								<text class="name">{{ item.realname }}</text>
								<text class="name">{{ item.branch_bank_name }}</text>
								<text>{{ item.mobile }}</text>
							</view>
						</view>
						<view class="right"><text class="dzicon-iconfont dzicon-post" @tap.stop="addWithdraw('edit', item.id)"></text></view>
					</view>
				</dz-swipe-action>
			</view>
		</view>
		<view class="footer-btn">
			<view class="fonter-bottom">
				<view style="width: 90%;">
					<dz-button
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						shape="circle"
						:border="false"
						@click="addWithdraw('add')"
					>
						新建账号
					</dz-button>
				</view>
			</view>
		</view>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="20" margin-bottom="140"></dz-loadmore>
		<dz-empty :text="'暂无提现账号,去添加吧~'" v-if="loadingStatus == 'noData'" marginTop="80" :src="empty" iconSize="360"></dz-empty>
		<dz-modal :value="isModal" :showCancelButton="true" @confirm="confirm" @cancel="cancel" :content="'确定要删除该提现账号吗'"></dz-modal>
		<!-- 修改真实姓名 -->
		<dz-modal
			v-model="isRealname"
			:title="'真实姓名'"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="realnameCancel"
			@confirm="realnameConfirm"
		>
			<view class="dz-p-20 dz-text-center dz-font-xs dz-type-info">增加提现账号前请先实名</view>
			<dz-field v-model="putRealname" :label="'真实姓名'" :placeholder="'请输入真实姓名'" :border-bottom="false" maxlength="12" style="margin: 0 0 10rpx;"></dz-field>
		</dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			empty: this.$api.assetsConfig.empty,
			loading: false,
			loadingStatus: 'loading',
			page: 1,
			bankAccountList: [],
			actionOptions: [
				{
					text: this.$api.language.application.delete,
					style: {
						backgroundColor: this.$api.theme.dzTypeError
					}
				}
			],
			isModal: false,
			delId: '',
			source: '',
			isRealname: false,
			putRealname: ''
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	async onLoad(option) {
		uni.setNavigationBarTitle({
			title: '提现账号'
		});
		await this.$onLaunched;
		uni.$on('bankAccountChange', data => {
			this.initData();
		});
		this.source = option.source;
		this.initData();
	},
	onUnload() {
		uni.$off('bankAccountChange');
	},
	onPullDownRefresh() {
		this.initData();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingStatus === 'nomore') return;
		this.page++;
		this.getBankAccountIndex();
	},
	methods: {
		...mapMutations(['setUserInfo']),
		initData() {
			this.page = 1;
			this.bankAccountList.length = 0;
			this.loadingStatus = 'loading';
			this.getBankAccountIndex();
		},
		async getBankAccountIndex() {
			await this.$api.http
				.get(this.$api.apiDistribution.bankAccountIndex, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					res.data.forEach(item => {
						item.show = false;
					});
					this.loadingStatus = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.bankAccountList = [...this.bankAccountList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(() => {});
			uni.stopPullDownRefresh();
		},
		open(index) {
			this.bankAccountList[index].show = true;
			this.bankAccountList.map((val, key) => {
				if (index != key) this.bankAccountList[key].show = false;
			});
		},
		actionClick(id) {
			this.isModal = true;
			this.delId = id;
		},
		// 选择提现账号
		checkBankAccount(item) {
			if (this.source) {
				uni.$emit('getBankAccount', item);
				this.$api.router.back();
			}
		},
		confirm() {
			this.bankAccountDel(this.delId);
		},
		cancel() {
			this.isModal = false;
		},
		async bankAccountDel(id) {
			await this.$api.http
				.delete(
					this.$api.apiDistribution.bankAccountDelete,
					{},
					{
						params: {
							id: id
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: this.language.invoice.delOk,
						type: 'success'
					});
					this.initData();
					uni.$emit('updateBankAccount');
					this.isModal = false;
				})
				.catch(err => {
					this.isModal = false;
				});
		},
		addWithdraw(type, id) {
			if (!this.userInfo.realname) {
				this.isRealname = true;
				return;
			}
			this.$api.router.push({
				route: this.$api.routesConfig.distributionWithdrawManage,
				query: {
					type,
					id,
					source: this.source
				}
			});
		},
		realnameCancel() {
			this.isRealname = false;
		},
		async realnameConfirm() {
			if (this.userInfo.realname) {
				this.$refs.dzToast.show({
					title: this.language.user.realnameExist,
					type: 'warning'
				});
				return;
			}
			if (!this.putRealname) {
				this.$refs.dzToast.show({
					title: this.language.user.inputRealname,
					type: 'warning'
				});

				return;
			}
			await this.$api.http
				.put(this.$api.apiShop.memberRealnameUpdate, {
					realname: this.putRealname
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: '设置用户资料成功',
						type: 'success'
					});
					let info = this.userInfo;
					info.realname = this.putRealname;
					this.$api.store.commit('setUserInfo', info);
					this.isRealname = false;
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.dz-list {
	.dz-list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		margin: 20rpx;
	}
}
.t-box {
	display: flex;
	align-items: center;
	font-size: 30rpx;
	color: #303133;
	.tag {
		font-size: 22rpx;
		padding: 0 18rpx;
		border-radius: 24rpx;
		margin-right: 20rpx;
		border-width: 1rpx;
		border-style: solid;
	}
	.dzicon-iconfont {
		margin-right: 10rpx;
		font-size: 40rpx;
	}
	.dzicon-alip {
		color: #00a0e9;
	}
	.dzicon-card_fill {
		color: #fdc561;
	}
	.dzicon-wechat {
		color: $dz-type-success;
	}
}
.u-box {
	font-size: 28rpx;
	color: $dz-tips-color;
	margin-top: 16rpx;
	.name {
		margin-right: 30rpx;
	}
}

.footer-btn {
	position: fixed;
	z-index: 99;
	width: 100%;
	background-color: #fff;
	bottom: 0;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	.fonter-bottom {
		width: 100%;
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: env(safe-area-inset-bottom);
	}
}

.swipe-action {
	border-bottom: 1rpx solid $dz-border-color;
	width: 100%;
}
</style>
