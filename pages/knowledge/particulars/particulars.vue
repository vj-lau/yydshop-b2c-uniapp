<template>
	<view class="particulars-container">
		<dz-navbar title="详情"></dz-navbar>
		<view class="head dz-p-24 dz-p-b-40">
			<view style="width: 212rpx;   margin-right: 40rpx;"><image :src="list.cover"></image></view>
			<view class="right">
				<view class="txt dz-line-2">{{ list.title }}</view>
				<view class="content dz-color-9">
					<text style="font-size: 30rpx;margin-right: 20rpx;">描述:</text>
					<text>{{ list.description }}</text>
				</view>
			</view>
		</view>
		<dz-gap bgColor="#f3f4f6" height="20"></dz-gap>
		<view class="dz-p-24">
			<view class="txt">内容</view>
			<view class="section_box">
				<view @click="purchase(item.free, item.id)" class="section" v-for="item in list.contents" :key="item.id">
					{{ item.title }}
					<view class="location" v-if="list.price != '0.00' && item.free == 0">付费</view>
				</view>
			</view>
		</view>
		<!-- 加载 -->
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: {},
			id: null,
			loadingShow: true,
			loadingStatus: 'loading',
			state: null
		};
	},
	async onLoad(e) {
		this.id = e.id;
		await this.$onLaunched;
		this.getList();
	},
	methods: {
		loadingClick() {
			this.getList();
		},
		getList() {
			this.$api.http
				.get(this.$api.apiShop.knowledgeContentList, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					this.list = res.data;
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
		},
		// 购买
		async purchase(free, id) {
			if (this.list.price == '0.00' || free == 1) {
				this.$api.router.push({
					route: this.$api.routesConfig.knowledgeContent,
					query: {
						id: id
					}
				});
			} else {
				await this.isPay(id);
				if (this.state) {
					this.$api.router.push({
						route: this.$api.routesConfig.knowledgeContent,
						query: {
							id: id
						}
					});
				} else {
					this.$api.router.push({
						route: this.$api.routesConfig.knowledgePay,
						query: {
							id: this.list.id
						}
					});
				}
			}
		},
		async isPay(id) {
			await this.$api.http
				.post(this.$api.apiShop.knowledgePayCreate, {
					id: id
				})
				.then(res => {
					this.state = res.data == 0 ? false : true;
				})
				.catch(err => {
					this.state = false;
				});
		}
	}
};
</script>

<style lang="scss">
page,
.particulars-container {
	background-color: #fff;
	height: 100%;
}
.particulars-container {
	.head {
		display: flex;
		flex-direction: row;
	}

	image {
		width: 212rpx;
		height: 300rpx;
		border-radius: 15rpx;
	}
	.txt {
		font-size: 35rpx;
		font-weight: 530;
		color: #000;
	}
	.content {
		width: 100%;
		margin-top: 20rpx;
	}
	.section_box {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.section {
			min-width: 65rpx;
			position: relative;
			padding: 40rpx 20rpx;
			background-color: #f3f4f9;
			margin: 15rpx;
			border-radius: 12rpx;
			color: #000;
		}
		.location {
			position: absolute;
			background-color: #f9cb99;
			top: 0;
			right: 8rpx;
			color: #5e3e0b;
			font-size: 22rpx;
			padding: 4rpx;
			border-bottom-left-radius: 8rpx;
			border-bottom-right-radius: 8rpx;
		}
	}
}
</style>
