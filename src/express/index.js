'use strict';

//
// dependencies
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const uuid       = require('uuid');
const prometheusMiddleware = require('express-prometheus-middleware');
const http2      = require('node:http2');

//
// helpers
const _response = require('../response');
const _logger   = require('../logger');
const _error    = require('../error');

//
// config express
const app = express();
// parsing application/json
app.use(bodyParser.json({ limit: '900kb' }));
// parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// cors
app.use(cors());
// async error
require('express-async-errors');

//
// x-request-id
app.use((req, res, next) => {
  res.requestId = req.headers['X-Request-Id'] || uuid.v4();
  res.setHeader('X-Request-Id', res.requestId);

  next();
});

//
// initialize prometheus scrapping for keda autoscaler
app.use(prometheusMiddleware({
  metricsPath            : '/metrics',
  collectDefaultMetrics  : true,
  requestDurationBuckets : [0.1, 0.5, 1, 1.5],
  requestLengthBuckets   : [512, 1024, 5120, 10240, 51200, 102400],
  responseLengthBuckets  : [512, 1024, 5120, 10240, 51200, 102400]
}));

const _init = () => {
  // handler errors
  app.use((req, res, next) => {
    _response.error(res, new _error.HttpError(`Route not found - ${req.originalUrl}`, 404, '404-route-found'));
  });
  app.use((err, req, res, next) => {
    _response.error(res, err);
  });

  const port = isNaN(parseInt(process.env.PORT)) ? 3000 : process.env.PORT
  const server = http2.createServer(app);
  app.listen(port, '0.0.0.0', () => {
    _logger.info(`Listening on port ${port}`);
  });

  server.keepAlive = true;
  server.keepAliveTimeout = 600 * 1000;
  server.headersTimeout = 610 * 1000;

  return server;
}

module.exports = {
  instance: app,
  init: _init
}
