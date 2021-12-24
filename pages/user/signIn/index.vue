<template>
	<view class="container">
		<dz-navbar title="签到" :background="{ background: '' }" :immersive="true" title-color="#fff" back-icon-color="#fff" :border-bottom="false"></dz-navbar>
		<view class="dz-bg__box" :class="['dz-theme__' + theme]">
			<view class="dz-sign__record" @tap="themeChange">
				<view class="dz-record__item">
					<view class="dz-record__title">你已连续签到</view>
					<view class="dz-record__num">
						<text class="dz-num__size">{{ signinInfo.days_continue }}</text>
						天
					</view>
				</view>
				<view class="dz-record__item">
					<view class="dz-record__title">你的最高纪录</view>
					<view class="dz-record__num">
						<text class="dz-num__size">{{ signinInfo.days_total }}</text>
						天
					</view>
				</view>
			</view>
			<view class="dz-sign__navbar">
				<view class="dz-flex-center" @tap="switchTab(0)"><image :src="signImgCalendar" class="dz-navbar__img"></image></view>
				<view class="dz-flex-center" @tap="switchTab(1)"><image :src="signImgRanking" class="dz-navbar__img"></image></view>
			</view>
			<image :style="{ transform: `translate3d(${current == 0 ? x1 : x2}px,0,0)` }" :src="signImgTriangle" class="dz-tab__triangle"></image>
		</view>
		<view class="dz-content__box">
			<view class="dz-calendar__box" v-show="current == 0">
				<view class="dz-calendar__hrader">
					<view class="dz-arrow__box" @tap="monthChange(0)" v-show="swiperIndex > 0"><image :src="signImgLeftarrow" class="dz-arrow__img"></image></view>
					<view class="dz-calendar__title">{{ showTitle }}</view>
					<view class="dz-arrow__box dz-arrow__right" @tap="monthChange(1)" v-show="swiperIndex < 2"><image :src="signImgGoto" class="dz-arrow__img"></image></view>
				</view>
				<view class="dz-date__header dz-flex__between">
					<view class="dz-date">日</view>
					<view class="dz-date">一</view>
					<view class="dz-date">二</view>
					<view class="dz-date">三</view>
					<view class="dz-date">四</view>
					<view class="dz-date">五</view>
					<view class="dz-date">六</view>
				</view>
				<swiper class="dz-calendar__swiper" :style="{ height: calendarH + 'px' }" @change="change" :current="swiperIndex">
					<swiper-item v-for="(calendar, index) in calendarList" :key="index">
						<scroll-view scroll-y :style="{ height: calendarH + 'px' }">
							<view class="dz-date__content dz-pseudo__after dz-flex__between" :class="{ 'dz-pseudo__before': index === 0 }">
								<view
									class="dz-date__box dz-pseudo "
									:class="{ 'dz-date__today': calendar.year == year && calendar.month == month && item.date == day }"
									v-for="(item, subIndex) in calendar.data"
									:key="subIndex"
									:style="{ minHeight: calendarH / 6 + 'px' }"
									@tap="detail(item.gift, calendar.year == year && calendar.month == month && item.date == day - 1 && item.signInDays == 0)"
								>
									<view class="dz-date__num" v-if="item.date">{{ item.date }}</view>
									<image :src="signedInImg" class="dz-check__img" v-if="item.signed"></image>
									<!-- 已签到 -->
									<image :src="ruleFormat.cover ? ruleFormat.cover : getGiftImg(item.gift)" class="dz-gift__img" v-if="item.gift && !item.signed"></image>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="dz-ranking__box" v-show="current == 1" :style="{ height: rankingH + 'px' }">
				<scroll-view scroll-y :style="{ height: rankingH + 'px' }">
					<view class="dz-ranking__content">
						<view class="dz-ranking__title">
							<image :src="signImgMedal" class="dz-medal__img"></image>
							<text>连续签到天数前10名：</text>
						</view>
						<view class="dz-ranking__item" :class="{ 'dz-ranking__bg': index % 2 !== 0 }" v-for="(item, index) in userList" :key="index">
							<image :src="getRankingImg(index)" class="dz-ranking__img" v-if="index < 3"></image>
							<view class="dz-ranking__num" v-else>{{ index + 1 }}</view>
							<image :src="(item.member && item.member.head_portrait) || missingFace" class="dz-avatar__img"></image>
							<view class="dz-sign__username">{{ item.member && item.member.nickname }}</view>
							<view class="dz-sign__days">{{ item.days_continue }}天</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="dz-btn__sign" :hover-stay-time="150" @tap="btnSign" v-if="!signed" :style="{ background: themes.dzBaseColor }">
			{{ signinInfo.signin_today == 1 ? '已签到' : '签到' }}
		</view>
		<dz-modal
			v-model="modalShow"
			:mask-close-able="false"
			:title="modalTitle"
			:content="modalContent"
			:show-cancel-button="false"
			:confirm-color="themes.dzBaseColor"
			:async-close="false"
			@confirm="modalConfirm"
		></dz-modal>
		<dz-page-loading :show="pageLoadingShow" :status="pageLoadingStatus" @click="pageLoadingClick"></dz-page-loading>
	</view>
