import $mStore from '@/store/index.js';
import $mThemeConfig from './themeConfig.js'

//系统皮肤定义
let styleType = $mStore.state.shopSetting.style_type?$mStore.state.shopSetting.style_type:'red';
//客户皮肤定义
if($mStore.state.shopSetting.style_user_is_open && parseInt($mStore.state.shopSetting.style_user_is_open)===1){
	let customType = $mStore.state.customerTheme;
	if(customType){
		styleType = customType;
	}
}

let keys = Object.keys($mThemeConfig);
let theme = {};
if(keys.indexOf(styleType)!==-1){
	theme = $mThemeConfig[styleType].colors;
}else{
	theme = $mThemeConfig.red.colors;
}

//页面主题皮肤定义
export default {
	
	//------------------------皮肤主题------------------------
	...theme,
	
	//-----以下为公用，和皮肤主体无关。需要和theme.scss一致------
	
	//背景颜色
	dzBgColor:'#f3f3f3',
	
	//边框色
	dzBorderColor: '#e4e7ed',

	//基础文字颜色
	dzMainColor:'#303133',
	dzContentColor: '#606266',
	dzTipsColor: '#909399',
	dzLightColor: '#c0c4cc',
	
	//primary
	dzTypePrimary: '#2979ff',
	dzTypePrimaryDisabled: '#a0cfff',
	dzTypePrimaryDark: '#ecf5ff',
	dzTypePrimaryLight: '#2b85e4',
	
	//warning
	dzTypeWarning: '#ff9900',
	dzTypeWarningDisabled: '#fcbd71',
	dzTypeWarningDark: '#f29100',
	dzTypeWarningLight: '#fdf6ec',
	
	//success
	dzTypeSuccess: '#19be6b',
	dzTypeSuccessDisabled: '#71d5a1',
	dzTypeSuccessDark: '#18b566',
	dzTypeSuccessLight: '#dbf1e1',
	
	//error
	dzTypeError: '#fa3534',
	dzTypeErrorDisabled: '#fab6b6',
	dzTypeErrorDark: '#dd6161',
	dzTypeErrorLight: '#fef0f0',
	
	//info
	dzTypeInfo: '#909399',
	dzTypeInfoDisabled: '#c8c9cc',
	dzTypeInfoDark: '#82848a',
	dzTypeInfoLight: '#f4f4f5',
	
	//表单
	dzFormItemHeight: '70rpx',
	dzFormItemBorderColor: '#dcdfe6',
}