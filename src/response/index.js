'use strict';

//
// dependencies
const _logger = require('../logger');
const _error  = require('../error');

//
// consts
const INTERNAL_ERROR_MESSAGE = 'Internal server error';

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
  // a thrown primitive (throw 'text') has no fields to read or to set
  if (error === null || typeof error !== 'object') {
    error = new Error(String(error));
  }

  const statusCode = error.httpStatusCode || 500;
  // only an HttpError has a message written for the client; the message of any other 5xx stays only in the log
  const isInternal = !(error instanceof _error.HttpError) && statusCode >= 500;
  const body = {
    error: {
      code: error.businessStatusCode || '500_internal-error-server',
      message: isInternal ? INTERNAL_ERROR_MESSAGE : error.message
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