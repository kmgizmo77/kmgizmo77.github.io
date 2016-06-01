
(function (win,$) {
    var $doc = $(document),
    $win = $(win);

     var MELON = win.MELON || (win.MELON = {}),
        MOBPB = MELON.MOBPB || (MELON.MOBPB = {}),
    
        ua = ua || navigator.userAgent,
        match = ua.match(/Android\s([0-9\.]*)/);
     MOBPB.getAndroidVersion = function() {        
        if(match){
            var last = match[1].lastIndexOf(".");
            var txt =  match[1].slice(0,last);
        }
        return match ? txt : false;
    };


    $.fn.scrollEnd = function(callbackEnd, timeout, callbackStart) { 
      $(this).scroll(function(){
        callbackStart();
        var $this = $(this);
        if ($this.data('scrollTimeout')) {
          clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callbackEnd,timeout));
      });
    };

})(window,jQuery);