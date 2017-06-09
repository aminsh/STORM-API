"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    UserRepository = require('../data/repository.user'),
    EventEmitter = require('../services/shared').service.EventEmitter;

EventEmitter.on('on-user-created', async((user, req) => {
    let userRepository = new UserRepository(req.cookies['branch-id']);

    user.branchId = req.cookies['branch-id'];

    let isUserExists = await(userRepository.findById(user.id));
    if (isUserExists)
        return;

    await(userRepository.create(user));
}));
