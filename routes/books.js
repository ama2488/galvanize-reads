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
    const genres = [];
    result.map(book => book.genre).forEach((item) => {
      if (genres.indexOf(item) < 0) {
        genres.push(item);
      }
    });
    res.render('books', { title: 'Books', books: result, genres });
  })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.getBooksWithAuthors().then((result) => {
    const bookArr = result.filter(book => (book.id === id));
    const genres = [];
    result.map(b => b.genre).forEach((item) => {
      if (genres.indexOf(item) < 0) {
        genres.push(item);
      }
    });
    res.render('books', { title: 'Books', books: bookArr, genres });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

router.get('/add/book', (req, res, next) => {
  db.getAuthors()
  .then((result) => {
    res.render('addBook', { title: 'Add Book', authors: result });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

router.post('/add/book', (req, res, next) => {
  const book = req.body;
  const authorId = book.authorid;
  delete book.authorid;
  knex('books')
  .insert(book)
  .returning('id')
  .then((id) => {
    console.log('returned id', id);
    knex('books_authors')
    .insert({ book_id: parseInt(id, 10), author_id: authorId })
    .then(() => {
      res.status(201);
      res.send('Successfully added book!');
    });
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
  db.deleteItem(id, 'book_id', 'books')
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});

module.exports = router;
