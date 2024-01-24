import { RemoteSerialPort } from 'remote-serial-port-client';

export function start() {
  process('10.30.1.126', 5000);
}

async function process(host: string, port: number) {
  const tcp = new RemoteSerialPort({ mode: 'tcp', host, port });
  await open(tcp);
  save(await send(tcp, 200));
  save(await send(tcp, 104));
  tcp.close();
}

function open(tcp) {
  return new Promise((resolve, reject) => {
    tcp.open(function (error: Error, result: unknown) {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

async function send(tcp, code: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    tcp.write(`Q${code}\r`);
    setTimeout(() => {
      tcp.read(function (error: Error, result: Buffer) {
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

function save(thing: string[]) {
  const command = thing.shift();
  console.log('command', command);
}
