/* global getAppData */
import { resolver } from '../resolver';
import Raven from 'raven-js';

function sendResponse(response, code = 200) {
  return resolver({ code, response });
};

function log(...msg) {
  console.log(...msg);
}

function throwError(reason) {
  console.warn(reason);
  Raven.captureException(new Error('reason'));
  return sendResponse(reason, 500);
}

function appData() {
  return (typeof getAppData === 'function') ? getAppData() : {
    platform: 'ios',
    bundleIdentifier: 'com.river',
    accountId: 338,
    broadcasterId: 371,
    uuid: "uuid",
  };
}

export default {
  log,
  throwError,
  sendResponse,
  appData,
};