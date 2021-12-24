<template>
	<view class="invoice-list">
		<dz-navbar input-align="center" :title="language.invoice.invoiceManagement"></dz-navbar>
		<view class="dz-list" v-if="invoiceList.length > 0">
			<view v-for="(item, index) in invoiceList" :key="index">
				<dz-swipe-action
					style="border-bottom: 1rpx solid #f3f3f3;"
					:index="index"
					:show="item.show"
					:key="item.id"
					:options="actionOptions"
					@click="actionClick(item.id)"
					@open="open"
				>
					<view class="dz-list-item" @tap="checkInvoice(item)">
						<view class="mid">
							<view class="t-box">
								<text v-if="parseInt(item.is_default) === 1" class="tag" :style="{ color: theme.dzBaseColor, borderColor: theme.dzBaseColor }">
									{{ language.invoice.tolerant }}
								</text>
								<text>{{ language.invoice.invoiceTitle }} {{ item.title }}</text>
							</view>
							<view class="u-box">
								[{{ parseInt(item.type) === 1 ? language.invoice.company : language.invoice.name }}] —
								{{ item.duty_paragraph || language.invoice.personalInvoicesHaveNoTaxNumber }}
							</view>
						</view>
						<view class="dz-p-l-30 dz-p-t-20 dz-p-b-20" @tap.stop="addInvoice('edit', item.id)"><dz-icon name="post" size="40" color="#999"></dz-icon></view>
					</view>
				</dz-swipe-action>
			</view>
		</view>
		<dz-loadmore v-if="loadingType != 'nodata'" :status="loadingType" margin-top="20" margin-bottom="150"></dz-loadmore>
		<view class="add-btn-wrapper">
			<dz-button :border="false" :custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor }" hover-class="none" @click="addInvoice('add')">
				{{ language.invoice.addInvoice }}
			</dz-button>
		</view>
		<view>
			<dz-modal :value="isModal" :showCancelButton="true" @confirm="confirm" @cancel="cancel" :content="language.invoice.delInvoice"></dz-modal>
			<dz-empty :text="language.invoice.noInvoice" v-if="loadingType == 'nodata'" marginTop="80" :src="emptyOrder" iconSize="360"></dz-empty>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			emptyOrder: this.$api.assetsConfig.emptyOrder,
			timeOutEvent: 0,
			source: 0,
			invoiceList: [],
			page: 1,
			loadingType: 'loading',
			loading: false,
			isModal: false,
			delId: '',
			actionOptions: [
				{
					text: this.$api.language.application.delete,
					style: {
						backgroundColor: this.$api.theme.dzTypeError
					}
				}
			],
			data: null
		};
	},
	onShow() {},
	async onLoad(e) {
		uni.setNavigationBarTitle({
			title: this.language.invoice.invoiceManagement
		});

		this.source = e.source;

		await this.$onLaunched;

		uni.$on('invoiceChange', data => {
			this.initData();
		});
		this.initData();
	},
	onUnload() {
		uni.$off('invoiceChange');
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.page = 1;
		this.invoiceList.length = 0;
		this.getInvoiceList();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.page++;
		this.getInvoiceList();
	},
	methods: {
		actionClick(id) {
			this.isModal = true;
			this.delId = id;
		},
		open(index) {
			this.invoiceList[index].show = true;
			this.invoiceList.map((val, key) => {
				if (index != key) this.invoiceList[key].show = false;
			});
		},
		confirm() {
			this.$refs.dzToast.show({
				title: this.$api.language.invoice.delOk,
				type: 'success'
			});
			this.handleInvoiceDel(this.delId);
		},
		cancel() {
			this.isModal = false;
		},
		async handleInvoiceDel(id) {
			await this.$api.http
				.delete(
					this.$api.apiShop.invoiceDel,
					{},
					{
						params: {
							id: id
						}
					}
				)
				.then(res => {
					if (res.code == this.$api.responseCode.successCode) {
						this.page = 1;
						this.invoiceList.length = 0;
						uni.$emit('invoiceChange', {});
						this.isModal = false;
					}
				})
				.catch(err => {
					this.isModal = false;
				});
		},
		// 初始化数据
		initData() {
			this.page = 1;
			this.invoiceList.length = 0;
			this.getInvoiceList();
		},
		// 获取发票列表
		async getInvoiceList() {
			if (this.loading) {
				uni.stopPullDownRefresh();
				return;
			}
			this.loading = true;
			this.loadingType = 'loading';
			await this.$api.http
				.get(this.$api.apiShop.invoiceList, {
					params: {
						page: this.page,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					res.data.forEach(item => {
						item.show = false;
					});
					if (res.code == this.$api.responseCode.successCode) {
						this.loadingType = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
						this.invoiceList = [...this.invoiceList, ...res.data];
						if (this.page == 1 && res.data.length == 0) {
							this.loadingType = 'nodata';
						}
					}
				})
				.catch(() => {});
			this.loading = false;
			uni.stopPullDownRefresh();
		},
		// 选择发票
		checkInvoice(item) {
			if (this.source) {
				uni.$emit('getInvoice', item);
				this.$api.router.back();
			}
		},
		// 跳转至新增/编辑发票
		addInvoice(type, id) {
			this.$api.router.push({
				route: this.$api.routesConfig.invoiceManage,
				query: {
					type: type,
					id: id,
					source: this.source
				}
			});
		}
	}
};
</script>

<style lang="scss">
.invoice-list {
	position: relative;
	.dz-list {
		.dz-list-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			background-color: #ffffff;
			border-radius: 10rpx;
			margin: 20rpx;
		}
	}
	.t-box {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: $dz-main-color;
		.tag {
			font-size: 22rpx;
			padding: 0 18rpx;
			border-radius: 24rpx;
			margin-right: 20rpx;
			border-width: 1rpx;
			border-style: solid;
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
}
.add-btn-wrapper {
	width: 90%;
	background-color: $dz-bg-color;
	height: 120rpx;
	z-index: 99;
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;

	.add-btn {
		height: 80rpx;
		border-radius: 10rpx;
		line-height: 80rpx;
		font-size: 30rpx;
	}
	button::after {
		border: none;
	}
}
</style>
