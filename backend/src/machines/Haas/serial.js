var RemoteSerialPort = require('remote-serial-port-client').RemoteSerialPort;

async function process(host, port) {
  const tcp = new RemoteSerialPort({ mode: 'tcp', host, port });
  await open(tcp);
  save(await send(tcp, 200));
  save(await send(tcp, 104));
  tcp.close();
}

process('10.30.1.126', 5000);

function open(tcp) {
  return new Promise((resolve, reject) => {
    tcp.open(function (error, result) {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

async function send(tcp, code) {
  return new Promise((resolve, reject) => {
    tcp.write(`Q${code}\r`);
    setTimeout(() => {
      tcp.read(function (error, result) {
        if (error) reject(error);
        else resolve(parse(result));
      });
    }, 250);
  });
}

function parse(result) {
  return result
    .toString('ascii')
    .replace(/[^0-9A-Z,]/gi, '')
    .split(',');
}

function save(thing) {
  console.log(thing);
}
