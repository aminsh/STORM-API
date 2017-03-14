"use strict";

const express = require('express'),
    router = express.Router();

router.route('/')
    .post(function (req, res) {
        let file = req.files[Object.keys(req.files)[0]];

        res.send({
            name: file.name,
            fullName: file.path
        });
    });


module.exports = router;
