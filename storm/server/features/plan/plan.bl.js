"use strict";

const express = require('express'),
    enums = require('../../../../shared/enums'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    orderBl = require('../order/order.bl'),
    planRepository = require('./plan.repository');

class PlanBl {

    getAll(params) {
        var dbResult = await(planRepository.get(params));
        var returnValue = [];


        if (dbResult.total == 0) {
            return undefined;
        } else {
            for (let i = 0; i < dbResult.data.length; i++) {

                var obj = dbResult.data[i];
                let a = {
                    'id': obj.id,
                    'title': obj.title,
                    'description': obj.description,
                    'duration': obj.duration,
                    'durationStatus': obj.durationStatus,
                    'invoice': obj.invoice,
                    'invoiceStatus': obj.invoiceStatus,
                    'price': obj.price,
                    'reusableCount': obj.reusableCount,
                    'reusableStatus': obj.reusableStatus,
                    'planCategoryId': obj.planCategoryId,
                    'isArchived': obj.isArchived,
                    'gift': null
                }

                if (obj.giftId !== undefined && obj.giftId !== null) {
                    a['gift'] = {
                        'id': obj.giftId,
                        'discountPrice': obj.discountPrice,
                        'discountPercentage': obj.discountPercentage,
                        'invoice': obj.invoice,
                        'duration': obj.duration
                    }
                }

                returnValue[i] = a
            }


            returnValue = {plan: returnValue};
            return returnValue;
        }

    }

    getSingle(planId) {
        let returnValue;

        let dbResult = await(planRepository.getById(planId))
        if (dbResult === undefined || dbResult === "") {
            return undefined;
        } else {
            returnValue = {
                'id': dbResult.id,
                'title': dbResult.title,
                'description': dbResult.description,
                'duration': dbResult.duration,
                'durationStatus': dbResult.durationStatus,
                'invoice': dbResult.invoice,
                'invoiceStatus': dbResult.invoiceStatus,
                'price': dbResult.price,
                'reusableCount': dbResult.reusableCount,
                'reusableStatus': dbResult.reusableStatus,
                'isArchived': dbResult.isArchived,
                'gift': null
            }

            if(dbResult.gift !== undefined) {
                returnValue.gift = {
                    'id': dbResult.giftId,
                    'discountPrice': dbResult.discountPrice,
                    'discountPercentage': dbResult.discountPercentage,
                    'invoice': dbResult.giftInvoice,
                    'duration': dbResult.giftDuration
                }
            }

            returnValue = {plan: returnValue};
        }

        return returnValue;
    }

    getWithPlanCategoryId(planCategoryId) {
        let returnValue = [];

        let dbResult = await(planRepository.getListByParam('planCategoryId', planCategoryId))
        if (dbResult === undefined || dbResult === "") {
            return undefined;
        } else {
            for (let i = 0; i < dbResult.length; i++) {
                let item = dbResult[i];
                let obj = {
                    'id': item.id,
                    'title': item.title,
                    'description': item.description,
                    'duration': item.duration,
                    'durationStatus': item.durationStatus,
                    'invoice': item.invoice,
                    'invoiceStatus': item.invoiceStatus,
                    'price': item.price,
                    'reusableCount': item.reusableCount,
                    'reusableStatus': item.reusableStatus,
                    'isArchived': item.isArchived,
                    'gift': null
                }

                if (item.gift !== undefined) {
                    obj.gift = {
                        'id': item.giftId,
                        'discountPrice': item.discountPrice,
                        'discountPercentage': item.discountPercentage,
                        'invoice': item.giftInvoice,
                        'duration': item.giftDuration
                    }
                }

                returnValue[i] = obj;
            }


            returnValue = returnValue;
        }

        return returnValue;
    }

    createSingle(plan) {
        let entity = {
            title: plan.title,
            description: plan.description,
            duration: plan.duration,
            durationStatus: plan.durationStatus,
            invoice: plan.invoice,
            invoiceStatus: plan.invoiceStatus,
            price: plan.price,
            reusableCount: plan.reusableCount,
            reusableStatus: plan.reusableStatus,
            isArchived: plan.isArchived,
            planCategoryId: plan.planCategoryId,
            giftId: plan.giftId
        };

        try {
            let res = await(planRepository.create(entity));
            entity.id = res[0];
            return entity;
        } catch (e) {
            throw e;
        }

    }

    deleteSingle(planId) {
        let returnValue;

        //is plan used in orders?
        if (await(orderBl.isPlanUsed(planId))) {
            throw new ValidationException("plan used in order")
        }


        //delete
        returnValue = await(planRepository.remove(planId));

        return returnValue;

    }

    isGiftUsedInPlan(giftId) {
        let plan = await(planRepository.getByParam('giftId', giftId));
        if (plan !== null && plan !== undefined) {
            return true;
        } else {
            return false;
        }

    }


    editSingle(planId, plan) {
        let returnValue;

        //id inserted in body?
        if (planId === undefined) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('InputDataNotFound')};
            return returnValue;
        }

        //is exist?
        if (!this.isExist(planId)) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('NoRecordFound')};
            return returnValue;
        }

        //is plan used in orders?
        if (orderBl.isPlanUsed(planId)) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('RecordIsUsed')};
            return returnValue;
        }


        let entity = {
            duration: plan.duration,
            durationStatus: plan.durationStatus,
            invoiceConstraint: plan.invoiceConstraint,
            invoiceConstraintStatus: plan.invoiceConstraintStatus,
            price: plan.price,
            validCount: plan.validCount,
            validCountStatus: plan.validCountStatus,
            giftId: plan.giftId
        };

        try {
            let res = await(planRepository.update(planId, entity));
            returnValue = {isValid: true, plan: res}
        }
        catch (e) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('EditError')};
        }

        return returnValue;
    }

    archive(planId, archiveStatus) {
        let returnValue;

        //id inserted in body?
        if (planId === undefined) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('InputDataNotFound')};
            return returnValue;
        }

        //is exist?
        if (!this.isExist(planId)) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('NoRecordFound')};
            return returnValue;
        }

        let entity = {
            isArchived: archiveStatus
        };

        try {
            let res = await(planRepository.update(planId, entity));
            returnValue = {isValid: true, plan: res}
        }
        catch (e) {
            returnValue = {isValid: false, errorCode: enums.ErrorCode().getKey('EditError')};
        }

        return returnValue;
    }

    isExist(planId) {
        let plan = await(planRepository.getById(planId));
        if (plan !== null && plan !== undefined) {
            return true;
        } else {
            return false;
        }
    }


    isPlanCategoryUsed(planCategoryId) {
        let plan = await(planRepository.getByParam('planCategoryId', planCategoryId));
        if (plan !== null && plan !== undefined) {
            return true;
        } else {
            return false;
        }

    }

}

module.exports = new PlanBl();
