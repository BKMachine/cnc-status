<template v-cloak>
  <main v-if="visibleMachines.length">
    <VueDraggable v-model="visibleMachines" class="container">
      <div
        v-for="item in visibleMachines"
        :key="item.id"
        class="machine"
        @dblclick="openMachine(item.id)"
      >
        <MachineTile :data="item" />
      </div>
    </VueDraggable>
    <Settings @clear-order="refresh" />
    <HourEfficiency class="hour" />
  </main>
</template>

<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import MachineTile from '@/components/MachineTile.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Settings from '@/components/HomeViewSettingsCog.vue';
import { isHidden } from '@/plugins/hide_machine';
import useMachineStore from '@/stores/machine';
import HourEfficiency from '@/components/HourEfficiency.vue';

const router = useRouter();
const machineStore = useMachineStore();
const refreshKey = ref(0);

function refresh() {
  refreshKey.value++;
}

const orderedMachines = computed((): MachineStatus[] => {
  const order = localStorage.getItem('order');
  const orderArray = order ? order.split(',').map((x) => parseInt(x)) : [];
  const results: MachineStatus[] = [];
  const remaining = [...machineStore.machines];
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

const visibleMachines = computed({
  get() {
    return orderedMachines.value.filter((x) => !isHidden(x.id));
  },
  set(val) {
    const indexes = val.map((x) => x.index);
    localStorage.setItem('order', indexes.join(','));
    refreshKey.value++;
  },
});

function openMachine(id: string) {
  router.push({ name: 'machine', params: { id } });
}
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

.hour {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
