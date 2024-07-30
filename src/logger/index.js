'use strict';

//
// dependencies
const stringify = require('json-stringify-safe');
const uuid = require('uuid')

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
 * @param {Object} event - The details of the event.
 * @param {string} event.name - The name of the event.
 * @param {string} event.eventId - The unique ID of the event.
 * @param {string} event.sourceSystem - The source system of the event.
 * @param {string} event.sourceUrl - The source URL of the event.
 * @param {Object} user - The details of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.externalId - The external ID of the user.
 * @param {string} user.name - The name of the user.
 * @param {Object} metadata - Additional metadata for the event.
*/ 
const tracking = (event, user, metadata) => {
  console.log(stringify({
    level: 'TRACKING',
    body: { 
      event: event.name,
      eventId: event.id ?? uuid.v4(),
      sourceSystem: event.sourceSystem,
      sourceUrl: event.sourceUrl,
      user,
      metadata, 
      when: Date.now() 
    }
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