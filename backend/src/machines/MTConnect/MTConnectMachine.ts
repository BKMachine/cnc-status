import { emit } from '../../server/socket.io';

const initStatus: MTConnectStatus = {
  online: false,
};

class MTConnectMachine {
  private readonly name: string;
  private readonly brand: MachineBrand;
  private readonly status: MTConnectStatus;
  private readonly source = 'mtconnect';

  constructor(name: string, brand: MachineBrand) {
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

export default MTConnectMachine;
