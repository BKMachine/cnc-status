import type { MachineDoc } from '../../database/lib/machine/machine_model';
import Machine from '../Machine';

const initState: HaasState = {
  online: false,
  mode: null,
  execution: null,
  lastCycle: 0,
  lastOperatorTime: 0,
  lastStateTs: new Date().toISOString(),
};

class HaasMachine extends Machine {
  constructor(doc: MachineDoc) {
    super(doc, { ...initState });
  }

  updateStatus(): void {
    const state = this.getState() as HaasState;
    let status: MachineStatus;
    if (!state.online) status = 'offline';
    else if (state.execution === 'ALARMON') status = 'red';
    // else if (state.execution === 'ACTIVE') status = 'green';
    // else if (state.mode === 'AUTOMATIC' && state.execution === 'READY') status = 'yellow';
    else status = 'idle';
    this.setStatus(status);
  }
}

export default HaasMachine;
