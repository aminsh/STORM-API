"use strict";

const nodemailer = require('nodemailer'),
    Promise = require('promise'),
    config = instanceOf('config');


/* options = {
 from : 'STORM <info@storm-online.ir>',
 to : 'aminsheikhi@gmail.com',
 subject : 'Test sending email',
 text : 'Hello'
 };*/

module.exports.send = (options) => {
    let transporter = nodemailer.createTransport(config.email.transporter);

    options.from = config.email.from;

    return new Promise((resolve, reject) => {
        transporter.sendMail(options, function (err, suc) {
            if (err) reject(err);
            resolve(suc);
        });
    });
};