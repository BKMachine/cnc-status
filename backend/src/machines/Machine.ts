import { baseUrl } from '../config';
import { emit } from '../server/socket.io';

class Machine {
  private readonly name: string;
  private readonly brand: MachineBrand;
  private readonly status: TestStatus;
  private readonly source: string;
  private readonly logo: string;

  constructor(name: string, brand: MachineBrand, status: TestStatus, source: string) {
    this.name = name;
    this.brand = brand;
    this.status = status;
    this.source = source;
    this.logo = `${baseUrl}/img/machine_logos/${this.brand}.png`;
  }

  getMachine() {
    return {
      name: this.name,
      source: this.source,
      brand: this.brand,
      logo: this.logo,
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

export default Machine;
