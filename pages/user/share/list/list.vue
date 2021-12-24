<template>
	<view>
		<dz-navbar :title="title"></dz-navbar>
		<view class="content">
			<scroll-view scroll-x class="scroll-tap" v-if="cateList.length > 0">
				<block v-for="(item, index) in cateList" :key="index">
					<view class="scroll-item" @tap="cateTap(item)">
						<view class="image"><dz-image :src="item.cover || missingFace" borderRadius="50" width="100" height="100"></dz-image></view>
						<view class="text dz-line-1">{{ item.title }}</view>
					</view>
				</block>
			</scroll-view>
			<block v-for="(item, index) in shareContentList" :key="index">
				<view class="card" @tap="tapDetail(item)">
					<view class="head">
						<view class="image"><dz-image :src="missingFace" width="80" height="80" borderRadius="40"></dz-image></view>
						<view class="right">
							<view class="name">{{ item.title }}</view>
							<view class="time">{{ item.created_at | timeFormat }}</view>
						</view>
					</view>
					<view class="tip" v-if="item.description">{{ item.description }}</view>
					<!-- 图片 -->
					<view class="image" v-if="item.content_type == 1">
						<view v-for="(items, indexs) in item.cover" :key="indexs" @tap.stop="previewImgs(items, item.cover)">
							<view class="img"><dz-image :src="items" width="213" height="213" borderRadius="15"></dz-image></view>
						</view>
					</view>
					<!-- 文章 -->
					<view class="article" v-if="item.content_type == 0">
						<view class="image"><dz-image :src="item.cover[0]" style="width: 100%;" width="100%" height="320" borderRadius="15" mode="widthFix"></dz-image></view>
						<text>文章</text>
					</view>
					<!-- 视频 -->
					<view class="article" v-if="item.content_type == 2">
						<!-- #ifdef MP -->
						<view v-show="activeVideo != item.id" class="vedio-cover" @tap="videoPlayClick(item.id)">
							<dz-image v-if="item.video_cover" :src="item.video_cover" height="400" mode="aspectFit"></dz-image>
							<view class="video-icon"><dz-icon name="videofill" color="rgba(255, 255, 255,0.9)" size="120"></dz-icon></view>
						</view>
						<video v-if="activeVideo == item.id" :src="item.cover" :id="item.id" autoplay style="width: 100%;height: 200px;"></video>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS || H5 -->
						<!--TODO APP端解决了层级问题，但是没有解决页面内只播放一个视频的问题，以及页面隐藏后停止所有视频的问题-->
						<dz-app-vedio ref="video" :vedioIndex="index" :vedioCover="item.video_cover" :vedioUrl="item.cover" @videoPlaying="videoPlaying"></dz-app-vedio>
						<!-- #endif -->
					</view>
					<view class="footer">
						<view class="footer-flet">
							<view class="flex dz-m-r-20" @tap.stop="shareTap(item)" v-if="item.content_type == 0">
								<text class="dzicon-iconfont dzicon-forward"></text>
								<text>分享</text>
							</view>
							<view class="flex" v-if="item.content_type == 1 || item.content_type == 2" @tap.stop="tapDownload(item)">
								<text class="dzicon-iconfont dzicon-down"></text>
								<text>下载</text>
							</view>
						</view>
						<view class="footer-right">
							<view v-if="item.content_type == 1 || item.content_type == 2" class="flex dz-m-r-20" @tap.stop="copy(item.title + ' ' + item.description)">
								<text class="dzicon-iconfont dzicon-copy"></text>
								<text>文案</text>
							</view>
							<view class="flex dz-m-r-20" @tap.stop="tapCollection(index)">
								<text
									class="dzicon-iconfont"
									:class="[item.isCollection ? 'dzicon-likefill checked' : 'dzicon-like']"
									:style="{ color: item.isCollection ? theme.dzBaseColor : '' }"
								></text>
								<text>收藏</text>
							</view>
							<view class="flex" @tap.stop="tapLike(index)">
								<text
									class="dzicon-iconfont"
									:class="[item.isLike ? 'dzicon-appreciatefill checked' : 'dzicon-appreciate']"
									:style="{ color: item.isLike ? theme.dzBaseColor : '' }"
								></text>
								<text>{{ item.like_count || 0 }}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<dz-empty v-if="loadingStatus == 'noData'" margin-top="20" :src="empty" iconSize="360"></dz-empty>
		<dz-loadmore v-if="loadingStatus != 'noData'" :status="loadingStatus" margin-top="-20" margin-bottom="20"></dz-loadmore>
		<dz-modal
			v-model="downloadShow"
			:mask-close-able="false"
			:show-cancel-button="false"
			:async-close="true"
			:content="`正在为您下载，请耐心等待（${downloadText}）`"
			@confirm="downloadConfirm"
			confirm-text="取消下载"
		></dz-modal>
		<dz-modal
			v-model="downloadVideoErrorShow"
			:mask-close-able="true"
			:show-cancel-button="true"
			:title="'提示'"
			:content="'微信小程序有下载大小限制，您可以点击复制下载链接，使用浏览器下载视频'"
			:confirm-text="'复制链接'"
			@confirm="copyVideoUrl"
		></dz-modal>
		<dz-toast ref="dzToast"></dz-toast>
	</view>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
	data() {
		return {
			title: '',
			shareId: '',
			missingFace: '',
			theme: this.$api.theme,
			cateList: [],
			loadingStatus: 'loading',
			page: 1,
			shareContentList: [],
			downloadShow: false,
			downloadItem: {},
			downloadText: '',
			imgDownloadTotal: 1,
			imgDownloadNum: 1,
			vedioDownloadPercent: 0,
			downloadTask: null,
			activeVideo: null,
			downloadVideoErrorShow: false,
			empty: this.$api.assetsConfig.empty
		};
	},
	async onLoad(option) {
		this.title = option.title;
		this.shareId = option.id;
		if (option.title) {
			uni.setNavigationBarTitle({
				title: option.title
			});
		} else {
			uni.setNavigationBarTitle({
				title: '发现'
			});
		}
		await this.$onLaunched;
		this.missingFace = this.$api.shopSetting.store_logo;
		this.getShareContent();
		this.getShareCateChilds();
	},
	onHide() {
		this.videoPauseAll();
	},
	computed: {
		...mapGetters(['hasLogin'])
	},
	onPullDownRefresh() {
		this.page = 1;
		this.cateList.length = 0;
		this.shareContentList.length = 0;
		this.getShareContent();
		this.getShareCateChilds();
	},
	onReachBottom() {
		if (this.loadingStatus == 'nomore') return;
		this.page++;
		this.getShareContent();
	},
	methods: {
		async getShareCateChilds() {
			await this.$api.http
				.get(this.$api.apiShare.shareCateChilds, {
					params: {
						id: this.shareId
					}
				})
				.then(res => {
					this.cateList = res.data;
				});
		},
		async getShareContent() {
			this.loadingStatus = 'loading';
			await this.$api.http
				.get(this.$api.apiShare.shareContent, {
					params: {
						page: this.page,
						cate_id: this.shareId,
						page_size: this.$api.appConfig.pageSize
					}
				})
				.then(res => {
					this.loadingStatus = res.data.length == this.$api.appConfig.pageSize ? 'loadmore' : 'nomore';
					this.shareContentList = [...this.shareContentList, ...res.data];
					if (this.page == 1 && res.data.length == 0) {
						this.loadingStatus = 'noData';
					}
				})
				.catch(err => {
					this.loadingStatus = 'loadmore';
				});
			uni.stopPullDownRefresh();
		},
		cateTap(item) {
			this.$api.router.push({
				route: this.$api.routesConfig.shareList,
				query: {
					id: item.id,
					title: item.title
				}
			});
		},
		previewImgs(img, imgList) {
			// 预览图片
			uni.previewImage({
				current: img,
				urls: imgList
			});
		},
		// 分享
		shareTap(item) {
			this.tapDetail(item);
		},
		tapCollection(index) {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
			} else {
				//节流防抖
				this.$api.throttle(() => {
					this.shareContentList[index].isCollection ? this.handleCollectDel(index) : this.handleCollectCreate(index);
				}, 500);
			}
		},
		// 收藏
		handleCollectCreate(index) {
			this.$api.http
				.post(this.$api.apiShare.shareCollectionCreate, {
					content_id: this.shareContentList[index].id
				})
				.then(res => {
					this.shareContentList[index].isCollection = 1;
					this.$set(this.shareContentList, index, this.shareContentList[index]);
					this.$refs.dzToast.show({
						title: '已加入收藏列表',
						type: 'success'
					});
				});
		},
		// 取消收藏
		handleCollectDel(index) {
			this.$api.http
				.delete(
					this.$api.apiShare.shareCollectionDelete,
					{},
					{
						params: {
							content_id: this.shareContentList[index].id
						}
					}
				)
				.then(res => {
					this.shareContentList[index].isCollection = '';
					this.$set(this.shareContentList, index, this.shareContentList[index]);
					this.$refs.dzToast.show({
						title: '已取消收藏',
						type: 'success'
					});
				});
		},
		// 点赞
		tapLike(index) {
			if (!this.$api.store.getters.hasLogin) {
				this.login();
			} else {
				//节流防抖
				this.$api.throttle(() => {
					this.shareContentList[index].isLike ? this.handleLikeDel(index) : this.handleLikeCreate(index);
				}, 500);
			}
		},
		// 点赞
		handleLikeCreate(index) {
			this.$api.http
				.post(this.$api.apiShare.shareLikeCreate, {
					content_id: this.shareContentList[index].id
				})
				.then(res => {
					this.shareContentList[index].isLike = 1;
					this.shareContentList[index].like_count = parseInt(this.shareContentList[index].like_count) + 1;
					this.$set(this.shareContentList, index, this.shareContentList[index]);
					this.$refs.dzToast.show({
						title: '感谢客官的欣赏',
						type: 'success'
					});
				});
		},
		// 取消点赞
		handleLikeDel(index) {
			this.$api.http
				.delete(
					this.$api.apiShare.shareLikeDelete,
					{},
					{
						params: {
							content_id: this.shareContentList[index].id
						}
					}
				)
				.then(res => {
					this.shareContentList[index].isLike = '';
					this.shareContentList[index].like_count = parseInt(this.shareContentList[index].like_count) - 1;
					this.$set(this.shareContentList, index, this.shareContentList[index]);
					this.$refs.dzToast.show({
						title: '在下会继续努力,让客官喜欢',
						type: 'success'
					});
				});
		},
		tapDetail(item) {
			if (item.content_type == 0) {
				this.$api.router.push({
					route: this.$api.routesConfig.shareDetail,
					query: {
						id: item.id,
						title: item.title
					}
				});
			}
		},
		// 下载
		tapDownload(item) {
			if (!this.hasLogin) {
				this.$api.router.push({
					route: this.$api.routesConfig.login,
					query: {}
				});
				return;
			}
			this.downloadItem = item;
			this.download();
		},
		// 下载确认
		download() {
			if (this.downloadItem.content_type == 1) {
				// #ifdef APP-PLUS || MP
				this.downloadShow = true;
				this.imgDownloadTotal = this.downloadItem.cover.length;
				this.imgDownloadNum = 1;
				this.downloadText = this.imgDownloadNum + '/' + this.imgDownloadTotal;
				this.imgDownLoadProcess(this.imgDownloadNum);
				// #endif
				// #ifdef H5
				this.$refs.dzToast.show({
					title: '请点击图片并长按保存到相册',
					type: 'warning'
				});
				// #endif
			} else if (this.downloadItem.content_type == 2) {
				this.downloadShow = true;
				this.vedioDownloadPercent = 0;
				this.downloadText = this.vedioDownloadPercent + '%';
				this.vedioDownloadProcess();
			}
		},
		// 下载图片
		imgDownLoadProcess(index) {
			this.downloadTask = uni.downloadFile({
				url: this.downloadItem.cover[index - 1],
				success: res => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								if (index == this.downloadItem.cover.length) {
									this.$refs.dzToast.show({
										title: '已下载到您的手机相册',
										type: 'success'
									});
									this.downloadShow = false;
								} else {
									this.imgDownloadNum = index + 1;
									this.downloadText = this.imgDownloadNum + '/' + this.imgDownloadTotal;
									this.imgDownLoadProcess(this.imgDownloadNum);
								}
							},
							fail: () => {
								this.$refs.dzToast.show({
									title: '下载失败，请重试',
									type: 'warning'
								});
								this.downloadShow = false;
							}
						});
					}
				},
				fail: () => {
					this.$refs.dzToast.show({
						title: '下载失败，请重试',
						type: 'warning'
					});
					this.downloadShow = false;
				}
			});
		},
		// 下载视频
		vedioDownloadProcess() {
			let filePath = this.downloadItem.cover;
			let fileNames = filePath.split('/');
			let fileName = fileNames[fileNames.length - 1];

			this.downloadTask = uni.downloadFile({
				url: filePath,
				success: res => {
					if (res.statusCode === 200) {
						// #ifdef H5
						var linkElement = document.createElement('a');
						linkElement.setAttribute('href', res.tempFilePath);
						linkElement.setAttribute('downLoad', fileName);
						linkElement.click();
						linkElement.remove();
						setTimeout(() => {
							this.downloadShow = false;
						}, 500);
						// #endif
						// #ifdef APP-PLUS || MP
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$refs.dzToast.show({
									title: '已下载到您的手机相册',
									type: 'success'
								});
								this.downloadShow = false;
							},
							fail: () => {
								this.downloadShow = false;
								// #ifndef MP-WEIXIN
								this.$refs.dzToast.show({
									title: '保存失败，请重试',
									type: 'warning'
								});
								// #endif
								// #ifdef MP-WEIXIN
								this.downloadVideoErrorShow = true;
								// #endif
							}
						});
						// #endif
					}
				},
				fail: () => {
					this.$refs.dzToast.show({
						title: '下载失败，请重试',
						type: 'warning'
					});
					this.downloadShow = false;
				}
			});

			this.downloadTask.onProgressUpdate(res => {
				this.vedioDownloadPercent = res.progress;
				this.downloadText = res.progress + '%';
			});
		},
		// 下载取消
		downloadConfirm() {
			this.abortDownload();
		},
		abortDownload() {
			try {
				this.downloadTask.abort();
			} catch (e) {}
			this.downloadShow = false;
		},
		//视频点击播放事件 MP
		videoPlayClick(id) {
			this.activeVideo = id;
			uni.createVideoContext(String(id)).play();
			let list = this.shareContentList;
			for (let i = 0; i < list.length; i++) {
				if (parseInt(list[i].id) !== parseInt(id) && parseInt(list[i].content_type) === 2) {
					uni.createVideoContext(String(list[i].id)).pause();
				}
			}
		},
		//视频点击播放事件 APP OR H5
		videoPlaying(e) {
			// #ifdef APP-PLUS
			let index = 0;
			for (let i = 0; i < this.shareContentList.length; i++) {
				if (parseInt(this.shareContentList[i].content_type) === 2) {
					if (parseInt(e) !== i) {
						this.$refs.video[index].videoPause();
					}
					index++;
				}
			}
			// #endif
			// #ifdef H5
			let videos = document.getElementsByTagName('video');
			for (let i = 0; i < videos.length; i++) {
				if (videos[i].id != 'video-' + e) {
					videos[i].pause();
				}
			}
			// #endif
		},
		videoPauseAll() {
			let list = this.shareContentList;

			// #ifdef MP
			for (let i = 0; i < list.length; i++) {
				if (parseInt(list[i].content_type) == 2) {
					uni.createVideoContext(String(list[i].id)).pause();
				}
			}
			// #endif
			// #ifdef APP-PLUS
			let index = 0;
			for (let i = 0; i < list.length; i++) {
				if (parseInt(list[i].content_type) === 2) {
					this.$refs.video[index].videoPause();
					index++;
				}
			}
			// #endif
			// #ifdef H5
			let videos = document.getElementsByTagName('video');
			for (let i = 0; i < videos.length; i++) {
				videos[i].pause();
			}
			// #endif
		},
		login() {
			this.$api.router.push({
				route: this.$api.routesConfig.login,
				query: {}
			});
			return;
		},
		copyVideoUrl() {
			this.$api.helper.copy(this.downloadItem.cover[0]);
			this.$refs.dzToast.show({
				title: '视频链接已复制到剪贴板',
				type: 'success'
			});
			this.downloadVideoErrorShow = false;
		},
		copy(val) {
			this.$api.helper.copy(val);
			this.$refs.dzToast.show({
				title: '文案内容已复制到剪贴板',
				type: 'success'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding: 24rpx;
}
.scroll-tap {
	white-space: nowrap;
	margin-bottom: 20rpx;
	.scroll-item {
		display: inline-block;
		text-align: center;
		background-color: #ffffff;
		width: 166rpx;
		margin-right: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		.image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin: 0 auto;
		}
		.text {
			margin-top: 6rpx;
			font-size: 28rpx;
			color: $dz-tips-color;
		}
	}
	.scroll-item:last-of-type {
		margin-right: 0;
	}
}
.card {
	background-color: #ffffff;
	margin-bottom: 20rpx;
	border-radius: 20rpx;
	padding: 20rpx;
	.head {
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;
		.image {
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}
		.right {
			margin-left: 20rpx;
			.name {
				font-size: 32rpx;
				color: $dz-main-color;
			}
			.time {
				font-size: 24rpx;
				color: $dz-tips-color;
			}
		}
	}
	.tip {
		padding: 20rpx 0;
		color: $dz-main-color;
	}
	.image {
		display: flex;
		flex-wrap: wrap;
		margin-left: 2rpx;
		.img {
			width: 213rpx;
			height: 213rpx;
			display: block;
			margin: 5rpx;
		}
	}
	.article {
		position: relative;
		.image {
			width: 100%;
			height: 320rpx;
			border-radius: 15rpx;
		}
		text {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			top: 20rpx;
			right: 20rpx;
			width: 70rpx;
			height: 35rpx;
			font-size: 24rpx;
			border-radius: 6rpx;
			color: $dz-main-color;
			background-color: #ffffff;
		}
		.vedio-cover {
			position: relative;
			height: 400rpx;
			.video-icon {
				position: absolute;
				display: flex;
				justify-content: center;
				align-items: center;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.3);
			}
		}
	}
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		padding: 30rpx 0 10rpx;
		color: $dz-tips-color;
		.dzicon-iconfont {
			font-size: 36rpx;
			margin-right: 10rpx;
		}
		.flex {
			display: flex;
			align-items: center;
		}
		.footer-right,
		.footer-flet {
			display: flex;
		}
		.checked {
		}
	}
}
</style>
