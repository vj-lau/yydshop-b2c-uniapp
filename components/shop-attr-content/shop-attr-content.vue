<template>
	<view class="dz-popup-box">
		<view class="dz-product-box dz-padding">
			<view class="dz-popup-img" @tap.stop="previewImgs(currentSkuPicture || product.picture, [currentSkuPicture || product.picture])">
				<dz-image :src="currentSkuPicture || product.picture" width="200" height="200" borderRadius="20"></dz-image>
			</view>
			<view class="dz-popup-price">
				<view class="dz-popup-title dz-line-2">{{ product.name }}</view>
				<view class="dz-amount dz-bold" :style="{ color: theme.dzBaseColor }">
					<!--会员折扣标记-->
					<dz-icon
						v-if="product.memberDiscount && product.memberDiscount.discount && product.memberDiscount.discount > 0"
						class="dz-m-r-10"
						size="40"
						:color="theme.dzBaseColor"
						name="memberDiscount"
					></dz-icon>
					{{ language.application.moneySymbol }}{{ currentPrice }}
				</view>
				<view v-if="selectArr.some(item => item != '')" class="dz-number">
					<dz-tag type="info" size="mini" :bgColor="theme.dzBgColor" :borderColor="theme.dzBgColor">
						{{ language.product.sku }}：
						<text class="selected-text dz-m-r-10" style="line-height: 32rpx;" v-for="(item, index) in selectArr" :key="index">{{ item }}</text>
					</dz-tag>
				</view>
				<view class="dz-number" v-if="currentSkuStock !== null && parseInt(product.is_stock_visible) == 1">
					<text class="selected-text">{{ language.product.store }}：{{ currentSkuStock }} {{ product.unit || language.application.unit }}</text>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="dz-popup-scroll">
			<view class="dz-scrollview-box">
				<block v-for="(item, index) in specList" :key="index">
					<view class="dz-bold dz-attr-title">{{ item.title }}</view>
					<view class="dz-attr-box">
						<block v-if="parseInt(item.show_type) === 3">
							<dz-row gutter="0">
								<block v-for="(childItem, childIndex) in specChildList" :key="childIndex">
									<dz-col v-if="childItem.base_spec_id === item.base_spec_id" :span="4">
										<view
											class="dz-sku"
											:style="{
												color: subIndex[index] == childIndex ? theme.dzBaseColor : '',
												borderColor: subIndex[index] == childIndex ? theme.dzBaseColor : '#f7f7f7',
												fontWeight: subIndex[index] == childIndex ? 'bold' : 500
											}"
											:class="[childItem.ishow ? '' : 'dz-pic-disabled', item.value.length > 3 ? 'dz-m-b-20' : '']"
											@tap="skuClick(childItem, index, childIndex, item.show_type)"
										>
											<dz-image :src="childItem.data || product.picture" borderRadius="20" width="190" height="190"></dz-image>

											<view class="sku-name dz-line-1">{{ childItem.title }}</view>
											<view class="icon" @tap.stop="previewImgs(childItem.data || product.picture, [childItem.data || product.picture])">
												<dz-icon name="change" size="28" color="#fff"></dz-icon>
											</view>
										</view>
									</dz-col>
								</block>
							</dz-row>
						</block>
						<block v-else-if="parseInt(item.show_type) === 2">
							<!--颜色属性-->
							<view
								class="dz-attr-item"
								v-if="childItem.base_spec_id === item.base_spec_id"
								:style="{
									color: subIndex[index] == childIndex ? theme.dzBaseColor : '#333'
								}"
								:class="[childItem.ishow ? '' : 'dz-pic-disabled', subIndex[index] == childIndex ? 'dz-attr-active' : '']"
								v-for="(childItem, childIndex) in specChildList"
								:key="childIndex"
								@tap="skuClick(childItem, index, childIndex, item.show_type)"
							>
								<view
									v-if="childItem.data"
									class="attr-color"
									:style="{
										backgroundColor: childItem.data
									}"
								></view>
								{{ childItem.title }}
							</view>
						</block>
						<block v-else>
							<!--文字属性-->
							<view
								class="dz-attr-item"
								v-if="childItem.base_spec_id === item.base_spec_id"
								:style="{
									color: subIndex[index] == childIndex ? theme.dzBaseColor : '#333',
									borderColor: subIndex[index] == childIndex ? theme.dzBaseColor : ''
								}"
								:class="[childItem.ishow ? '' : 'dz-disabled', subIndex[index] == childIndex ? 'dz-attr-active' : '']"
								v-for="(childItem, childIndex) in specChildList"
								:key="childIndex"
								@tap="skuClick(childItem, index, childIndex, item.show_type)"
							>
								{{ childItem.title }}
							</view>
						</block>
					</view>
				</block>
			</view>
		</scroll-view>
		<dz-line></dz-line>
		<view class="dz-number-box dz-bold dz-attr-title">
			<view class="dz-attr-title">{{ language.product.number }}</view>
			<dz-number-box
				:max="maxNum === 0 ? parseInt(currentSkuStock) : maxNum > parseInt(currentSkuStock) ? parseInt(currentSkuStock) : maxNum"
				:min="minNum"
				:disabled="parseInt(currentSkuStock) === 0"
				size="34"
				input-width="100"
				v-model="currentSkuNumber"
			></dz-number-box>
		</view>
		<view class="dz-operation-ios">
			<view class="dz-operation dz-operation-right dz-right-flex dz-popup-btn">
				<view class="dz-flex-1" v-if="parseInt(product.point_exchange_type) === 1 || parseInt(product.point_exchange_type) === 3">
					<dz-button
						:custom-style="{
							background: parseInt(currentSkuStock) === 0 ? theme.dzBaseDisabled : theme.dzBaseColor,
							color: theme.dzBaseFontColor,
							width: '100%',
							height: '100rpx'
						}"
						hover-class="none"
						:disabled="parseInt(currentSkuStock) === 0"
						:border="false"
						shape="rightAngle"
						@click="confirmClick"
					>
						<!--有会员折扣-->
						<block v-if="product.memberDiscount && product.memberDiscount.length > 0 && product.memberDiscount.discount > 0">
							<view class="dz-btn__box">
								<view>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : buttonName }}</view>
								<view class="dz-flex-end">
									<view class="dz-size-26">{{ language.product.memberDiscount }} {{ language.application.moneySymbol }}</view>
									<view class="dz-size-32">{{ currentPrice }}</view>
								</view>
							</view>
						</block>
						<!--无会员折扣-->
						<block v-else>{{ parseInt(currentSkuStock) === 0 ? language.product.outOfStock : buttonName }}</block>
					</dz-button>
				</view>
			</view>
		</view>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>
