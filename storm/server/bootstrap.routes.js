"use strict";

const app = require('./bootstrap').app,
    config = instanceOf('config');

/* middlewares */
app.use(require('./middlewares/locals'));


/* apis */
app.use('/api/users', require('./features/user/user.api'));
app.use('/api/branches', require('./features/branch/branch.api'));
app.use('/api/docs', require('./features/documents/docs.api'));
app.use('/api', require('./features/message/message.api'));
app.use('/api/auth', require('./features/auth/auth.api'));
app.use('/api/branch-third-party', require('./features/thirdParty/branchThirdParty.api'));
app.use('/api/webhook', require('./features/webhook/webhook.api'));
app.use('/api/orders', require('./features/order/order.api'));
app.use('/api/plans', require('./features/plan/plan.api'));
app.use('/api/gifts', require('./features/gift/gift.api'));
app.use('/api/planCategories', require('./features/planCategory/planCategory.api'));
app.use('/api/application-logger', require('./features/applicationLogger/applicationLogger.api'));

/* ctrls */
app.use('/auth', require('./features/auth/auth.controller'));
app.use('/', require('./features/user/user.controller'));
app.use('/database', require('./features/database.query.live/database.query'));

app.post('/upload', (req, res) => {
    let file = req.files.file;

    res.send({
        name: file.name,
        fullName: file.path
    });
});

if (config.env === 'dedicated')
    app.get('/', (req, res) => res.redirect('/profile'));
else {
    app.get('/', (req, res) => res.render('webSite/index.html'));
    app.get('/policy', (req, res) => res.render('webSite/index.html'));
}

///  rest of routes should handled by angular
app.get('*', (req, res) => res.render('index.ejs'));

