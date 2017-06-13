
exports.up = function (knex, Promise) {
  return knex.schema.createTable('books_authors', (t) => {
    t.increments();
    t.integer('book_id').references('id').inTable('books').notNullable();
    t.integer('author_id').references('id').inTable('authors').notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function (knex, Promise) {
  knex.schema.dropTable('books_authors');
};
