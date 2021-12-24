<template>
	<view class="dz-tr">
		<slot></slot>
	</view>
</template>

<script>
	/**
	 * tr 表格行标签
	 * @description 表格组件一般用于展示大量结构化数据的场景（搭配<dz-table>使用）
	 * @example <dz-tr></dz-tr>
	 */
	export default {
		name: "dz-tr",
	}
</script>

<style lang="scss" scoped>
	@import "../../css/style.components.scss";
	
	.dz-tr {
		@include vue-flex;
	}
</style>
