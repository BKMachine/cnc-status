interface Machine {
  id: string;
  name: string;
  image: string;
}

interface FocasMachine extends Machine {
  source: 'focas';
  status: FocasStatus;
}

interface ArduinoMachine extends Machine {
  source: 'arduino';
  status: ArduinoStatus;
}

type Machines = FocasMachine | ArduinoMachine;

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
  rpm: number;
  alarms: any[];
  alarms2: any[];
  parts: number;
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
  [key: string]: any;
}

interface ArduinoStatus {
  online: boolean;
  green: boolean;
  yellow: boolean;
  red: boolean;
  [key: string]: any;
}
