import * as mappings from './mappings'

const status: Status = {
  online: false,
  mainProgram: '',
  mainComment: '',
  runningProgram: '',
  runningComment: '',
  tool: '',
  overrides: {
    feed: 0,
    rapid: 0,
    spindle: 0
  },
  alarms: [],
  parts: 0,
  cycle: 0,
  mode: '',
  execution: ''
}

const machines: {[key: string]: Machine} = {
  rd1: {
    name: 'RD1',
    image: 'https://imdcdn-w0vwwgyt12rypz.netdna-ssl.com/wp-content/uploads/2020/07/FANUC-logo.png',
    status: {...status},
    mappings: {...mappings.robodrill}
  },
  rd2: {
    name: 'RD2',
    image: 'https://imdcdn-w0vwwgyt12rypz.netdna-ssl.com/wp-content/uploads/2020/07/FANUC-logo.png',
    status: {...status},
    mappings: {...mappings.robodrill}
  },
  rd3: {
    name: 'RD3',
    image: 'https://imdcdn-w0vwwgyt12rypz.netdna-ssl.com/wp-content/uploads/2020/07/FANUC-logo.png',
    status: {...status},
    mappings: {...mappings.robodrill}
  },
  rd4: {
    name: 'RD4',
    image: 'https://imdcdn-w0vwwgyt12rypz.netdna-ssl.com/wp-content/uploads/2020/07/FANUC-logo.png',
    status: {...status},
    mappings: {...mappings.robodrill}
  },
  dl1: {
    name: "DL1",
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Doosan_logo.svg/1280px-Doosan_logo.svg.png',
    status: {...status},
    mappings: {...mappings.doosanLathe}
  },
  dm1: {
    name: "DM1",
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Doosan_logo.svg/1280px-Doosan_logo.svg.png',
    status: {...status},
    mappings: {...mappings.robodrill}
  },
  s1: {
    name: 'S1',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hanwha_logo.svg/1280px-Hanwha_logo.svg.png',
    status: {...status},
    mappings: {...mappings.hanwhaSwiss}
  },
  s2: {
    name: 'S2',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hanwha_logo.svg/1280px-Hanwha_logo.svg.png',
    status: {...status},
    mappings: {...mappings.hanwhaSwiss}
  },
  s3: {
    name: 'S3',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hanwha_logo.svg/1280px-Hanwha_logo.svg.png',
    status: {...status},
    mappings: {...mappings.hanwhaSwiss}
  },
}

export default machines
