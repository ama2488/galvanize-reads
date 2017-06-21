const express = require('express');
const db = require('../db');
const bodyParser = require('body-parser');

const router = express.Router();

const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

router.get('/books', (req, res, next) => {
  db.getBooksWithAuthors().then((result) => {
    const genres = [];
    const authorList = result[0].authors.map(author=>({id:author.id, first:author.first, last:author.last}))
    .concat(result[0].other_authors);
    result.map(book => book.genre).forEach((item) => {
      if (genres.indexOf(item) < 0) {
        genres.push(item);
      }
    });
    res.render('books', { title: 'Books', books: result, genres, user: req.session.user, authors: authorList });
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.get('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.getBooksWithAuthors().then((result) => {
    if (!isNaN(id)) {
      const bookArr = result.filter(book => (book.id === id));
      const genres = [];
      const authorList = result[0].authors.map(author=>({id:author.id, first:author.first, last:author.last}))
      .concat(result[0].other_authors);
      result.map(b => b.genre).forEach((item) => {
        if (genres.indexOf(item) < 0) {
          genres.push(item);
        }
      });
      res.render('books', { title: 'Books', books: bookArr, genres, user: req.session.user, authors:authorList });
    } else {
      res.status(404);
    }
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.post('/book/add', (req, res, next) => {
  const book = req.body;
  const author = book.authorid;
  delete book.authorid;
  console.log(book);

  knex('books')
  .insert(book)
  .returning('id')
  .then((id) => {
    const authorsArr = [];
    console.log(typeof author);
    if (typeof author !== 'string') {
      author.forEach((a) => {
        authorsArr.push({ book_id: parseInt(id, 10), author_id: a });
      });
    } else {
      authorsArr.push({ book_id: parseInt(id, 10), author_id: parseInt(author, 10) });
    }
    db.addItem('books_authors', authorsArr)
    .then(() => {
      res.status(201);
      res.send('Successfully added book!');
    });
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.put('/books/:id', (req, res, next) => {
  const id = req.params.id;
  const book = req.body;
  db.updateItem(id, 'books', book)
  .then(() => {
    res.status(200);
    res.send('Successfully updated!');
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.delete('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.deleteItem(id, 'book_id', 'books')
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
  res.status(500);
  res.send('go away');
});

module.exports = router;
