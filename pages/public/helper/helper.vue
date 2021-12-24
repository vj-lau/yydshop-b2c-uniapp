<template>
	<view>
		<dz-navbar title="帮助"></dz-navbar>
		<view class="content">
			<block v-for="(item, index) in helperList" :key="index">
				<dz-cell-item hover-class="none" :border-bottom="false" @tap="toChild(index)">
					<view slot="title" @tap.stop="tapTitle(item)">{{ item.title }}</view>
				</dz-cell-item>
				<dz-line v-if="index != helperList.length - 1"></dz-line>
			</block>
		</view>
		<dz-select v-model="isHelper" mode="single-column" value-name="id" :list="helperChild" label-name="title" @confirm="helperConfirm"></dz-select>
		<dz-empty v-if="loadingStatus == 'nodata'" margin-top="80" :src="empty" iconSize="360"></dz-empty>
	</view>
</template>

<script>
export default {
	data() {
		return {
			helperList: [],
			helperChild: [],
			isHelper: false,
			loadingStatus: 'loading',
			empty: this.$api.assetsConfig.empty
		};
	},
	async onLoad() {
		uni.setNavigationBarTitle({
			title: '帮助'
		});
		await this.$onLaunched;
		this.getHelperIndex();
	},
	methods: {
		async getHelperIndex() {
			await this.$api.http.get(this.$api.apiShop.helperIndex).then(res => {
				this.helperList = res.data;
				if (res.data.length == 0) {
					this.loadingStatus = 'nodata';
				}
			});
		},
		toChild(index) {
			if (this.helperList[index] && this.helperList[index].child.length > 0) {
				this.isHelper = true;
				this.helperChild = this.helperList[index].child;
			} else {
				let val = [{ value: this.helperList[index].id, label: this.helperList[index].title }];
				this.helperConfirm(val);
			}
		},
		// 标题点击
		tapTitle(val) {
			let helper = [{ value: val.id, label: val.title }];
			this.helperConfirm(helper);
		},
		helperConfirm(val) {
			this.$api.router.push({
				route: this.$api.routesConfig.helperDetail,
				query: {
					id: val[0].value,
					title: val[0].label
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ffffff;
}
.content {
	padding: 0 20rpx;
}
</style>
