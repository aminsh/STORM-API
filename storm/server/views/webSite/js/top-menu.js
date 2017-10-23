"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";
import pageScroll from "./page-scroll.js";

(function(window, document, $){

    let $topMenu = $( ".so-top-menu" );

    function openTopMenu(){

        if(!$topMenu[0].classList.contains("so-active"))
            $topMenu[0].classList.add("so-active");

    }

    function closeTopMenu(){

        if($topMenu[0].classList.contains("so-active"))
           $topMenu[0].classList.remove("so-active");

    }

    function isOpen(){

        return $topMenu[0]
                    .classList
                    .contains("so-active");

    }

    function get(){ return $topMenu }

    module.exports = {
        openTopMenu,
        closeTopMenu,
        isOpen,
        get
    };

}(window, document, $));