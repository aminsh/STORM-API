"use strict";

export default class DocsController{

    constructor($scope
                ,$filter
                ,$timeout
                ,docsApi){

        this.$scope = $scope;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.docsApi = docsApi;
        this.docsTree = null;
        this.searchText = "";
        this.loadingTree = true;

        this.init();

    }

    init(){

        this.getTree();

    }

    getTree(){

        return this.docsApi
            .getList()
            .then(data => {
                this.docsTree = data.returnValue;
                this.$timeout(() => {
                    this.loadingTree = false;
                }, 300);
            })
            .catch(err => console.log(err));

    }

    isExists(parentItem, searchChildTitle){

        let rootTitles = [];
        for (let i=0; i<this.docsTree['root'].length; i++)
            rootTitles.push(this.docsTree['root'][i].title);

        if (
            this.$filter('filter')
            (
                rootTitles
                ,searchChildTitle
            ).indexOf(parentItem.title) !== -1
        )
            return true;

        if (!this.docsTree.hasOwnProperty(parentItem.id))
            return false;

        let idTitles = [];
        for (let i=0; i<this.docsTree[parentItem.id].length; i++)
            idTitles.push(this.docsTree[parentItem.id][i].title);

        return this.$filter('filter')
                    (
                        idTitles
                        ,searchChildTitle
                    ).length !== 0;

    }

}