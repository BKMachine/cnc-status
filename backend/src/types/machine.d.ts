interface Status {
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
  parts: number;
  cycle: number;
  lastCycle: number;
  lastStateTs: string;
  [key: string]: any;
}

interface Mapping {
  [key: string]: {
    subtopic: string;
    location: string;
  };
}
