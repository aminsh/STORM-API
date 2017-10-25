"use strict";

(function(console, window, document, $){

    let $mInputs = $( "div.so-material_input > input" );

    $mInputs
        .on("blur", function(){

            checkIfEmpty(this);

            if( !(this.value) )
                return this.classList.remove("so-active");

            this.classList.add("so-active");

        })
        .on("focus", function(){

            checkIfEmpty(this);
            this.classList.add("so-active");

        })
        .on("keydown keyup keypress change", function (){
            checkIfEmpty(this);
        })
        .addClass("so-empty");

    function checkIfEmpty(elem){

        if( !(elem.value) )
            return elem.classList.add("so-empty");

        elem.classList.remove("so-empty");

    }

}(console, window, document, $));