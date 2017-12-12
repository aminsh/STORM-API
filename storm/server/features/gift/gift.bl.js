"use strict";

const express = require('express'),
    enums = require ('../../../../shared/enums'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    planBl = require('../plan/plan.bl'),
    mRepository = require('./gift.repository');

class PlanBl {

    getAll(params) {
        let returnValue = await(mRepository.get(params))
        if (!returnValue) {
            returnValue = {
                'id': returnValue.id,
                'title': returnValue.title,
                'description': returnValue.description,
                'invoice': returnValue.invoice,
                'duration': returnValue.duration,
                'discountPrice': returnValue.discountPrice,
                'discountPercentage': returnValue.discountPercentage,
                'giftKey': returnValue.giftKey,
                'reusableCount': returnValue.reusableCount,
                'reusableStatus': returnValue.reusableStatus,
                'startDate': returnValue.startDate,
                'endDate': returnValue.endDate,
                'dateStatus': returnValue.dateStatus,
                'isArchived': returnValue.isArchived

            }
        }
        return returnValue;
    }
    getSingle(item) {
        let returnValue;

        returnValue = await(mRepository.getById(item.id));
        if (returnValue === undefined || returnValue === "") {
            return undefined;
        } else {
            returnValue = {
                'id': returnValue.id,
                'title': returnValue.title,
                'description': returnValue.description,
                'invoice': returnValue.invoice,
                'duration': returnValue.duration,
                'discountPrice': returnValue.discountPrice,
                'discountPercentage': returnValue.discountPercentage,
                'giftKey': returnValue.giftKey,
                'reusableCount': returnValue.reusableCount,
                'reusableStatus': returnValue.reusableStatus,
                'startDate': returnValue.startDate,
                'endDate': returnValue.endDate,
                'dateStatus': returnValue.dateStatus,
                'isArchived': returnValue.isArchived
            }

            returnValue = {gift: returnValue};
        }

        return returnValue;
    }
    createSingle(gift) {
        let entity = {
            title: gift.title,
            description: gift.description,
            invoice: gift.invoice,
            duration: gift.duration,
            discountPrice: gift.discountPrice,
            discountPercentage: gift.discountPercentage,
            giftKey: gift.giftKey,
            reusableCount: gift.reusableCount,
            reusableStatus: gift.reusableStatus,
            startDate: gift.startDate,
            endDate: gift.endDate,
            dateStatus: gift.dateStatus,
            isArchived: gift.isArchived,
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
    deleteSingle(giftId) {
        let returnValue;

        //is planCategory used in plans?
        if (await(planBl.isGiftUsedInPlan(giftId))) {
            throw new ValidationException("planCategory is used in plan");
        }

        //delete
        returnValue = await(mRepository.remove(giftId));

        return returnValue;

    }
    editSingle(giftId, gift) {
        let returnValue;

        //id inserted in body?
        if(giftId === undefined) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('InputDataNotFound')};
            return returnValue;
        }

        //is exist?
        if(!this.isExist(giftId)) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('NoRecordFound')};
            return returnValue;
        }

        //is gift used in orders?
        if(await(planBl.isGiftUsedInPlan(giftId))) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('RecordIsUsed')};
            return returnValue;
        }


        let entity = {
            invoiceCount: gift.invoiceCount,
            invoiceDiscount: gift.invoiceDiscount,
            price: gift.price,
            discount: gift.discount,
            isArchived: gift.isArchived,
            branchId: gift.branchId
        };

        try {
            let res = await(mRepository.update(giftId, entity));
            returnValue = {isValid: true, gift: res}
        }
        catch (e) {
            returnValue  = {isValid: false, errorCode: enums.ErrorCode().getKey('EditError')};
        }

        return returnValue;
    }
    archive(giftId, archiveStatus) {
        let returnValue;

        //id inserted in body?
        if(giftId === undefined) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('InputDataNotFound')};
            return returnValue;
        }

        //is exist?
        if(!this.isExist(giftId)) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('NoRecordFound')};
            return returnValue;
        }

        let entity = {
            isArchived: archiveStatus
        };

        try {
            let res = await(mRepository.update(giftId, entity));
            returnValue = {isValid: true, gift: res}
        }
        catch (e) {
            returnValue  = {isValid: false, errorCode: enums.ErrorCode().getKey('EditError')};
        }

        return returnValue;
    }
    isExist(giftId) {
        let gift = await(mRepository.getById(giftId));
        if (gift !== null && gift !== undefined) {
            return true;
        } else {
            return false;
        }
    }
}



module.exports = new PlanBl ();