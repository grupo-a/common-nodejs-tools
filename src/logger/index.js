'use strict';

//
// dependencies
const stringify = require('json-stringify-safe');

//
// ENVs
const infoEnable = process.env.LOG_INFO_ENABLE;
const warnEnable = process.env.LOG_WARN_ENABLE;
const errorEnable = process.env.LOG_ERROR_ENABLE;

const info = (message, details, requestId = null) => {
  if (infoEnable) {
    console.log(stringify({
      level: 'INFO',
      requestId,
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

/**
 * @param {*} action 
 * @param {*} who 
 * @param {*} where 
 * @param {*} data 
 */
const audit = (who, action, where, data) => {
  console.log(stringify({
    level: 'AUDIT',
    body: { 'action': action, 'who': who, 'when': Date.now(), 'where': where, 'payload': data }
  }));
};

/**  @deprecated use the "audit" method */
const auditoria = (action, who, where, context, what) => {
  console.log(stringify({
    level: 'AUDIT',
    body: { 'action': action, 'who': who, 'when': Date.now(), 'where': where, 'context': context, 'what': what }
  }));
};

/**
 * @param {string} event 
 * @param {object} data 
 */
const tracking = (event, data) => {
  console.log(stringify({
    level: 'TRACKING',
    body: { 'event': event, 'data': data, 'when': Date.now() }
  }));
}

module.exports = {
  info,
  warn,
  error,
  audit,
  auditoria,
  tracking
};