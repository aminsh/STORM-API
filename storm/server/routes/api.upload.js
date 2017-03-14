var express = require('express'),
    router = express.Router();

router.route('/upload')
    .post(function (req, res) {
        var file = req.files.userfile;

        res.send({
            name: file.name,
            fullName: file.path
        });
    });

module.exports = router;


