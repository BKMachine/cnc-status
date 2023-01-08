<template>
  <main>
    <div v-if="!isMobile()" class="container">
      <div
        class="machine"
        :class="[
          status,
          { alarmed: hasAlarm, online: isOnline, offline: !isOnline },
        ]"
      >
        <div class="name">
          <div>{{ data.name }}</div>
          <img class="logo" v-if="data.image" :src="data.image" alt="" />
        </div>
        <div v-if="!isOnline" class="offline-message">
          <img :src="offlineImg" alt="" />
        </div>
        <div v-else-if="hasAlarm" class="details">
          <div class="title">
            {{ data.status.mainProgram }} {{ data.status.mainComment }}
          </div>
          <div class="subtitle">
            <div v-if="showSubtitle">
              {{ data.status.runningProgram }} {{ data.status.runningComment }}
            </div>
          </div>
          <table>
            <tr v-for="alarm in data.status.alarms" :key="alarm.number">
              <td class="alarm-number">{{ alarm.number }} -</td>
              <td>{{ alarm.message }}</td>
            </tr>
          </table>
        </div>
        <div class="details" v-else>
          <div class="title">
            {{ data.status.mainProgram }} {{ data.status.mainComment }}
          </div>
          <div class="subtitle">
            <div v-if="showSubtitle">
              {{ data.status.runningProgram }} {{ data.status.runningComment }}
            </div>
          </div>
          <div>
            Tool: <span>{{ data.status.tool }}</span>
          </div>
          <div>
            Feed Override: <span>{{ data.status.overrides.feed }}%</span>
          </div>
          <div>
            Rapid Override: <span>{{ rapidOverride }}</span>
          </div>
          <div>
            Parts Count: <span>{{ data.status.parts }}</span>
          </div>
          <div>
            Cycle: <span>{{ cycle }}</span>
          </div>
          <div>
            Last Cycle: <span>{{ lastCycle }}</span>
          </div>
          <div>
            Mode: <span>{{ mode }}</span>
          </div>
          <div>
            Execution: <span>{{ data.status.execution }}</span>
          </div>
          <div class="myProgress">
            <div class="myBar" :style="`width: ${progress}%`"></div>
          </div>
        </div>
        <div class="timer" v-if="isOnline">
          <div>{{ timer }}</div>
        </div>
      </div>
    </div>

    <div v-else class="mobile">
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
            <tr v-for="alarm in data.status.alarms" :key="alarm.number">
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { Duration } from 'luxon';
import { computed, ref, watch } from 'vue';
import offlineImg from '@/components/images/offline.png';
import type { Machine } from '@/types/machine';
import isMobile from '@/plugins/isMobile';

const props = defineProps<{
  data: Machine;
  now: Date;
}>();

const isOnline = computed(() => {
  return props.data.status.online;
});

const cycle = computed(() => {
  const seconds = Math.floor(props.data.status.cycle / 1000);
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('m:ss');
});

const lastCycle = computed(() => {
  const seconds = Math.floor(props.data.status.lastCycle / 1000);
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('m:ss');
});

const rapidOverride = computed(() => {
  const num = props.data.status.overrides.rapid;
  if (num === 0) return '100%';
  if (num === 1) return '50%';
  if (num === 2) return '25%';
  if (num === 3) return 'LOW';
  return '';
});

const hasAlarm = computed(() => {
  return props.data.status.alarms.length > 0;
});

const status = computed(() => {
  return `status-${props.data.status.execution}`;
});

const mode = computed(() => {
  if (props.data.status.mode === 'MANUAL_DATA_INPUT') return 'MDI';
  return props.data.status.mode;
});

const timer = computed(() => {
  let seconds = Math.floor(
    (props.now.valueOf() - new Date(props.data.status.lastStateTs).valueOf()) /
      1000,
  );
  if (seconds < 0) seconds = 0;
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('hh:mm:ss');
});

const progress = computed(() => {
  const value = (props.data.status.cycle / props.data.status.lastCycle) * 100;
  return Math.min(value, 100);
});

const showSubtitle = computed(() => {
  return (
    props.data.status.runningProgram &&
    props.data.status.mainProgram !== props.data.status.runningProgram
  );
});
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
  background: #7f7f7f;
}

.status-ACTIVE {
  background: #287428;
}

.status-STOPPED,
.status-INTERRUPTED,
.status-READY {
  background: #6c6c6c;
}

.alarmed {
  background: #bd0000;
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
</style>
