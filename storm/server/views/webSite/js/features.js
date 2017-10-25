"use strict";

(function(window, document, $){

    let $window = $( window );
    let $htmlBody = $( "html, body" );
    let $section = $( "#features" );
    let $boxes = $( ".so-home_features_content_box" );
    let $blackLayer = $( ".so-home_features_black-layer" );
    let $upperLayer = $( ".so-home_features_upper-layer" );
    let $content = $( ".so-home_features_content" );
    let $title = $( "#features_title" );
    let $closer = $( ".so-features_btn_close" );
    let $featuresCloseBtn = $( "#features_close" );
    let $contentHolder = $( ".so-home_features_upper-layer_content_holder" );
    let vpHeight = document.documentElement.clientHeight;

    $boxes
        .on("click", function() {

            let $this = $( this );

            if( !($this.data("num")) ) return;

            openFeaturesLayer($this.data("num"));

        });

    $closer
        .on("click", closeFeaturesLayer);

    function openFeaturesLayer(num){

        $content
            .addClass("so-blur");
        $blackLayer
            .addClass("so-active");
        $upperLayer
            .addClass("so-active");

        $( `.so-home_features_upper-layer_content_h` )
            .css({
                display: "none"
            });
        $( `.so-home_features_upper-layer_content_p` )
            .css({
                display: "none"
            });
        $( `.so-home_features_upper-layer_content_img` )
            .css({
                display: "none"
            });

        $( `.so-home_features_upper-layer_content_h[data-num='${num}']` )
            .css({
                display: "block"
            });
        $( `.so-home_features_upper-layer_content_p[data-num='${num}']` )
            .css({
                display: "block"
            });
        $( `.so-home_features_upper-layer_content_img[data-num='${num}']` )
            .css({
                display: "block"
            });
        $featuresCloseBtn
            .removeClass("fadeOutRight")
            .addClass("so-anim-dly-1s")
            .addClass("fadeInLeft");

        $htmlBody
            .animate({
                scrollTop: $section.offset().top
            });

    }

    function closeFeaturesLayer(){

        $content
            .removeClass("so-blur");
        $blackLayer
            .removeClass("so-active");
        $upperLayer
            .removeClass("so-active");

        $featuresCloseBtn
            .removeClass("fadeInLeft")
            .removeClass("so-anim-dly-1s")
            .addClass("fadeOutRight");

    }

    module.exports = {
        openFeaturesLayer,
        closeFeaturesLayer
    };

}(window, document, $));