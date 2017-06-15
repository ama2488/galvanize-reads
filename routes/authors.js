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
router.get('/authors', (req, res, next) => {
  db.getAuthorsWithBooks().then((result) => {
    res.render('authors', { title: 'Authors', authors: result });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});
router.get('/authors/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  db.getAuthorsWithBooks().then((result) => {
    const author = result.filter(auth => (auth.id === id));
    res.render('authors', { title: 'Authors', authors: author });
  })
  .catch((err) => {
    console.log(err);
    return next(err);
  });
});
router.post('/add/author', (req, res, next) => {
  const author = req.body;
  knex('authors')
  .insert(author)
  .then(() => {
    res.status(201);
    res.send('Author added successfully!');
  })
  .catch((err) => {
    console.log(err);
    return next(err);
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

  const updateAuthor = () => {
    knex('authors')
    .where('id', id)
    .update(author);
  };

  const deleteBooks = () => knex('books_authors')
    .where('author_id', id)
    .del();

  const updateBooks = () => knex('books_authors')
  .insert(bookAuth);

  updateAuthor();
  deleteBooks()
.then(() => {
  updateBooks()
  .then(() => {
    res.status(201);
    res.send('Successfully updated!');
  })
    .catch((err) => {
      console.log(err);
      return next(err);
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
    return next(err);
  });
});

module.exports = router;
