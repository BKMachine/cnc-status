<template>
  <main>
    <div class="machine" :class="{ online: data.status.online }">
      <div class="name">{{ data.name }} <span><img class="icon" v-if="data.image" :src="data.image" alt=""></span></div>
      <div class="title">{{ data.status.program }} {{ data.status.comment }}</div>
      <div>
        Tool: <span>{{ data.status.tool }}</span>
      </div>
      <div>
        Feed Override: <span>{{ data.status.overrides.feed }}</span>
      </div>
      <div>
        Rapid Override: <span>{{ data.status.overrides.rapid }}</span>
      </div>
      <div>Parts Count: <span>{{ data.status.parts }}</span></div>
      <div>Last Cycle: <span>{{ cycle }}</span></div>
      <div>Alarms: <span>{{ data.status.alarms }}</span></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Duration } from 'luxon';
import { computed, ref } from 'vue';

const props = defineProps<{
  data: Machine;
  now: Date;
}>();

// const time = ref(new Date(props.data.status.time))

const timer = computed(() => {
  let seconds = Math.floor(
    (props.now.valueOf() - new Date(props.data.status.time).valueOf()) / 1000,
  );
  if (seconds < 0) seconds = 0;
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('hh:mm:ss');
});

const feedrate = computed(() => {
  return (props.data.status.feedrate * 39.37).toFixed(2);
});

const cycle = computed(() => {
  const seconds = Math.floor(props.data.status.cycle / 1000);
  const dur = Duration.fromObject({ seconds });
  return dur.toFormat('mm:ss');
})
</script>

<style scoped>
.machine {
  width: 250px;
  height: 400px;
  color: #ffffff;
  padding: 10px;
  border-radius: 20px;
  background: #282828;
}

.machine > div {
  width: 100%;
}

.machine > div > span {
  position: absolute;
  right: 0;
  color: #ffffff;
}
.name {
  font-size: 30px;
}

.online {
  background: #7f7f7f;
}

.status-UNAVAILABLE {
  background: #535353;
}

.status-ACTIVE {
  background: #287428;
}

.status-STOPPED,
.status-INTERRUPTED,
.status-READY {
  background: #d2d22a;
}

.status-0 {
  background: gray;
}

.status-3 {
  background: #bd0000;
}

.icon {
  height: 50px;
}

.title {
  font-size: 18px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 10px;
}
</style>
