<template>
	<view>
		<dz-navbar :title="type ? '货款转赠' : '佣金转赠'"></dz-navbar>
		<view class="form-box">
			<dz-form labelWidth="200">
				<!-- <dz-form-item v-if="transferConfig.commission_transfer_fee_ratio || transferConfig.commission_transfer_single_fee">
					<text>佣金转赠手续费</text>
					<view class="dz-m-l-10">
						<text v-if="transferConfig.commission_transfer_fee_ratio" :style="{ color: theme.dzBaseColor }">{{ transferConfig.commission_transfer_fee_ratio }}%</text>
						<text v-if="transferConfig.commission_transfer_fee_ratio && transferConfig.commission_transfer_single_fee" class="dz-m-10">+</text>
						<text :style="{ color: theme.dzBaseColor }">{{ transferConfig.commission_transfer_single_fee }} 元</text>
					</view>
				</dz-form-item> -->
				<dz-form-item label="收款人ID：">
					<dz-input v-model="reciveId" placeholder="请输入收款人ID"></dz-input>
					<dz-button
						slot="right"
						size="mini"
						:border="false"
						:custom-style="{ background: '#fff', border: '1rpx solid rgba(0,0,0,0.12)' }"
						hover-class="none"
						@click="verification"
					>
						验证
					</dz-button>
				</dz-form-item>
				<dz-form-item label="收款人信息：" v-if="showReciver">
					<view class="user-info">
						<image :src="reciverInfo.head_portrait || missingFace"></image>
						<view>
							<view class="light">
								<view class="dz-m-r-6">用户名:</view>
								<view class="dz-line-1" style="max-width: 290rpx;">{{ reciverInfo.nickname }}</view>
							</view>
							<view class="light">
								<view class="dz-m-r-6">手机号:</view>
								<view>{{ reciverInfo.mobile }}</view>
							</view>
						</view>
					</view>
				</dz-form-item>
				<dz-form-item label="转赠金额：">
					<dz-input v-model="num" placeholder="请输入转赠金额"></dz-input>
					<view></view>
				</dz-form-item>
				<dz-form-item label="支付密码：">
					<dz-input type="password" v-model="password" placeholder="请输入支付密码"></dz-input>
					<view></view>
				</dz-form-item>
				<dz-form-item label="验证码：">
					<dz-input type="text" v-model="code" :placeholder="language.modifyPassword.codeHolder" />
					<dz-button
						slot="right"
						size="mini"
						:border="false"
						:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
						hover-class="none"
						:disabled="waitingCaptcha"
						@click="getCode"
					>
						{{ waitingCaptcha ? $api.helper.formatString(language.modifyPassword.getCaptchaLater, waitingSecond) : language.modifyPassword.getCaptcha }}
					</dz-button>
				</dz-form-item>
			</dz-form>
		</view>
		<view class="tip" :style="{ color: theme.dzBaseColor }">
			<view>可赠{{ type ? '货款' : '佣金' }}：{{ transferConfig.promoter && transferConfig.promoter.user_brokerage }}</view>
			<view>
				单次转赠金额范围：{{ parseFloat(transferConfig.commission_transfer_lowest_money).toFixed(2) }}
				<text class="dz-color-9 dz-p-6">-</text>
				<text>
					{{ parseFloat(transferConfig.commission_transfer_highest_money) > 0 ? parseFloat(transferConfig.commission_transfer_highest_money).toFixed(2) : '不限' }}
				</text>
			</view>
		</view>
		<view v-if="transferConfig.commission_transfer_desc" class="dz-p-l-30 dz-p-r-30 dz-color-9">
			<view v-for="(item, index) in transferConfig.commission_transfer_desc" :key="index">{{ item }}</view>
		</view>
		<view class="footer">
			<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, marginBottom: '20rpx' }" hover-class="none" @click="submit">
				确定
			</dz-button>
			<text @tap="toPage('setPayPswHash')">修改支付密码</text>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
		<dz-page-loading :show="loadingShow" :status="pageLoadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			type: '',
			reciveId: '',
			num: '',
			password: '',
			code: '',
			waitingCaptcha: false,
			waitingSecond: this.$api.appConfig.loginCodeSecond,
			missingFace: this.$api.assetsConfig.missingFace,
			timeInterval: null,
			reciverInfo: {},
			user_brokerage: '',
			showReciver: false,
			areaCode: this.$api.store.state.userInfo.mobile_area,
			transferConfig: {},
			loadingShow: true,
			pageLoadingStatus: 'loading'
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
			title: option.type ? '货款转赠' : '佣金转赠'
		});
		if (option.type) {
			this.type = option.type;
		}
		this.getConfig();
	},
	onShow() {
		this.computeLastCaptcha();
	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		loadingClick() {
			this.getConfig();
		},
		computeLastCaptcha() {
			if (this.timeInterval) {
				return;
			}
			this.lastCaptchaTimeStamp = this.$api.store.state.lastCaptchaTimeStamp;
			let timeNow = parseInt(new Date().getTime() / 1000);
			let timeDiff = timeNow - this.lastCaptchaTimeStamp;
			if (timeDiff < this.$api.appConfig.loginCodeSecond && timeDiff >= 0) {
				this.waitingCaptcha = true;
				this.waitingSecond = this.$api.appConfig.loginCodeSecond - timeDiff;
				this.timeInterval = setInterval(() => {
					this.waitingSecond--;
					if (this.waitingSecond <= 0) {
						this.waitingCaptcha = false;
						clearInterval(this.timeInterval);
						this.timeInterval = null;
					}
				}, 1000);
			} else {
				this.waitingCaptcha = false;
			}
		},
		async getCode() {
			await this.verification();
			if (!this.reciveId)
				return this.$refs.dzToast.show({
					title: '请输入收款人ID',
					type: 'warning'
				});
			if (this.reciveId == this.userInfo.id)
				return this.$refs.dzToast.show({
					title: '收款人不能为自己',
					type: 'warning'
				});
			if (!this.showReciver)
				return this.$refs.dzToast.show({
					title: '请先验证收款人',
					type: 'warning'
				});

			if (!this.num || this.num == 0) {
				this.$refs.dzToast.show({
					title: '请输入转赠金额',
					type: 'warning'
				});
				this.num = '';
				return;
			}
			if (Number(this.user_brokerage) < Number(this.num))
				return this.$refs.dzToast.show({
					title: '佣金余额不足',
					type: 'warning'
				});

			if (this.password.length == 0)
				return this.$refs.dzToast.show({
					title: '请输入支付密码',
					type: 'warning'
				});
			if (this.password.length < 6)
				return this.$refs.dzToast.show({
					title: '请输入正确的支付密码',
					type: 'warning'
				});
			uni.showLoading({
				title: this.$api.language.thirdPartyLogin.codeLoading
			});
			this.$api.http
				.post(this.$api.apiShop.smsCode, {
					mobile: this.userInfo.mobile,
					mobile_area: this.areaCode,
					usage: 'transfer-commission'
				})
				.then(res => {
					uni.hideLoading();
					this.$api.store.commit('setLastCaptchaTimeStamp', parseInt(new Date().getTime() / 1000));
					this.computeLastCaptcha();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		async verification() {
			if (!this.reciveId) {
				this.$refs.dzToast.show({
					title: '请输入收款人ID',
					type: 'warning'
				});
				return;
			}
			await this.$api.http
				.get(this.$api.apiDistribution.findReciver, {
					params: {
						id: this.reciveId
					}
				})
				.then(res => {
					if (res.data.id == null) {
						this.$refs.dzToast.show({
							title: '请输入正确的ID',
							type: 'warning'
						});
						this.showReciver = false;
						return;
					}
					this.reciverInfo = res.data;
					this.showReciver = true;
				});
		},
		async submit() {
			await this.verification();
			if (!this.reciveId)
				return this.$refs.dzToast.show({
					title: '请输入收款人ID',
					type: 'warning'
				});
			if (this.reciveId == this.userInfo.id)
				return this.$refs.dzToast.show({
					title: '收款人不能为自己',
					type: 'warning'
				});
			if (!this.showReciver)
				return this.$refs.dzToast.show({
					title: '请先验证收款人',
					type: 'warning'
				});
			if (!this.num || this.num == 0) {
				this.$refs.dzToast.show({
					title: '请输入转赠金额',
					type: 'warning'
				});
				this.num = '';
				return;
			}
			if (Number(this.user_brokerage) < Number(this.num))
				return this.$refs.dzToast.show({
					title: '佣金余额不足',
					type: 'warning'
				});
			if (this.password.length == 0)
				return this.$refs.dzToast.show({
					title: '请输入支付密码',
					type: 'warning'
				});
			if (this.password.length < 6)
				return this.$refs.dzToast.show({
					title: '请输入正确的支付密码',
					type: 'warning'
				});
			if (!this.code)
				return this.$refs.dzToast.show({
					title: '请输入验证码',
					type: 'warning'
				});
			await this.$api.http
				.post(this.$api.apiDistribution.transferCreate, {
					receiver_id: this.reciveId,
					code: this.code,
					money: this.num,
					pay_password: this.password
				})
				.then(res => {
					this.$refs.dzToast.show({
						title: '转赠成功',
						type: 'success'
					});
					setTimeout(() => {
						this.$api.router.redirectTo({
							route: this.$api.routesConfig[this.type ? 'cloudWarehouse' : 'distribution']
						});
					}, 1000);
				});
		},
		async getConfig() {
			this.loadingShow = true;
			await this.$api.http
				.get(this.$api.apiDistribution.transferConfig)
				.then(res => {
					this.transferConfig = res.data;
					// if (!this.transferConfig.member.pay_password_hash) {
					// 	this.toPage('setPayPswHash', 'add');
					// }
					this.transferConfig.commission_transfer_desc = this.transferConfig.commission_transfer_desc.split(/[\n]/g);

					this.user_brokerage = this.transferConfig.promoter.user_brokerage;
					this.transfer_min_balance = res.data.commission_transfer_lowest_money;

					this.loadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
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
.form-box {
	padding: 20rpx;
	background: #fff;
	.user-info {
		display: flex;
		align-items: center;
		image {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			border-radius: 40rpx;
		}
		color: #333;
		text {
			margin-right: 6rpx;
			color: #999;
		}
		.light {
			display: flex;
			align-items: center;
			height: 55rpx;
		}
	}
}
.tip {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	font-size: 24rpx;
}
.footer {
	padding: 0 30rpx;
	margin-top: 60rpx;
	text-align: right;
	text {
		color: #999;
	}
}
</style>
