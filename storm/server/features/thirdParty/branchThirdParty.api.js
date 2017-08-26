"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    branchThirdPartyRepository = instanceOf('branchThirdParty.repository'),
    branchThirdPartyQuery = instanceOf('branchThirdParty.query');

router.route('/')
    .get(async((req, res) => {

        let branchId,
            thirdPartyList;

        try{

            branchId = req.cookies['branch-id'];

        } catch(err) {

            console.log(err);
            return res.json({isValid: false, error: ["Please enter to a branch"]});

        }

        try{

           thirdPartyList = await(branchThirdPartyQuery.getSelected(branchId));

        } catch(err) {

            console.log(err);
            return res.json({isValid: false, error: ["Your branch ID is wrong"]});

        }

        return res.json({isValid: true, returnValue: thirdPartyList});

    }));

router.route('/:key')
    .get(async((req, res) => {
        const branchId = req.cookies['branch-id'],
            entity = await(branchThirdPartyRepository.get(branchId, req.params.key));

        res.json(entity);
    }))
    .post(async((req, res) => {
        const branchId = req.cookies['branch-id'],
            key = req.params.key;

        await(instanceOf('PaymentService', key).register(branchId, req.body));

        res.json({isValid: true});
    }));

module.exports = router;