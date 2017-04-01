"use strict";

exports.seed = function (knex, Promise) {
    let accDemoBranch = {
        id:'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea',
        name: 'دموی لوکا',
        logo: '/public/images/logo.png',
        accConnection: 'postgres://postgres:P@ssw0rd@localhost:5432/dbAccFRK'
    };

    return knex('branches').insert(accDemoBranch);
};
