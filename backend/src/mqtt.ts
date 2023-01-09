import _ from 'lodash';
import mqtt, { MqttClient } from 'mqtt';
import logger from './logger';
import machines from './machines';
import { emit } from './server/socket.io';

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
    const machine = topic.split('/')[1];
    if (!machine) return;
    const data = JSON.parse(message.toString());
    if (!data.observation) return;
    const { mappings } = machines[machine];
    for (const key in mappings) {
      if (mappings.hasOwnProperty(key)) {
        const subtopic = mappings[key].subtopic;
        if (topic !== `fanuc/${machine}/${subtopic}`) continue;
        const location = mappings[key].location;
        const value = _.get(data, location, undefined);
        if (value === undefined) continue;
        const old = machines[machine].status[key];
        if (!_.isEqual(old, value)) {
          const newStatus = { status: { [key]: value } };
          if (key === 'cycle') {
            if (value < old) newStatus.status.lastCycle = old;
          }
          if (key === 'execution') {
            newStatus.status.lastStateTs = new Date();
          }
          machines[machine] = _.merge({}, machines[machine], newStatus);
          emit('change', { name: machines[machine].name, status: newStatus.status });
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
