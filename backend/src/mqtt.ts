import {connect} from "mqtt"
import logger from './logger'
import machines from './machines'
import _ from 'lodash'
import { emit } from './server/socket.io'

const client  = connect('mqtt://10.1.1.2')

client.on('connect', () => {
  logger.info('Connected to MQTT broker')
  client.subscribe('fanuc/#', (err) => {
    if (err) console.error(err)
  })
})

client.on('disconnect', () => {
  logger.warn('Disconnected from the MQTT broker')
})

client.on('message', (topic, message) => {
  const machine = topic.split('/')[1]
  if (!machine) return
  const data = JSON.parse(message.toString())
  if (!data.observation) return
  const { mappings } = machines[machine]
  for (const key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      const subtopic = mappings[key].subtopic
      if (topic !== `fanuc/${machine}/${subtopic}`) continue
      const location = mappings[key].location
      const value = _.get(data, location, undefined)
      if (value === undefined) continue
      const old = machines[machine].status[key]
      if (!_.isEqual(old, value)) emit('change', {name: machines[machine].name, status: {[key]: value}})
      machines[machine].status[key] = value
    }
  }
})
