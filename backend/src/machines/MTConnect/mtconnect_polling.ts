import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import logger from '../../logger';
import { mtconnectMachines as machines } from '../../machines';

let interval: NodeJS.Timer;
const parser = new XMLParser();

export function start() {
  if (!process.env.MTCONNECT_URL) throw new Error('Missing MTCONNECT_URL environment variable.');
  stop();
  interval = setInterval(() => {
    run();
  }, 5000);
  logger.info('Started MTConnect polling');
}

export function stop() {
  if (interval) {
    clearInterval(interval);
    logger.info('Stopped MTConnect polling');
  }
}

function run() {
  axios
    .get(process.env.MTCONNECT_URL, { headers: { Accept: 'application/xml' } })
    .then(({ data }) => {
      // Parse XML string to json
      try {
        processJSON(parser.parse(data));
      } catch (e) {
        // Do Nothing - Wait until next query
      }
    })
    .catch(() => {
      // MTConnect not responding - set all mtconnect machines to offline
      for (const key in machines) {
        const machine = machines[key];
        if (!machine) continue;
        machine.setStatus([{ key: 'online', value: false }]);
      }
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function processJSON(data: MTConnect) {
  // Filter out DeviceStreams that are not the "Agent"
  /*const streams = data.MTConnectStreams.Streams[0].DeviceStream.filter((x) => x.$.name !== 'Agent');
  const machineNames = Object.keys(machines);
  streams.forEach((stream) => {
    const name = stream.$.name;
    if (!machineNames.includes(name)) return;
    const machine = machines[name];
    const changes: { key: string; value: any }[] = [];
    if (machine.getValue('online') === false) changes.push({ key: 'online', value: true });
    // MORE THINGS

    if (changes.length) machine.setStatus(changes);
  });*/
}
