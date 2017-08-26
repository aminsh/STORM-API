"use strict";

export default class ThirdPartyConstroller{

    constructor(branchThirdPartyApi){

        this.branchThirdPartyApi = branchThirdPartyApi;
        branchThirdPartyApi.get()
            .then((data) => this.thirdPartyList = data.returnValue);

    }

}