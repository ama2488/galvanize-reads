
exports.up = function (knex, Promise) {
  return knex.schema.createTable('books', (t) => {
    t.increments().primary();
    t.string('title').notNullable();
    t.string('genre').notNullable();
    t.string('description', 1000).notNullable();
    t.string('cover');
    t.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('books');
};
