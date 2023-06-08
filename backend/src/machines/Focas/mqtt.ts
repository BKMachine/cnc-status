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
  // Extract the machine name from the mqtt topic
  const machineName = topic.split('/')[1];

  // Ensure we have a registered machine
  if (!machineName || !machines[machineName as keyof typeof machines]) return;
  const machine = machines[machineName as keyof typeof machines];
  if (!machine) return;

  // Try to parse the message buffer to JSON
  let data: any = {};
  try {
    data = JSON.parse(message.toString());
  } catch (e) {
    return;
  }

  // Extract the subtopic from the mqtt topic
  const subtopic = topic.split('/').slice(2).join('/');
  // Only process subtopics we have mapped
  if (!mappings[subtopic]) return;

  // Loop through the mapped subtopics and see if any data values have changed
  const changes: Changes = [];
  Object.keys(mappings[subtopic]).forEach((location) => {
    let value: any;
    // Try to get the nested value via the mapped subtopic
    try {
      value = get(data, location);
    } catch (e) {
      return;
    }
    if (value === undefined) return;

    // Compare the old property value to the new property value
    const prop = mappings[subtopic][location] as keyof FocasStatus;
    const old = machine.getStatus()[prop as keyof Status];
    if (old === undefined) return;
    if (!_.isEqual(old, value)) {
      // If the current cycle time is smaller than previously seen
      // then a new part has been started and the old cycle time is considered the 'last' cycle time
      if (prop === 'cycle') {
        if (old > value) changes.push({ key: 'lastCycle', value: old });
      }
      // If the execution mode has changed the push a new lastStateTs value
      if (prop === 'execution') {
        // if (value === 'OPTIONAL_STOP') return; // TODO: is this needed???
        changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
      }
      // Push the newly changed value
      changes.push({ key: prop, value: value });
    }
  });

  // Update machine status if there are any changes
  if (changes.length) {
    machine.setStatus(changes);
  }
}

const get = (object: any, path: string, defaultValue?: any) =>
  path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object);
