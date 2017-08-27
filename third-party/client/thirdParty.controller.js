"use strict";

export default class ThirdPartyController{

    constructor($state
                ,branchThirdPartyApi
                ,logger
                ,confirm
                ,translate
                ,promise){

        this.$state = $state;
        this.branchThirdPartyApi = branchThirdPartyApi;
        this.logger = logger;
        this.confirm = confirm;
        this.translate = translate;
        this.promise = promise;
        this.thirdPartyList = null;
        this.listRefresh();

    }

    listRefresh(){

        this.branchThirdPartyApi.get()
            .then((data) => this.thirdPartyList = data.returnValue);

    }

    toggleThirdParty(key, isActivated) {

        (function(isActivated,
                  key,
                  promise,
                  confirm,
                  translate,
                  branchThirdPartyApi,
                  logger,
                  $state){

            return promise.create((resolve, reject) => {
                if (isActivated){ // DeActive It
                    confirm(
                        translate('Are you sure ?'),
                        translate('Remove Person')
                    )
                        .then(() => {

                            branchThirdPartyApi.delete(key)
                                .then(() => {
                                    logger.success();
                                    resolve();
                                })
                                .catch((err) => {
                                    reject();
                                    console.log(err);
                                    logger.error(translate("A system error occurred"));
                                });

                        });
                } else { // Active It
                    $state.go(key);
                    resolve();
                }
            });

        }(
            isActivated,
            key,
            this.promise,
            this.confirm,
            this.translate,
            this.branchThirdPartyApi,
            this.logger,
            this.$state
        )).finally(() => this.listRefresh());

    }

}