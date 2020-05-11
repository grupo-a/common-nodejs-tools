'use strict';

class HttpError extends Error {
  constructor(message, httpStatusCode, businessStatusCode) {
    super(message);
    this.name = 'HttpError';
    this.httpStatusCode = httpStatusCode;
    this.businessStatusCode = businessStatusCode;
  }
}

module.exports = HttpError;