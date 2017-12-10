"use strict";

class OrderBl {

    isPlanUsed(planId) {
        let order = await(orderRepository.getByParam('planId', planId));
        if (order !== null && order !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    getAll(params) {
        var dbResult = await(orderRepository.getAll(params));
        var returnValue = [];


        if (dbResult.total == 0) {
            return undefined;
        } else {
            for (let i = 0; i < dbResult.data.length; i++) {

                var obj = dbResult.data[i];
                let a = {
                    'id': obj.id,
                    'branchId': obj.branchId,
                    'planId': obj.planId,
                    'paymentStatus': obj.paymentStatus,
                    'plan': null
                }

                if (obj.planId !== undefined && obj.planId !== null) {
                    let mPlan = planBl.getSingle(obj.planId)
                    a['plan'] = mPlan;
                }

                returnValue[i] = a
            }


            returnValue = {plan: returnValue};
            return returnValue;
        }

    }

    getSingle(order) {
        let orderId = order.id;
        let returnValue;

        let dbResult = await(orderRepository.getById(orderId))
        if (dbResult === undefined || dbResult === "") {
            return undefined;
        } else {
            returnValue = {
                'id': dbResult.id,
                'branchId': dbResult.branchId,
                'planId': dbResult.planId,
                'paymentStatus': dbResult.paymentStatus,
                'plan': null
            }

          /*  if(dbResult.gift !== undefined) {
                returnValue.gift = {
                    'id': dbResult.giftId,
                    'discountPrice': dbResult.discountPrice,
                    'discountPercentage': dbResult.discountPercentage,
                    'invoice': dbResult.giftInvoice,
                    'duration': dbResult.giftDuration
                }
            }*/

            returnValue = {plan: returnValue};
        }

        return returnValue;
    }

    createSingle(order) {
        let entity = {
            branchId: order.branchId,
            planId: order.planId
        };

        try {
            let res = await(orderRepository.create(entity));
            entity.id = res[0];
            return entity;
        } catch (e) {
            throw e;
        }

        return returnValue;
    }

    isExist(orderId) {
        let order = await(orderRepository.getById(orderId));
        if (order !== null && order !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    deleteSingle(orderId) {
        let returnValue;

        //delete
        returnValue = await(orderRepository.remove(orderId));

        return returnValue;

    }
}


const orderService = module.exports = new OrderBl();

const express = require('express'),
    enums = require('../../../../shared/enums'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    planBl = require('../plan/plan.bl'),
    orderRepository = require('./order.repository');