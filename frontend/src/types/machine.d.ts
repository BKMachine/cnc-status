interface Machine {
  name: string;
  status: Status;
}

interface Status {
  online: boolean;
  mainProgram: string;
  mainComment: string;
  runningProgram: string;
  runningComment: string;
  tool: string;
  overrides: {
    feed: number;
    rapid: number;
    spindle: number;
  };
  rpm: number;
  alarms: any[];
  parts: number;
  cycle: number;
  mode: string;
  execution: string;
  /*status: string;
  time: string;
  block: string;
  load: number;
  feedrate: number;
  estop: string;*/
}
