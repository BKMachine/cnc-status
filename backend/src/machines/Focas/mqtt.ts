import _ from 'lodash';
import mqtt, { MqttClient } from 'mqtt';
import logger from '../../logger';
import { focasMachines as machines } from '../index';
import mappings from './focas_mappings';

let client: MqttClient;

export function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!process.env.MQTT_URL) throw new Error('Missing MQTT_URL environment variable.');
    client = mqtt.connect(process.env.MQTT_URL);

    client.on('connect', () => {
      logger.info('Connected to MQTT broker');
      client.subscribe('fanuc/#', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    client.on('disconnect', () => {
      logger.warn('Disconnected from the MQTT broker');
    });

    client.on('message', processMessage);
  });
}

export function disconnect() {
  if (client) {
    client.end();
  }
}

export function processMessage(topic: string, message: Buffer) {
  const machineName = topic.split('/')[1];
  if (!machineName || !machines[machineName]) return;
  const machine = machines[machineName];
  if (!machine) return;
  let data: any = {};
  try {
    data = JSON.parse(message.toString());
  } catch (e) {
    return;
  }
  const subtopic = topic.split('/').slice(2).join('/');
  if (!mappings[subtopic]) return;
  const changes: Changes = [];
  Object.keys(mappings[subtopic]).forEach((location) => {
    let value: any;
    try {
      value = get(data, location);
    } catch (e) {
      return;
    }
    if (value === undefined) return;
    const prop = mappings[subtopic][location];
    const old = machine.getValue(prop);
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
  });
  if (changes.length) {
    machine.setStatus(changes);
  }
}

const get = (object: any, path: string, defaultValue?: any) =>
  path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object);
