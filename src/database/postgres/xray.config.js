const enableXray = () => (process.env.NODE_ENV === 'production');

const loadPG = () => {
  if(enableXray()) {
    const AWSXRay = require('aws-xray-sdk');
    return AWSXRay.capturePostgres(require('pg'));
  }

  return require('pg');
}

module.exports = {
  loadPG
};