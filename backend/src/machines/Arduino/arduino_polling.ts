import _axios from 'axios';
import logger from '../../logger';
import arduinos from './arduino_urls';

const axios = _axios.create({
  timeout: 1000,
});

let interval: NodeJS.Timer;

export function start() {
  stop();
  interval = setInterval(() => {
    try {
      run();
    } catch (e) {
      // Do Nothing
    }
  }, 5000);
  logger.info('Started Arduino polling');
}

export function stop() {
  if (interval) {
    clearInterval(interval);
    logger.info('Stopped Arduino polling');
  }
}

function run() {
  arduinos.forEach((arduino) => {
    const machine = arduino.machine;
    if (!machine) return;

    axios
      .get(arduino.url)
      .then(({ data }) => {
        const changes: Changes = [];
        const online = machine.getStatus().online;
        if (!online) {
          changes.push({ key: 'online', value: true });
          changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
        }
        for (const key in data) {
          const value = data[key];
          const old = machine.getStatus()[key as keyof Status];
          if (old === undefined) continue;
          if (value !== old) {
            changes.push({ key, value });
            changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
          }
        }
        if (changes.find((x) => x.key === 'green' && x.value === false)) {
          const now = new Date().valueOf();
          const lastState = new Date(arduino.machine.getStatus().lastStateTs).valueOf();
          const time = now - lastState;
          changes.push({ key: 'lastCycle', value: time });
        }
        if (changes.length) {
          machine.setStatus(changes);
        }
      })
      .catch(() => {
        machine.setStatus([{ key: 'online', value: false }]);
      });
  });
}
