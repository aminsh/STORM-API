module.exports = {
    rootPath: null,
    /*db: {
        username: "jkfhhrhedmzpnt",
        password: "G0CXzLu0uLzP3jTUNLUODI2bTo",
        database: "d4cd8gk58c0i7d",
        host: "ec2-54-235-246-220.compute-1.amazonaws.com",
        dialect: "postgres",
        ssl: true,
        dialectOptions: {
            require: true,
            ssl: true
        },
        client: 'pg',
        //url: 'postgres://jkfhhrhedmzpnt:G0CXzLu0uLzP3jTUNLUODI2bTo@ec2-54-235-246-220.compute-1.amazonaws.com:5432/d4cd8gk58c0i7d'
    },*/
    port: process.env.PORT || 1001,
    version: {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    auth: {
        url: 'http://storm-online.ir/auth',
        returnUrl: 'http://acc.storm-online.ir/auth/return'
    },
    redis:{
        url: ''
    }
};
