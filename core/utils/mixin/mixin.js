module.exports = {
	data() {
		return {}
	},
	onLoad() {
		this.$api.getRect = this.$mGetRect;
	},
	methods: {
		$mGetRect(selector, all) {
			return new Promise((resolve, reject) => {
				uni.createSelectorQuery().
				in(this)[all ? 'selectAll' : 'select'](selector)
					.boundingClientRect(rect => {
						if (all && Array.isArray(rect) && rect.length) {
							resolve(rect)
						}
						if (!all && rect) {
							resolve(rect)
						}
						reject(rect);
					})
					.exec()
			})
		},
		getParentData(parentName = '') {
			// 避免在created中去定义parent变量
			if (!this.parent) this.parent = false;
			// 这里的本质原理是，通过获取父组件实例(也即dz-radio-group的this)
			// 将父组件this中对应的参数，赋值给本组件(dz-radio的this)的parentData对象中对应的属性
			// 之所以需要这么做，是因为所有端中，头条小程序不支持通过this.parent.xxx去监听父组件参数的变化
			this.parent = this.$api.components.$parent.call(this, parentName);
			if (this.parent) {
				// 历遍parentData中的属性，将parent中的同名属性赋值给parentData
				Object.keys(this.parentData).map(key => {
					this.parentData[key] = this.parent[key];
				});
			}
		},
		// 阻止事件冒泡
		preventEvent(e) {
			e && e.stopPropagation && e.stopPropagation()
		}
	}
}
