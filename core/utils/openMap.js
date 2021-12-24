//使用方法
// import Map from '@/core/utils/openMap.js'
// //既有起点也有终点
// var options = {
//     origin:{  //导航起点坐标和名称,如果不传则起点为当前位置
//         latitude:39.92848272,
//         longitude:116.39560823,
//         name:"起点名称"
//     },
//     destination:{  //导航终点点坐标和名称
//         latitude:39.98848272,
//         longitude:116.47560823,
//         name:"终点名称"
//     },
//     mode:"drive"  //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
// }
// //只有有终点(起点默认为当前位置)
// var options = {
//     destination:{  //导航终点点坐标和名称
//         latitude:39.98848272,
//         longitude:116.47560823,
//         name:"终点名称"
//     },
//     mode:"drive"  //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
// }
// Map.openMap(options,type)
let itemList = ["百度地图","高德地图","腾讯地图"];
// #ifdef APP-PLUS
var isBaidu = plus.runtime.isApplicationExist({pname:'com.baidu.BaiduMap',action:'baidumap://'});
var isGaode = plus.runtime.isApplicationExist({pname:'com.autonavi.minimap',action:'iosamap://'});
var isQQ = plus.runtime.isApplicationExist({pname:'com.tencent.map',action:'qqmap://'});
let AppitemList = [{title:"腾讯地图"}];
if(isBaidu && isGaode){
	AppitemList = [{title:"百度地图"},{title:"高德地图"},{title:"腾讯地图"}];
}
if(!isBaidu && isGaode){
	AppitemList = [{title:"高德地图"},{title:"腾讯地图"}];
}
if(isBaidu && !isGaode){
	AppitemList = [{title:"百度地图"},{title:"腾讯地图"}];
}
// #endif
function openMapByAndroid(origin, destination,mode) {
	let originName = origin&&origin.name?origin.name:"起点";
	let destinationName = destination.name?destination.name:"终点";
	var bdMode = "driving";
	if(mode == "bus"){
		bdMode = "transit";
	}else if(mode == "walk"){
		bdMode = "walking";
	}else if(mode == "bike"){
		bdMode = "riding";
	}
	var bdapp = "bdapp://map/direction?destination=name:"+destinationName+"|latlng:"+destination.latitude+","+destination.longitude+"&coord_type=gcj02&mode="+bdMode+"&src=uniapp";
	if(origin){
		bdapp = "bdapp://map/direction?origin=name:"+originName+"|latlng:"+origin.latitude+","+origin.longitude+"&destination=name:"+destinationName+"|latlng:"+destination.latitude+","+destination.longitude+"&coord_type=gcj02&mode="+bdMode+"&src=uniapp";
	}
	var bdappDown = "http://map.baidu.com/zt/qudao/newfengchao/1012337a/html/slide.html"
	var amapMode = 0;
	if(mode == "bus"){
		amapMode = 1;
	}else if(mode == "walk"){
		amapMode = 2;
	}else if(mode == "bike"){
		amapMode = 3;
	}
	var amapuri = "amapuri://route/plan/?sourceApplication=uniapp&dlat="+destination.latitude+"&dlon="+destination.longitude+"&dname="+destinationName+"&t="+amapMode;
	if(origin){
		amapuri = "amapuri://route/plan/?sourceApplication=uniapp&slat="+origin.latitude+"&slon="+origin.longitude+"&sname="+originName+"&dlat="+destination.latitude+"&dlon="+destination.longitude+"&dname="+destinationName+"&t="+amapMode;
	}
	var amapuriDown = "http://wap.amap.com/";
	var qqmap = "qqmap://map/routeplan?type="+mode+"&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude;
	if(origin){
		qqmap = "qqmap://map/routeplan?type="+mode+"&from="+originName+"&fromcoord="+origin.latitude+","+origin.longitude+"&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude;
	}
	var qqmapDefault = "https://apis.map.qq.com/uri/v1/routeplan?type="+mode+"&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude+"&policy=1";
	if(origin){
		qqmapDefault = "https://apis.map.qq.com/uri/v1/routeplan?type="+mode+"&from="+originName+"&fromcoord="+origin.latitude+","+origin.longitude+"&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude+"&policy=1";
	}
	// #ifdef APP-PLUS
	plus.nativeUI.actionSheet(
		{
			title:"选择导航",
			cancel:"取消",
			buttons:AppitemList
		},
		function(res){
			if(isBaidu && isGaode){
				if(res.index == 1){
					appOpenUrl(bdapp);
				}else if(res.index ==2){
					appOpenUrl(amapuri);
				}else if(res.index == 3){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}else if(!isBaidu && isGaode){
				if(res.index == 1){
					appOpenUrl(amapuri);
				}else if(res.index == 2){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}else if(isBaidu && !isGaode){
				if(res.index == 1){
					appOpenUrl(bdapp);
				}else if(res.index == 2){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}else{
				if(res.index == 1){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
					
				}
				
			}
		}
	);
	// #endif
	// #ifndef APP-PLUS
	uni.showActionSheet({
		itemList:itemList,
		success: (res) => {
			if(res.tapIndex == 0){
				openURL(bdapp,bdappDown)
			}else if(res.tapIndex == 1){
				openURL(amapuri,amapuriDown)
			}else{
				openURL(qqmap,qqmapDefault)
			}
			
		}
	})
	// #endif
	
}
function openMapByIos(origin, destination,mode) {
	let originName = origin&&origin.name?origin.name:"起点";
	let destinationName = destination.name?destination.name:"终点";
	var bdMode = "driving";
	if(mode == "bus"){
		bdMode = "transit";
	}else if(mode == "walk"){
		bdMode = "walking";
	}else if(mode == "bike"){
		bdMode = "riding";
	}
	var bdapp = "baidumap://map/direction?origin=我的位置&destination=name:"+destinationName+"|latlng:"+destination.latitude+","+destination.longitude+"&coord_type=gcj02&mode="+bdMode+"&src=uniapp";
	if(origin){
		bdapp = "baidumap://map/direction?origin=name:"+originName+"|latlng:"+origin.latitude+","+origin.longitude+"&destination=name:"+destinationName+"|latlng:"+destination.latitude+","+destination.longitude+"&coord_type=gcj02&mode="+bdMode+"&src=uniapp";
	}
	var bdappDown = "http://map.baidu.com/zt/qudao/newfengchao/1012337a/html/slide.html";
	var amapMode = 0;
	if(mode == "bus"){
		amapMode = 1;
	}else if(mode == "walk"){
		amapMode = 2;
	}else if(mode == "bike"){
		amapMode = 3;
	}
	var amapuri = "iosamap://route/plan/?sourceApplication=uniapp&dlat="+destination.latitude+"&dlon="+destination.longitude+"&dname="+destinationName+"&t="+amapMode;
	if(origin){
		amapuri = "iosamap://route/plan/?sourceApplication=uniapp&slat="+origin.latitude+"&slon="+origin.longitude+"&sname="+originName+"&dlat="+destination.latitude+"&dlon="+destination.longitude+"&dname="+destinationName+"&t="+amapMode;
	}
	var amapuriDown = "http://wap.amap.com/";
	var qqmap = "qqmap://map/routeplan?type="+mode+"&from=我的位置&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude;
	if(origin){
		qqmap = "qqmap://map/routeplan?type="+mode+"&from="+originName+"&fromcoord="+origin.latitude+","+origin.longitude+"&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude;
	}
	var qqmapDefault = "https://apis.map.qq.com/uri/v1/routeplan?type="+mode+"&from=我的位置&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude+"&policy=1";
	if(origin){
		qqmapDefault = "https://apis.map.qq.com/uri/v1/routeplan?type="+mode+"&from="+originName+"&fromcoord="+origin.latitude+","+origin.longitude+"&to="+destinationName+"&tocoord="+destination.latitude+","+destination.longitude+"&policy=1";
	}
	// #ifdef APP-PLUS
	plus.nativeUI.actionSheet(
		{
			title:"选择导航",
			cancel:"取消",
			buttons:AppitemList
		},
		function(res){
			if(isBaidu && isGaode){
				if(res.index == 1){
					appOpenUrl(bdapp);
				}else if(res.index == 2){
					appOpenUrl(amapuri);
				}else if(res.index == 3){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}else if(!isBaidu && isGaode){
				if(res.index == 1){
					appOpenUrl(amapuri);
				}else if(res.index == 2){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}else if(isBaidu && !isGaode){
				if(res.index == 1){
					appOpenUrl(bdapp);
				}else if(res.index == 2){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}else{
				if(res.index == 1){
					if(isQQ){
						appOpenUrl(qqmap);
					}else{
						appOpenUrl(qqmapDefault);
					}
				}
			}
		}
	);
	// #endif
	// #ifndef APP-PLUS
	uni.showActionSheet({
		itemList:itemList,
		success: (res) => {
			if(res.tapIndex == 0){
				openURL(bdapp,bdappDown)
			}else if(res.tapIndex == 1){
				openURL(amapuri,amapuriDown)
			}else{
				openURL(qqmap,qqmapDefault)
			}
		}
	})
	// #endif
	
}
function appOpenUrl(_url){
	plus.runtime.openURL(encodeURI(_url));
}
function openURL(url,downLoadUrl) {
	window.location.href= encodeURI(url);
	var startTime = Date.now();
	var count = 0;
	var endTime = 0;
	var t = setInterval(function () {
		count += 1;
		endTime = Date.now() - startTime;
		if (endTime > 800) {
			clearInterval(t);
		}
		if (count < 40){
			return false;
		}
		if(!(document.hidden || document.webkitHidden)) {
			window.location.href = encodeURI(downLoadUrl);
		}
	}, 20);
	
}
let PI  = 3.14159265358979324;
let x_pi = 3.14159265358979324 * 3000.0 / 180.0
function delta(lat, lon) {
	var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
	var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
	var dLat = transformLat(lon - 105.0, lat - 35.0);
	var dLon = transformLon(lon - 105.0, lat - 35.0);
	var radLat = lat / 180.0 * PI;
	var magic = Math.sin(radLat);
	magic = 1 - ee * magic * magic;
	var sqrtMagic = Math.sqrt(magic);
	dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
	dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
	return {'lat': dLat, 'lon': dLon};
}
function gcj_encrypt(wgsLat, wgsLon) {
	if(outOfChina(wgsLat, wgsLon))
	return {'lat': wgsLat, 'lon': wgsLon};
	var d = delta(wgsLat, wgsLon);
	return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
}
function bd_decrypt(bdLat, bdLon) {
	var x = bdLon - 0.0065, y = bdLat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var gcjLon = z * Math.cos(theta);
	var gcjLat = z * Math.sin(theta);
	return {'lat' : gcjLat, 'lon' : gcjLon};
}
function outOfChina(lat, lon) {
	if (lon < 72.004 || lon > 137.8347)
		return true;
	if (lat < 0.8293 || lat > 55.8271)
		return true;
	return false;
}
function transformLat(x, y) {
	var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
	return ret;
}
function transformLon(x, y) {
	var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
	ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
	return ret;
}
export default {
	/* 打开地图 */
	openMap(options,type="gcj02") {
		let _origin = options.origin,_destination = options.destination,_mode = options.mode?options.mode:"drive";
		
		if(type.toLowerCase() == "wgs84"){
			if(options.origin){
				_origin.latitude = gcj_encrypt(options.origin.latitude, options.origin.longitude).lat
				_origin.longitude = gcj_encrypt(options.origin.latitude,options.origin.longitude).lon
			}
			_destination.latitude = gcj_encrypt(options.destination.latitude, options.destination.longitude).lat
			_destination.longitude = gcj_encrypt(options.destination.latitude,options.destination.longitude).lon
		}else if(type.toLowerCase() == "bd09"){
			if(options.origin){
				_origin.latitude = bd_decrypt(options.origin.latitude, options.origin.longitude).lat
				_origin.longitude = bd_decrypt(options.origin.latitude,options.origin.longitude).lon
			}
			_destination.latitude = bd_decrypt(options.destination.latitude, options.destination.longitude).lat
			_destination.longitude = bd_decrypt(options.destination.latitude, options.destination.longitude).lon
		}
		// #ifdef MP
			// #ifdef MP-WEIXIN
			wx.openLocation({
				latitude: _destination.latitude,
				longitude: _destination.longitude,
				name: _destination.name
			})
			// #endif
			// #ifdef MP-QQ
			qq.openLocation({
				latitude: _destination.latitude,
				longitude: _destination.longitude,
				name: _destination.name
			})
			// #endif
			// #ifdef MP-ALIPAY
			my.openLocation({
				latitude: _destination.latitude,
				longitude: _destination.longitude,
				name: _destination.name
			})
			// #endif
			// #ifdef MP-360 || MP-BAIDU || MP-TOUTIAO
			uni.openLocation({
				latitude: _destination.latitude,
				longitude: _destination.longitude,
				name: _destination.name
			})
			// #endif
			
		// #endif
		// #ifndef MP
			switch(uni.getSystemInfoSync().platform){
				case 'android':
					console.log('运行Android上')
					openMapByAndroid(_origin, _destination,_mode)
					break;
				case 'ios':
					console.log('运行iOS上')
					openMapByIos(_origin, _destination,_mode)
					break;
				default:
					console.log('运行在开发者工具上')	
					break;
			}
			
		// #endif
		
	}
}