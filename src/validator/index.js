'use strict';

//
// dependencies
const jsonschema = require('jsonschema');

//
// error models
const _error = require('../error');

const buildResponseErrorMessage = (errors) => {
  let responseMessage = '';
  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];

    if (error.property == 'instance') {
      responseMessage += error.message.replace(/"/g, '');
    } else {
      error.property = error.property.replace('instance.', '');
      responseMessage += `${error.property} ${error.message.replace(/"/g, '')}`;
    }
    if (i < errors.length - 1) {
      responseMessage += ' || ';
    }
  }
  throw new _error.HttpError(responseMessage, 400, '400_bad-request-body');
};

const validate = (schema, jsonObject) => {
  const validator = new jsonschema.Validator();
  let validatorResult = validator.validate(jsonObject, schema);

  if (validatorResult.errors.length > 0) {
    buildResponseErrorMessage(validatorResult.errors);
  }

  return validatorResult.instance;
};

module.exports = {
  validate
};