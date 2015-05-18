var flyfish = flyfish || {};

/******************************************flyfish.validader.js start*****************************************************/
/**
 * 1.可以这样在页面上初始化validater对象：
 * 
 * $(functions(){
 * 		flyfish.validater.init({
				rootElement:"iform",//校验跟元素id
				ruler:{//规则配置{id:"...",id1:"..."}
					compName:{notnull:true},
					adminNo:{notnull:true,number:{maxlength:7,minlength:5}},
					linkPhone:{notnull:true},
					eMail:{notnull:true},
					password:{notnull:true}
				},
				msg:{//提示配置
					compName:{notnull:"企业名非空"},
					adminNo:{notnull:"管理员帐号非空",number:"管理员帐号必须是5到7位数字"},
					linkPhone:{notnull:"联系电话非空"},
					eMail:{notnull:"邮箱非空"},
					password:{notnull:"密码非空"}
				},
				localVerify:function(obj,ruler,msg){}//提供验证扩展，可以在自己页面自定义校验规则
		});
	});
	2.可以这样开始校验
	if(!flyfish.validater.doValidate()){
	//do something
	}
 */
flyfish.validater={
	globalId:Math.random()+"flyfish.validater",
	//rootElement:,//校验根元素id（所有需要校验的元素都需要包含在根元素之中，默认如果没定义的话是body之中）
	triggerType:"default",//触发方式，默认default，即通过用户调用doValidate()触发 ，还可以是 blur,失去焦点就触发
	validateResult:{},//校验结果集
	ruler:{//规则配置
		//compName:{notnull:true},
		//adminNo:{notnull:true,number:{maxlength:7,minlength:5}}
	},
	msg:{//提示配置
		//compName:{notnull:"企业名非空"},
		//adminNo:{notnull:"管理员帐号非空",number:"管理员帐号必须是5到7位数字"}
	},
	verify:function(obj,ruler,msg){//验证
		//默认规则校验
		for (i in ruler){	//for ruler,以后这里需要修改，会有一个规则校验实现集合，list<String ,method> ,和一个addVerifyRuler("rulerName",method());
			//添加非空规则的实现			
			if(i=="notnull"){
				var errormsg=msg[i];
				
				if(ruler[i]==true){
					for(j=0;j<obj.length;j++){
						var eleobj=$(obj[j]);
						if(eleobj.val()==""){
							this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
						}
					}												
				}
			}
			//添加规则 ，number 校验
			if(i=="number"){
				var errormsg=msg[i];
				
				if(ruler[i]!=undefined){
					var regu ="^[0-9]*$";
					var re = new RegExp(regu);
					for(j=0;j<obj.length;j++){
						var result=true;
						var eleobj=$(obj[j]);
						var flag=re.test(obj[j].val());
						result=flag;
						if(flag==true){
							if(ruler[i].maxlength!=undefined){
								if(eleobj.val().length>ruler[i].maxlength){
									result=false;
								}
							}
							if(ruler[i].minlength!=undefined){
								if(eleobj.val().length<ruler[i].minlength){
									result=false;
								}
							}
						}							
						if(!result){
							this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
						}							
					}												
				}
			}
			//校验String ，长度校验，不限字符
			if(i=="string"){
				var errormsg=msg[i];
				
				if(ruler[i]!=undefined){
					for(j=0;j<obj.length;j++){//遍历所有该id的元素，id重复时obj会多于1条
						var result=true;
						var eleobj=$(obj[j]),
							textNum=parseInt(eleobj.val().length) + parseInt(getTextChina(eleobj.val()));						
						if(ruler[i].maxlength!=undefined){														
							if(textNum>ruler[i].maxlength){								
								result=false;
							}
						}
						if(ruler[i].minlength!=undefined){
							if(textNum<ruler[i].minlength){
								result=false;
							}
						}						
						if(!result){
							this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
						}							
					}												
				}
			}
			//httpurl 校验
			if(i=="httpurl"){
				var errormsg=msg[i];
				
				if(ruler[i]==true){
					var regu ="^(http|https|ftp|)?(://)?(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*((:\\d+)?)(/(\\w+(-\\w+)*))*(\\.?(\\w)*)(\\?)?(((\\w*%)*(\\w*\\?)*(\\w*:)*(\\w*\\+)*(\\w*\\.)*(\\w*&)*(\\w*-)*(\\w*=)*(\\w*%)*(\\w*\\?)*(\\w*:)*(\\w*\\+)*(\\w*\\.)*(\\w*&)*(\\w*-)*(\\w*=)*)*(\\w*)*)$";
					var re = new RegExp(regu);
					for(j=0;j<obj.length;j++){
						var result=true;
						var eleobj=$(obj[j]);
						if(eleobj.val()!=undefined&&eleobj.val()!=""){
							var flag=re.test(eleobj.val());
							result=flag;											
							if(!result){
								this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
							}
						}
					}												
				}
			}
			//money 金额校验
			if(i=="money"){
				var errormsg=msg[i];
				
				if(ruler[i]==true){
					var regu =/^(0|\+?[1-9][0-9]*)\.\d{2}$/;
					var re = new RegExp(regu);
					for(j=0;j<obj.length;j++){
						var result=true;
						var eleobj=$(obj[j]);
						if(eleobj.val()!=undefined&&eleobj.val()!=""){
							var flag=re.test(eleobj.val());
							result=flag;											
							if(!result){
								this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
							}
						}
					}												
				}
			}
			//mobile
			if(i=="mobile"){
				var errormsg=msg[i];
				
				if(ruler[i]==true){
					var regu =v_Regular.mobile;//电话正则
					var re = new RegExp(regu);
					for(j=0;j<obj.length;j++){
						var result=true;
						var eleobj=$(obj[j]);
						
						var flag=re.test(eleobj.val());
						result=flag;											
						if(!result){
							this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
						}
						
					}												
				}
			}
			//email
			if(i=="email"){
				var errormsg=msg[i];
				
				if(ruler[i]==true){
					var regu =/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
					var re = new RegExp(regu);
					for(j=0;j<obj.length;j++){
						var result=true;
						var eleobj=$(obj[j]);
						
						var flag=re.test(eleobj.val());
						result=flag;											
						if(!result){
							this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
						}
					}												
				}
			}
			//regexp , 通过指定正则表达式校验
			if(i=="regexp"){
				var errormsg=msg[i];
				
				if(ruler[i]!=undefined){
					var regu = ruler[i].pattern;
					var expectresult = ruler[i].expectresult==undefined?true:ruler[i].expectresult;//默认期待结果为真
					var re = new RegExp(regu);
					for(j=0;j<obj.length;j++){
						var result=true;
						var eleobj=$(obj[j]);
						if(eleobj.val()!=undefined&&eleobj.val()!=""){
							var flag=re.test(eleobj.val());
							result=flag;											
							if(!result==expectresult){//和期望结果不一致
								this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
							}
						}
					}												
				}
			}
			//equal,等于校验
			if(i=="equal"){
				var errormsg=msg[i];
				
				if(ruler[i]!=undefined){
					var eleId = ruler[i].eleId;
					var ignoreCase = ruler[i].ignoreCase==undefined?false:ruler[i].ignoreCase;//默认不忽略大小写
					for(j=0;j<obj.length;j++){
						var eleobj=$(obj[j]);
						if(ignoreCase){
							if(eleobj.val().toLowerCase()!=$("#"+eleId).val().toLowerCase()){
								this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
							}
						}else{
							if(eleobj.val()!=$("#"+eleId).val()){
								this.pushResult(eleobj,errormsg);//向校验集追加一条校验不通过结果
							}
						}						
					}												
				}
			}
			//-------------------------------这里 添加规则 ---------------------
			
		};//for ruler
		//验证用户自定义规则
		if(this.localVerify!=undefined){
			this.localVerify(obj,ruler,msg);
		}			
	},
	pushResult:function(obj,errormsg,ispass){ //向校验集追加一条校验不通过结果
		if(ispass!=true){//ispass==false 或者true，默认为false
			ispass=false;
		}
		if(errormsg==undefined||errormsg==""){
			throw "bad 'msg' defined for element:id[#"+$(obj).attr("id")+"] , please check the 'msg' property you have defined !";
		}
		var addSuccess=false;
		for(var i=0;i<10;i++){//事实上这里发生碰撞的可能性非常小
			var globalId=Math.random()+$(obj).attr("id");//生成校验结果id
			if(this.validateResult[globalId]==undefined){
				this.validateResult[globalId]={"obj":obj,"errormsg":errormsg,"ispass":ispass};
				addSuccess=true;
				break;
			}
		}
		if(addSuccess==false){
			throw "there is one validate errormsg has bean lost:element.id"+$(obj).attr("id")+",errormsg:"+errormsg;
		}						
	},
	getValidateResult:function(){	//取得校验结果，对校验结果的处理都在这个方法里	,如果需要不同的处理方式，建议重写该方法	处理this.validateResult
		window.validateFlag=true;
		if(this.validateResult!=undefined){
			for (i in this.validateResult){
				if(!this.validateResult[i].ispass){//这里只处理不通过的
					var obj=$(this.validateResult[i].obj);
					obj.focus();
					//obj.attr("class",'text ipt-wrong');
					//alert(this.validateResult[i].errormsg);
					flyfish.tooltip(this.validateResult[i].errormsg,"error");
					window.validateFlag=false;
					break;
				}
			}
		}
		return window.validateFlag;
	},
	doValidate:function(){//校验的入口方法,而且最终不管前面做了什么，现在都将进行一次统一校验
		this.validateResult={};//将上次校验结果集置空
		for (i in this.ruler){
			if(this.msg[i]==undefined){
				throw "no property of '"+i+"' defined in msg";
			}
			this.verify($(this.root).find("#"+i),this.ruler[i],this.msg[i]);
			//console.log(this.ruler[i]);
		};
				
		return this.getValidateResult();
	},
	doOpt:function(){//生效一些设定
		//参数改变时清空校验结果
		this.validateResult={};
		if(this.rootElement==undefined){
			this.root="body";
		}else if(typeof this.rootElement!="string"){
			throw "illegal value of 'rootElement' property";
		}else{
			this.root="#"+this.rootElement;
		}
		if(this.triggerType=="blur"){//失去焦点时候触发
			for (i in this.ruler){
				if(this.msg[i]==undefined){
					throw "no property of '"+i+"' defined in msg";
				}
				var validater=this;
				var data={};
				data.ele_ruler=validater.ruler[i];
				data.ele_msg=validater.msg[i];
				$(this.root).find("#"+i).blur(data,function(event){
					validater.validateResult={};
					validater.pushResult($(this),"clear flag",true);//添加一条通过的结果集，以处理
					var objs=[this];//一条记录的数组					
					validater.verify(objs,event.data.ele_ruler,event.data.ele_msg);
					validater.getValidateResult();
				});				
			};
		}		
	},
	init:function(settings){
		if(settings!=undefined){
			/*this.rootElement=settings.rootElement;//初始化校验根节点
			this.ruler=settings.ruler;//初始化规则配置
			this.msg=settings.msg;//初始化提示消息
			this.localVerify=settings.localVerify;//初始化本地规则校验方法*/
			$.extend(this,settings);
			//生效一些设定
			this.doOpt();
			return this;
		}else{
			throw "undefined settings , has used the default settings";
		}
	}
	//localVerify:function(obj,ruler,msg){}//提供验证扩展，可以在自己页面自定义校验规则			
};
/******************************************flyfish.validader.js end*****************************************************/