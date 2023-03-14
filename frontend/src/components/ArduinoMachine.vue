<template>
  <main>
    <div v-if="!isMobile()" class="container">
      <div
        class="machine"
        :class="[
          {
            alarmed: hasAlarm,
            online: isOnline,
            offline: !isOnline,
            running: data.status.green,
            'alarmed-blinking': blink,
          },
        ]"
      >
        <div class="name">
          <div>{{ data.name }}</div>
          <img class="logo" v-if="data.image" :src="data.image" alt="" />
        </div>
        <div class="offline-message">
          <img v-if="!isOnline" :src="offlineImg" alt="" />
          <img
            v-else
            :src="jamie"
            alt=""
            style="height: 200px"
            :class="{ grayed: !data.status.green && !data.status.red }"
          />
        </div>
        <div class="timer" v-if="isOnline">
          <div>{{ timerText }}</div>
        </div>
      </div>
    </div>

    <!--    <div v-else class="mobile">
      <div
        :class="[
          status,
          { alarmed: hasAlarm, online: isOnline, offline: !isOnline },
        ]"
      >
        <div class="name">
          <div>{{ data.name }}</div>
          <div class="title" v-if="isOnline">
            {{ data.status.mainProgram }} {{ data.status.mainComment }}
          </div>
          <img
            class="mobile-offline"
            v-if="!isOnline"
            :src="offlineImg"
            alt=""
          />
          <img class="logo" v-if="data.image" :src="data.image" alt="" />
        </div>
        <div v-if="!isOnline"></div>
        <div v-else-if="hasAlarm">
          <table>
            <tr v-for="alarm in alarms" :key="alarm.number">
              <td class="alarm-number">{{ alarm.number }} -</td>
              <td>{{ alarm.message }}</td>
            </tr>
          </table>
        </div>
        <div class="mobile-subtext" v-if="isOnline">
          <div v-if="!hasAlarm">Parts: {{ data.status.parts }}</div>
          <div>{{ timer }}</div>
        </div>
      </div>
    </div>-->
  </main>
</template>

<script setup lang="ts">
import { Duration } from 'luxon';
import { computed, ref, watch } from 'vue';
import offlineImg from '@/components/images/offline.png';
import jamie from '@/components/images/jamie.jpg';
import isMobile from '@/plugins/isMobile';

const props = defineProps<{
  data: ArduinoMachine;
  now: Date;
}>();

const isOnline = computed(() => {
  return props.data.status.online;
});

/*const cycle = computed(() => {
  const seconds = Math.floor(props.data.status.cycle / 1000);
  const dur = Duration.fromObject({ seconds });
  if (dur.as('hours') > 1) return dur.toFormat('h:mm:ss');
  return dur.toFormat('m:ss');
});*/

/*const lastCycle = computed(() => {
  const seconds = Math.floor(props.data.status.lastCycle / 1000);
  const dur = Duration.fromObject({ seconds });
  if (dur.as('hours') > 1) return dur.toFormat('h:mm:ss');
  return dur.toFormat('m:ss');
});*/

/*const rapidOverride = computed(() => {
  const num = props.data.status.overrides.rapid;
  if (num === 0) return '100%';
  if (num === 1) return '50%';
  if (num === 2) return '25%';
  if (num === 3) return 'LOW';
  return '';
});*/

const hasAlarm = computed(() => {
  return props.data.status.red;
});

/*const status = computed(() => {
  return `status-${props.data.status.execution}`;
});*/

/*const mode = computed(() => {
  if (props.data.status.mode === 'MANUAL_DATA_INPUT') return 'MDI';
  return props.data.status.mode;
});*/

const seconds = computed(() => {
  let seconds = Math.floor(
    (props.now.valueOf() - new Date(props.data.status.lastStateTs).valueOf()) /
      1000,
  );
  if (seconds < 0) seconds = 0;
  return seconds;
});

const timerText = computed(() => {
  const dur = Duration.fromObject({ seconds: seconds.value });
  return dur.toFormat('hh:mm:ss');
});

const blink = computed(() => {
  return hasAlarm.value && seconds.value >= 60 * 15;
});

/*const progress = computed(() => {
  const value = (props.data.status.cycle / props.data.status.lastCycle) * 100;
  return Math.min(value, 100);
});*/

/*const showSubtitle = computed(() => {
  return (
    props.data.status.runningProgram &&
    props.data.status.mainProgram !== props.data.status.runningProgram
  );
});*/

/*const alarms = computed(() => {
  return props.data.status.alarms.concat(props.data.status.alarms2);
});*/
</script>

<style scoped>
.machine {
  width: 250px;
  height: 370px;
  color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.details {
  flex: 2;
}

.details > div {
  width: 100%;
  font-size: 14px;
}

.details > div > span {
  position: absolute;
  right: 0;
  color: #ffffff;
  font-weight: bold;
}

.name {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.mobile .name {
  font-size: 18px;
}

.name img {
  height: 30px;
  flex-grow: 0;
  flex-shrink: 0;
}

.online {
  background: #6c6c6c;
}

.status-ACTIVE,
.status-OPTIONAL_STOP,
.running {
  background: #287428;
}

.status-STOPPED,
.status-INTERRUPTED,
.status-READY,
.status-UNAVAILABLE {
  background: #6c6c6c;
}

.alarmed {
  background: #bd0000;
}

.alarmed-blinking {
  animation: blinkingBackground 2s infinite;
}

@keyframes blinkingBackground {
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

.offline {
  background: #282828;
}

.title {
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.mobile .title {
  font-size: 12px;
}

.subtitle {
  font-size: 12px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 25px;
}

.timer {
  font-size: 20px;
  display: flex;
  justify-content: center;
  height: 20px;
}

.myProgress {
  width: 100%;
  background-color: #ddd;
  margin-top: 12px;
}

.myBar {
  height: 15px;
  background-color: #0439aa;
}

.offline-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
}

.offline-message img {
  height: 150px;
}

.alarm-number {
  white-space: nowrap;
  display: flex;
}

.mobile {
  width: 100%;
  font-size: 12px;
}

.mobile > div {
  padding: 5px;
}

.mobile .logo {
  height: 16px;
}

.mobile-subtext {
  display: flex;
}

.mobile-subtext > div {
  margin-right: 10px;
}

.mobile-offline {
  position: absolute;
  left: 11%;
}

.mobile table tr {
  line-height: 10px;
}

.grayed {
  filter: grayscale(100%);
}
</style>
