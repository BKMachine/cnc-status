// import * as database from './database';
import * as arduino from './arduino_polling';
import logger from './logger';
import * as mqtt from './mqtt';
import * as mtconnect from './mtconnect_polling';
import * as server from './server';

async function start(): Promise<void> {
  // await database.connect();
  await mqtt.connect();
  arduino.start();
  mtconnect.start();
  server.start();
}

async function stop(): Promise<void> {
  const shutdownSequence = [
    server.stop,
    mtconnect.stop,
    arduino.stop,
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
