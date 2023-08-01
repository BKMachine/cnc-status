import * as database from './database';
import * as elastic from './elastic';
import logger from './logger';
import * as machines from './machines';
import * as arduino from './machines/Arduino/arduino_polling';
import * as mqtt from './machines/Focas/mqtt';
import * as mtconnect from './machines/MTConnect/mtconnect_polling';
import * as server from './server';

async function start(): Promise<void> {
  await database.connect();
  await machines.initMachines();
  await elastic.connect();
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
    elastic.disconnect,
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
