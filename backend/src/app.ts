import * as server from './server';
import * as database from './database';
import logger from './logger';

async function start(): Promise<void> {
  await database.connect();
  server.start();
  require('./machines')
}

async function stop(): Promise<void> {
  const shutdownSequence = [
    server.stop,
    database.disconnect,
  ];

  for (let i = 0; i < shutdownSequence.length; i++) {
    try {
      await shutdownSequence[i]();
    } catch (e) {
      logger.error(e);
    }
  }
}

export default {
  start,
  stop,
};
