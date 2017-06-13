
exports.up = function (knex, Promise) {
  return knex.schema.createTable('authors', (t) => {
    t.increments().primary();
    t.string('first').notNullable();
    t.string('last').notNullable();
    t.string('biography', 1000).notNullable();
    t.string('portrait_url');
    t.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('authors');
};
