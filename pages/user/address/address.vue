<template>
	<view class="address-box">
		<dz-navbar input-align="center" :title="language.address.shippingAddress" :borderBottom="false"></dz-navbar>
		<view class="search">
			<dz-search v-model="keyword" placeholder="输入收件人姓名或者手机号查询" @input="changeInput" @custom="search" @focus="inputFocus" :show-action="true"></dz-search>
		</view>
		<view v-if="addressList.length > 0">
			<view class="list">
				<view class="row" v-for="(row, index) in addressList" :key="index" @tap.stop="select(row)">
					<view class="center">
						<view class="name-tel">
							<view class="name">{{ row.realname }}</view>
							<view class="tel">+{{ row.mobile_area + ' ' + row.mobile }}</view>
							<view class="default" :style="{ color: theme.dzBaseColor, borderColor: theme.dzBaseColor }" v-if="row.is_default == 1">
								{{ language.address.defaultAddress }}
							</view>
						</view>
						<view class="address">{{ row.address_name }} {{ row.address_details }}</view>
					</view>
					<view class="right" @tap.stop="addAddress('edit', row.id)"><view class="dzicon-iconfont dzicon-post"></view></view>
				</view>
			</view>
		</view>
		<dz-loadmore v-if="loadingType != 'nodata'" :status="loadingType" margin-top="20" margin-bottom="140"></dz-loadmore>
		<view v-if="loadingType == 'nodata'"><dz-empty :text="language.address.noAddress" marginTop="80" :src="emptyAddress" iconSize="360"></dz-empty></view>
		<view class="add">
			<view class="dz-flex" style="width: 100%;">
				<view class="dz-flex-1">
					<dz-button
						:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
						hover-class="none"
						:loading="loading"
						@click="addAddress('add')"
						:border="false"
					>
						<view class="dzicon-iconfont dzicon-add1"></view>
						{{ language.address.newReceivingAddress }}
					</dz-button>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="dz-flex-1">
					<dz-button
						type="info"
						hoverClass="none"
						:border="false"
						:customStyle="{ width: '90%', background: '#fff', border: '1rpx solid rgba(0, 0, 0, 0.12)' }"
						@click="wechatAddress"
					>
						{{ language.address.wechatAddress }}
					</dz-button>
				</view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="dz-flex-1" v-if="h5Wechat">
					<dz-button
						:custom-style="{ background: loading ? theme.dzBaseDisabled : theme.dzBaseColor, color: theme.dzBaseFontColor, width: '90%' }"
						hover-class="none"
						@click="h5wechatAddress"
						:border="false"
					>
						{{ language.address.wechatAddress }}
					</dz-button>
				</view>
				<!-- #endif -->
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import AddressParse from '@/core/utils/zh-address-parse/address-parse.js';
export default {
	data() {
		return {
			language: this.$api.language,
			theme: this.$api.theme,
			emptyAddress: this.$api.assetsConfig.emptyAddress,
			page: 1,
			addressList: [],
			loadingType: 'loading',
			source: '',
			loading: false,
			h5Wechat: false,
			keyword: '',
			isKeyword: false
		};
	},
	async onLoad(e) {
		this.source = e.source;
		uni.setNavigationBarTitle({
			title: this.language.address.shippingAddress
		});
		await this.$onLaunched;
		uni.$on('addressChange', data => {
			this.page = 1;
			this.addressList = [];
			this.getAddress();
		});
		this.getAddress();

		//微信公众号配置注册
		// #ifdef H5
		if (this.$api.helper.h5IsWechat() && this.$api.shopSetting.wechat_appid != '') {
			this.h5Wechat = true;
			this.$api.wxHelper.wxConfig(window.location.href);
		}
		// #endif
	},
	onUnload() {
		uni.$off('addressChange');
	},
	onPullDownRefresh() {
		this.page = 1;
		this.addressList.length = 0;
		this.loadingType = 'loading';
		this.loading = false;
		this.getAddress();
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.page++;
		this.getAddress();
	},
	methods: {
		// 控制清除搜索
		inputFocus() {
			this.isKeyword = true;
		},
		// 清除搜索
		changeInput() {
			if (!this.keyword && this.isKeyword) {
				this.search();
			}
		},
		// 搜索
		search() {
			this.page = 1;
			this.addressList.length = 0;
			this.loadingType = 'loading';
			this.loading = false;
			this.getAddress();
		},
		async getAddress() {
			if (this.loading) {
				uni.stopPullDownRefresh();
				return;
			}
			this.loadingType = 'loading';
			let params = {
				page: this.page,
				page_size: this.$api.appConfig.pageSize
			};
			if (this.keyword) {
				params.keyword = this.keyword;
			}
			try {
				const res = await this.$api.http.get(this.$api.apiShop.addressList, {
					params
				});
				if (res.code == this.$api.responseCode.successCode) {
					this.loadingType = res.data.length === this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.addressList = [...this.addressList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingType = 'nodata';
					}
				}
			} catch (e) {}
			uni.stopPullDownRefresh();
		},
		addAddress(type, id) {
			this.$api.router.push({
				route: this.$api.routesConfig.addressManage,
				query: {
					type: type,
					id: id,
					source: this.source
				}
			});
		},
		select(data) {
			if (this.source) {
				uni.$emit('getAddressData', data);
				this.$api.router.back();
				return;
			}
		},
		wechatAddress() {
			// #ifdef MP-WEIXIN
			let _this = this;
			uni.getSetting({
				success(res) {
					console.log("res.authSetting['scope.address']：", res.authSetting['scope.address']);
					if (res.authSetting['scope.address']) {
						uni.chooseAddress({
							success(res) {
								_this.parseWechatAddress(res);
							},
							fail(err) {
								_this.$refs.dzToast.show({
									title: '获取微信收货地址失败',
									type: 'warning'
								});
							}
						});
					} else {
						if (res.authSetting['scope.address'] == false) {
							uni.openSetting({
								success(res) {
									console.log(res.authSetting);
								},
								fail(err) {
									_this.$refs.dzToast.show({
										title: '打开微信授权面板失败',
										type: 'warning'
									});
								}
							});
						} else {
							uni.chooseAddress({
								success(res) {
									_this.parseWechatAddress(res);
								}
							});
						}
					}
				},
				fail(err) {
					_this.$refs.dzToast.show({
						title: '获取微信设置失败',
						type: 'warning'
					});
				}
			});
			// #endif
			// #ifndef MP-WEIXIN
			this.$refs.dzToast.show({
				title: '仅在微信小程序中可以使用该功能',
				type: 'warning'
			});
			// #endif
		},
		async h5wechatAddress() {
			let _this = this;
			// #ifdef H5
			if (!this.$api.helper.h5IsWechat() || this.$api.shopSetting.wechat_appid == '') {
				return;
			}
			this.$api.jweixin.ready(() => {
				this.$api.jweixin.openAddress({
					success(res) {
						_this.parseWechatAddress(res);
					},
					fail(err) {
						// _this.$refs.dzToast.show({
						// 	title: err.errMsg,
						// 	type: 'warning'
						// });
					},
					cancel(cal) {}
				});
			});
			// #endif
		},
		async parseWechatAddress(data) {
			//解析省市区
			let parseInfo = '';
			if (!this.$api.helper.h5IsWechat() || this.$api.shopSetting.wechat_appid == '') {
				parseInfo = `${data.provinceName}${data.cityName}${data.countryName}${data.detailInfo}`;
			} else {
				parseInfo = `${data.provinceName}${data.cityName}${data.countyName}${data.detailInfo}`;
			}
			let options = {
				type: 1, // 哪种方式解析，0：正则，1：树查找
				textFilter: [], // 预清洗的字段
				nameMaxLength: 4 // 查找最大的中文名字长度
			};
			let parseResult = await AddressParse(parseInfo, options);
			if (parseResult.area) {
				let provinceId = parseResult.province.id;
				let cityId = parseResult.city.id;
				let areaId = parseResult.area.id;
				let params = {
					realname: data.userName,
					mobile_area: '86',
					mobile: data.telNumber,
					address_details: data.detailInfo,
					is_default: 1,
					province_id: provinceId,
					city_id: cityId,
					area_id: areaId
				};
				await this.$api.http
					.post(this.$api.apiShop.addressCreate, {
						...params
					})
					.then(res => {
						this.$refs.dzToast.show({
							title: this.$api.language.address.addressAddedSuccessfully,
							type: 'success'
						});

						if (this.source) {
							uni.$emit('getAddressData', res.data);
							this.$api.router.back();
						} else {
							uni.$emit('addressChange', {});
						}
					})
					.catch(() => {});
			} else {
				this.$refs.dzToast.show({
					title: '解析微信地址失败',
					type: 'warning'
				});
			}
		}
	}
};
</script>

