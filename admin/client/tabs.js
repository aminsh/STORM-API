"use strict";

export default class Tabs{

    constructor($rootScope, $state){

        this.$rootScope = $rootScope;
        this.$state = $state;

        this.$rootScope.tabs = [
            {
                label: "Home",
                icon: "home",
                state: "home"
            },
            {
                label: "Users",
                icon: "account",
                state: "users"
            },
            {
                label: "Branches",
                icon: "briefcase",
                state: "branches"
            },
            {
                label: "Documents",
                icon: "book-open-page-variant",
                state: "docs"
            },
            {
                label: "Application logger",
                icon: "",
                state: "logger"
            }
        ];

    }
    setTab(stateName){

        this.$rootScope.tabNum = 0;
        for(let i=0; i<this.$rootScope.tabs.length; i++, this.$rootScope.tabNum++){
            if(stateName === this.$rootScope.tabs[i].state) break;
        }

    }

}