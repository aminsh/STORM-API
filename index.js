"use strict";

require('babel-polyfill');

/* 1- loading prototypes */
require('./shared/utilities/string.prototypes');
require('./shared/utilities/array.prototypes');
require('./shared/utilities/function.prototypes');


/* 2- loading ioc */
require('./config/ioc');

require('./shared/globals');

require('./application/dist/bootstrap');

const config = instanceOf('config'),
    app = require('./storm/server/bootstrap').app,
    server = require('./storm/server/bootstrap').server,
    io = require('./storm/server/bootstrap').io,
    userConnected = require('./storm/server/features/user/connectedUsers');

/* 3- loading apps */
app.use('/acc', require('./accounting/server/bootstrape'));
app.use('/api/v1', require('./api/api.config'));
app.use('/invoice', require('./invoice/app.server.config'));
app.use('/third-party', require('./third-party/app.server.config'));
app.use('/campaign', require('./campaign/app.server.config'));
app.use('/docs', require('./documents/app.server.config'));
app.use('/admin', require('./admin/app.server.config'));

require('./storm/server/bootstrap.routes');

/* 3- listening */
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
