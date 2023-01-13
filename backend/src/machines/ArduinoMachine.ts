import { baseUrl } from '../config';
import { emit } from '../server/socket.io';

const initStatus: ArduinoStatus = {
  online: false,
  green: false,
  yellow: false,
  red: false,
  // cycle: 0,
  // lastCycle: 0,
  // lastStateTs: new Date().toISOString(),
};

class ArduinoMachine {
  private name: string;
  private image: string;
  private status: ArduinoStatus;

  constructor(name: string, image: string) {
    this.name = name;
    this.image = baseUrl + '/img/' + image;
    this.status = { ...initStatus };
  }

  getMachine() {
    return {
      name: this.name,
      source: 'arduino',
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

export default ArduinoMachine;
