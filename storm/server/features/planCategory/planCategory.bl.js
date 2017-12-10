"use strict";

const express = require('express'),
    enums = require('../../../../shared/enums'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    planBl = require('../plan/plan.bl'),
    mRepository = require('./planCategory.repository');

class PlanCategoryBl {


    getAll(params) {
        let dbResult = await(mRepository.getAll(params))
        var returnValue = [];

        if (dbResult.total == 0) {
            return undefined;
        } else {
            for (let i = 0; i < dbResult.data.length; i++) {

                var obj = dbResult.data[i];
                let a = {
                    'id': obj.id,
                    'orderNumber': obj.orderNumber,
                    'title': obj.title,
                    'description': obj.description,
                    'isArchived': obj.isArchived
                }

                returnValue[i] = a
            }

            returnValue = {planCategories: returnValue, total: dbResult.total};
            return returnValue;
        }

    }

    getWithDetail(params) {
        let dbResult = await(mRepository.getAll(params))
        var returnValue = [];

        if (dbResult.total === 0) {
            return undefined;
        } else {
            for (let i = 0; i < dbResult.data.length; i++) {

                var obj = dbResult.data[i];
                let a = {
                    'id': obj.id,
                    'orderNumber': obj.orderNumber,
                    'title': obj.title,
                    'description': obj.description,
                    'isArchived': obj.isArchived,
                    'plans': null
                }

                let b = await(planBl.getWithPlanCategoryId(obj.id));
                if(b !== undefined)
                    a['plans'] = b;

                returnValue[i] = a
            }

            returnValue = {planCategories: returnValue};
            return returnValue;
        }

    }


    getSingle(item) {
        let returnValue;

        returnValue = await(mRepository.getById(item.id));
        if (returnValue === undefined || returnValue === "") {
            return undefined;
        } else {
            returnValue = {
                'id': returnValue.id,
                'orderNumber': returnValue.orderNumber,
                'title': returnValue.title,
                'description': returnValue.description,
                'isArchived': returnValue.isArchived
            }

            returnValue = {planCategory: returnValue};
        }

        return returnValue;
    }

    createSingle(planCategory) {
        if (!planCategory.title)
            throw new ValidationException("no title find");

        let entity = {
            title: planCategory.title,
            description: planCategory.description,
            isArchived: planCategory.isArchived,
            orderNumber: planCategory.orderNumber,
            id: null
        };

        try {
            let res = await(mRepository.create(entity));
            entity.id = res[0];
            return entity;
        } catch (e) {
            throw e;
        }
    }

    deleteSingle(planCategoryId) {
        let returnValue;

        //is planCategory used in plans?
        if (await(planBl.isPlanCategoryUsed(planCategoryId))) {
            throw new ValidationException("planCategory is used in plan");
        }

        //delete
        returnValue = await(mRepository.remove(planCategoryId));

        return returnValue;

    }

    isExist(planCategoryId) {
        let planCategory = await(mRepository.getById(planCategoryId));
        if (planCategory !== null && planCategory !== undefined) {
            return true;
        } else {
            return false;
        }
    }

}


module.exports = new PlanCategoryBl();