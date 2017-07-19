"use strict";

const app = require('./express').app;

/* middlewares */
app.use(require('../middlewares/locals'));

/* apis */
app.use('/api/users', require('../features/user/user.api'));
app.use('/api/branches', require('../features/branch/branch.api'));
app.use('/api', require('../features/message/message.api'));
app.use('/api/auth', require('../features/auth/auth.api'));

/* ctrls */
app.use('/auth', require('../features/auth/auth.controller'));
app.use('/', require('../features/luca/luca.controller'));
app.use('/', require('../features/user/user.controller'));
app.use('/database', require('../features/database.query.live/database.query'));

app.post('/upload', (req, res) => {
    let file = req.files.file;

    res.send({
        name: file.name,
        fullName: file.path
    });
});

app.get('/', (req, res) => res.render('webSite/index.html'));
app.get('/policy', (req, res) => res.render('webSite/index.html'));

app.get('/new-site', (req, res) => res.render('new-site.ejs'));

/* rest of routes should handled by angular  */
app.get('*', (req, res) => res.render('index.ejs'));

