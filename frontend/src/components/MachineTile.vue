<template>
  <div class="machine" :class="[status, { online: isOnline, alarmed: hasAlarm, blink }]">
    <div class="header">
      <div>{{ data.name }}</div>
      <img class="logo" :src="data.logo" :alt="data.brand" />
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
          <div v-if="data.state.lastCycle">Last Cycle: {{ lastCycle }}</div>
          <div v-else>Last Cycle: ---</div>
        </div>
        <div v-if="hasAlarm && data.source === 'focas'" class="alarm">
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

/*function getLogoUrl(brand: MachineBrand) {
  // return new URL('../assets/machine_logos/' + brand + '.png', import.meta.url).href;
}*/

const state = computed(() => {
  return props.data.state;
});

const isOnline = computed(() => {
  return state.value.online;
});

const seconds = computed(() => {
  const now = new Date(state.value.lastStateTs).valueOf();
  let seconds = Math.floor((props.now.valueOf() - now) / 1000);
  if (seconds < 0) seconds = 0;
  return seconds;
});

const timerText = computed(() => {
  const dur = Duration.fromObject({ seconds: seconds.value });
  return dur.toFormat('hh:mm:ss');
});

const lastCycle = computed(() => {
  const seconds = Math.floor(state.value.lastCycle / 1000);
  const dur = Duration.fromObject({ seconds });
  if (dur.as('hours') > 1) return dur.toFormat('h:mm:ss');
  return dur.toFormat('m:ss');
});

const alarms = computed(() => {
  if (props.data.source === 'focas') {
    return state.value.alarms.concat(state.value.alarms2);
  } else {
    return [];
  }
});

const hasAlarm = computed(() => {
  if (props.data.source === 'focas') {
    const a1 = state.value.alarms || [];
    const a2 = state.value.alarms2 || [];
    const alarms = a1.concat(a2);
    return alarms.length > 0;
  } else if (props.data.source === 'arduino') {
    return state.value.red;
  } else if (props.data.source === 'mtconnect') {
    return state.value.eStop === 'TRIGGERED' || state.value.motion === 'FAULT';
  }
  return false;
});

const blink = computed(() => {
  return isOnline.value && hasAlarm.value && seconds.value >= 60 * 15;
});

const status = computed(() => {
  if (props.data.source === 'focas') {
    let statusString = `status-${state.value.execution} mode-${state.value.mode}`;
    if (props.data.paths === 2) {
      statusString += `status-${state.value.execution2}  mode-${state.value.mode2}`;
    }
    return statusString;
  } else if (props.data.source === 'arduino') {
    if (state.value.green) {
      return 'status-GREEN';
    } else if (state.value.yellow) {
      return 'status-YELLOW';
    } else if (state.value.red) {
      return 'status-RED';
    }
    return '';
  } else if (props.data.source === 'mtconnect') {
    return `status-${state.value.execution} mode-${state.value.mode}`;
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

.machine .online {
  background: #6c6c6c;
}

.machine:not(.online) {
  background: #282828;
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

.machine.online.status-ACTIVE,
.machine.online.status-OPTIONAL_STOP,
.machine.online.status-GREEN {
  background: #287428 !important;
}

/*.machine .status-STOPPED,*/
.machine.online.status-INTERRUPTED,
.machine.online.status-READY:not(.mode-MANUAL_DATA_INPUT):not(.alarmed),
/*.machine.online.status-UNAVAILABLE,*/
.machine.online.status-YELLOW {
  background: #e89a23 !important;
}

.machine.online.alarmed,
.machine.online.status-RED {
  background: #bd0000 !important;
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
