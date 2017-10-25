"use strict";

(function(window, document, $){

    function loginByGoogle(){

        let url = `${window.location.origin}/auth/google`;
        window.open(url, '_self');

    }

    module.exports = {
        loginByGoogle
    };

}(window, document, $));