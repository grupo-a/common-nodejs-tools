'use strict';

//
// dependencies
const xray = require('./xray.config');
const pg   = xray.loadPG();

//
// helper
const logger = require('../../logger');

//
// pull write
const poolWrite = new pg.Pool({
  host     : process.env.DB_WRITE_HOST,
  port     : process.env.DB_PORT,
  database : process.env.DB_DATABASE,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  max      : 10
});

let client = null;

const _connect = async () => {
  if(client === null) {
    logger.info('poolWrite.connect started');
    client = await poolWrite.connect();
  }
};

const query = async (consulta, params = []) => {
  await _connect();

  const result = await client.query(consulta, params);
  return result.rows;
};

const queryFirstOrNull = async (query, params = []) => {
  await _connect();

  return client.query(query, params)
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

const queryConnection = (consulta, params = [], client) => {
  return client.query(consulta, params)
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
  const newClient = await poolWrite.connect();
  return newClient;
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