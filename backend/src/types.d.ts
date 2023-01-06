interface Machine {
  name: string
  image?: string
  status: Status
  mappings?: Mapping
}

interface Status {
  online: boolean
  mainProgram: string
  mainComment: string
  runningProgram: string
  runningComment: string
  tool: string
  overrides: {
    feed: number
    rapid: number
    spindle: number
  }
  alarms: any[]
  parts: number
  cycle: number
  mode: string
  execution: string
  [key: string]: any
}

interface Mapping {
  [key: string]: {
    subtopic: string
    location: string
  }
}
