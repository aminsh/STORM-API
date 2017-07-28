"use strict";

let users = [];

module.exports.users = users;
module.exports.add = (userId, connectionId) => {
    users.push({userId: userId, connectionId: connectionId});
};

module.exports.remove = connectionId => {
    let user = users.asEnumerable().firstOrDefault(u => u.connectionId == connectionId);

    if (user)
        users.asEnumerable().remove(user);

    return user;
};