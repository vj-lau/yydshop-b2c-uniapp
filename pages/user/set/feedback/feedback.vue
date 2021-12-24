<template>
	<view>
		<dz-navbar :title="language.user.feedback"></dz-navbar>
		<view class="feedback-title">
			<text>{{ language.user.questionsAndComments }}</text>
			<view class="feedback-quick" @tap="chooseMsg">
				<text>{{ language.user.fastTyping }}</text>
				<text class="dzicon-iconfont dzicon-unfold"></text>
			</view>
		</view>
		<view class="feedback-body"><textarea :placeholder="language.user.fastTyping" v-model="sendDate.content" class="feedback-textare" /></view>
		<view class="feedback-title">
			<text>{{ language.user.inputFeedbackText }}</text>
		</view>
		<view class="feedback-body feedback-uploader dz-uploader">
			<view class="uni-uploader">
				<view class="uni-uploader-head">
					<view class="uni-uploader-title">{{ language.user.previewImage }}</view>
					<view class="uni-uploader-info">{{ imageList.length }}/9</view>
				</view>
				<view class="uni-uploader-body">
					<dz-upload :custom-btn="true" :action="action" :header="header" :show-progress="false" @on-success="imgUploaded" max-count="9" @on-remove="imgRemove">
						<view slot="addBtn" class="uploaderBtn">
							<view class="dzicon-iconfont dzicon-cameraadd"></view>
							<view>{{ language.user.addImage }}</view>
						</view>
					</dz-upload>
				</view>
			</view>
		</view>
		<view class="feedback-title">
			<text>{{ language.user.feedbackType }}</text>
		</view>
		<view class="feedback-body" style="padding: 20rpx;">
			<dz-radio-group v-model="sendDate.type">
				<dz-radio :active-color="theme.dzBaseColor" v-for="(item, index) in feedbackType" :key="index" :name="item.value" @change="feedbackGroupChange(item)">
					<text style="font-size: 28rpx;">{{ item.name }}</text>
				</dz-radio>
			</dz-radio-group>
		</view>
		<view class="feedback-title">
			<text>{{ language.user.qqEmailMobile }}</text>
		</view>
		<view class="feedback-body" style="padding: 10rpx 20rpx;">
			<dz-input v-model="sendDate.contact_way" :placeholder="language.user.contactWithYou" style="font-size: 24rpx;"></dz-input>
		</view>
		<view class="confirm-btn">
			<dz-button
				:custom-style="{ background: btnLoading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '100%' }"
				hover-class="none"
				:border="false"
				:loading="btnLoading"
				@click="send"
			>
				{{ language.user.submit }}
			</dz-button>
		</view>
		<dz-select v-model="msgSelect" :safe-area-inset-bottom="true" :list="msgContents" @confirm="msgConfirm"></dz-select>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			msgContents: [
				{
					value: '0',
					label: this.$api.language.user.interfaceDisplayDisorder
				},
				{
					value: '1',
					label: this.$api.language.user.slowStart
				},
				{
					value: '2',
					label: this.$api.language.user.UI
				},
				{
					value: '3',
					label: this.$api.language.user.accidentalCollapse
				},
				{
					value: '4',
					label: this.$api.language.user.dataCalculationError
				}
			],
			msgSelect: false,
			action: `${this.$api.appConfig.apiDomain}${this.$api.apiShop.uploadImage}`,
			header: { 'x-api-key': this.$api.store.state.accessToken },
			imageList: [],
			feedbackType: [
				{
					value: '1',
					name: this.$api.language.user.featureSuggestions
				},
				{
					value: '2',
					name: this.$api.language.user.bugFeedback
				},
				{
					value: '3',
					name: this.$api.language.user.information
				}
			],
			sendDate: {
				type: '1',
				covers: '',
				content: '',
				contact_way: ''
			},
			btnLoading: false
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: this.$api.language.user.feedback
		});
		await this.$onLaunched;
	},
	methods: {
		// 监听反馈类型事件
		feedbackGroupChange(e) {
			this.sendDate.type = e.value;
		},
		// 图片上传成功
		imgUploaded(list) {
			this.imageList.push(list.data.url);
		},
		// 删除图片
		imgRemove(index, list, name) {
			this.imageList.splice(index, 1);
		},
		// 快速输入
		chooseMsg() {
			this.msgSelect = true;
		},
		msgConfirm(e) {
			this.sendDate.content = e[0].label;
		},
		// 发送反馈
		async send() {
			if (this.btnLoading) {
				return;
			}
			if (!this.sendDate.content) {
				this.$refs.dzToast.show({
					title: '请输入反馈内容',
					type: 'warning'
				});
				return;
			}
			this.btnLoading = true;
			this.sendDate.covers = JSON.stringify(this.imageList);
			await this.$api.http
				.post(this.$api.apiShop.opinionCreate, {
					...this.sendDate
				})
				.then(res => {
					this.btnLoading = false;
					this.$api.helper.toast(this.language.user.feedbackTip);
					setTimeout(() => {
						this.$api.router.back();
					}, 1000);
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
.feedback-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	color: $dz-main-color;
	font-size: 28rpx;
}

.feedback-quick {
	display: flex;
	align-items: center;
	.iconfont {
		font-size: 24rpx;
	}
}

.feedback-body {
	background: #fff;
	margin: 0 24rpx;
	border-radius: 20rpx;
}
.feedback-textare {
	height: 200rpx;
	font-size: 28rpx;
	line-height: 50rpx;
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx 30rpx 0;
}
.uni-textarea-placeholder {
	color: rgb(192, 196, 204);
}
/* 上传 */
.uni-uploader {
	flex: 1;
	flex-direction: column;
}

.uni-uploader-head {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 30rpx;
	color: rgb(192, 196, 204);
	font-size: 28rpx;
}
.uploaderBtn {
	width: 200rpx;
	height: 200rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #f4f5f6;
	border-radius: 15rpx;
	overflow: hidden;
	margin: 10rpx;
	.dzicon-cameraadd {
		font-size: 48rpx;
	}
}

.uni-uploader {
	padding: 20rpx;
}
.confirm-btn {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 40rpx;
	padding: 0 20rpx;
}
</style>
