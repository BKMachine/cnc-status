import ArduinoMachine from './Arduino/ArduinoMachine';
import FocasMachine from './Focas/FocasMachine';
import MTConnectMachine from './MTConnect/MTConnectMachine';

export const focasMachines = {
  rd1: new FocasMachine('RD1', 'fanuc', 'mill'),
  rd2: new FocasMachine('RD2', 'fanuc', 'mill'),
  rd3: new FocasMachine('RD3', 'fanuc', 'mill'),
  rd4: new FocasMachine('RD4', 'fanuc', 'mill'),
  dl1: new FocasMachine('DL1', 'doosan', 'lathe'),
  dm1: new FocasMachine('DM1', 'doosan', 'mill'),
  s1: new FocasMachine('S1', 'hanwha', 'swiss', 2),
  s2: new FocasMachine('S2', 'hanwha', 'swiss', 2),
  s3: new FocasMachine('S3', 'hanwha', 'swiss', 2),
};

export const arduinoMachines = {
  ml1: new ArduinoMachine('ML1', 'mori', 'lathe'),
  ml2: new ArduinoMachine('ML2', 'mori', 'lathe'),
  ml3: new ArduinoMachine('ML3', 'mori', 'lathe'),
  me1: new ArduinoMachine('ME1', 'mitsubishi', 'lathe'),
  mz1: new ArduinoMachine('MZ1', 'mazak', 'lathe'),
  mz2: new ArduinoMachine('MZ2', 'mazak', 'mill'),
  dmu: new ArduinoMachine('DMU', 'mori', 'mill'),
  h1: new ArduinoMachine('H1', 'haas', 'mill'),
  h2: new ArduinoMachine('H2', 'haas', 'mill'),
};

export const mtConnectMachines = {
  nhx: new MTConnectMachine('NHX', 'mori', 'mill'),
  dv: new MTConnectMachine('DV', 'mori', 'mill'),
};

const machines = {
  ...focasMachines,
  ...arduinoMachines,
  ...mtConnectMachines,
};

export default machines;
