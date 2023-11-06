import _axios from 'axios';
import _ from 'lodash';
import logger from '../../logger';
import { arduinoMachines as machines } from '../index';
import { emit } from '../../server/socket.io';

const axios = _axios.create({
  timeout: 1000,
});

let interval: NodeJS.Timeout;

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
  machines.forEach((machine, location) => {
    const changes: Changes = new Map();
    axios
      .get(location)
      .then(({ data }: { data: ArduinoResponse }) => {
        const state = machine.getState() as ArduinoState;
        const online = state.online;
        if (!online) {
          changes.set('online', true);
          changes.set('lastStateTs', new Date().toISOString());
        }
        for (const key in data) {
          const value = data[key as keyof ArduinoResponse];
          const old = state[key as keyof ArduinoState];
          if (old === undefined) continue;
          if (!_.isEqual(old, value)) {
            changes.set(key as MachineKey, value);
            changes.set('lastStateTs', new Date().toISOString());
          }
        }
        if (changes.has('green')) {
          const isGreen = changes.get('green');
          if (!isGreen) {
            const now = new Date().valueOf();
            const lastState = new Date(machine.getState().lastStateTs).valueOf();
            const time = now - lastState;
            changes.set('lastCycle', time);
          }
        }
      })
      .catch(() => {
        if (machine.getState().online) changes.set('online', false);
      })
      .finally(() => {
        if (changes.size) {
          machine.setState(changes);
          const status = machine.getStatus();
          emit('status', { id: machine.doc._id, status });
        }
      });
  });
}
