"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    branchThirdPartyRepository = instanceOf('branchThirdParty.repository');

router.route('/:key')
    .get(async((req, res) => {
        const branchId = req.cookies['branch-id'],
            entity = await(branchThirdPartyRepository.get(branchId, req.params.key));

        res.json(entity);
    }))
    .post(async((req, res) => {
        const branchId = req.cookies['branch-id'],
            key = req.params.key;

        try {
            await(instanceOf('PaymentService', key).register(branchId, req.body));
            res.json({isValid: true});
        }
        catch (e) {
            let message;

            if (e instanceof Error)
                message = e.message;
            else
                message = 'خطای سیستمی';

            res.json({isValid: false, errors: [message]});
        }

    }));

module.exports = router;