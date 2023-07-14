import { baseUrl } from '../config';
import { emit } from '../server/socket.io';

class Machine {
  private readonly name: string;
  private readonly source: MachineSource;
  private readonly brand: MachineBrand;
  private readonly type: MachineType;
  private readonly logo: string;
  private readonly status: Status;
  private readonly paths: number;

  constructor(
    name: string,
    source: MachineSource,
    brand: MachineBrand,
    type: MachineType,
    status: Status,
    paths = 1,
  ) {
    this.name = name;
    this.source = source;
    this.brand = brand;
    this.type = type;
    this.logo = `${baseUrl}/img/machine_logos/${this.brand}.png`;
    this.status = status;
    this.paths = paths;
  }

  getMachine() {
    return {
      name: this.name,
      source: this.source,
      brand: this.brand,
      type: this.type,
      logo: this.logo,
      status: this.status,
      paths: this.paths,
    };
  }

  getStatus() {
    return this.status;
  }

  setStatus(changes: { key: string; value: any }[]) {
    changes.forEach((change) => {
      const { key, value } = change;
      this.status[key as keyof Status] = value as never;
    });
    emit('change', { name: this.name, changes });
  }
}

export default Machine;
