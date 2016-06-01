(function (win,$) {
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
        // 동작 처리
        alert("touched");
    },"touched");

    /* 검색박스  */
    $btn_dels = $(".btn_dels");
    $w_srch = $(".w_srch");

    $w_srch.on('keydown blur keypress','input#inpu_srch',function(e) {      
        var $me = $(this);        
        switch(e.type) {
            case 'keydown':
                if ( $.trim($me.val()).length < 1 ) {
                    $w_srch.removeClass("on");

                } else {                    
                    $w_srch.addClass("on");
                }
                console.log(e.type);
                break;
            case 'blur':
                if ( $.trim($(this).val()).length == 0 ) {
                    $w_srch.removeClass("on");
                }     
                console.log(e.type);           
                break;
            default:
                break;
        }   
    });


    $doc.on("click",".btn_dels",function(e) {
        $("#inpu_srch").val("");
        $w_srch.removeClass("on");
    });
})(window,jQuery);