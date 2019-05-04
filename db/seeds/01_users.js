
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1, 
          first_name: 'Admin',
          last_name: 'Admin',
          email_address: 'admin@admin.com',
          password: "",
          is_admin: true,
        }
      ]);
    });
};
