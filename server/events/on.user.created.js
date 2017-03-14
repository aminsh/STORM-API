"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('../data/repository.user');

module.exports.name = 'on-user-created';

module.exports.action = async((user, req) => {
    let userRepository = new UserRepository(req.cookies['branch-id']);

    let isUserExists = await(userRepository.findById(user.id));
    if (isUserExists)
        return;

    await(userRepository.create(user));
});