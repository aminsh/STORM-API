"use strict";

/*var Raven = require('raven');
Raven.config('https://50b4d5bc2a994b1c981dca42cd56013b:530f0521a04c4090b8174c157927d65b@sentry.io/192057').install();*/

require('./shared/utilities/string.prototypes');
require('./shared/utilities/array.prototypes');
require('./shared/utilities/function.prototypes');


require('./accounting/server/config/route');
require('./accounting/server/events/onUserCreated');
require('./accounting/server/events/onSaleCreated.generateJournal');
require('./accounting/server/events/onPurchaseCreated.generateJournal');
require('./accounting/server/events/onPurchaseCreated.generateInput');
require('./accounting/server/events/onSaleCreated.generateOutput');

require('./accounting/server/events/onInvoicePaid');
require('./accounting/server/events/onPaymentCreated');
require('./accounting/server/events/onReceivableChequePassed');
require('./accounting/server/events/onReceivableChequeReturn');
require('./accounting/server/events/onPayableChequePassed');
require('./accounting/server/events/onPayableChequeReturn');
require('./accounting/server/events/onIcomeCreated');
require('./accounting/server/events/onExpenseCreated');
require('./accounting/server/events/onBranchRemoved');

require('./storm/server/features/setup');

const config = require('./storm/server/config'),
    accApp = require('./accounting/server/config/express'),
    app = require('./storm/server/config/express').app,
    server = require('./storm/server/config/express').server,
    io = require('./storm/server/config/express').io,
    userConnected = require('./storm/server/features/user/connectedUsers');


app.use('/acc', accApp);
app.use('/api/v1', require('./api/api.config'));
app.use('/invoice', require('./invoice/app.server.config'));
app.use('/admin', require('./admin/app.server.config'));

require('./storm');

server.listen(config.port, () => console.log(`Port ${config.port} is listening ...`));

io.on('connection', function (socket) {

    socket.on('join', userId => {
        userConnected.add(userId, socket.id);
        io.sockets.emit('update-users');
    });

    socket.on('disconnect', function () {
        userConnected.remove(socket.id);
        io.sockets.emit('update-users');
    });
});