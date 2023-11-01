interface FocasState {
  online: boolean;
  mainProgram: string;
  mainComment: string;
  runningProgram: string;
  runningComment: string;
  mode: Mode;
  execution: Execution;
  alarms: Alarm[];
  mode2: Mode;
  execution2: Execution;
  alarms2: Alarm[];
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
}

type Mode = 'AUTOMATIC' | 'EDIT' | 'MANUAL' | 'MANUAL_DATA_INPUT' | 'UNAVAILABLE';
type Execution =
  | 'ACTIVE'
  | 'FEED_HOLD'
  | 'INTERRUPTED'
  | 'OPTIONAL_STOP'
  | 'PROGRAM_STOPPED'
  | 'READY'
  | 'STOPPED'
  | 'UNAVAILABLE';

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

interface ArduinoState {
  online: boolean;
  green: boolean;
  yellow: boolean;
  red: boolean;
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
}

interface ArduinoResponse {
  online: boolean;
  green: boolean;
  yellow: boolean;
  red: boolean;
}

interface MTConnectState {
  online: boolean;
  eStop: 'UNAVAILABLE' | 'ARMED' | 'TRIGGERED';
  mode: Mode;
  execution: Execution;
  program: string;
  motion: 'UNAVAILABLE' | 'NORMAL' | 'WARNING' | 'FAULT';
  lastCycle: number;
  lastStateTs: string;
}

interface MTConnectMappings {
  [key: string]: string;
}

type MachineState = FocasState | ArduinoState | MTConnectState;
type MachineKey = keyof FocasState | keyof ArduinoState | keyof MTConnectState;

type Changes  = Map<MachineKey, any>

type FocasMachine = import('../backend/src/machines/Focas/FocasMachine');
type ArduinoMachine = import('../backend/src/machines/Arduino/ArduinoMachine');
type MTConnectMachine = import('../backend/src/machines/MTConnect/MTConnectMachine');

// type Machine = FocasMachine | ArduinoMachine | MTConnectMachine;

type MachineBrand = 'fanuc' | 'mori' | 'doosan' | 'mitsubishi' | 'haas' | 'mazak' | 'hanwha';
type MachineType = 'lathe' | 'mill' | 'swiss';
type MachineSource = 'focas' | 'arduino' | 'mtconnect';

interface Focas {
  id: string,
  name: string,
  serialNumber: string,
  brand: MachineBrand,
  model: string;
  source: 'focas',
  type: MachineType,
  paths: '1' | '2',
  location: string,
  logo: string,
  state: FocasState,
  index?: number;
  status: RunningStatus
}

interface Arduino {
  id: string,
  name: string,
  serialNumber: string,
  brand: MachineBrand,
  model: string;
  source: 'arduino',
  type: MachineType,
  paths: '1' | '2',
  location: string,
  logo: string,
  state: ArduinoState,
  index?: number;
  status: RunningStatus
}

interface MTConnect {
  id: string,
  name: string,
  serialNumber: string,
  brand: MachineBrand,
  model: string;
  source: "mtconnect",
  type: MachineType,
  paths: '1' | '2',
  location: string,
  logo: string,
  state: MTConnectState,
  index?: number;
  status: RunningStatus
}

type MachineInfo = Focas | Arduino | MTConnect;

type RunningStatus = 'offline' | 'red' | 'yellow' | 'green' | 'idle'
