<template>
  <div class="machine" :class="[status, { online: isOnline, alarmed: hasAlarm, blink }]">
    <div class="header">
      <div>{{ data.name }}</div>
      <img class="logo" :src="getLogoUrl(data.brand)" :alt="data.brand" />
    </div>
    <div v-if="!isOnline" class="offline">
      <img :src="offlineImg" alt="OFFLINE" />
    </div>
    <div v-else>
      <div class="details">
        <!--        <div class="main-program">{{ data.status.mainProgram }} {{ data.status.mainComment }}</div>
        <div class="sub-program">
          {{ data.status.runningProgram }} {{ data.status.runningComment }}
        </div>-->
        <!--        <div>
          Last Cycle: <span>{{ lastCycle }}</span>
        </div>-->

        <div v-if="isOnline" class="timer">
          <div>{{ timerText }}</div>
        </div>
        <div v-if="hasAlarm && data.source !== 'mtconnect'" class="alarm">
          {{ alarms[0].message.replace(/\*/g, ' ') }}
        </div>
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
  if (props.data.source === 'focas') {
    return props.data.status.alarms.concat(props.data.status.alarms2);
  } else {
    return [];
  }
});

const hasAlarm = computed(() => {
  if (props.data.source === 'focas') {
    const alarms = props.data.status.alarms.concat(props.data.status.alarms2);
    return alarms.length > 0;
  } else if (props.data.source === 'arduino') {
    return props.data.status.red;
  } else if (props.data.source === 'mtconnect') {
    return props.data.status.eStop === 'TRIGGERED';
  }
  return false;
});

const blink = computed(() => {
  return isOnline.value && hasAlarm.value && seconds.value >= 60 * 15;
});

const status = computed(() => {
  if (props.data.source === 'focas') {
    return `status-${props.data.status.execution} status-${props.data.status.execution2} mode-${props.data.status.mode} mode-${props.data.status.mode2}`;
  } else if (props.data.source === 'arduino') {
    if (props.data.status.green) {
      return 'status-GREEN';
    } else if (props.data.status.yellow) {
      return 'status-YELLOW';
    } else if (props.data.status.red) {
      return 'status-RED';
    }
    return '';
  }
  return '';
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

.machine .status-ACTIVE,
.machine .status-OPTIONAL_STOP,
.machine .status-GREEN {
  background: #287428;
}

/*.machine .status-STOPPED,*/
.machine .status-INTERRUPTED,
.machine .status-READY:not(.mode-MANUAL_DATA_INPUT):not(.alarmed),
.machine .status-UNAVAILABLE,
.machine .status-YELLOW {
  background: #e89a23;
}

.machine .alarmed,
.machine .status-RED {
  background: #bd0000;
}

.machine .blink {
  animation: blinkingAlarm 2s infinite;
}

@keyframes blinkingAlarm {
  0% {
    background-color: #bd0000;
  }
  50% {
    background-color: #bd0000;
  }
  51% {
    background-color: #6c6c6c;
  }
  100% {
    background-color: #6c6c6c;
  }
}
</style>
