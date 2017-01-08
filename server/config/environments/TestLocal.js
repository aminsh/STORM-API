module.exports = {
    rootPath: null,
    port: process.env.PORT || 1001,
    version: {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    auth: {
        url: 'http://dev-storm:2002/auth',
        returnUrl: 'http://dev-storm:1001/auth/return',
        logout: 'http://dev-storm:2001/auth/logout'
    }
};

