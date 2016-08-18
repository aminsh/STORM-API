require('./utilities/string.prototypes.js');
require('./utilities/array.prototypes.js');

var config = require('./config/config');
var app = require('./config/express').app;
require('./config/routes');
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









