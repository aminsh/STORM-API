var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');


var environment = {
    development: {
        rootPath: rootPath,
        db: {
            client: 'pg',
            connection: 'postgres://hbbxkylt:6FL1uRTUdewpGcYiL43PmW0PwPz3MvsJ@stampy.db.elephantsql.com:5432/hbbxkylt',
            debug: true
        },
        port: process.env.PORT || 2000,
        version: {
            vendor: '1.0.0',
            acc: '1.0.0',
            css: '1.0.0',
            template: '1.0.0'
        },
        email: {
            from: 'STORM <info@storm-online.ir>',
            transporter: {
                host: 'smtp.zoho.com',
                port: 465, //example
                auth: {
                    user: 'info@storm-online.ir',
                    pass: 'rAEMtxezr3UN'
                }
            }
        },
        url: {
            luca: 'http://dev-storm:1000/auth/return'
        }
    },
    production: {
        rootPath: rootPath,
        db: {
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
            //url: 'postgres://lgxdmvmmirytbb:2df3fc723567867100f43052bcef0746d079ee75a765567be0fec2d511139541@ec2-174-129-37-15.compute-1.amazonaws.com:5432/d37aunppf7pl08'
            url: process.env.DATABASE_URL
        },
        port: process.env.PORT || 1001,
        reportPath: path.normalize('{0}/server/report.templates'.format(rootPath)),
        version: {
            vendor: '1.0.0',
            acc: '1.0.0',
            css: '1.0.0',
            template: '1.0.0'
        },
        email: {
            from: 'STORM <info@storm-online.ir>',
            transporter: {
                host: 'smtp.zoho.com',
                port: 465, //example
                auth: {
                    user: 'info@storm-online.ir',
                    pass: 'rAEMtxezr3UN'
                }
            }
        },
        url: {
            luca: 'http://www.luca.storm-online.ir/auth/return'
        }
    }
};

var env = process.env.NODE_ENV || 'development';

module.exports = environment[env];
