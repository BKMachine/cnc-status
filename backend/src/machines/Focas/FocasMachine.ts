import { MachineDoc } from '../../database/lib/machine/machine_model';
import Machine from '../Machine';

const initStatus: FocasState = {
  online: false,
  mainProgram: '',
  mainComment: '',
  runningProgram: '',
  runningComment: '',
  mode: 'UNAVAILABLE',
  execution: 'UNAVAILABLE',
  alarms: [],
  mode2: 'UNAVAILABLE',
  execution2: 'UNAVAILABLE',
  alarms2: [],
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class FocasMachine extends Machine {
  constructor(doc: MachineDoc) {
    super(doc, { ...initStatus });
  }

  getElasticState(): ElasticState {
    const state = this.getState() as FocasState;
    if (!state.online) return 'offline';
    else if (state.alarms.concat(state.alarms2).length > 0) return 'red';
    else if (state.execution === 'ACTIVE' || state.execution2 === 'ACTIVE') return 'green';
    else if (state.execution === 'READY' || state.execution2 === 'READY') return 'yellow';
    else return 'idle';
  }
}

export default FocasMachine;
