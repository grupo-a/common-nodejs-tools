'use strict';

//
// dependencies
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');

//
// helpers
const _response = require('../response');
const _logger   = require('../logger');
const _error   = require('../error');

//
// config express
const server = express();
// parsing application/json
server.use(bodyParser.json());
// parsing application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));
// cors
server.use(cors());
// async error
require('express-async-errors');

const _init = () => {
  // handler errors
  server.use(function(req, res, next) {
    _response.error(res, new _error.HttpError('Route not found', 404, '404-route-found'))
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
  instace: server,
  init: _init
}