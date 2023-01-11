import now from 'performance-now';
import { processMessage } from '../mqtt';

const message: Buffer = getMessage();

const start = now();

for (let i = 0; i < 100000; i++) {
  processMessage('fanuc/rd1/production/1', message);
}

const end = now();
console.log((end - start).toFixed(3));

function getMessage(): Buffer {
  const data = {
    observation: {
      time: 1673290190173,
      machine: 'rd1',
      name: 'production',
      marker: [
        {
          type: 'path',
          number: 1,
        },
      ],
    },
    state: {
      time: 2215.4447,
      data: {
        program: {
          running: {
            name: 'O1021',
            number: 1021,
            size_b: 106000,
            comment: '(HK45C_T COMP OP1)',
            modified: 1672996440000,
          },
          main: {
            name: '',
            number: 1021,
            size_b: 106000,
            comment: '(HK45C_T COMP OP1)',
            modified: 1672996440000,
          },
        },
        pieces: {
          produced: 507,
          produced_life: 1179,
          remaining: 800,
        },
        timers: {
          cycle_time_ms: 0,
        },
      },
    },
  };

  return Buffer.from(JSON.stringify(data), 'utf-8');
}
