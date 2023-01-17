// import * as database from './database';
import * as arduino from './arduino_polling';
import * as elastic from './elastic';
import logger from './logger';
import * as mqtt from './mqtt';
import * as server from './server';

async function start(): Promise<void> {
  // await database.connect();
  mqtt.connect();
  server.start();
  arduino.start();
  elastic.start();
}

async function stop(): Promise<void> {
  const shutdownSequence = [
    elastic.stop,
    arduino.stop,
    server.stop,
    mqtt.disconnect,
    // database.disconnect,
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
