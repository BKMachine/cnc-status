import type { MachineDoc } from '../../database/lib/machine/machine_model';
import Machine from '../Machine';

const initState: ArduinoState = {
  online: false,
  green: false,
  yellow: false,
  red: false,
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class ArduinoMachine extends Machine {
  constructor(doc: MachineDoc) {
    super(doc, { ...initState });
  }

  getStatus(): RunningStatus {
    const state = this.getState() as ArduinoState;
    if (!state.online) return 'offline';
    else if (state.red) return 'red';
    else if (state.green) return 'green';
    else if (state.yellow) return 'yellow';
    else return 'idle';
  }
}

export default ArduinoMachine;
