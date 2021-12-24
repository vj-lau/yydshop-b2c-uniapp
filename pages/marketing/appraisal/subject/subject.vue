<template>
	<view class="custom-page">
		<dz-navbar title="测评内容"></dz-navbar>
		<view class="form-box">
			<view class="title">{{ list.description }}</view>
			<view v-for="(item, index) in list.content" :key="index">
				<view class="headline">
					<text>{{ item.sort }}.</text>
					<text>{{ item.question }}</text>
					<text>【{{ item.question_type == 1 ? '单选' : '多选' }}】</text>
				</view>
				<view style="margin: 0 25rpx;" v-for="(item1, i) in item.content" :key="i">
					<dz-radio-group style="margin: 5rpx 0;" v-if="item.question_type == 1" :wrap="true" v-model="item.optionText" @change="radioGroupChange">
						<dz-radio @change="radioChange" :name="item1.optionText" :active-color="theme.dzBaseColor">{{ item1.optionText }}</dz-radio>
					</dz-radio-group>
					<dz-checkbox-group @change="checkboxGroupChange" v-else>
						<dz-checkbox style="margin: 5rpx 0;" @change="checkboxChange" v-model="item1.checked" :active-color="theme.dzBaseColor" :name="item1.score">
							{{ item1.optionText }}
						</dz-checkbox>
					</dz-checkbox-group>
				</view>
			</view>
		</view>
		<view class="fixed">
			<dz-button
				:custom-style="{ background: theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
				:disabled="btnDisabled"
				hover-class="none"
				shape="circle"
				:border="false"
				@click="preserve"
			>
				提交
			</dz-button>
		</view>
		<dz-page-loading :show="loadingShow" :status="loadingStatus" @click="loadingClick"></dz-page-loading>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			id: null,
			list: {},
			loadingShow: true,
			loadingStatus: 'loading',
			btnDisabled: false,
			num: []
		};
	},
	async onLoad(e) {
		this.id = e.cate_id;
		await this.$onLaunched;
		this.getList();
	},
	onPullDownRefresh() {
		this.getList();
	},
	methods: {
		getList() {
			this.$api.http
				.get(this.$api.apiShop.appraisalList, {
					params: {
						id: this.id
					}
				})
				.then(res => {
					res.data.content.forEach(item => {
						item.content = JSON.parse(item.content);
						if (item.question_type == 1) {
							item.score = '';
						} else {
							item.content.forEach(item1 => {
								item1.checked = false;
							});
						}
					});
					this.list = res.data;
					this.loadingShow = false;
				})
				.catch(err => {
					this.loadingStatus = 'error';
				});
			uni.stopPullDownRefresh();
		},
		loadingClick() {
			this.getList();
		},
		preserve() {
			this.num = [];
			for (var val of this.list.content) {
				if (val.question_type == 1) {
					if (!val.optionText) {
						return this.$refs.dzToast.show({
							title: '选项不能为空',
							type: 'warning'
						});
					}
				}

				if (val.question_type == 2) {
					var array = [];
					for (var str of val.content) {
						array.push(str.checked);
					}
					let state = array.indexOf(true);
					if (state == -1) {
						return this.$refs.dzToast.show({
							title: '选项不能为空',
							type: 'warning'
						});
					}
				}
			}
			this.list.content.forEach(item => {
				if (item.question_type == 1) {
					item.content.forEach(item1 => {
						if (item.optionText == item1.optionText) {
							this.num.push(parseInt(item1.score));
						}
					});
				} else {
					item.content.forEach(item2 => {
						if (item2.checked == true) {
							this.num.push(parseInt(item2.score));
						}
					});
				}
			});
			var res = this.num.reduce(function(total, num) {
				return total + num;
			}, 0);
			this.$api.router.push({
				route: this.$api.routesConfig.appraisalTestResult,
				query: {
					subject_id: this.id,
					score: res
				}
			});
		},
		radioGroupChange(e) {},
		radioChange() {},
		checkboxChange(e) {},
		checkboxGroupChange(e) {}
	}
};
</script>

<style lang="scss" scoped>
page,
.custom-page {
	height: 100%;
	background: #fff;
}
.form-box {
	padding: 20rpx;
	margin-bottom: 20rpx;

	.title {
		font-size: 35rpx;
		text-align: center;
	}

	.headline {
		margin-top: 20rpx;

		text {
			font-size: 36rpx;
			font-weight: 500;
		}
	}

	.fixed {
		bottom: 20rpx;
		width: 100%;
	}
}
</style>
