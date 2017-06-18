const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile.js')[env];
const knex = require('knex')(config);
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

function Users() {
  return knex('users');
}

Users.createUser = (data, callback) => {
  console.log(data);
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      callback(err);
    }
    console.log(data.password);
    bcrypt.hash(data.password, salt, (err, hash) => {
      if (err) {
        callback(err);
      }

      data.password_digest = hash;
      delete data.password;
      Users().insert(data, '*').then((data) => {
        callback(undefined, data);
      });
    });
  });
};

Users.authenticateUser = (email, password, callback) => {
  Users().where({ email }).first().then((user) => {
    if (!user) {
      return callback('Not a valid email.');
    }
    bcrypt.compare(password, user.password_digest, (err, isMatch) => {
      if (err || !isMatch) {
        return callback("Email and password don't match");
      }
      return callback(undefined, user);
    });
  });
};

module.exports = Users;
