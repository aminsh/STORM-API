"use strict";

export default class AddDocController{

    constructor($window, $state, docsApi, LxNotificationService, logger){

        this.$window = $window;
        this.$state = $state;
        // tabs.setTab("docs");
        this.docsApi = docsApi;
        this.LxNotificationService = LxNotificationService;
        this.logger = logger;
        this.parentList = [];
        this.hasParent = false;
        this.settings = {
            pageTitle: "",
            groupName: "",
            pageContent: ""
        };
        this.onSelectGroupName = value => {
            LxNotificationService.info(`"${value}" Selected`);
            this.settings.groupName = value;
        };
        this.groupAutoComplete = (_newValue, _cb, _errCb) => {

            if (_newValue) {

                try{

                    let foundItems = [];

                    JSON.parse( $window.localStorage.getItem("parentList") )
                        .map(item => {
                            if (item.title.toLowerCase().search(_newValue.toLowerCase()) !== -1) {
                                foundItems.push(item.title);
                            }
                        });

                    _cb(foundItems);

                } catch(err) {

                    _errCb("Error");
                    console.log(err);

                }

            } else {
                _cb(
                    JSON.parse(
                        $window.localStorage.getItem("parentList")
                    )
                );
            }

        };

        this.updateParentList();

    }

    updateParentList(){

        return this.docsApi
            .getParentList()
            .then(data => {

                this.$window
                    .localStorage
                    .setItem(
                        "parentList"
                        , JSON.stringify(data.returnValue)
                    );
                this.parentList = data.returnValue;

            })
            .catch((err) => console.log(err));

    }

    save() {

        if ( !(this.settings.pageTitle) ) {

            console.log("PageTitle is Required !");
            return;

        }
        if( !!(this.settings.groupName) && !(this.settings.pageContent) ) {

            console.log("A Non-Group Page Most Have Page Content !");
            return;

        }

        let groupId = "",
            parentList = JSON.parse( this.$window.localStorage.getItem("parentList") );

        for(let i=0; i<parentList.length; i++){
            if(parentList[i].title === this.settings.groupName){
                groupId = parentList[i].id;
                break;
            }
        }

        this.docsApi
            .savePage({
                title: this.settings.pageTitle,
                groupId: (this.hasParent) ? groupId:"",
                content: this.settings.pageContent
            })
            .then(data => {

                console.log(data);
                this.logger.success();
                this.$state.go("docs");

            })
            .catch(err => console.log(err));

    };

}