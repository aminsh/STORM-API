var renderService = require('../../../shared/services/ejsRenderService');
var _ = require('lodash');
var pdf = require('html-pdf');
var pdfOptions = require('../config/pdf.config');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

function pdfService(fileName, data, options, req, res) {

    pdfOptions.header.contents = await(renderService.renderFile('header.default.ejs',
        {reportTitle: options.reportTitle}));
    pdfOptions.footer.contents = await(renderService.renderFile('footer.default.ejs', {
        user: req.user
    }));

    var html = await(renderService.renderFile(fileName, data));

    var options = _.assign(pdfOptions, options);

    pdf.create(html, options).toStream(function (err, stream) {
        if (err) {
            res.send('Occurs error on creating pdf ...');
            return console.log(err);
        }

        stream.pipe(res);
    });
}

module.exports = async(pdfService);
