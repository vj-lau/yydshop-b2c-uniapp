<template>
	<view class="result-content">
		<dz-navbar title="测算结果"></dz-navbar>
		<!--头部-->
		<view v-if="result.head.content.content">
			<dz-parse class='result-img' :html="result.head.content.content" lazy-load :previewImg="false"></dz-parse>
		</view>
		<!--tabs-->
		<dz-tabs 
			:list="tabList" 
			:topBottom="10"
			:activeColor="theme.dzBaseColor" 
			:current="active"
			@change="tabChange"
		>
		</dz-tabs>
		<block v-for="(item, index) in result.tabs" :key="index">
			<view v-show="index==active">
				<view v-if="item.list && item.list==true">
					<block v-for="(child,indexChild) in item.content" :key="indexChild">
						<view class="title dz-flex">
							<view class="circle dz-m-r-12" :style="{ background: theme.dzBaseColor }">
							</view>
							<text>{{child.title}}</text>
						</view>
						<dz-parse class='result-img' :html="child.content.content" lazy-load :previewImg="false"></dz-parse>
					</block>
				</view>
				<view v-else>
					<dz-parse class='result-img' :html="item.content.content" lazy-load :previewImg="false"></dz-parse>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			theme: this.$api.theme,
			tabList:[],
			result: [],
			active:0
		};
	},
	onLoad(option) {
		this.result = uni.getStorageSync('calculateResult');
		if(this.result){
			for(let i=0;i<=this.result.tabs.length;i++){
			    this.tabList.push({name:this.result.tabs[i].title});
			}
		}
	},
	methods:{
		tabChange(e){
			this.active=e;
		}
	}
};
</script>

<style lang="scss" scoped>
page,
.result-content {
	background: #fff;
	height: 100%;
}
.result-content {
	padding: 30rpx;
}
.result-img{
	img:{
		max-width: 100%;
	}
}
.title {
	margin-bottom: 30rpx;
	.circle {
		width: 16rpx;
		height: 16rpx;
		border-radius: 8rpx;
	}
	font-size: 28rpx;
}
.tip {
	margin-bottom: 30rpx;
	padding: 30rpx;
	background: #f7f8fa;
	border-radius: 20rpx;
	// color: #c0c4cc;
}
</style>
