import { emit } from '../../server/socket.io';

const initStatus: MTConnectStatus = {
  online: false,
  eStop: 'ARMED',
  lastStateTs: new Date().toISOString(),
};

class MTConnectMachine {
  private readonly name: string;
  private readonly brand: MachineBrand;
  private readonly status: MTConnectStatus;
  private readonly uuid;
  private readonly source = 'mtconnect';

  constructor(name: string, brand: MachineBrand, uuid: string) {
    this.name = name;
    this.brand = brand;
    this.status = { ...initStatus };
    this.uuid = uuid;
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

  getUUID() {
    return this.uuid;
  }

  setStatus(changes: { key: string; value: any }[]) {
    changes.forEach((change) => {
      this.status[change.key] = change.value;
    });
    emit('change', { name: this.name, changes });
  }
}

export default MTConnectMachine;
