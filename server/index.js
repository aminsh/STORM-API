require('./utilities/string.prototypes.js');
require('./utilities/array.prototypes.js');

var config = require('./config/config');
var app = require('./config/express').app;
require('./config/routes');
require('./config/translation');
require('./config/auth');

function initServer() {
    app.listen(config.port, function () {
        console.log('Port {0} is listening ...'.format(config.port));
    });
}

var db = require('./models/index');

db.sequelize.sync().then(function () {
    initServer();
});










