<template>
    <main class="container">
      <div class="machines" v-for="machine in machines" :key="machine.name">
        <MachineStatusCard :data="machine" />
      </div>
      <div>
        <button id="fullscreen" class="fullscreen" @click="fullscreen">
          Fullscreen
        </button>
      </div>
    </main>
</template>

<script setup lang="ts">
import {status} from '@/plugins/enums';
import MachineStatusCard from '@/components/MachineStatusCard.vue';
import {onMounted} from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  if (route.name === 'status/fullscreen') fullscreen()
})

const machines = [
  {
    name: 'RD-1',
    status: status.NOT_RUNNING,
    time: new Date(),
    lastCycle: 650
  },
  {
    name: 'RD-2',
    status: status.RUNNING,
    time: new Date(),
    lastCycle: 650
  },
  {
    name: 'RD-3',
    status: status.IDLE,
    time: new Date(),
    lastCycle: 650
  },
  {
    name: 'RD-4',
    status: status.ALARMED,
    time: new Date(),
    lastCycle: 650
  }
]

function fullscreen() {
  const elem = document.getElementById("app");
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
