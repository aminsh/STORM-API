"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";

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