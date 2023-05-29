<template>
  <div class="machine" :class="[{ online: isOnline, blink }]">
    <div class="header">
      <div>{{ data.name }}</div>
      <img class="logo" :src="getLogoUrl(data.brand)" :alt="data.brand" />
    </div>
    <div v-if="!isOnline" class="offline">
      <img :src="offlineImg" alt="OFFLINE" />
    </div>
    <div v-else>
      <div class="details">
        <div class="main-program">{{ data.status.mainProgram }} {{ data.status.mainComment }}</div>
        <div class="sub-program">
          {{ data.status.runningProgram }} {{ data.status.runningComment }}
        </div>
        <div>
          Last Cycle: <span>{{ lastCycle }}</span>
        </div>
        <div v-if="hasAlarm" class="alarm">
          {{ alarms[0] }}
        </div>
      </div>
      <div v-if="isOnline" class="timer">
        <div>{{ timerText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import offlineImg from '@/assets/offline.png';
import { Duration } from 'luxon';

const props = defineProps<{
  data: MachineStatus;
  now: Date;
}>();

function getLogoUrl(brand: MachineBrand) {
  return new URL('../assets/machine_logos/' + brand + '.png', import.meta.url).href;
}

const isOnline = computed(() => {
  return props.data.status.online;
});

const seconds = computed(() => {
  const now = new Date(props.data.status.lastStateTs).valueOf();
  let seconds = Math.floor((props.now.valueOf() - now) / 1000);
  if (seconds < 0) seconds = 0;
  return seconds;
});

const timerText = computed(() => {
  const dur = Duration.fromObject({ seconds: seconds.value });
  return dur.toFormat('hh:mm:ss');
});

const lastCycle = computed(() => {
  const seconds = Math.floor(props.data.status.lastCycle / 1000);
  const dur = Duration.fromObject({ seconds });
  if (dur.as('hours') > 1) return dur.toFormat('h:mm:ss');
  return dur.toFormat('m:ss');
});

const alarms = computed(() => {
  return props.data.status.alarms.concat(props.data.status.alarms2);
});

const hasAlarm = computed(() => {
  return alarms.value.length > 0;
});

const blink = computed(() => {
  return isOnline.value && hasAlarm.value && seconds.value >= 60 * 15;
});
</script>

<style scoped>
.machine {
  width: 250px;
  height: 130px;
  color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.machine:not(.online) {
  background: #282828;
}

.machine .online {
  background: #6c6c6c;
}

.header {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.logo {
  height: 30px;
  flex-grow: 0;
  flex-shrink: 0;
}

.offline {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 55%;
}

.offline img {
  height: 70px;
}
</style>
