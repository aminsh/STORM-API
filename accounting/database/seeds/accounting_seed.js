exports.seed = function (knex, Promise) {

    return knex('dimensionCategories').insert([
        {title: 'تفصیل 2'},
        {title: 'تفصیل 3'},
        {title: 'تفصیل 4'},
    ]);
};
