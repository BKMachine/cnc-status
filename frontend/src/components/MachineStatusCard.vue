<template>
  <main>
    <div class="machine" :class="[status, {alarmed: hasAlarm, online: data.status.online, offline: !data.status.online}]">
      <div class="name"><div>{{ data.name }}</div><img class="logo" v-if="data.image" :src="data.image" alt=""></div>
      <div class="details" v-if="data.status.online">
        <div class="title">{{ data.status.mainProgram }} {{ data.status.mainComment }}</div>
        <div class="subtitle"><div v-if="showSubtitle">{{ data.status.runningProgram }} {{ data.status.runningComment }}</div></div>
        <div>
          Tool: <span>{{ data.status.tool }}</span>
        </div>
        <div>
          Feed Override: <span>{{ data.status.overrides.feed }}%</span>
        </div>
        <div>
          Rapid Override: <span>{{ rapidOverride }}</span>
        </div>
        <div>Parts Count: <span>{{ data.status.parts }}</span></div>
        <div>Cycle: <span>{{ cycle }}</span></div>
        <div>Last Cycle: <span>{{ lastCycle }}</span></div>
        <div>Mode: <span>{{ mode }}</span></div>
        <div>Execution: <span>{{ data.status.execution }}</span></div>
        <div>Alarms: <span v-if="!hasAlarm">NONE</span></div>
        <div v-for="alarm in data.status.alarms" :key="alarm.number">
          {{ alarm.number }} - {{ alarm.message }}
        </div>
        <div class="myProgress">
          <div class="myBar" :style="`width: ${progress}%`"></div>
        </div>
        <div class="timer"><div>{{ timer }}</div></div>
      </div>
      <div v-else class="offline-message"><div><img :src="offlineImg" alt=""></div></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Duration } from 'luxon';
import {computed, ref, watch} from 'vue';
import offlineImg from '@/components/images/offline.png'

const props = defineProps<{
  data: Machine;
  now: Date;
}>();

const cycleMs = computed(() => {
  return props.data.status.cycle
})

const cycle = computed(() => {
  const seconds = Math.floor(cycleMs.value / 1000);
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('m:ss');
})

const last = ref(500000)

watch(cycleMs, (current, old) => {
  if (current < old) {
    last.value = old
  }
})

const lastCycle = computed(() => {
  const seconds = Math.floor(last.value / 1000);
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('m:ss');
})

const rapidOverride = computed(() => {
  const num = props.data.status.overrides.rapid
  if (num === 0) return '100%'
  if (num === 1) return '50%'
  if (num === 2) return '25%'
  if (num === 3) return 'LOW'
})

const hasAlarm = computed(() => {
  return props.data.status.alarms.length > 0
})

const status = computed(() => {
  return `status-${props.data.status.execution}`
})

const mode = computed(() => {
  if (props.data.status.mode === 'MANUAL_DATA_INPUT') return 'MDI'
  return props.data.status.mode
})

const execution = computed(() => {
  return props.data.status.execution
})

const time = ref(new Date())

watch(execution, (currentValue, oldValue) => {
  time.value = new Date()
})

const timer = computed(() => {
  let seconds = Math.floor(
    (props.now.valueOf() - time.value.valueOf()) / 1000,
  );
  if (seconds < 0) seconds = 0;
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('hh:mm:ss');
});

const progress = computed(() => {
  const value = cycleMs.value / last.value * 100
  return Math.min(value, 100)
})

const showSubtitle = computed(() => {
  return props.data.status.mainProgram !== props.data.status.runningProgram
})
</script>

<style scoped>
.machine {
  width: 250px;
  height: 370px;
  color: #ffffff;
  padding: 10px;
  border-radius: 10px;
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
  font-size: 18px;
  font-weight: bold;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px !important;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  height: 25px;
}

.timer {
  font-size: 20px !important;
  display: flex;
  justify-content: center;
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
</style>
