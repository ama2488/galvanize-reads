const env = 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);

const db = {
  getBooks() { return knex('books'); },
  getAuthors() { return knex('authors'); },
  getAuthorsAndBooks(books) {
    return knex('authors')
      .select(knex.raw('authors.*, books_authors.book_id, books.title as book_title'))
      .join('books_authors', 'authors.id', 'books_authors.author_id')
      .join('books', 'books.id', 'books_authors.book_id')
      .whereIn('books_authors.book_id', books.map(book => book.id));
  },
  createBooks(books, authors) {
    return books.map((book) => {
      const authorArr = [];
      authors[0].forEach((a) => {
        if (a.book_id === book.id) {
          authorArr.push(a);
        }
      });
      book.authors = authorArr;
      return book;
    });
  },
  groupBooks(authors) {
    return authors.reduce((acc, author) => {
      acc[author.id] = acc[author.id] || [];
      acc[author.id].push({ id: author.book_id, title: author.book_title });
      return acc;
    }, {});
  },
  createAuthors(authBooks, authors) {
    return authors.map((author) => {
      author.books = authBooks[author.id] || [];
      return author;
    });
  },
  getBooksWithAuthors() {
    return this.getBooks()
      .then(books => Promise.all([
        this.getAuthorsAndBooks(books),
      ]).then(results => this.createBooks(books, results)))
      .catch((err) => { console.log(err); });
  },
  getAuthorsWithBooks() {
    return this.getBooks()
      .then(books => this.getAuthorsAndBooks(books))
      .then(authors => Promise.all([
        this.groupBooks(authors),
        this.getAuthors(),
      ]).then(results => this.createAuthors(...results)))
      .catch((err) => { console.log(err); });
  },
  deleteAuthor(id) {
    return knex('books_authors')
    .where('author_id', id)
    .del()
    .then(() => knex('authors')
      .where('id', id)
      .del());
  },
  deleteBook(id) {
    return knex('books_authors')
    .where('book_id', id)
    .del()
    .then(() => knex('books')
      .where('id', id)
      .del());
  },
};

module.exports = db;
