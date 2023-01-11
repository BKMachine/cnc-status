import _ from 'lodash';
import mqtt, { MqttClient } from 'mqtt';
import logger from './logger';
import Machine from './machine';
import machines from './machines';
import mappings from './mappings';

let client: MqttClient;

export function connect() {
  client = mqtt.connect(process.env.MQTT_URL);

  client.on('connect', () => {
    logger.info('Connected to MQTT broker');
    client.subscribe('fanuc/#', (err) => {
      if (err) logger.error(err);
    });
  });

  client.on('disconnect', () => {
    logger.warn('Disconnected from the MQTT broker');
  });

  client.on('message', processMessage);
}

export function disconnect() {
  if (client) {
    client.end();
  }
}

export function processMessage(topic: string, message: Buffer) {
  const machineName = topic.split('/')[1];
  if (!machineName || !machines[machineName]) return;
  const machine: Machine = machines[machineName];
  let data: any = {};
  try {
    data = JSON.parse(message.toString());
  } catch (e) {
    return;
  }
  const subtopic = topic.split('/').slice(2).join('/');
  if (!mappings[subtopic]) return;
  const changes: { key: string; value: string }[] = [];
  Object.keys(mappings[subtopic]).forEach((location) => {
    let value: any;
    try {
      value = data[location];
    } catch (e) {
      return;
    }
    if (value === undefined) return;
    const prop = mappings[subtopic][location];
    const old = machines[machineName].getValue(prop);
    if (!_.isEqual(old, value)) {
      if (prop === 'cycle') {
        if (old > value) changes.push({ key: 'lastCycle', value: old });
      }
      if (prop === 'execution') {
        if (value === 'OPTIONAL_STOP') return;
        const date = new Date().toISOString();
        changes.push({ key: 'lastStateTs', value: date });
      }
      changes.push({ key: prop, value: value });
    }
    if (changes.length) {
      machine.setStatus(changes);
    }
  });
}
