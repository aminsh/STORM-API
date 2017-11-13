"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DetailAccountRepository = require('./data').DetailAccountRepository;

class DetailAccount {
    constructor(branchId) {
        this.branchId = branchId;

        this.detailAccountRepository = new DetailAccountRepository(branchId);
    }

    findPersonByIdOrCreate(cmd) {
        if (!cmd)
            return null;

        let entity;

        if (cmd.id) {
            entity = this.detailAccountRepository.findById(cmd.id);

            if (entity) return entity;
        }


        if (cmd.referenceId) {
            entity = this.detailAccountRepository.findByReferenceId(cmd.referenceId);

            if (entity) return entity;
        }

        if (!cmd.title)
            return null;

        const id  = this.create(cmd.title, cmd.referenceId, 'person');

        return {id};
    }

    create(title,referenceId, type) {
        const entity = {
            title,
            referenceId,
            detailAccountType: type
        };

        this.detailAccountRepository.create(entity);

        return entity.id;
    }
}

module.exports = DetailAccount;