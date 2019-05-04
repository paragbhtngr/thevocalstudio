
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('users', (table) => {
    table.increments("id");
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email_address").notNullable();
    table.string("password").notNullable();
    table.boolean("is_admin").notNullable().defaultTo(false);
    table.boolean("is_deleted").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
  .createTable('pw_reset', (table) => {
    table.increments("id");
    table.string("email_address").notNullable();
    table.string("reset_token").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.integer("user_id").unsigned().references("id").inTable('users');
  })
  .createTable('audio_files', (table) => {
    table.increments("id");
    table.string("directory").notNullable();
    table.string("name").notNullable();
    table.string("gender").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users').dropTable('pw_reset').dropTable('audio_files'); 
};
