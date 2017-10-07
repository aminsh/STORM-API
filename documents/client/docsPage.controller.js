"use strict";

export default class DocsPageController{

    constructor($window
                ,$state
                ,$stateParams
                ,$scope
                ,$filter
                ,docsApi){

        this.$window = $window;
        this.$state = $state;
        this.docsApi = docsApi;
        this.docsTree = null;
        this.pageId = $stateParams.pageId;
        this.$filter = $filter;
        this.loadingPage = true;
        this.page = null;
        if (!this.pageId)
            $state.go("docs");

        $scope.menuOpen = true;
        this.getPageById(this.pageId)
            .finally(() => this.getTree());

    }

    getTree(){

        return this.docsApi
            .getList()
            .then(data => {
                this.docsTree = data.returnValue;
                this.loadingPage = false;
            })
            .catch(err => console.log(err));

    }

    getPageById(pageId){

        return this.docsApi
            .getById(pageId)
            .then(data => this.page = data.returnValue)
            .catch(() => this.$state.go("docs"));

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