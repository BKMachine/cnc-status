const common: Mapping = {
  online: {
    subtopic: 'sweep',
    location: 'state.data.online',
  },
  mainProgram: {
    subtopic: 'production/1',
    location: 'state.data.program.main.number',
  },
  mainComment: {
    subtopic: 'production/1',
    location: 'state.data.program.main.comment',
  },
  runningProgram: {
    subtopic: 'production/1',
    location: 'state.data.program.running.number',
  },
  runningComment: {
    subtopic: 'production/1',
    location: 'state.data.program.running.comment',
  },
  tool: {
    subtopic: 'state/1',
    location: 'state.data.modal.t',
  },
  overrides: {
    subtopic: 'state/1',
    location: 'state.data.override',
  },
  alarms: {
    subtopic: 'alarms/1',
    location: 'state.data.alarms',
  },
  parts: {
    subtopic: 'production/1',
    location: 'state.data.pieces.produced',
  },
  cycle: {
    subtopic: 'production/1',
    location: 'state.data.timers.cycle_time_ms',
  },
  mode: {
    subtopic: 'state/1',
    location: 'state.data.mode',
  },
  execution: {
    subtopic: 'state/1',
    location: 'state.data.execution',
  },
};

export const robodrill: Mapping = {
  ...common,
};

export const doosanLathe: Mapping = {
  ...common,
  alarms2: {
    subtopic: 'alarms/2',
    location: 'state.data.alarms',
  },
};

export const doosanMill: Mapping = {
  ...common,
};

export const hanwhaSwiss: Mapping = {
  ...common,
  alarms2: {
    subtopic: 'alarms/2',
    location: 'state.data.alarms',
  },
};
