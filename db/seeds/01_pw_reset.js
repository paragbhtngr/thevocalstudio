
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('pw_reset').del()
    .then(function () {
      // Inserts seed entries
      return knex('pw_reset').insert([
      ]);
    });
};
