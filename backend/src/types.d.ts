interface Machine {
  name: string
  image?: string
  status: Status
  mappings?: Mapping
}

interface Status {
  online: boolean
  program: string
  comment: string
  tool: string
  overrides: {
    feed: number
    rapid: number
    spindle: number
  }
  alarms: any[]
  parts: number
  cycle: number
  [key: string]: any
}

interface Mapping {
  [key: string]: {
    subtopic: string
    location: string
  }
}
