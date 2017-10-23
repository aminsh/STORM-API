"use strict";

import $ from "./libs/jQuery/jquery-3.2.1.min.js";

(function(window, document, $){

    function loginByGoogle(){

        let url = `${window.location.origin}/auth/google`;
        window.open(url, '_self');

    }

    module.exports = {
        loginByGoogle
    };

}(window, document, $));