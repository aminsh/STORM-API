"use strict";

// General Dependencies
import text_typing from "./text-type.js";

let wow = new WOW({
                boxClass:     'wow',      // default
                animateClass: 'animated', // default
                offset:       50,          // default
                mobile:       true,       // default
                live:         true        // default
            });
wow.init();

text_typing(
    "#so-amin-type"
    ,[
        "شیخی",
        "بنیانگذار و مدیر فنی"
    ]
);
text_typing(
    "#so-sanaz-type"
    ,[
        "سلیمانی",
        "بنیانگذار و مدیر کسب و کار"
    ]
);
/*text_typing(
    "#so-ramin-type"
    ,[
        "یزدانی",
        "مهندس محصول"
    ]
);
text_typing(
    "#so-smrsan-type"
    ,[
        "ابوالحسنی",
        "توسعه دهنده"
    ]
);*/

// My Dependencies
import "./page-scroll.js";
import "./material_input.js";
import menuBtn from "./menu-btn.js";
import topMenu from "./top-menu.js";
import "./sign-form.js";
import "./features.js";
import "./apis.js";
import auth from "./authentication.js";

// code
(function(window, document, $, menuBtn, topMenu){

    let // $topMenu = topMenu.get(),
        $menuBtn = menuBtn.get(),
        $topMenu_toggle = $( ".so-top-menu_toggle" ),
        $topMenu_close = $( ".so-top-menu_close, .so-top-menu .so-top-menu_list a[href^='#']" )
        ;//$body = $( "body" );

    // start -- TopMenu
    function topMenu_close_fn(){
        topMenu.closeTopMenu();
        $menuBtn.removeClass("so-active");
        // $body[0].classList.remove("so-no-scroll");
    }
    function topMenu_open_fn(){
        topMenu.openTopMenu();
        $menuBtn.addClass("so-active");
        // $body[0].classList.add("so-no-scroll");
    }

    $topMenu_toggle
        .on("click", function(){

            if(topMenu.isOpen()){
                return topMenu_close_fn();
            }
            topMenu_open_fn();

        });

    $topMenu_close
        .on("click", topMenu_close_fn);
    // end -- TopMenu
    //start -- SignUp/In Form

    $( "#loginByGoogle" )
        .on("click", auth.loginByGoogle);

    //end -- SignUp/In Form

}(window, document, $, menuBtn, topMenu));












