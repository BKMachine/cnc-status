import ArduinoMachine from './ArduinoMachine';
import FocasMachine from './FocasMachine';

const machines: { [key: string]: Machine } = {
  rd1: new FocasMachine('RD1', 'fanuc'),
  rd2: new FocasMachine('RD2', 'fanuc'),
  rd3: new FocasMachine('RD3', 'fanuc'),
  rd4: new FocasMachine('RD4', 'fanuc'),
  dl1: new FocasMachine('DL1', 'doosan'),
  dm1: new FocasMachine('DM1', 'doosan'),
  s1: new FocasMachine('S1', 'hanwha'),
  s2: new FocasMachine('S2', 'hanwha'),
  s3: new FocasMachine('S3', 'hanwha'),
  ml1: new ArduinoMachine('ML1', 'mori'),
  ml2: new ArduinoMachine('ML2', 'mori'),
  ml3: new ArduinoMachine('ML3', 'mori'),
  me1: new ArduinoMachine('ME1', 'mitsubishi'),
  l1: new ArduinoMachine('L1', 'mazak'),
};

export default machines;
