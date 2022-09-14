const loadPG = () => {
  const AWSXRay = require('aws-xray-sdk');
  return AWSXRay.capturePostgres(require('pg'));
}

module.exports = {
  loadPG
};