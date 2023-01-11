'use strict';

//
// dependencies
const pg = require('pg');

//
// pull read
const poolRead = new pg.Pool({
  host              : process.env.DB_READ_HOST,
  port              : process.env.DB_PORT,
  database          : process.env.DB_DATABASE,
  user              : process.env.DB_USER,
  password          : process.env.DB_PASSWORD,
  statement_timeout : process.env.DB_STATEMENT_TIMEOUT || 0,
  max       : 10
});

const query = (query, params = []) => {
  return poolRead.query(query, params)
    .then(result => {
      return result.rows;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const queryFirstOrNull = (query, params = []) => {
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