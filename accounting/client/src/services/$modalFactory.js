"use strict";

export default class $ModelFactory {
    constructor($state, $uibModal) {
        this.$state = $state;
        this.$uibModal = $uibModal;
    }

    get defaultConfig() {
        return {
            animation: true,
            templateUrl: '',
            controller: '',
            backdrop: true,
            keyboard: false,
            //size: normal, // nothing = normal , 'sm' = small , 'lg' = large
            /*resolve: {
             data: function () {
             return option.data;
             }
             }*/
        }
    }

    get defaultResolver() {
        return () => this.$state.go('^')
    }

    create(options, resolver) {
        this.$uibModal.open(Object.assign(this.defaultConfig, options))
            .result.finally(resolver || this.defaultResolver);
    }
}