import axios from '@/plugins/axios';
import { store } from '@/store';
import { io, Socket } from 'socket.io-client';

let socket: Socket<ServerToClientEvents>;
const wsUrl =
  import.meta.env.MODE === 'production' ? import.meta.env.BASE_URL : 'http://127.0.0.1:3000';

async function getStatus() {
  return axios.get('/status').then(({ data }: { data: MachineStatus[] }) => {
    store.commit('setMachines', data);
  });
}

setInterval(getStatus, 1000 * 60 * 5);

getStatus().then(() => {
  socket = io(wsUrl, {
    transports: ['websocket', 'polling'],
  });

  socket.io.on('reconnect', () => {
    console.log('Socket-IO client reconnected.');
    getStatus().catch(() => {
      // Do Nothing
    });
  });

  socket.on('refresh', () => {
    location.reload();
  });

  socket.on('change', (payload) => {
    store.commit('updateMachineState', payload);
  });
});
