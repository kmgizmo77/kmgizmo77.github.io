/*
Device Define
*/
var _isAndroid = (/android/gi).test(navigator.appVersion),
	_isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	_isPlaybook = (/playbook/gi).test(navigator.appVersion),
	_isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	_isIE       = (/MSIE/gi).test(navigator.appVersion),
	_isChrome   = (/Chrome/gi).test(navigator.appVersion),
	_isMobileWeb = (_isAndroid || _isIDevice || _isPlaybook || _isTouchPad);

/*
extend object
*/
function Class() { }
Class.prototype.construct = function() {};
Class.extend = function(name,def)
{
	var classDef = function() {
		if (arguments[0] !== Class) {
			this.construct.apply(this, arguments);
		}
	};
	
	var proto = new this(Class);
	var superClass = this.prototype;
	
	for (var n in def) {
		var item = def[n];
		if (item instanceof Function) item.$ = superClass;
		proto[n] = item;
	}
	
	classDef.prototype = proto;
	classDef.extend = this.extend;
	classDef.prototype.classname = name;
	
	return classDef;
};

/*
start module
*/
document.addEventListener("DOMContentLoaded",function(){
	setInterval(function(){
			console.info(app.query_agr.length,app.query_agr);
			if(app.query_agr.length>0){
				app.injectNative();
			}
		},
		app.pollingSpeed);
	}
);

/*
App Base Class
*/
var App = Class.extend("",{

	query_agr : [],
	pollingSpeed : 1000,
	
	execute: function()
	{
		var objParam = this.classname + "?" + this.methodname;
		var valParam = "";
		
		for(var key in this.params){
			valParam = valParam + this.params[key] + "?";
		}
		
		this.runCommand(objParam,valParam);
	},
	
	injectNative : function(){
		var data = this.query_agr[0];
		this.query_agr.splice(this.query_agr.indexOf(data),1);
		
		var tmpObjArr = data.split("?");
		
		if(_isIDevice) {
			
			
			data=data.split("/").join("_^_");
			location.href = "url://" + data.split("?").join("/");
		}
		
		if(_isAndroid){
			
			data = tmpObjArr[0] + "?" + tmpObjArr[1];

			if(tmpObjArr.length > 2){
				var val = "";
				for(var i = 2; i < tmpObjArr.length ;i++){
					val = val + tmpObjArr[i] + "?";
				}
				val = val.substr(0,val.length-1);
				
				eval(data.split("?").join("Android.") + '(' + "'" + val.split("?").join("','") + "'" + ');');
			}else{
				
				eval(data.split("?").join("Android.") + '();');
			}
		}
		
		if(_isChrome){
			console.info("iOS :" + "url://" + data.split("?").join("/"));
			
			data = tmpObjArr[0] + "?" + tmpObjArr[1];

			if(tmpObjArr.length > 2){
				var val = "";
				for(var i = 2; i < tmpObjArr.length ;i++){
					val = val + tmpObjArr[i] + "?";
				}
				val = val.substr(0,val.length-1);
				
				//eval(data.split("?").join("Android.") + '(' + "'" + val.split("?").join("','") + "'" + ');');
				console.info("Android :" + data.split("?") + '(' + "'" + val.split("?").join("','") + "'" + ');');
				
			}else{
				
				//eval(data.split("?").join("Android.") + '();');
				console.info("Android :" + data.split("?")  + '();');			
				
			}
			
			
		}
	},
	
	
	runCommand: function(obj,val){
		
		var data = "";
		if(val.length > 0){
			val = val.substr(0,val.length-1);
			data = obj + "?" + val;
		}else{
			data = obj;
		}
		
		this.query_agr.push(data);
	}
});

/*
Application Class
*/
var Application = App.extend("Application",{

	launch : function(appId){
		this.methodname = "launch";
		this.params = {appId:appId};
		this.execute();
	},
	
	navigate : function(appId){
		this.methodname = "navigate";
		this.params = {appId : appId};
		this.execute();
	},
	
	getInstalledApps : function(CallBack){
		this.methodname = "getInstalledApps";
		this.params = {CallBack : CallBack};
		this.execute();
	},
	
	InstalledApps : [],
	
	getappinfo : function(appId,CallBack){
		this.methodname = "getappinfo";
		this.params = {appId : appId,CallBack:CallBack};
		this.execute();
	}
	
	
});

/*
Log Class
*/
var Log = App.extend("Log",{

	log : function(data){
		this.methodname = "log";
		this.params = {data:JSON.stringify(data)};
		this.execute();
	}
	
});

/*
Keybaord
*/
var Keybaord = App.extend("KeyBoard",{

	show : function(key,value){
		this.methodname = "show";
		this.execute();
	},
	
	hide : function(key,callback){
		this.methodname = "hide";
		this.execute();
	}
	
});


/*
Class Define 
*/
var app = new App();
app.application = new Application();
app.log = new Log();
app.keybaord = new Keybaord();