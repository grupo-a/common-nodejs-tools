'use strict';

//
// dependencies
const pg = require('pg');

//
// pull read
const poolRead = new pg.Pool({
  host      : process.env.DB_READ_HOST,
  port      : process.env.DB_PORT,
  database  : process.env.DB_DATABASE,
  user      : process.env.DB_USER,
  password  : process.env.DB_PASSWORD,
  max       : 10
});

const validateQuery = (query) => {
  if (query.match(/(UPDATE|INSERT|DELETE)/g)) {
    throw new Error('This query is to WRITE and is executing into READ database, please change `postgres.read.*` with `postgres.write.*`');
  }
}

const query = (query, params = []) => {
  validateQuery(query);

  return poolRead.query(query, params)
    .then(result => {
      return result.rows;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const queryFirstOrNull = (query, params = []) => {
  validateQuery(query);
  
  return poolRead.query(query, params)
    .then(result => {
      if (result.rowCount > 0) {
        return result.rows[0];
      }
      return null;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

module.exports = {
  query,
  queryFirstOrNull
};