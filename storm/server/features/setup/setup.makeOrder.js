"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    moment = require('moment-jalaali'),
    OrderRepository = require('../../../../accounting/server/data/repository.order'),
    PlanQeury = require('../../../../accounting/server/queries/query.plan');

module.exports = async.result(function (branchId) {
    let orderRepository = new OrderRepository(branchId),
        planQuery = new PlanQeury(branchId);
        
    let freePlan = await(planQuery.getFreePlan());
    let expire = moment().add(freePlan.duration, 'days').format('YYYY-MM-DD');


    return orderRepository.create({
        planId: freePlan.id,
        amount: freePlan.cost,
        discount: freePlan.gift.discountPercent * freePlan.cost / 100, // Calculate discount amount (in this case is 0)
        vat: 0,
        expire_at: expire
    });
});