import logger from '../logger';
import machines from '../machines';
import client, { prefix } from './index';

export function storeMachineStatus() {
  const timestamp = new Date().toISOString();
  const operations: string[] = [];
  for (const [key, value] of machines) {
    const status = value.getStatus();
    const meta = { create: { _index: getIndex(key) } };
    const body = { status, '@timestamp': timestamp };
    operations.push(JSON.stringify(meta) + '\n' + JSON.stringify(body));
  }
  client.bulk({ operations }).catch(() => {
    logger.error('Elastic Bulk write error');
  });
}

function getIndex(id: string) {
  return `${prefix}status-${id}`;
}
