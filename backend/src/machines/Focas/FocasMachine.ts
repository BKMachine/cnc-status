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
}

export default FocasMachine;
