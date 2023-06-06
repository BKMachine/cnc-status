import Machine from '../Machine';

const initStatus: ArduinoStatus = {
  online: false,
  green: false,
  yellow: false,
  red: false,
  cycle: 0,
  lastCycle: 0,
  lastStateTs: new Date().toISOString(),
};

class ArduinoMachine extends Machine {
  constructor(name: string, brand: MachineBrand, type: MachineType) {
    super(name, 'arduino', brand, type, { ...initStatus });
  }
}

export default ArduinoMachine;
