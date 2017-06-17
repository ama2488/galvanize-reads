const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);

const db = {
  getBooks() { return knex('books').orderBy('id'); },
  getAuthors() { return knex('authors').orderBy('id'); },
  getAuthorsAndBooks(books) {
    return knex('authors')
      .select(knex.raw('authors.*, books_authors.book_id, books.title as book_title'))
      .join('books_authors', 'authors.id', 'books_authors.author_id')
      .join('books', 'books.id', 'books_authors.book_id')
      .whereIn('books_authors.book_id', books.map(book => book.id));
  },
  createBooks(books, authors, allAuths) {
    books.map((book) => {
      const authorArr = [];
      authors.forEach((a) => {
        if (a.book_id === book.id) {
          authorArr.push(a);
        }
      });
      book.authors = authorArr;
      const keys = ['id', 'first', 'last'];
      const otherAuths = allAuths.filter(a =>
     !book.authors.some(b => a.id === b.id)).map(author =>
     keys.reduce((obj, key) => {
       obj[key] = author[key];
       return obj;
     }, {}));
      book.other_authors = otherAuths || [];
      return book;
    });
    return books;
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
        this.getAuthors(),
      ]).then(results => this.createBooks(books, ...results)))
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
  updateItem(id, table, item) {
    return knex(table)
    .where('id', id)
    .update(item);
  },
  addItem(table, item) {
    return knex(table)
    .insert(item);
  },
  deleteQuery(table, col, id) {
    return knex(table)
      .where(col, id)
      .del();
  },
};

module.exports = db;
