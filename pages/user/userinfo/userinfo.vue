<template>
	<view>
		<dz-navbar :title="language.user.personalData"></dz-navbar>
		<dz-cell-group>
			<dz-cell-item center :title="language.user.mobile" :value="userInfo.mobile" :arrow="false"></dz-cell-item>
			<dz-cell-item center :title="language.user.nickname" :value="userInfo.nickname" @tap="nicknameTap"></dz-cell-item>
			<dz-cell-item center :title="language.user.realname" :value="userInfo.realname" @tap="realnameTap"></dz-cell-item>
			<dz-cell-item
				center
				:title="language.user.gender"
				:border-bottom="false"
				:value="userInfo.gender && genders[parseInt(userInfo.gender)].name"
				@tap="genderTap"
			></dz-cell-item>
		</dz-cell-group>
		<!-- 修改昵称 -->
		<dz-modal
			v-model="isNickname"
			:title="language.user.changeNickname"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="nicknameCancel"
			@confirm="nicknameConfirm"
		>
			<dz-field
				v-model="putNickname"
				:label="language.user.nickname"
				:placeholder="language.user.inputNickname"
				:border-bottom="false"
				maxlength="12"
				style="margin: 20rpx 0 10rpx;"
			></dz-field>
		</dz-modal>
		<!-- 修改真实姓名 -->
		<dz-modal
			v-model="isRealname"
			:title="language.user.changeRealname"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:show-cancel-button="true"
			@cancel="realnameCancel"
			@confirm="realnameConfirm"
		>
			<dz-field
				v-model="putRealname"
				:label="language.user.realname"
				:placeholder="language.user.inputRealname"
				:border-bottom="false"
				maxlength="12"
				style="margin: 20rpx 0 10rpx;"
			></dz-field>
		</dz-modal>
		<!-- 选择性别 -->
		<dz-modal
			v-model="isGender"
			:mask-close-able="false"
			:confirm-color="theme.dzBaseColor"
			:title="language.user.changeGender"
			:show-cancel-button="true"
			@cancel="genderCancel"
			@confirm="genderConfirm"
		>
			<view class="gender-box">
				<view
					class="gender-item"
					v-for="(item, index) in genders"
					:key="index"
					:style="{
						color: item.value == putGender ? item.iconColor : '',
						background: item.value == putGender ? item.activeColor : ''
					}"
					@tap="radioChange(item.value)"
				>
					<dz-icon :name="item.icon" size="36" :color="item.iconColor"></dz-icon>
					<text class="dz-m-l-10">{{ item.name }}</text>
				</view>
			</view>
		</dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			userInfo: {},
			putNickname: '',
			putRealname: '',
			putGender: '',
			isNickname: false,
			isRealname: false,
			isGender: false,
			genders: [
				{
					value: '0',
					name: this.$api.language.orderCreate.uncharted,
					icon: 'ask',
					iconColor: '#3BD4C6',
					activeColor: '#E3FCF9'
				},
				{
					value: '1',
					name: this.$api.language.user.man,
					icon: 'male',
					iconColor: '#65D1FF',
					activeColor: '#E6F7FF'
				},
				{
					value: '2',
					name: this.$api.language.user.woman,
					icon: 'female',
					iconColor: '#FB86A1',
					activeColor: '#FFEAEF'
				}
			]
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.user.personalData
		});
		await this.$onLaunched;
		this.getUserInfo();
	},
	methods: {
		async getUserInfo() {
			await this.$api.http.get(this.$api.apiShop.memberInfo).then(res => {
				this.userInfo = res.data;
				this.putNickname = res.data.nickname;
				this.putGender = res.data.gender;
				this.putRealname = res.data.realname;
			});
		},
		gender(type) {
			let gender;
			switch (type) {
				case 0:
					gender = this.$api.language.orderCreate.uncharted;
					break;
				case 1:
					gender = this.$api.language.user.man;
					break;
				case 2:
					gender = this.$api.language.user.woman;
					break;
			}
			return gender;
		},
		nicknameTap() {
			this.isNickname = true;
		},
		realnameTap() {
			if (this.userInfo.realname) {
				this.$refs.dzToast.show({
					title: this.language.user.realnameExist,
					type: 'warning'
				});
				return;
			}
			this.isRealname = true;
		},
		genderTap() {
			this.isGender = true;
		},
		radioChange(value) {
			this.putGender = value;
		},
		// 取消
		nicknameCancel() {
			this.isNickname = false;
		},
		realnameCancel() {
			this.isRealname = false;
		},
		genderCancel() {
			this.isGender = false;
		},
		// 确定
		async nicknameConfirm() {
			if (!this.putNickname) {
				this.$refs.dzToast.show({
					title: this.language.user.inputNickname,
					type: 'warning'
				});
				return;
			}
			await this.$api.http
				.put(
					this.$api.apiShop.memberUpdate,
					{
						nickname: this.putNickname
					},
					{
						params: {
							id: this.userInfo.id
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: this.language.user.modifiedDataSuccessfully,
						type: 'success'
					});
					this.userInfo.nickname = this.putNickname;
					this.$api.store.commit('setUserInfo', this.userInfo);
					this.isNickname = false;
				})
				.catch(err => {});
		},
		async genderConfirm() {
			await this.$api.http
				.put(
					this.$api.apiShop.memberUpdate,
					{
						gender: this.putGender
					},
					{
						params: {
							id: this.userInfo.id
						}
					}
				)
				.then(res => {
					this.$refs.dzToast.show({
						title: this.language.user.modifiedDataSuccessfully,
						type: 'success'
					});
					this.userInfo.gender = this.putGender;
					this.$api.store.commit('setUserInfo', this.userInfo);
					this.isGender = false;
				})
				.catch(err => {});
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
						title: this.language.user.modifiedDataSuccessfully,
						type: 'success'
					});
					this.userInfo.realname = this.putRealname;
					this.$api.store.commit('setUserInfo', this.userInfo);
					this.isRealname = false;
				})
				.catch(err => {});
		}
	}
};
</script>

<style lang="scss">
.gender-box {
	display: flex;
	justify-content: center;
	padding: 40rpx 20rpx;
}

.gender-item {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 136rpx;
	height: 76rpx;
	background-color: $dz-bg-color;
	border-radius: 15rpx;
	font-size: 28rpx;
	margin: 0 20rpx;
	transform: scale(0.9);
}
</style>
