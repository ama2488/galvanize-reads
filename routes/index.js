const express = require('express');
const router = express.Router();
const users = require('../users');
const bodyParser = require('body-parser');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Galvanize Reads', user: req.session.user });
});

router.post('/signin', (req, res, next) => {
  users.authenticateUser(req.body.email, req.body.password, (err, user) => {
    if (err) {
      next(err);
    } else {
      req.session.user = user;
      res.redirect('/');
    }
  });
});

router.post('/signup', (req, res, next) => {
  users.createUser(req.body, (err, data) => {
    req.session.user = data[0];
    res.redirect('/');
  });
});

router.post('/signout', (req, res, next) => {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
