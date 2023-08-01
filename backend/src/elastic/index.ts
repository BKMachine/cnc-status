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

export function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    client
      .ping()
      .then(() => {
        logger.info('Connected to Elasticsearch');
        setTimeout(run, 5000);
        resolve();
      })
      .catch((e: Error) => {
        reject(e);
      });
  });
}

export function disconnect(): Promise<void> {
  return client.close();
}

function run() {
  const timestamp = new Date().toISOString();
  const ids = [...machines.keys()];
  console.log(ids);
  /*const operations: (string | null)[] = ids.map((id) => {
    const machine = machines.get(id);
    if (!machine) return null;
    const status = machine.getState();
    const meta = { create: { _index: getIndex(machine) } };
    const body = { ...status, '@timestamp': timestamp };
    return JSON.stringify(meta) + '\n' + JSON.stringify(body);
  });
  const filteredOperations = operations.filter((x) => {
    if (x) return true;
  });
  client.bulk({ operations: filteredOperations }).catch(() => {
    // Do Nothing
  });*/
}

export async function getData(name: string, minutes: string = '5') {
  const ms = new Date().valueOf() - parseInt(minutes) * 60 * 1000;
  return client.search({
    index: getIndex(name),
    query: {
      bool: {
        filter: [{ range: { '@timestamp': { gt: ms } } }],
      },
    },
    sort: [{ '@timestamp': { order: 'desc' } }],
  });
}

function getIndex(machine: FocasMachine | ArduinoMachine | MTConnectMachine) {
  return `status-${machine.getMachine().id}`;
}
