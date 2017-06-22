const authors = require('../data/authors');

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('authors').del()
    .then(() =>
       knex('authors').insert(authors))
       .then(() => knex.raw(
      'SELECT setval(\'authors_id_seq\', (SELECT MAX(id) FROM authors))'));
};
