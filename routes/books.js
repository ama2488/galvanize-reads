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
    result.map(book => book.genre).forEach((item) => {
      if (genres.indexOf(item) < 0) {
        genres.push(item);
      }
    });
    res.render('books', { title: 'Books', books: result, genres, user: req.session.user });
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
      result.map(b => b.genre).forEach((item) => {
        if (genres.indexOf(item) < 0) {
          genres.push(item);
        }
      });
      res.render('books', { title: 'Books', books: bookArr, genres, user: req.session.user });
    } else {
      res.status(404);
    }
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.post('/add/book', (req, res, next) => {
  const book = req.body;
  const author = book.authorid;
  delete book.authorid;

  knex('books')
  .insert(book)
  .returning('id')
  .then((id) => {
    const authorsArr = [];
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
});

module.exports = router;
