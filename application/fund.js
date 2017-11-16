"use strict";

const DetailAccountService = require('./detailAccount');

class Fund {
    constructor(branchId) {
        this.branchId = branchId;
        this.detailAccountService = new DetailAccountService(branchId);
    }

    create(cmd){
        cmd.detailAccountType = 'fund';

        return this.detailAccountService.create(cmd);
    }

    update(id , cmd){
        this.detailAccountService.update(id, cmd);
    }

    remove(id){

        this.detailAccountService.remove(id);
    }
}

module.exports = Fund;