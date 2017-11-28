"use strict";

var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({apikey: '31514D326B4F3668754D62384D7272536477315469413D3D'});

class SMSService {
    constructor() {

    }

    send(message) {
        api.Send({
            message,
            sender: "100065995",
            receptor: "09396408566"
        });
    }
}

module.exports = SMSService;