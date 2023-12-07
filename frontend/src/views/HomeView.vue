<template v-cloak>
  <main v-if="visibleMachines.length">
    <VueDraggable v-model="visibleMachines" class="container">
      <div
        v-for="item in visibleMachines"
        :key="item.id"
        class="machine"
        @dblclick="openMachine(item.id)"
      >
        <BlankTile v-if="item.hasOwnProperty('blank')" />
        <MachineTile v-else :data="item as MachineInfo" />
      </div>
    </VueDraggable>
    <HourEfficiency class="hour ml-2" />
    <Settings @clear-order="refresh" />
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
import HourEfficiency from '@/components/HourlyPerformance.vue';
import BlankTile from '@/components/BlankTile.vue';

const router = useRouter();
const machineStore = useMachineStore();
const refreshKey = ref(0);

function refresh() {
  refreshKey.value++;
}

const orderedMachines = computed((): (MachineInfo | BlankMachineTile)[] => {
  const order = localStorage.getItem('order');
  const orderArray = order ? order.split(',').map((x) => parseInt(x)) : [];
  if (!orderArray.length) {
    const indexes = machineStore.machines.map((x) => x.index);
    localStorage.setItem('order', indexes.join(','));
  }
  const blanksArray = [...machineStore.blanks];

  const results: (MachineInfo | BlankMachineTile)[] = [];
  const remaining = [...machineStore.machines];
  const length = machineStore.machines.length + blanksArray.length;
  for (let i = 0; i < length; i++) {
    const index = remaining.findIndex((x) => x.index === orderArray[i]);
    if (index !== -1) {
      const [machine] = remaining.splice(index, 1);
      results.push(machine);
    } else if (blanksArray.length && (blanksArray[0] === orderArray[i] || !orderArray[i])) {
      results.push({ blank: true, id: blanksArray[0].toString(), index: blanksArray[0] });
      blanksArray.pop();
    }
  }
  refreshKey.value; // Force recompute
  return [...results, ...remaining];
});

const visibleMachines = computed({
  get(): (MachineInfo | BlankMachineTile)[] {
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
  margin: 3px;
}

.hour {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