</template>

<script>
//数据只为演示，并非真实操作，请根据实际情况对接数据
export default {
	data() {
		return {
			missingFace: this.$api.assetsConfig.missingFace,
			signImgCalendar: this.$api.assetsConfig.signImgCalendar,
			signImgRanking: this.$api.assetsConfig.signImgRanking,
			signImgTriangle: this.$api.assetsConfig.signImgTriangle,
			signImgLeftarrow: this.$api.assetsConfig.signImgLeftarrow,
			signImgGoto: this.$api.assetsConfig.signImgGoto,
			signedInImg: this.$api.assetsConfig.signedInImg,
			signImgGift: this.$api.assetsConfig.signImgGift,
			signImgDouble: this.$api.assetsConfig.signImgDouble,
			signImgMedal: this.$api.assetsConfig.signImgMedal,
			signImgFirst: this.$api.assetsConfig.signImgFirst,
			signImgSecond: this.$api.assetsConfig.signImgSecond,
			signImgThird: this.$api.assetsConfig.signImgThird,
			themes: this.$api.theme,
			pageLoadingShow: true,
			pageLoadingStatus: 'loading',
			height: 44,
			top: 12,
			winWidth: 600,
			current: 0,
			x1: 0,
			x2: 0,
			theme: 'day', //主题：day|night 白天|夜晚
			calendarH: 380,
			rankingH: 420,
			userList: [],
			year: 2020,
			month: 7,
			day: 7,
			showTitle: '2020年07月',
			//日历数据
			calendarList: [],
			signed: false,
			swiperIndex: 1,
			loading: false,
			modalShow: false,
			modalContent: '',
			modalTitle: '',
			signinInfo: {},
			giftData: '',
			ruleFormat: {}
		};
	},
	onLoad(options) {
		const date = new Date();
		const hours = date.getHours();
		if (hours >= 18 || hours < 6) {
			this.theme = 'night';
		}
		//初始化日历数据  近3个月 (数据可后端传回)
		this.year = date.getFullYear();
		this.month = date.getMonth() + 1;
		this.day = date.getDate();
		this.showTitle = `${this.year}年${this.formatNum(this.month)}月`;
		this.calendarList = [{}, this.getCalendarData(this.year, this.month, 1), {}];
		setTimeout(() => {
			let sys = uni.getSystemInfoSync();
			this.winWidth = sys.windowWidth;
			const w = uni.upx2px(32) / 2;
			this.x1 = this.winWidth / 4 - w;
			this.x2 = (this.winWidth * 3) / 4 - w;
			let h = 440;
			// #ifdef H5
			h = 400;
			// #endif
			this.calendarH = sys.windowHeight - uni.upx2px(h + 100 + 64);
			this.rankingH = sys.windowHeight - uni.upx2px(h);
		}, 66);
		this.getSigninIndex();
		this.getRanking();
	},
	methods: {
		pageLoadingClick() {
			this.getSigninIndex();
		},
		getSigninIndex() {
			this.$api.http
				.get(this.$api.apiShop.signinIndex)
				.then(res => {
					this.signinInfo = res.data.sign_info;
					for (let i in res.data.rule_format) {
						this.giftData = i;
						this.ruleFormat = res.data.rule_format[i];
					}
					let giftDate = this.giftData.split('-');
					let i = this.calendarList[1].data.findIndex(item => item.dateSting == this.giftData);
					if (i != -1) {
						this.calendarList[1].data[i].gift = 1;
					}
					res.data.log.forEach(item => {
						let date = item.signin_date.split('-');
						let index = this.calendarList[1].data.findIndex(val => val.dateSting == item.signin_date);
						if (index != -1) {
							this.calendarList[1].data[index].signed = true;
						}
					});
					this.pageLoadingShow = false;
				})
				.catch(err => {
					this.pageLoadingStatus = 'error';
				});
		},
		getRankingImg(index) {
			index = index || 0;
			let img = '';
			if (index < 3) {
				img = [this.signImgFirst, this.signImgSecond, this.signImgThird][index];
			}
			return img;
		},
		getGiftImg(gift) {
			gift = gift || 0;
			return ['', this.signImgGift, this.signImgDouble][gift]; //礼包  /* 2
		},
		getSigninLog(year, month, i) {
			this.$api.http
				.get(this.$api.apiShop.signinLog, {
					params: {
						year,
						month
					}
				})
				.then(res => {
					res.data.forEach(item => {
						let index = this.calendarList[i].data.findIndex(res => res.dateSting == item.signin_date);
						if (index != -1) {
							this.calendarList[i].data[index].signed = true;
						}
					});
				});
		},
		// 排行榜
		getRanking() {
			this.$api.http.get(this.$api.apiShop.ranking).then(res => {
				this.userList = res.data;
			});
		},
		switchTab(index) {
			this.current = index;
			if (index == 1) {
			}
		},
		//此处只为做演示，实际开发应按照时间切换
		themeChange() {
			this.theme = this.theme === 'day' ? 'night' : 'day';
		},
		formatNum: function(num) {
			return num < 10 ? '0' + num : num + '';
		},
		//一个月有多少天
		getMonthDay(year, month) {
			let days = new Date(year, month, 0).getDate();
			return days;
		},
		getWeekday(year, month) {
			let date = new Date(`${year}/${month}/01 00:00:00`);
			return date.getDay();
		},
		change: function(e) {
			let current = e.detail.current;
			let year = this.year;
			let month = this.month;
			this.swiperIndex = current;
			setTimeout(() => {
				if (current == 0) {
					month = month - 1;
					year = month < 1 ? year - 1 : year;
					month = month < 1 ? 12 : month;
					if (!this.calendarList[0].data) {
						// this.loading=true;
						this.$set(this.calendarList, 0, this.getCalendarData(year, month, 0));
						this.getSigninLog(year, month, 0);
					}
				} else if (current == 2) {
					month = month + 1;
					year = month > 12 ? year + 1 : year;
					month = month > 12 ? 1 : month;
					if (!this.calendarList[2].data) {
						this.$set(this.calendarList, 2, this.getCalendarData(year, month, 2));
						this.getSigninLog(year, month, 2);
					}
				}
				this.showTitle = `${year}年${this.formatNum(month)}月`;
			}, 300);
		},
		getCalendarData(year, month, index) {
			this.days = this.getMonthDay(year, month);
			//前补位
			let frontItemNum = this.getWeekday(year, month);
			//后补位
			let behindItemNum = 42 - this.days - frontItemNum;
			let data = [];
			for (let f = 0; f < frontItemNum; f++) {
				data.push({});
			}

			for (let i = 0; i < this.days; i++) {
				//根据实际情况调整即可
				//连续签到天数
				let signInDays = 0;
				//gift:0-无奖励，1-礼品 2-积分翻倍
				let gift = 0;
				if (index !== 0) {
					// i === 6 && (gift = 1);
					// i === 20 && (gift = 2);
				}
				//是否已签到
				let signed = false;

				let day = i + 1 < 10 ? '0' + (i + 1) : i + 1;
				let dateSting = year + '-' + this.formatNum(month) + '-' + day;
				if (dateSting == this.giftData) {
					gift = 1;
				}
				data.push({
					date: i + 1,
					dateSting: dateSting,
					signInDays: signInDays,
					gift: gift,
					signed: signed
				});
			}
			for (let b = 0; b < behindItemNum; b++) {
				data.push({});
			}

			return {
				year: year,
				month: month,
				frontItemNum: frontItemNum,
				behindItemNum: behindItemNum,
				data: data
			};
		},
		monthChange(index) {
			if (index == 0) {
				this.swiperIndex = this.swiperIndex - 1;
			} else {
				this.swiperIndex = this.swiperIndex + 1;
			}
		},
		detail(gift, missedSign) {
			if (gift == 1 || gift == 2) {
				this.modalShow = true;
			}
			if (gift == 1) {
				this.modalTitle = '提示';

				this.modalContent = this.ruleFormat.remark;
			} else if (gift == 2) {
				this.modalTitle = '积分双倍';
				this.modalContent = '每连续签到21天即可领取双倍积分奖励';
			}
		},
		modalConfirm() {
			this.modalShow = false;
		},
		btnSign() {
			if (this.signinInfo.signin_today == 1) return;
			this.$api.http.post(this.$api.apiShop.signin).then(res => {
				this.getSigninIndex();
				this.getRanking();
				this.modalShow = true;
				this.modalTitle = '签到成功';
				this.modalContent = `恭喜你获得${res.data.points}积分奖励`;
				uni.$emit('sgninChange', {
					type: 'update'
				});
			});
		}
	}
};
</script>

