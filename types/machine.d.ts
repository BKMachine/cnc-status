interface FocasStatus {
  online: boolean;
  mainProgram: string;
  mainComment: string;
  runningProgram: string;
  runningComment: string;
  mode: string;
  execution: string;
  alarms: Alarm[];
  mode2: string;
  execution2: string;
  alarms2: Alarm[];
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
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
}

interface MTConnectStatus {
  online: boolean;
  eStop: 'UNAVAILABLE' | 'ARMED' | 'TRIGGERED';
  mode: 'UNAVAILABLE' | string;
  execution: 'UNAVAILABLE' | string;
  program: string;
  motion: 'UNAVAILABLE' | 'NORMAL' | 'WARNING' | 'FAULT';
  lastCycle: number;
  lastStateTs: string;
}

interface MTConnectMappings {
  [key: string]: string;
}

type Status = FocasStatus | ArduinoStatus | MTConnectStatus;

type Changes = {
  key: string;
  value: any;
}[];

type FocasMachine = import('../backend/src/machines/Focas/FocasMachine');
type ArduinoMachine = import('../backend/src/machines/Arduino/ArduinoMachine');
type MTConnectMachine = import('../backend/src/machines/MTConnect/MTConnectMachine');

type Machine = FocasMachine | ArduinoMachine | MTConnectMachine;

type MachineBrand = 'fanuc' | 'mori' | 'doosan' | 'mitsubishi' | 'haas' | 'mazak' | 'hanwha';
type MachineType = 'lathe' | 'mill' | 'swiss';
type MachineSource = 'focas' | 'arduino' | 'mtconnect';

interface Focas {
  name: string;
  brand: MachineBrand;
  source: 'focas';
  logo: string;
  status: FocasStatus;
  index?: number;
}

interface Arduino {
  name: string;
  brand: MachineBrand;
  source: 'arduino';
  logo: string;
  status: ArduinoStatus;
  index?: number;
}

interface MTConnect {
  name: string;
  brand: MachineBrand;
  source: 'mtconnect';
  logo: string;
  status: MTConnectStatus;
  index?: number;
}

type MachineStatus = Focas | Arduino | MTConnect;
