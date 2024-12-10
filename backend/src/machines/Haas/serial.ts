import axios from 'axios';
import { RemoteSerialPort } from 'remote-serial-port-client';
import logger from '../../logger';
import { haasMachines as machines } from '../index';

let interval: NodeJS.Timeout;

export function start() {
  stop();
  interval = setInterval(() => {
    try {
      run();
    } catch (e) {
      // Do Nothing
    }
  }, 10000);
  logger.info('Started HaasSerial polling');
}

export function stop() {
  if (interval) {
    clearInterval(interval);
    logger.info('Stopped HaasSerial polling');
  }
}

function run() {
  machines.forEach((machine, location) => {
    const { hostname, protocol } = new URL(location);
    const url = protocol + '//' + hostname + '/index.htm';
    const changes: Changes = new Map();
    axios
      .get(url)
      .then(async () => {
        const state = machine.getState() as HaasState;
        const online = state.online;
        if (!online) {
          changes.set('online', true);
          changes.set('lastStateTs', new Date().toISOString());
        }
        const responses = await serial(location);
        responses.forEach((response) => {
          const command = response.shift() as HaasCommand;
          switch (command) {
            case 'MODE': {
              const old = state.mode;
              const curr = response[0] as HaasMode;
              if (old !== curr) {
                changes.set('mode', curr);
                changes.set('lastStateTs', new Date().toISOString());
              }
              break;
            }
            case 'LASTCYCLE': {
              const old = state.lastCycle;
              // Extract hours, minutes, and seconds based on the format HHHMMSS
              const hours = parseInt(response[0].substring(0, 3), 10); // First 3 digits
              const minutes = parseInt(response[0].substring(3, 5), 10); // Next 2 digits
              const seconds = parseInt(response[0].substring(5, 7), 10); // Last 2 digits
              const curr = hours * 3600 + minutes * 60 + seconds;
              if (old !== curr) {
                changes.set('lastCycle', curr);
              }
              break;
            }
            case 'STATUS': {
              const old = state.execution;
              const curr = response[0] as HaasExecution;
              if (old !== curr) {
                changes.set('execution', curr);
                changes.set('lastStateTs', new Date().toISOString());
              }
              break;
            }
            case 'PROGRAM': {
              const old = state.execution;
              const curr = response[1] as HaasExecution;
              if (old !== curr) {
                changes.set('execution', curr);
                changes.set('lastStateTs', new Date().toISOString());
              }
              break;
            }
            default:
            // Do Nothing
          }
          /*if (changes.has('yellow')) {
            const isYellow = changes.get('yellow');
            if (!isYellow) {
              const now = new Date().valueOf();
              const lastState = new Date(machine.getState().lastStateTs).valueOf();
              const time = now - lastState;
              changes.set('lastOperatorTime', time);
            }
          }*/
        });
      })
      .catch(() => {
        if (machine.getState().online) changes.set('online', false);
      })
      .finally(() => {
        if (changes.size) {
          machine.setState(changes);
          machine.updateStatus();
        }
      });
  });
}

async function serial(location: string): Promise<string[][]> {
  const { hostname, port } = new URL(location);
  const responses: string[][] = [];
  const tcp: RSPC = new RemoteSerialPort({ mode: 'tcp', host: hostname, port, reconnect: false });
  await open(tcp);
  // https://www.haascnc.com/service/troubleshooting-and-how-to/how-to/machine-data-collection---ngc.html
  responses.push(await send(tcp, 104)); // MODE, xxxxx
  responses.push(await send(tcp, 303)); // LASTCYCLE, xxxxxxx
  responses.push(await send(tcp, 500)); // PROGRAM, Oxxxxx, STATUS, PARTS, xxxxx
  tcp.close();
  return responses;
}

function open(tcp: RSPC): Promise<void> {
  return new Promise((resolve, reject) => {
    tcp.open(function (error) {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function send(tcp: RSPC, code: QCode): Promise<string[]> {
  return new Promise((resolve, reject) => {
    tcp.write(`Q${code}\r`);
    setTimeout(() => {
      tcp.read(function (error, result) {
        if (error) reject(error);
        else resolve(parse(result));
      });
    }, 500);
  });
}

function parse(result: Buffer) {
  return result
    .toString('ascii')
    .replace(/[^0-9A-Z,]/gi, '')
    .split(',');
}
