const books = require('../data/books');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('books').del()
    .then(() =>
       knex('books').insert(books))
       .then(() => knex.raw(
      'SELECT setval(\'books_id_seq\', (SELECT MAX(id) FROM books))'));
};