<script>
import { mapState } from 'vuex';
export default {
	name: 'shop-attr-content',
	props: {
		product: {
			type: Object,
			default() {
				return {};
			}
		},
		buyNumber: {
			type: Number,
			default() {
				return 1;
			}
		},
		buttonName: {
			type: String,
			default: '确定'
		},
		// 最小购买量
		currentMinMum: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			theme: this.$api.theme,
			language: this.$api.language,
			minNum: 1, //当前最小购买数量
			maxNum: 0, //当前最大购买数量
			currentSkuStock: null, //当前选中规格库存
			currentSkuId: null, //当前选中规格ID
			currentSkuPrice: null, //当前选中规格产品价格
			currentSkuName: null, //当前选中规格名称
			currentSkuPicture: null, //当前选中的规格图片
			currentSkuNumber: 1, //当前选中规格的数量
			specList: [], //属性列表
			specChildList: [], //属性内容
			specSelected: [], //已选规格
			difference: null, //sku列表
			shopItemInfo: {}, //存放要和选中的值进行匹配的数据
			selectArr: [], //存放被选中的值
			subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
			selectshop: {}, //存放最后选中的商品
			currentSkuPrice: false,
			warehouseDistribution: false // 是否是云仓分销
		};
	},
	computed: {
		...mapState(['userInfo']),
		//计算购买按钮是否不可用
		buyBtnDisabled() {
			if (Object.keys(this.product).length === 0) {
				return true;
			}
			return parseInt(this.currentSkuStock || this.product.stock) === 0;
		},
		//计算当前规格购买价格
		currentPrice() {
			if (Object.keys(this.product).length === 0) {
				return 0.0;
			}
			let price = this.currentSkuPrice || this.product.minSkuPrice;
			//直接购买模式
			if (this.product.memberDiscount && parseFloat(this.product.memberDiscount.discount) > 0) {
				//会员折扣
				return parseFloat(price * (1 - parseFloat(this.product.memberDiscount.discount) / 100)).toFixed(2);
			} else {
				return parseFloat(price).toFixed(2);
			}
		}
	},
	watch: {
		product: {
			handler(val) {
				if (Object.keys(val).length === 0) {
					return;
				}
				if (this.currentMinMum > 0) {
					this.minNum = this.currentMinMum;
				} else {
					this.minNum = this.currentSkuNumber = parseInt(val.min_buy) || 1;
				}
				this.maxNum = parseInt(val.max_buy);
				//初始化商品属性
				//这里要做deepclone，否则会触发多次watch
				this.specList = this.$api.helper.deepClone(val.base_attribute_format);
				this.specChildList.length = 0;
				this.specList.forEach(item => {
					this.specChildList = [...this.specChildList, ...item.value];
				});
				this.difference = val.sku;
				// 云仓进货价格
				this.warehouseDistribution = val.warehouseCommissionRate && val.warehouseCommissionRate.is_distribution == 1;
				let level_id = (this.userInfo && this.userInfo.promoter && this.userInfo.promoter.promoterWarehouse && this.userInfo.promoter.promoterWarehouse.level_id) || '';
				if (this.warehouseDistribution && level_id) {
					const commissionRate = val.warehouseCommissionRate.commission_rate;
					this.difference.forEach(item => {
						for (let key in commissionRate) {
							if (item.id == key && commissionRate[key][level_id] && commissionRate[key][level_id].brokerage > 0) {
								item.price = commissionRate[key][level_id].brokerage;
							}
						}
					});
					this.currentSkuPrice = this.get_min(this.difference).toFixed(2);
					let minWarehouse = this.get_min(this.difference).toFixed(2);
					let maxWarehouse = this.get_max(this.difference).toFixed(2);
					if (val.memberDiscount && parseFloat(val.memberDiscount.discount) > 0) {
						//会员折扣
						minWarehouse = parseFloat(parseFloat(minWarehouse) * (1 - parseFloat(val.memberDiscount.discount) / 100)).toFixed(2);
						maxWarehouse = parseFloat(parseFloat(maxWarehouse) * (1 - parseFloat(val.memberDiscount.discount) / 100)).toFixed(2);
					}
					if (this.difference.length == 1) {
						this.currentProductPrice = minWarehouse;
					} else {
						this.currentProductPrice = minWarehouse + ' ~ ' + maxWarehouse;
					}
				}
				if (this.difference.length == 1) {
					this.currentSkuPicture = this.difference[0].picture;
					this.currentSkuPrice = this.difference[0].price;
					this.currentSkuId = this.difference[0].id;
					this.currentSkuName = this.difference[0].name;
					this.currentSkuStock = parseInt(this.difference[0].stock);
				}
				this.difference.forEach(item => {
					item.difference = [];
					item.difference = this.specIdsFormat(item.data, this.specChildList);
				});
				this.init(this.storeDistribution);

				if (val.sku_data) {
					this.selectSku(this.specIdsFormat(val.sku_data, this.specChildList));
				}
				this.currentSkuNumber = this.buyNumber;
			},
			immediate: true,
			deep: true
		},
		buyNumber: {
			handler(val) {
				this.currentSkuNumber = val || 1;
			},
			immediate: true
		}
	},
	methods: {
		// 初始化
		init() {
			let that = this;
			// 清空之前的数据
			that.selectArr = [];
			that.subIndex = [];
			that.selectShop = {};
			that.shopItemInfo = {};
			this.specList.map(item => {
				this.selectArr.push('');
				this.subIndex.push(-1);
			});
			this.checkItem(); //计算sku里面规格形成路径
			this.checkInpath(-1); //传-1是为了不跳过循环
		},
		get_min(list) {
			return Math.min.apply(
				Math,
				list.map(item => {
					return parseFloat(item.price);
				})
			);
		},
		get_max(list) {
			return Math.max.apply(
				Math,
				list.map(item => {
					return parseFloat(item.price);
				})
			);
		},
		/* 主动方法 - 设置sku */
		selectSku(arr = []) {
			let that = this;
			let skuArr = arr;
			let specListArr = this.specList;

			if (skuArr && specListArr.length === skuArr.length) {
				// 先清空
				let skuClickArr = [];
				let clickKey = true;

				for (let index = 0; index < skuArr.length; index++) {
					let skuName = skuArr[index];
					let specList = that.specChildList;
					let index1 = index;
					let index2 = that.getListIndex(specList, 'title', skuName);
					if (index2 == -1) {
						clickKey = false;
						break;
					}
					skuClickArr.push({
						spec: specList[index2],
						index1: index1,
						index2: index2
					});
				}
				if (clickKey) {
					that.init();
					skuClickArr.map(item => {
						that.skuClick(item.spec, item.index1, item.index2);
					});
				}
			}
		},
		getListIndex(list, key, value) {
			let that = this;
			let index = -1;
			for (let i = 0; i < list.length; i++) {
				if (list[i][key] === value) {
					index = i;
					break;
				}
			}
			return index;
		},
		specIdsFormat(sku, list) {
			let arr = [];
			let sotr = [];
			let skuIds = sku.split('-');
			sotr = list.filter(item => skuIds.indexOf(item.base_spec_value_id) > -1);
			if (sotr.length > 0) {
				sotr.forEach(item => {
					arr.push(item.title);
				});
			}
			return arr;
		},
		skuClick(value, index1, index2, type) {
			let list = this.specChildList;
			// 图片
			if (type && parseInt(type) === 3) {
				this.currentPicture = list[index1].data;
			}
			this.selectshop = {};
			this.currentSkuId = '';
			this.currentSkuName = '';
			if (value.ishow) {
				if (this.selectArr[index1] != value.title) {
					this.$set(this.selectArr, index1, value.title);
					this.$set(this.subIndex, index1, index2);
				} else {
					this.$set(this.selectArr, index1, '');
					this.$set(this.subIndex, index1, -1);
				}
				this.checkInpath(index1);
				//如果全部选完
				if (this.selectArr.every(item => item != '')) {
					this.selectshop = this.shopItemInfo[this.selectArr];

					this.currentSkuPicture = this.selectshop.picture;
					this.currentSkuStock = parseInt(this.selectshop.stock);

					this.currentSkuPrice = this.product.commission_price ? this.product.commission_price : this.selectshop.price;

					this.currentSkuId = this.selectshop.id;
					this.currentSkuName = this.selectshop.name;
				} else {
					this.currentSkuPrice = this.warehouseDistribution ? this.get_min(this.difference) : this.product.commission_price;
					this.currentSkuStock = this.product.stock;
				}
			}
		},
		checkInpath(clickIndex) {
			//循环所有属性判断哪些属性可选
			//当前选中的兄弟节点和已选中属性不需要循环
			for (let i = 0, len = this.specList.length; i < len; i++) {
				if (i == clickIndex) {
					continue;
				}
				let len2 = this.specList[i].value.length;
				for (let j = 0; j < len2; j++) {
					if (this.subIndex[i] != -1 && j == this.subIndex[i]) {
						continue;
					}
					let choosed_copy = [...this.selectArr];
					this.$set(choosed_copy, i, this.specList[i].value[j].title);
					let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
					if (this.shopItemInfo.hasOwnProperty(choosed_copy2)) {
						this.$set(this.specList[i].value[j], 'ishow', true);
					} else {
						this.$set(this.specList[i].value[j], 'ishow', false);
					}
				}
			}
		},
		checkItem() {
			//计算有多小种可选路径
			let result = this.difference.reduce(
				(arrs, items) => {
					return arrs.concat(
						items.difference.reduce(
							(arr, item) => {
								return arr.concat(
									arr.map(item2 => {
										//利用对象属性的唯一性实现二维数组去重
										if (!this.shopItemInfo.hasOwnProperty([...item2, item])) {
											this.shopItemInfo[[...item2, item]] = items;
										}
										return [...item2, item];
									})
								);
							},
							[[]]
						)
					);
				},
				[[]]
			);
		},
		previewImgs(img, imgList) {
			// 预览图片
			uni.previewImage({
				current: img,
				urls: imgList
			});
		},
		confirmClick() {
			if (!this.currentSkuId) {
				this.$refs.dzToast.show({
					title: this.$api.language.shopAttrContent.specificationsTip,
					type: 'warning'
				});
				return;
			}
			if (this.currentSkuStock < 1) {
				this.$refs.dzToast.show({
					title: this.$api.language.shopAttrContent.outOfStock,
					type: 'warning'
				});
				return;
			}
			this.$emit('confirm', {
				skuStock: this.currentSkuStock,
				skuId: this.currentSkuId,
				skuNumber: this.currentSkuNumber,
				skuName: this.currentSkuName || this.$api.language.application.defaultSkuName,
				skuPrice: this.currentSkuPrice
			});
		}
	}
};
</script>
<style scoped lang="scss">
.dz-popup-box {
	position: relative;
	padding: 30rpx 30rpx 100rpx 30rpx;
}

