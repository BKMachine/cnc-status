interface FocasStatus {
  online: boolean;
  mainProgram: string;
  mainComment: string;
  runningProgram: string;
  runningComment: string;
  mode: string;
  execution: string;
  alarms: any[];
  alarms2: any[];
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
  [key: string]: any;
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
  [key: string]: any;
}

type FocasMachine = import('../backend/src/machines/Focas/FocasMachine');
type ArduinoMachine = import('../backend/src/machines/Arduino/ArduinoMachine');
type MTConnectMachine = import('../backend/src/machines/MTConnect/MTConnectMachine');

type Machine = FocasMachine | ArduinoMachine | MTConnectMachine;
