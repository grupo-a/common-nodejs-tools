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
      return reject(err.response|| err);
    });
  });
};

module.exports = {
  handler
};
