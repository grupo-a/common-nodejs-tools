'use strict';

//
// dependencies
const pg = require('pg');

//
// pool read
const noopIdentityCheck = () => {};
const pgConfig = {
  host              : process.env.DB_READ_HOST,
  port              : process.env.DB_PORT,
  database          : process.env.DB_DATABASE,
  user              : process.env.DB_USER,
  password          : process.env.DB_PASSWORD,
  statement_timeout : process.env.DB_STATEMENT_TIMEOUT || 0,
  max               : 10
};

if (process.env.DB_ENABLE_SSL === 'true') {
  pgConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  }

  if (process.env.DB_SSL_DISABLE_IDENTITY_CHECK === 'true') {
    pgConfig.ssl.checkServerIdentity = noopIdentityCheck;
  }
}

const poolRead = new pg.Pool(pgConfig);

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
