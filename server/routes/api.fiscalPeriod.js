"use strict";

var router = require('../services/routeService').Router(),
    translateService = require('../services/translateService'),
    view = require('../viewModel.assemblers/view.fiscalPeriod'),
    await = require('asyncawait/await');
;

router.route({
    method: 'GET',
    path: '/fiscal-periods',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var query = knex.select().from(function () {
            this.select(knex.raw('*,\'{0} \' || "minDate" || \' {1} \' || "maxDate" as "display"'
                .format(translateService('From'), translateService('To'))))
                .from('fiscalPeriods')
                .as('baseFiscalPeriod');
        });

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/fiscal-periods/current',
    handler: (req, res, knex)=> {
        knex.select().from(function () {
                this.select(knex.raw('*,\'{0} \' || "minDate" || \' {1} \' || "maxDate" as "display"'
                    .format(translateService('From'), translateService('To'))))
                    .from('fiscalPeriods')
                    .as('baseFiscalPeriod')
                    .where('id', req.cookies['current-period']);
            })
            .then(result => res.json(view(result[0])));
    }
});

router.route({
    method: 'POST',
    path: '/fiscal-periods',
    handler: (req, res, fiscalPeriodRepository)=> {
        let cmd = req.body,
            entity = await(fiscalPeriodRepository.create(cmd));

        cmd.isClosed = false;

        res.json({
            isValid: true,
            returnValue: {
                id: entity.id,
                display: `${translateService('From')} ${entity.minDate} ${translateService('To')} ${entity.maxDate}`
            }
        });

    }
});

module.exports = router.routes;
