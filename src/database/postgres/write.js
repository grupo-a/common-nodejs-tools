'use strict';

//
// dependencies
const pg = require('pg');

//
// pull write
const poolWrite = new pg.Pool({
  host      : process.env.DB_WRITE_HOST,
  port      : process.env.DB_PORT,
  database  : process.env.DB_DATABASE,
  user      : process.env.DB_USER,
  password  : process.env.DB_PASSWORD,
  max       : 10
});

const query = (query, params = []) => {
  return poolWrite.query(query, params)
    .then(result => {
      return result.rows;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const queryFirstOrNull = (query, params = []) => {
  return poolWrite.query(query, params)
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