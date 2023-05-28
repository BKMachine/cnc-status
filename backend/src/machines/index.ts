import ArduinoMachine from './Arduino/ArduinoMachine';
import FocasMachine from './Focas/FocasMachine';
import MTConnectMachine from './MTConnect/MTConnectMachine';

export const focasMachines: { [key: string]: FocasMachine } = {
  rd1: new FocasMachine('RD1', 'fanuc'),
  rd2: new FocasMachine('RD2', 'fanuc'),
  rd3: new FocasMachine('RD3', 'fanuc'),
  rd4: new FocasMachine('RD4', 'fanuc'),
  dl1: new FocasMachine('DL1', 'doosan'),
  dm1: new FocasMachine('DM1', 'doosan'),
  s1: new FocasMachine('S1', 'hanwha'),
  s2: new FocasMachine('S2', 'hanwha'),
  s3: new FocasMachine('S3', 'hanwha'),
};

export const arduinoMachines: { [key: string]: ArduinoMachine } = {
  ml1: new ArduinoMachine('ML1', 'mori'),
  ml2: new ArduinoMachine('ML2', 'mori'),
  ml3: new ArduinoMachine('ML3', 'mori'),
  me1: new ArduinoMachine('ME1', 'mitsubishi'),
  mz1: new ArduinoMachine('MZ1', 'mazak'),
  mz2: new ArduinoMachine('MZ2', 'mazak'),
  dmu: new ArduinoMachine('DMU', 'mori'),
  h1: new ArduinoMachine('H1', 'haas'),
  h2: new ArduinoMachine('H2', 'haas'),
};

export const mtconnectMachines: { [key: string]: MTConnectMachine } = {
  nhx: new MTConnectMachine('NHX', 'mori'),
  dv1: new MTConnectMachine('DV', 'mori'),
};

const machines: { [key: string]: Machine } = {
  ...focasMachines,
  ...arduinoMachines,
  ...mtconnectMachines,
};

export default machines;
