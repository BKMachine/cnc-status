import { Client } from '@elastic/elasticsearch';
import logger from '../logger';
import machines from '../machines';

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD,
  },
});

let timer: NodeJS.Timeout;

export function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    client
      .ping()
      .then(() => {
        logger.info('Connected to Elasticsearch');
        timer = setInterval(run, 1000 * 10);
        resolve();
      })
      .catch((e: Error) => {
        reject(e);
      });
  });
}

export function disconnect(): Promise<void> {
  if (timer) clearInterval(timer);
  return client.close();
}

function run() {
  const timestamp = new Date().toISOString();
  const operations: string[] = [];
  for (const [key, value] of machines) {
    const state = value.getElasticState();
    const meta = { create: { _index: getIndex(key) } };
    const body = { state, '@timestamp': timestamp };
    operations.push(JSON.stringify(meta) + '\n' + JSON.stringify(body));
    // emitToRoom(key, 'elastic-status', status);
  }
  client.bulk({ operations }).catch(() => {
    logger.error('Elastic Bulk write error');
  });
}

function getIndex(id: string) {
  return `status-${id}`;
}
