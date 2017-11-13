"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    ProductRepository = require('./data').ProductRepository;

class ProductService {
    constructor(branchId) {
        this.branchId = branchId;

        this.productRepository = new ProductRepository(branchId);
    }

    shouldTrackInventory(productId){
        return this.productRepository.isGood(productId);
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
}

module.exports = ProductService;