
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('audio_files').del()
    .then(function () {
      // Inserts seed entries
      return knex('audio_files').insert([
      ]);
    });
};
