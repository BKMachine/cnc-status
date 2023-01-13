interface FocasStatus {
  online: boolean;
  mainProgram: string;
  mainComment: string;
  runningProgram: string;
  runningComment: string;
  tool: string;
  mode: string;
  execution: string;
  overrides: {
    feed: number;
    rapid: number;
    spindle: number;
  };
  alarms: any[];
  alarms2: any[];
  parts: number;
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
  [key: string]: any;
}

type FocasMachine = import('../machines/FocasMachine');
type ArduinoMachine = import('../machines/ArduinoMachine');

type Machine = FocasMachine | ArduinoMachine;
