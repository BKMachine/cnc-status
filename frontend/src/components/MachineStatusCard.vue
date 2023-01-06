<template>
  <main>
    <div class="machine" :class="`status-${data.status.status}`">
    <div class="name">{{ data.name }}</div>
  <!--      </div>
      <div>Last Cycle: {{ lastCycle }}</div>
      <div>Timer: {{ timer }}</div>-->
      <div>Program: <span>{{data.status.program}} {{data.status.comment}}</span></div>
      <div>Status: <span>{{data.status.status}}</span></div>
      <div>Status Time: <span>{{timer}}</span></div>
      <div>Block: <span>{{data.status.block}}</span></div>
      <div>Tool: <span>{{data.status.tool}}</span></div>
      <div>Spindle RPM: <span>{{data.status.rpm}}</span></div>
      <div>Spindle Load: <span>{{data.status.load}}%</span></div>
      <div>Mode: <span>{{data.status.mode}}</span></div>
      <div>Part Count: <span>{{data.status.counter}}</span></div>
      <div>Feed Override: <span>{{data.status.feedOverride}}%</span></div>
      <div>Rapid Override: <span>{{data.status.rapidOverride}}%</span></div>
      <div>Spindle Override: <span>{{data.status.spindleOverride}}%</span></div>
      <div>Feedrate: <span>{{feedrate}} IPM</span></div>
      <div>ESTOP: <span>{{data.status.estop}}</span></div>

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

// const time = ref(new Date(props.data.status.time))

const timer = computed(() => {
  let seconds = Math.floor((props.now.valueOf() - new Date(props.data.status.time).valueOf()) / 1000);
  if (seconds < 0) seconds = 0;
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('hh:mm:ss');
});

const feedrate = computed(() => {
  return (props.data.status.feedrate * 39.37).toFixed(2)
})

</script>

<style scoped>
.machine {
  width: 250px;
  height: 400px;
  color: #000000;
  padding: 10px;
  border-radius: 20px;
}

.machine > div {
  width: 100%;
}

.machine > div > span {
  position: absolute;
  right: 0;
  color: #000000;
}
.name {
  font-size: 30px;
}

.status-UNAVAILABLE {
  background: #535353;
}

.status-ACTIVE {
  background: #287428;
}

.status-STOPPED, .status-INTERRUPTED, .status-READY {
  background: #d2d22a;
}

.status-0 {
  background: gray;
}

.status-3 {
  background: #bd0000;
}
</style>
