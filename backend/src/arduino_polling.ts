import _axios from 'axios';
import machines from './machines';

const axios = _axios.create({
  timeout: 500,
});

const arduinos = [
  {
    url: 'http://10.8.4.133:80',
    machine: machines.ml1,
  },
];

let interval: NodeJS.Timer;

export function start() {
  stop();
  interval = setInterval(() => {
    run();
  }, 2000);
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
        if (!online) changes.push({ key: 'online', value: true });
        for (const key in data) {
          const value = data[key];
          const old = arduino.machine.getValue(key);
          if (value !== old) {
            changes.push({ key, value });
          }
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
