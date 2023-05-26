import axios from 'axios';
import logger from './logger';

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
    .get(process.env.MTCONNECT_URL)
    .then(({ data }: { data: MTConnect }) => {
      // console.log(data.MTConnectStreams.Streams.DeviceStream[0].ComponentStream);
    })
    .catch(() => {
      // TODO show mtconnect machines as offline
    });
}
