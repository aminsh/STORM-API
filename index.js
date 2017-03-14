"use strict";

const config = require('./storm/server/config'),
    app = require('./storm/server/config/express').app;

require('./storm');

app.listen(config.port, () => console.log(`Port ${config.port} is listening ...`));