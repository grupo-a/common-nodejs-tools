'use strict';

//
// dependencies
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const uuid       = require('uuid');
const prometheusMiddleware = require('express-prometheus-middleware');

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
    try {
      _response.error(res, new _error.HttpError(`Route not found - ${req.originalUrl}`, 404, '404-route-found'));
    } catch (err) {
      console.error('error on 404 handler', err)
      res.status(204).send('Internal Server Error');
    }
  });
  app.use((err, req, res, next) => {
    try {
      _response.error(res, err);
    } catch (err) {
      console.error('error on error handler', err)
      res.status(204).send('Internal Server Error');
    }
  });

  const port = isNaN(parseInt(process.env.PORT)) ? 3000 : process.env.PORT
  const server = app.listen(port, () => {
    _logger.info(`Listening on port ${port}`);
  });

  server.keepAliveTimeout = 72000;
  server.headersTimeout = 66000;

  return server;
}

module.exports = {
  instance: app,
  init: _init
}
