"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";

let ex = {};

(function(window, document, $){

    let $htmlBody = $( "html, body" );
    let $contactSection = $( "section#contact" );

    // Scroll Page Link
    $('a.page-scroll[href^="#"]').on('click', function(event) {

        event.preventDefault();
        $('html, body')
            .stop()
            .animate({
                scrollTop: $( $.attr(this, "href") ).offset().top
            }, 500);

    });

    // Set the section indicator
    let lastSectionIndex = -1;

    function setIndicator(){

        let $window = $( window ),
            vpHeight = document.documentElement.clientHeight,
            scrollTop = $window.scrollTop(),
            offsetTops = [{index: 0, top: 0, height: vpHeight}/* The First Section Properties */],
            $sections = $( "div.so-home-content_wrapper > section" ),
            $sectionLinks = $(".so-home-nav_links_list a.page-scroll[href^='#']"),
            $smSectionLinks = $(".so-top-menu_list a.page-scroll[href^='#']"),
            // sectionIndex = Math.round(scrollTop / vpHeight),
            // goRight = lastSectionIndex > sectionIndex,
            // equalIndex = lastSectionIndex === sectionIndex,
            $indicated = $("a.page-scroll[href^='#'].indicated"),
            $smIndicated = $("a.page-scroll[href^='#'].sm-indicated");

        $sections
            .each((index, elem) => {

                let $elem = $( elem );
                offsetTops.push({
                    index: index + 1
                    ,top: $elem.offset().top
                    ,height: $elem.outerHeight()
                });

            })
            .promise()
            .done(() => {

                let sectionIndex,
                    goRight,
                    equalIndex;

                for(let i=0; i<offsetTops.length; i++){

                    if( scrollTop >= offsetTops[i].top
                        && scrollTop < (offsetTops[i].top + Math.round(offsetTops[i].height / 2)) ){

                        sectionIndex = i;
                        goRight = lastSectionIndex > sectionIndex;
                        equalIndex = lastSectionIndex === sectionIndex;
                        break;

                    } else if( scrollTop >= (offsetTops[i].top + Math.round(offsetTops[i].height / 2))
                               && scrollTop <= (offsetTops[i].top + offsetTops[i].height) ){

                        if( offsetTops[i + 1]
                            && (scrollTop + vpHeight) >= (offsetTops[i + 1].top + 200)){

                            sectionIndex = i + 1;
                            goRight = lastSectionIndex > sectionIndex;
                            equalIndex = lastSectionIndex === sectionIndex;
                            break;
                        }
                        sectionIndex = i;
                        goRight = lastSectionIndex > sectionIndex;
                        equalIndex = lastSectionIndex === sectionIndex;
                        break;

                    } else if( (scrollTop + vpHeight) >= (offsetTops[i].top + Math.round(offsetTops[i].height / 2))
                                && (scrollTop + vpHeight) <= (offsetTops[i].top + offsetTops[i].height) ){

                        sectionIndex = i;
                        goRight = lastSectionIndex > sectionIndex;
                        equalIndex = lastSectionIndex === sectionIndex;
                        break;

                    }

                }
                let $sectionLink = $( $sectionLinks[sectionIndex] );
                if(sectionIndex !== 0)
                    $sectionLinks[sectionIndex - 1].classList.add("indicate-right");
                lastSectionIndex = sectionIndex;

                if(equalIndex && $indicated.length === 0){
                    $sectionLink[0].classList.remove("indicate-right");
                    $sectionLink[0].classList.add("indicated");
                    return;
                }

                // FadeOut Last
                if($indicated.length !== 0){
                    if(goRight){
                        $indicated[0].classList.remove("indicate-right");
                    } else {
                        $indicated[0].classList.add("indicate-right");
                    }
                    $sectionLinks.removeClass("indicated");
                }
                $smSectionLinks.removeClass("sm-indicated");

                // FadeIn New
                if(goRight){
                    $sectionLink[0].classList.add("indicate-right");
                } else {
                    $sectionLink[0].classList.remove("indicate-right");
                }
                $sectionLink[0].classList.add("indicated");
                if(sectionIndex !== 0)
                    $smSectionLinks[sectionIndex - 1].classList.add("sm-indicated");

            });

    }
    setIndicator();

    // Set the navbar style
    function setNavBarStyle(){

        let $window = $( window ),
            scrollTop = $window.scrollTop(),
            vpHeight = document.documentElement.clientHeight,
            $topNav = $( "div.so-home-nav_wrapper" );

        if(scrollTop >= vpHeight){

            if($topNav[0].classList.contains("so-home-nav_scroll-active")) return;
            $topNav[0].classList.add("so-home-nav_scroll-active");
            return;
        }
        $topNav[0].classList.remove("so-home-nav_scroll-active");

    }
    setNavBarStyle();
    ex.setNavBarStyle = setNavBarStyle;

    $(document)
        .on("scroll", function(){
            setIndicator();
            setNavBarStyle();
        });

    // Scroll to contact
    $( ".so-scroll-to-contact" )
        .on("click", function(){

            $htmlBody
                .animate({
                    scrollTop: $contactSection.offset().top
                });

        });

}(window, document, $));

module.exports = ex;