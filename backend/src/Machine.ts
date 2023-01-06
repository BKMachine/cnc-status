import axios from 'axios'
import _ from 'lodash'
import { emit } from './server/socket.io'

class Machine {
  private readonly name: string;
  private readonly url: string
  private status: Status | undefined

  constructor(name: string, url: string) {
    this.name = name
    this.url = url
    setInterval(() => {
      this.statusUpdate()
    }, 5000)
  }

  private statusUpdate() {
    try {
      axios.get(this.url).then(({data}) => {
        const status = Machine.extractStatus(data)
        const isChanged = !_.isEqual(status, this.status)
        this.status = status
        if (isChanged) emit('statusUpdate', this.getMachine())
      })
    } catch(e) {
      // Do Nothing
    }
  }

  private static extractStatus(data: any): Status {
    const device = data.MTConnectStreams.Streams.DeviceStream
    return {
      program: device.ComponentStream[2].Events.Program.value,
      comment: device.ComponentStream[2].Events.ProgramComment.value,
      status: device.ComponentStream[2].Events.Execution.value,
      time: device.ComponentStream[2].Events.Execution.timestamp,
      block: device.ComponentStream[2].Events.Block.value,
      tool: device.ComponentStream[2].Events.ToolNumber.value,
      rpm: device.ComponentStream[1].Samples.RotaryVelocity.value,
      load: device.ComponentStream[1].Samples.Load.value,
      mode: device.ComponentStream[2].Events.ControllerMode.value,
      counter: device.ComponentStream[2].Events.PartCount.value,
      feedOverride: device.ComponentStream[2].Events.PathFeedrateOverride[0].value,
      rapidOverride: device.ComponentStream[2].Events.PathFeedrateOverride[1].value,
      spindleOverride: device.ComponentStream[2].Events.RotaryVelocityOverride.value,
      feedrate: device.ComponentStream[2].Samples.PathFeedrate.value,
      estop: device.ComponentStream[6].Events.EmergencyStop.value,
    }
  }

  getMachine() {
    return {
      name: this.name,
      url: this.url,
      status: this.status
    }
  }
}

export default Machine

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
