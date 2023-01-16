import fs from 'fs';
import { Client } from '@elastic/elasticsearch';
import machines from '../machines';

const client = new Client({
  node: 'https://10.1.1.2:9200',
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync('./certs/http_ca.crt'),
    rejectUnauthorized: false,
  },
});

setTimeout(() => {
  for (const machine in machines) {
    const status = machines[machine].getMachine();
    try {
      client.create({
        index: 'status',
        body: JSON.strigify(status),
      });
    } catch (e) {
      console.error(e);
    }
    break;
  }
}, 10000);
