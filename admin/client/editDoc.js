"use strict";

export default class EditDocController{

    constructor($window,
                $state,
                $stateParams,
                tabs,
                docsApi,
                logger,
                LxNotificationService) {

        this.$window = $window;
        this.$state = $state;
        this.pageId = $stateParams.pageId;
        if (!this.pageId)
            $state.go("docs");
        tabs.setTab("docs");
        this.docsApi = docsApi;
        this.parentList = [];
        this.settings = {};
        this.shouldDeleteParent = false;
        this.logger = logger;
        this.onSelectGroupName = value => {
            LxNotificationService.info(`"${value}" Selected`);
            this.settings.groupName = value;
            let parentList = JSON.parse($window.localStorage.getItem("parentList"));
            for (let p in parentList) {
                if (!parentList.hasOwnProperty(p)) continue;
                if (parentList[p].title !== this.settings.groupName) continue;
                this.settings.groupId = parentList[p].id;
                break;
            }
        };
        this.groupAutoComplete = (_newValue, _cb, _errCb) => {

            if(!_newValue)
                return _cb( JSON.parse($window.localStorage.getItem("parentList")) );

            try{

                let parentList;
                let foundItems = [];

                if( !(parentList = JSON.parse( $window.localStorage.getItem("parentList") )) )
                    return _cb([]);

                parentList
                    .map(item => {
                        if (item.title.toLowerCase().search(_newValue.toLowerCase()) !== -1)
                            foundItems.push(item.title);
                    });

                return _cb(foundItems);

            } catch(err) {

                _errCb("Error");
                console.log(err);

            }

        };

        this.getPage();
        this.updateParentList();

    }

    getPage(){

        this.docsApi
            .getById(this.pageId)
            .then(data => this.settings = {
                pageTitle: data.returnValue.title,
                groupId: data.returnValue.parentId,
                currentGroupId: data.returnValue.parentId,
                groupName: data.returnValue.parentName,
                pageContent: data.returnValue.pageContent,
                hasChild: data.returnValue.hasChild
            })
            .catch(err => console.log(err));

    }

    updateParentList(){

        this.docsApi
            .getParentList()
            .then(data =>{
                this.$window
                    .localStorage
                    .setItem(
                        "parentList"
                        , JSON.stringify(data.returnValue)
                    )
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {

                if(this.settings.hasChild) return;

                let parentList;

                if( !(parentList = JSON.parse(this.$window.localStorage.getItem("parentList"))) )
                    return;

                for (let i=0; i<parentList.length; i++) {
                    if(parentList[i].id !== this.pageId) continue;
                    parentList.splice(i, 1);
                    this.$window
                        .localStorage
                        .setItem( "parentList", JSON.stringify(parentList) );
                    return;
                }

            });

    }

    update(){

        if ( !(this.settings.pageTitle) ) {

            console.log("PageTitle is Required !");
            return;

        }
        if( !!(this.settings.groupName) && !(this.settings.pageContent) ) {

            console.log("A Non-Group Page Most Have Page Content !");
            return;

        }

        this.docsApi
            .updatePage(this.pageId,{
                title: this.settings.pageTitle,
                groupId: this.settings.groupId,
                content: this.settings.pageContent
            })
            .then(data => {

                if(this.shouldDeleteParent)
                    return this.deleteParent(this.pageId);

                this.logger.success();
                this.$state.go("docs");
                console.log(data);

            })
            .catch(err => console.log(err));

    }

    deleteParent(id){

        return this.docsApi
            .deleteParent(id)
            .then(data => {
                this.logger.success();
                this.$state.go("docs");
                console.log(data);
            })
            .catch(err => console.log("" + err))
            .finally(() => {
                this.settings.groupId = null;
                this.settings.groupName = null;
            });

    }

}