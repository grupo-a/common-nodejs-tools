'use strict';

//
// dependencies
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const uuid       = require('uuid');

//
// helpers
const _response = require('../response');
const _logger   = require('../logger');
const _error    = require('../error');

//
// config express
const server = express();
// parsing application/json
server.use(bodyParser.json({ limit: '300kb' }));
// parsing application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));
// cors
server.use(cors());
// async error
require('express-async-errors');

//
// x-request-id
server.use((req, res, next) => {
  res.requestId = req.headers['X-Request-Id'] || uuid.v4();
  res.setHeader('X-Request-Id', res.requestId);

  next();
});

const _init = () => {
  // handler errors
  server.use((req, res, next) => {
    _response.error(res, new _error.HttpError(`Route not found - ${req.originalUrl}`, 404, '404-route-found'));
  });
  server.use((err, req, res, next) => {
    _response.error(res, err);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    _logger.info(`Listening on port ${port}`);
  });
}

module.exports = {
  instance: server,
  init: _init
}