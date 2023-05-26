import { emit } from '../server/socket.io';

const initStatus: ArduinoStatus = {
  online: false,
  green: false,
  yellow: false,
  red: false,
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class ArduinoMachine {
  private readonly name: string;
  private readonly brand: string;
  private readonly status: ArduinoStatus;

  constructor(name: string, brand: string) {
    this.name = name;
    this.brand = brand;
    this.status = { ...initStatus };
  }

  getMachine() {
    return {
      name: this.name,
      source: 'arduino',
      brand: this.brand,
      status: this.status,
    };
  }

  getValue(key: string) {
    return this.status[key];
  }

  setStatus(changes: { key: string; value: any }[]) {
    changes.forEach((change) => {
      const { key, value } = change;
      this.status[key] = value;
    });
    emit('change', { name: this.name, changes });
  }
}

export default ArduinoMachine;
