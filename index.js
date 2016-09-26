require('./server/utilities/string.prototypes.js');
require('./server/utilities/array.prototypes.js');

var config = require('./server/config/config');
var app = require('./server/config/express').app;
require('./server/config/routes');
require('./server/config/translation');
require('./server/config/auth');

function initServer() {
    app.listen(config.port, function () {
        console.log('Port {0} is listening ...'.format(config.port));
    });
}

var db = require('./server/models/index');

db.sequelize.sync().then(function () {
    initServer();
});










