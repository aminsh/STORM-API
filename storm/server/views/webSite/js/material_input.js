"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";

(function(console, window, document, $){

    let $mInputs = $( "div.so-material_input > input" );

    $mInputs
        .on("blur", function(){

            if( !(this.value) )
                return this.classList.remove("so-active");

            this.classList.add("so-active");

        })
        .on("focus", function(){ this.classList.add("so-active") });

}(console, window, document, $));