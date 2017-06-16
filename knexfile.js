require('dotenv').config();

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
    connection: 'postgres://zrkwwhjrdtvauc:7b0685306fbe0340c766d2c760727e7189a95e2143e6f05f021376ddf01673c3@ec2-107-22-250-33.compute-1.amazonaws.com:5432/d5bf12ljc79thj',
  },
};
