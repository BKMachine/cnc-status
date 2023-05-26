import _axios from 'axios';
import logger from '../../logger';
import { arduinoMachines as machines } from '../index';

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
  {
    url: 'http://10.30.1.27:8193',
    machine: machines.ml3,
  },
  {
    url: 'http://10.30.1.28:8193',
    machine: machines.me1,
  },
  {
    url: 'http://10.30.1.29:8193',
    machine: machines.l1,
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
  logger.info('Stopped Arduino polling');
}

function run() {
  arduinos.forEach((arduino) => {
    const machine = arduino.machine;

    axios
      .get(arduino.url)
      .then(({ data }) => {
        const changes = [];
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
