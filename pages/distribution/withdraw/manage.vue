<template>
	<view>
		<dz-navbar :title="title"></dz-navbar>
		<view class="content">
			<dz-form label-width="160">
				<dz-form-item label="真实姓名"><dz-input :disabled="true" :value="userInfo.realname" placeholder="请输入真实姓名"></dz-input></dz-form-item>
				<dz-form-item label="手机号"><dz-input v-model="bankAccountView.mobile" placeholder="请输入手机号码"></dz-input></dz-form-item>
				<dz-form-item label="账号类型">
					<text v-if="isAccount" style="color: #C0C4CC;">还未开启提现方式</text>
					<dz-radio-group v-else v-model="bankAccountView.account_type" style="padding: 20rpx;">
						<block v-for="(item, index) in manageType" :key="index">
							<dz-radio v-if="item.checked" :active-color="theme.dzBaseColor" :name="item.value" @change="groupChange(item)">
								<text style="font-size: 28rpx;">{{ item.name }}</text>
							</dz-radio>
						</block>
					</dz-radio-group>
				</dz-form-item>
				<dz-form-item label="支行信息" v-if="bankAccountView.account_type == 1">
					<dz-input v-model="bankAccountView.branch_bank_name" placeholder="请输入支行信息"></dz-input>
				</dz-form-item>
				<dz-form-item label="银行账号" v-if="bankAccountView.account_type == 1">
					<dz-input v-model="bankAccountView.account_number" placeholder="请输入银行账号"></dz-input>
				</dz-form-item>
				<dz-form-item label="支付宝账号" v-if="bankAccountView.account_type == 3">
					<dz-input v-model="bankAccountView.account_number" placeholder="请输入支付宝账号"></dz-input>
				</dz-form-item>
				<dz-form-item label="设置默认" :border-bottom="false">
					<dz-switch
						slot="right"
						v-model="bankAccountView.is_default == 1 ? true : false"
						:active-color="theme.dzBaseColor"
						@change="switchChange(bankAccountView.is_default)"
					></dz-switch>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="dz-m-t-80">
			<dz-button
				:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
				hover-class="none"
				:loading="loading"
				shape="circle"
				@click="sbumit"
			>
				提交
			</dz-button>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			title: '',
			manageType: [
				{
					value: '1',
					name: '银联卡',
					checked: true
				},
				{
					value: '2',
					name: '微信',
					checked: true
				},
				{
					value: '3',
					name: '支付宝',
					checked: true
				}
			],
			checked: false,
			bankAccountView: {
				account_type: '1',
				realname: this.$api.store.state.userInfo.realname,
				mobile: this.$api.store.state.userInfo.mobile,
				branch_bank_name: '',
				account_number: '',
				is_default: '',
				source: ''
			},
			isAccount: false,
			loading: false,
			loadingShow: true,
			loadingStatus: 'loading'
		};
	},
	computed: {
		...mapState(['userInfo'])
	},
	async onLoad(option) {
		await this.$onLaunched;
		this.title = '新增提现账号';
		if (option.type === 'edit') {
			this.title = '编辑提现账号';
			this.getBankAccountView(option.id);
		}
		this.type = option.type;
		this.source = option.source;
		uni.setNavigationBarTitle({
			title: this.title
		});
		this.getWithdrawConfig();
	},
	methods: {
		loadingClick() {
			this.getWithdrawConfig();
		},
		async getWithdrawConfig() {
			await this.$api.http
				.get(this.$api.apiDistribution.withdrawConfig)
				.then(res => {
					if (res.data.commission_withdraw_union != 1) {
						this.manageType[0].checked = false;
					}
					if (res.data.commission_withdraw_wechat != 1) {
						this.manageType[1].checked = false;
					}
					if (res.data.commission_withdraw_ali != 1) {
						this.manageType[2].checked = false;
					}
					const list = this.manageType.filter(item => item.checked == true);
					if (list.length > 1) {
						this.bankAccountView.account_type = list[0].value;
					}
					if (res.data.commission_withdraw_union != 1 && res.data.commission_withdraw_wechat != 1 && res.data.commission_withdraw_ali != 1) {
						this.isAccount = true;
					}
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
		},
		async getBankAccountView(id) {
			this.$api.http
				.get(this.$api.apiDistribution.bankAccountView, {
					params: {
						id
					}
				})
				.then(res => {
					this.bankAccountView = res.data;
				});
		},
		// 监听反馈类型事件
		groupChange(e) {
			this.bankAccountView.account_type = e.value;
		},
		// 设置默认
		switchChange(e) {
			if (e == 1) {
				this.bankAccountView.is_default = 0;
			} else {
				this.bankAccountView.is_default = 1;
			}
		},
		// 提交
		sbumit() {
			let data = this.bankAccountView;
			if (!data.realname) {
				this.$refs.dzToast.show({
					title: '请填写真实姓名',
					type: 'warning'
				});
				return;
			}
			if (!/^1\d{10}$/.test(data.mobile)) {
				this.$refs.dzToast.show({
					title: '请输入正确的手机号码',
					type: 'warning'
				});
				return;
			}
			if (parseInt(data.account_type) == 1) {
				if (!data.branch_bank_name) {
					this.$refs.dzToast.show({
						title: '请填写支行信息',
						type: 'warning'
					});
					return;
				}
				if (!data.account_number) {
					this.$refs.dzToast.show({
						title: '请填写银行账号',
						type: 'warning'
					});
					return;
				}
			}
			if (parseInt(data.account_type) == 3) {
				if (!data.account_number) {
					this.$refs.dzToast.show({
						title: '请填写支付宝账号',
						type: 'warning'
					});
					return;
				}
			}
			if (this.type === 'edit') {
				this.bankAccountUpdate(data);
			} else {
				this.bankAccountCreate(data);
			}
		},
		async bankAccountUpdate(data) {
			this.loading = true;
			await this.$api.http
				.put(this.$api.apiDistribution.bankAccountUpdate, data, {
					params: {
						id: data.id
					}
				})
				.then(res => {
					this.loading = false;
					this.$refs.dzToast.show({
						title: '修改成功',
						type: 'success'
					});
					setTimeout(() => {
						if (this.source) {
							uni.$emit('getBankAccount', res.data);
							this.$api.router.back(2);
						} else {
							uni.$emit('bankAccountChange', {});
							this.$api.router.back();
						}
					}, 1000);
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 创建
		async bankAccountCreate(data) {
			this.loading = true;
			this.$api.http
				.post(this.$api.apiDistribution.bankAccountCreate, {
					...data
				})
				.then(res => {
					this.loading = false;
					this.$refs.dzToast.show({
						title: '创建成功',
						type: 'success'
					});
					setTimeout(() => {
						if (this.source) {
							uni.$emit('getBankAccount', res.data);
							this.$api.router.back(2);
						} else {
							uni.$emit('bankAccountChange', {});
							this.$api.router.back();
						}
					}, 1000);
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding: 0 30rpx;
	background-color: #fff;
}
</style>
