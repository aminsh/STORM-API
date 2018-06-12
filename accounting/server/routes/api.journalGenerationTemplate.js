"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    JournalGenerationTemplateQuery = require('../queries/query.journalGenerationTemplate');

router.route('/:sourceType')
    .get(async((req, res) => {
        const journalGenerationTemplateQuery = new JournalGenerationTemplateQuery(req.branchId, req.user.id),
            result = await(journalGenerationTemplateQuery.getBySourceType(req.params.sourceType));

        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("journalTemplateCreate", [req.params.sourceType, req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;