<style lang="scss">
.search {
	position: fixed;
	width: 100%;
	padding: 10rpx 20rpx;
	background: #fff;
	z-index: 2;
}
.address-box {
	width: 100%;
}
.list {
	margin-top: 86rpx;
	flex-wrap: wrap;
	.row {
		display: flex;
		width: 100%;
		padding: 20rpx 2%;
		background-color: #ffffff;
		border-bottom: 1rpx solid $dz-border-color;
		.center {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			padding-left: 10rpx;
			.name-tel {
				display: flex;
				width: 100%;
				align-items: baseline;

				.name {
					font-size: 34rpx;
				}

				.tel {
					margin-left: 30rpx;
					font-size: 24rpx;
					color: $dz-tips-color;
				}

				.default {
					font-size: 22rpx;
					padding: 0 18rpx;
					border-radius: 24rpx;
					margin-left: 20rpx;
					border-width: 1rpx;
					border-style: solid;
				}
			}

			.address {
				width: 100%;
				margin-top: 10rpx;
				font-size: 24rpx;
				display: flex;
				align-items: baseline;
				color: $dz-tips-color;
			}
		}

		.right {
			display: flex;
			flex-shrink: 0;
			align-items: center;
			margin-left: 20rpx;

			.dzicon-iconfont {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 80rpx;
				height: 60rpx;
				font-size: 40rpx;
				color: $dz-tips-color;
			}
		}
	}
}
.add {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 120rpx;
	z-index: 99;
}
</style>
