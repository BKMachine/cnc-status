import type { MachineDoc } from '../../database/lib/machine/machine_model';
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

  getElasticState(): ElasticState {
    const state = this.getState() as MTConnectState;
    if (!state.online) return 'offline';
    else if (state.eStop === 'TRIGGERED') return 'red';
    else if (state.execution === 'ACTIVE') return 'green';
    else if (state.execution === 'READY') return 'yellow';
    else return 'idle';
  }
}

export default MTConnectMachine;
