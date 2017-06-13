const ba = require('../books_authors');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('books_authors').del()
    .then(() =>
       knex('books_authors').insert(ba))
       .then(() => knex.raw(
      'SELECT setval(\'books_authors_id_seq\', (SELECT MAX(id) FROM books_authors))'));
};
