'use strict';

class DbError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'DbError';
    this.formDb = {
      name: originalError.name,
      message: originalError.message,
      ...originalError
    }
  }
}

module.exports = DbError;