<style lang="scss">
page,
.container {
	min-height: 100%;
	background-color: #ffffff;
}

.dz-header__back {
	position: absolute;
	left: 12rpx;
}

.dz-back__img {
	width: 60rpx;
	height: 60rpx;
}

.dz-bg__box {
	padding-top: calc(108rpx + var(--status-bar-height));
	width: 100%;
	/* #ifndef H5 */
	height: 440rpx;
	/* #endif */
	/* #ifdef H5 */
	height: 400rpx;
	/* #endif */
	padding-left: 30rpx;
	padding-right: 30rpx;
	box-sizing: border-box;
	position: relative;
}

.dz-theme__day {
	background: linear-gradient(to bottom, #3d4fd2, #ac8aeb);
}

.dz-theme__night {
	background: linear-gradient(to bottom, #00eaff, #0396ff);
}

.dz-sign__record {
	width: 100%;
	height: 160rpx;
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
}

.dz-record__item {
	flex: 1;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	font-size: 28rpx;
	position: relative;
}

.dz-record__item:first-child::after {
	content: '';
	position: absolute;
	width: 1rpx;
	height: 76%;
	right: 0;
	top: 12%;
	background-color: rgba(255, 255, 255, 0.3);
	transform: scaleX(0.5);
	transform-origin: 100% 0;
}

.dz-record__title {
	color: rgba(255, 255, 255, 0.7);
}

.dz-record__num {
	color: #ffffff;
	padding-top: 8rpx;
}

.dz-num__size {
	font-size: 64rpx;
	line-height: 64rpx;
	padding-right: 8rpx;
}

.dz-sign__navbar {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: absolute;
	left: 0;
	bottom: 40rpx;
}

.dz-navbar__img {
	width: 54rpx;
	height: 54rpx;
}

.dz-flex-center {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dz-tab__triangle {
	width: 38rpx;
	height: 20rpx;
	position: absolute;
	left: 0;
	bottom: 0;
	transition: 0.2s;
}

.dz-flex__between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.dz-calendar__hrader {
	width: 100%;
	height: 100rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
	position: relative;
	display: flex;
	align-items: center;
}

.dz-arrow__right {
	margin-left: auto;
}

.dz-calendar__title {
	color: #333;
	font-size: 32rpx;
	line-height: 32rpx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.dz-arrow__box {
	padding: 20rpx 20rpx 20rpx 0;
}

.dz-arrow__box:last-child {
	padding-right: 0 !important;
	padding-left: 20rpx;
}

.dz-arrow__img {
	width: 16rpx;
	height: 31rpx;
}

.dz-date__header {
	width: 100%;
	height: 64rpx;
	color: #999;
}

.dz-date {
	flex: 1;
	flex-shrink: 0;
	text-align: center;
	font-size: 28rpx;
	line-height: 28rpx;
}

.dz-date__content {
	flex-wrap: wrap;
	position: relative;
}

.dz-pseudo::before,
.dz-pseudo__before::before {
	content: ' ';
	position: absolute;
	width: 1px;
	height: 100%;
	-webkit-transform: scaleX(0.5);
	transform: scaleX(0.5);
	z-index: 2;
	pointer-events: none;
}

.dz-pseudo::after,
.dz-pseudo__after::after {
	content: ' ';
	position: absolute;
	right: 0;
	left: 0;
	width: 100%;
	height: 1px;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	z-index: 2;
	pointer-events: none;
}

.dz-date__content::before {
	bottom: 0;
	left: 0;
	border-left: 1px solid #eaeef1;
	transform-origin: 0 0;
}

.dz-date__content::after {
	bottom: 0;
	border-bottom: 1px solid #eaeef1;
	transform-origin: 0 100%;
}

.dz-date__box {
	width: 14.2857%;
	height: 146rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	flex-shrink: 0;
	position: relative;
	padding: 20rpx 0;
	box-sizing: border-box;
}

.dz-date__box::before {
	top: 0;
	right: 0;
	border-right: 1px solid #eaeef1;
	transform-origin: 100% 0;
}

.dz-date__box::after {
	top: 0;
	border-top: 1px solid #eaeef1;
	transform-origin: 0 0;
}

.dz-date__today {
	background-color: #fff7e9;
}

.dz-date__num {
	font-size: 26rpx;
	color: #333;
}

.dz-gift__img {
	width: 52rpx;
	height: 52rpx;
	flex-shrink: 0;
}

.dz-check__img {
	width: 34rpx;
	height: 25rpx;
	flex-shrink: 0;
}

.dz-ranking__content {
	padding: 40rpx 0 30rpx;
	box-sizing: border-box;
}

.dz-ranking__title {
	width: 100%;
	display: flex;
	align-items: center;
	color: $dz-light-color;
	font-size: 28rpx;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
}

.dz-medal__img {
	width: 27rpx;
	height: 35rpx;
	margin-right: 12rpx;
}

.dz-ranking__item {
	width: 100%;
	padding: 30rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
}

.dz-ranking__img {
	width: 48rpx;
	height: 48rpx;
	margin-right: 30rpx;
	flex-shrink: 0;
}

.dz-ranking__num {
	width: 44rpx;
	text-align: center;
	font-size: 32rpx;
	color: $dz-light-color;
	margin-right: 30rpx;
	flex-shrink: 0;
}

.dz-avatar__img {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.dz-sign__username {
	width: 360rpx;
	font-size: 30rpx;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
}

.dz-sign__days {
	font-size: 26rpx;
	margin-left: auto;
	color: #f8683c;
}

.dz-ranking__bg {
	background-color: $dz-bg-color;
}

.dz-btn__sign {
	width: 340rpx;
	height: 72rpx;
	border-radius: 72rpx;
	position: fixed;
	left: 50%;
	bottom: 60rpx;
	transform: translateX(-50%);
	z-index: 3;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
