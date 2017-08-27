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

        if(!(req.cookies['branch-id']))
            return res.status(400).send("Sorry, You have no branch id !");

        branchId = req.cookies['branch-id'];

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

        try {
            await(instanceOf('PaymentService', key).register(branchId, req.body));
            res.json({isValid: true});
        }
        catch (e) {
            let message;

            if (e instanceof Error)
                message = e.message;
            else
                message = 'System error';

            res.json({isValid: false, errors: [message]});
        }

    }))
    .delete(async((req, res) => {

        let branchId = req.cookies['branch-id'],
            key = req.params.key;

        if(!(branchId))
            return res.status(400).send("Sorry, You have no branch id !");

        try{

            await(branchThirdPartyRepository.remove(branchId, key));
            return res.json({isValid: true});

        } catch(err) {

            console.log(err);
            res.json({isValid: false, error: ["The Branch ID or The Third-party key is wrong"]});

        }

    }));

module.exports = router;