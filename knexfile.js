module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/reads_dev',
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/reads_test',
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/reads_prod',
  },
};

// connection: {
//     host : '127.0.0.1',
//     user : 'your_database_user',
//     password : 'your_database_password',
//     database : 'myapp_test'
//   }
// });
