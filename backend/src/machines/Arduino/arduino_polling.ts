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
        const online = machine.getValue('online');
        if (!online) {
          changes.push({ key: 'online', value: true });
          changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
        }
        for (const key in data) {
          const value = data[key];
          const old = machine.getValue(key);
          if (value !== old) {
            changes.push({ key, value });
            changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
          }
        }
        if (changes.find((x) => x.key === 'green' && x.value === false)) {
          const time =
            new Date().valueOf() - new Date(arduino.machine.getValue('lastStateTs')).valueOf();
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
