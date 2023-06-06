import Machine from '../Machine';

const initStatus: MTConnectStatus = {
  online: false,
  eStop: 'UNAVAILABLE',
  mode: 'UNAVAILABLE',
  execution: 'UNAVAILABLE',
  program: '',
  motion: 'UNAVAILABLE',
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class MTConnectMachine extends Machine {
  constructor(name: string, brand: MachineBrand, type: MachineType) {
    super(name, 'mtconnect', brand, type, { ...initStatus });
  }
}

export default MTConnectMachine;
