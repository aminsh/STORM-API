"use strict";

const path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    environment = {
        development: {
            rootPath: rootPath,
            db: {
                client: 'pg',
                connection: 'postgres://postgres:P@ssw0rd@localhost:5432/admin-knex',
                debug: true
            },
            port: 2000,
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
                luca: 'http://localhost:2000/luca-demo'
            }
        },
        production: {
            rootPath: rootPath,
            db: {
                client: 'pg',
                connection: process.env.DATABASE_URL
            },
            port: process.env.PORT,
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
                luca: 'https://www.storm-online.ir/luca-demo'
            }
        }
    };

var env = process.env.NODE_ENV || 'development';

module.exports = environment[env];
