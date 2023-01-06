<template>
  <main class="container" v-if="machines.length">
    <div class="machines" v-for="(machine, i) in machines" :key="i">
      <MachineStatusCard :data="machine" :now="state.now"/>
    </div>
  </main>
</template>

<script setup lang="ts">
import MachineStatusCard from '@/components/MachineStatusCard.vue';
import { onMounted, reactive, ref } from 'vue';
import socket, {Socket} from 'socket.io-client'
import axios from '@/plugins/axios'

const state = reactive({
  now: new Date(),
});

setInterval(() => {
  state.now = new Date();
}, 250);

const machines = ref([] as Machine[]);

let io: Socket

onMounted(() => {
  axios.get('/status').then(({data}) => {
    machines.value = data
  })

  io = socket('http://127.0.0.1:3000')

  io.on('statusUpdate', (payload: Machine) => {
    const index = machines.value.findIndex(x => x.name === payload.name)
    if (index !== -1) {
      machines.value.splice(index, 1, payload)
    } else {
      machines.value.push(payload)
    }
  })
});
</script>

<style scoped>
.container {
  display: flex;
}

.machines {
  margin: 10px;
}
</style>
