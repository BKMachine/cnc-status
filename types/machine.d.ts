interface FocasStatus {
  online: boolean;
  mainProgram: string;
  mainComment: string;
  runningProgram: string;
  runningComment: string;
  mode: string;
  mode2: string;
  execution: string;
  execution2: string;
  alarms: Alarm[];
  alarms2: Alarm[];
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
  [key: string]: any;
}

interface Alarm {
  path: number;
  axis_code: number;
  axis: string;
  number: number;
  message: string;
  type_code: number;
  type: string;
  id: string;
  is_triggered: boolean;
}

interface FocasMapping {
  [key: string]: {
    [key: string]: string;
  };
}

interface ArduinoStatus {
  online: boolean;
  green: boolean;
  yellow: boolean;
  red: boolean;
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
  [key: string]: any;
}

interface MTConnectStatus {
  online: boolean;
  eStop: 'ARMED' | 'TRIGGERED';
  lastStateTs: string;
  [key: string]: any;
}

type FocasMachine = import('../backend/src/machines/Focas/FocasMachine');
type ArduinoMachine = import('../backend/src/machines/Arduino/ArduinoMachine');
type MTConnectMachine = import('../backend/src/machines/MTConnect/MTConnectMachine');

type Machine = FocasMachine | ArduinoMachine | MTConnectMachine;

type MachineBrand = 'fanuc' | 'mori' | 'doosan' | 'mitsubishi' | 'haas' | 'mazak' | 'hanwha';

interface Focas {
  name: string;
  brand: MachineBrand;
  source: 'focas';
  status: FocasStatus;
  index?: number;
}

interface Arduino {
  name: string;
  brand: MachineBrand;
  source: 'arduino';
  status: ArduinoStatus;
  index?: number;
}

interface MTConnect {
  name: string;
  brand: MachineBrand;
  source: 'mtconnect';
  status: MTConnectStatus;
  index?: number;
}

type MachineStatus = Focas | Arduino | MTConnect;
