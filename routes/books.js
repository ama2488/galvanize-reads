const path = require('path');
const express = require('express');
const db = require('../db');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const env = 'development';
const config = require('../knexfile.js')[env];
const knex = require('knex')(config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* GET users listing. */
router.get('/books', (req, res, next) => {
  db.getBooksWithAuthors().then((result) => {
    res.render('books', { title: 'Books', books: result });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

router.get('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.getBooksWithAuthors().then((results) => {
    const theBook = results.filter((book) => {
      if (book.id === id) {
        return book;
      }
    });
    res.render('books', { title: 'Books', books: theBook });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});
router.post('/books', (req, res, next) => {
  const book = req.body;
  knex('books')
  .insert(book)
  .then((result) => {
    res.status(201).json({ id: result[0] });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

router.put('/books/:id', (req, res, next) => {
  const id = req.params.id;
  const book = req.body;
  knex('books')
  .where('id', id)
  .update(book)
  .then((result) => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

router.delete('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.deleteBook(id)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

module.exports = router;
