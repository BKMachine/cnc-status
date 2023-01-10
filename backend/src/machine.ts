import { baseUrl } from './config';
import { emit } from './server/socket.io';

const initStatus: Status = {
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
  alarms2: [],
  parts: 0,
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class Machine {
  private name: string;
  private image: string;
  private mappings: Mapping;
  private status: Status;

  constructor(name: string, image: string, mappings: Mapping) {
    this.name = name;
    this.image = baseUrl + '/img/' + image;
    this.mappings = mappings;
    this.status = { ...initStatus };
  }

  getMachine() {
    return {
      name: this.name,
      image: this.image,
      status: this.status,
    };
  }

  getStatus(): Status {
    return this.status;
  }

  getMappings(): Mapping | undefined {
    return this.mappings;
  }

  setStatus(key: string, value: any) {
    this.status[key] = value;
    emit('change', { name: this.name, key, value });
  }
}

export default Machine;
