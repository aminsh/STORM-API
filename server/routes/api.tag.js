var express = require('express');
var router = express.Router();
var tagRouteHandler = require('../route.handlers/tag');

router.route('/tags').get(tagRouteHandler.getAll)

module.exports = router;
