<template>
  <main class="container" v-if="machines.length">
    <div class="machines" v-for="machine in sortedMachines" :key="machine.name">
      <MachineStatusCard :data="machine" :now="state.now"/>
    </div>
    <div>
      <button id="fullscreen" class="fullscreen" @click="fullscreen">
        Fullscreen
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import MachineStatusCard from '@/components/MachineStatusCard.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/plugins/axios';

const route = useRoute();

const state = reactive({
  now: new Date(),
});

setInterval(() => {
  state.now = new Date();
}, 250);

const machines = ref([] as Machine[]);
const sortedMachines = computed(() => {
  return machines.value.sort((a: Machine, b: Machine) => {
    return (a.name > b.name) ? 1 : 0 || b.status - a.status
  })
})

onMounted(() => {
  if (route.name === 'status/fullscreen') fullscreen();
  axios.get('/status').then(({ data }: { data: Machine[] }) => {
    const now = new Date();
    for (let i = 0; i < data.length; i++) {
      data[i].time = now
    }
    machines.value = data;
  });
});

function fullscreen() {
  const elem = document.getElementById('app');
  if (!elem) return;
  elem.requestFullscreen();
}
</script>

<style scoped>
.container {
  display: flex;
}

.machines {
  margin: 10px;
}
</style>
