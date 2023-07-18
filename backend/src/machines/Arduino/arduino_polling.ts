import _axios from 'axios';
import logger from '../../logger';
import { getArduinoMachines } from '../index';

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
  const machines = getArduinoMachines();
  machines.forEach((machine, location) => {
    axios
      .get(location)
      .then(({ data }: { data: ArduinoResponse }) => {
        const changes: Changes = [];
        const state = machine.getState() as ArduinoState;
        const online = state.online;
        if (!online) {
          changes.push({ key: 'online', value: true });
          changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
        }
        for (const key in data) {
          const value = data[key as keyof ArduinoResponse];
          const old = state[key as keyof ArduinoState];
          if (old === undefined) continue;
          if (value !== old) {
            changes.push({ key: key as keyof ArduinoState, value });
            changes.push({ key: 'lastStateTs', value: new Date().toISOString() });
          }
        }
        if (changes.find((x) => x.key === 'green' && x.value === false)) {
          const now = new Date().valueOf();
          const lastState = new Date(machine.getState().lastStateTs).valueOf();
          const time = now - lastState;
          changes.push({ key: 'lastCycle', value: time });
        }
        if (changes.length) {
          machine.setState(changes);
        }
      })
      .catch(() => {
        machine.setState([{ key: 'online', value: false }]);
      });
  });
}
