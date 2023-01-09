<template>
  <main class="container" :class="{ mobile: mobile }" v-if="machines.length">
    <div class="machines" v-for="machine in machines" :key="machine.name">
      <MachineStatusCard :data="machine" :now="state.now" />
    </div>
  </main>
</template>

<script setup lang="ts">
import MachineStatusCard from '@/components/MachineStatusCard.vue';
import { onMounted, reactive, ref } from 'vue';
import socket, { Socket } from 'socket.io-client';
import axios from '@/plugins/axios';
import _ from 'lodash';
import type { Machine } from '@/types/machine';
import isMobile from '@/plugins/isMobile';

const state = reactive({
  now: new Date(),
});

const mobile = isMobile();

setInterval(() => {
  state.now = new Date();
}, 250);

const machines = ref([] as Machine[]);

let io: Socket;

onMounted(() => {
  const wsUrl =
    import.meta.env.MODE === 'production'
      ? import.meta.env.BASE_URL
      : 'http://127.0.0.1:3000';

  getStatus().then(() => {
    io = socket(wsUrl, {
      transports: ['websocket', 'polling'],
    });

    io.on('connected', () => {
      getStatus();
    });

    io.on(
      'change',
      (payload: { name: string; status: { [key: string]: any } }) => {
        const index = machines.value.findIndex((x) => x.name === payload.name);
        if (index !== -1) {
          machines.value[index] = _.merge(machines.value[index], payload);
          if (payload.status.alarms && !payload.status.alarms.length) {
            machines.value[index].status.alarms = [];
          }
        }
      },
    );
  });
});

async function getStatus() {
  return axios.get('/status').then(({ data }) => {
    machines.value = data;
  });
}
</script>

<style scoped>
.container:not(.mobile) {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.machines {
  margin: 5px;
}
</style>
