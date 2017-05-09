"use strict";

exports.seed = function (knex, Promise) {
    let accDemoBranch = {
        id:'c3339d0d-b4f7-4c96-b5c2-2d4376ceb9ea',
        name: 'STORM Test App',
        logo: '/public/images/logo.png',
        accConnection: 'postgres://khdntotyvarety:41cb005a1d3e157843239557043d5d7fcd992728b579f89ddea8cd1f986bf82e@ec2-54-235-247-224.compute-1.amazonaws.com:5432/d6ep66drpevbhr'
    };

    return knex('branches').insert(accDemoBranch);
};
