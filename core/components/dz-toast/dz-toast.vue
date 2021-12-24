<template>
	<view
		class="dz-toast"
		:class="[isShow ? 'dz-show' : '', 'dz-type-' + config.type, 'dz-position-' + config.position]"
		:style="{
			zIndex: mZIndex
		}"
	>
		<view class="dz-icon-wrap"><dz-icon v-if="config.icon" class="dz-icon" :name="iconName" :size="40" :color="config.type"></dz-icon></view>
		<text class="dz-text">{{ config.title }}</text>
	</view>
</template>

<script>
/**
 * toast 消息提示
 * @description 此组件表现形式类似uni的uni.showToastAPI，但也有不同的地方。
 * @property {String} z-index toast展示时的z-index值
 * @event {Function} show 显示toast，如需一进入页面就显示toast，请在onReady生命周期调用
 * @example <dz-toast ref="dzToast" />
 */
export default {
	name: 'dz-toast',
	props: {
		// z-index值
		zIndex: {
			type: [Number, String],
			default: ''
		}
	},
	data() {
		return {
			isShow: false,
			timer: null, // 定时器
			config: {
				params: {}, // URL跳转的参数，对象
				title: '', // 显示文本
				type: 'success', // 主题类型，primary，success，error，warning，black
				duration: 3000, // 显示的时间，毫秒
				isTab: false, // 是否跳转tab页面
				url: '', // toast消失后是否跳转页面，有则跳转，优先级高于back参数
				icon: true, // 显示的图标
				position: 'center', // toast出现的位置
				callback: null, // 执行完后的回调函数
				back: false // 结束toast是否自动返回上一页
			},
			tmpConfig: {} // 将用户配置和内置配置合并后的临时配置变量
		};
	},
	computed: {
		iconName() {
			// 只有不为none，并且type为error|warning|succes|info时候，才显示图标
			if (['error', 'warning', 'success', 'info'].indexOf(this.config.type) >= 0 && this.config.icon) {
				let icon = this.$api.components.type2icon(this.config.type);
				return icon;
			}
		},
		mZIndex() {
			// 显示toast时候，如果用户有传递z-index值，有限使用
			return this.isShow ? (this.zIndex ? this.zIndex : this.$api.zIndex.toast) : '999999';
		}
	},
	methods: {
		// 显示toast组件，由父组件通过this.$refs.xxx.show(options)形式调用
		show(options) {
			// 不降结果合并到this.config变量，避免多次条用dz-toast，前后的配置造成混论
			this.config = this.$api.helper.deepMerge(this.config, options);
			if (this.timer) {
				// 清除定时器
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.isShow = true;
			this.timer = setTimeout(() => {
				// 倒计时结束，清除定时器，隐藏toast组件
				this.isShow = false;
				clearTimeout(this.timer);
				this.timer = null;
				// 判断是否存在callback方法，如果存在就执行
				typeof this.config.callback === 'function' && this.config.callback();
				this.timeEnd();
			}, this.config.duration);
		},
		// 隐藏toast组件，由父组件通过this.$refs.xxx.hide()形式调用
		hide() {
			this.isShow = false;
			if (this.timer) {
				// 清除定时器
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		// 倒计时结束之后，进行的一些操作
		timeEnd() {
			// 如果带有url值，根据isTab为true或者false进行跳转
			if (this.config.url) {
				// 如果url没有"/"开头，添加上，因为uni的路由跳转需要"/"开头
				if (this.config.url[0] != '/') this.config.url = '/' + this.config.url;
				// 判断是否有传递显式的参数
				if (Object.keys(this.config.params).length) {
					// 判断用户传递的url中，是否带有参数
					// 使用正则匹配，主要依据是判断是否有"/","?","="等，如“/page/index/index?name=mary"
					// 如果有params参数，转换后无需带上"?"
					let query = '';
					if (/.*\/.*\?.*=.*/.test(this.config.url)) {
						// object对象转为get类型的参数
						query = this.$api.components.queryParams(this.config.params, false);
						this.config.url = this.config.url + '&' + query;
					} else {
						query = this.$api.components.queryParams(this.config.params);
						this.config.url += query;
					}
				}
				// 如果是跳转tab页面，就使用uni.switchTab
				if (this.config.isTab) {
					uni.switchTab({
						url: this.config.url
					});
				} else {
					uni.navigateTo({
						url: this.config.url
					});
				}
			} else if (this.config.back) {
				// 回退到上一页
				uni.navigateBack();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../css/style.components.scss';
.dz-toast {
	position: fixed;
	z-index: -1;
	transition: opacity 0.3s;
	text-align: center;
	color: #fff;
	border-radius: 20rpx;
	// background: #585858;
	background-color: rgba(17, 17, 17, 0.7);
	@include vue-flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	opacity: 0;
	pointer-events: none;
	padding: 25rpx 36rpx;
	min-height: 96rpx;
	max-width: 80%;
}

.dz-toast.dz-show {
	opacity: 1;
}

.dz-icon {
	margin-right: 10rpx;
	@include vue-flex;
	align-items: center;
	line-height: normal;
}

.dz-position-center {
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	/* #ifndef APP-NVUE */
	max-width: 80%;
	/* #endif */
}

.dz-position-top {
	left: 50%;
	top: 20%;
	transform: translate(-50%, -50%);
}

.dz-position-bottom {
	left: 50%;
	bottom: 20%;
	transform: translate(-50%, -50%);
}

.dz-type-primary {
	color: $dz-type-primary;
	background-color: $dz-type-primary-light;
	border: 1px solid rgb(215, 234, 254);
}

.dz-type-success {
	// color: $dz-type-success;
	// background-color: $dz-type-success-light;
	// border: 1px solid #BEF5C8;
}

.dz-type-error {
	// color: $dz-type-error;
	// background-color: $dz-type-error-light;
	// border: 1px solid #fde2e2;
}

.dz-type-warning {
	// color: $dz-type-warning-disabled;
	// background-color: $dz-type-warning-light;
	// border: 1px solid #faecd8;
}

.dz-type-info {
	// color: $dz-type-info;
	// background-color: $dz-type-info-light;
	// border: 1px solid #ebeef5;
}

.dz-type-default {
	color: #fff;
	background-color: #585858;
}
</style>
