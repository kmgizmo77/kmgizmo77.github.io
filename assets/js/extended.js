function wheel(event)
{
	var delta = 0;
	
	if (!event)
	{
		event = window.event;
		
		if (event.wheelDelta)
		{
			delta = event.wheelDelta / 120;
			
			if (window.opera)
			{
				delta = -delta;
			}
			else if (event.detail)
			{
				delta = -event.detail/3;
			}
		}
		
		if (delta)
		{
			if (delta < 0)
			{
				if ($.kiosk.portfolio.variables.status.busy.door == true) return;
				$.kiosk.portfolio.misc.busy.door();
				
				$.kiosk.portfolio.menu.primary.show('next');
			}
			else if (delta > 0)
			{
				if ($.kiosk.portfolio.variables.status.busy.door == true) return;
				$.kiosk.portfolio.misc.busy.door();
				
				$.kiosk.portfolio.menu.primary.show('prev');
			}
			
			if (event.preventDefault)
			{
				event.preventDefault();
			}
		}
	}
	
	event.returnValue = false;
}

$.kiosk = {
	'portfolio': {
		'init': (function() {
			$.kiosk.portfolio.callback.init();
			$.kiosk.portfolio.resize.background();
			$.kiosk.portfolio.ui.init();
		}),
		
		'ui': {
			'init': (function() {
				$.kiosk.portfolio.ui.button.hoverable();
				$.kiosk.portfolio.ui.layer.hover();
				
				$.kiosk.portfolio.ui.images.preload($('#loader'), function() {
					$.kiosk.portfolio.ui.images.preload($('#wrapper'), function() {
						$('#loader').delay(500).fadeOut(300, (function() {
							$('*').mousedown(function(){ return false; });
							
							$('#wrapper .gnb').hide().removeClass('hide').fadeIn(800);
							$('#wrapper').hide().removeClass('hide-fake').fadeIn(800, (function() {
								//$.kiosk.portfolio.menu.intro.movie.hide();
								//$.kiosk.portfolio.menu.main.news.detail.show();
								$.kiosk.portfolio.menu.primary.show('intro');
							}));
						}));
					});
				});
			}),
			
			'image': {
				'reload': (function(object) {
					var retry_count = $(object).attr('data-retry-count');
					
					if (retry_count == undefined)
					{
						retry_count = 0;
					}
					
					if (retry_count < 5)
					{
						var src = $(object).attr('src');
						
						$(object).attr('data-retry-count', ++retry_count);
						$(object).attr('src', '');
						$(object).attr('src', src);
					}
				})
			},
			
			'images': {
				'preload': (function(container, fn) {
					var images = Array();
					var callback = fn;
					
					$(container).find('img').each(function() {
						images.push($(this).attr('src'));
					});
					
					$.kiosk.portfolio.ui.images.preloader.load(images, callback);
				}),
				
				'preloader': {
					'variables': {
						'retry': 0
					},
					'queued': undefined,
					'callback': undefined,
					'load': (function(images, fn) {
						var ua = navigator.userAgent.toLowerCase();
						
						$.kiosk.portfolio.ui.images.preloader.queued = images;
						$.kiosk.portfolio.ui.images.preloader.callback = fn;
						
						if (($.browser.msie && parseInt($.browser.version, 10) < 9) || ua.indexOf("android") !== -1)
						{
							jQuery.imgpreload(images, {
								each: (function() {
								}),
								
								all: (function() {
									if ($.kiosk.portfolio.ui.images.preloader.callback)
									{
										$($.kiosk.portfolio.ui.images.preloader.callback);
									}
								})
							});
						}
						else
						{
							$.kiosk.portfolio.ui.images.preloader.recursive();
						}
					}),
					
					'recursive': (function(_url) {
						if ($.kiosk.portfolio.ui.images.preloader.queued && $.kiosk.portfolio.ui.images.preloader.queued.length > 0)
						{
							var url = _url == undefined ? $.kiosk.portfolio.ui.images.preloader.queued.pop() : _url;
							var image = new Image();
							
							if ($.kiosk.portfolio.ui.images.preloader.variables.retry < 5)
							{
								$(image).bind('load', (function() {
									$.kiosk.portfolio.ui.images.preloader.variables.retry = 0;
									$.kiosk.portfolio.ui.images.preloader.recursive();
								}));
								
								$(image).bind('error', (function() {
									$.kiosk.portfolio.ui.images.preloader.variables.retry++;
									$.kiosk.portfolio.ui.images.preloader.recursive(_url);
								}));
								
								image.src = url;
							}
							else
							{
								$.kiosk.portfolio.ui.images.preloader.variables.retry = 0;
								$.kiosk.portfolio.ui.images.preloader.recursive();
							}
						}
						else
						{
							if ($.kiosk.portfolio.ui.images.preloader.callback)
							{
								$($.kiosk.portfolio.ui.images.preloader.callback);
							}
						}
					})
				}
			},
			
			'layer': {
				'hover': (function() {
					$('div[data-hover-layer]').each(function() {
						var button = $(this);
						var layer = $($(this).attr('data-hover-layer'));
						
						$(this).css('cursor', 'pointer');
						
						$(this).mouseover(function() {
							layer.removeClass('hide-fake');
							layer.css('z-index', 999);
							
							$('div[data-hover-layer]').each(function() {
								if (button.attr('class') != $(this).attr('class'))
								{
									$(this).css('z-index', 0);
								}
							});
						});
						
						$(this).mouseout(function() {
							layer.addClass('hide-fake');
							
							$('div[data-hover-layer]').each(function() {
								$(this).css('z-index', 999);
							});
						});
					});
				})
			},
			
			'button': {
				'hoverable': (function() {
					var ua = navigator.userAgent.toLowerCase();
					
					// Hoverable buttons initiate
					$('div[data-type="hoverable-button"][data-image-default][data-image-hover]').each(function() {
						var base_image = $(document.createElement('img')).attr('src', $(this).attr('data-image-default'));
						var over_image = $(document.createElement('img')).attr('src', $(this).attr('data-image-hover'));
						
						var base_link = $(document.createElement('a')).attr('href', $(this).attr('data-href')).append(base_image).blur();
						var over_link = $(document.createElement('a')).attr('href', $(this).attr('data-href')).append(over_image).blur();
						
						if ($(this).css('position').toLowerCase() != 'absolute')
						{
							$(this).css('position', 'relative');
						}
						
						base_link.focus(function() { this.blur(); });
						over_link.focus(function() { this.blur(); });
						
						var base_div = $(document.createElement('div')).attr('name', 'base').css('position', 'absolute').html(base_link);
						var over_div = $(document.createElement('div')).attr('name', 'over').css('position', 'absolute').html(over_link).hide();
						
						$(this).html('').append(base_div).append(over_div);
						
						if (ua.indexOf('iphone') === -1 && ua.indexOf('ipad') === -1 && ua.indexOf('ipod') === -1 && ua.indexOf('ios') === -1)
						{
							$(this).mouseover(function() { base_div.hide(); over_div.show(); });
							$(this).mouseout(function() { if ($(this).attr('data-highlighted') == undefined) { base_div.show(); over_div.hide(); } });
						}
						else
						{
							$(this).click((function() {
								$(this).attr('data-href');
							}));
						}
					});
				})
			}
		},
		
		'callback': {
			'init': (function() {
				$.kiosk.portfolio.callback.mouse();
				$.kiosk.portfolio.callback.keyboard();
				$.kiosk.portfolio.callback.resize();
				$.kiosk.portfolio.callback.blur();
			}),
			
			'mouse': (function() {
				if (window.addEventListener)
				{
					window.addEventListener('DOMMouseScroll', wheel, false);
				}
				
				window.onmousewheel = document.onmousewheel = wheel;

				$(window).mousewheel(function(event, delta) {
					event.preventDefault();
					
					if ($.kiosk.portfolio.variables.status.busy.transition == true) return;
					
					if (delta < 0)
					{
						if ($.kiosk.portfolio.variables.status.busy.door == true) return;
						$.kiosk.portfolio.misc.busy.door();
						
						$.kiosk.portfolio.menu.primary.show('next');
					}
					else if (delta > 0)
					{
						if ($.kiosk.portfolio.variables.status.busy.door == true) return;
						$.kiosk.portfolio.misc.busy.door();
						
						$.kiosk.portfolio.menu.primary.show('prev');
					}
				});
			}),
			
			'keyboard': (function() {
				$(document).keydown(function(e) {
					if ($.kiosk.portfolio.variables.status.busy.transition == true) return;
					
					if (e.keyCode == 40)
					{
						if ($.kiosk.portfolio.variables.status.busy.door == true) return;
						$.kiosk.portfolio.misc.busy.door();
						
						$.kiosk.portfolio.menu.primary.show('next');
					}
					else if (e.keyCode == 38)
					{
						if ($.kiosk.portfolio.variables.status.busy.door == true) return;
						$.kiosk.portfolio.misc.busy.door();
						
						$.kiosk.portfolio.menu.primary.show('prev');
					}
				});
			}),
			
			'resize': (function() {
				$(window).resize(function() {
					$.kiosk.portfolio.resize.background();
				});
			}),
			
			'blur': (function() {
				$('a').focus(function() {
					this.blur();
				});
			})
		},
		
		'resize': {
			'background': (function() {
				var min_height = 750;
				
				var window_width = $(window).width();
				var window_height = $(window).height();
				
				var background_width = 1800.0;
				var background_height = 1000.0;
				
				if (window_height < min_height) window_height = min_height;
				
				$('#background').css('width', window_width + 'px');
				$('#background').css('height', window_height + 'px');
				
				var background_width_new = window_height * background_width / background_height;
				var background_height_new = window_width * background_height / background_width;
				
				if (background_height_new < window_height)
				{
					$('#background').removeClass('full-width');
					$('#background').addClass('full-height');
				}
				else
				{
					$('#background').addClass('full-width');
					$('#background').removeClass('full-height');
				}
				
				$('#container .contents').css('height', window_height + 'px');
			})
		},
		
		'misc': {
			'busy': {
				'door': (function() {
					$.kiosk.portfolio.variables.status.busy.door = true;
					
					setTimeout("$.kiosk.portfolio.variables.status.busy.door = false;", 500);
				}),
				
				'gate': (function() {
					$.kiosk.portfolio.variables.status.busy.gate = true;
					
					setTimeout("$.kiosk.portfolio.variables.status.busy.gate = false;", 500);
				})
			},
			
			'transition': {
				'wait': (function(id, identifier, is_reverse) {
					var window_height = $(window).height();
					
					$(id).find('> div[data-transition-type=fade]').each(function() {
						$(this).css('opacity', 0.0);
					});
					
					$(id).find('> div[data-offset-top-show]').each(function() {
						var offset_top_show = parseInt($(this).attr('data-offset-top-show'), 10);
						
						if (is_reverse == false)
						{
							$(this).css('top', window_height + 'px');
						}
						else
						{
							var offset_top_append = ((parseInt($('#container .region').css('top'), 10) + parseInt($('#container .region').css('height'), 10)) * -1);
							var offset_top_show = parseInt($(this).attr('data-offset-top-show'), 10);
							
							$(this).css('top', (offset_top_append + offset_top_show) + 'px');
						}
					});
				}),
				
				'animate': (function (id, identifier, is_reverse, is_show){
					if ($.kiosk.portfolio.variables.status.busy.transition == true && $.kiosk.portfolio.variables.status.flag.transition.hide == false) return;
					if ($.kiosk.portfolio.variables.status.menu.current == identifier && is_show == true) return;
					
					// If a screen is showing already
					if (is_show == true && $.kiosk.portfolio.variables.status.menu.current != undefined)
					{
						$.kiosk.portfolio.variables.status.menu.queued = identifier;
						$.kiosk.portfolio.menu.primary.hide($.kiosk.portfolio.variables.status.menu.current, is_reverse);
						$.kiosk.portfolio.variables.status.menu.current = undefined;
						
						return;
					}
					
					$.kiosk.portfolio.variables.status.busy.transition = true;
					
					if (is_show == true)
					{
						$.kiosk.portfolio.variables.status.menu.current = identifier;
						
						$('#container .gnb > div').removeAttr('data-highlighted');
						$('#container .gnb div[name=base]').show();
						$('#container .gnb div[name=over]').hide();
						$('#container .gnb .' + identifier + ' div[name=base]').hide();
						$('#container .gnb .' + identifier + ' div[name=over]').show();
						$('#container .gnb .' + identifier).attr('data-highlighted', 'true');
					}
					
					var window_height = $(window).height();
					var animate_duration_base = parseInt($(id).attr('data-animate-duration-base'), 10);
					var animate_duration_step = parseInt($(id).attr('data-animate-duration-step' + (is_show ? '' : '-hide')), 10);
					
					if (isNaN(animate_duration_base) == true) animate_duration_base = 0;
					if (isNaN(animate_duration_step) == true) animate_duration_step = 200;
					
					$(id).removeClass('hide-fake');
					$(id).find('> div[data-transition-type=fade]').each(function() {
						var animate_delay = parseInt($(this).attr('data-animate-delay' + (is_show ? '' : '-hide')), 10);
						var animate_duration = parseInt($(this).attr('data-animate-duration'), 10);
						
						if (animate_delay)
						{
							$(this).delay(animate_duration_step * animate_delay);
						}
						
						$(this).animate(
							{
								opacity: is_show ? 1.0 : 0.0
							},
							{
								duration: (animate_duration_step * animate_duration)
							}
						);
					});
					
					var maximum_duration = 0;
					
					$(id).find('> div[data-offset-top-show]').each(function() {
						var offset_top_append = is_show ? 0 : ((parseInt($('#container .region').css('top'), 10) + parseInt($('#container .region').css('height'), 10)) * -1);
						var offset_top_show = parseInt($(this).attr('data-offset-top-show'), 10);
						var animate_duration = parseInt($(this).attr('data-animate-duration' + (is_reverse ? '-reverse' : '')), 10); animate_duration = isNaN(animate_duration) == false ? animate_duration : 0;
						var animate_delay = parseInt($(this).attr('data-animate-delay' + (is_show ? '' : '-hide') + (is_reverse ? '-reverse' : '')), 10);
						var duration = (animate_duration_base + (animate_duration_step * animate_duration));
						
						if (isNaN(animate_delay) == false) $(this).delay(animate_duration_step * animate_delay); else animate_delay = 0;
						if (maximum_duration < (animate_delay + duration)) maximum_duration = (duration + animate_delay);
						
						$(this).animate(
							{
								'top': (is_reverse == false ? (offset_top_show + offset_top_append) : (is_show ? offset_top_show : window_height)) + 'px'
							},
							{
								duration: duration,
								easing: is_show ? 'easeOutQuad' : 'easeInQuart',
								complete: (function() {
									// If all elements were animated
									if ((animate_delay + duration) >= maximum_duration)
									{
										if (is_show == true)
										{
											$.kiosk.portfolio.variables.status.busy.transition = false;
											$.kiosk.portfolio.variables.status.flag.transition.hide = false;
										}
										else
										{
											$.kiosk.portfolio.variables.status.flag.transition.hide = true;
										}
										
										if (is_show == false)
										{
											$(id).addClass('hide-fake');
										}
										
										// If transition is queued
										if ($.kiosk.portfolio.variables.status.menu.queued != undefined)
										{
											var queued_identifier = $.kiosk.portfolio.variables.status.menu.queued;
											
											$.kiosk.portfolio.variables.status.menu.queued = undefined;
											$.kiosk.portfolio.menu.primary.show(queued_identifier, is_reverse, true);
										}
									}
								})
							}
						);
					});
				}),
				
				'show': (function(id, identifier, is_reverse) {
					// If specified identifier was not shown
					if ($.kiosk.portfolio.variables.status.menu.current != identifier)
					{
						$.kiosk.portfolio.misc.transition.wait(id, identifier, is_reverse);
						$.kiosk.portfolio.misc.transition.animate(id, identifier, is_reverse, true);
					}
				}),
				
				'hide': (function(id, identifier, is_reverse) {
					$.kiosk.portfolio.misc.transition.animate(id, identifier, is_reverse, false);
				})
			}
		},
		
		'menu': {		
			'main': {
				'news': {
					'detail': {
						'show': (function(image, _width, _height) {
							var image_src = image;
							var image_width = _width;
							var image_height = _height;
							
							$('#news .background').fadeOut(0);
							$('#news .contents').slideUp(0);
							
							$('#news').show(0, function() {
								$('#news .background').fadeIn(300, (function() {
									var object = new Image();
									
									object.src = image_src;
									
									var width = (image_width == undefined ? object.width : image_width);
									var height = (image_height == undefined ? object.height : image_height);
									
									$('#news .contents').css('margin-top', '-' + (height / 2) + 'px');
									$('#news .contents').css('margin-left', '-' + (width / 2) + 'px');
									
									$('#news .contents').css('width', width + 'px');
									$('#news .contents').css('height', height + 'px');
									
									var image = $(document.createElement('img')).attr('src', image_src);
									
									$('#news .contents').html(image);
									$('#news .contents').slideDown(300, (function() {
										
									}));
								}));
							});
						}),
						
						'hide': (function() {
							$('#news .contents').slideUp(300, (function() {
								$('#news .background').fadeOut(300, (function() {
									$('#news').hide(0, (function() {
									}));
								}));
							}));
						})
					}
				}
			},
			
			'primary': {
				'show': (function(identifier, is_reverse, is_force) {
					if ($.kiosk.portfolio.variables.status.busy.transition == true && !is_force) return;
					if ($.kiosk.portfolio.variables.status.busy.gate == true) return;
					
					$.kiosk.portfolio.misc.busy.gate();
					
					var current = $.kiosk.portfolio.variables.status.menu.priority(0);
					var current_priority = $.kiosk.portfolio.variables.status.menu.priority(0, true);
					var submenu = undefined;
					var is_reverse = is_reverse == undefined ? false : is_reverse;
					
					if (identifier == 'prev')
					{
						is_reverse = true;
						identifier = $.kiosk.portfolio.variables.status.menu.priority(-1);
						
						submenu = $.kiosk.portfolio.variables.status.menu.submenu(current);
						submenu_wait = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
						
						// If current screen has child
						if (submenu != undefined && $.kiosk.portfolio.menu.secondary.show.prev(current) == true)
						{
							return;
						}
						// If current screen has not child and before screen has child
						else if (submenu_wait != undefined)
						{
							$.kiosk.portfolio.menu.secondary.show.last(identifier, false);
						}
						
						if (current_priority == 0)
						{
							return;
						}
					}
					else if (identifier == 'next')
					{
						is_reverse = false;
						identifier = $.kiosk.portfolio.variables.status.menu.priority(+1);
						
						submenu = $.kiosk.portfolio.variables.status.menu.submenu(current);
						submenu_wait = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
						
						// If current screen has child
						if (submenu != undefined && $.kiosk.portfolio.menu.secondary.show.next(current) == true)
						{
							return;
						}
						// If current screen has not child and next screen has child
						else if (submenu_wait != undefined)
						{
							$.kiosk.portfolio.menu.secondary.show.first(identifier, false);
						}
						
						if (current_priority == ($.kiosk.portfolio.variables.status.menu.count - 1))
						{
							return;
						}
					}
					
					if ($.kiosk.portfolio.variables.status.menu.submenu(identifier) != undefined)
					{
						if (is_reverse == false)
						{
							$.kiosk.portfolio.menu.secondary.show.first(identifier, false);
						}
						else
						{
							$.kiosk.portfolio.menu.secondary.show.last(identifier, false);
						}
					}
					
					$.kiosk.portfolio.misc.transition.show('#step-' + identifier, identifier, is_reverse);
				}),
				
				'hide': (function(identifier, is_reverse) {
					$.kiosk.portfolio.misc.transition.hide('#step-' + identifier, identifier, is_reverse);
				})
			},
			
			'secondary': {
				'show': {
					'animate': (function(identifier, page, is_animated) {
						var menu_page = undefined;
						
						if ($.kiosk.portfolio.variables.status.busy.transition == true) return;
						$.kiosk.portfolio.variables.status.busy.transition = true;						
						$.kiosk.portfolio.variables.status.menu.current_sub = page;
						
						if (identifier == 'web')
						{							
							switch (page)
							{
								case 1:
								case 2: 
								case 3: 
								case 4: menu_page = 1; break;
								case 5: 
								case 6: menu_page = 2; break;
								case 7: 
								case 8: menu_page = 3; break;
								case 9: 
								case 10: menu_page = 4; break;
								case 11: 
								case 12: 
								case 13: menu_page = 5; break;
							}							
						}
						else if (identifier == 'mobile')
						{
							switch (page)
							{
								case 1:
								case 2: menu_page = 1; break;
								case 3:
								case 4:menu_page = 2; break;								
							}
							
						}
						else if (identifier == 'app')
						{
							switch (page)
							{
								case 1:
								case 2: menu_page = 1; break;
								case 3:
								case 4:menu_page = 2; break;
							}
						}
						
						if (menu_page)
						{
							$('#step-' + identifier + ' > .menu > a').removeClass('on');
							$('#step-' + identifier + ' > .menu div[name=base]').show();
							$('#step-' + identifier + ' > .menu div[name=over]').hide();
							$('#step-' + identifier + ' > .menu-' + menu_page + ' div[name=base]').hide();
							$('#step-' + identifier + ' > .menu-' + menu_page + ' div[name=over]').show();
							$('#step-' + identifier + ' > .menu-' + menu_page +' > a').addClass('on');
						}
						
						$('#step-' + identifier + ' .tablet .arrow-left').fadeOut(200);
						$('#step-' + identifier + ' .tablet .arrow-right').fadeOut(200);						
						$('#step-' + identifier + ' .tablet .container .pages').animate(
							{
								'left': '-' + ((page - 1) * 731)
							},
							{
								duration: is_animated ? 350 : 0,
								easing: 'linear',
								complete: (function() {
									var count = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
									var current = $.kiosk.portfolio.variables.status.menu.current_sub;
									
									$('#step-' + identifier + ' .tablet .arrow-left').fadeIn(200);
									$('#step-' + identifier + ' .tablet .arrow-right').fadeIn(200);
																		
									
									$('div[data-identifier=youtube][data-youtube-src]').each(function() {
										$(this).html('<div class="loading">Loading</div>');
									});
									
									$('#step-' + identifier + ' .tablet .page-' + page + ' div[data-identifier=youtube][data-youtube-src]').each(function() {
										var player = $(document.createElement('iframe'));
										
										player.attr('type', 'text/html');
										player.attr('frameborder', '0');
										player.attr('allowfullscreen', 'true');
										player.attr('src', 'https://www.youtube.com/embed/' + $(this).attr('data-youtube-src'));
										
										$(this).html(player);
									});
									
									$.kiosk.portfolio.variables.status.busy.transition = false;
								})
							}
						);
					}),
					
					'first': (function(identifier, is_animated) {
						var count = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
						
						if (count != undefined)
						{
							$.kiosk.portfolio.menu.secondary.show.animate(identifier, 1, is_animated);
							
							return true;
						}
						
						return false;
					}),
					
					'last': (function(identifier, is_animated) {
						var count = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
						
						if (count != undefined)
						{
							$.kiosk.portfolio.menu.secondary.show.animate(identifier, count, is_animated);
							
							return true;
						}
						
						return false;
					}),
					
					'prev': (function(identifier) {
						var current = $.kiosk.portfolio.variables.status.menu.current_sub;
						
						if ($.kiosk.portfolio.variables.status.menu.current == 'shop')
						{
							current = 1;
						}
						
						if (current > 1)
						{
							$.kiosk.portfolio.menu.secondary.show.animate(identifier, --current, true);
							
							return true;
						}
						else
						{
							switch ($.kiosk.portfolio.variables.status.menu.current)
							{
								case 'intro': $.kiosk.portfolio.menu.primary.show('app', true); break;
								case 'web': $.kiosk.portfolio.menu.primary.show('intro', true); break;
								case 'mobile': $.kiosk.portfolio.menu.primary.show('web', true); break;
								case 'app': $.kiosk.portfolio.menu.primary.show('mobile', true); break;
							}
						}
						
						return false;
					}),
					
					'next': (function(identifier) {
						var count = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
						var current = $.kiosk.portfolio.variables.status.menu.current_sub;
						
						if (current == undefined)
						{
							current = 1;
						}
						
						if (current < count)
						{
							$.kiosk.portfolio.menu.secondary.show.animate(identifier, ++current, true);							
							return true;
						}
						else
						{
							switch ($.kiosk.portfolio.variables.status.menu.current)
							{
								case 'intro': $.kiosk.portfolio.menu.primary.show('web'); break;
								case 'web': $.kiosk.portfolio.menu.primary.show('mobile'); break;
								case 'mobile': $.kiosk.portfolio.menu.primary.show('app'); break;
								case 'app': $.kiosk.portfolio.menu.primary.show('intro'); break;
							}
						}
						
						return false;
					}),
					
					'specify': (function(identifier, index) {
						var count = $.kiosk.portfolio.variables.status.menu.submenu(identifier);
						
						if (count != undefined && index >= 1 && index <= count)
						{
							$.kiosk.portfolio.menu.secondary.show.animate(identifier, index, true);
						}
					})
				}
			}
		},
		
		'variables': {
			'status': {
				'menu': {
					'count': 4,
					'priority': (function(offset, raw) {
						var menus = Array();
						var found = -1;
						
						menus.push('intro');
						menus.push('web');
						menus.push('mobile');
						menus.push('app');
						
						for (var i = 0; i < menus.length; i++)
						{
							if ($.kiosk.portfolio.variables.status.menu.current == menus[i])
							{
								found = i + offset;
								break;
							}
						}
						
						while (true)
						{
							if (found < 0)
							{
								found = found + menus.length;
							}
							else if (found >= menus.length)
							{
								found = found - menus.length;
							}
							else
							{
								break;
							}
						}
						
						return !raw ? menus[found] : found;
					}),
					
					'submenu': (function(identifier) {
						if (identifier == 'web') return 13;
						else if (identifier == 'mobile') return 4;
						else if (identifier == 'app') return 4;
						else return undefined;
					}),
					
					'queued': undefined,
					'current': undefined,
					'current_sub': undefined
				},
				
				'flag': {
					'transition': {
						'hide': false
					}
				},
				
				'busy': {
					'transition': false,
					'door': false,
					'gate': false
				}
			}
		}
	}
};