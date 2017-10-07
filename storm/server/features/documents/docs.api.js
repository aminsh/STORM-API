"use strict";

const express = require('express'),
    config = instanceOf('config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    superSecret = instanceOf('Crypto').superSecret,
    EventEmitter = instanceOf('EventEmitter'),
    render = instanceOf('htmlRender').renderFile,
    persianDate = instanceOf('utility').PersianDate,
    email = instanceOf('Email'),
    docsQuery = instanceOf('query.docs'),
    docsRepository = instanceOf('repository.docs');

router.route('/')
    .get(async((req, res) => {

        try {

            let list = await(docsRepository.getList());
            let tree = list
                         .asEnumerable()
                         .groupBy(
                             key => key.parentId || "root",
                             elem => { return { id: elem.id, title: elem.title } },
                             (key, elem) => {

                                 let arrayString = [];
                                 elem.forEach(item => arrayString.push(item));
                                 return JSON.parse(`{ "${key}" : ${JSON.stringify(arrayString)} }`);

                             }
                         )
                         .toObject(
                             key => Object.keys(key)[0],
                             elem => elem[Object.keys(elem)[0]]
                         );
            res.json({ isValid: true, returnValue: tree });

        } catch (err) {

            console.log(err);
            res.status(503).send("Service Unavailable");

        }

    }))
    .post(async((req, res) => {

        if (!req.isAuthenticated() || req.user.role !== "admin")
            res.status(403).send("Forbidden");

        try {

            let title = req.body.title,
                groupId = req.body.groupId,
                content = req.body.content;

            if (
                await(docsRepository.save({
                    title,
                    groupId,
                    content
                }))
            )
                res.json({ isValid: true });
            else
                res.status(400).send("Bad Request");

        } catch (err) {

            console.log(err);
            res.json({isValid: false, error: [err]});

        }

    }));

router.route('/parent')
    .get(async((req, res) => {

        try {

            let parentList = await(docsQuery.getParentList());
            res.json({ isValid: true, returnValue: parentList });

        } catch (err) {

            console.log(err);
            res.status(500).send("Internal Error");

        }

    }));

router.route('/parent/:id')
    .delete(async((req, res) => {

        if (!req.isAuthenticated() || req.user.role !== "admin")
            res.status(403).send("Forbidden");

        try {

            if ( await(docsRepository.deleteParent(req.params.id)) )
                return res.json({ isValid: true });
            return res.json({isValid: false});

        } catch (err) {

            console.log(err);
            res.status(400).send("Bad Request");

        }

    }));

router.route('/:id')
    .get(async((req, res) => {

        try {

            let pageId = req.params.id,
                page = await(docsQuery.getById(pageId));

            res.json({ isValid: true, returnValue: page });

        } catch (err) {

            console.log(err);
            res.status(400).send("Bad Request");

        }

    }))
    .put(async((req, res) => {

        if (!req.isAuthenticated() || req.user.role !== "admin")
            res.status(403).send("Forbidden");

        try {

            let pageId = req.params.id,
                newData = {
                    title: req.body.title,
                    groupId: req.body.groupId,
                    content: req.body.content
                };

            if(
                await(docsRepository.update(pageId, newData))
            )
                res.json({ isValid: true });
            else
                res.status(400).send("Bad Request");

        } catch (err) {

            console.log(err);
            res.status(400).send("Bad Request");

        }

    }))
    .delete(async((req, res) => {

        if (!req.isAuthenticated() || req.user.role !== "admin")
            res.status(403).send("Forbidden");

        try{

            let pageId = req.params.id;

            if( await(docsRepository.delete(pageId)) )
                res.json({ isValid: true });
            else
                res.status(400).send("Bad Request");

        } catch(err) {

            console.log(err);
            res.status(400).send("Bad Request");

        }

    }));



module.exports = router;