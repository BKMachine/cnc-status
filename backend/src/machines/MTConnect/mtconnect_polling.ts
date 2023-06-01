import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import _ from 'lodash';
import logger from '../../logger';
import { mtConnectMachines as machines } from '../../machines';
import mappings from './mtconnect_mappings';

let interval: NodeJS.Timer;
const parser = new XMLParser({ ignoreAttributes: false });

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

function processJSON(data: MTConnectResponse) {
  const streams = data.MTConnectStreams.Streams.DeviceStream;

  streams.forEach((x) => {
    // find the matching machine
    const deviceName = x['@_name'];
    const machine = machines[deviceName];
    if (!machine) return;
    const changes: Changes = [];
    Object.keys(mappings).forEach((location) => {
      let value: any;
      try {
        value = get(x, location);
      } catch (e) {
        return;
      }
      const prop = mappings[location];
      const old = machine.getValue(prop);
      if (prop === 'online') value = value === 'AVAILABLE';
      if (!_.isEqual(old, value)) {
        changes.push({ key: prop, value: value });
      }
    });
    if (changes.length) {
      machine.setStatus(changes);
    }
  });
}

const get = (object: any, path: string, defaultValue?: any) =>
  path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object);
