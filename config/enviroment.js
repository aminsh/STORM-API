"use strict";

const path = require('path'),
    rootPath = path.normalize(__dirname + '/../'),
    logo = '/public/images/noimage.svg';

module.exports = {
    reCaptcha: {
        key: {
            site: process.env.RECAPCH_KEY_SITE,
            secret: process.env.RECAPCH_KEY_SECRET
        }
    },
    rootPath,
    logo,
    db: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        debug: true
    },
    port: process.env.PORT,
    version: {
        vendor: '1.0.0',
        acc: '1.0.0',
        css: '1.0.0',
        template: '1.0.0'
    },
    email: {
        from: process.env.EMAIL_FROM,
        transporter: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASSWORD
            }
        }
    },
    url: {
        origin: process.env.ORIGIN_URL,
        accounting: `${process.env.ORIGIN_URL}/acc`
    },
    auth: {
        google: {
            clientID: process.env.GOOGLE_AUTH_CLIENTID,
            clientSecret: process.env.GOOGLE_AUTH_SECRET,
            callbackURL: `${process.env.ORIGIN_URL}/auth/google/callback`,
        }
    },
    payping: {
        username: process.env.PAYPING_USERNAME,
        password: process.env.PAYPING_PASSWORD,
    },
    env: process.env.NODE_ENV,
};

