(function ($) {
var artDialog = function (config) {
	config = config || {};
	var defaults = artDialog.defaults		
	// 合并默认配置
	for (var i in defaults) {
		if (config[i] === undefined) config[i] = defaults[i];		
	};
	
	return new artDialog.fn._init(config);
};

artDialog.fn = artDialog.prototype = {	
	_init: function (config) {
		var that = this, DOM
		that.config = config;
		that.DOM = DOM = that.DOM || that._getDOM();
		//alert(that.DOM)
		DOM.close.click(function(){
			DOM.wrap.remove();
			that.unlock();
		})
		that.title(config.title).content(config.content).position().lock().ok(config.ok).cancel(config.cancel);
		return that;
	},
	content: function (msg) {
		var DOM = this.DOM,
			content = DOM.content;
		content.html(msg);
		return this;
	},
	title: function (text) {
		var DOM = this.DOM,
			title = DOM.title;
		title.html(text || '');
		return this;
	},
	
	/** 关闭对话框 */
	cancel: function (cancel) {
		var that = this,
			DOM = that.DOM,
			buttons = DOM.buttons;
		
		buttons.find('button').eq(1).bind('click',function(){
			if(cancel !== true){
				cancel();
			}	
			DOM.wrap.remove();
			that.unlock();	
		})
		
		return that;
	},
	ok:function(ok){
		var that = this,
			DOM = that.DOM,
			buttons = DOM.buttons;
		
		buttons.find('button').eq(0).bind('click',function(){
			if(ok !== true){
				ok();
			}	
			DOM.wrap.remove();
			that.unlock();	
		})
		
		return that;
	},
	position: function () {
		var that = this,
			config = that.config,
			wrap = that.DOM.wrap,
			ow = wrap.width(),
			oh = wrap.height();
		that.DOM.wrap.css({'left':'50%','top':'50%'});;
		that.DOM.wrap.css({'marginLeft': (-ow/2),'marginTop': (-oh/2)});
		return that;
	},
	
	/** 设置屏锁 */
	lock: function () {
		var that = this,
			DOM = this.DOM,
			lockMaskWrap = $('<div></div>'),
			lockMask = $('<div></div>');
		$('body', top.document).append(lockMaskWrap);
		$(lockMaskWrap).append(lockMask);
		$(lockMaskWrap).css({'width':'100%','height':'100%','position':'fixed','z-index':'2005','top':'0px','left':'0px','overflow':'hidden'});
		$(lockMask).css({'height':'100%','opacity':0.2,'background':'rgb(0, 0, 0)'});
		
		lockMask.bind('dblclick', function () {
			DOM.wrap.remove();
			that.unlock();
		});
		that._lockMaskWrap = lockMaskWrap;
		that._lockMask = lockMask;
		return that;
	},
	/** 解开屏锁 */
	unlock: function () {
		var that = this,
			lockMaskWrap = that._lockMaskWrap,
			lockMask = that._lockMask;
		lockMaskWrap.remove();
	},
	
	// 获取元素
	_getDOM: function () {	
		var wrap = $('<div></div>');
		wrap.css({'position':'absolute','left':0,'top':0,'z-index':2015});
		wrap.append(artDialog._templates);
		$('body', top.document).append(wrap);
		
		var name, i = 0,
			DOM = {wrap: $(wrap)},
			els = wrap[0].getElementsByTagName('*'),
			elsLen = els.length;
			
		for (; i < elsLen; i ++) {
			name = els[i].className.split('m-dialog-')[1];
			if (name) DOM[name] = $(els[i]);
		};
		
		return DOM;
	},	
};

artDialog.fn._init.prototype = artDialog.fn;
$.fn.dialog = $.fn.artDialog = function () {
	var config = arguments;
	this[this.live ? 'live' : 'bind']('click', function () {
		artDialog.apply(this, config);
		return false;
	});
	return this;
};

artDialog._templates =
'<div class="m-dialog">'
+	'<div class="m-dialog-header">'
+    	'<div class="m-dialog-title"></div>'
+        '<a class="m-dialog-close" href="javascript:">×</a>'
+    '</div>'
+    '<div class="m-dialog-main" style="width:300px; height:100px;">'
+        '<div class="m-dialog-content"></div>'
+    '</div>'
+    '<div class="m-dialog-buttons">'
+    	'<button class="dialog_highlight" type="button">确定</button>'
+       '<button type="button">关闭</button>'
+	 '</div>'
+'</div>';	


/**
 * 默认配置
 */
artDialog.defaults = {								
	content: '消息提示内容',				// 消息内容
	title: '提示框',		// 标题. 默认'消息'
	ok: true,
	cancel: true
};
window.artDialog = $.dialog = $.artDialog = artDialog;
})(jQuery);



