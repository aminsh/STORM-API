"use strict";

(function(window, document, $){

    let $btns = $( ".so-menu-btn" );

    $btns.on("click", function(){
        $( this ).toggleClass("so-active");
    });

    function get(){ return $btns }

    module.exports = {
        get
    };

}(window, document, $));