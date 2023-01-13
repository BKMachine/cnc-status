import { baseUrl } from '../config';
import { emit } from '../server/socket.io';

const initStatus: FocasStatus = {
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

class FocasMachine {
  private name: string;
  private image: string;
  private status: FocasStatus;

  constructor(name: string, image: string) {
    this.name = name;
    this.image = baseUrl + '/img/' + image;
    this.status = { ...initStatus };
  }

  getMachine() {
    return {
      name: this.name,
      source: 'focas',
      image: this.image,
      status: this.status,
    };
  }

  getValue(key: string) {
    return this.status[key];
  }

  setStatus(changes: { key: string; value: any }[]) {
    changes.forEach((change) => {
      this.status[change.key] = change.value;
    });
    emit('change', { name: this.name, changes });
  }
}

export default FocasMachine;
