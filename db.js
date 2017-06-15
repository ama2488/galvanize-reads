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
      .whereIn('books_authors.book_id', books.map(book => book.id))
      .orderBy('id');
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
  createAuthors(authBooks, authors, books) {
    const bookArr = books.map(book => ({ id: book.id, title: book.title }));
    authors.map((author) => {
      author.books = authBooks[author.id] || [];
      const keys = ['id', 'title'];
      const otherBooks = bookArr.filter(a =>
     !author.books.some(b => a.id === b.id)).map(book =>
     keys.reduce((obj, key) => {
       obj[key] = book[key];
       return obj;
     }, {}));
      author.other_books = otherBooks || [];
      return author;
    });
    return authors;
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
        this.getBooks(),
      ]).then(results => this.createAuthors(...results)))
      .catch((err) => { console.log(err); });
  },
  deleteItem(id, joinId, table) {
    return knex('books_authors')
    .where(joinId, id)
    .del()
    .then(() => knex(table)
      .where('id', id)
      .del());
  },
};

module.exports = db;
