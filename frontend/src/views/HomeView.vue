<template>
  <main class="container" :class="{ mobile: mobile }" v-if="machines.length">
    <div
      class="machines"
      v-for="machine in shownMachines"
      :key="machine.name"
      @dblclick="openDetails(machine.name)"
    >
      <FocasMachine
        v-if="machine.source === 'focas'"
        :data="machine"
        :now="state.now"
      />
      <ArduinoMachine
        v-if="machine.source === 'arduino'"
        :data="machine"
        :now="state.now"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import FocasMachine from '@/components/FocasMachine.vue';
import ArduinoMachine from '@/components/ArduinoMachine.vue';
import { onMounted, reactive, ref, computed } from 'vue';
import socket, { Socket } from 'socket.io-client';
import axios from '@/plugins/axios';
import isMobile from '@/plugins/isMobile';
import { useRouter } from 'vue-router';

const router = useRouter();

const state = reactive({
  now: new Date(),
});

const mobile = isMobile();

setInterval(() => {
  state.now = new Date();
}, 1000);

const machines = ref([] as Machines[]);

const shownMachines: Machines[] = computed(() => {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  return machines.value.filter((x) => !hiddenArray.includes(x.name));
});

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
      (payload: { name: string; changes: { key: string; value: any }[] }) => {
        const index = machines.value.findIndex((x) => x.name === payload.name);
        if (index !== -1) {
          payload.changes.forEach((change) => {
            machines.value[index].status[change.key] = change.value;
          });
        }
      },
    );

    io.on('refresh', () => {
      location.reload();
    });
  });
});

async function getStatus() {
  return axios.get('/status').then(({ data }) => {
    machines.value = data;
  });
}

setInterval(() => {
  getStatus();
}, 1000 * 60 * 5);

function openDetails(name: string) {
  router.push({ name: 'details', params: { id: name } });
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
