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

    container.singleton('BranchService', function () {
        let BranchService = require('./features/branch/branch.service');
        return new BranchService();
    });

    container.singleton('UserQuery', function () {
        let UserQuery = require('./features/user/user.query');
        return new UserQuery();
    });

    container.register('BranchQuery', require('./features/branch/branch.query'));
};