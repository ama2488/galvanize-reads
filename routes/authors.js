const express = require('express');
const db = require('../models/db');
const bodyParser = require('body-parser');
const knex = require('../models/knex');
const router = express.Router();

router.get('/authors', (req, res, next) => {
  db.getAuthorsWithBooks().then((result) => {
    res.render('authors', { title: 'Authors', authors: result, user: req.session.user });
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.get('/authors/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.getAuthorsWithBooks().then((result) => {
    if (!isNaN(id)) {
      const author = result.filter(auth => (auth.id === id));
      res.render('authors', { title: 'Authors', authors: author, user: req.session.user });
    }
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.post('/add/author', (req, res, next) => {
  const author = req.body;
  db.addItem('authors', author)
  .then(() => {
    res.status(201);
    res.send('Author added successfully!');
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

router.put('/authors/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const author = req.body;
  const books = author.bookid;
  delete author.bookid;
  const bookAuth = [];

  if (typeof books !== 'string') {
    books.forEach((b) => {
      bookAuth.push({ author_id: id, book_id: b });
    });
  } else {
    bookAuth.push({ author_id: id, book_id: parseInt(books, 10) });
  }

  db.updateItem(id, 'authors', author).then();
  db.deleteQuery('books_authors', 'author_id', id)
.then(() => {
  db.addItem('books_authors', bookAuth)
  .then(() => {
    res.status(201);
    res.send('Successfully updated!');
  })
    .catch((err) => {
      console.log(err);
      // return next(err);
    });
});
});
router.delete('/authors/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.deleteItem(id, 'author_id', 'authors')
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    // return next(err);
  });
});

module.exports = router;
