import Machine from '../Machine';

const initStatus: FocasStatus = {
  online: false,
  mainProgram: '',
  mainComment: '',
  runningProgram: '',
  runningComment: '',
  mode: '',
  execution: '',
  alarms: [],
  mode2: '',
  execution2: '',
  alarms2: [],
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class FocasMachine extends Machine {
  constructor(name: string, brand: MachineBrand, type: MachineType) {
    super(name, 'focas', brand, type, { ...initStatus });
  }
}

export default FocasMachine;
