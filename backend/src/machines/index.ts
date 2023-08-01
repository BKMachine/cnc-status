import Machine from '../database/lib/machine';
import ArduinoMachine from './Arduino/ArduinoMachine';
import FocasMachine from './Focas/FocasMachine';
import MTConnectMachine from './MTConnect/MTConnectMachine';

const machines = new Map<string, FocasMachine | ArduinoMachine | MTConnectMachine>();
export const focasMachines = new Map<string, FocasMachine>();
export const arduinoMachines = new Map<string, ArduinoMachine>();
export const mtConnectMachines = new Map<string, MTConnectMachine>();

export function initMachines(): Promise<void> {
  return new Promise(async (resolve) => {
    const machineDocs = await Machine.list();
    machines.clear();
    focasMachines.clear();
    arduinoMachines.clear();
    mtConnectMachines.clear();
    machineDocs.forEach((doc) => {
      if (doc.source === 'focas') {
        const machine = new FocasMachine(doc);
        machines.set(machine.doc._id.toString(), machine);
        focasMachines.set(doc.location, machine);
      } else if (doc.source === 'arduino') {
        const machine = new ArduinoMachine(doc);
        machines.set(machine.doc._id.toString(), machine);
        arduinoMachines.set(doc.location, machine);
      } else if (doc.source === 'mtconnect') {
        const machine = new MTConnectMachine(doc);
        machines.set(machine.doc._id.toString(), machine);
        mtConnectMachines.set(doc.location, machine);
      }
    });
    resolve();
  });
}

export default machines;
