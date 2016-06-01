
var _isAndroid = (/android/gi).test(navigator.appVersion),
	_isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	_isIE       = (/MSIE/gi).test(navigator.appVersion),
	_isChrome   = (/Chrome/gi).test(navigator.appVersion),
	_isMobileWeb = (_isAndroid || _isIDevice );
 

 (function($) {

	$.fn._touchObject = null,
	$.fn._touchTimeObject = null,
	$.fn._touchTimeEventObject = null,
	$.fn._timeObj = null,

	$.fn._start = function(e){
		
		var rtpress = false;

		if(_isAndroid || _isIDevice){

			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			if(e.originalEvent.touches.length > 1){
				rtpress = true;
			}
			if(e.originalEvent.changedTouches.length > 1){
				rtpress = true;
			}
			e.currentTarget.component.prevX = touch.pageX;
			e.currentTarget.component.prevY =touch.pageY;
		}else{
			e.currentTarget.component.prevX = e.pageX;
			e.currentTarget.component.prevY = e.pageY;
		}

		if(!e.currentTarget.component.touchHandler){
			if(e.currentTarget.component.onPressStyle != null){
				e.currentTarget.className = e.currentTarget.className + " " + e.currentTarget.component.onPressStyle;
			}
			e.currentTarget.component.touchHandler = true;
			this.component.moveTimePrev = new Date();
			$.fn._touchTimeEventObject = e.currentTarget.component;
			$.fn._touchTimeObject = setTimeout(function(e){
				$.fn._touchTimeEventObject.className =$.fn._touchTimeEventObject.defaultStyle;
				$.fn._touchTimeEventObject.touchHandler = false;
			},e.currentTarget.component.moveTime);
		}
	};

	$.fn._move = function(e){

		var X,Y;
		if(_isAndroid || _isIDevice){
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			X = touch.pageX;
			Y =touch.pageY;
		}else{
			X = e.pageX;
			Y = e.pageY;
		}
		
		
		
		if(e.currentTarget.component.touchHandler){
		
			if(((new Date()) - e.currentTarget.component.moveTimePrev) > e.currentTarget.component.moveTime){
				e.currentTarget.className = e.currentTarget.component.defaultStyle;
				e.currentTarget.component.touchHandler = false;
			}else{
				e.currentTarget.component.moveTimePrev = new Date();
			}
			e.currentTarget.component.tmpY = eval(Y - e.currentTarget.component.prevY);
			e.currentTarget.component.tmpX = eval(X - e.currentTarget.component.prevX);
		}
		
		if(_isAndroid){
			if(e.currentTarget.component.touchHandler){
				
				if(e.currentTarget.component.eventHandler != null){
					if(Math.abs(e.currentTarget.component.tmpX) > e.currentTarget.component.moveDistance && Math.abs(e.currentTarget.component.tmpY) < 20 ){
						if(eval(e.currentTarget.component.tmpX) > 0 ){
							e.currentTarget.component.direction = 1;
						}else{
							e.currentTarget.component.direction = -1;
						}
						e.currentTarget.component.eventHandler(e);
						
						if(e.currentTarget.component.bounce){
							(e.currentTarget.component.target).css("-webkit-transition", "" + e.currentTarget.component.bounceTime  + "ms ease");
							if(e.currentTarget.component.direction > 0){
								e.currentTarget.component.target.css("-webkit-transform","translateX(" + parseInt(e.currentTarget.component.bounceAxis) + "px)");
							}else{
								e.currentTarget.component.target.css("-webkit-transform","translateX(-" + parseInt(e.currentTarget.component.bounceAxis) + "px)");
							}
							setTimeout(function(){
								e.currentTarget.component.target.css("-webkit-transition","0.05s ease");
								e.currentTarget.component.target.css("-webkit-transform","translateX(0px)");						
							},e.currentTarget.component.bounceTime);
						}
					}
				}
				
				$.fn._touchObject = e.currentTarget.component;
				setTimeout(function(){
					$.fn._touchObject.touchHandler = false;
				},10);
			}
		}

	};

	$.fn._end = function(e){
		
		if(e.currentTarget.component.touchHandler){
			
			if(e.currentTarget.component.eventHandler != null){
				if(Math.abs(e.currentTarget.component.tmpX) > e.currentTarget.component.moveDistance && Math.abs(e.currentTarget.component.tmpY) < 20 ){
					if(eval(e.currentTarget.component.tmpX) > 0 ){
						e.currentTarget.component.direction = 1;
					}else{
						e.currentTarget.component.direction = -1;
					}
					e.currentTarget.component.eventHandler(e);
					
					if(e.currentTarget.component.bounce){
						(e.currentTarget.component.target).css("-webkit-transition", "" + e.currentTarget.component.bounceTime  + "ms ease");
						if(e.currentTarget.component.direction > 0){
							e.currentTarget.component.target.css("-webkit-transform","translateX(" + parseInt(e.currentTarget.component.bounceAxis) + "px)");
						}else{
							e.currentTarget.component.target.css("-webkit-transform","translateX(-" + parseInt(e.currentTarget.component.bounceAxis) + "px)");
						}
						setTimeout(function(){
							e.currentTarget.component.target.css("-webkit-transition","0.05s ease");
							e.currentTarget.component.target.css("-webkit-transform","translateX(0px)");						
						},e.currentTarget.component.bounceTime);
					}
				}
			}
			
			$.fn._touchObject = e.currentTarget.component;
			setTimeout(function(){
				$.fn._touchObject.touchHandler = false;
			},10);
		}
	};

	$.fn.MelonSwipe = function(handler,option) {

		$(this).each(function(){

			this.component = this;
			
			if(_isAndroid){
				this.component.moveDistance = 15;
			}else if(_isIDevice){
				this.component.moveDistance = 50;
			}else{
				this.component.moveDistance = 100;
			}
			
			this.component.moveTime = 300;
			this.component.moveTimePrev = null;
			this.component.eventHandler = handler;
			this.component.touchHandler = false;
			this.component.eventFlag = true;
			this.component.defaultStyle = this.className;
			
			if(option.classname != undefined)
				this.component.onPressStyle = option.classname;
			
			if(option.bounce != undefined){
				
				this.component.bounce = option.bounce.flag;
				this.component.bounceAxis = option.bounce.axis;
				this.component.bounceTime = option.bounce.time;
				this.component.target = option.bounce.target;
			}
			
			this.component.direction = null;
		});

		if(_isAndroid || _isIDevice){
			
			
			
			$(this).unbind('touchstart');
			$(this).unbind('touchmove');
			$(this).unbind('touchend');
			$(this).bind('touchstart', $.fn._start);
			$(this).bind('touchmove', $.fn._move);
			$(this).bind('touchend', $.fn._end);
		}else{
			$(this).unbind('mousedown');
			$(this).unbind('mousemove');
			$(this).unbind('mouseup');
			$(this).bind('mousedown', $.fn._start);
			$(this).bind('mousemove', $.fn._move);
			$(this).bind('mouseup', $.fn._end);
			
		}

		return this;
	};
	
	$.fn.MelonSwipeUnbind = function() {

		if(_isAndroid || _isIDevice){

			$(this).unbind('touchstart');
			$(this).unbind('touchmove');
			$(this).unbind('touchend');
		
		}else{
			$(this).unbind('mousedown');
			$(this).unbind('mousemove');
			$(this).unbind('mouseup');
			
		}

		return this;
	};

	

 })(jQuery);
