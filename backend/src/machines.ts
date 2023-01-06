import Machine from './Machine'

const rd4 = new Machine('RD4', 'http://10.1.1.135:5000/000/current')

export default function() {
  return [
    rd4.getMachine(),
  ]
}
