"use strict";

const path = require('path'),
    env = process.env.NODE_ENV || 'development',
    rootPath = path.normalize(__dirname + '/../../'),
    logo = 'data:image/png;base64,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',
    environment = {
        development: {
            rootPath: rootPath,
            logo,
            db: {
                client: 'pg',
                connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccounting',
                //connection:'postgres://bkwyyehssvwmee:ecd4e9a2e49d514da639da8f87d4327e96365836819b7961f82fa8a03586188d@ec2-54-235-168-152.compute-1.amazonaws.com:5432/d90ra2sgbuijdl?ssl=true',
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
                origin: 'http://localhost:2000',
                luca: 'http://localhost:2000/luca-demo',
                accounting: 'http://localhost:2000/acc'
            },
            auth: {
                google: {
                    clientID: '44908669153-rgtap5scj693g240t9p3k69tplearpto.apps.googleusercontent.com',
                    clientSecret: 'ZAc3SYGLyKenCssgRzs0iY-1',
                    callbackURL: 'http://localhost:2000/auth/google/callback',
                }
            },
            branchId: 'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea',
            env,


        },
        test: {
            rootPath: rootPath,
            logo,
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
                origin: 'http://admin-sandbox-storm-admin.abar.cloud',
                luca: 'http://admin-sandbox-storm-admin.abar.cloud/luca-demo',
                accounting: 'http://admin-sandbox-storm-admin.abar.cloud/acc'
            },
            auth: {
                google: {
                    clientID: '44908669153-rgtap5scj693g240t9p3k69tplearpto.apps.googleusercontent.com',
                    clientSecret: 'ZAc3SYGLyKenCssgRzs0iY-1',
                    callbackURL: 'http://admin-sandbox-storm-admin.abar.cloud/auth/google/callback',
                }
            }
        },
        production: {
            rootPath: rootPath,
            logo,
            db: {
                client: 'pg',
                connection: process.env.DATABASE_URL
            },
            port: process.env.PORT,
            version: {
                app: '1.0.1',
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
                origin: 'https://www.storm-online.ir',
                luca: 'https://www.storm-online.ir/luca-demo',
                accounting: 'https://www.storm-online.ir/acc'
            },
            auth: {
                google: {
                    clientID: '44908669153-rgtap5scj693g240t9p3k69tplearpto.apps.googleusercontent.com',
                    clientSecret: 'ZAc3SYGLyKenCssgRzs0iY-1',
                    callbackURL: 'https://www.storm-online.ir/auth/google/callback',
                }
            }
        }
    };

module.exports = environment[env];
