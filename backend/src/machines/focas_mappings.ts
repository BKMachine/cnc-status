const focas_mappings: FocasMapping = {
  sweep: {
    'state.data.online': 'online',
  },
  'production/1': {
    'state.data.program.main.number': 'mainProgram',
    'state.data.program.main.comment': 'mainComment',
    'state.data.program.running.number': 'runningProgram',
    'state.data.program.running.comment': 'runningComment',
    'state.data.pieces.produced': 'parts',
    'state.data.timers.cycle_time_ms': 'cycle',
  },
  'state/1': {
    'state.data.modal.t': 'tool',
    'state.data.override': 'overrides',
    'state.data.mode': 'mode',
    'state.data.execution': 'execution',
  },
  'alarms/1': {
    'state.data.alarms': 'alarms',
  },
  'alarms/2': {
    'state.data.alarms': 'alarms2',
  },
};

export default focas_mappings;
