import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import logger from '../../logger';
import { mtConnectMachines as machines } from '../../machines';
import fs from 'fs';
import { filter } from 'lodash';

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
  // Filter out DeviceStreams that are not the "Agent"
  // fs.writeFileSync('example', JSON.stringify(data, null, 2), { encoding: 'utf-8' });

  const machUUID: string[] = [];
  for (let machine in machines) {
    machUUID.push(machines[machine].getUUID());
  }
  const filteredStreams = data.MTConnectStreams.Streams.DeviceStream.filter((x) =>
    machUUID.includes(x['@_uuid']),
  );

  const names = filteredStreams.map((x) => x['@_name']);
  const uuids = filteredStreams.map((x) => x['@_uuid']);
  // console.log(names);
  // console.log(uuids);

  filteredStreams.forEach((x) => {
    // find the matching machine
    const n = x['@_name'];
    const u = x['@_uuid'];
    const m = machines[n];
    if (!m) return;
    if (m.getUUID() !== u) return;
    const changes = [];
    const a = x.ComponentStream.Events.Availability['#text'];
    changes.push({ key: 'online', value: a === 'AVAILABLE' });
    const e = x.ComponentStream.Events.EmergencyStop['#text'];
    changes.push({ key: 'eStop', value: e });
    m.setStatus(changes);
  });

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
