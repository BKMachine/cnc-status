interface Machine {
  name: string;
  status: Status;
}

interface Status {
  online: boolean;
  program: string;
  comment: string;
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
  /*status: string;
  time: string;
  block: string;
  load: number;
  mode: string;
  feedrate: number;
  estop: string;*/
}
