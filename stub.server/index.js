require('./utility/string.prototypes');
require('./utility/array.prototypes');

var app = require('./config/express').app;
require('./config/routes');

app.listen(config.port, function () {
    console.log('Port {0} is listening ...'.format(config.port));
});





