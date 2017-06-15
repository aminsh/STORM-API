"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllPeople(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                address: cmd.address,
                postalCode: cmd.postalCode,
                province: cmd.province,
                city: cmd.city,
                phone: cmd.phone,
                nationalCode: cmd.nationalCode,
                registrationNumber: cmd.registrationNumber,
                email: cmd.email,
                personType: cmd.personType,
                detailAccountType: 'person',
                economicCode: cmd.economicCode
            };

        await(detailAccountRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});

    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            cmd = req.body,
            entity = await(detailAccountRepository.findById(req.params.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.address = cmd.address;
        entity.postalCode = cmd.postalCode;
        entity.province = cmd.province;
        entity.city = cmd.city;
        entity.phone = cmd.phone;
        entity.nationalCode = cmd.nationalCode;
        entity.registrationNumber = cmd.registrationNumber;
        entity.email = cmd.email;
        entity.personType = cmd.personType;
        entity.economicCode = cmd.economicCode;

        await(detailAccountRepository.update(entity));

        res.json({isValid: true});
    }));


module.exports = router;