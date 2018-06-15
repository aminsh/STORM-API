"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex');

router.route('/')
    .post(async(function (req, res) {

        try {
            let result = req.container.get('StormOrderService').create(req.body);

            res.send(result);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.status(500);
        }

    }));

router.route('/:id')
    .get(async(function (req, res) {

        let id = req.params.id,
            order = get(id);

        res.send(order);

    }));

router.route('/:id/confirm')
    .post(async(function (req, res) {

        try {
            let result = req.container.get('StormOrderService').confirm(req.params.id);

            res.send(result);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.status(500);
        }

    }));

router.route('/:id/payment/callback')
    .get(async(function (req, res) {

        try {

            if (req.query.status !== 'fail')
                req.container.get('StormOrderService').setAsPaid(req.params.id);

            res.redirect(`${process.env.DASHBOARD_URL}/branch/order/${req.params.id}/payment-result?payment_status=${req.query.status}`);
        }
        catch (e) {
            if (e instanceof ValidationException)
                return res.status(400).send(e.errors);

            res.status(500);
        }

    }));

function get(id) {

    let stormBranchId = instanceOf('persistedConfig').get('STORM_BRANCH_ID').value,
        order = await(
            knex.select(
                'storm_orders.*',
                knex.raw('branches.name as "branchName"'),
                knex.raw('storm_plans.title as "planDisplay"'))
                .from('storm_orders')
                .leftJoin('branches', 'branches.id', 'storm_orders.branchId')
                .leftJoin('storm_plans', 'storm_orders.planId', 'storm_plans.id')
                .where('storm_orders.id', id).first()
        );

    order.issuedDate = Utility.PersianDate.getDate(order.issuedDate);

    if (order.invoiceId)
        order.invoiceUrl = `${process.env.DASHBOARD_URL}/invoice/${order.invoiceId}?branchId=${stormBranchId}`;

    return order;
}

module.exports = router;


