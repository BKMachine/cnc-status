<template>
  <main>
    <div class="machine" :class="`status-${data.status}`">
      <div class="name">
        {{ data.name }}
      </div>
      <div>Last Cycle: {{ lastCycle }}</div>
      <div>Timer: {{ timer }}</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { status } from '@/plugins/enums';
import { Duration } from 'luxon';
import { computed, watch } from 'vue';
import { store as now } from '@/store/now';

const props = defineProps<{
  data: Machine;
}>();

const lastCycle = computed(() => {
  const dur = Duration.fromObject({ seconds: props.data.lastCycle });
  return dur.toFormat('hh:mm:ss');
});

const timer = computed(() => {
  const seconds =
    now.state.now.getSeconds() - new Date(props.data.time).getSeconds();
  if (!seconds) return '00:00:00';
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('hh:mm:ss');
});
</script>

<style scoped>
.machine {
  width: 200px;
  height: 300px;
  color: #ffffff;
  padding: 10px;
  border-radius: 20px;
}

.name {
  font-size: 30px;
}

.status-0 {
  background: gray;
}

.status-1 {
  background: #287428;
}

.status-2 {
  background: #d2d22a;
}

.status-3 {
  background: #bd0000;
}
</style>
