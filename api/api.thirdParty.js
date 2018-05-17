"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    qs = require('qs'),
    rp = require('request-promise'),
    knex = instanceOf('knex'),
    Enums = instanceOf('Enums');


router.route('/')
    .get(async((req, res) => {

        let branchId = req.branchId;

        let allThirdParties = Enums.ThirdParty().data,
            allSelectedThirdParties = await(knex.from('branchThirdParty')
                .where('branchId', branchId)),

            result = allThirdParties
                .asEnumerable()
                .groupJoin(
                    allSelectedThirdParties,
                    all => all.key,
                    selected => selected.key,
                    (all, items) => ({
                        key: all.key,
                        display: all.data.display,
                        title: all.data.title,
                        logo: all.data.logo,
                        description: all.data.description,
                        website: all.data.website,
                        isActivated: items.any()
                    })
                )
                .toArray();

        res.json(result);

    }))
    .post(async(function (req, res) {
        let branchId = req.branchId,
            DTO = req.body,
            json = JSON.stringify(DTO.data);

        await(knex('branchThirdParty').insert({key: DTO.key, data: json, branchId}));

        res.sendStatus(200);
    }));

router.route('/:key')
    .get(async((req, res) => {
        const branchId = req.branchId,
            result = await(
                knex.from('branchThirdParty')
                    .where('key', key)
                    .where('branchId', branchId)
                    .first()
            );

        res.json(result);
    }))
    .post(async((req, res) => {

        try {
            const id = req.container.get("CommandBus").send('registerThirdParty', [req.params.key, req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }))
    .delete(async((req, res) => {

        let branchId = req.branchId,
            key = req.params.key;

        try {

            await(
                knex('branchThirdParty')
                    .where('key', key)
                    .where('branchId', branchId)
                    .del()
            );

            return res.sendStatus(200);

        } catch (err) {

            console.log(err);
            res.sendStatus(500);

        }

    }));

module.exports = router;