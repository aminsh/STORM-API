"use strict";

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports.name = 'on-user-created';

module.exports.action = async((user, req)=> {
    var ioc = req.ioc,
        userRepository = ioc.resolve('userRepository');

    let isUserExists = await(userRepository.findById(user.id));
    if(isUserExists)
        return;

    await(userRepository.create(user));
});