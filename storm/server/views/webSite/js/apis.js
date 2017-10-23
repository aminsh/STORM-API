"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";

(function(window, document, $){

    let $items = $( ".so-home-content_apis_list_item[data-num]" );
    let $list = $( ".so-home-content_apis_list" );
    let $content = $( ".so-home-content_apis_upper" );
    let $htmlBody = $( "html, body" );
    let $section  = $( "#APIs" );
    let $closeBtn = $( "#APIs_close" );


    $items
        .on("click", function(){

            let num = $( this ).data("num");
            openItem(num);

        });

    $closeBtn
        .on("click", closeItem);

    function openItem(num){

        $list
            .addClass("so-diactive");
        $content
            .addClass("so-active");

        // close everything
        $( `.so-home-content_apis_upper_title, .so-home-content_apis_upper_p` )
            .css({
                display: "none"
            });

        // Open the header
        $( `.so-home-content_apis_upper_title[data-num='${num}']` )
            .css({
                display: "block"
            });
        // Open the content
        $( `.so-home-content_apis_upper_p[data-num='${num}']` )
            .css({
                display: "block"
            });

        // Open the close btn
        $closeBtn
            .css({
                display: "block"
            });

        $htmlBody
            .animate({
                scrollTop: $section.offset().top
            });

    }

    function closeItem(){

        $list
            .removeClass("so-diactive");
        $content
            .removeClass("so-active");
        $closeBtn
            .css({
                display: "none"
            });

    }

    module.exports = {
        openItem,
        closeItem
    };

}(window, document, $));