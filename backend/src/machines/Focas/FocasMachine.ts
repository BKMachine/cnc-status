import Machine from '../Machine';

const initStatus: FocasStatus = {
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
  constructor(name: string, brand: MachineBrand, type: MachineType, paths = 1) {
    super(name, 'focas', brand, type, { ...initStatus }, paths);
  }
}

export default FocasMachine;
