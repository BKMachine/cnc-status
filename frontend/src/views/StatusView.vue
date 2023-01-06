<template>
  <main class="container" v-if="machines.length">
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
import _ from 'lodash'

const state = reactive({
  now: new Date(),
});

setInterval(() => {
  state.now = new Date();
}, 250);

const machines = ref([] as Machine[]);

let io: Socket;

onMounted(() => {
  axios.get('/status').then(({ data }) => {
    machines.value = data;
  });

  io = socket('http://127.0.0.1:3000');

  io.on(
    'change',
    (payload: { name: string; status: { [key: string]: any } }) => {
      const index = machines.value.findIndex((x) => x.name === payload.name);
      if (index !== -1) {
        machines.value[index] = _.merge(machines.value[index], payload)
      } else {
        machines.value.push(payload as Machine);
      }
    });
});
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.machines {
  margin: 5px;
}
</style>
