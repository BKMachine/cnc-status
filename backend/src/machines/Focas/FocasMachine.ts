import { emit } from '../../server/socket.io';

const initStatus: FocasStatus = {
  online: false,
  mainProgram: '',
  mainComment: '',
  runningProgram: '',
  runningComment: '',
  mode: '',
  execution: '',
  alarms: [],
  alarms2: [],
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class FocasMachine {
  private readonly name: string;
  private readonly brand: string;
  private readonly status: FocasStatus;
  private readonly source = 'focas';

  constructor(name: string, brand: string) {
    this.name = name;
    this.brand = brand;
    this.status = { ...initStatus };
  }

  getMachine() {
    return {
      name: this.name,
      source: this.source,
      brand: this.brand,
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
