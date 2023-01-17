import fs from 'fs';
import path from 'path';
import { Client } from '@elastic/elasticsearch';
import machines from '../machines';

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(path.resolve(__dirname, './certs/http_ca.crt')),
    rejectUnauthorized: false,
  },
});

let timer: NodeJS.Timer;

export function start() {
  client.cat.indices({ h: 'index' }).then((data) => {
    const indexes = data
      .toString()
      .split('\n')
      .map((x) => x.trim());
    Object.keys(machines).forEach((machine) => {
      if (!indexes.includes(getIndex(machine))) {
        // Add index for new machine? //TODO
        console.log('missing index', getIndex(machine));
      }
    });
    stop();
    timer = setInterval(run, 5000);
  });
}

export function stop() {
  if (timer) clearInterval(timer);
}

function run() {
  const timestamp = new Date().toISOString();
  const operations: string[] = Object.keys(machines).map((machine) => {
    const status = machines[machine].getMachine().status;
    const meta = { create: { _index: getIndex(machine) } };
    const body = { ...status, '@timestamp': timestamp };
    return JSON.stringify(meta) + '\n' + JSON.stringify(body);
  });
  client.bulk({ operations }).catch(() => {
    // Do Nothing
  });
}

function getIndex(machine: string) {
  return `status-${machine}`;
}
