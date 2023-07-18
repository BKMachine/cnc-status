<template v-cloak>
  <main v-if="visibleMachines.length">
    <VueDraggable v-model="visibleMachines" class="container" @end="saveOrder">
      <div
        v-for="item in visibleMachines"
        :key="item.id"
        class="machine"
        @dblclick="openMachine(item.name)"
      >
        <MachineTile :data="item" :now="state.now" />
      </div>
    </VueDraggable>
    <Settings class="cog" @clear-order="refresh" />
  </main>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import MachineTile from '@/components/MachineTile.vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/plugins/axios';
import { io, Socket } from 'socket.io-client';
import Settings from '@/components/HomeViewSettingsCog.vue';

const router = useRouter();

const state = reactive({
  now: new Date(),
});

const refreshKey = ref(0);

function refresh() {
  refreshKey.value++;
}

let nowInterval = setInterval(() => {
  state.now = new Date();
}, 1000);

const machines = ref([] as MachineStatus[]);

const orderedMachines = computed((): Machine[] => {
  const order = localStorage.getItem('order');
  const orderArray = order ? order.split(',').map((x) => parseInt(x)) : [];
  const results: Machine[] = [];
  const remaining: Machine[] = [...machines.value];
  for (let i = 0; i < orderArray.length; i++) {
    const index = remaining.findIndex((x) => x.index === orderArray[i]);
    if (index !== -1) {
      const [machine] = remaining.splice(index, 1);
      results.push(machine);
    }
  }
  refreshKey.value; // Force recompute
  return [...results, ...remaining];
});

const visibleMachines = computed((): Machine[] => {
  const hidden = localStorage.getItem('hidden');
  const hiddenArray = hidden ? hidden.split(',') : [];
  return orderedMachines.value.filter((x) => !hiddenArray.includes(x.name));
});

function saveOrder() {
  const indexes = visibleMachines.value.map((x) => x.index);
  localStorage.setItem('order', indexes.join(','));
}

function openMachine(name: string) {
  router.push({ name: 'machine', params: { id: name } });
}

async function getStatus() {
  return axios.get('/status').then(({ data }: { data: Machine[] }) => {
    machines.value = data;
  });
}

let statusInterval = setInterval(() => {
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
      const index = machines.value.findIndex((x) => x.id === payload.id);
      if (index !== -1) {
        payload.changes.forEach((change) => {
          machines.value[index].state[change.key as keyof MachineState] = change.value as never;
        });
      }
    });
  });
});

onBeforeUnmount(() => {
  if (nowInterval) {
    clearInterval(nowInterval);
  }
  if (statusInterval) {
    clearInterval(statusInterval);
  }
  if (socket) {
    socket.close();
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

.cog {
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
