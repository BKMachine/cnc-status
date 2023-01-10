import Machine from './machine';
import * as mappings from './mappings';

const machines: { [key: string]: Machine } = {
  rd1: new Machine('RD1', 'FANUC_logo.png', mappings.robodrill),
  rd2: new Machine('RD2', 'FANUC_logo.png', mappings.robodrill),
  rd3: new Machine('RD3', 'FANUC_logo.png', mappings.robodrill),
  rd4: new Machine('RD4', 'FANUC_logo.png', mappings.robodrill),
  dl1: new Machine('DL1', 'Doosan_logo.png', mappings.doosanLathe),
  dm1: new Machine('DM1', 'Doosan_logo.png', mappings.doosanMill),
  s1: new Machine('S1', 'Hanwha_logo.png', mappings.hanwhaSwiss),
  s2: new Machine('S2', 'Hanwha_logo.png', mappings.hanwhaSwiss),
  s3: new Machine('S3', 'Hanwha_logo.png', mappings.hanwhaSwiss),
};

export default machines;
