require('./utilities/string.prototypes.js');
require('./utilities/array.prototypes.js');

var express = require('express');
var app = express();

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

require('./config/express')(app, config);
require('./config/routes')(app);
require('./config/translation');
require('./config/auth');

var sub = require('./services/command.subscriber.js');
sub.on('subscribe', function () {
    console.log('subscribe is waiting ...')
});
require('./commands').registerAll();

var models = require('./models/index');

models.sequelize.sync().then(function () {
    app.listen(config.port, function () {
        console.log('Port {0} is listening ...'.format(config.port));
    });
});









