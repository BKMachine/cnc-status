interface Machine {
  name: string;
  url: string;
  status: Status;
}

interface Status {
  program: string
  comment: string
  status: string
  time: string
  block: string
  tool: string
  rpm: number
  load: number
  mode: string
  counter: string
  feedOverride: string
  rapidOverride: string
  spindleOverride: string
  feedrate: number
  estop: string
}
