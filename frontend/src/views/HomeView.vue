<template>
  <main class="container" v-if="visibleMachines.length">
    <div
      class="machine"
      v-for="machine in visibleMachines"
      :key="machine.name"
      @dblclick="openMachine(machine.name)"
    >
      <MachineTile :data="machine" :now="state.now" />
    </div>
  </main>
</template>

<script setup lang="ts">
import MachineTile from '@/components/MachineTile.vue';
import { onMounted, computed, ref, reactive, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import { io, Socket } from 'socket.io-client';

const router = useRouter();

const state = reactive({
  now: new Date(),
});

let nowInterval: NodeJS.Timer | null = setInterval(() => {
  state.now = new Date();
}, 1000);

const machines = ref([] as MachineStatus[]);

const visibleMachines = computed(() => {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  return machines.value.filter((x: Machine) => !hiddenArray.includes(x.name));
});

function openMachine(name: string) {
  router.push({ name: 'machine', params: { id: name } });
}

async function getStatus() {
  return axios.get('/status').then(({ data }: { data: Machine[] }) => {
    machines.value = data;
  });
}

let statusInterval: NodeJS.Timer | null = setInterval(() => {
  getStatus();
}, 1000 * 60 * 5);

let socket: Socket<ServerToClientEvents>;

onMounted(() => {
  const wsUrl =
    import.meta.env.MODE === 'production' ? import.meta.env.BASE_URL : 'http://127.0.0.1:3000';

  getStatus().then(() => {
    socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
    });

    socket.io.on('reconnect', () => {
      console.log('Socket-IO client reconnected.');
      getStatus();
    });

    socket.on('refresh', () => {
      location.reload();
    });

    socket.on('change', (payload) => {
      const index = machines.value.findIndex((x) => x.name === payload.name);
      if (index !== -1) {
        payload.changes.forEach((change) => {
          machines.value[index].status[change.key] = change.value;
        });
      }
    });
  });
});

onBeforeUnmount(() => {
  if (nowInterval) {
    clearInterval(nowInterval);
    nowInterval = null;
  }
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.machine {
  margin: 5px;
}
</style>
