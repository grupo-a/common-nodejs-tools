'use strict';

//
// dependencies
const stringify = require('json-stringify-safe');

//
// ENVs
const infoEnable = process.env.LOG_INFO_ENABLE;
const warnEnable = process.env.LOG_WARN_ENABLE;
const errorEnable = process.env.LOG_ERROR_ENABLE;

const info = (message, details) => {
  if (infoEnable) {
    console.log(stringify({
      level: 'INFO',
      message,
      details
    }));
  }
};

const warn = (message, details) => {
  if (warnEnable) {
    console.warn(stringify({
      level: 'WARN',
      message,
      details
    }));
  }
};

const error = (message, error) => {
  if (errorEnable) {
    console.error(stringify({
      level: 'ERROR',
      message,
      error: {
        name: error.name,
        stack: error.stack,
        ...error
      }
    }));
  }
};

const audit = (uuid, action, payloadWhere, payloadData) => {
  console.log(stringify({
    level: 'AUDIT',
    body: { 'what': action, 'who': uuid, 'when': Date.now(), 'where': payloadWhere, 'payload': payloadData }
  }));
};

const auditoria = (action, who, where, context, what) => {
  console.log(stringify({
    level: 'AUDIT',
    body: { 'action': action, 'who': who, 'when': Date.now(), 'where': where, 'context': context, 'what': what }
  }));
};

module.exports = {
  info,
  warn,
  error,
  audit,
  auditoria
};