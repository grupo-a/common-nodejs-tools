'use strict';

//
// dependencies
const axios = require('axios');

const AXIOS_TIMEOUT = 30_000;

/**
 * @template D - The "data" argument type
 * @param options {import('axios').AxiosRequestConfig<D>} - Axios options
 * @returns {Promise<unknown>}
 */
const handler = (options) => {
  if (options.uri) {
    options.url = options.uri;
    delete options.uri;
  }

  return axios({
    timeout: AXIOS_TIMEOUT,
    ...options
  }).then(response => {
    if (response.data) {
      if (response.data[0] === '<') {
        return response.data;
      }
      try {
        return JSON.parse(response.data);
      } catch {
        return response.data;
      }
    }

    return response.data;
  }).catch(err => {
    try {
      const data = JSON.parse(err.response.data);
      data.status = err.response.status;
      data.status_code = err.response.status;
      data.status_message = err.response.statusText;
      return data;
    } catch (ignored) {
      return {
        message: err.response.data,
        status_code: err.response.status,
        status_message: err.response.statusText
      };
    }
  });
};

module.exports = {
  handler
};
