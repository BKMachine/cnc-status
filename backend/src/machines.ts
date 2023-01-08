import { baseUrl } from './config';
import * as mappings from './mappings';

const status: Status = {
  online: false,
  mainProgram: '',
  mainComment: '',
  runningProgram: '',
  runningComment: '',
  tool: '',
  mode: '',
  execution: '',
  overrides: {
    feed: 0,
    rapid: 0,
    spindle: 0,
  },
  alarms: [],
  parts: 0,
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date(),
};

const machines: { [key: string]: Machine } = {
  rd1: {
    name: 'RD1',
    image: baseUrl + '/img/FANUC_logo.png',
    status,
    mappings: mappings.robodrill,
  },
  rd2: {
    name: 'RD2',
    image: baseUrl + '/img/FANUC_logo.png',
    status,
    mappings: mappings.robodrill,
  },
  rd3: {
    name: 'RD3',
    image: baseUrl + '/img/FANUC_logo.png',
    status,
    mappings: mappings.robodrill,
  },
  rd4: {
    name: 'RD4',
    image: baseUrl + '/img/FANUC_logo.png',
    status,
    mappings: mappings.robodrill,
  },
  dl1: {
    name: 'DL1',
    image: baseUrl + '/img/Doosan_logo.png',
    status,
    mappings: mappings.doosanLathe,
  },
  dm1: {
    name: 'DM1',
    image: baseUrl + '/img/Doosan_logo.png',
    status,
    mappings: mappings.doosanMill,
  },
  s1: {
    name: 'S1',
    image: baseUrl + '/img/Hanwha_logo.png',
    status,
    mappings: mappings.hanwhaSwiss,
  },
  s2: {
    name: 'S2',
    image: baseUrl + '/img/Hanwha_logo.png',
    status,
    mappings: mappings.hanwhaSwiss,
  },
  s3: {
    name: 'S3',
    image: baseUrl + '/img/Hanwha_logo.png',
    status,
    mappings: mappings.hanwhaSwiss,
  },
};

export default machines;
