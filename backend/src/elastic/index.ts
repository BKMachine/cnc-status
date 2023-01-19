import fs from 'fs';
import path from 'path';
import { Client } from '@elastic/elasticsearch';
import logger from '../logger';
import machines from '../machines';

const client = new Client({
  node: process.env.ELASTIC_URL,
  //auth: {
  //username: 'elastic',
  //password: process.env.ELASTIC_PASSWORD,
  //},
  //tls: {
  //ca: fs.readFileSync(path.resolve(__dirname, '../../certs/http_ca.crt')),
  //rejectUnauthorized: false,
  //},
});

let timer: NodeJS.Timer;

export async function start(): Promise<void> {
  return new Promise((resolve) => {
    logger.info('Started Elastic collection');
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
      resolve();
    });
  });
}

export function stop() {
  if (timer) clearInterval(timer);
}

function run() {
  const timestamp = new Date().toISOString();
  const operations: string[] = Object.keys(machines).map((machine) => {
    const { status, source } = machines[machine].getMachine();
    const meta = { create: { _index: getIndex(machine) } };
    const body = { online: status.online, '@timestamp': timestamp, running: false, alarmed: false };
    if (status.online) {
      if (source === 'focas') {
        body.running = status.execution === 'ACTIVE';
        body.alarmed = status.alarms.length > 0 || status.alarms2.length > 0;
      } else if (source === 'arduino') {
        body.running = status.green;
        body.alarmed = status.red;
      }
    }
    return JSON.stringify(meta) + '\n' + JSON.stringify(body);
  });
  client.bulk({ operations }).catch(() => {
    // Do Nothing
  });
}

function getIndex(machine: string) {
  return `status-${machine}`;
}

export async function getData(name: string, minutes: string = '5') {
  const ms = new Date().valueOf() - parseInt(minutes) * 60 * 1000;
  return client.search({
    index: getIndex(name),
    body: {
      query: {
        bool: {
          filter: [{ range: { '@timestamp': { gt: ms } } }],
        },
      },
      sort: [{ '@timestamp': { order: 'desc' } }],
    },
  });
}
