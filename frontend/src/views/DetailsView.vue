<template>
  <h1>{{ route.params.id }}</h1>
  <canvas id="c" width="720" height="20"></canvas>
  Alarmed {{ alarmedPercent }}% Running {{ runningPercent }}%
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import axios from '@/plugins/axios';

const route = useRoute();

let canvas: CanvasRenderingContext2D | null;
let timer: ReturnType<typeof setInterval>;

const alarmedPercent = ref(0);
const runningPercent = ref(0);

onMounted(() => {
  const c = document.getElementById('c') as HTMLCanvasElement | null;
  if (c) {
    const ctx = c.getContext('2d');
    if (ctx) canvas = ctx;
  }

  timer = setInterval(() => {
    getData();
  }, 5000);
  getData();
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function getData() {
  axios.get(`/data/${route.params.id}`).then(({ data }) => {
    paint(data);
    graph(data);
  });
}

function paint(data: any) {
  if (canvas) {
    const count = data.length;
    const width = canvas.canvas.width;
    const height = canvas.canvas.height;
    const pitch = width / count;
    canvas.clearRect(0, 0, width, height);
    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      let color = '#878787';
      if (record.online === false) color = '#424242';
      else if (record.alarmed === true) color = '#ff0000';
      else if (record.running === true) color = '#00ff00';
      canvas.fillStyle = color;
      const startX = pitch * i;
      const endX = startX + pitch;
      if (i === 0) console.log(startX, endX);
      if (i === data.length - 1) console.log(startX, endX, data.length - 1);
      canvas.fillRect(startX, 0, endX, height);
    }
  }
}

function graph(data: any) {
  const total = data.length;
  let alarmed = 0;
  let running = 0;
  for (let i = 0; i < data.length; i++) {
    const record = data[i];
    if (record.online === false) continue;
    if (record.alarmed === true) alarmed++;
    else if (record.running === true) running++;
  }
  alarmedPercent.value = Math.floor((alarmed / total) * 10000) / 100;
  runningPercent.value = Math.floor((running / total) * 10000) / 100;
}
</script>

<style scoped></style>
