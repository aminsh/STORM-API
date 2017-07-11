"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    ProductRepository = require('../data/repository.product');

module.exports = class ProductDomain {
    constructor(branchId) {
        this.branchId = branchId;

        this.productRepository = new ProductRepository(branchId);
        this.findByIdOrCreate = async.result(this.findByIdOrCreate);
    }

    findByIdOrCreate(cmd) {
        if (!cmd)
            return null;

        let entity;

        if (cmd.id) {
            entity = await(this.productRepository.findById(cmd.id));

            if (entity) return entity;
        }


        if (cmd.referenceId) {
            entity = await(this.productRepository.findByReferenceId(cmd.referenceId));

            if (entity) return entity;
        }

        if (!cmd.title)
            return null;

        entity = {
            title: cmd.title,
            productType: cmd.productType,
            referenceId: cmd.referenceId
        };

        await(this.productRepository.create(entity));

        return entity;
    }
};