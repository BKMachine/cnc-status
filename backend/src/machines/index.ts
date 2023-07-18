import Machine from '../database/lib/machine';
import ArduinoMachine from './Arduino/ArduinoMachine';
import FocasMachine from './Focas/FocasMachine';
import MTConnectMachine from './MTConnect/MTConnectMachine';

const focasMachines = new Map<string, FocasMachine>();
const arduinoMachines = new Map<string, ArduinoMachine>();
const mtConnectMachines = new Map<string, MTConnectMachine>();

export async function initMachines() {
  const machines = await Machine.list();
  focasMachines.clear();
  arduinoMachines.clear();
  mtConnectMachines.clear();
  machines.forEach((machine) => {
    if (machine.source === 'focas') {
      focasMachines.set(machine.location, new FocasMachine(machine));
    } else if (machine.source === 'arduino') {
      arduinoMachines.set(machine.location, new ArduinoMachine(machine));
    } else if (machine.source === 'mtconnect') {
      mtConnectMachines.set(machine.location, new MTConnectMachine(machine));
    }
  });
}

function getMachines(): Map<string, FocasMachine | ArduinoMachine | MTConnectMachine> {
  return new Map([...focasMachines, ...arduinoMachines, ...mtConnectMachines]);
}

export function getFocasMachines() {
  return focasMachines;
}

export function getArduinoMachines() {
  return arduinoMachines;
}

export function getMTConnectMachines() {
  return mtConnectMachines;
}

export default getMachines;
