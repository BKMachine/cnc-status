import Machine from './machine';

const machines: { [key: string]: Machine } = {
  rd1: new Machine('RD1', 'FANUC_logo.png'),
  rd2: new Machine('RD2', 'FANUC_logo.png'),
  rd3: new Machine('RD3', 'FANUC_logo.png'),
  rd4: new Machine('RD4', 'FANUC_logo.png'),
  dl1: new Machine('DL1', 'Doosan_logo.png'),
  dm1: new Machine('DM1', 'Doosan_logo.png'),
  s1: new Machine('S1', 'Hanwha_logo.png'),
  s2: new Machine('S2', 'Hanwha_logo.png'),
  s3: new Machine('S3', 'Hanwha_logo.png'),
};

export default machines;
