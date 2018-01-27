"use strict";

export default class DocsController{

    constructor($state, docsApi, logger, confirm) {

        this.$state = $state;
        // tabs.setTab("docs");
        this.docsApi = docsApi;
        this.logger = logger;
        this.confirm = confirm;
        this.docsTree = [];
        this.getTree();

    }

    getTree(){

        return this.docsApi
            .getList()
            .then(data => this.docsTree = data.returnValue)
            .catch(err => console.log(err));

    }

    editPage(pageId){

        this.$state.go("editDoc", { pageId });

    }

    deletePage(pageId){


        let isParent = this.docsTree.hasOwnProperty(pageId);

        this.confirm(
            `Are you sure you want to delete this ${isParent ? "PARENT":""} page ?`,
            `Remove Page "${this.getPageById(pageId).title}"`
        )
            .then(() =>

                this.docsApi
                    .deletePage(pageId)
                    .then(data => this.logger.success())
                    .catch(err => console.log(err))
                    .finally(() => this.getTree())

            )
            .catch(() => console.log("Confirm Rejected !"));

    }

    getPageById(pageId){

        for (let parentId in this.docsTree) {
            if(!this.docsTree.hasOwnProperty(parentId)) continue;
            if(parentId === pageId) continue;
            for (let i=0; i<this.docsTree[parentId].length; i++)
                if(this.docsTree[parentId][i].id === pageId)
                    return this.docsTree[parentId][i];
        }
        return false;

    }

}