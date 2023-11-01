import machines from '../machines';
import client, { prefix } from './index';

export function storePerformance() {
  if (!client) return;
  let running = 0;
  let notRunning = 0;
  for (const [, value] of machines) {
    const status = value.getStatus();
    if (status === 'green') running++;
    else if (status !== 'offline') notRunning++;
  }
  const total = running + notRunning;
  client
    .index({
      index: `${prefix}performance`,
      document: {
        '@timestamp': new Date().toISOString(),
        running,
        notRunning,
        percent: Math.round(((running / total) * 100 + Number.EPSILON) * 100) / 100,
        machineCount: machines.size,
      },
    })
    .catch(() => {});
}

interface SearchResponse {
  hits: {
    total: {
      value: number;
    };
  };
}

export async function getHourly() {
  const green = await client.search({
    index: `${prefix}status-*`,
    size: 0,
    query: {
      bool: {
        must: [{ match: { status: 'green' } }],
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: 'now-1h',
              },
            },
          },
        ],
      },
    },
  });

  const greenCount = (green as SearchResponse).hits.total.value;

  const online = await client.search({
    index: `${prefix}status-*`,
    size: 0,
    query: {
      bool: {
        must_not: [{ match: { status: 'offline' } }],
        filter: [
          {
            range: {
              '@timestamp': {
                format: 'strict_date_optional_time',
                gte: 'now-1h',
              },
            },
          },
        ],
      },
    },
  });

  const onlineCount = (online as SearchResponse).hits.total.value;

  return Math.round(((greenCount / onlineCount) * 100 + Number.EPSILON) * 100) / 100;
}
