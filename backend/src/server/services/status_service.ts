enum status {
  NOT_RUNNING,
  RUNNING,
  IDLE,
  ALARMED,
}

export default [
  {
    name: 'RD-1',
    status: status.NOT_RUNNING,
    lastCycle: 650
  },
  {
    name: 'RD-2',
    status: status.RUNNING,
    lastCycle: 650
  },
  {
    name: 'RD-3',
    status: status.IDLE,
    lastCycle: 650
  },
  {
    name: 'RD-4',
    status: status.ALARMED,
    lastCycle: 650
  }
]
