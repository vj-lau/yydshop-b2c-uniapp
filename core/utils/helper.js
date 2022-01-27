//通用方法集合
import $mAppConfig from '../config/appConfig.js';
import $mDataConfig from '../config/dataConfig.js';
import $mLanguage from '../config/language.js';
import $mRoutesConfig from '../config/routesConfig.js';
import $dzToast from '../components/dz-toast/dz-toast'

if (!String.prototype.padStart) {
	String.prototype.padStart =
		function(maxLength, fillString = ' ') {
			if (Object.prototype.toString.call(fillString) !== "[object String]") throw new TypeError(
				'fillString must be String')
			let str = this
			if (str.length >= maxLength) return String(str)

			let fillLength = maxLength - str.length,
				times = Math.ceil(fillLength / fillString.length)
			while (times >>= 1) {
				fillString += fillString
				if (times === 1) {
					fillString += fillString
				}
			}
			return fillString.slice(0, fillLength) + str;
		}
}

/**
 * 提示
 */
function toast(title, duration = 3000, mask = false, icon = 'none') {
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title: title.toString(),
		duration: duration,
		mask: mask,
		icon: icon
	});
}

function dzToast(title) {
	$dzToast.show({
		title: title
	})
}

/**
 * 开发环境全局打印日志
 * @param {Object} title
 */
function log(title) {
	if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
		console.log(JSON.stringify(title));
	}
}

/**
 * 字符串格式化
 * @param {Object} str
 * @param {Object} data
 */
function formatString(str, data) {
	if (!str || data == undefined) {
		return str;
	}
	if (typeof data === "object") {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				str = str.replace(new RegExp("\{" + key + "\}", "g"), data[key]);
			}
		}
	} else {
		var args = arguments,
			reg = new RegExp("\{([0-" + (args.length - 1) + "])\}", "g");
		return str.replace(reg, function(match, index) {
			return args[index - (-1)];
		});
	}
	return str;
}

/**
 * 去除空格
 */
function trim(str, pos = 'both') {
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, "");
	} else if (pos == "left") {
		return str.replace(/^\s*/, '');
	} else if (pos == 'right') {
		return str.replace(/(\s*$)/g, "");
	} else if (pos == 'all') {
		return str.replace(/\s+/g, "");
	} else {
		return str;
	}
}

/**
 * 同步获取设备信息
 */
function getInfoAsync() {
	return new Promise((resolve, reject) => {
		plus.device.getInfo({
			success: function(e) {
				resolve(e);
			},
			fail: function(e) {
				reject(e.message);
			}
		});
	});
}

/**
 * 同步获取wgt版本信息
 */
function getWgtInfoAsync() {
	return new Promise((resolve, reject) => {
		try {
			plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
				resolve(wgtinfo);
			});
		} catch (e) {
			reject(e.message);
		}
	});
}

/**
 * 安卓10不支持IMEI,则获取OAID
 */
function getOaidAsync() {
	return new Promise((resolve, reject) => {
		plus.device.getOAID({
			success: function(e) {
				resolve(e);
			},
			fail: function(e) {
				reject(e.message);
			}
		});
	});
}

/**
 * 打开IOS设置面板
 */
function gotoiOSSetting() {
	var UIApplication = plus.ios.import("UIApplication");
	var application2 = UIApplication.sharedApplication();
	var NSURL2 = plus.ios.import("NSURL");
	var setting2 = NSURL2.URLWithString("App-prefs:root=General");
	application2.openURL(setting2);
	plus.ios.deleteObject(setting2);
	plus.ios.deleteObject(NSURL2);
	plus.ios.deleteObject(application2);
}

/**
 * 打开安卓设置面板
 */
function gotoAndroidSetting() {
	var Intent = plus.android.importClass("android.content.Intent");
	var Settings = plus.android.importClass("android.provider.Settings");
	var mainActivity = plus.android.runtimeMainActivity();
	var intent = new Intent(Settings.ACTION_SETTINGS);
	mainActivity.startActivity(intent);
}

/**
 * 获取一个随机数
 * @param {Object} min
 * @param {Object} max
 */
function random(min, max) {
	switch (arguments.length) {
		case 1:
			return parseInt(Math.random() * min + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (max - min + 1) + min, 10);
			break;
		default:
			return 0;
			break;
	}
}

