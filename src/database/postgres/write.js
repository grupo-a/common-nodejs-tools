'use strict';

//
// dependencies
const pg = require('pg');

//
// helper
const logger = require('../../logger');

//
// pool write
const noopIdentityCheck = () => {};
const pgConfig = {
  host              : process.env.DB_WRITE_HOST,
  port              : process.env.DB_PORT,
  database          : process.env.DB_DATABASE,
  user              : process.env.DB_USER,
  password          : process.env.DB_PASSWORD,
  statement_timeout : process.env.DB_STATEMENT_TIMEOUT || 0,
  max               : process.env.DB_POOL_MAX || 10
};

if (process.env.DB_ENABLE_SSL === 'true') {
  pgConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  }

  if (process.env.DB_SSL_DISABLE_IDENTITY_CHECK === 'true') {
    pgConfig.ssl.checkServerIdentity = noopIdentityCheck;
  }
}

const poolWrite = new pg.Pool(pgConfig);

let client = null;

/** @deprecated Use connection pool instead */
const _connect = async () => {
  if(client === null) {
    logger.info('poolWrite.connect started');
    client = await poolWrite.connect();
  }
};

const query = async (query, params = []) => {
  const result = await poolWrite.query(query, params);
  return result.rows;
};

const queryFirstOrNull = async (query, params = []) => {
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

const queryConnection = (query, params = [], client) => {
  return client.query(query, params)
    .then(result => {
      return result.rows;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * @deprecated Use the getClient method to contract a transaction (https://node-postgres.com/features/transactions)
 */
const startTransaction = async () => {
  await _connect();

  return client.query('BEGIN')
    .then(result => {
      logger.info('poolWrite.transaction started');
      return result;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * @deprecated Use the getClient method to contract a transaction (https://node-postgres.com/features/transactions)
 */
const commit = async () => {
  await _connect();

  return client.query('COMMIT')
    .then(result => {
      logger.info('poolWrite.transaction commited');
      return result;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * @deprecated Use the getClient method to contract a transaction (https://node-postgres.com/features/transactions)
 */
const rollback = async () => {
  await _connect();

  return client.query('ROLLBACK')
    .then(result => {
      logger.info('poolWrite.transaction rollbacked');
      return result;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const getClient = async () => {
  return await poolWrite.connect();
}

module.exports = {
  query,
  queryFirstOrNull,
  queryConnection,
  startTransaction,
  commit,
  rollback,
  getClient
};
