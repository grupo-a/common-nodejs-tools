'use strict';

//
// dependencies
const axios = require('axios');

const handler = (options) => {
  return new Promise((resolve, reject) => {
    if (options.uri) {
      options.url = options.uri;
      delete options.uri;
    }
    
    axios(options).then(response => {
      return resolve(response.data);
    }).catch(err => {
      if (err.response) {
        const messageError = {
          ... err.response.data,
          status: err.response.status,
          statusMessage: err.response.statusText
        }
        return reject(messageError);
      } else {
        return reject(err);
      }
      
    });
  });
};

module.exports = {
  handler
};
