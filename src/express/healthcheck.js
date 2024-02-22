'use strict';

const { Router } = require('express');
const fs = require('fs/promises');
const logger = require('../logger/index')

/**
 * @typedef {{
 *   endpoints?: {
 *     liveness?: string,
 *     readiness?: string
 *   },
 *   healthcheckResponse?: () => any,
 *   startupHealthcheck: import('express').RequestHandler,
 *   externalHealthcheck: import('express').RequestHandler,
 *   basePath: string
 * }} HealthcheckOptions
 */

const getHealthcheckResponse = (customHealthCheck) => {
  if (!!customHealthCheck) {
    return customHealthCheck();
  }

  return {
    message: 'OK',
    build: process.env.BUILD_NUMBER || null
  };
}

/** @type {(opts: HealthcheckOptions) => import('express').Router} */
const healthcheck = (opts) => {
  if (!opts) {
    throw new Error('Missing required options');
  }

  if (opts.basePath.endsWith('/')) {
    throw new Error('basePath should not end with a trailing slash');
  }

  if (!!opts.healthcheckResponse && typeof opts.healthcheckResponse !== 'function') {
    throw new Error('healthcheckResponse should be a function');
  }

  const router = Router();

  const liveness = opts.endpoints?.liveness ?? `/healthcheck`;
  const readiness = opts.endpoints?.readiness ?? `/healthcheck/readiness`;

  const healthcheckResponse = opts.healthcheckResponse;

  router.get(liveness, (req, res) => {
    res.status(200).send(getHealthcheckResponse(healthcheckResponse));
  });

  router.get(readiness, async (req, res) => {
    try {
      await fs.access('.unhealthy');
      logger.info('Readiness UNHEALTHY', process.env.BUILD_NUMBER ?? 'unknown');
      return res.status(503).send();
    } catch (err) {
      res.status(200).send(getHealthcheckResponse(healthcheckResponse));
    }
  });

  router.get('/healthcheck/startup', opts.startupHealthcheck);
  router.get(`${opts.basePath}/healthcheck`, opts.externalHealthcheck);

  return router;
}

module.exports = healthcheck;
