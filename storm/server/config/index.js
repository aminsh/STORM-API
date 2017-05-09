"use strict";

const path = require('path'),
    env = process.env.NODE_ENV || 'development',
    rootPath = path.normalize(__dirname + '/../../'),
    environment = {
        development: {
            rootPath: rootPath,
            db: {
                client: 'pg',
                connection: 'postgres://postgres:P@ssw0rd@localhost:5432/admin', /*'postgres://bkwyyehssvwmee:ecd4e9a2e49d514da639da8f87d4327e96365836819b7961f82fa8a03586188d@ec2-54-235-168-152.compute-1.amazonaws.com:5432/d90ra2sgbuijdl?ssl=true',/*,*/
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
                origin: 'https://storm-sandbox.herokuapp.com',
                luca: 'https://storm-sandbox.herokuapp.com/luca-demo',
                accounting: 'https://storm-sandbox.herokuapp.com/acc'
            },
            auth: {
                google: {
                    clientID: '44908669153-rgtap5scj693g240t9p3k69tplearpto.apps.googleusercontent.com',
                    clientSecret: 'ZAc3SYGLyKenCssgRzs0iY-1',
                    callbackURL: 'https://storm-sandbox.herokuapp.com/auth/google/callback',
                }
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
