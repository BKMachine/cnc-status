import _axios from 'axios';
import logger from './logger';
import machines from './machines';

const axios = _axios.create({
  timeout: 1000,
});

const arduinos = [
  {
    url: 'http://10.30.1.25:8193',
    machine: machines.ml1,
  },
  {
    url: 'http://10.30.1.26:8193',
    machine: machines.ml2,
  },
  /*{
    url: 'http://10.30.1.27:8193',
    machine: machines.ml3,
  },*/
  {
    url: 'http://10.30.1.28:8193',
    machine: machines.me1,
  },
];

let interval: NodeJS.Timer;

export function start() {
  stop();
  interval = setInterval(() => {
    run();
  }, 5000);
  logger.info('Started Arduino polling');
}

export function stop() {
  if (interval) clearInterval(interval);
}

function run() {
  arduinos.forEach((arduino) => {
    axios
      .get(arduino.url)
      .then(({ data }) => {
        const changes = [];
        const online = arduino.machine.getValue('online');
        if (!online) {
          changes.push({ key: 'online', value: true });
          changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
        }
        for (const key in data) {
          const value = data[key];
          const old = arduino.machine.getValue(key);
          if (value !== old) {
            changes.push({ key, value });
            changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
          }
        }
        if (arduino.machine.getValue('green')) {
          const time =
            new Date().valueOf() - new Date(arduino.machine.getValue('lastStateTs')).valueOf();
          const lastCycle = arduino.machine.getValue('lastCycle');
          if (time > lastCycle) changes.push({ key: 'lastCycle', value: time });
        }
        if (changes.length) {
          arduino.machine.setStatus(changes);
        }
      })
      .catch(() => {
        arduino.machine.setStatus([{ key: 'online', value: false }]);
      });
  });
}
