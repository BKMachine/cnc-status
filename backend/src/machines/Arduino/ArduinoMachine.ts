import { MachineDoc } from '../../database/lib/machine/machine_model';
import Machine from '../Machine';

const initStatus: ArduinoState = {
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
    super(doc, { ...initStatus });
  }
}

export default ArduinoMachine;
