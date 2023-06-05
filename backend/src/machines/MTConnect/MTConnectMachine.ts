import Machine from '../Machine';

const initStatus: MTConnectStatus = {
  online: false,
  eStop: 'ARMED',
  mode: '',
  execution: '',
  program: '',
  motion: '',
  lastStateTs: new Date().toISOString(),
};

class MTConnectMachine extends Machine {
  constructor(name: string, brand: MachineBrand) {
    super(name, brand, { ...initStatus }, 'focas');
  }
}

export default MTConnectMachine;
