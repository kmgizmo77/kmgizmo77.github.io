(function (win,$) {

    var $doc = $(document),
    $win = $(win);
    $doc.ready(function() {
        /* 셀렉트박스 커스텀 */
        var $oSort =$(".o_sort"),
        $selSort = $(".sel_sort");

        $oSort.html($selSort.find(">option:selected").text());
        $selSort.on("change",function(){
            $oSort.html($selSort.find(">option:selected").text());
        });


        /* 서브메뉴 */
        var $target = $(".u_song li");
        
        $doc.on("click",".u_song li",function(e) {
            $target.removeClass("on");
            $(this).addClass("on");

        });

        /* 터치 적용 */
        $("button").touch(function(){
            console.log("touched");
            // 동작 처리
        },"touched");
 
        $(window).scrollEnd(function(){
            var pos_scrtop = $win.scrollTop();
            var pos_winHeight = $win.height();
            $(".goto_top").css("top",parseInt(pos_scrtop+pos_winHeight-72)+"px").show();
        },80, function(){
            $(".goto_top").hide();            
        });

        /* 검색박스  */
        $btn_dels = $(".btn_dels");
        $w_srch = $(".w_srch");

        $w_srch.on('keyup blur','input#inpu_srch',function(e) {      
            var $me = $(this);        
            switch(e.type) {
                case 'keyup':            
                    if ( $.trim($me.val()).length <= 0 ) {
                        $w_srch.removeClass("on");
                    } else {                    
                        $w_srch.addClass("on");
                    }                    
                    break;
                case 'blur':
                    if ( $.trim($(this).val()).length == 0 ) {
                        $w_srch.removeClass("on");
                    }     
                    break;
                default:
                    break;
            }   
        });

        $doc.on("click",".btn_dels",function(e) {
            $("#inpu_srch").val("");
            $w_srch.removeClass("on");
        });

        $doc.on("click",".leftmenu",function(e){        
            $("body").toggleClass("on");
        });
        $doc.on("click","body.on .lnb a",function(e){
            $("body").toggleClass("on");
        });

        $doc.on("click",".btn_close",function(e){
            
        });
    });




 })(window,jQuery);