/**
 * 打乱数组
 */
function randomArray(array = []) {
	// 原理是sort排序,Math.random()产生0<= x < 1之间的数,会导致x-0.05大于或者小于0
	return array.sort(() => Math.random() - 0.5);
}

/**
 * 获取数据最大值的下标
 */
function getMaxIndex(array = []) {
	if (array.length === 0) {
		return -1;
	}
	let max = array[0];
	let index = 0;
	for (let i = 0; i < array.length; i++) {
		if (max < array[i]) {
			max = array[i];
			index = i;
		}
	}
	return index;
}

/**
 * 获取ios的IDFA
 */
function getIdfa() {
	let idfa = '';
	try {
		if ('iOS' == plus.os.name) {
			let manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
			if (plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')) {
				let identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
				idfa = plus.ios.invoke(identifier, 'UUIDString');
				plus.ios.deleteObject(identifier);
			}
			plus.ios.deleteObject(manager);
		}
	} catch (e) {
		console.error('获取idfa失败');
	}
	return idfa;
}

/* 
 * 获取url字符串参数
 */
function getRequestParameters(locationhref) {
	let href = locationhref || "";
	let theRequest = new Object();
	let str = href.split("?")[1];
	if (str != undefined) {
		let strs = str.split("&");
		for (let i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/**
 * 加密字符串
 */
function strEncode(str) {
	const key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let l = key.length;
	let a = key.split("");
	let s = "",
		b, b1, b2, b3;
	for (let i = 0; i < str.length; i++) {
		b = str.charCodeAt(i);
		b1 = b % l;
		b = (b - b1) / l;
		b2 = b % l;
		b = (b - b2) / l;
		b3 = b % l;
		s += a[b3] + a[b2] + a[b1];
	}
	return s;
}

/**
 * 解密字符串
 */
function strDecode(str) {
	const key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let l = key.length;
	let b, b1, b2, b3, d = 0,
		s;
	s = new Array(Math.floor(str.length / 3));
	b = s.length;
	for (let i = 0; i < b; i++) {
		b1 = key.indexOf(str.charAt(d));
		d++;
		b2 = key.indexOf(str.charAt(d));
		d++;
		b3 = key.indexOf(str.charAt(d));
		d++;
		s[i] = b1 * l * l + b2 * l + b3
	}

	let out = "";
	for (let i = 0; i < s.length; i++) {
		out += String.fromCharCode(s[i])
	}
	return out
}

/**
 * 比较版本号
 * true 新版本大于旧版本
 */
function compareVersion(newV, oldV) {
	try {
		if (!newV || !oldV) {
			return false;
		}
		let arrNew = newV.split('.');
		let arrOld = oldV.split('.');
		let newNum = parseInt(arrNew[0]) * 10000 + parseInt(arrNew[1]) * 100 + parseInt(arrNew[2]);
		let oldNum = parseInt(arrOld[0]) * 10000 + parseInt(arrOld[1]) * 100 + parseInt(arrOld[2]);
		if (newNum > oldNum) {
			return true;
		}
		return false;
	} catch (e) {
		return false;
	}
}

/**
 * 计算页数
 * @param {Object} total
 * @param {Object} row
 */
function getPageNum(total, row) {
	let num = Number(total) / Number(row);
	//是否为整数
	if (num % 1 !== 0) {
		let b = num.toString(); //转字符串
		let a = parseInt(b.substring(0, b.indexOf('.'))); //取小数点前
		let s = b.replace(/\d+\.(\d*)/, '$1'); //取小数点后
		if (s > 0) {
			num = a + 1;
		}
	}
	return num;
}

/**
 * 是否是微信浏览器
 */
function h5IsWechat() {
	// #ifdef H5
	const ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/micromessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
	// #endif
	return false
}

/**
 * H5判断是否安卓或IOS
 */
function h5IsIosOrAndroid() {
	let isStr = ''
	// #ifdef H5
	let u = window.navigator.userAgent;
	let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
	let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

	if (isAndroid) {
		isStr = 'android'
	}
	if (isiOS) {
		isStr = 'ios'
	}
	// #endif
	return isStr
}


/**
 * 返回上一页携带参数
 */
function prePage(index) {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - (index || 2)];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

/**
 * 复制文本
 */
function copy(content) {
	// #ifdef H5
	let textarea = document.createElement('textarea');
	textarea.value = content;
	textarea.readOnly = 'readOnly';
	document.body.appendChild(textarea);
	textarea.select(); // 选择对象
	textarea.setSelectionRange(0, content.length); //核心
	let result = document.execCommand('Copy'); // 执行浏览器复制命令
	textarea.remove();
	return result;
	// #endif
	// #ifdef MP
	uni.setClipboardData({
		data: content,
		success: function() {
			uni.hideToast()
		}
	});
	return true;
	// #endif
	// #ifdef APP-PLUS
	try {
		var os = plus.os.name;
		content = content || '';
		if ('iOS' == os) {
			var pasteboard = plus.ios.invoke('UIPasteboard', 'generalPasteboard');
			plus.ios.invoke(pasteboard, 'setValue:forPasteboardType:', content, 'public.utf8-plain-text');
		} else {
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService('clipboard');
			plus.android.invoke(clip, 'setText', content);
		}
		return true;
	} catch (e) {
		return false;
	}
	// #endif
}

/**
 * 日期格式化
 */
function timeFormat(dateTime = null, fmt = 'yyyy-mm-dd') {
	// 如果为null,则格式化当前时间
	if (!dateTime) dateTime = Number(new Date());
	// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
	if (dateTime.toString().length == 10) dateTime *= 1000;
	let date = new Date(Number(dateTime));
	let ret;
	let opt = {
		"y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"h+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"s+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

/**
 * 过去日期转换
 */
function timeFrom(dateTime = null, format = 'yyyy-mm-dd') {
	// 如果为null,则格式化当前时间
	if (!dateTime) dateTime = Number(new Date());
	// 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
	if (dateTime.toString().length == 10) dateTime *= 1000;
	let timestamp = +new Date(Number(dateTime));

	let timer = (Number(new Date()) - timestamp) / 1000;
	// 如果小于5分钟,则返回"刚刚",其他以此类推
	let tips = '';
	switch (true) {
		case timer < 300:
			tips = '刚刚';
			break;
		case timer >= 300 && timer < 3600:
			tips = parseInt(timer / 60) + '分钟前';
			break;
		case timer >= 3600 && timer < 86400:
			tips = parseInt(timer / 3600) + '小时前';
			break;
		case timer >= 86400 && timer < 2592000:
			tips = parseInt(timer / 86400) + '天前';
			break;
		default:
			// 如果format为false，则无论什么时间戳，都显示xx之前
			if (format === false) {
				if (timer >= 2592000 && timer < 365 * 86400) {
					tips = parseInt(timer / (86400 * 30)) + '个月前';
				} else {
					tips = parseInt(timer / (86400 * 365)) + '年前';
				}
			} else {
				tips = timeFormat(timestamp, format);
			}
	}
	return tips;
}

//计算相差的天数
function timeDayDiff(timestampBefore, timestampAfter = null) {
	if (timestampBefore.toString().length == 10) timestampBefore *= 1000;

	if (timestampAfter == null) timestampAfter = Number(new Date());
	timestampAfter = parseInt(timestampAfter);
	if (timestampAfter.toString().length == 10) timestampAfter *= 1000;

	let diff = timestampAfter - timestampBefore;
	diff = parseInt(diff / 1000);

	return parseInt(diff / 86400);
}

/**
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier) 
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstD 将返回的首字母置为"d"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
function guid(len = 32, firstD = true, radix = null) {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	let uuid = [];
	radix = radix || chars.length;
	if (len) {
		// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
		for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		let r;
		// rfc4122标准要求返回的uuid中,某些位为固定的字符
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		for (let i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}
	// 移除第一个字符,并用d替代,因为第一个字符为数值时,该guuid不能用作id或者class
	if (firstD) {
		uuid.shift();
		return 'd' + uuid.join('');
	} else {
		return uuid.join('');
	}
}

/**
 * 验证电子邮箱格式
 */
function isEmail(value) {
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}

/**
 * 手机验证
 */
function isMobile(value, area = '86') {
	if (!$mDataConfig.mobilePattern[area]) {
		return false;
	}
	return $mDataConfig.mobilePattern[area].pattern.test(value);
}

/**
 * 验证URL格式
 */
function isUrl(value) {
	return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value)
}

/**
 * 验证日期格式
 */
function isDate(value) {
	return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 验证ISO类型的日期格式
 */
function isDateISO(value) {
	return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
}

/**
 * 验证十进制数字
 */
function isNumber(value) {
	return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
}

/**
 * 验证整数
 */
function isDigits(value) {
	return /^\d+$/.test(value)
}

/**
 * 验证身份证号码
 */
function isIdCard(value) {
	return /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value);
}

/**
 * 是否车牌号
 */
function isCarNo(value) {
	// 新能源车牌
	const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
	// 旧车牌
	const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if (value.length === 7) {
		return creg.test(value);
	} else if (value.length === 8) {
		return xreg.test(value);
	} else {
		return false;
	}
}

/**
 * 金额,只允许2位小数
 */
function isAmount(value) {
	//金额，只允许保留两位小数
	return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
}

/**
 * 中文
 */
function isChinese(value) {
	let reg = /^[\u4e00-\u9fa5]+$/gi;
	return reg.test(value);
}

/**
 * 多行中文
 */
function isChineseTextarea(value) {
	let reg =
		/^[\u4e00-\u9fa5\u0020\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]+$/gi;
	return reg.test(value);
}

/**
 * 只能输入字母
 */
function isLetter(value) {
	return /^[a-zA-Z]*$/.test(value);
}

/**
 * 只能是字母或者数字
 */
function isEnOrNum(value) {
	//英文或者数字
	let reg = /^[0-9a-zA-Z]*$/g;
	return reg.test(value);
}

/**
 * 多行中文只能输入字母
 */
function isLetterTextarea(value) {
	//英文
	let reg = /^[a-zA-Z-\u0020-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]*$/g;
	return reg.test(value);
}

/**
 * 多行中文只能输入英文或者数字
 */

function isEnOrNumTextarea(value) {
	//英文或者数字
	let reg = /^[0-9a-zA-Z-\u0020-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]*$/g;
	return reg.test(value);
}

/**
 * 验证是否包含某个值
 */
function isContains(value, param) {
	return value.indexOf(param) >= 0
}

/**
 * 验证一个值范围[min, max]
 */
function isRange(value, param) {
	return value >= param[0] && value <= param[1]
}

/**
 * 验证一个长度范围[min, max]
 */
function isRangeLength(value, param) {
	return value.length >= param[0] && value.length <= param[1]
}

/**
 * 是否固定电话
 */
function isLandline(value) {
	let reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
	return reg.test(value);
}

/**
 * 判断是否为空
 */
function isEmpty(value) {
	switch (typeof value) {
		case 'undefined':
			return true;
		case 'string':
			if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if (!value) return true;
			break;
		case 'number':
			if (0 === value || isNaN(value)) return true;
			break;
		case 'object':
			if (null === value || value.length === 0) return true;
			for (var i in value) {
				return false;
			}
			return true;
	}
	return false;
}

/**
 * 是否json字符串
 */
function isJsonString(value) {
	if (typeof value == 'string') {
		try {
			var obj = JSON.parse(value);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
	return false;
}


/**
 * 是否数组
 */
function isArray(value) {
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

/**
 * 是否对象
 */
function isObject(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 求两个颜色之间的渐变值
 * @param {string} startColor 开始的颜色
 * @param {string} endColor 结束的颜色
 * @param {number} step 颜色等分的份额
 * */
function colorGradient(startColor = 'rgb(0, 0, 0)', endColor = 'rgb(255, 255, 255)', step = 10) {
	let startRGB = hexToRgb(startColor, false); //转换为rgb数组模式
	let startR = startRGB[0];
	let startG = startRGB[1];
	let startB = startRGB[2];

	let endRGB = hexToRgb(endColor, false);
	let endR = endRGB[0];
	let endG = endRGB[1];
	let endB = endRGB[2];

	let sR = (endR - startR) / step; //总差值
	let sG = (endG - startG) / step;
	let sB = (endB - startB) / step;
	let colorArr = [];
	for (let i = 0; i < step; i++) {
		//计算每一步的hex值 
		let hex = rgbToHex('rgb(' + Math.round((sR * i + startR)) + ',' + Math.round((sG * i + startG)) + ',' + Math
			.round((
				sB *
				i + startB)) + ')');
		colorArr.push(hex);
	}
	return colorArr;
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
function hexToRgb(sColor, str = true) {
	let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	sColor = sColor.toLowerCase();
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			let sColorNew = "#";
			for (let i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		let sColorChange = [];
		for (let i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		if (!str) {
			return sColorChange;
		} else {
			return `rgb(${sColorChange[0]},${sColorChange[1]},${sColorChange[2]})`;
		}
	} else if (/^(rgb|RGB)/.test(sColor)) {
		let arr = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",")
		return arr.map(val => Number(val));
	} else {
		return sColor;
	}
};

// 将rgb表示方式转换为hex表示方式
function rgbToHex(rgb) {
	let _this = rgb;
	let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	if (/^(rgb|RGB)/.test(_this)) {
		let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		let strHex = "#";
		for (let i = 0; i < aColor.length; i++) {
			let hex = Number(aColor[i]).toString(16);
			hex = String(hex).length == 1 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
			if (hex === "0") {
				hex += hex;
			}
			strHex += hex;
		}
		if (strHex.length !== 7) {
			strHex = _this;
		}
		return strHex;
	} else if (reg.test(_this)) {
		let aNum = _this.replace(/#/, "").split("");
		if (aNum.length === 6) {
			return _this;
		} else if (aNum.length === 3) {
			let numHex = "#";
			for (let i = 0; i < aNum.length; i += 1) {
				numHex += (aNum[i] + aNum[i]);
			}
			return numHex;
		}
	} else {
		return _this;
	}
}

/**
 * JS颜色十六进制转换为rgb或rgba,返回的格式为 rgba（255，255，255，0.5）字符串
 * sHex为传入的十六进制的色值
 * alpha为rgba的透明度
 */
function colorToRgba(color, alpha = 0.3) {
	color = rgbToHex(color)
	// 十六进制颜色值的正则表达式
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
	/* 16进制颜色转为RGB格式 */
	let sColor = color.toLowerCase()
	if (sColor && reg.test(sColor)) {
		if (sColor.length === 4) {
			var sColorNew = '#'
			for (let i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
			}
			sColor = sColorNew
		}
		// 处理六位的颜色值
		var sColorChange = []
		for (let i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
		}
		// return sColorChange.join(',')
		return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
	} else {
		return sColor
	}
}

/**
 * 深度克隆
 * @param {Object} obj
 */
function deepClone(obj) {
	// 对常见的“非”值，直接返回原来值
	if ([null, undefined, NaN, false].includes(obj)) return obj;
	if (typeof obj !== "object" && typeof obj !== 'function') {
		//原始类型直接返回
		return obj;
	}
	var o = isArray(obj) ? [] : {};
	for (let i in obj) {
		if (obj.hasOwnProperty(i)) {
			o[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
		}
	}
	return o;
}

// JS对象深度合并
function deepMerge(target = {}, source = {}) {
	target = deepClone(target);
	if (typeof target !== 'object' || typeof source !== 'object') return false;
	for (var prop in source) {
		if (!source.hasOwnProperty(prop)) continue;
		if (prop in target) {
			if (typeof target[prop] !== 'object') {
				target[prop] = source[prop];
			} else {
				if (typeof source[prop] !== 'object') {
					target[prop] = source[prop];
				} else {
					if (target[prop].concat && source[prop].concat) {
						target[prop] = target[prop].concat(source[prop]);
					} else {
						target[prop] = deepMerge(target[prop], source[prop]);
					}
				}
			}
		} else {
			target[prop] = source[prop];
		}
	}
	return target;
}
/*
 * obj 转 params字符串参数  
 * 例子：{a:1,b:2} => a=1&b=2
 */
function objParseParam(obj) {
	let paramsStr = "";
	if (obj instanceof Array) return paramsStr;
	if (!(obj instanceof Object)) return paramsStr;
	for (let key in obj) {
		if (obj[key]) {
			paramsStr += `${key}=${obj[key]}&`;
		}
	}
	return paramsStr.substring(0, paramsStr.length - 1);
}

/* 
 * obj 转 路由地址带参数
 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
 */
function objParseUrlAndParam(path, obj) {
	let url = path || "/";
	let paramsStr = "";
	if (obj instanceof Array) return url;
	if (!(obj instanceof Object)) return url;
	paramsStr = objParseParam(obj);
	paramsStr && (url += "?");
	url += paramsStr;
	return url;
}

/**
 * 去除url中指定的参数
 * @param {Object} url
 * @param {Object} parameter
 */
function delUrlParams(url, parameter) {
	let str = "";

	if (url.indexOf('?') != -1) {
		str = url.substr(url.indexOf('?') + 1);
	} else {
		return url;
	}

	let arr = "";
	let returnurl = "";
	let setparam = "";
	if (str.indexOf('&') != -1) {
		arr = str.split('&');
		for (let i in arr) {
			if (arr[i].split('=')[0] != parameter) {
				returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
			}
		}
		return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
	} else {
		arr = str.split('=');
		if (arr[0] == parameter) {
			return url.substr(0, url.indexOf('?'));
		} else {
			return url;
		}
	}
}

/**
 * 去除url中的全部参数
 * @param {Object} url
 */
function delAllUrlParams(url) {
	let urlparts = url.split('?');
	if (urlparts.length >= 2) {
		return urlparts[0];
	}
	return url;
}

/**
 * 掩码
 * @param {Object} str
 * @param {Object} startLength
 * @param {Object} endLength
 */
function maskCode(str, startLength, endLength) {
	if (!str) {
		return '';
	}
	let len = str.length - startLength - endLength;
	if (len <= 0) {
		return str;
	}
	let mask = '';
	for (let i = 0; i < len; i++) {
		mask += '*';
	}
	return str.substring(0, startLength) + mask + str.substring(str.length - endLength);
}

/**
 * 无能的微信小程序不能在模板中直接使用parseFloat
 * @param {Object} d
 */
function toFloat(d) {
	return parseFloat(d);
}


/**
 * 解决有些时候会四舍五入
 */
function toFixed(number, n) {
	if (typeof(number * 1) != 'number' || isNaN(number * 1)) return number
	let a, b;
	a = number.toString().split('.')

	if (a.length == 1) return a[0] * 1
	b = a[0] + '.' + a[1].substr(0, n)

	return b
}




/**
 * 获取系统剪贴板内容
 * @returns {Promise<string>} 剪贴板内容
 */
function getClipboardData() {
	return new Promise((success, fail) => {
		// #ifndef H5
		uni.getClipboardData({
			success: ({
				data
			}) => success(data),
			fail
		})
		// #endif

		// #ifdef H5
		try {
			navigator.clipboard.readText().then(success).catch(fail)
		} catch (error) {
			fail(error)
		}
		// #endif
	})
}

export default {
	toast,
	dzToast,
	log,
	formatString,
	trim,
	getInfoAsync,
	getWgtInfoAsync,
	getOaidAsync,
	gotoiOSSetting,
	gotoAndroidSetting,
	random,
	randomArray,
	getMaxIndex,
	getIdfa,
	getRequestParameters,
	strEncode,
	strDecode,
	compareVersion,
	getPageNum,
	h5IsWechat,
	h5IsIosOrAndroid,
	prePage,
	copy,
	timeFormat,
	timeFrom,
	timeDayDiff,
	guid,
	isEmail,
	isMobile,
	isUrl,
	isDate,
	isDateISO,
	isNumber,
	isDigits,
	isIdCard,
	isCarNo,
	isAmount,
	isChinese,
	isLetter,
	isEnOrNum,
	isContains,
	isRange,
	isRangeLength,
	isLandline,
	isEmpty,
	isJsonString,
	isArray,
	isObject,
	colorGradient,
	hexToRgb,
	rgbToHex,
	colorToRgba,
	deepClone,
	deepMerge,
	objParseParam,
	objParseUrlAndParam,
	delUrlParams,
	delAllUrlParams,
	maskCode,
	toFloat,
	toFixed,
	getClipboardData,
	isChineseTextarea,
	isLetterTextarea,
	isEnOrNumTextarea
}
