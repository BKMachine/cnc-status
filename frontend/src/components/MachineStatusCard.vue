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
import { Duration } from 'luxon';
import {computed, ref} from 'vue';

const props = defineProps<{
  data: Machine;
  now: Date;
}>();

const time = ref(new Date(props.data.time))

const lastCycle = computed(() => {
  const dur = Duration.fromObject({ seconds: props.data.lastCycle });
  return dur.toFormat('hh:mm:ss');
});

const timer = computed(() => {
  let seconds = Math.floor((props.now.valueOf() - time.value.valueOf()) / 1000);
  if (seconds < 0) seconds = 0;
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
