"use strict";

module.exports = function (container){
    container.bind('query.docs', function (){
        const DocsQuery = require('./features/documents/docs.query');
        return new DocsQuery();
    });
    container.bind('repository.docs', function (){
        const DocsRepository = require('./features/documents/docs.repository');
        return new DocsRepository();
    });
};