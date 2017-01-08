var config = require('../config'),
    app = require('../config/config.express').app;

require('../config/config.route');

module.exports = ()=> {
    app.listen(config.port, ()=> console.log('Port {0} is listening ...'.format(config.port)));
};