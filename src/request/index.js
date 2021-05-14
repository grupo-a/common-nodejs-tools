'use strict';

//
// dependencies
const request = require('request');

const handler = (options) => {
  return new Promise((resolve, reject) => {
    request(options, (err, result) => {
      if (err) {
        return reject(err);
      }

      if (result.statusCode >= 300) {
        try {
          const data = JSON.parse(result.body);
          data.status_code = result.statusCode;
          data.status_message = result.statusMessage;
          return reject(data);
        }
        catch(err) {
          const data = {
            message: result.body,
            status_code: result.statusCode,
            status_message: result.statusMessage
          };
          return reject(data);
        }
      }

      if (result.body) {
        if(result.body[0] == '<'){
          return resolve(result.body);
        }
        
        try{
          body = JSON.parse(result.body);
        }
        catch {
          body = result.body;
        }

        return resolve(body);
      }

      return resolve();
    });
  });
};

module.exports = {
  handler
};
