"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex');

router.route('/:code/:branchId/isValid')
    .get(async(function (req, res) {

        let userId = await(knex.select('ownerId').from('branches').where({id: req.params.branchId}).first()).ownerId,
            gift = await(knex.select('*').from('storm_gifts').where({code: req.params.code}).first());

        if (!gift)
            return res.send({isValid: false, message: 'کد تخفیف وارد شده وجود ندارد'});

        let now = Utility.PersianDate.current(),
            isInRange = now >= gift.minDate && now <= gift.maxDate;

        if (!isInRange)
            return res.send({isValid: false, message: 'کد تخفیف جاری در این تاریخ قابل استفاده نمیباشد'});

        let isUsedGift = await(
            knex.select('giftId').from('storm_orders')
                .leftJoin('branches', 'storm_orders.branchId', 'branches.id')
                .where('giftId', gift.id)
                .where('ownerId', userId)
                .first()
        );

        if (isUsedGift)
            return res.send({isValid: false, message: 'شما قبلا از این کد تخفیف استفاده کرده اید'});


        res.send({isValid: true, gift});
    }));

module.exports = router;


