import ArduinoMachine from './ArduinoMachine';
import FocasMachine from './FocasMachine';

const machines: { [key: string]: Machine } = {
  rd1: new FocasMachine('RD1', 'FANUC_logo.png'),
  rd2: new FocasMachine('RD2', 'FANUC_logo.png'),
  rd3: new FocasMachine('RD3', 'FANUC_logo.png'),
  rd4: new FocasMachine('RD4', 'FANUC_logo.png'),
  dl1: new FocasMachine('DL1', 'Doosan_logo.png'),
  dm1: new FocasMachine('DM1', 'Doosan_logo.png'),
  s1: new FocasMachine('S1', 'Hanwha_logo.png'),
  s2: new FocasMachine('S2', 'Hanwha_logo.png'),
  s3: new FocasMachine('S3', 'Hanwha_logo.png'),
  ml1: new ArduinoMachine('ML1', 'Mori_logo.png'),
  ml2: new ArduinoMachine('ML2', 'Mori_logo.png'),
  ml3: new ArduinoMachine('ML3', 'Mori_logo.png'),
  me1: new ArduinoMachine('ME1', 'Mitsubishi_logo.png'),
};

export default machines;
