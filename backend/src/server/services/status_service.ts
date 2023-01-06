import axios from 'axios';

export default async function() {
  const { data } = await axios.get('http://10.1.1.135:5000/000/current')
  return data
}
