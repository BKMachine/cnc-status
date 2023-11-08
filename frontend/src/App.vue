<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import axios from '@/plugins/axios';
import useMachineStore from '@/stores/machine';
import { onMounted } from 'vue';
import { io, Socket } from 'socket.io-client';

const machineStore = useMachineStore();
let socket: Socket<ServerToClientEvents>;
const wsUrl =
  import.meta.env.MODE === 'production' ? import.meta.env.BASE_URL : 'http://127.0.0.1:3000';

async function getMachines() {
  return axios.get('/machines').then(({ data }: { data: MachineInfo[] }) => {
    machineStore.setMachines(data);
  });
}

onMounted(() => {
  setInterval(getMachines, 1000 * 60 * 5);
  getMachines().then(() => {
    socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
    });

    socket.io.on('reconnect', () => {
      console.log('Socket-IO client reconnected.');
      getMachines().catch(() => {
        // Do Nothing
      });
    });

    socket.on('refresh', () => {
      location.reload();
    });

    socket.on('change', (changes) => {
      machineStore.updateMachineState(changes);
    });

    socket.on('status', (status) => {
      machineStore.updateMachineStatus(status);
    });
  });
});
</script>

<style scoped></style>
