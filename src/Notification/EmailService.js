import {injectable} from "inversify";
import nodemailer from "nodemailer";
import Promise from "promise";
import toResult from "asyncawait/await";


/* options = {
 from : 'STORM <info@storm-online.ir>',
 to : 'aminsheikhi@gmail.com',
 subject : 'Test sending email',
 text : 'Hello'
 };*/


@injectable()
export class EmailService {

    emailConfig = {
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
    };

    sendSync() {
        
        return toResult(this._send(...arguments));
    }

    sendAsync() {
        
        return this._send(...arguments);
    }

    _send(options) {

        let transporter = nodemailer.createTransport(this.emailConfig.transporter);

        options.from = this.emailConfig.from;

        return new Promise((resolve, reject) => {
            transporter.sendMail(options, function (err, suc) {
                if (err) return reject(err);
                resolve(suc);
            });
        });
    }
}