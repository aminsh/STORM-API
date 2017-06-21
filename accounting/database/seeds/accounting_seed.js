
exports.seed = function(knex, Promise) {

  return knex('dimensionCategories').del()
    .then(function () {

      return knex('dimensionCategories').insert([
        {id: '1', title: 'تفصیل 2'},
        {id: '2', title: 'تفصیل 3'}
      ]);
    });
};
