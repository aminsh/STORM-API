"use strict";

const path = require('path'),
    env = process.env.NODE_ENV || 'development',
    rootPath = path.normalize(__dirname + '/../../'),
    logo = '/public/images/noimage.svg',
    environment = {
        development: {
            reCaptcha: {
                key: {
                    site: "6LcB-ysUAAAAAE_uDz0N0IiwjdwFGbqUTfcFi_Ey",
                    secret: "6LcB-ysUAAAAAIF1O8KjVQG0ykrQLJb5AUkRK44y"
                }
            },
            rootPath: rootPath,
            logo,
            db: {
                client: 'pg',
                connection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccounting',
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
            reCaptcha: {
                key: {
                    site: "6LcB-ysUAAAAAE_uDz0N0IiwjdwFGbqUTfcFi_Ey",
                    secret: "6LcB-ysUAAAAAIF1O8KjVQG0ykrQLJb5AUkRK44y"
                }
            },
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
            reCaptcha: {
                key: {
                    site: "6LcB-ysUAAAAAE_uDz0N0IiwjdwFGbqUTfcFi_Ey",
                    secret: "6LcB-ysUAAAAAIF1O8KjVQG0ykrQLJb5AUkRK44y"
                }
            },
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
