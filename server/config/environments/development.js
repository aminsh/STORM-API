module.exports = {
    rootPath: null,
    port: process.env.PORT || 1000,
    version: {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    branch: {
        logoUrl: 'http://dev-storm:2000/api/branches/{0}/logo',
        changeUrl: 'http://dev-storm:2000/branch/change'
    },
    auth: {
        url: 'http://dev-storm:2000/auth',
        returnUrl: 'http://dev-storm:1000/auth/return',
        logout: 'http://dev-storm:1000/auth/logout'
    }
};
