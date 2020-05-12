'use strict';

//
// dependencies
const pg = require('pg');

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

const query = async (consulta, params = []) => {
  if(client === null) {
    logger.info('poolWrite.connect started');
    client = await poolWrite.connect();
  }

  const result = await client.query(consulta, params);
  return result.rows;
};

const queryFirstOrNull = async (query, params = []) => {
  if(client === null) {
    logger.info('poolWrite.connect started');
    client = await poolWrite.connect();
  }

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
const openConnection = async () => {
  return await poolSafeA.connect();
};
const closeConnection = (client) => {
  client.release(true);
};

module.exports = {
  query,
  queryFirstOrNull,
  queryConnection,
  openConnection,
  closeConnection
};