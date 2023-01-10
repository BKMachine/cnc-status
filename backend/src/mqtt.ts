import _ from 'lodash';
import mqtt, { MqttClient } from 'mqtt';
import logger from './logger';
import Machine from './machine';
import machines from './machines';

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

  client.on('message', (topic, message) => {
    const machineName = topic.split('/')[1];
    if (!machineName || !machines[machineName]) return;
    const data = JSON.parse(message.toString());
    if (!data.observation) return;
    const machine: Machine = machines[machineName];
    const mappings = machine.getMappings();
    if (!mappings) return;
    for (const prop in mappings) {
      if (mappings.hasOwnProperty(prop)) {
        const subtopic = mappings[prop].subtopic;
        if (topic !== `fanuc/${machineName}/${subtopic}`) continue;
        const location = mappings[prop].location;
        const value = _.get(data, location, undefined);
        if (value === undefined) continue;
        const old = machine.getStatus()[prop];
        if (!_.isEqual(old, value)) {
          if (prop === 'cycle') {
            if (old > value) machine.setStatus('lastCycle', old);
          }
          if (prop === 'execution') {
            if (machineName === 'rd3' && value === 'OPTIONAL_STOP') return;
            const date = new Date().toISOString();
            machine.setStatus('lastStateTs', date);
          }
          machine.setStatus(prop, value);
        }
      }
    }
  });
}

export function disconnect() {
  if (client) {
    client.end();
  }
}
