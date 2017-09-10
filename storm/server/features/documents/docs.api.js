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

        let list = await(docsRepository.getList());
        let tree = list
                      .asEnumerable()
                      .groupBy(
                          key => key.parentId || "root",
                          elem => { return { id: elem.id, title: elem.title } },
                          (key, elem) => {

                              let arrayString = ``;
                              elem.forEach(item => {
                                  arrayString += `{ "id": "${item.id}", "title": "${item.title}" },`;
                              });
                              arrayString = arrayString.slice(0, arrayString.length - 1);
                              return JSON.parse(`{ "${key}" : [${arrayString}] }`);

                          }
                      )
                      .toObject(key => Object.keys(key)[0], elem => elem[Object.keys(elem)[0]]);
        res.send({isValid: true, returnValue: tree});

    }))
    .post(async((req, res) => {

        if (!req.isAuthenticated() || req.user.role !== "admin")
            res.send({isValid: false});

        try{

            let title = req.body.title,
                groupId = req.body.groupId,
                content = req.body.content;

            if(
                await(docsRepository.save({
                    title,
                    groupId,
                    content}))
                )
                res.send({isValid: true});
            else
                res.send({isValid: false, error: ["Something is wrong !"]});

        } catch(err) {

            console.log(err);
            res.send({isValid: false, error: [err]});

        }

    }));

router.route('/parent')
    .get(async((req, res) => {

        try{

            let parentList = await(docsQuery.getParentList());
            res.send({isValid: true, returnValue: parentList});

        } catch(err) {

            console.log(err);

        }


    }));

module.exports = router;