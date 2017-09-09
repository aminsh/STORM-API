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
            }
        ];

    }
    setTab(stateName){

        this.$rootScope.tabNum = 0;
        for(let i=0; i<this.$rootScope.tabs.length; i++, this.$rootScope.tabNum++){
            if(this.$state.current.name === this.$rootScope.tabs[i].state) break;
        }

    }

}