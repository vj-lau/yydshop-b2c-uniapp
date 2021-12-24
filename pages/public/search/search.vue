<template>
	<view class="content">
		<dz-navbar :is-fixed="true" :title="language.search.titleSearch"></dz-navbar>
		<view class="container">
			<view class="dz-searchbox">
				<dz-search
					v-model="key"
					:placeholder="searchDefault || language.search.enterKeywords"
					:show-action="true"
					input-align="left"
					:focus="true"
					@search="searchConfirm"
					@custom="searchConfirm"
				></dz-search>
			</view>
			<view class="dz-search-history">
				<view class="dz-history-header">
					<view class="dz-search-title">{{ language.search.searchHistory }}</view>
					<dz-icon name="deletefill" size="36" color="#999" @click="openModal"></dz-icon>
				</view>
				<view class="dz-history-content">
					<block v-for="(item, index) in productSearch" :key="index">
						<dz-tag
							v-if="index < searchShowLength"
							class="dz-search-tag dz-line-1"
							:index="item"
							type="info"
							shape="circle"
							:bgColor="theme.dzBgColor"
							:borderColor="theme.dzBgColor"
							@click="quickSearch"
						>
							<view class="text dz-line-1" :id="'tag-' + index" @longpress="longTap(index)">{{ item }}</view>
							<view v-if="index == deleteIndex" class="close" @tap.stop="deleteChange(index)">
								<!-- #ifdef MP -->
								<dz-icon name="roundclosefill" color="#A3A3A3" size="30"></dz-icon>
								<!-- #endif -->
								<!-- #ifndef MP -->
								<dz-icon name="roundclosefill" color="#A3A3A3"></dz-icon>
								<!-- #endif -->
							</view>
						</dz-tag>
					</block>
					<dz-tag
						v-if="productSearch.length > searchDefaultLength || (productSearch.length == searchShowLength && productSearch.length > searchDefaultLength)"
						class="dz-search-tag dz-line-1"
						type="info"
						shape="circle"
						:bgColor="theme.dzBgColor"
						:borderColor="theme.dzBgColor"
						@click="searchShowClick"
					>
						<dz-icon :name="productSearch.length == searchShowLength ? 'fold' : 'unfold'" color="#999"></dz-icon>
					</dz-tag>
				</view>
				<view class="dz-no-data" v-if="productSearch.length === 0">{{ language.search.noRecord }}</view>
			</view>
			<view class="dz-search-hot">
				<view class="dz-hot-header">
					<view class="dz-search-title">{{ language.search.hotSearch }}</view>
				</view>
				<view class="dz-hot-content">
					<block v-for="(item, index) in productSearchHot" :key="index">
						<dz-tag
							class="dz-search-tag dz-line-1"
							:text="item"
							:index="item"
							type="info"
							shape="circle"
							:bgColor="theme.dzBgColor"
							:borderColor="theme.dzBgColor"
							@click="quickSearch"
						></dz-tag>
					</block>
				</view>
				<view class="dz-no-data" v-if="productSearchHot.length === 0">{{ language.search.noHotRecord }}</view>
			</view>
		</view>
		<dz-modal
			v-model="modalShow"
			:mask-close-able="false"
			:content="modalContent"
			:show-cancel-button="!modalLoading"
			:confirm-color="theme.dzBaseColor"
			:async-close="true"
			@cancel="modalCancel"
			@confirm="modalConfirm"
		></dz-modal>
		<dz-popup v-model="deleteShow" mode="center" :mask="false" border-radius="30" :maskCloseAble="false" :closeable="false" width="30%" :custom-style="{ overflow: 'visible' }">
			<view class="dz-p-10">
				<view class="delete-popup dz-flex dz-row-center">
					<view class="dz-text-center dz-m-r-30" @tap="deleteItem">
						<dz-icon name="deletefill" size="36" color="#999"></dz-icon>
						<view class="dz-font-20">删除</view>
					</view>
					<view class="dz-text-center" @tap="cancel">
						<dz-icon name="roundclosefill" size="36" color="#999"></dz-icon>
						<view class="dz-font-20">取消</view>
					</view>
				</view>
			</view>
		</dz-popup>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			key: '',
			modalContent: this.$api.language.search.clearSearchHistory,
			modalShow: false,
			modalLoading: false,
			searchDefault: this.$api.store.state.productSearchDefault,
			searchDefaultLength: this.$api.shopSetting.search_show_length,
			searchShowLength: this.$api.shopSetting.search_show_length,
			deleteIndex: -1,
			deleteShow: false
		};
	},
	computed: {
		...mapState(['productSearch', 'productSearchHot'])
	},
	onBackPress(event) {
		uni.hideKeyboard();
	},
	async onLoad(option) {
		if (option.key) {
			this.key = option.key;
		}
		uni.setNavigationBarTitle({ title: this.$api.language.search.titleSearch });
		await this.$onLaunched;
	},
	methods: {
		...mapMutations(['setProductSearch']),
		quickSearch: function(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.productList,
				query: {
					keyword: item
				}
			});
		},
		searchShowClick() {
			if (this.searchShowLength < this.productSearch.length) {
				this.searchShowLength = this.productSearch.length;
			} else {
				this.searchShowLength = this.$api.shopSetting.search_show_length;
			}
		},
		longTap(index) {
			this.deleteIndex = index;
		},
		deleteChange(index) {
			this.deleteIndex = index;
			this.deleteShow = true;
		},
		cancel() {
			this.deleteIndex = -1;
			this.deleteShow = false;
		},
		deleteItem() {
			this.productSearch.splice(this.deleteIndex, 1);
			this.setProductSearch(this.productSearch);
			this.cancel();
		},
		openModal() {
			this.modalShow = true;
		},
		//关闭
		modalCancel() {
			if (!this.modalLoading) {
				this.modalShow = false;
			}
		},
		// 确认
		modalConfirm() {
			this.modalLoading = true;
			let s = [];
			this.setProductSearch(s);
			this.modalShow = false;
		},
		searchConfirm: function(e) {
			try {
				if (this.key == '') {
					this.key = this.searchDefault;
				}
				if (this.key != '') {
					let s = this.productSearch;
					s.unshift(this.key);
					let sn = Array.from(new Set(s));
					let snLength = sn.length;
					if (snLength > 30) {
						sn = sn.splice(0, snLength - 30);
					}
					s = sn;
					this.setProductSearch(s);
				}
			} catch (e) {}
			this.$api.router.push({
				route: this.$api.routesConfig.productList,
				query: {
					keyword: this.key
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	width: 100%;
	height: 100%;
	background: #fff !important;
}
.dz-search-tag {
	position: relative;
	max-width: 100%;
	/* #ifdef MP */
	.dz-tag {
		margin: 0rpx 12rpx 12rpx 0rpx !important;
	}
	/* #endif */
	/* #ifndef MP */
	margin: 0rpx 12rpx 12rpx 0rpx !important;
	/* #endif */
	font-size: 28rpx !important;
	color: $dz-main-color !important;
	overflow: visible;
	.text {
		display: inline-block;
		max-width: 100%;
	}
	.close {
		position: absolute;
		/* #ifdef MP */
		right: 5rpx;
		top: -15rpx;
		/* #endif */
		/* #ifndef MP */
		right: -10rpx;
		top: -10rpx;
		/* #endif */
	}
}

.container {
	padding: 0 30rpx 30rpx 30rpx;
	box-sizing: border-box;
}

.dz-searchbox {
	padding: 30rpx 0;
}

.dz-history-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 10rpx 30rpx 0rpx;
}

.dz-search-title {
	font-size: 30rpx;
	font-weight: bold;
}

.dz-hot-header {
	padding: 30rpx 0;
}

.dz-no-data {
	text-align: center;
	color: $dz-content-color;
}
.delete-popup {
	width: 90%;
	height: 86rpx;
	border-radius: 10px;
	background: #fff;
	box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.16);
}
</style>
