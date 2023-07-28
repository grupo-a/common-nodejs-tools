'use strict';

//
// dependencies
const axios = require('axios');

const AXIOS_TIMEOUT = 30_000;

/**
 * @template D
 * @param options {import('axios').AxiosRequestConfig<D>} - Axios options
 * @returns {Promise<unknown>}
 */
const handler = async (options) => {
  if (options.uri) {
    options.url = options.uri;
    delete options.uri;
  }

  if (options.form) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  if (options.formData) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'multipart/form-data'
    }
  }

  for (const field of ['body', 'form', 'formData', 'json']) {
    if (!options[field]) {
      continue;
    }
    options.data = options[field];
    delete options[field];
  }

  try {
    const response = await axios({
      timeout: AXIOS_TIMEOUT,
      ...options
    });

    return response.data;
  } catch (err) {
    if (!err.response) {
      throw err;
    }

    if (!err.response.headers['content-type'].startsWith('application/json')) {
      const { data = null, status = null, statusText = null } = err?.response ?? {};
      throw {
        message: data,
        status: status,
        status_code: status,
        status_message: statusText
      }
    }

    throw {
      ...err.response.data,
      status: err.response.status,
      status_code: err.response.status,
      status_message: err.response.statusText
    };
  }
};

module.exports = {
  handler
};
