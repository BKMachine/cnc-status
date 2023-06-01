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
  constructor(name: string, brand: MachineBrand) {
    super(name, brand, { ...initStatus }, 'arduino');
  }
}

export default ArduinoMachine;