.dz-popup-btn {
	width: 100%;
	position: absolute;
	left: 0;
	bottom: 0;
}

.dz-product-box {
	display: flex;
	align-items: flex-start;
	font-size: 24rpx;
	padding-bottom: 30rpx;
}

.dz-popup-img {
	flex-shrink: 0;
	height: 200rpx;
	width: 200rpx;
	border-radius: 20rpx;
	display: block;
	background-color: $dz-bg-color;
}

.dz-popup-price {
	padding-left: 20rpx;
	padding-bottom: 8rpx;
}

.dz-popup-title {
	line-height: 1.4;
	font-size: 28rpx;
	width: 430rpx;
	color: $dz-main-color;
}

.dz-amount {
	font-size: 36rpx;
}

.dz-number {
	font-size: 24rpx;
	line-height: 24rpx;
	padding-top: 16rpx;
	color: $dz-tips-color;
}

.dz-popup-scroll {
	max-height: calc(60vh - 220rpx);
	font-size: 26rpx;
}

.dz-scrollview-box {
	padding: 0 30rpx 60rpx 30rpx;
	box-sizing: border-box;
}

.dz-attr-title {
	padding: 10rpx 0;
	color: $dz-main-color;
}

.dz-attr-box {
	font-size: 0;
	padding: 20rpx 0;
}

