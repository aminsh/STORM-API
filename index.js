"use strict";

require('./utilities/string.prototypes.js');
require('./utilities/array.prototypes.js');
require('./utilities/function.prototypes.js');

const config = require('./storm/server/config'),
    lucaApp = require('./luca/server/config/config.express'),
    app = require('./storm/server/config/express').app;

app.use('/luca', lucaApp);

require('./storm');
require('./luca');

app.listen(config.port, () => console.log(`Port ${config.port} is listening ...`));