import axios from 'axios';
import { parseString } from 'xml2js';
import logger from '../../logger';
import { mtconnectMachines as machines } from '../../machines';

let interval: NodeJS.Timer;

export function start() {
  if (!process.env.MTCONNECT_URL) throw new Error('Missing MTCONNECT_URL environment variable.');
  stop();
  interval = setInterval(() => {
    run();
  }, 5000);
  logger.info('Started MTConnect polling');
}

export function stop() {
  if (interval) clearInterval(interval);
  logger.info('Stopped MTConnect polling');
}

function run() {
  axios
    .get(process.env.MTCONNECT_URL, { headers: { Accept: 'application/xml' } })
    .then(({ data }) => {
      // Parse XML string to json
      parseString(data, function (err, result: MTConnect) {
        if (err) logger.error(err);
        else processJSON(result);
      });
    })
    .catch(() => {
      // MTConnect not responding - set all mtconnect machines to offline
      for (const key in machines) {
        const machine = machines[key];
        machine.setStatus([{ key: 'online', value: false }]);
      }
    });
}

function processJSON(data: MTConnect) {
  // Filter out DeviceStreams that are not the "Agent"
  const streams = data.MTConnectStreams.Streams[0].DeviceStream.filter((x) => x.$.name !== 'Agent');
  const machineNames = Object.keys(machines);
  streams.forEach((stream) => {
    const name = stream.$.name;
    if (!machineNames.includes(name)) return;
    const machine = machines[name];
    const changes: { key: string; value: any }[] = [];
    if (machine.getValue('online') === false) changes.push({ key: 'online', value: true });
    // MORE THINGS

    if (changes.length) machine.setStatus(changes);
  });
}