.dz-attr-item {
	max-width: 100%;
	min-width: 64rpx;
	height: 64rpx;
	display: -webkit-inline-flex;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	background: #f7f7f7;
	padding: 0 26rpx;
	box-sizing: border-box;
	border-radius: 10rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	font-size: 26rpx;
}

.dz-attr-active {
	background: #fff !important;
	font-weight: bold;
	position: relative;
}

.dz-attr-active::after {
	content: '';
	position: absolute;
	border-width: 1rpx;
	border-style: solid;
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
	left: 0;
	top: 0;
}

.dz-disabled {
	color: #d1d1d1 !important;
	background: #f8f8f8 !important;
}

.dz-sku {
	position: relative;
	width: 194rpx;
	background: #f7f7f7;
	border-radius: 20rpx;
	border: 1px solid #f7f7f7;
	.sku-name {
		text-align: center;
		margin: 15rpx 10rpx;
		font-size: 24rpx;
	}
	.icon {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 16rpx;
		right: 16rpx;
		width: 46rpx;
		height: 46rpx;
		border-radius: 23rpx;
		background: rgba(17, 17, 17, 0.7);
	}
}

.attr-color {
	width: 35rpx;
	height: 35rpx;
	margin-right: 10rpx;
	border-radius: 6rpx;
}

