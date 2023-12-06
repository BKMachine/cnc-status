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
  lastOperatorTime: number;
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
  lastOperatorTime: number;
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
  lastOperatorTime: number;
  lastStateTs: string;
}

interface MTConnectMappings {
  [key: string]: string;
}

type MachineState = FocasState | ArduinoState | MTConnectState;
type MachineStateKey = keyof FocasState | keyof ArduinoState | keyof MTConnectState;

type Changes  = Map<MachineStateKey, any>

type MachineBrand = 'fanuc' | 'mori' | 'doosan' | 'mitsubishi' | 'haas' | 'mazak' | 'hanwha';
type MachineType = 'lathe' | 'mill' | 'swiss';
type MachineSource = 'focas' | 'arduino' | 'mtconnect';
type MachineStatus = 'offline' | 'red' | 'yellow' | 'green' | 'idle'

interface MachineData {
  id: string,
  name: string,
  serialNumber: string,
  brand: MachineBrand,
  model: string;
  type: MachineType,
  source: MachineSource,
  paths: '1'  | '2',
  location: string,
  logo: string,
  status: MachineStatus
  state: MachineState
  index?: number;
}

interface Focas extends MachineData {
  source: 'focas',
  state: FocasState,
  paths: '1' | '2',
}

interface Arduino extends MachineData {
  source: 'arduino',
  state: ArduinoState,
  paths: '1',
}

interface MTConnect extends MachineData {
  source: 'mtconnect',
  state: MTConnectState,
  paths: '1',
}

type MachineInfo = Focas | Arduino | MTConnect;

interface BlankMachineTile { blank: true; index: number; id: string }
