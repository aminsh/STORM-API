"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DetailAccountRepository = require('../data/repository.detailAccount');

class DetailAccountDomain {
    constructor(branchId) {
        this.branchId = branchId;

        this.detailAccountRepository = new DetailAccountRepository(branchId);
        this.findPersonByIdOrCreate = async.result(this.findPersonByIdOrCreate);
    }

    findPersonByIdOrCreate(cmd) {
        if (!cmd)
            return null;

        let entity;

        if (cmd.id) {
            entity = await(this.detailAccountRepository.findById(cmd.id));

            if (entity) return entity;
        }


        if (cmd.referenceId) {
            entity = await(this.detailAccountRepository.findByReferenceId(cmd.referenceId));

            if (entity) return entity;
        }

        if (!cmd.title)
            return null;

        entity = {
            title: cmd.title,
            referenceId: cmd.referenceId
        };

        await(this.detailAccountRepository.create(entity));

        return entity;
    }

    create(title, type) {
        const entity = {
            title,
            detailAccountType: type
        };

        await(this.detailAccountRepository.create(entity));

        return entity.id;
    }
};

module.exports = DetailAccountDomain;