.dz-pic-disabled {
	position: relative;
}
.dz-pic-disabled::after {
	content: '';
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
	background: rgba(243, 244, 246, 0.6);
	left: 0;
	top: 0;
}

.dz-number-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 30rpx 30rpx 30rpx;
	box-sizing: border-box;
	margin-bottom: env(safe-area-inset-bottom);
}


.dz-operation-ios {
	width: 100%;
	position: fixed;
	z-index: 10;
	bottom: 0;
	left: 0;
	background: rgba(255, 255, 255, 0.98);
}

.dz-operation {
	width: 100%;
	height: 100rpx;
	background: rgba(255, 255, 255, 0.98);
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: env(safe-area-inset-bottom);
}

.dz-operation::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	border-top: 1rpx solid $dz-border-color;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.dz-operation-right {
	height: 100rpx;
	padding-top: 0;
}

.dz-right-flex {
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-flex-1 {
	flex: 1;
}

.dz-btn__box {
	height: 98rpx;
	font-size: 26rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	line-height: 28rpx;
	padding: 18rpx 0 14rpx 0;
	box-sizing: border-box;
}

.dz-size-26 {
	font-size: 26rpx;
	line-height: 26rpx;
	padding-top: 4rpx;
}

.dz-size-32 {
	font-size: 32rpx;
	line-height: 28rpx;
	font-weight: 300;
}

.dz-size-36 {
	font-size: 36rpx;
	line-height: 34rpx;
	font-weight: 500;
}
</style>
