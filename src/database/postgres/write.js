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
  port     : process.env.DB_WRITE_PORT,
  database : process.env.DB_WRITE_DATABASE,
  user     : process.env.DB_WRITE_USER,
  password : process.env.DB_WRITE_PASSWORD,
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
  queryConnection,
  openConnection,
  closeConnection
};