$(function(){
	/**
	 * ajax请求session过期全局处理函数
	 */
	$.ajaxSetup({     
	    contentType:"application/x-www-form-urlencoded;charset=utf-8",     
	    complete:function(XMLHttpRequest,textStatus){  
	        // 通过XMLHttpRequest取得响应头，sessionstatus，  
	        var sessionStatus = XMLHttpRequest.getResponseHeader("sessionStatus");  
	        if(sessionStatus == "timeout"){//session过期标志 
		        //跳转到登录页面  
	        	if(window != top) {
	        		top.location.href = flyfish.bathPath + "/login.vm";
	        	}
	        }  
	    }  
	}); 
});

var flyfish = flyfish || {};
flyfish.grid = flyfish.grid || {};

/**
 * 通用ajax请求
 * auth:chenliang
 * time:2015-2-11
 * @param  url 请求地址
 * @param params 请求参数
 * @param successCallback 成功回调函数
 * @param errorCallback 失败回调函数
 * @param successTip 是否提示成功信息 true-提示 false-不提示
 * @param chainPar 链参数 会传递到回调方法里
 */
flyfish.ajaxDo = function(url,params,successCallback,errorCallback,successTip,chainPar,async,bizErrTip,bizErrCallback){
	var ts = this;
	//成功的回调
	var _succ = function(data, status, xhr){
		if(!data) {
			var msg = "未知错误";
			flyfish.tooltip(msg,"error");
			return;
		}else if(data.success) { //交易成功
			if(successTip) {
				var msg = "交易成功";
				if(data.errMsg!="") {
					msg = data.errMsg;
				}
				flyfish.tooltip(msg,"succeed");
			}
			if(successCallback && $.isFunction(successCallback)) {//是否存在回调函数
				return successCallback.call(ts, data, status, xhr,chainPar);
			}
		}else if(!data.success) { //交易失败
			if(bizErrTip) {
				var msg = "交易失败";
				if(data.errMsg!="") {
					msg = data.errMsg;
				}
				flyfish.tooltip(msg,"error");
			}
			if(bizErrCallback && $.isFunction(bizErrCallback)) {//是否存在回调函数
				return bizErrCallback.call(ts, data, status, xhr,chainPar);
			}
		}else { //交易失败
			flyfish.tooltip(data.errMsg,"error");
		}
	};

	//失败的回调
	var _err = function(xhr, status, error){
		var msg = "请求失败";
		flyfish.tooltip(msg,"error");
		if(errorCallback && $.isFunction(errorCallback)) {
			errorCallback.call(ts, xhr, status, error,chainPar)
		}
	};
	if(async == null){
		async = true;
	}
	//ajax请求
	$.ajax({
		url: url,
		type: 'POST',
		data: params,
		dataType: 'json',
		timeout: flyfish.ajaxTimeout,
		error: _err,
		success: _succ,
		async:async
	});
};


/**
 * ajax form通用提交(封装jquery from插件)
 * auth:chenliang
 * time:2015-2-11
 * 
 * 参数:1.formId:form的id
 * 		2.beforeSubmitFn(formData, jqForm, options):提交前用于验证数据和组装自定义数据的自定义回调函数
 * 				formData: 数组对象，提交表单时，Form插件会以Ajax方式自动提交这些数据，格式如：[{name:user,value:val },{name:pwd,value:pwd}]  
 *			    jqForm:   jQuery对象，封装了表单的元素     
 *			    options:  options对象  
 * 		3.successCallback(data,status,xhr)：ajax访问成功后回调函数
 *      4.errorCallback(xhr,status,error)：ajax访问失败后回调函数
 *      5.successTip：是否提示成功信息 true-提示 false-不提示
 * 
*/
flyfish.ajaxFormDo = function(formId, beforeSubmitFn, successCallback, errorCallback, successTip, bizErrTip,bizErrCallback){
	var ts = this;
	var _succ = function(data, status, xhr) {
		if(!data) {
			var msg = "未知错误";
			flyfish.tooltip(msg,"error");
			return;
		}else if(data.success) {
			if(successTip){
				var msg = "交易成功";
				if(data.errMsg!="") {
					msg = data.errMsg;
				}
				flyfish.tooltip(msg,"succeed");
			}
			if(successCallback && $.isFunction(successCallback)) {
				return successCallback.call(ts, data, status, xhr);
			}
		}else if(!data.success) { //交易失败
			if(bizErrTip) {
				var msg = "交易失败";
				if(data.errMsg!="") {
					msg = data.errMsg;
				}
				flyfish.tooltip(msg,"error");
			}
			if(bizErrCallback && $.isFunction(bizErrCallback)) {//是否存在回调函数
				return bizErrCallback.call(ts, data, status, xhr);
			}
		}else {// 交易失败
			flyfish.tooltip(data.errMsg,"error");
		}
	};
	
	var _err = function(xhr, status, error){
		var msg = "请求失败";
		flyfish.tooltip(msg,"error");
		if(errorCallback && $.isFunction(errorCallback)) {
			errorCallback.call(ts, xhr, status, error);
		}
	}
	//配置
	var options = {
	   beforeSubmit: beforeSubmitFn, //提交前的回调函数  
	   success: _succ,               //提交成功的回调函数  
	   error:_err,                   //提交失败的回调函数
	   type: "POST",                 //默认是form的method（get or post），如果申明，则会覆盖  
	   dataType: "json",             //html(默认), xml, script, json...接受服务端返回的类型  
	   timeout: flyfish.ajaxTimeout  //限制请求的时间，当请求大于3秒后，跳出请求  
	};
	
	$('#'+formId).ajaxSubmit(options);
	return false;  //阻止表单默认提交
}

/**
 * 功能说明: 交易提示信息
 * @author ljf <liangjf@hundsun.com>
 * @date 2015-2-26 下午4:14:49
 * @version V1.0
 * @param msg 信息文本
 */
flyfish.tooltip = function(msg,variety,time) {
	$("#m_tip_con",top.document).remove();
	var time = time || 3000;
	var kind = null;
	if(variety == "succeed"){
		kind = 'm-tip-succeed';	
	}else if(variety == "error"){
		kind = 'm-tip-error';	
	}
	var str = ''
		str += '<div id="m_tip_con" class="m-tip-con '+ kind +'">'+ msg +'</div>';
	$('body',top.document).append(str);
	window.top.setTimeout('$("#m_tip_con",top.document).remove()',time);
}