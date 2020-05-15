'use strict';

//
// dependencies
const _logger = require('../logger');

const _createResponse = (res, body, statusCode, headers = { }) => {
  const mergeHeaders = {
    'Cache-Control': 'private, max-age=0, no-cache, no-store, must-revalidate',
    ...headers,
  };

  res.set(mergeHeaders);
  return res.status(statusCode).send(body);
}

const success = (res, body, statusCode = 200, headers = { }) => {
  return _createResponse(res, body, statusCode, headers);
}

const error = (res, error) => {
  const statusCode = error.httpStatusCode || 500;
  const body = {
    error: {
      code: error.businessStatusCode || '500_internal-error-server',
      message: error.message
    },
    requestId: res.requestId
  };
  error.requestId = res.requestId;
  _logger.error(error.message, error);
  return _createResponse(res, body, statusCode);
}

module.exports = {
  success,
  error
}