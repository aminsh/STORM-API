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
        const branchId = req.branchId,
            key = req.params.key;

        try {

            let userId = "4QhmRwHwwrgFqXULXNtx4d",
                isMember = await(rp({
                    uri: `${process.env.ORIGIN_URL}/v1/branches/${req.branchId}/users/${userId}/is-member`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': req.headers['x-access-token']
                    },
                }));

            if (!eval(isMember))
                await(rp({
                    uri: `${process.env.ORIGIN_URL}/v1/branches/${req.branchId}/users`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': req.headers['x-access-token']
                    },
                    json: {userId}
                }));

            let apiUser = await(rp({
                    uri: `${process.env.ORIGIN_URL}/v1/branches/${req.branchId}/users?${qs.stringify({take: 1,
                        filter: {
                            logic: 'and',
                            filters: [{field: 'userId', operator: 'eq', value: '4QhmRwHwwrgFqXULXNtx4d'}]
                        }
                    })}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': req.headers['x-access-token']
                    },
                })),
                apiToken = JSON.parse(apiUser).data[0].token;

            await(instanceOf('PaymentService', key).register(apiToken, req.body));
            res.sendStatus(200);
        }
        catch (e) {
            let message;

            if (e instanceof Error)
                message = e.message;
            else
                message = 'System error';

            res.status(500).send(message);
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