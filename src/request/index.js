'use strict';

//
// dependencies
const axios = require('axios');

const handler = (options) => {
  return new Promise((resolve, reject) => {
    axios(options).then(response => {
      return resolve(response.data);
    }).catch(err => {
      return reject(err);
    });
  });
};

module.exports = {
  handler
};
