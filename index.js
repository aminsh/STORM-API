require('./server/utilities/string.prototypes');
require('./server/utilities/array.prototypes');

var express = require('express');
var app = express();

var env = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
require('./server/config/routes')(app);
require('./server/config/translation');
require('./server/config/auth');

var models = require('./server/models');

models.sequelize.sync().then(function () {
    /*models.fiscalPeriod.max('id').then(function (maxId) {
     config.fiscalPeriodId
     })*/

    app.listen(config.port, function () {
        console.log('Port {0} is listening ...'.format(config.port));
    });


    var sub = require('./server/utilities/command.subscriber');
    sub.on('subscribe', function () {
        console.log('subscribe is waiting ...')
    });
    require('./server/commands/command.generalLedgerAccount.create');

});









