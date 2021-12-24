<template>
	<view>
		<dz-navbar title="供应商入驻"></dz-navbar>
		<view v-if="isShow" class="dz-flex dz-flex-column dz-row-center" style="height: 100%;margin-top: 20%;">
			<view class="dz-m-b-10"><dz-icon name="round_rank_fill" size="200" color="#FFCA28"></dz-icon></view>
			<text>审核中</text>
			<view class="dz-font-24 dz-color-9">预计24小时内审核</view>
			<view class="dz-m-t-30">
				<dz-button
					size="medium"
					hoverClass="none"
					:border="false"
					shape="circle"
					:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }"
					@click="toBack()"
				>
					返回
				</dz-button>
			</view>
		</view>
		<block v-else>
			<view class="dz-supplier">
				<dz-form label-width="140">
					<dz-form-item label="公司名称" required><dz-input v-model="supplierForm.companyname" placeholder="请输入公司名称"></dz-input></dz-form-item>
					<dz-form-item label="营业执照" label-position="top" required>
						<view class="dz-uploader">
							<view class="uni-uploader-body">
								<dz-upload
									:custom-btn="true"
									:action="action"
									:header="header"
									:show-progress="false"
									@on-success="imgUploaded"
									max-count="9"
									@on-remove="imgRemove"
								>
									<view slot="addBtn" class="uploaderBtn">
										<view class="dzicon-iconfont dzicon-cameraadd"></view>
										<view>上传营业执照</view>
									</view>
								</dz-upload>
							</view>
						</view>
					</dz-form-item>
					<dz-form-item label="产品描述" label-position="top" required>
						<view class="dz-textarea"><dz-input v-model="supplierForm.content" type="textarea" placeholder="请输入产品描述"></dz-input></view>
					</dz-form-item>
				</dz-form>
			</view>
			<view class="dz-addr-save">
				<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" @click="submit()">入驻申请</dz-button>
			</view>
		</block>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			action: `${this.$api.appConfig.apiDomain}${this.$api.apiShop.uploadImage}`,
			header: { 'x-api-key': this.$api.store.state.accessToken },
			imageList: [],
			supplierForm: {
				companyname: '',
				license: [],
				content: '',
				status: 0,
				created_at: null
			},
			isShow: false
		};
	},
	computed: {
		...mapState(['supplier'])
	},
	async onLoad(e) {
		await this.$onLaunched;
		uni.setNavigationBarTitle({
			title: '供应商入驻'
		});

		if (this.supplier && JSON.stringify(this.supplier) != '{}') {
			if (this.supplier.status == 1) {
				this.isShow = true;
			}
		}
		let timeDay = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000;
	},

	methods: {
		// 图片上传成功
		imgUploaded(list) {
			this.imageList.push(list.data.url);
		},
		// 删除图片
		imgRemove(index, list, name) {
			this.imageList.splice(index, 1);
		},
		submit() {
			if (!this.$api.store.getters.hasLogin) {
				this.$api.router.push({
					route: this.$api.routesConfig.login
				});
				return;
			}
			if (!this.supplierForm.companyname) {
				return this.$refs.dzToast.show({
					title: '请输入公司名称',
					type: 'warning'
				});
			}
			if (this.imageList.length == 0) {
				return this.$refs.dzToast.show({
					title: '请上传营业执照',
					type: 'warning'
				});
			}
			if (!this.supplierForm.content) {
				return this.$refs.dzToast.show({
					title: '请输入产品描述',
					type: 'warning'
				});
			}
			uni.showLoading();
			this.supplierForm.license = this.imageList;
			this.supplierForm.status = 1;
			this.supplierForm.created_at = new Date().getTime() / 1000;
			this.$api.store.commit('setSupplier', this.supplierForm);
			setTimeout(() => {
				this.isShow = true;
				uni.hideLoading();
			}, 1000);
		},
		toBack() {
			// 获取当前页面栈，如果页面栈为1，则直接跳转到首页
			let pages = getCurrentPages();
			if (pages.length == 1) {
				this.$api.router.redirectTo({
					route: this.$api.routesConfig.index
				});
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.dz-supplier {
	padding: 0 30rpx;
	background-color: #ffffff;
}

.dz-uploader {
	.close-view {
		text-align: center;
		line-height: 28rpx;
		height: 32rpx;
		width: 32rpx;
		border-radius: 50%;
		position: absolute;
		top: -12rpx;
		right: -8rpx;
		font-size: 24rpx;
	}
	/* 上传 */
	.uni-uploader {
		flex: 1;
		flex-direction: column;
	}
	.uni-uploader-body {
		margin-top: 16rpx;
	}
}

.uploaderBtn {
	width: 200rpx;
	height: 200rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: $dz-bg-color;
	border-radius: 10rpx;
	overflow: hidden;
	margin: 10rpx;
	color: #c0c4cc;
	.dzicon-cameraadd {
		font-size: 60rpx;
	}
}
.dz-textarea {
	width: 100%;
	padding: 10rpx 15rpx;
	background: $dz-bg-color;
	border-radius: 15rpx;
}

.dz-addr-save {
	padding: 24rpx;
	margin-top: 100rpx;
	.btn {
		height: 80rpx;
		border-radius: 10rpx;
	}
}
</style>
