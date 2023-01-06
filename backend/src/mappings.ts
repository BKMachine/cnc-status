export const robodrill: Mapping = {
  online: {
    subtopic: 'sweep',
    location: 'state.data.online'
  },
  program: {
    subtopic: 'production/1',
    location: 'state.data.program.running.number'
  },
  comment: {
    subtopic: 'production/1',
    location: 'state.data.program.running.comment'
  },
  tool: {
    subtopic: 'state/1',
    location: 'state.data.modal.t'
  },
  overrides: {
    subtopic: 'state/1',
    location: 'state.data.override'
  },
  alarms: {
    subtopic: 'alarms/1',
    location: 'state.data.alarms'
  },
  parts: {
    subtopic: 'production/1',
    location: 'state.data.pieces.produced'
  },
  cycle: {
    subtopic: 'production/1',
    location: 'state.data.timers.cycle_time_ms'
  }
}
