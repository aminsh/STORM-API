"use strict";

(function(window, document, $){

    let selectedForm = 0;
    let $contents = $( ".so-home-first-section_form_content" );

    $contents
        .each((index, elem) => {

            if(index === 0) return;

            let $elem = $( elem );

            $elem
                .css({
                    right: "-100%",
                    left: "100%",
                    opacity: "0"
                });

        });

    $( ".so-sign-form_go-next" )
        .on("click", goNext);
    $( ".so-sign-form_go-prev" )
        .on("click", goPrev);

    function goNext(){

        let $newContent = $( `.so-home-first-section_form_content[data-num='${selectedForm + 1}']` );

        if($newContent.length === 0) return;

        let $oldContent = $( `.so-home-first-section_form_content[data-num='${selectedForm}']` );
        selectedForm += 1;

        $oldContent
            .stop()
            .animate({
                left: "-100%",
                right: "100%",
                opacity: "0"
            });
        $newContent
            .stop()
            .animate({
                left: "0",
                right: "0",
                opacity: "1"
            });

    }

    function goPrev(){

        let $newContent = $( `.so-home-first-section_form_content[data-num='${selectedForm - 1}']` );

        if($newContent.length === 0) return;

        let $oldContent = $( `.so-home-first-section_form_content[data-num='${selectedForm}']` );
        selectedForm -= 1;

        $oldContent
            .stop()
            .animate({
                left: "100%",
                right: "-100%",
                opacity: "0"
            });
        $newContent
            .stop()
            .animate({
                left: "0",
                right: "0",
                opacity: "1"
            });

    }

    function goTo(num){

        if(selectedForm === num) return;

        let prevForm = num < selectedForm;

        let $newContent = $( `.so-home-first-section_form_content[data-num='${num}']` );

        if($newContent.length === 0) return;

        let $oldContent = $( `.so-home-first-section_form_content[data-num='${selectedForm}']` );

        if(prevForm){

            $oldContent
                .stop()
                .animate({
                    left: "100%",
                    right: "-100%",
                    opacity: "0"
                });
            $newContent
                .stop()
                .animate({
                    left: "0",
                    right: "0",
                    opacity: "1"
                });

        } else {

            $oldContent
                .stop()
                .animate({
                    left: "-100%",
                    right: "100%",
                    opacity: "0"
                });
            $newContent
                .stop()
                .animate({
                    left: "0",
                    right: "0",
                    opacity: "1"
                });

        }

        selectedForm = num;

    }

    window.sign_form = {
        goNext,
        goPrev,
        goTo
    };

    module.exports = {
        goNext,
        goPrev,
        goTo
    };

}(window, document, $));