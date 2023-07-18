import { MachineDoc } from '../../database/lib/machine/machine_model';
import Machine from '../Machine';

const initStatus: MTConnectState = {
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
  constructor(doc: MachineDoc) {
    super(doc, { ...initStatus });
  }
}

export default MTConnectMachine;
