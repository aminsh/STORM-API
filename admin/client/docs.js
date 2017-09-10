"use strict";

export default class DocsController{

    constructor(tabs, docsApi) {

        tabs.setTab("docs");
        this.docsApi = docsApi;
        this.docsTree = [];
        this.getTree();

    }

    getTree(){

        this.docsApi
            .getList()
            .then(data => this.docsTree = data.returnValue)
            .catch(err => console.log(err));
        
    }

    editPage(pageId){



    }

    deletePage(pageId){



    }

}