"use strict";

require('./shared/utilities/string.prototypes');
require('./shared/utilities/array.prototypes');
require('./shared/utilities/function.prototypes');


require('./accounting/server/config/route');
require('./accounting/server/events/onUserCreated');
require('./accounting/server/events/onSaleCreated');
require('./accounting/server/events/onPurchaseCreated');

const config = require('./storm/server/config'),
    accApp = require('./accounting/server/config/express'),
    app = require('./storm/server/config/express').app;


app.use('/acc', accApp);
app.use('/api/v1', require('./api/api.config'));

require('./storm');

app.listen(config.port, () => console.log(`Port ${config.port} is listening ...`));